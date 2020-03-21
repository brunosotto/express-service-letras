import { Request, Response, Router } from 'express';
import { OK } from 'http-status-codes';

// Init shared
export const TextRoute = Router();

// Init routes
export const getTextPath = '/';

let data = {
  text: 'Sotto',
};

/******************************************************************************
 *                      Get User Infos - "GET /api/user-info"
 ******************************************************************************/
TextRoute.get(getTextPath, async (req: Request, res: Response) => {
  return res.status(OK).json(data);
});

/******************************************************************************
 *                      Get User Infos - "GET /api/user-info"
 ******************************************************************************/
TextRoute.post(getTextPath, async (req: Request, res: Response) => {
  // TODO: deveria dar um new e criar um objeto conforme modelo
  data = req.body;
  return res.status(OK).json(OK);
});
