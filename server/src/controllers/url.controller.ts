import { Request, Response } from 'express';
import { urlService } from '../db/url.service'; 
import { z } from 'zod';


const CreateUrlInputSchema = z.object({
  originalUrl: z.string().url({ message: "Invalid URL format" }),
  customCode: z.string().min(3).max(50).optional(), 
});

export const createShortUrl = async (req: Request, res: Response) => {
  try {
    const input = CreateUrlInputSchema.parse(req.body);

    const newUrl = await urlService.create(input.originalUrl, input.customCode);
    res.status(201).json(newUrl);

  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: "Invalid input", errors: error.errors });
    }
    if (error.message === 'Custom code already in use') {
      return res.status(409).json({ message: error.message }); 
    }
    console.error("Controller: Create URL error:", error);
    res.status(500).json({ message: 'Failed to create short URL' });
  }
};

export const getUrls = async (_req: Request, res: Response) => {
  try {
    const allUrls = await urlService.getAll();
    res.status(200).json({ urls: allUrls }); 
  } catch (error) {
    console.error("Controller: Get URLs error:", error);
    res.status(500).json({ message: 'Failed to retrieve URLs' });
  }
};

export const redirectToOriginalUrl = async (req: Request, res: Response) => {
  const { shortCode } = req.params;
  if (!shortCode) {
    return res.status(400).send('Short code is required');
  }

  try {
    
    const link = await urlService.findAndIncrementClicks(shortCode);

    if (!link) {
      return res.status(404).send('Short URL not found');
    }

    // Prepend http:// if scheme is missing
    const destinationUrl = /^https?:\/\//i.test(link.originalUrl)
      ? link.originalUrl
      : `http://${link.originalUrl}`;

    // Perform the redirect
    return res.redirect(302, destinationUrl); // 302 Found (temporary redirect) is often suitable

  } catch (error) {
    console.error('Controller: Redirect error:', error);
    return res.status(500).send('Internal server error');
  }
};