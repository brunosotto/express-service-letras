import { IProject } from './../../models/project.model';
import { FileDao } from './../file-db/file-dao';

interface IProjectDao {
  getAll: () => Promise<IProject[]>;
  get: (id: string) => Promise<IProject>;
  add: (projet: IProject) => Promise<string>;
  update: (project: IProject) => Promise<void>;
  delete: (id: string) => Promise<void>;
}

export class ProjectDao extends FileDao implements IProjectDao {
  private readonly collection: string = 'projects';

  public async getAll(): Promise<IProject[]> {
    return await super.readAllData(this.collection);
  }

  public async get(id: string): Promise<IProject> {
    return await super.readData(this.collection, id);
  }

  public async add(project: IProject): Promise<string> {
    return await super.createData(this.collection, project);
  }

  public async update(project: IProject): Promise<void> {
    await super.updateData(this.collection, project);
  }

  public async delete(id: string): Promise<void> {
    await super.deleteData(this.collection, id);
  }
}
