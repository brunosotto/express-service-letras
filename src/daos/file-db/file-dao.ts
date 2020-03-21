import { getRandomId } from './../../shared/misc';
import jsonfile from 'jsonfile';
import fs from 'fs';

export class FileDao {

  private readonly dbFilePath = '../EasyCi-DB.json';

  private openDb(): Promise<any> {
    this.checkFile();
    return jsonfile.readFile(this.dbFilePath);
  }

  private checkFile(): void {
    if (!fs.existsSync(this.dbFilePath)) {

      const data = JSON.stringify({}, null, 2);
      fs.writeFileSync(this.dbFilePath, data);

    }
  }

  private async saveDb<T>(db: T): Promise<void> {
    await jsonfile.writeFile(this.dbFilePath, db, { spaces: 2 });
  }

  private createCollection(collection: string, db: any): void {
    if (!db[collection]) {
      db[collection] = [];
    }
  }

  public async readAllData<T>(collection: string): Promise<T[]> {
    const db = await this.openDb();
    this.createCollection(collection, db);

    return db[collection];
  }

  public async readData<T>(collection: string, id: string): Promise<T> {
    const db = await this.openDb();
    this.createCollection(collection, db);

    const el: T = db[collection].find((v: any) => v.id === id);

    if (el) {
      return el;
    }

    throw new Error(collection + ' not found');
  }

  protected async createData(collection: string, el: any): Promise<string> {
    const db = await this.openDb();
    this.createCollection(collection, db);

    el.id = getRandomId();

    db[collection].push(el);

    await this.saveDb(db);

    return el.id;
  }

  public async updateData(collection: string, el: any): Promise<void> {
    const db = await this.openDb();
    this.createCollection(collection, db);

    for (let i = 0; i < db[collection].length; i++) {
      if (db[collection][i].id === el.id) {
        db[collection][i] = el;
        await this.saveDb(db);
        return;
      }
    }
    throw new Error(collection + 'not found');
  }

  public async deleteData(collection: string, id: string): Promise<void> {
    const db = await this.openDb();
    this.createCollection(collection, db);

    for (let i = 0; i < db[collection].length; i++) {
      if (db[collection][i].id === id) {
        db[collection].splice(i, 1);
        await this.saveDb(db);
        return;
      }
    }

    throw new Error(collection + ' not found');
  }
}
