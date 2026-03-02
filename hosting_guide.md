# Hosting Spammer Pay Back on Vercel with Neon Database

This guide will walk you through the process of hosting your application on Vercel using Neon as your PostgreSQL database.

## 1. Neon Database Setup
1.  Go to [Neon.tech](https://neon.tech) and create a free account.
2.  Create a new project (e.g., "spammer-payback").
3.  In the Neon dashboard, find your **Connection String**. It should look like this:
    `postgresql://alex:AbC123dEf@ep-cool-darkness-123456.us-east-2.aws.neon.tech/neondb?sslmode=require`
4.  Copy this string; this is your `DATABASE_URL`.

## 2. Initialize Database Schema
To set up the tables in your new Neon database:
1.  Download the project files from Replit.
2.  Open your terminal in the project folder.
3.  Run the following command (replace the URL with your actual Neon connection string):
    ```bash
    DATABASE_URL="your_neon_connection_string" npx drizzle-kit push
    ```
    *Alternatively, you can use the SQL script provided in `neon_setup.sql` in the project root.*

## 3. GitHub Setup
1.  Create a new private repository on [GitHub](https://github.com).
2.  Initialize git in your local project folder:
    ```bash
    git init
    git add .
    git commit -m "Initial commit"
    git remote add origin https://github.com/yourusername/your-repo-name.git
    git push -u origin main
    ```

## 4. Vercel Deployment
1.  Go to [Vercel.com](https://vercel.com) and sign in with GitHub.
2.  Click **Add New...** > **Project**.
3.  Import your GitHub repository.
4.  In the **Environment Variables** section, add:
    *   `DATABASE_URL`: Your Neon connection string.
    *   `SESSION_SECRET`: A random long string (e.g., `your-secret-key-123`).
5.  Click **Deploy**.

## 5. Usage
Once deployed, Vercel will provide you with a production URL. Your application is now live and using Neon for persistent storage!
