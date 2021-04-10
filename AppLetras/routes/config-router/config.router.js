"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const logger_1 = require("./../../shared/logger");
const config_dao_1 = require("./../../daos/config-dao/config.dao");
const config_model_1 = require("./../../models/config.model");
const express_1 = require("express");
const http_status_codes_1 = require("http-status-codes");
class ConfigRoute {
    constructor() {
        this.paramMissingError = 'One or more of the required parameters was missing.';
        this.singular = express_1.Router();
        this.plural = express_1.Router();
        this.configDao = new config_dao_1.ConfigDao();
        this.configure();
        this.setPluralGet();
        this.setSingularGet();
        this.setSingularPost();
        this.setSingularPut();
        this.setSingularDelete();
    }
    configure() {
        this.defaultConfig = new config_model_1.Config({
            top: false,
            size: 2.5,
            pad: 1,
        });
        this.getConfigsPath = '';
        this.getConfigPath = '/:id';
        this.addConfigPath = '';
        this.updateConfigPath = '/:id';
        this.deleteConfigPath = '/:id';
    }
    setPluralGet() {
        this.plural.get(this.getConfigsPath, (req, res) => tslib_1.__awaiter(this, void 0, void 0, function* () { return this.listaConfig(req, res); }));
    }
    listaConfig(req, res) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                const configs = yield this.configDao.getAll();
                if (!configs.length) {
                    configs.push(this.defaultConfig);
                }
                return res.status(http_status_codes_1.OK).json(configs);
            }
            catch (err) {
                logger_1.wLogger.error(err.message, err);
                const response = {
                    success: false,
                    message: err.message,
                    type: 'ErrorListConfigs',
                };
                return res.status(http_status_codes_1.BAD_REQUEST).json(response);
            }
        });
    }
    getFirstConfig() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const lista = yield this.configDao.getAll();
            return (lista || [])[0] || this.defaultConfig;
        });
    }
    setSingularGet() {
        this.singular.get(this.getConfigPath, (req, res) => tslib_1.__awaiter(this, void 0, void 0, function* () { return this.pegaConfig(req, res); }));
    }
    pegaConfig(req, res) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const config = yield this.getConfig(id);
                return res.status(http_status_codes_1.OK).json(config);
            }
            catch (err) {
                logger_1.wLogger.error(err.message, err);
                const response = {
                    success: false,
                    message: err.message,
                    type: 'ErrorGetConfig',
                };
                return res.status(http_status_codes_1.BAD_REQUEST).json(response);
            }
        });
    }
    getConfig(id) {
        return this.configDao.get(id);
    }
    insertNewConfig(req, res) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                const config = new config_model_1.Config(req.body);
                if (!this.validateRecivedConfig(config)) {
                    throw { message: this.paramMissingError };
                }
                const id = yield this.configDao.add(config);
                return id;
            }
            catch (err) {
                logger_1.wLogger.error(err.message, err);
                const response = {
                    success: false,
                    message: err.message,
                    type: 'ErrorAddConfig',
                };
                res.status(http_status_codes_1.BAD_REQUEST).json(response);
                return null;
            }
        });
    }
    setSingularPost() {
        this.singular.post(this.addConfigPath, (req, res) => tslib_1.__awaiter(this, void 0, void 0, function* () { return this.insereConfig(req, res); }));
    }
    insereConfig(req, res) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const id = yield this.insertNewConfig(req, res);
            const response = { id, success: true };
            return res.status(http_status_codes_1.CREATED).json(response);
        });
    }
    validateRecivedConfig(config) {
        if (!config.pad && config.pad !== 0) {
            return false;
        }
        else if (!config.size && config.size !== 0) {
            return false;
        }
        else {
            return true;
        }
    }
    updateConfig(req, res) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id || req.body.id;
                const config = new config_model_1.Config(req.body);
                if (!this.validateRecivedConfig(config)) {
                    throw { message: this.paramMissingError };
                }
                config.id = id;
                yield this.update(config);
                return;
            }
            catch (err) {
                logger_1.wLogger.error(err.message, err);
                const response = {
                    success: false,
                    message: err.message,
                    type: 'ErrorUpdateConfig',
                };
                res.status(http_status_codes_1.BAD_REQUEST).json(response);
                return;
            }
        });
    }
    setSingularPut() {
        this.singular.put(this.updateConfigPath, (req, res) => tslib_1.__awaiter(this, void 0, void 0, function* () { return this.atualizaConfig(req, res); }));
    }
    atualizaConfig(req, res) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.updateConfig(req, res);
            const response = { success: true };
            return res.status(http_status_codes_1.OK).json(response);
        });
    }
    update(config) {
        return this.configDao.update(config);
    }
    setSingularDelete() {
        this.singular.delete(this.deleteConfigPath, (req, res) => tslib_1.__awaiter(this, void 0, void 0, function* () { return this.excluiConfig(req, res); }));
    }
    excluiConfig(req, res) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                yield this.configDao.delete(id);
                const response = { success: true };
                return res.status(http_status_codes_1.OK).json(response);
            }
            catch (err) {
                logger_1.wLogger.error(err.message, err);
                const response = {
                    success: false,
                    message: err.message,
                    type: 'ErrorDeleteConfig',
                };
                return res.status(http_status_codes_1.BAD_REQUEST).json(response);
            }
        });
    }
}
exports.ConfigRoute = ConfigRoute;
