// src/routes/url.routes.ts
import { Router } from 'express';
import { createShortUrl, getUrls } from '../controllers/url.controller';


export const urlRouter = Router();

urlRouter.post('/', createShortUrl);
urlRouter.get('/', getUrls);