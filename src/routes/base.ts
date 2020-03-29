import { Request, Response, Router } from 'express';
import { LouvorRoute } from './louvor/louvor.route';
import { ConfigRoute } from './config-router/config.router';
import { TextRoute } from './text/text.route';
import { NOT_FOUND } from 'http-status-codes';

// Init router and path
const router = Router();

// Add sub-routes
// project
router.use('/louvor', LouvorRoute.singular);
router.use('/louvores', LouvorRoute.plural);

// project
router.use('/config', ConfigRoute.singular);
router.use('/configs', ConfigRoute.plural);

// text
router.use('/text', TextRoute);

// 404 default
router.all('/*', (req: Request, res: Response) => {
  return res.status(NOT_FOUND).json({
    statusCode: 404,
    error: 'Not Found',
    message: 'Not Found',
  });
});

// Export the base-router
export default router;
