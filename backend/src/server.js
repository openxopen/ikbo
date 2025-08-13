import 'dotenv/config';
import { connectDB } from './config/db.js';
import app from './app.js';

const PORT = process.env.PORT || 4000;
const start = async () => {
  await connectDB();
  app.listen(PORT, () => console.log(`API escuchando en http://localhost:${PORT}`));
};
start();
