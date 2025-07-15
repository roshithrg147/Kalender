# Kalendero App

A modern, full-stack calendar and scheduling application built with Next.js, Drizzle ORM, Clerk authentication, and Neon/Postgres. Kalendero helps users create, manage, and book events and meetings with ease.

## Features

- User authentication and management (Clerk)
- Create, edit, and delete events
- Book meetings with real-time availability
- Google Calendar integration
- Customizable event durations and descriptions
- Responsive, accessible UI
- PostgreSQL database (Neon)
- Secure server actions and validation (Zod)

## Tech Stack

- **Frontend:** Next.js (App Router), React, Tailwind CSS
- **Backend:** Next.js API routes, Drizzle ORM
- **Database:** PostgreSQL (Neon)
- **Authentication:** Clerk
- **Validation:** Zod
- **Calendar Integration:** Google Calendar API

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- Yarn or npm
- PostgreSQL database (Neon recommended)
- Clerk account (for authentication)
- Google Cloud project (for Calendar API)

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/kalendero-app.git
   cd kalendero-app
   ```

2. **Install dependencies:**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Configure environment variables:**
   Create a `.env` file in the root directory and add:

   ```env
   DATABASE_URL=your_postgres_connection_string
   CLERK_SECRET_KEY=your_clerk_secret_key
   CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   ```

   Replace the values with your actual credentials.

4. **Run database migrations:**

   ```bash
   npx drizzle-kit push:pg
   ```

5. **Start the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```
   The app will be available at [http://localhost:3000](http://localhost:3000).

## Usage

- Register or log in with Clerk
- Create and manage your events
- Share event links for others to book meetings
- Integrate with Google Calendar for automatic scheduling

## Project Structure

- `app/` — Next.js app directory (pages, layouts, API routes)
- `components/` — Reusable UI components
- `drizzle/` — Database schema and Drizzle config
- `server/actions/` — Server actions for events, schedules, meetings
- `public/` — Static assets

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your changes
4. Push to your fork and open a pull request

## License

This project is licensed under the MIT License.

## Privacy Policy

View our Privacy Policy at: [https://yourdomain.com/privacy-policy](https://yourdomain.com/privacy-policy)

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [Clerk](https://clerk.com/)
- [Neon](https://neon.tech/)
- [Google Calendar API](https://developers.google.com/calendar)
