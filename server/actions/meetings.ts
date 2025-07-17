"use server";

import { db } from "@/drizzle/db";
import { meetingActionSchema } from "@/schema/meetings";
import { fromZonedTime } from "date-fns-tz";
import { getValidTimesFromSchedule } from "./schedule";
import { createCalendarEvent } from "../google/googleCalender";
import z from "zod";

export async function createMeeting(
  unsafeData: z.infer<typeof meetingActionSchema>
) {
  try {
    const { success, data } = meetingActionSchema.safeParse(unsafeData);

    if (!success) {
      console.error("Meeting validation failed", unsafeData);
      throw new Error("Invalid data.");
    }

    const event = await db.query.EventTable.findFirst({
      where: ({ clerkUserId, isActive, id }, { eq, and }) =>
        and(
          eq(isActive, true),
          eq(clerkUserId, data.clerkUserId),
          eq(id, data.eventId)
        ),
    });

    if (!event) {
      console.error("Event not found for:", {
        clerkUserId: data.clerkUserId,
        eventId: data.eventId,
      });
      throw new Error("Error not found.");
    }

    const startInTimezone = fromZonedTime(data.startTime, data.timezone);
    // console.log(
    //   "Requested start time:",
    //   data.startTime,
    //   "Timezone:",
    //   data.timezone,
    //   "Converted:",
    //   startInTimezone
    // );
    // console.log("Event:", event);
    const validTimes = await getValidTimesFromSchedule(
      [startInTimezone],
      event
    );
    // console.log("Valid times for booking:", validTimes);

    if (validTimes.length === 0) {
      console.error("No valid times for booking. Input:", {
        startInTimezone,
        event,
      });
      throw new Error("Select time is not valid.");
    }

    await createCalendarEvent({
      ...data,
      startTime: startInTimezone,
      durationInMinutes: event.durationInMinutes,
      eventName: event.name,
    });
    return {
      clerkUserId: data.clerkUserId,
      eventId: data.eventId,
      startTime: data.startTime,
    };
  } catch (error: any) {
    // console.error(`Error creating meeting: ${error.message || error}`);
    throw new Error(`Failed to create meeting: ${error.message || error}`);
  }
}
