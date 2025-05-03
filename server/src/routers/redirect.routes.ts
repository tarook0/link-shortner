// The correct way to use the redirectToOriginalUrl function in your routes

// In src/routes/redirect.routes.ts
import { Router } from 'express';
import { redirectToOriginalUrl } from '../controllers/url.controller';

export const redirectRouter = Router();

// This is the correct way:
/* `redirectRouter.get('/:shortCode', redirectToOriginalUrl);` is setting up a route in the
`redirectRouter` that listens for GET requests with a path parameter `:shortCode`. When a request is
made to this route, the `redirectToOriginalUrl` function from the `url.controller` is called to
handle the request. This function is responsible for redirecting the user to the original URL
associated with the provided short code. */
redirectRouter.get('/:shortCode', redirectToOriginalUrl);