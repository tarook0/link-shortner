// src/routes/url.routes.ts
import { Router } from 'express';
import { createShortUrl, getUrls } from '../controllers/url.controller';


export const urlRouter:Router = Router();
if (typeof createShortUrl !== 'function') {
    throw new Error('createShortUrl is not a function!');
  }

urlRouter.post('/', createShortUrl);
urlRouter.get('/', getUrls);