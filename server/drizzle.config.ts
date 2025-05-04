// server/drizzle.config.ts
import { type Config } from "drizzle-kit"; // Use 'type' import
import * as dotenv from "dotenv";

// Load .env file from the root relative to this config file
// Adjust the path '../../.env' if your .env is elsewhere.
// Consider using an environment variable for the path if needed in different environments.
dotenv.config({ path: process.env.ENV_FILE_PATH || ".env" });

// --- Connection String Logic ---
let connectionString: string | undefined;

// 1. Prioritize DATABASE_URL if it exists
connectionString = process.env.DATABASE_URL;

// 2. If DATABASE_URL is not set, try constructing from individual variables
if (!connectionString) {
    const dbHost ='localhost';
    const dbPort ='5432';
    const dbUser ='taroo';
    const dbPassword ='1234';
    const dbDatabase ='link_shortener';

    // Check if all necessary parts are defined
    if (!dbHost || !dbPort || !dbUser || dbPassword === undefined || !dbDatabase) {
        console.error("Warning: Missing one or more DB_* environment variables (DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_DATABASE). Attempting connection without full credentials might fail.");
    } else {
        // Construct the connection string, ensuring components are URI encoded
        connectionString = `postgresql://${encodeURIComponent(dbUser)}:${encodeURIComponent(dbPassword)}@${dbHost}:${dbPort}/${encodeURIComponent(dbDatabase)}`;
    }
}

// 3. Final check - Throw error if no connection string could be determined
if (!connectionString) {
  throw new Error(
    "Database connection string could not be determined. " +
    "Ensure DATABASE_URL or all DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_DATABASE environment variables are defined correctly in your .env file."
  );
}
// --- End Connection String Logic ---


// Drizzle Kit Configuration Export
export default {
    schema: "./src/db/schema.ts", // Path to your Drizzle schema file
    out: "./drizzle",             // Directory to store generated migration files

    // --- Updated Configuration Key ---
    dialect: "postgresql",       // Use 'dialect' instead of 'driver' (Required for v0.21.0+)
                                 // 'postgresql' is the correct value for node-postgres driver

    // Database credentials
    dbCredentials: {
        // Use 'url' which is the preferred property name now, though 'connectionString' often works too
        url: connectionString,
        // --- Optional SSL Configuration ---
        // You can configure SSL based on an environment variable if needed:
        // ssl: process.env.DB_SSL === 'require' ? 'require' : undefined // Example: use 'require' if DB_SSL='require'
        // ssl: process.env.DB_SSL === 'true', // Simpler boolean option if your setup supports it
    },

    // Optional: Specify migrations table name (defaults usually fine)
    // migrations: {
    //   table: "__drizzle_migrations", // Default table name
    //   schema: "public" // Default schema
    // },

    verbose: true, // Log detailed output during operations
    strict: true, // Enable strict schema checking

} satisfies Config; // Use 'satisfies' for type checking while preserving literal types