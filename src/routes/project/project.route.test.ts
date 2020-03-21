import { pErr } from './../../shared/misc';
import { ProjectDao } from './../../daos/project/project.dao';
import { Project, IProject } from './../../models/project.model';
import supertest from 'supertest';
import { BAD_REQUEST, CREATED, OK } from 'http-status-codes';
import { Response, SuperTest, Test } from 'supertest';
import app from '../../server';
import {
  getProjectPath,
  getProjectsPath,
  addProjectPath,
  updateProjectPath,
  deleteProjectPath,
  paramMissingError,
} from './project.route';

describe('Project Routes', () => {

  const projectPluralPath = '/api/projects';
  const projectSingularPath = '/api/project';
  const getProjectsFullPath = projectPluralPath + getProjectsPath;
  const getProjectFullPath = projectSingularPath + getProjectPath;
  const addProjectFullPath = projectSingularPath + addProjectPath;
  const updateProjectFullPath = projectSingularPath + updateProjectPath;
  const deleteProjectFullPath = projectSingularPath + deleteProjectPath;

  let agent: SuperTest<Test>;

  beforeAll((done) => {
    agent = supertest.agent(app);
    done();
  });

  describe(`"GET:${getProjectsFullPath}"`, () => {

    const callApi = () => {
      return agent.get(getProjectsFullPath);
    };

    it(`should return a JSON object with all the projects and a status code of "${OK}" if the
            request was successful.`, (done) => {

      const projects: Project[] = [
        {
          id: 'aa1',
          name: 'Projecto 1',
          enable: true,
          script: 'express',
          deploymentPath: '/teste/',
          lastRun: new Date(),
          deploymentEnvs: [],
          githubRepoUrl: 'teste.git',
          authToken: '12334ddss',
        },
        {
          id: 'aa2',
          name: 'Projecto 2',
          enable: true,
          script: 'express',
          deploymentPath: '/teste/',
          lastRun: new Date(),
          deploymentEnvs: [],
          githubRepoUrl: 'teste.git',
          authToken: '12334ddss',
        },
        {
          id: 'aa3',
          name: 'Projecto 3',
          enable: true,
          script: 'express',
          deploymentPath: '/teste/',
          lastRun: new Date(),
          deploymentEnvs: [],
          githubRepoUrl: 'teste.git',
          authToken: '12334ddss',
        },
      ];

      spyOn(ProjectDao.prototype, 'getAll').and.returnValue(Promise.resolve(projects));

      callApi()
        .end((err: Error, res: Response) => {
          pErr(err);
          expect(res.status).toBe(OK);

          // Caste instance-objects to 'Project' objects
          const retProjects = res.body.map((project: IProject) => {
            return new Project(project);
          });

          expect(JSON.stringify(retProjects)).toEqual(JSON.stringify(projects));
          expect(res.body.message).toBeUndefined();
          done();
        });
    });

    it(`should return a JSON object containing an error message and a status code of
            "${BAD_REQUEST}" if the request was unsuccessful.`, (done) => {

      const errMsg = 'Could not fetch projects.';
      spyOn(ProjectDao.prototype, 'getAll').and.throwError(errMsg);

      callApi()
        .end((err: Error, res: Response) => {
          pErr(err);
          expect(res.status).toBe(BAD_REQUEST);
          expect(res.body.message).toBe(errMsg);
          done();
        });
    });
  });

  describe(`"GET:${getProjectFullPath}"`, () => {

    const callApi = (id: string) => {
      return agent.get(getProjectFullPath.replace(':id', id.toString()));
    };

    it(`should return a JSON object with all the projects and a status code of "${OK}" if the
            request was successful.`, (done) => {

      const project: Project = {
        id: 'aa1',
        name: 'Projecto 1',
        enable: true,
        script: 'express',
        deploymentPath: '/teste/',
        lastRun: new Date(),
        deploymentEnvs: [],
        githubRepoUrl: 'teste.git',
        authToken: '12334ddss',
      };

      spyOn(ProjectDao.prototype, 'get').and.returnValue(Promise.resolve(project));

      callApi('aa1')
        .end((err: Error, res: Response) => {
          pErr(err);
          expect(res.status).toBe(OK);

          // Caste instance-objects to 'Project' objects
          const retProject = new Project(res.body);

          expect(JSON.stringify(retProject)).toEqual(JSON.stringify(project));
          expect(res.body.message).toBeUndefined();
          done();
        });
    });

    it(`should return a JSON object containing an error message and a status code of
            "${BAD_REQUEST}" if the request was unsuccessful.`, (done) => {

      const errMsg = 'Could not fetch projects.';
      spyOn(ProjectDao.prototype, 'get').and.throwError(errMsg);

      callApi('aa1')
        .end((err: Error, res: Response) => {
          pErr(err);
          expect(res.status).toBe(BAD_REQUEST);
          expect(res.body.message).toBe(errMsg);
          done();
        });
    });
  });

  describe(`"POST:${addProjectFullPath}"`, () => {

    const callApi = (reqBody: object) => {
      return agent.post(addProjectFullPath).type('form').send(reqBody);
    };

    const projectData = new Project(
      'Projeto novo',
      true,
      'express',
      '/teste/',
      new Date(),
      [
        {
          name: 'teste',
          port: 1234,
          lastDeploy: new Date(),
          versions: [],
        },
      ],
      'teste.git',
      '12334ddss',
    );

    it(`should return a status code of "${CREATED}" if the request was successful.`, (done) => {

      spyOn(ProjectDao.prototype, 'add').and.returnValue(Promise.resolve(''));

      callApi(projectData) // pick up here
        .end((err: Error, res: Response) => {
          pErr(err);
          expect(res.status).toBe(CREATED);
          expect(res.body.message).toBeUndefined();
          done();
        });
    });

    it(`should return a JSON object with an error message of "${paramMissingError}" and a status
            code of "${BAD_REQUEST}" if the project param was missing.`, (done) => {

      callApi({})
        .end((err: Error, res: Response) => {
          pErr(err);
          expect(res.status).toBe(BAD_REQUEST);
          expect(res.body.message).toBe(paramMissingError);
          done();
        });
    });

    it(`should return a JSON object with an error message and a status code of "${BAD_REQUEST}"
            if the request was unsuccessful.`, (done) => {

      const errMsg = 'Could not add project.';
      spyOn(ProjectDao.prototype, 'add').and.throwError(errMsg);

      callApi(projectData)
        .end((err: Error, res: Response) => {
          pErr(err);
          expect(res.status).toBe(BAD_REQUEST);
          expect(res.body.message).toBe(errMsg);
          done();
        });
    });
  });

  describe(`"PUT:${updateProjectFullPath}"`, () => {

    const callApi = (id: string, reqBody: object) => {
      return agent.put(updateProjectFullPath.replace(':id', id.toString())).type('form').send(reqBody);
    };

    const projectData = new Project(
      'Projeto novo',
      true,
      'express',
      '/teste/',
      new Date(),
      [
        {
          name: 'teste',
          port: 1234,
          lastDeploy: new Date(),
          versions: [],
        },
      ],
      'teste.git',
      '12334ddss',
    );

    it(`should return a status code of "${OK}" if the request was successful.`, (done) => {

      spyOn(ProjectDao.prototype, 'update').and.returnValue(Promise.resolve());

      callApi('aa1', projectData)
        .end((err: Error, res: Response) => {
          pErr(err);
          expect(res.status).toBe(OK);
          expect(res.body.message).toBeUndefined();
          done();
        });
    });

    it(`should return a JSON object with an error message of "${paramMissingError}" and a
            status code of "${BAD_REQUEST}" if the project param was missing.`, (done) => {

      callApi('aa2', {})
        .end((err: Error, res: Response) => {
          pErr(err);
          expect(res.status).toBe(BAD_REQUEST);
          expect(res.body.message).toBe(paramMissingError);
          done();
        });
    });

    it(`should return a JSON object with an error message and a status code of "${BAD_REQUEST}"
            if the request was unsuccessful.`, (done) => {

      const updateErrMsg = 'Could not update project.';
      spyOn(ProjectDao.prototype, 'update').and.throwError(updateErrMsg);

      callApi('aa3', projectData)
        .end((err: Error, res: Response) => {
          pErr(err);
          expect(res.status).toBe(BAD_REQUEST);
          expect(res.body.message).toBe(updateErrMsg);
          done();
        });
    });
  });

  describe(`"DELETE:${deleteProjectFullPath}"`, () => {

    const callApi = (id: string) => {
      return agent.delete(deleteProjectFullPath.replace(':id', id.toString()));
    };

    it(`should return a status code of "${OK}" if the request was successful.`, (done) => {

      spyOn(ProjectDao.prototype, 'delete').and.returnValue(Promise.resolve());

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

      const deleteErrMsg = 'Could not delete project.';
      spyOn(ProjectDao.prototype, 'delete').and.throwError(deleteErrMsg);

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
