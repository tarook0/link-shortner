// server/src/db/url.model.ts
import { pool } from './setup';
import { randomBytes } from 'crypto';

export interface UrlRecord {
  id: number;
  originalUrl: string;
  shortCode: string;
  createdAt: Date;
  clicks: number;
}

export async function createUrl(originalUrl: string, customCode?: string): Promise<UrlRecord> {
  const shortCode = customCode || generateShortCode();
  
  try {
    const result = await pool.query(
      `INSERT INTO urls (original_url, short_code) 
       VALUES ($1, $2) 
       RETURNING id, original_url as "originalUrl", short_code as "shortCode", created_at as "createdAt", clicks`,
      [originalUrl, shortCode]
    );
    
    return result.rows[0];
  } catch (error: any) {
    // Handle duplicate short_code
    if (error.code === '23505') { // unique_violation
      if (customCode) {
        throw new Error('Custom code already in use');
      }
      // Try again with a different code if it's not a custom code
      return createUrl(originalUrl);
    }
    throw error;
  }
}

export async function findAndIncrementClicks(shortCode: string): Promise<UrlRecord | null> {
  const result = await pool.query(
    `UPDATE urls 
     SET clicks = clicks + 1 
     WHERE short_code = $1 
     RETURNING 
       id, 
       original_url AS "originalUrl", 
       short_code AS "shortCode", 
       created_at AS "createdAt", 
       clicks`,
    [shortCode]
  );
  return result.rows[0] || null;
}

export async function incrementClicks(shortCode: string): Promise<void> {
  await pool.query(
    `UPDATE urls SET clicks = clicks + 1 WHERE short_code = $1`,
    [shortCode]
  );
}

export async function getAllUrls(): Promise<UrlRecord[]> {
  const result = await pool.query(
    `SELECT id, original_url as "originalUrl", short_code as "shortCode", created_at as "createdAt", clicks 
     FROM urls 
     ORDER BY created_at DESC`
  );
  
  return result.rows;
}

function generateShortCode(length = 6): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const bytes = randomBytes(length);
  let result = '';
  
  for (let i = 0; i < length; i++) {
    const randomIndex = bytes[i] % characters.length;
    result += characters.charAt(randomIndex);
  }
  
  return result;
}