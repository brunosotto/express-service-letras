import { pErr } from './../../shared/misc';
import { ConfigDao } from './../../daos/config-dao/config.dao';
import { Config, IConfig } from './../../models/config.model';
import supertest from 'supertest';
import { BAD_REQUEST, CREATED, OK } from 'http-status-codes';
import { Response, SuperTest, Test } from 'supertest';
import { app } from '../../start';
import { ConfigRoute } from './config.router';

const configRoute = new ConfigRoute();

describe('Config Routes', () => {

  const configPluralPath = '/api/configs';
  const configSingularPath = '/api/config';
  const getConfigsFullPath = configPluralPath + configRoute.getConfigsPath;
  const getConfigFullPath = configSingularPath + configRoute.getConfigPath;
  const addConfigFullPath = configSingularPath + configRoute.addConfigPath;
  const updateConfigFullPath = configSingularPath + configRoute.updateConfigPath;
  const deleteConfigFullPath = configSingularPath + configRoute.deleteConfigPath;

  let agent: SuperTest<Test>;

  beforeAll((done) => {
    agent = supertest.agent(app);
    done();
  });

  describe(`"GET:${getConfigsFullPath}"`, () => {

    const callApi = () => {
      return agent.get(getConfigsFullPath);
    };

    it(`should return a JSON object with all the configs and a status code of "${OK}" if the
            request was successful.`, (done) => {

      const configs: Config[] = [
        {
          id: 'aa1',
          top: true,
          size: 2.5,
          pad: 3,
        },
        {
          id: 'aa2',
          top: true,
          size: 2.5,
          pad: 3,
        },
        {
          id: 'aa3',
          top: true,
          size: 2.5,
          pad: 3,
        },
      ];

      spyOn(ConfigDao.prototype, 'getAll').and.returnValue(Promise.resolve(configs));

      callApi()
        .end((err: Error, res: Response) => {
          pErr(err);
          expect(res.status).toBe(OK);

          // Caste instance-objects to 'Config' objects
          const retConfigs = res.body.map((config: IConfig) => {
            return new Config(config);
          });

          expect(JSON.stringify(retConfigs)).toEqual(JSON.stringify(configs));
          expect(res.body.message).toBeUndefined();
          done();
        });
    });

    it(`should return a JSON object containing an error message and a status code of
            "${BAD_REQUEST}" if the request was unsuccessful.`, (done) => {

      const errMsg = 'Could not fetch configs.';
      spyOn(ConfigDao.prototype, 'getAll').and.throwError(errMsg);

      callApi()
        .end((err: Error, res: Response) => {
          pErr(err);
          expect(res.status).toBe(BAD_REQUEST);
          expect(res.body.message).toBe(errMsg);
          done();
        });
    });
  });

  describe(`"GET:${getConfigFullPath}"`, () => {

    const callApi = (id: string) => {
      return agent.get(getConfigFullPath.replace(':id', id.toString()));
    };

    it(`should return a JSON object with all the configs and a status code of "${OK}" if the
            request was successful.`, (done) => {

      const config: Config = {
        id: 'aa1',
        top: true,
        size: 2.5,
        pad: 3,
      };

      spyOn(ConfigDao.prototype, 'get').and.returnValue(Promise.resolve(config));

      callApi('aa1')
        .end((err: Error, res: Response) => {
          pErr(err);
          expect(res.status).toBe(OK);

          // Caste instance-objects to 'Config' objects
          const retConfig = new Config(res.body);

          expect(JSON.stringify(retConfig)).toEqual(JSON.stringify(config));
          expect(res.body.message).toBeUndefined();
          done();
        });
    });

    it(`should return a JSON object containing an error message and a status code of
            "${BAD_REQUEST}" if the request was unsuccessful.`, (done) => {

      const errMsg = 'Could not fetch configs.';
      spyOn(ConfigDao.prototype, 'get').and.throwError(errMsg);

      callApi('aa1')
        .end((err: Error, res: Response) => {
          pErr(err);
          expect(res.status).toBe(BAD_REQUEST);
          expect(res.body.message).toBe(errMsg);
          done();
        });
    });
  });

  describe(`"POST:${addConfigFullPath}"`, () => {

    const callApi = (reqBody: object) => {
      return agent.post(addConfigFullPath).type('form').send(reqBody);
    };

    const configData = new Config(
      'aa5',
      true,
      2.5,
      3,
    );

    it(`should return a status code of "${CREATED}" if the request was successful.`, (done) => {

      spyOn(ConfigDao.prototype, 'add').and.returnValue(Promise.resolve(''));

      callApi(configData) // pick up here
        .end((err: Error, res: Response) => {
          pErr(err);
          expect(res.status).toBe(CREATED);
          expect(res.body.message).toBeUndefined();
          done();
        });
    });

    it(`should return a JSON object with an error message of "${configRoute.paramMissingError}" and a status
            code of "${BAD_REQUEST}" if the config param was missing.`, (done) => {

      callApi({})
        .end((err: Error, res: Response) => {
          pErr(err);
          expect(res.status).toBe(BAD_REQUEST);
          expect(res.body.message).toBe(configRoute.paramMissingError);
          done();
        });
    });

    it(`should return a JSON object with an error message and a status code of "${BAD_REQUEST}"
            if the request was unsuccessful.`, (done) => {

      const errMsg = 'Could not add config.';
      spyOn(ConfigDao.prototype, 'add').and.throwError(errMsg);

      callApi(configData)
        .end((err: Error, res: Response) => {
          pErr(err);
          expect(res.status).toBe(BAD_REQUEST);
          expect(res.body.message).toBe(errMsg);
          done();
        });
    });
  });

  describe(`"PUT:${updateConfigFullPath}"`, () => {

    const callApi = (id: string, reqBody: object) => {
      return agent.put(updateConfigFullPath.replace(':id', id.toString())).type('form').send(reqBody);
    };

    const configData = new Config(
      'aa7',
      true,
      2.5,
      3,
    );

    it(`should return a status code of "${OK}" if the request was successful.`, (done) => {

      spyOn(ConfigDao.prototype, 'update').and.returnValue(Promise.resolve());

      callApi('aa1', configData)
        .end((err: Error, res: Response) => {
          pErr(err);
          expect(res.status).toBe(OK);
          expect(res.body.message).toBeUndefined();
          done();
        });
    });

    it(`should return a JSON object with an error message of "${configRoute.paramMissingError}" and a
            status code of "${BAD_REQUEST}" if the config param was missing.`, (done) => {

      callApi('aa2', {})
        .end((err: Error, res: Response) => {
          pErr(err);
          expect(res.status).toBe(BAD_REQUEST);
          expect(res.body.message).toBe(configRoute.paramMissingError);
          done();
        });
    });

    it(`should return a JSON object with an error message and a status code of "${BAD_REQUEST}"
            if the request was unsuccessful.`, (done) => {

      const updateErrMsg = 'Could not update config.';
      spyOn(ConfigDao.prototype, 'update').and.throwError(updateErrMsg);

      callApi('aa3', configData)
        .end((err: Error, res: Response) => {
          pErr(err);
          expect(res.status).toBe(BAD_REQUEST);
          expect(res.body.message).toBe(updateErrMsg);
          done();
        });
    });
  });

  describe(`"DELETE:${deleteConfigFullPath}"`, () => {

    const callApi = (id: string) => {
      return agent.delete(deleteConfigFullPath.replace(':id', id.toString()));
    };

    it(`should return a status code of "${OK}" if the request was successful.`, (done) => {

      spyOn(ConfigDao.prototype, 'delete').and.returnValue(Promise.resolve());

      callApi('aa5')
        .end((err: Error, res: Response) => {
          pErr(err);
          expect(res.status).toBe(OK);
          expect(res.body.message).toBeUndefined();
          done();
        });
    });

    it(`should return a JSON object with an error message and a status code of "${BAD_REQUEST}"
            if the request was unsuccessful.`, (done) => {

      const deleteErrMsg = 'Could not delete config.';
      spyOn(ConfigDao.prototype, 'delete').and.throwError(deleteErrMsg);

      callApi('aa1')
        .end((err: Error, res: Response) => {
          pErr(err);
          expect(res.status).toBe(BAD_REQUEST);
          expect(res.body.message).toBe(deleteErrMsg);
          done();
        });
    });
  });
});
