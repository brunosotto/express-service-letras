"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = require("express");
const http_status_codes_1 = require("http-status-codes");
const config_router_1 = require("../config-router/config.router");
const text_model_1 = require("../../models/text.model");
class TextRoute {
    constructor(app, io) {
        this.app = app;
        this.io = io;
        this.getTextPath = '/';
        this.configRoute = new config_router_1.ConfigRoute();
        this.route = express_1.Router();
        this.setData();
        this.configureGet();
        this.setRoutePost();
    }
    setData() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const config = yield this.configRoute.getFirstConfig();
            this.data = new text_model_1.TextModel(Object.assign({}, config, { text: '...' }));
            this.avisaSocket();
        });
    }
    configureGet() {
        this.route.get(this.getTextPath, (req, res) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            return res.status(http_status_codes_1.OK).json(this.data);
        }));
    }
    setRoutePost() {
        this.route.post(this.getTextPath, (req, res) => tslib_1.__awaiter(this, void 0, void 0, function* () { return this.postText(req, res); }));
    }
    postText(req, res) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const received = new text_model_1.TextModel(req.body);
            if (!this.configRoute.validateRecivedConfig(received)) {
                this.data.text = received.text;
                this.avisaSocket();
                return res.status(http_status_codes_1.OK).json({ id: received.id });
            }
            if (received.id) {
                yield this.configRoute.updateConfig(req, res);
            }
            else {
                received.id = yield this.configRoute.insertNewConfig(req, res);
            }
            if (!received.text) {
                received.text = this.data.text;
            }
            this.data = received;
            this.avisaSocket();
            return res.status(http_status_codes_1.OK).json({ id: received.id });
        });
    }
    avisaSocket() {
        this.app.set('data-show', this.data);
        this.io.sockets.emit('data-show', this.data);
    }
}
exports.TextRoute = TextRoute;
