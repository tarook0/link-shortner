import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';


import { urlRouter } from './routers/url.routers';
import { redirectRouter } from './routers/redirect.routes';

dotenv.config({ path: '.env' }); 
const app = express();
const PORT = Number(process.env.PORT) || 4000;
const allowedOrigin = process.env.FRONTEND_URL; 
console.log(`Configuring CORS for origin: ${allowedOrigin}`); // Add log for debugging

const corsOptions: cors.CorsOptions = {
  origin: allowedOrigin, // Use the variable here
  methods: ['GET', 'POST', 'OPTIONS'], // Allow necessary methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow necessary headers
  credentials: true, // If you were using cookies/sessions
};

app.use(cors(corsOptions));
// Optional: Handle pre-flight requests explicitly for all routes
app.options('*', cors(corsOptions));
app.use(express.json());

app.use('/api/urls', urlRouter); 
app.use('/s', redirectRouter); 

// app.get('/health', (_, res) => {
//   res.status(200).json({ status: 'ok' });
// });

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});