# SpeakUp 🎙️

### Think. Speak. Convince.

**SpeakUp** is a public speaking practice platform designed to help you think on your feet, improve articulation, build confidence, and become a better communicator.

🌐 **Live Website:** https://speakup.cool

## ✨ Features

- **Multiple Speaking Modes:** Practice impromptu speaking, debates, persuasion, and deep research.
- **Random Topic Generator:** Discover new topics across different categories.
- **Customizable Timer:** Configure speaking and research durations.
- **Daily Streaks:** Build consistency and track your speaking habits.
- **Personal Statistics:** Track total sessions, speaking time, and practice history.
- **Leaderboard:** Compare streaks with other users.
- **Authentication:** Secure user authentication powered by Supabase.
- **Responsive UI:** Minimal dark interface with interactive components and smooth transitions.

## 🛠️ Tech Stack

- **Frontend:** Next.js, React, TypeScript, Tailwind CSS
- **Backend:** Next.js Server Components and Route Handlers
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** Supabase Auth
- **Deployment:** Vercel
- **Monitoring:** Vercel Analytics and Speed Insights

## 🏗️ Architecture

SpeakUp uses Next.js for server-side rendering and application logic. Prisma handles database operations, PostgreSQL stores user and practice data, and Supabase manages authentication.

Server Components retrieve data directly from the database, while Client Components power interactive features such as timers, topic selection, and settings.

## 🚀 Getting Started

### Prerequisites

- Node.js and npm
- A Supabase project
- A PostgreSQL database

### Installation

1. Clone the repository:

   `git clone <YOUR_REPOSITORY_URL>`

2. Navigate to the project directory:

   `cd speakup`

3. Install dependencies:

   `npm install`

4. Create a `.env` file and configure the environment variables required by your Prisma and Supabase setup.

5. Generate Prisma Client:

   `npx prisma generate`

6. Apply existing database migrations:

   `npx prisma migrate deploy`

7. Start the development server:

   `npm run dev`

8. Open http://localhost:3000 in your browser.

**Note:** Never commit your `.env` file or expose database credentials and secret keys.

## 🎯 Vision

SpeakUp aims to make communication practice engaging and accessible through timed speaking exercises, debates, persuasive challenges, and consistent progress tracking.

The goal is simple: **Think clearly. Speak confidently. Convince effectively.**

## 👨‍💻 Author

**Rhythm Doshi**

- Portfolio: https://rhythmdoshi.xyz
- Website: https://speakup.cool