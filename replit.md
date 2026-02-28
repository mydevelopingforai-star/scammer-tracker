# Spammer Pay Back

A professional honeypot application designed to capture details from scammers.

## Deployment to Vercel with Neon

To host this on Vercel with a Neon database:
1. **Extract**: Download and extract the `project.tar.gz` file.
2. **Push to GitHub**: Upload the extracted files to a new GitHub repository.
3. **Neon Setup**: Create a new project on [Neon.tech](https://neon.tech), and get your `DATABASE_URL`.
4. **Vercel Import**: Import the repo to Vercel.
5. **Environment Variables**: In Vercel, add `DATABASE_URL` with your Neon connection string.
6. **Database Push**: You may need to run `npx drizzle-kit push` locally pointing to your Neon DB once to set up the schema.

## Tech Stack
- Frontend: React, Tailwind, Framer Motion
- Backend: Express, Node.js
- Database: PostgreSQL (Drizzle ORM)
