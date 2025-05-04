// server/src/db/schema.ts
import { pgTable, serial, text, varchar, timestamp, integer, uniqueIndex } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm'; // Import sql helper if needed (e.g., for increments)

// Define the 'links' table (you can rename 'urls' to 'links' if preferred)
export const links = pgTable('urls', { // Keep table name 'urls' to match existing
  id: serial('id').primaryKey(),
  originalUrl: text('original_url').notNull(),
  shortCode: varchar('short_code', { length: 50 }).notNull().unique(), // Matches CREATE TABLE
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(), // Add withTimezone
  clicks: integer('clicks').default(0).notNull(),
  lastAccessed: timestamp('last_accessed', { withTimezone: true }), // Add withTimezone
}, (table) => ({
  // Define indexes here
  shortCodeIdx: uniqueIndex('idx_short_code').on(table.shortCode),
}));

// Export TypeScript types inferred from the schema (optional but helpful)
export type Link = typeof links.$inferSelect; // Type for selecting data
export type NewLink = typeof links.$inferInsert; // Type for inserting data