import { pErr } from './../../shared/misc';
import { LouvorDao } from './../../daos/louvor/louvor.dao';
import { Louvor, ILouvor } from './../../models/louvor.model';
import supertest from 'supertest';
import { BAD_REQUEST, CREATED, OK } from 'http-status-codes';
import { Response, SuperTest, Test } from 'supertest';
import { app } from '../../start';
import { LouvorRoute } from './louvor.router';

const louvorRoute = new LouvorRoute();

describe('Louvor Routes', () => {

  const louvorPluralPath = '/api/louvores';
  const louvorSingularPath = '/api/louvor';
  const getLouvoresFullPath = louvorPluralPath + louvorRoute.getLouvoresPath;
  const getLouvorFullPath = louvorSingularPath + louvorRoute.getLouvorPath;
  const addLouvorFullPath = louvorSingularPath + louvorRoute.addLouvorPath;
  const updateLouvorFullPath = louvorSingularPath + louvorRoute.updateLouvorPath;
  const deleteLouvorFullPath = louvorSingularPath + louvorRoute.deleteLouvorPath;

  let agent: SuperTest<Test>;

  beforeAll((done) => {
    agent = supertest.agent(app);
    done();
  });

  describe(`"GET:${getLouvoresFullPath}"`, () => {

    const callApi = () => {
      return agent.get(getLouvoresFullPath);
    };

    it(`should return a JSON object with all the louvores and a status code of "${OK}" if the
            request was successful.`, (done) => {

      const louvores: Louvor[] = [
        {
          id: 'aa1',
          name: 'Louvoro 1',
          text: '12334ddss',
          arr: [],
        },
        {
          id: 'aa2',
          name: 'Louvoro 2',
          text: '12334ddss',
          arr: [],
        },
        {
          id: 'aa3',
          name: 'Louvoro 3',
          text: '12334ddss',
          arr: [],
        },
      ];

      spyOn(LouvorDao.prototype, 'getAll').and.returnValue(Promise.resolve(louvores));

      callApi()
        .end((err: Error, res: Response) => {
          pErr(err);
          expect(res.status).toBe(OK);

          // Caste instance-objects to 'Louvor' objects
          const retLouvores = res.body.map((louvor: ILouvor) => {
            return new Louvor(louvor);
          });

          expect(JSON.stringify(retLouvores)).toEqual(JSON.stringify(louvores));
          expect(res.body.message).toBeUndefined();
          done();
        });
    });

    it(`should return a JSON object containing an error message and a status code of
            "${BAD_REQUEST}" if the request was unsuccessful.`, (done) => {

      const errMsg = 'Could not fetch louvores.';
      spyOn(LouvorDao.prototype, 'getAll').and.throwError(errMsg);

      callApi()
        .end((err: Error, res: Response) => {
          pErr(err);
          expect(res.status).toBe(BAD_REQUEST);
          expect(res.body.message).toBe(errMsg);
          done();
        });
    });
  });

  describe(`"GET:${getLouvorFullPath}"`, () => {

    const callApi = (id: string) => {
      return agent.get(getLouvorFullPath.replace(':id', id.toString()));
    };

    it(`should return a JSON object with all the louvores and a status code of "${OK}" if the
            request was successful.`, (done) => {

      const louvor: Louvor = {
        id: 'aa1',
        name: 'Louvoro 1',
        text: '12334ddss',
        arr: [],
      };

      spyOn(LouvorDao.prototype, 'get').and.returnValue(Promise.resolve(louvor));

      callApi('aa1')
        .end((err: Error, res: Response) => {
          pErr(err);
          expect(res.status).toBe(OK);

          // Caste instance-objects to 'Louvor' objects
          const retLouvor = new Louvor(res.body);

          expect(JSON.stringify(retLouvor)).toEqual(JSON.stringify(louvor));
          expect(res.body.message).toBeUndefined();
          done();
        });
    });

    it(`should return a JSON object containing an error message and a status code of
            "${BAD_REQUEST}" if the request was unsuccessful.`, (done) => {

      const errMsg = 'Could not fetch louvores.';
      spyOn(LouvorDao.prototype, 'get').and.throwError(errMsg);

      callApi('aa1')
        .end((err: Error, res: Response) => {
          pErr(err);
          expect(res.status).toBe(BAD_REQUEST);
          expect(res.body.message).toBe(errMsg);
          done();
        });
    });
  });

  describe(`"POST:${addLouvorFullPath}"`, () => {

    const callApi = (reqBody: object) => {
      return agent.post(addLouvorFullPath).type('form').send(reqBody);
    };

    const louvorData = new Louvor(
      'Projeto novo',
      '12334ddss',
    );

    it(`should return a status code of "${CREATED}" if the request was successful.`, (done) => {

      spyOn(LouvorDao.prototype, 'add').and.returnValue(Promise.resolve(''));

      callApi(louvorData) // pick up here
        .end((err: Error, res: Response) => {
          pErr(err);
          expect(res.status).toBe(CREATED);
          expect(res.body.message).toBeUndefined();
          done();
        });
    });

    it(`should return a JSON object with an error message of "${louvorRoute.paramMissingError}" and a status
            code of "${BAD_REQUEST}" if the louvor param was missing.`, (done) => {

      callApi({})
        .end((err: Error, res: Response) => {
          pErr(err);
          expect(res.status).toBe(BAD_REQUEST);
          expect(res.body.message).toBe(louvorRoute.paramMissingError);
          done();
        });
    });

    it(`should return a JSON object with an error message and a status code of "${BAD_REQUEST}"
            if the request was unsuccessful.`, (done) => {

      const errMsg = 'Could not add louvor.';
      spyOn(LouvorDao.prototype, 'add').and.throwError(errMsg);

      callApi(louvorData)
        .end((err: Error, res: Response) => {
          pErr(err);
          expect(res.status).toBe(BAD_REQUEST);
          expect(res.body.message).toBe(errMsg);
          done();
        });
    });
  });

  describe(`"PUT:${updateLouvorFullPath}"`, () => {

    const callApi = (id: string, reqBody: object) => {
      return agent.put(updateLouvorFullPath.replace(':id', id.toString())).type('form').send(reqBody);
    };

    const louvorData = new Louvor(
      'Projeto novo',
      '12334ddss',
    );

    it(`should return a status code of "${OK}" if the request was successful.`, (done) => {

      spyOn(LouvorDao.prototype, 'update').and.returnValue(Promise.resolve());

      callApi('aa1', louvorData)
        .end((err: Error, res: Response) => {
          pErr(err);
          expect(res.status).toBe(OK);
          expect(res.body.message).toBeUndefined();
          done();
        });
    });

    it(`should return a JSON object with an error message of "${louvorRoute.paramMissingError}" and a
            status code of "${BAD_REQUEST}" if the louvor param was missing.`, (done) => {

      callApi('aa2', {})
        .end((err: Error, res: Response) => {
          pErr(err);
          expect(res.status).toBe(BAD_REQUEST);
          expect(res.body.message).toBe(louvorRoute.paramMissingError);
          done();
        });
    });

    it(`should return a JSON object with an error message and a status code of "${BAD_REQUEST}"
            if the request was unsuccessful.`, (done) => {

      const updateErrMsg = 'Could not update louvor.';
      spyOn(LouvorDao.prototype, 'update').and.throwError(updateErrMsg);

      callApi('aa3', louvorData)
        .end((err: Error, res: Response) => {
          pErr(err);
          expect(res.status).toBe(BAD_REQUEST);
          expect(res.body.message).toBe(updateErrMsg);
          done();
        });
    });
  });

  describe(`"DELETE:${deleteLouvorFullPath}"`, () => {

    const callApi = (id: string) => {
      return agent.delete(deleteLouvorFullPath.replace(':id', id.toString()));
    };

    it(`should return a status code of "${OK}" if the request was successful.`, (done) => {

      spyOn(LouvorDao.prototype, 'delete').and.returnValue(Promise.resolve());

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

      const deleteErrMsg = 'Could not delete louvor.';
      spyOn(LouvorDao.prototype, 'delete').and.throwError(deleteErrMsg);

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
