// import { Request, Response } from "express";
// import { createUrl, getAllUrls, findAndIncrementClicks } from "../db/url.model";
// import { createUrlSchema } from "../utils/validation";

// export async function createShortUrl(req: Request, res: Response) {
//   try {
//     // Validate request body
//     const parseResult = createUrlSchema.safeParse(req.body);
//     if (!parseResult.success) {
//       return res.status(400).json({ errors: parseResult.error.format() });
//     }

//     const { url, customCode } = parseResult.data;

//     // Create short URL
//     const urlRecord = await createUrl(url, customCode);

//     // Generate full short URL
//     const shortUrl = `${req.protocol}://${req.get("host")}/s/${
//       urlRecord.shortCode
//     }`;

//     return res.status(201).json({
//       id: urlRecord.id,
//       originalUrl: urlRecord.originalUrl,
//       shortCode: urlRecord.shortCode,
//       shortUrl,
//       createdAt: urlRecord.createdAt,
//     });
//   } catch (error: any) {
//     console.error("Error creating short URL:", error);
//     return res
//       .status(500)
//       .json({ message: error.message || "Failed to create short URL" });
//   }
// }

// export async function getUrlList(req: Request, res: Response) {
//   try {
//     const urls = await getAllUrls();
//     return res.json({ urls });
//   } catch (error) {
//     console.error("Error getting URL list:", error);
//     return res.status(500).json({ message: "Failed to retrieve URLs" });
//   }
// }

// export async function redirectToOriginalUrl(req: Request, res: Response) {
//   try {
//     const { shortCode } = req.params;
//     const urlRecord = await findAndIncrementClicks(shortCode);

//     if (!urlRecord) {
//       return res.status(404).send("URL not found");
//     }

//     return res.redirect(urlRecord.originalUrl);
//   } catch (error) {
//     console.error("Error redirecting:", error);
//     return res.status(500).send("Server error");
//   }
// }
// server/src/controllers/url.controller.ts
import { Request, Response } from 'express';
import { urlService } from '../db/url.service'; // Import the new service
import { z } from 'zod'; // Assuming you might want Zod validation

// Example Zod schema for validation
const CreateUrlInputSchema = z.object({
  originalUrl: z.string().url({ message: "Invalid URL format" }),
  customCode: z.string().min(3).max(50).optional(), // Example constraints
});

export const createShortUrl = async (req: Request, res: Response) => {
  try {
    // Validate input using Zod (optional but recommended)
    const input = CreateUrlInputSchema.parse(req.body);

    const newUrl = await urlService.create(input.originalUrl, input.customCode);
    res.status(201).json(newUrl); // Return the created record (already typed as Link)

  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: "Invalid input", errors: error.errors });
    }
    if (error.message === 'Custom code already in use') {
      return res.status(409).json({ message: error.message }); // 409 Conflict
    }
    console.error("Controller: Create URL error:", error);
    res.status(500).json({ message: 'Failed to create short URL' });
  }
};

export const getUrls = async (_req: Request, res: Response) => {
  try {
    const allUrls = await urlService.getAll();
    res.status(200).json({ urls: allUrls }); // Send back in expected structure if needed
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
    // Use the combined find and increment function
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