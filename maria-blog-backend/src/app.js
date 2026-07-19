import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { randomUUID } from 'crypto';
import { logger } from './lib/logger.js';
import { AppError } from './lib/errors.js';
import config from './config.js';
import indexRouter from './routes/index.js';

const app = express();

// Behind a single edge proxy in production. Trust one hop so req.ip is the real
// client IP (needed for express-rate-limit) and the forwarded chain can't be spoofed.
app.set('trust proxy', 1);

app.use((req, res, next) => {
  req.id = req.headers['x-request-id'] || randomUUID();
  res.setHeader('x-request-id', req.id);
  const start = Date.now();
  res.on('finish', () => {
    logger.info('HTTP', { method: req.method, url: req.originalUrl, status: res.statusCode, ms: Date.now() - start, requestId: req.id });
  });
  next();
});

app.use(helmet());
app.use(cors({ origin: config.corsOrigins, credentials: true }));
app.use(compression());
app.use(cookieParser());
app.use(express.json({ limit: '2mb' }));

app.use('/api', rateLimit({ windowMs: 60 * 60 * 1000, max: 500, standardHeaders: true, legacyHeaders: false }));

app.get('/health', (_req, res) => res.status(200).json({ status: 'ok', brand: 'maria-blog' }));
app.use('/api', indexRouter);

app.all('/{*path}', (req, _res, next) => next(new AppError(`Route ${req.originalUrl} not found`, 404)));

app.use((err, req, res, _next) => {
  const statusCode = err.statusCode ?? 500;
  const status = err.status ?? 'error';

  if (config.nodeEnv === 'development') {
    return res.status(statusCode).json({ status, message: err.message, stack: err.stack });
  }

  if (err.isOperational) {
    return res.status(statusCode).json({ status, message: err.message });
  }

  logger.error('Unexpected error', { error: err, requestId: req.id });
  res.status(500).json({ status: 'error', message: 'Something went wrong' });
});

export default app;
