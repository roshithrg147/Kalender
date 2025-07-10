"use server";

import { clerkClient } from "@clerk/nextjs/server";
import { addMinutes, endOfDay, startOfDay } from "date-fns";
import { calendar_v3, google } from "googleapis";

async function getOAuthClient(clerkUserId: string) {
  try {
    const client = await clerkClient();
    const { data } = await client.users.getUserOauthAccessToken(
      clerkUserId,
      "google"
    );

    if (data.length === 0 || !data[0].token) {
      throw new Error("No Oauth data or token found for the user.");
    }

    const oAuthClient = new google.auth.OAuth2(
      process.env.GOOGLE_OAUTH_CLIENT_ID,
      process.env.GOOGLE_OAUTH_CLIENT_SECRET,
      process.env.GOOGLE_OAUTH_REDIRECT_URL
    );
    oAuthClient.setCredentials({ access_token: data[0].token });

    return oAuthClient;
  } catch (error: any) {
    throw new Error(`Failed to get OAuth client: ${error.message}`);
  }
}

export async function getCalenderEventTimes(
  clerkUserId: string,
  { start, end }: { start: Date; end: Date }
): Promise<{ start: Date; end: Date }[]> {
  try {
    const oAuthClient = await getOAuthClient(clerkUserId);

    if (!oAuthClient) {
      throw new Error("OAuth client could not be obtained.");
    }

    const events = await google.calendar("v3").events.list({
      calendarId: "primary",
      eventTypes: ["default"],
      singleEvents: true,
      timeMin: start.toISOString(),
      timeMax: end.toISOString(),
      maxResults: 2500,
      auth: oAuthClient,
    });

    return (
      events.data.items
        ?.map((event) => {
          if (event.start?.date && event.end?.date) {
            return {
              start: startOfDay(new Date(event.start.date)),
              end: endOfDay(new Date(event.end.date)),
            };
          }
          if (event.start?.dateTime && event.end?.dateTime) {
            return {
              start: new Date(event.start.dateTime),
              end: new Date(event.end.dateTime),
            };
          }
          return undefined;
        })
        .filter(
          (date): date is { start: Date; end: Date } => date !== undefined
        ) || []
    );
  } catch (error: any) {
    throw new Error(
      `Failed to fetch calendar events: ${error.message || error}`
    );
  }
}

export async function createCalendarEvent({
  clerkUserId,
  guestName,
  guestEmail,
  startTime,
  guestNotes,
  durationInMinutes,
  eventName,
}: {
  clerkUserId: string; // The unique ID of the Clerk user.
  guestName: string; // The name of the guest attending the event.
  guestEmail: string; // The email address of the guest.
  startTime: Date; // The start time of the event.
  guestNotes?: string | null; // Optional notes for the guest (can be null or undefined).
  durationInMinutes: number; // The duration of the event in minutes.
  eventName: string; // The name or title of the event.
}): Promise<calendar_v3.Schema$Event> {
  // Specify the return type as `Event`, which represents the created calendar event.

  try {
    // Get OAuth client and user information for Google Calendar integration.
    const oAuthClient = await getOAuthClient(clerkUserId);
    if (!oAuthClient) {
      throw new Error("OAuth client could not be obtained."); // Error handling if OAuth client is not available.
    }

    const client = await clerkClient(); // Retrieve the Clerk client instance.
    const calendarUser = await client.users.getUser(clerkUserId); // Get the user details from Clerk.

    // Get the user's primary email address from their profile.
    const primaryEmail = calendarUser.emailAddresses.find(
      ({ id }) => id === calendarUser.primaryEmailAddressId // Find the primary email using the ID.
    );

    if (!primaryEmail) {
      throw new Error("Clerk user has no email"); // Throw an error if no primary email is found.
    }

    // Create the Google Calendar event using the Google API client.
    const calendarEvent = await google.calendar("v3").events.insert({
      calendarId: "primary", // Use the primary calendar of the user.
      auth: oAuthClient, // Authentication using the OAuth client obtained earlier.
      sendUpdates: "all", // Send email notifications to all attendees of the event.
      requestBody: {
        attendees: [
          { email: guestEmail, displayName: guestName }, // Add the guest to the attendees list.
          {
            email: primaryEmail.emailAddress, // Add the user themselves as an attendee.
            displayName: `${calendarUser.firstName} ${calendarUser.lastName}`, // Display name for the user.
            responseStatus: "accepted", // Mark the user's attendance as accepted.
          },
        ],
        description: guestNotes
          ? `Additional Details: ${guestNotes}`
          : "No additional details.", // Add description if guest notes are provided.
        start: {
          dateTime: startTime.toISOString(), // Start time of the event.
        },
        end: {
          dateTime: addMinutes(startTime, durationInMinutes).toISOString(), // Calculate the end time based on the duration.
        },
        summary: `${guestName} + ${calendarUser.firstName} ${calendarUser.lastName}: ${eventName}`, // Title of the event, including the guest and user names.
      },
    });

    return calendarEvent.data; // Return the event data that includes the details of the newly created calendar event.
  } catch (error: any) {
    // Catch and handle any errors that occur during the process.
    console.error("Error creating calendar event:", error.message || error); // Log the error to the console.
    throw new Error(
      `Failed to create calendar event: ${error.message || error}`
    ); // Throw a new error with a detailed message.
  }
}
