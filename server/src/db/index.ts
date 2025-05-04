// server/src/db/index.ts
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema"; // Import your schema
import * as dotenv from "dotenv";

// Load .env file from the root relative to this config file
dotenv.config({ path: ".env" }); // Adjust path as needed
const DB_HOST=process.env.DB_HOST;
const DB_PORT=process.env.DB_PORT;
const DB_NAME=process.env.DB_NAME;
const DB_USER=process.env.DB_USER;
const DB_PASSWORD=Number(process.env.DB_PASSWORD);
const connectionString =
  process.env.DATABASE_URL ||
  `postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;
console.log(connectionString);
if (!connectionString || connectionString.includes("undefined")) {
  throw new Error("Database connection string could not be constructed.");
}

// Create the connection pool using the same credentials
const pool = new Pool({
  connectionString: connectionString,
  // Add other pool options from your setup.ts if needed (e.g., ssl, connectionTimeoutMillis)
  ssl: process.env.DB_SSL === "true", // Example SSL handling
  // connectionTimeoutMillis: 2000, // If needed
});

// Optional: Verify pool connection on startup
pool
  .connect()
  .then((client) => {
    console.log("Successfully connected to database via Drizzle pool");
    client.release(); // Release the client back to the pool
  })
  .catch((err) => {
    console.error("Drizzle pool connection failed:", err);
    process.exit(1);
  });

// Initialize Drizzle ORM with the pool and schema
// Enable logger in development for debugging SQL queries
export const db = drizzle(pool, {
  schema,
  logger: process.env.NODE_ENV !== "production",
});
