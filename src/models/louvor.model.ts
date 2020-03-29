export interface ILouvor {
  id?: string;
  name: string;
  text: string;
}

export class Louvor implements ILouvor {
  public id?: string;
  public name: string;
  public text: string;

  constructor(
    nameOrLouvor: string | ILouvor,
    text?: string,
  ) {
    if (typeof nameOrLouvor === 'string') {

      this.name = nameOrLouvor;
      this.text = text;

    } else {

      this.id = nameOrLouvor.id;
      this.name = nameOrLouvor.name;
      this.text = nameOrLouvor.text;

    }
  }
}
