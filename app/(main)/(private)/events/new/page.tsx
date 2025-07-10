// This code defines a React component called `NewEventPage`,
// which renders a page for creating a new event. It uses a card layout to display a centered form on
// the screen. The card includes a header with the title "New Event" and a content section that contains
// the `EventForm` component, which likely handles the user input and submission logic for creating a new calendar event.
// The layout is styled using utility classes to make it visually appealing and responsive, ensuring a clean and focused user interface for event creation.

import EventForm from "@/components/forms/EventForm";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function NewEventPage() {
  return (
    <Card className="max-w-md mx-auto border-8 border-blue-200 shadow-2xl shadow-accent-foreground">
      <CardHeader>
        <CardTitle>New Event</CardTitle>
          </CardHeader>
           <CardContent>
            <EventForm />
          </CardContent>
    </Card>
  );
}
