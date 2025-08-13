import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import requestsRoutes from './routes/solicitudes.routes.js';
import offersRoutes from './routes/ofertas.routes.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/', (_req, res) => res.json({ ok: true, name: 'Sistema de Solicitudes Final' }));

app.use('/api/auth', authRoutes);
app.use('/api/requests', requestsRoutes);
app.use('/api/offers', offersRoutes);

export default app;
