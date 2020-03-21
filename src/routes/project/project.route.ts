import { logger } from './../../shared/logger';
import { ProjectDao } from './../../daos/project/project.dao';
import { Project } from './../../models/project.model';
import { IResponse } from './../../models/response.model';
import { Request, Response, Router } from 'express';
import { BAD_REQUEST, CREATED, OK } from 'http-status-codes';

// Init shared
const singular = Router();
const plural = Router();
const projectDao = new ProjectDao();
export const paramMissingError = 'One or more of the required parameters was missing.';

// Init routes
export const getProjectsPath = ''; // raíz
export const getProjectPath = '/:id';
export const addProjectPath = '';
export const updateProjectPath = '/:id';
export const deleteProjectPath = '/:id';

/******************************************************************************
 *                      Get All Projects - "GET /api/projects"
 ******************************************************************************/
plural.get(getProjectsPath, async (req: Request, res: Response) => {
  try {
    const projects = await projectDao.getAll();

    // remove os logs dos envs
    const filtered = projects.map((project) => {
      project.deploymentEnvs = project.deploymentEnvs.map((env) => {
        env.lastLog = null;
        return env;
      });

      return project;
    });

    return res.status(OK).json(filtered);
  } catch (err) {
    // loga
    logger.error(err.message, err);

    // prepara o responde
    const response: IResponse = { success: false, message: err.message, type: 'ErrorListProjects' };

    // retorna
    return res.status(BAD_REQUEST).json(response);
  }
});

/******************************************************************************
 *                      Get One Project - "GET /api/project/{id}"
 ******************************************************************************/
singular.get(getProjectPath, async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const project = await getProject(id);

    // remove os logs dos envs
    project.deploymentEnvs = project.deploymentEnvs.map((env) => {
      env.lastLog = null;
      return env;
    });

    return res.status(OK).json(project);
  } catch (err) {
    // loga
    logger.error(err.message, err);

    // prepara o responde
    const response: IResponse = { success: false, message: err.message, type: 'ErrorGetProject' };

    // retorna
    return res.status(BAD_REQUEST).json(response);
  }
});

const getProject = (id: string) => {
  return projectDao.get(id);
};

/******************************************************************************
 *                       Add One - "POST /api/project"
 ******************************************************************************/
singular.post(addProjectPath, async (req: Request, res: Response) => {
  try {
    const project = new Project(req.body);

    // valida os parametros requeridos
    if (!validateRecivedProject(project)) {
      throw { message: paramMissingError };
    }

    // grava e já recebe o id
    const id = await projectDao.add(project);

    // prepara o responde
    const response: IResponse = { id, success: true };

    return res.status(CREATED).json(response);
  } catch (err) {
    // loga
    logger.error(err.message, err);

    // prepara o responde
    const response: IResponse = { success: false, message: err.message, type: 'ErrorAddProject' };

    // retorna
    return res.status(BAD_REQUEST).json(response);
  }
});

function validateRecivedProject(project: Project): boolean {
  if (!project.name) {
    return false;
  } else if (!project.deploymentEnvs) {
    return false;
  } else if (project.deploymentEnvs.length === 0) {
    return false;
  } else {
    return true;
  }
}

/******************************************************************************
 *                       Update - "PUT /api/project/{id}"
 ******************************************************************************/
singular.put(updateProjectPath, async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const project = new Project(req.body);

    // valida os parametros requeridos
    if (!validateRecivedProject(project)) {
      throw { message: paramMissingError };
    }

    // injeta o id
    project.id = id;

    await updateProject(project);

    // prepara o responde
    const response: IResponse = { success: true };

    // retorna
    return res.status(OK).json(response);
  } catch (err) {
    // loga
    logger.error(err.message, err);

    // prepara o responde
    const response: IResponse = { success: false, message: err.message, type: 'ErrorUpdateProject' };

    // retorna
    return res.status(BAD_REQUEST).json(response);
  }
});

const updateProject = (project: Project) => {
  return projectDao.update(project);
};

/******************************************************************************
 *                    Delete - "DELETE /api/project/:id"
 ******************************************************************************/
singular.delete(deleteProjectPath, async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    await projectDao.delete(id);

    // prepara o responde
    const response: IResponse = { success: true };

    // retorna
    return res.status(OK).json(response);
  } catch (err) {
    // loga
    logger.error(err.message, err);

    // prepara o responde
    const response: IResponse = { success: false, message: err.message, type: 'ErrorDeleteProject' };

    // retorna
    return res.status(BAD_REQUEST).json(response);
  }
});

/******************************************************************************
 *                                     Export
 ******************************************************************************/
export const ProjectRoute = {
  singular,
  plural,
  getProject,
  updateProject,
};
