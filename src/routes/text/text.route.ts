import { Request, Response, Router } from 'express';
import { OK } from 'http-status-codes';
import { defaultConfig, updateConfig, insertNewConfig, validateRecivedConfig } from '../config-router/config.router';
import { Config } from '../../models/config.model';

// Init shared
export const TextRoute = Router();

// Init routes
export const getTextPath = '/';

// TODO: falta o type extendido aqui
let data = {
  ...defaultConfig,
  text: '...',
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
  if ( !validateRecivedConfig(new Config(req.body)) ) {
    // TODO: deveria dar um new e criar um objeto conforme modelo
    data.text = req.body.text;

    return res.status(OK).json({id: req.body.id});
  }

  // atualiza ou insere config
  if (req.body.id) {
    await updateConfig(req, res);
  } else {
    req.body.id = await insertNewConfig(req, res);
  }

  // TODO: deveria dar um new e criar um objeto conforme modelo
  data = req.body;

  return res.status(OK).json({id: req.body.id});
});
