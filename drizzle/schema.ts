import {
  boolean,
  index,
  integer,
  // numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  // varchar,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { DAYS_OF_WEEK_IN_ORDER } from "@/constants";

const createdAt = timestamp("createdAt").notNull().defaultNow();
const updatedAt = timestamp("updatedAt")
  .notNull()
  .defaultNow()
  .$onUpdate(() => new Date());

export const EventTable = pgTable(
  "events",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    description: text("description"),
    durationInMinutes: integer("durationInMinutes").notNull(),
    clerkUserId: text("clerkUserId").notNull(),
    isActive: boolean("isActive").notNull().default(true),
    createdAt,
    updatedAt,
  },
  (table) => [index("clerkUserIdIndex").on(table.clerkUserId)]
);

export const ScheduleTable = pgTable("schedules", {
  id: uuid("id").primaryKey().defaultRandom(),
  timezone: text("timezone").notNull(),
  clerkUserId: text("clerkUserId").notNull().unique(),
  createdAt,
  updatedAt,
});

export const scheduleRelations = relations(ScheduleTable, ({ many }) => ({
  availabilities: many(ScheduleAvailabilityTable), // one-to-many relationship
}));

export const scheduleDayOfWeekEnum = pgEnum("day", DAYS_OF_WEEK_IN_ORDER);

export const ScheduleAvailabilityTable = pgTable(
  "scheduleAvailabilities",
  {
    id: uuid("id").primaryKey().defaultRandom(), // unique ID
    scheduleId: uuid("scheduleId") // foreign key to the Schedule table
      .notNull()
      .references(() => ScheduleTable.id, { onDelete: "cascade" }),
    startTime: text("startTime").notNull(),
    endTime: text("endTime").notNull(),
    dayOfWeek: scheduleDayOfWeekEnum("dayOfWeek").notNull(), // day of the week (ENUM)
  },
  (table) => [
    index("scheduleIdIndex").on(table.scheduleId), // index on foreign key for faster lookups
  ]
);

export const ScheduleAvailabilityRelations = relations(
  ScheduleAvailabilityTable,
  ({ one }) => ({
    schedule: one(ScheduleTable, {
      fields: [ScheduleAvailabilityTable.scheduleId], // local key
      references: [ScheduleTable.id], // foreign key
    }),
  })
);

// export const users = pgTable("users", {
//   id: varchar("id").primaryKey().notNull(),
//   username: varchar("username"),
//   // ... other fields
//   piUid: text("pi_uid").unique(),
//   piAccessToken: text("pi_access_token"),
//   // ... other fields
// });

// export const payments = pgTable("payments", {
//   id: varchar("id").primaryKey(),
//   piPaymentId: text("pi_payment_id").unique(),
//   amount: numeric("amount"),
//   status: text("status").$type<"pending" | "completed" | "cancelled">(),
//   txid: text("txid"),
//   createdAt: timestamp("created_at").defaultNow(),
//   completedAt: timestamp("completed_at"),
//   // ... other fields
// });

export const piUsers = pgTable("pi_users", {
  uid: text("uid").primaryKey(),
  username: text("username"),
  createdAt: timestamp("created_at").defaultNow(),
});
