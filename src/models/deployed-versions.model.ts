export interface IDeployedVersions {
  version: string;
  date: Date;
}

export class DeployedVersions implements IDeployedVersions {
  public version: string;
  public date: Date;

  constructor(
    version: string | IDeployedVersions,
    date?: Date,
  ) {
    if (typeof version === 'string') {

      this.version = version;
      this.date = date;

    } else {

      this.version = version.version;
      this.date = version.date;

    }
  }

}
