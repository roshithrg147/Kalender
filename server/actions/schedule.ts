"use server";

import { fromZonedTime } from "date-fns-tz";
import { DAYS_OF_WEEK_IN_ORDER } from "@/constants";
import { db } from "@/drizzle/db";
import { ScheduleAvailabilityTable, ScheduleTable } from "@/drizzle/schema";
import { scheduleFormSchema } from "@/schema/schedule";
import { auth } from "@clerk/nextjs/server";
import {
  addMinutes,
  areIntervalsOverlapping,
  isFriday,
  isMonday,
  isSaturday,
  isSunday,
  isThursday,
  isTuesday,
  isWednesday,
  isWithinInterval,
  setHours,
  setMinutes,
} from "date-fns";
import { eq } from "drizzle-orm";
import { BatchItem } from "drizzle-orm/batch";
import { revalidatePath } from "next/cache";
import z from "zod";
import { _success } from "zod/v4/core";
import { getCalenderEventTimes } from "../google/googleCalender";

type ScheduleRow = typeof ScheduleTable.$inferSelect;
type AvailabilityRow = typeof ScheduleAvailabilityTable.$inferSelect;

export type FullSchedule = ScheduleRow & {
  availabilities: AvailabilityRow[];
};

export async function getSchedule(
  userId: string
): Promise<FullSchedule | null> {
  const schedule = await db.query.ScheduleTable.findFirst({
    where: ({ clerkUserId }, { eq }) => eq(clerkUserId, userId),
    with: { availabilities: true },
  });
  return schedule as FullSchedule | null;
}

export async function saveSchedule(
  unsafeData: z.infer<typeof scheduleFormSchema>
) {
  try {
    const { userId } = await auth();
    const { success, data } = scheduleFormSchema.safeParse(unsafeData);
    if (!success || !userId) {
      throw new Error("Invalid schedule data or user not authenticated.");
    }
    const { availabilities, ...scheduleData } = data;
    const [{ id: scheduleId }] = await db
      .insert(ScheduleTable)
      .values({ ...scheduleData, clerkUserId: userId })
      .onConflictDoUpdate({
        target: ScheduleTable.clerkUserId,
        set: scheduleData,
      })
      .returning({ id: ScheduleTable.id });
    const statements: [BatchItem<"pg">] = [
      db
        .delete(ScheduleAvailabilityTable)
        .where(eq(ScheduleAvailabilityTable.scheduleId, scheduleId)),
    ];
    if (availabilities.length > 0) {
      statements.push(
        db.insert(ScheduleAvailabilityTable).values(
          availabilities.map((availability) => ({
            ...availability,
            scheduleId,
          }))
        )
      );
    }
    await db.batch(statements);
  } catch (error: any) {
    throw new Error(`Failed to save schedule: ${error.message || error}`);
  } finally {
    revalidatePath("/schedule");
  }
}

export async function getValidTimesFromSchedule(
  timesInOrder: Date[],
  event: { clerkUserId: string; durationInMinutes: number } // Event-specific data
): Promise<Date[]> {
  const { clerkUserId: userId, durationInMinutes } = event;

  // Define the start and end of the overall range to check
  const start = timesInOrder[0];
  const end = timesInOrder.at(-1);

  // If start or end is missing, there are no times to check
  if (!start || !end) return [];

  // Fetch the user's saved schedule along with their availabilities
  const schedule = await getSchedule(userId);

  // If no schedule is found, return an empty list (user has no availabilities)
  if (schedule == null) return [];

  // Group availabilities by day of the week (e.g., Monday, Tuesday)
  const groupedAvailabilities = Object.groupBy(
    schedule.availabilities,
    (a) => a.dayOfWeek
  );

  // Fetch all existing Google Calendar events between start and end
  const eventTimes = await getCalenderEventTimes(userId, {
    start,
    end,
  });

  // Filter and return only valid time slots based on availability and conflicts
  return timesInOrder.filter((intervalDate) => {
    // Get the user's availabilities for the specific day, adjusted to their timezone
    const availabilities = getAvailabilities(
      groupedAvailabilities,
      intervalDate,
      schedule.timezone
    );

    // Define the time range for a potential event starting at this interval
    const eventInterval = {
      start: intervalDate, // Proposed start time
      end: addMinutes(intervalDate, durationInMinutes), // Proposed end time (start + duration)
    };

    // Keep only the time slots that satisfy two conditions:
    return (
      // 1. This time slot does not overlap with any existing calendar events
      eventTimes.every((eventTime) => {
        return !areIntervalsOverlapping(eventTime, eventInterval);
      }) &&
      // 2. The entire proposed event fits within at least one availability window
      availabilities.some((availability) => {
        return (
          isWithinInterval(eventInterval.start, availability) && // Start is inside availability
          isWithinInterval(eventInterval.end, availability) // End is inside availability
        );
      })
    );
  });

  function getAvailabilities(
    groupedAvailabilities: Partial<
      Record<
        (typeof DAYS_OF_WEEK_IN_ORDER)[number],
        (typeof ScheduleAvailabilityTable.$inferSelect)[]
      >
    >,
    date: Date,
    timezone: string
  ): { start: Date; end: Date }[] {
    const dayOfWeek = (() => {
      if (isMonday(date)) return "monday";
      if (isTuesday(date)) return "tuesday";
      if (isWednesday(date)) return "wednesday";
      if (isThursday(date)) return "thursday";
      if (isFriday(date)) return "friday";
      if (isSaturday(date)) return "saturday";
      if (isSunday(date)) return "sunday";
      return null;
    })();

    if (!dayOfWeek) return [];
    const dayAvailabilities = groupedAvailabilities[dayOfWeek];

    if (!dayAvailabilities) return [];

    return dayAvailabilities.map(({ startTime, endTime }) => {
      const [startHour, startMinute] = startTime.split(":").map(Number);
      const [endHour, endMinute] = endTime.split(":").map(Number);

      // Build a date string in the user's timezone, then convert to UTC
      const base = new Date(date);
      const year = base.getUTCFullYear();
      const month = base.getUTCMonth();
      const day = base.getUTCDate();

      const start = fromZonedTime(
        setMinutes(setHours(date, startHour), startMinute),
        timezone
      );

      const end = fromZonedTime(
        setMinutes(setHours(date, endHour), endMinute),
        timezone
      );
      return { start, end };
    });
  }
}
