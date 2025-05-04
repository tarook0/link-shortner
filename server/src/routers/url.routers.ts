// src/routes/url.routes.ts
import { Router } from 'express';
import { createShortUrl, getUrls } from '../controllers/url.controller';


export const urlRouter = Router();

// Use the functions as route handlers
urlRouter.post('/', createShortUrl);
urlRouter.get('/', getUrls);