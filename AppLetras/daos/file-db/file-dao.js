"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const misc_1 = require("./../../shared/misc");
const jsonfile_1 = tslib_1.__importDefault(require("jsonfile"));
const fs_1 = tslib_1.__importDefault(require("fs"));
class FileDao {
    constructor() {
        this.dbFilePath = '../ServidorLetras-BD.json';
    }
    openDb() {
        this.checkFile();
        return jsonfile_1.default.readFile(this.dbFilePath);
    }
    checkFile() {
        if (!fs_1.default.existsSync(this.dbFilePath)) {
            const data = JSON.stringify({}, null, 2);
            fs_1.default.writeFileSync(this.dbFilePath, data);
        }
    }
    saveDb(db) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield jsonfile_1.default.writeFile(this.dbFilePath, db, { spaces: 2 });
        });
    }
    createCollection(collection, db) {
        if (!db[collection]) {
            db[collection] = [];
        }
    }
    readAllData(collection) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const db = yield this.openDb();
            this.createCollection(collection, db);
            return db[collection];
        });
    }
    readData(collection, id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const db = yield this.openDb();
            this.createCollection(collection, db);
            const el = db[collection].find((v) => v.id === id);
            if (el) {
                return el;
            }
            throw new Error(collection + ' not found');
        });
    }
    createData(collection, el) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const db = yield this.openDb();
            this.createCollection(collection, db);
            el.id = misc_1.getRandomId();
            db[collection].push(el);
            yield this.saveDb(db);
            return el.id;
        });
    }
    updateData(collection, el) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const db = yield this.openDb();
            this.createCollection(collection, db);
            for (let i = 0; i < db[collection].length; i++) {
                if (db[collection][i].id === el.id) {
                    db[collection][i] = el;
                    yield this.saveDb(db);
                    return;
                }
            }
            throw new Error(collection + 'not found');
        });
    }
    deleteData(collection, id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const db = yield this.openDb();
            this.createCollection(collection, db);
            for (let i = 0; i < db[collection].length; i++) {
                if (db[collection][i].id === id) {
                    db[collection].splice(i, 1);
                    yield this.saveDb(db);
                    return;
                }
            }
            throw new Error(collection + ' not found');
        });
    }
}
exports.FileDao = FileDao;
