import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';


import { urlRouter } from './routers/url.routers';
import { redirectRouter } from './routers/redirect.routes';

dotenv.config({ path: '.env' }); 
const app = express();
const PORT = Number(process.env.PORT) || 4000;
app.use(cors()); 
app.use(express.json());

app.use('/api/urls', urlRouter); 
app.use('/s', redirectRouter); 

// app.get('/health', (_, res) => {
//   res.status(200).json({ status: 'ok' });
// });

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});