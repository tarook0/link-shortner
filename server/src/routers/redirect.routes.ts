// The correct way to use the redirectToOriginalUrl function in your routes

// In src/routes/redirect.routes.ts
import { Router } from 'express';
import { redirectToOriginalUrl } from '../controllers/url.controller';

export const redirectRouter = Router();

redirectRouter.get('/:shortCode', redirectToOriginalUrl);