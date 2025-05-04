# Link Shortener - Frontend Client (React)

This directory contains the React frontend application for the Link Shortener. It provides the user interface for interacting with the backend API.

## Core Features

*   **URL Shortening Form:** Allows users to input a long URL and submit it to the backend for shortening.
*   **Link List Display:** Shows the list of URLs fetched from the backend, including original URL, short code, and click count.
*   **Copy Functionality:** Provides a button to easily copy the generated short URL to the clipboard.
*   **Theme Toggle:** Allows users to switch between light and dark modes.
*   **Loading & Error States:** Displays appropriate UI feedback while data is loading or if API calls fail.
*   **Animations:** Uses Framer Motion for subtle UI animations.

## Tech Stack

*   **Framework/Library:** React
*   **Language:** TypeScript
*   **Bundler/Dev Server:** Vite
*   **UI Library:** Shadcn UI (built on Radix UI & Tailwind CSS)
*   **Styling:** Tailwind CSS
*   **State Management (Server):** React Query (@tanstack/react-query)
*   **Form Handling:** React Hook Form & Zod (for validation)
*   **API Client:** Axios
*   **Animation:** Framer Motion

## Project Structure (Simplified)
```
client/ (or web/)
├── public/ # Static assets (e.g., favicons)
├── src/ # Main source code directory
│ ├── components/ # Reusable UI components (UrlList, UrlShortenerForm, ThemeToggle, ui/)
│ ├── lib/ # Utility functions, API hooks (api.ts, utils.ts)
│ ├── App.tsx # Main application component (layout, routing if added)
│ ├── Home.tsx # Main page component content
│ ├── main.tsx # Application entry point (React DOM rendering, ThemeProvider)
│ └── globals.css # Global styles, Tailwind directives, CSS variables
│
├── .env # Local environment variables (GITIGNORED!)
├── .env.example # Example environment variables
├── .gitignore # Specifies intentionally untracked files for Git
├── index.html # Main HTML entry point for Vite
├── package.json # Node.js project manifest (dependencies, scripts)
├── postcss.config.js # PostCSS configuration (for Tailwind)
├── tailwind.config.js # Tailwind CSS configuration
├── tsconfig.json # TypeScript compiler configuration
├── tsconfig.node.json # TypeScript configuration for Vite's Node context
└── vite.config.ts # Vite configuration file
```

## Setup and Running

Follow these steps to get the frontend client running locally:

**Prerequisites:**

*   **Node.js:** LTS version recommended (e.g., v18, v20).
*   **pnpm:** Package manager used for this project (`npm install -g pnpm`).
*   **Running Backend:** The backend server **must** be running and accessible, as the frontend relies on its API.

**Steps:**

1.  **Install Dependencies:**
    Navigate to the **root** of the monorepo (`link-shortener/`) in your terminal and run:
    ```bash
    pnpm install
    ```
    This installs dependencies for all workspaces, including the client. If running the client independently, navigate into the `client/` (or `web/`) directory and run `pnpm install`.

2.  **Configure Environment Variables:**
    *   Navigate into the `client/` (or `web/`) directory.
    *   Make a copy of the example environment file:
        ```bash
        cp .env.example .env
        ```
    *   **Edit the `.env` file:** Set the `VITE_API_URL` variable to the **full URL where your backend API is running**. This usually includes the `/api` path if your backend routes are structured that way.
        ```dotenv
        # Example: Pointing to a local backend running on port 4000 with /api prefix
        VITE_API_URL=http://localhost:4000/api
        ```

3.  **Run the Development Server:**
    This command starts the Vite development server with Hot Module Replacement (HMR).
    *   Navigate into the `client/` (or `web/`) directory (if not already there).
    *   Run:
        ```bash
        pnpm run dev
        ```
    *   Vite will typically start the server on `http://localhost:5173`. Open this URL in your web browser.

    **Important:** Ensure the backend server is running concurrently for the frontend to fetch and create data.

## Environment Variables

The following environment variables are used by the client (configure in `.env`):

*   `VITE_API_URL`: The base URL for the backend API endpoint (e.g., `http://localhost:4000/api` or your deployed backend URL).
*   `VITE_APP_BASE_URL` (Optional/If Used): Could be used to construct full short URLs if needed differently from the API base.