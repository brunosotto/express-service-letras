"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const cookie_parser_1 = tslib_1.__importDefault(require("cookie-parser"));
const express_1 = tslib_1.__importDefault(require("express"));
const socket_io_1 = tslib_1.__importDefault(require("socket.io"));
const morgan_1 = tslib_1.__importDefault(require("morgan"));
const path_1 = tslib_1.__importDefault(require("path"));
const base_1 = require("./routes/base");
const http_1 = require("http");
const logger_1 = require("./shared/logger");
const constants_1 = require("./constants");
const open_1 = tslib_1.__importDefault(require("open"));
const cors_1 = tslib_1.__importDefault(require("cors"));
class AppServer {
    constructor() {
        this.app = express_1.default();
        this.server = http_1.createServer(this.app);
        this.io = socket_io_1.default(this.server);
        this.port = Number(process.env.PORT || 3000);
        this.configureApp();
        this.listen();
    }
    configureApp() {
        this.app.use(cors_1.default());
        this.app.options('*', cors_1.default());
        this.app.use(morgan_1.default('dev'));
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.urlencoded({ extended: true }));
        this.app.use(cookie_parser_1.default());
        const baseRouter = new base_1.BaseRouter(this.app, this.io);
        this.app.use('/api', baseRouter.router);
        const staticDir = path_1.default.join(__dirname, 'public');
        this.app.use(express_1.default.static(staticDir));
        const viewsDir = path_1.default.join(__dirname, 'views');
        this.app.set('views', viewsDir);
        this.app.get('/*', (req, res) => {
            res.sendFile('404.html', { root: viewsDir });
        });
    }
    listen() {
        this.server.listen(this.port, () => {
            logger_1.wLogger.info('Express server started on port: ' + this.port);
            open_1.default(`http://localhost:${this.port}`);
        });
        this.io.on(constants_1.SocketEvent.CONNECT, (socket) => {
            logger_1.wLogger.info('Connected client with id: ' + socket.client.id);
            const lastData = this.app.get('data-show');
            if (lastData) {
                socket.emit('data-show', lastData);
            }
            socket.on(constants_1.SocketEvent.DISCONNECT, () => {
                logger_1.wLogger.info('Client disconnected: ' + socket.client.id);
            });
        });
    }
}
AppServer.PORT = 8080;
exports.AppServer = AppServer;
