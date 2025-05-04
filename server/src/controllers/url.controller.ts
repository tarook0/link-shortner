import { Request, Response } from 'express';
import { urlService } from '../db/url.service'; 
import { z } from 'zod';


const CreateUrlInputSchema = z.object({
  originalUrl: z.string().url({ message: "Invalid URL format" }),
  customCode: z.string().min(3).max(50).optional(), 
});

export const createShortUrl = async (
  req: Request<{}, {}, { originalUrl: string; customCode?: string }>,
  res: Response
): Promise<void> => {
  try {
    const input = CreateUrlInputSchema.parse(req.body);
    const newUrl = await urlService.create(input.originalUrl, input.customCode);
    res.status(201).json(newUrl);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: "Invalid input", errors: error.errors });
      return;
    }
    if (error.message === 'Custom code already in use') {
      res.status(409).json({ message: error.message });
      return;
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

export const redirectToOriginalUrl = async (
  req: Request<{ shortCode: string }>,
  res: Response
): Promise<void> => {
  const { shortCode } = req.params;
  
  if (!shortCode) {
    res.status(400).send('Short code is required');
    return;
  }

  try {
    const link = await urlService.findAndIncrementClicks(shortCode);

    if (!link) {
      res.status(404).send('Short URL not found');
      return;
    }

    const destinationUrl = /^https?:\/\//i.test(link.originalUrl)
      ? link.originalUrl
      : `http://${link.originalUrl}`;

    // Remove the return statement here
    res.redirect(302, destinationUrl);

  } catch (error) {
    console.error('Controller: Redirect error:', error);
    res.status(500).send('Internal server error');
  }
};