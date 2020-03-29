import { IConfig } from './config.model';

export interface IText extends IConfig {
  text: string;
}

export class TextModel implements IText {
  public id?: string;
  public top: boolean;
  public size: number;
  public pad: number;
  public text: string;

  constructor(
    idOrConfig: string | IText,
    top?: boolean,
    size?: number,
    pad?: number,
    text?: string,
  ) {
    if (typeof idOrConfig === 'string') {

      this.id = idOrConfig;
      this.top = top;
      this.size = size;
      this.pad = pad;
      this.text = text;

    } else {

      this.id = idOrConfig.id;
      this.top = idOrConfig.top;
      this.size = idOrConfig.size;
      this.pad = idOrConfig.pad;
      this.text = idOrConfig.text;

    }
  }
}
