"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const file_dao_1 = require("./../file-db/file-dao");
class ConfigDao extends file_dao_1.FileDao {
    constructor() {
        super(...arguments);
        this.collection = 'configs';
    }
    getAll() {
        const _super = Object.create(null, {
            readAllData: { get: () => super.readAllData }
        });
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield _super.readAllData.call(this, this.collection);
        });
    }
    get(id) {
        const _super = Object.create(null, {
            readData: { get: () => super.readData }
        });
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield _super.readData.call(this, this.collection, id);
        });
    }
    add(config) {
        const _super = Object.create(null, {
            createData: { get: () => super.createData }
        });
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield _super.createData.call(this, this.collection, config);
        });
    }
    update(config) {
        const _super = Object.create(null, {
            updateData: { get: () => super.updateData }
        });
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield _super.updateData.call(this, this.collection, config);
        });
    }
    delete(id) {
        const _super = Object.create(null, {
            deleteData: { get: () => super.deleteData }
        });
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield _super.deleteData.call(this, this.collection, id);
        });
    }
}
exports.ConfigDao = ConfigDao;
