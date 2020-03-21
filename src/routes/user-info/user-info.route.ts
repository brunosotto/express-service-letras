import { logger } from './../../shared/logger';
import { IResponse } from './../../models/response.model';
import { IUserInfo } from './../../models/user-info.model';
import { Request, Response, Router } from 'express';
import { BAD_REQUEST, OK } from 'http-status-codes';

// Init shared
export const UserInfoRoute = Router();
export const paramMissingError = 'One or more of the required parameters was missing.';

// Init routes
export const getUserInfoPath = '/';

/******************************************************************************
 *                      Get User Infos - "GET /api/user-info"
 ******************************************************************************/
UserInfoRoute.get(getUserInfoPath, async (req: Request, res: Response) => {
  try {

    const header = req.headers.authorization || '';               // get the header
    const token = header.split(/\s+/).pop() || '';                 // and the encoded auth token
    const buf = Buffer.from(token, 'base64');
    const auth = buf.toString('ascii');
    const parts = auth.split(/:/);                               // split on colon
    const username = parts[0] || 'UserName';

    const info: IUserInfo = {
      username,
    };

    return res.status(OK).json(info);
  } catch (err) {
    // loga
    logger.error(err.message, err);

    // prepara o responde
    const response: IResponse = { success: false, message: err.message, type: 'ErrorGetUserInfo' };

    // retorna
    return res.status(BAD_REQUEST).json(response);
  }
});
