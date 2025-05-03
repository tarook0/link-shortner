import { Request, Response } from 'express';
import { createUrl, getAllUrls, findUrlByShortCode } from '../db/url.model';
import { createUrlSchema } from '../utils/validation';

export async function createShortUrl(req: Request, res: Response) {
  try {
    // Validate request body
    const parseResult = createUrlSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ errors: parseResult.error.format() });
    }
    
    const { url, customCode } = parseResult.data;
    
    // Create short URL
    const urlRecord = await createUrl(url, customCode);
    
    // Generate full short URL
    const shortUrl = `${req.protocol}://${req.get('host')}/s/${urlRecord.shortCode}`;
    
    return res.status(201).json({
      id: urlRecord.id,
      originalUrl: urlRecord.originalUrl,
      shortCode: urlRecord.shortCode,
      shortUrl,
      createdAt: urlRecord.createdAt
    });
  } catch (error: any) {
    console.error('Error creating short URL:', error);
    return res.status(500).json({ message: error.message || 'Failed to create short URL' });
  }
}

export async function getUrlList(req: Request, res: Response) {
  try {
    const urls = await getAllUrls();
    return res.json({ urls });
  } catch (error) {
    console.error('Error getting URL list:', error);
    return res.status(500).json({ message: 'Failed to retrieve URLs' });
  }
}

export async function redirectToOriginalUrl(req: Request, res: Response) {
  try {
    const { shortCode } = req.params;
    const urlRecord = await findUrlByShortCode(shortCode);
    
    if (!urlRecord) {
      return res.status(404).send('URL not found');
    }
    
    // Import and increment clicks
    const { incrementClicks } = await import('../db/url.model');
    incrementClicks(shortCode).catch(console.error);
    
    return res.redirect(urlRecord.originalUrl);
  } catch (error) {
    console.error('Error redirecting:', error);
    return res.status(500).send('Server error');
  }
}