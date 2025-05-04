// server/src/db/url.service.ts
import { db } from './index'; // Import the Drizzle client instance
import { links, type Link } from './schema'; // Import the schema definition and types
import { eq, sql, desc } from 'drizzle-orm'; // Import Drizzle operators/helpers
import { randomBytes } from 'crypto';

// Keep or move generateShortCode to a utils file
function generateShortCode(length = 6): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const bytes = randomBytes(length);
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(bytes[i] % characters.length);
  }
  return result;
}

// Define a service object to hold the database functions
export const urlService = {
  /**
   * Creates a new short URL record. Handles retries on collision for generated codes.
   */
  async create(originalUrl: string, customCode?: string): Promise<Link> {
    const shortCode = customCode || generateShortCode();

    try {
      const result = await db
        .insert(links)
        .values({ originalUrl, shortCode })
        .returning(); // Returns the full inserted row based on the schema type 'Link'

      if (result.length === 0) {
        // This shouldn't typically happen if the insert doesn't throw
        throw new Error("Failed to create URL record after insert.");
      }
      return result[0];
    } catch (error: any) {
      // Check for unique constraint violation (Postgres code 23505)
      if (error.code === '23505' && error.constraint === 'urls_short_code_key') { // Check constraint name if needed
        if (customCode) {
          // If a custom code was provided and it failed, throw specific error
          throw new Error('Custom code already in use');
        }
        // If it was a generated code collision, log and retry
        console.warn(`Short code collision for generated code ${shortCode}, retrying...`);
        // Use 'this' to recursively call within the service object
        return this.create(originalUrl);
      }
      // Re-throw any other database errors
      console.error("Error creating URL with Drizzle:", error);
      throw error;
    }
  },

  /**
   * Finds a URL by its short code and increments its click count atomically.
   * Returns the updated URL record or undefined if not found.
   */
  async findAndIncrementClicks(shortCode: string): Promise<Link | undefined> {
    const result = await db.update(links)
      .set({
        clicks: sql`${links.clicks} + 1`, // Use Drizzle's sql helper for safe increment
        lastAccessed: new Date(),       // Update lastAccessed timestamp
      })
      .where(eq(links.shortCode, shortCode)) // Use Drizzle's eq operator
      .returning(); // Return the updated row

    return result[0]; // result is an array, return the first element or undefined
  },

  /**
   * Retrieves all URL records, ordered by creation date descending.
   */
  async getAll(): Promise<Link[]> {
    return db.query.links.findMany({ // Use the relational query syntax
      orderBy: [desc(links.createdAt)], // Use Drizzle's desc operator
    });
  },

   /**
    * Finds a URL by its short code without incrementing clicks.
    */
   async findByShortCode(shortCode: string): Promise<Link | undefined> {
     return db.query.links.findFirst({
       where: eq(links.shortCode, shortCode),
     });
   },
};