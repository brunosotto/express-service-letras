import { IDeploymentEnv } from './../../models/deployment-env.model';
import { IProject } from './../../models/project.model';
import { logger } from './../../shared/logger';
import { IResponse } from './../../models/response.model';
import { DeployProject, IDeployProject } from './../../models/deploy-project.model';
import { ProjectRoute } from '../project/project.route';
import { Request, Response, Router } from 'express';
import { BAD_REQUEST, OK, FORBIDDEN } from 'http-status-codes';
import { spawn } from 'child_process';
import app from '../../server';

// Init shared
export const RunDeployRoute = Router();
export const paramMissingError = 'One or more of the required parameters was missing.';
export const projectNotFound = 'Project not found!';
export const environmentNotFound = 'Environment not found!';

// Init routes
export const postRunDeploy = '/';
export const getCanBuildDeploy = '/can-build/:projectid/:env/:ver';

/******************************************************************************
 *                      Post Run Deploy - "POST /api/run-deploy"
 ******************************************************************************/
RunDeployRoute.post(postRunDeploy, async (req: Request, res: Response) => {
  try {

    const deployProject = new DeployProject(req.body);

    // valida os parametros requeridos
    if (!validateRecivedDeploy(deployProject)) {
      throw { message: paramMissingError };
    }

    // pega o projeto
    const project = await ProjectRoute.getProject(deployProject.projectId);

    // valida se recebeu o projeto
    if (!project) {
      throw { message: projectNotFound };
    }

    // separa o environment
    const environment = project.deploymentEnvs.find((e) => e.name === deployProject.environment);

    // valida se recebeu o environment
    if (!environment) {
      throw { message: environmentNotFound };
    }

    // se não é produção executa um fake
    if (process.env.NODE_ENV !== 'production') {
      fakeDev(req, res, project, environment, deployProject);

      return;
    }

    res.writeHead(OK, { 'Content-Type': 'text/plain; charset=utf-8' });

    // separa os parametros
    const gitUrl = getGitHubUrl(project);
    const gitUrlCheck = getGitUrlCheck(project);
    const branch = deployProject.branch;
    const env = environment.name;
    const deployPath = project.deploymentPath;
    const port = environment.port.toString();
    const script = project.script;
    const ciPort = app.get('listenOnPort'); // pega a porta que o ci está rodando agora
    const projectId = project.id;

    // monta os params e dá run
    const params = [gitUrl, gitUrlCheck, branch, env, deployPath, port, script, ciPort, projectId];
    const sh = spawn('sh', ['.sh/deploy.sh', ...params]);

    // cria um array para armazenar os resultados
    const logDeploy: string[] = [];

    sh.stdout.on('data', (data) => {
      // responde ao ouvinte
      res.write(data, 'utf-8');

      // guarda log
      logDeploy.push(data.toString());
    });

    sh.stderr.on('data', (data) => {
      // responde ao ouvinte
      res.write(data, 'utf-8');

      // guarda log
      logDeploy.push(data.toString());
    });

    sh.on('close', async (code) => {
      // se o code é 0 tudo ok
      if (code === 0) {
        // completa o deploy guarnando logs
        const log = logDeploy.join('\n');
        await completeDeploy(project, environment, log);
      }

      // responde
      const message = `Processo concluído com código ${code}`;
      res.end(message);
    });

  } catch (err) {
    // loga
    logger.error(err.message, err);

    // prepara o responde
    const response: IResponse = { success: false, message: err.message, type: 'ErrorPostRunDeploy' };

    // retorna
    return res.status(BAD_REQUEST).json(response);
  }
});

/******************************************************************************
 *                      Get Run Deploy - "GET /api/run-deploy/can-build/:projectid/:env/:ver"
 ******************************************************************************/
RunDeployRoute.get(getCanBuildDeploy, async (req: Request, res: Response) => {
  try {

    // pega os parametros
    const id = req.params.projectid;
    const env = req.params.env;
    const ver = req.params.ver;

    // pega o projeto
    const project = await ProjectRoute.getProject(id);

    // valida se recebeu o projeto
    if (!project) {
      throw { message: projectNotFound };
    }

    // separa o environment
    const environment = project.deploymentEnvs.find((e) => e.name === env);

    // valida se recebeu o environment
    if (!environment) {
      throw { message: environmentNotFound };
    }

    // valida se a versão pode ser feito deploy
    const version = environment.versions.find((v) => v.version === ver);
    if (version) {
      // se já tem a versão barra com 401 respondendo 0
      return res.status(FORBIDDEN).end('0');
    } else {
      // se não tem a versão responde com 200 respondendo 1
      return res.status(OK).end('1');
    }

  } catch (err) {
    // loga
    logger.error(err.message, err);

    // prepara o responde
    const response: IResponse = { success: false, message: err.message, type: 'ErrorGetCanBuildDeploy' };

    // retorna
    return res.status(BAD_REQUEST).json(response);
  }
});

async function completeDeploy(project: IProject, environment: IDeploymentEnv, log: string) {
  // atualiza lastDeploy do env
  environment.lastDeploy = new Date();

  // atualiza lastRun do projeto
  project.lastRun = new Date();

  // verifica e cria o array de vers~oes
  if (!environment.versions) {
    environment.versions = [];
  }

  // insere a vers~ao na lista do env
  const version = getVersionFromLog(log);
  const ver = { version, date: new Date() };
  environment.versions.push(ver);

  // atualiza o log do env
  environment.lastLog = log;

  // salva o projeto
  await ProjectRoute.updateProject(project);
}

function getVersionFromLog(log: string): string {
  let ver = log.split('VERSION_CODE:==')[1];
  ver = ver.split(':==')[0];

  return ver;
}

function getGitUrlCheck(project: IProject): string {
  // traz a url de checagem do git

  // auth
  const auth = `-u ${project.authToken || ''}:x-oauth-basic `;

  // remove o https:// do githubRepoUrl
  const repoUrl = project.githubRepoUrl.replace(/https\:\/\/github\.com\//g, '').replace(/\.git/g, '');

  // https
  const https = 'https://api.github.com/repos/';

  // branches
  const branches = '/branches';

  // array para montar a url
  const arr = [];

  // decide o formato se é publico ou autenticado
  if (project.authToken) {
    arr.push(auth, https, repoUrl, branches);
  } else {
    arr.push(https, repoUrl, branches);
  }

  // join e retorna
  return arr.join('');
}

function getGitHubUrl(project: IProject): string {
  // traz a url do git formatada

  // remove o https:// do githubRepoUrl
  const gitUrl = project.githubRepoUrl.replace(/https\:\/\//g, '');

  // https
  const https = 'https://';

  // sufixo da autenticação
  const authSufix = ':x-oauth-basic@';

  // array para montar a url
  const arr = [];

  // decide o formato se é publico ou autenticado
  if (project.authToken) {
    arr.push(https, project.authToken, authSufix, gitUrl);
  } else {
    arr.push(https, gitUrl);
  }

  // join e retorna
  return arr.join('');
}

function validateRecivedDeploy(deployProject: DeployProject): boolean {
  if (!deployProject.projectId) {
    return false;
  } else if (!deployProject.branch) {
    return false;
  } else if (!deployProject.environment) {
    return false;
  } else {
    return true;
  }
}

function fakeDev(
  req: Request,
  res: Response,
  project: IProject,
  environment: IDeploymentEnv,
  deployProject: IDeployProject,
): void {
  res.setHeader('Content-Type', 'text/plain; charset=UTF-8');
  res.setHeader('Transfer-Encoding', 'chunked');

  let html = 'Deploy:::::::::::;';
  res.write(html);

  setTimeout(() => {
    html = JSON.stringify(project);

    res.write('\n' + html);
  }, 1000);

  setTimeout(() => {
    html = JSON.stringify(environment);

    res.write('\n' + html);
  }, 1200);

  setTimeout(() => {
    html = JSON.stringify(deployProject);

    res.write('\n' + html);
  }, 1800);

  setTimeout(() => {
    html = 'No meu xinélo da humildade eu gostaria muito de ver o Neymar e o Ganso. Por que eu acho ' +
      'que.... 11 entre 10 brasileiros gostariam. Você veja, eu já vi, parei de ver. Voltei a ver, e acho ' +
      'que o Neymar e o Ganso têm essa capacidade de fazer a gente olhar.';

    res.write('\n' + html);
  }, 2100);

  setTimeout(() => {
    html = 'A única área que eu acho, que vai exigir muita atenção nossa, e aí eu já aventei a ' +
      'hipótese de até criar um ministério. É na área de... Na área... Eu diria assim, como uma espécie de ' +
      'analogia com o que acontece na área agrícola.';

    res.write('\n' + html);
  }, 2300);

  setTimeout(() => {
    html = 'A única área que eu acho, que vai exigir muita atenção nossa, e aí eu já aventei a ' +
      'hipótese de até criar um ministério. É na área de... Na área... Eu diria assim, como uma espécie de ' +
      'analogia com o que acontece na área agrícola.';

    res.write('\n' + html);
  }, 2500);

  setTimeout(() => {
    html = 'A única área que eu acho, que vai exigir muita atenção nossa, e aí eu já aventei a ' +
      'hipótese de até criar um ministério. É na área de... Na área... Eu diria assim, como uma espécie de ' +
      'analogia com o que acontece na área agrícola.';

    res.write('\n' + html);
  }, 3000);

  setTimeout(() => {
    html = 'A única área que eu acho, que vai exigir muita atenção nossa, e aí eu já aventei a ' +
      'hipótese de até criar um ministério. É na área de... Na área... Eu diria assim, como uma espécie de ' +
      'analogia com o que acontece na área agrícola.';

    res.write('\n' + html);
  }, 5000);

  setTimeout(() => {
    html = 'Primeiro eu queria cumprimentar os internautas. -Oi Internautas! Depois dizer que o meio ' +
      'ambiente é sem dúvida nenhuma uma ameaça ao desenvolvimento sustentável. E isso significa que é uma ameaça' +
      ' pro futuro do nosso planeta e dos nossos países. O desemprego beira 20%, ou seja, 1 em cada 4 portugueses.';

    res.write('\n' + html);
  }, 7500);

  setTimeout(() => {
    html = 'Se hoje é o dia das crianças... Ontem eu disse: o dia da criança é o dia da mãe, dos pais, ' +
      'das professoras, mas também é o dia dos animais, sempre que você olha uma criança, há sempre uma ' +
      'figura oculta, que é um cachorro atrás. O que é algo muito importante!';

    res.write('\n' + html);
  }, 10000);

  setTimeout(() => {
    html = 'A população ela precisa da Zona Franca de Manaus, porque na Zona franca de Manaus, não é uma ' +
      'zona de exportação, é uma zona para o Brasil. Portanto ela tem um objetivo, ela evita o desmatamento, que ' +
      'é altamente lucravito. Derrubar arvores da natureza é muito lucrativo!';

    res.write('\n' + html);
  }, 12300);

  setTimeout(() => {
    html = 'Todos as descrições das pessoas são sobre a humanidade do atendimento, a pessoa pega no pulso, ' +
      'examina, olha com carinho. Então eu acho que vai ter outra coisa, que os médicos cubanos trouxeram pro ' +
      'brasil, um alto grau de humanidade.';

    res.write('\n' + html);
  }, 15400);

  setTimeout(() => {
    res.end('OK');
  }, 16800);
}
