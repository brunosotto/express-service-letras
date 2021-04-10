"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("./logger");
exports.pErr = (err) => {
    if (err) {
        logger_1.wLogger.error(err);
    }
};
exports.getRandomInt = () => {
    return Math.floor(Math.random() * 1000000000000);
};
exports.getRandomId = () => {
    const rand = exports.getRandomInt();
    return rand.toString(16);
};
