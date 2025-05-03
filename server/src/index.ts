// In src/index.ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';


import { setupDatabase } from './db/setup';
import { urlRouter } from './routers/url.routers';
import { redirectRouter } from './routers/redirect.routes';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to database
 setupDatabase();

// Routes - use the routers correctly
app.use('/api/urls', urlRouter);
app.use('/s', redirectRouter);

// Health check endpoint
app.get('/health', (_, res) => {
  res.status(200).json({ status: 'ok' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});