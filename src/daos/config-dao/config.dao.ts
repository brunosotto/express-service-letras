import { IConfig } from './../../models/config.model';
import { FileDao } from './../file-db/file-dao';

interface IConfigDao {
  getAll: () => Promise<IConfig[]>;
  get: (id: string) => Promise<IConfig>;
  add: (projet: IConfig) => Promise<string>;
  update: (config: IConfig) => Promise<void>;
  delete: (id: string) => Promise<void>;
}

export class ConfigDao extends FileDao implements IConfigDao {
  private readonly collection: string = 'configs';

  public async getAll(): Promise<IConfig[]> {
    return await super.readAllData(this.collection);
  }

  public async get(id: string): Promise<IConfig> {
    return await super.readData(this.collection, id);
  }

  public async add(config: IConfig): Promise<string> {
    return await super.createData(this.collection, config);
  }

  public async update(config: IConfig): Promise<void> {
    await super.updateData(this.collection, config);
  }

  public async delete(id: string): Promise<void> {
    await super.deleteData(this.collection, id);
  }
}
