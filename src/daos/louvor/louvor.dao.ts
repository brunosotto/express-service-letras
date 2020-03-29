import { ILouvor } from './../../models/louvor.model';
import { FileDao } from './../file-db/file-dao';

interface ILouvorDao {
  getAll: () => Promise<ILouvor[]>;
  get: (id: string) => Promise<ILouvor>;
  add: (projet: ILouvor) => Promise<string>;
  update: (louvor: ILouvor) => Promise<void>;
  delete: (id: string) => Promise<void>;
}

export class LouvorDao extends FileDao implements ILouvorDao {
  private readonly collection: string = 'louvores';

  public async getAll(): Promise<ILouvor[]> {
    return await super.readAllData(this.collection);
  }

  public async get(id: string): Promise<ILouvor> {
    return await super.readData(this.collection, id);
  }

  public async add(louvor: ILouvor): Promise<string> {
    return await super.createData(this.collection, louvor);
  }

  public async update(louvor: ILouvor): Promise<void> {
    await super.updateData(this.collection, louvor);
  }

  public async delete(id: string): Promise<void> {
    await super.deleteData(this.collection, id);
  }
}
