# Link Shortener - Backend Server

This directory contains the Node.js/Express backend API for the Link Shortener application. It handles:

*   Creating short URL codes for long original URLs.
*   Storing URL mappings in a PostgreSQL database using Drizzle ORM.
*   Redirecting users from short URLs to their original destinations.
*   Tracking the number of clicks for each short URL.
*   Providing an API for the frontend to interact with.

## Tech Stack

*   **Runtime:** Node.js
*   **Language:** TypeScript
*   **Framework:** Express.js
*   **Database:** PostgreSQL
*   **ORM:** Drizzle ORM
*   **Database Driver:** node-postgres (`pg`)
*   **Migrations:** Drizzle Kit
*   **TS Execution:** tsx (for development)

## Project Structure :
server/
├── drizzle/ # Generated Drizzle migration files
├── scripts/ # Utility scripts (e.g., seed.ts, migrate.js - if added)
├── src/ # Source code
│ ├── controllers/ # Request handlers (logic for routes)
│ ├── db/ # Database related files (schema, client, services)
│ │ ├── schema.ts # Drizzle schema definition
│ │ ├── index.ts # Drizzle client initialization
│ │ └── url.service.ts # Database interaction logic (using Drizzle)
│ ├── routers/ # Express router definitions
│ │ ├── url.routers.ts # API routes (/api/urls)
│ │ └── redirect.routes.ts # Redirect routes (/s/:shortCode)
│ └── index.ts # Server entry point (Express setup, middleware, routes)
├── .env # Local environment variables (GITIGNORED!)
├── .env.example # Example environment variables
├── .gitignore # Git ignore rules
├── drizzle.config.ts # Drizzle Kit configuration
├── package.json # Project dependencies and scripts
├── tsconfig.json # TypeScript configuration
└── pnpm-lock.yaml # Exact dependency versions (if using pnpm at server level)

## Setup and Running

Follow these steps to get the backend server running locally:

**Prerequisites:**

*   **Node.js:** LTS version recommended (e.g., v18, v20).
*   **pnpm:** Package manager used for this project (`npm install -g pnpm`).
*   **PostgreSQL:** A running PostgreSQL instance (local, Docker, or remote).

**Steps:**

1.  **Install Dependencies:**
    Navigate to the **root** of the monorepo (`link-shortener/`) in your terminal and run:
    ```bash
    pnpm install
    ```
    This installs dependencies for all workspaces, including the server. If you are only running the server independently, navigate into the `server/` directory and run `pnpm install`.

2.  **Create Database:**
    Ensure you have a PostgreSQL database created. You can use a GUI tool like pgAdmin or the `psql` command-line interface:
    ```sql
    -- Example using psql
    CREATE DATABASE link_shortener;
    ```
    Make sure you have a database user with privileges to create tables and modify data within this database.

3.  **Configure Environment Variables:**
    *   Navigate into the `server/` directory.
    *   Make a copy of the example environment file:
        ```bash
        cp .env.example .env
        ```
    *   **Edit the `.env` file:** Fill in the required database credentials (`DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`) or provide a full `DATABASE_URL`. Also, verify `PORT` and `FRONTEND_URL` are correct for your setup. See `.env.example` for details on each variable.

4.  **Generate Database Migrations:**
    This step analyzes your Drizzle schema (`src/db/schema.ts`) and generates SQL migration files based on any changes detected since the last generation.
    *   Ensure you are in the `server/` directory.
    *   Run the following command:
        ```bash
        npx drizzle-kit generate --config=drizzle.config.ts
        ```
        *(Or use the package.json script: `pnpm db:generate` if you configured it with the `--config` flag)*.
        This will create files in the `drizzle/` directory.

5.  **Apply Database Migrations:**
    This step executes the pending SQL migration files against your configured database, updating its schema (e.g., creating tables, adding columns).
    *   Ensure you are in the `server/` directory.
    *   Run the following command:
        ```bash
        npx drizzle-kit migrate --config=drizzle.config.ts
        ```
        *(Or use the package.json script: `pnpm db:migrate` if you configured it with the `--config` flag and potentially a custom migration script)*.
    *   **Note:** For initial development or simple schema syncs *without* versioned migrations, you might use `npx drizzle-kit push:pg --config=drizzle.config.ts` (or `pnpm db:push`) instead of steps 4 & 5. However, `generate` + `migrate` is recommended for controlled schema evolution.

6.  **Run the Development Server:**
    This command uses `tsx` to compile and run your TypeScript code directly, watching for file changes and restarting the server automatically.
    *   Ensure you are in the `server/` directory.
    *   Run:
        ```bash
        # Using tsx directly
        npx tsx watch src/index.ts
        ```
    You should see output indicating the server is running, typically on port 4000 (or the port specified in your `.env`).

## API Endpoints

*   **`POST /api/urls`**: Creates a new short URL.
    *   Body: `{ "originalUrl": "string", "customCode"?: "string" }`
    *   Response: The created URL record (JSON).
*   **`GET /api/urls`**: Retrieves a list of all created short URLs.
    *   Response: `{ "urls": [...] }` (Array of URL records).
*   **`GET /s/:shortCode`**: Redirects to the original URL associated with the `shortCode` and increments the click count.

## Environment Variables

The following environment variables are used (configure in `.env`):

*   `DB_HOST`: Hostname of the PostgreSQL server.
*   `DB_PORT`: Port of the PostgreSQL server.
*   `DB_NAME`: Name of the database.
*   `DB_USER`: Username for database connection.
*   `DB_PASSWORD`: Password for database connection.
*   `DATABASE_URL` (Optional): Full PostgreSQL connection string (overrides individual `DB_*` vars).
*   `DB_SSL` (Optional): Set to `"true"` to enable SSL for database connection.
*   `NODE_ENV`: Set to `development` or `production`. Affects logging.
*   `PORT`: Port the Express server listens on (default: 4000).
*   `FRONTEND_URL`: Origin URL of the frontend application (for CORS).

## Drizzle ORM

*   **Schema:** Defined in `src/db/schema.ts`.
*   **Client:** Initialized in `src/db/index.ts`.
*   **Queries:** Implemented in `src/db/url.service.ts`.
*   **Migrations:** Managed using `drizzle-kit` via commands in `package.json` (`db:generate`, `db:migrate`/`db:push`).
*   **Configuration:** `drizzle.config.ts`.