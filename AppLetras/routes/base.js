"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const louvor_router_1 = require("./louvor/louvor.router");
const config_router_1 = require("./config-router/config.router");
const text_router_1 = require("./text/text.router");
const http_status_codes_1 = require("http-status-codes");
class BaseRouter {
    constructor(app, io) {
        this.app = app;
        this.io = io;
        this.router = express_1.Router();
        this.configureRoutes();
        this.configure404();
    }
    configureRoutes() {
        const louvorRoute = new louvor_router_1.LouvorRoute();
        this.router.use('/louvor', louvorRoute.singular);
        this.router.use('/louvores', louvorRoute.plural);
        const configRoute = new config_router_1.ConfigRoute();
        this.router.use('/config', configRoute.singular);
        this.router.use('/configs', configRoute.plural);
        const textRoute = new text_router_1.TextRoute(this.app, this.io);
        this.router.use('/text', textRoute.route);
    }
    configure404() {
        this.router.all('/*', (req, res) => {
            return res.status(http_status_codes_1.NOT_FOUND).json({
                statusCode: 404,
                error: 'Not Found',
                message: 'Not Found',
            });
        });
    }
}
exports.BaseRouter = BaseRouter;
