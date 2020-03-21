import { IDeployedVersions } from './deployed-versions.model';

export interface IDeploymentEnv {
  name: string;
  port: number;
  lastDeploy: Date;
  lastLog: string;
  versions: IDeployedVersions[];
}

export class DeploymentEnv implements IDeploymentEnv {
  public name: string;
  public port: number;
  public lastDeploy: Date;
  public lastLog: string;
  public versions: IDeployedVersions[];

  constructor(
    nameOrDeploymentEnv: string | IDeploymentEnv,
    port?: number,
    lastDeploy?: Date,
    lastLog?: string,
    versions?: IDeployedVersions[],
  ) {
    if (typeof nameOrDeploymentEnv === 'string') {

      this.name = nameOrDeploymentEnv;
      this.port = port;
      this.lastDeploy = lastDeploy;
      this.lastLog = lastLog;
      this.versions = versions;

    } else {

      this.name = nameOrDeploymentEnv.name;
      this.port = nameOrDeploymentEnv.port;
      this.lastDeploy = nameOrDeploymentEnv.lastDeploy;
      this.lastLog = nameOrDeploymentEnv.lastLog;
      this.versions = nameOrDeploymentEnv.versions;

    }
  }

}
