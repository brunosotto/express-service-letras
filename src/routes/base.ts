import { Request, Response, Router } from 'express';
import { ProjectRoute } from './project/project.route';
import { TextRoute } from './text/text.route';
import { RunDeployRoute } from './run-deploy/run-deploy.route';
import { NOT_FOUND } from 'http-status-codes';

// Init router and path
const router = Router();

// Add sub-routes
// project
router.use('/project', ProjectRoute.singular);
router.use('/projects', ProjectRoute.plural);

// text
router.use('/text', TextRoute);

// run-deploy
router.use('/run-deploy', RunDeployRoute);

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
