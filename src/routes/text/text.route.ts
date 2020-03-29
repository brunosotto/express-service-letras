import { Request, Response, Router } from 'express';
import { OK } from 'http-status-codes';
import { defaultConfig, updateConfig, insertNewConfig, validateRecivedConfig } from '../config-router/config.router';
import { Config } from '../../models/config.model';
import { TextModel } from '../../models/text.model';

// Init shared
export const TextRoute = Router();

// Init routes
export const getTextPath = '/';

let data = new TextModel({
  ...defaultConfig,
  text: '...',
});

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
  const received = new TextModel(req.body);

  if ( !validateRecivedConfig(received) ) {
    data.text = received.text;

    return res.status(OK).json({id: received.id});
  }

  // atualiza ou insere config
  if (received.id) {
    await updateConfig(req, res);
  } else {
    received.id = await insertNewConfig(req, res);
  }

  if (!received.text) {
    received.text = data.text;
  }

  data = received;

  return res.status(OK).json({id: received.id});
});
