import { IDeploymentEnv } from './deployment-env.model';

export interface IProject {
  id?: string;
  name: string;
  enable: boolean;
  script: string;
  deploymentPath: string;
  lastRun: Date;
  deploymentEnvs: IDeploymentEnv[];
  githubRepoUrl: string;
  authToken?: string;
}

export class Project implements IProject {
  public id?: string;
  public name: string;
  public enable: boolean;
  public script: string;
  public deploymentPath: string;
  public lastRun: Date;
  public deploymentEnvs: IDeploymentEnv[];
  public githubRepoUrl: string;
  public authToken?: string;

  constructor(
    nameOrProject: string | IProject,
    enable?: boolean,
    script?: string,
    deploymentPath?: string,
    lastRun?: Date,
    deploymentEnvs?: IDeploymentEnv[],
    githubRepoUrl?: string,
    authToken?: string,
  ) {
    if (typeof nameOrProject === 'string') {

      this.name = nameOrProject;
      this.enable = enable;
      this.script = script;
      this.deploymentPath = deploymentPath;
      this.lastRun = lastRun;
      this.deploymentEnvs = deploymentEnvs;
      this.githubRepoUrl = githubRepoUrl;
      this.authToken = authToken;

    } else {

      this.id = nameOrProject.id;
      this.name = nameOrProject.name;
      this.enable = nameOrProject.enable;
      this.script = nameOrProject.script;
      this.deploymentPath = nameOrProject.deploymentPath;
      this.lastRun = nameOrProject.lastRun;
      this.deploymentEnvs = nameOrProject.deploymentEnvs;
      this.githubRepoUrl = nameOrProject.githubRepoUrl;
      this.authToken = nameOrProject.authToken;

    }
  }
}
