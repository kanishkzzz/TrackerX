# TaskNest backend and deployment learning roadmap

Keep this roadmap for the next implementation sessions. Work through it step by step and explain the decisions while building, using AI as a mentor and learning tool.

## 1. Run Postgres locally

- Install Docker Desktop and run a PostgreSQL container locally.
- Connect the Next.js app to the local database with a local-only `DATABASE_URL`.
- Practice the app's database operations locally before relying on a hosted database.
- Keep credentials in environment files and never commit real secrets.

## 2. Learn and complete the Drizzle and Zod flow

- Drizzle is already present: the app has a Drizzle schema, repositories, and a Neon HTTP database client. Review and understand these before changing them.
- Add Zod for request validation; it is not currently listed as a dependency.
- Validate sign-up, sign-in, and task request bodies with shared schemas before calling repositories.
- Understand how schema changes, Drizzle migrations, and database updates fit together. Keep local development safe and repeatable.

## 3. Learn form management when building auth screens

- Build sign-up and sign-in forms with React Hook Form, as discussed.
- Use Zod schemas for client-side form validation and keep server-side validation authoritative too.
- Learn how form state relates to the app's broader frontend state management before adding a state library.

## 4. Move from local to hosted deployment

- After local database operations are understood, connect to a cloud database and deploy the Next.js app to Cloudflare Workers.
- Learn the account setup, Worker creation, environment variables/secrets, build compatibility, and deployment flow one step at a time.
- Verify database connectivity and the auth/task API routes after deployment.

## Current status

- Drizzle ORM, Drizzle Kit, a database schema, repositories, and a Neon Postgres connection are already in the project.
- Zod and React Hook Form are not currently installed.
- The app currently uses Neon for Postgres; local Docker Postgres and Cloudflare deployment are future learning steps.
