// The correct way to use the redirectToOriginalUrl function in your routes

// In src/routes/redirect.routes.ts
import { Router } from 'express';
import { redirectToOriginalUrl } from '../controllers/url.controller';

export const redirectRouter:Router = Router();
// @ts-ignore - Suppressing TS2769 / Temporary workaround
redirectRouter.get('/:shortCode', redirectToOriginalUrl);