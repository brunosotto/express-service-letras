export interface ILouvor {
  id?: string;
  name: string;
  text: string;
  arr: string[];
}

export class Louvor implements ILouvor {
  public id?: string;
  public name: string;
  public text: string;
  public arr: string[];

  constructor(
    nameOrLouvor: string | ILouvor,
    text?: string,
    arr?: string[],
  ) {
    if (typeof nameOrLouvor === 'string') {

      this.name = nameOrLouvor;
      this.text = text;
      this.arr = arr;

    } else {

      this.id = nameOrLouvor.id;
      this.name = nameOrLouvor.name;
      this.text = nameOrLouvor.text;
      this.arr = nameOrLouvor.arr;

    }
  }
}
