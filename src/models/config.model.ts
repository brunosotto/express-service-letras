export interface IConfig {
  id?: string;
  top: boolean;
  size: number;
  pad: number;
}

export class Config implements IConfig {
  public id?: string;
  public top: boolean;
  public size: number;
  public pad: number;

  constructor(
    idOrConfig: string | IConfig,
    top?: boolean,
    size?: number,
    pad?: number,
  ) {
    if (typeof idOrConfig === 'string') {

      this.id = idOrConfig;
      this.top = top;
      this.size = size;
      this.pad = pad;

    } else {

      this.id = idOrConfig.id;
      this.top = idOrConfig.top;
      this.size = idOrConfig.size;
      this.pad = idOrConfig.pad;

    }
  }
}
