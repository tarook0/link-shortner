import { db } from "./index";
import { links, type Link } from "./schema";
import { eq, sql, desc } from "drizzle-orm";
import { randomBytes } from "crypto";

function generateShortCode(length = 6): string {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const bytes = randomBytes(length);
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(bytes[i] % characters.length);
  }
  return result;
}

export const urlService = {
  async create(originalUrl: string, customCode?: string): Promise<Link> {
    const shortCode = customCode || generateShortCode();

    try {
      const result = await db
        .insert(links)
        .values({ originalUrl, shortCode })
        .returning();

      if (result.length === 0) {
        throw new Error("Failed to create URL record after insert.");
      }
      return result[0];
    } catch (error: any) {
      if (
        error.code === "23505" &&
        error.constraint === "urls_short_code_key"
      ) {
        
        if (customCode) {
          throw new Error("Custom code already in use");
        }

        console.warn(
          `Short code collision for generated code ${shortCode}, retrying...`
        );

        return this.create(originalUrl);
      }

      console.error("Error creating URL with Drizzle:", error);
      throw error;
    }
  },

  /**
   * Finds a URL by its short code and increments its click count atomically.
   * Returns the updated URL record or undefined if not found.
   */
  async findAndIncrementClicks(shortCode: string): Promise<Link | undefined> {
    const result = await db
      .update(links)
      .set({
        clicks: sql`${links.clicks} + 1`,
        lastAccessed: new Date(),
      })
      .where(eq(links.shortCode, shortCode)) 
      .returning(); 

    return result[0]; 
  },

  /**
   * Retrieves all URL records, ordered by creation date descending.
   */
  async getAll(): Promise<Link[]> {
    return db.query.links.findMany({
      
      orderBy: [desc(links.createdAt)], 
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
