import { type Config } from "drizzle-kit";
import * as dotenv from "dotenv";
dotenv.config({ path: process.env.ENV_FILE_PATH || ".env" });
let connectionString: string | undefined;
connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  const dbHost = "localhost";
  const dbPort = "5432";
  const dbUser = "taroo";
  const dbPassword = "1234";
  const dbDatabase = "link_shortener";

  if (
    !dbHost ||
    !dbPort ||
    !dbUser ||
    dbPassword === undefined ||
    !dbDatabase
  ) {
    console.error(
      "Warning: Missing one or more DB_* environment variables (DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_DATABASE). Attempting connection without full credentials might fail."
    );
  } else {
    connectionString = `postgresql://${encodeURIComponent(
      dbUser
    )}:${encodeURIComponent(
      dbPassword
    )}@${dbHost}:${dbPort}/${encodeURIComponent(dbDatabase)}`;
  }
}

if (!connectionString) {
  throw new Error(
    "Database connection string could not be determined. " +
      "Ensure DATABASE_URL or all DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_DATABASE environment variables are defined correctly in your .env file."
  );
}

export default {
  schema: "./src/db/schema.ts",
  out: "./drizzle",

  dialect: "postgresql",

  dbCredentials: {
    url: connectionString,
  },

  verbose: true,
  strict: true,
} satisfies Config;
