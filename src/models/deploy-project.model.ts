export interface IDeployProject {
  projectId: string;
  environment: string;
  branch: string;
}

export class DeployProject implements IDeployProject {
  public projectId: string;
  public environment: string;
  public branch: string;

  constructor(
    projectIdOrObject: string | IDeployProject,
    environment?: string,
    branch?: string,
  ) {
    if (typeof projectIdOrObject === 'string') {

      this.projectId = projectIdOrObject;
      this.environment = environment;
      this.branch = branch;

    } else {

      this.projectId = projectIdOrObject.projectId;
      this.environment = projectIdOrObject.environment;
      this.branch = projectIdOrObject.branch;

    }
  }
}
