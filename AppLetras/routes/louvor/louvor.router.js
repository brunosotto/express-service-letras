"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const logger_1 = require("./../../shared/logger");
const louvor_dao_1 = require("./../../daos/louvor/louvor.dao");
const louvor_model_1 = require("./../../models/louvor.model");
const express_1 = require("express");
const http_status_codes_1 = require("http-status-codes");
class LouvorRoute {
    constructor() {
        this.paramMissingError = 'One or more of the required parameters was missing.';
        this.singular = express_1.Router();
        this.plural = express_1.Router();
        this.louvorDao = new louvor_dao_1.LouvorDao();
        this.configure();
        this.setPluralGet();
        this.setSingularGet();
        this.setSingularPost();
        this.setSingularPut();
        this.setSingularDelete();
    }
    configure() {
        this.getLouvoresPath = '';
        this.getLouvorPath = '/:id';
        this.addLouvorPath = '';
        this.updateLouvorPath = '/:id';
        this.deleteLouvorPath = '/:id';
    }
    setPluralGet() {
        this.plural.get(this.getLouvoresPath, (req, res) => tslib_1.__awaiter(this, void 0, void 0, function* () { return this.listLouvor(req, res); }));
    }
    listLouvor(req, res) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                const louvores = yield this.louvorDao.getAll();
                return res.status(http_status_codes_1.OK).json(louvores);
            }
            catch (err) {
                logger_1.wLogger.error(err.message, err);
                const response = { success: false, message: err.message, type: 'ErrorListLouvores' };
                return res.status(http_status_codes_1.BAD_REQUEST).json(response);
            }
        });
    }
    setSingularGet() {
        this.singular.get(this.getLouvorPath, (req, res) => tslib_1.__awaiter(this, void 0, void 0, function* () { return this.getLouvor(req, res); }));
    }
    getLouvor(req, res) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const louvor = yield this.getLouvorById(id);
                return res.status(http_status_codes_1.OK).json(louvor);
            }
            catch (err) {
                logger_1.wLogger.error(err.message, err);
                const response = { success: false, message: err.message, type: 'ErrorGetLouvor' };
                return res.status(http_status_codes_1.BAD_REQUEST).json(response);
            }
        });
    }
    getLouvorById(id) {
        return this.louvorDao.get(id);
    }
    setSingularPost() {
        this.singular.post(this.addLouvorPath, (req, res) => tslib_1.__awaiter(this, void 0, void 0, function* () { return this.insereLouvor(req, res); }));
    }
    insereLouvor(req, res) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                const louvor = new louvor_model_1.Louvor(req.body);
                if (!this.validateRecivedLouvor(louvor)) {
                    throw { message: this.paramMissingError };
                }
                const id = yield this.louvorDao.add(louvor);
                const response = { id, success: true };
                return res.status(http_status_codes_1.CREATED).json(response);
            }
            catch (err) {
                logger_1.wLogger.error(err.message, err);
                const response = { success: false, message: err.message, type: 'ErrorAddLouvor' };
                return res.status(http_status_codes_1.BAD_REQUEST).json(response);
            }
        });
    }
    validateRecivedLouvor(louvor) {
        if (!louvor.name) {
            return false;
        }
        else if (!louvor.text) {
            return false;
        }
        else {
            return true;
        }
    }
    setSingularPut() {
        this.singular.put(this.updateLouvorPath, (req, res) => tslib_1.__awaiter(this, void 0, void 0, function* () { return this.alteraLouvor(req, res); }));
    }
    alteraLouvor(req, res) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const louvor = new louvor_model_1.Louvor(req.body);
                if (!this.validateRecivedLouvor(louvor)) {
                    throw { message: this.paramMissingError };
                }
                louvor.id = id;
                yield this.updateLouvor(louvor);
                const response = { success: true };
                return res.status(http_status_codes_1.OK).json(response);
            }
            catch (err) {
                logger_1.wLogger.error(err.message, err);
                const response = { success: false, message: err.message, type: 'ErrorUpdateLouvor' };
                return res.status(http_status_codes_1.BAD_REQUEST).json(response);
            }
        });
    }
    updateLouvor(louvor) {
        return this.louvorDao.update(louvor);
    }
    setSingularDelete() {
        this.singular.delete(this.deleteLouvorPath, (req, res) => tslib_1.__awaiter(this, void 0, void 0, function* () { return this.excluiLouvor(req, res); }));
    }
    excluiLouvor(req, res) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                yield this.louvorDao.delete(id);
                const response = { success: true };
                return res.status(http_status_codes_1.OK).json(response);
            }
            catch (err) {
                logger_1.wLogger.error(err.message, err);
                const response = { success: false, message: err.message, type: 'ErrorDeleteLouvor' };
                return res.status(http_status_codes_1.BAD_REQUEST).json(response);
            }
        });
    }
}
exports.LouvorRoute = LouvorRoute;
