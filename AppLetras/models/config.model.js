"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Config {
    constructor(idOrConfig, top, size, pad) {
        if (typeof idOrConfig === 'string') {
            this.id = idOrConfig;
            this.top = top;
            this.size = size;
            this.pad = pad;
        }
        else {
            this.id = idOrConfig.id;
            this.top = idOrConfig.top;
            this.size = idOrConfig.size;
            this.pad = idOrConfig.pad;
        }
    }
}
exports.Config = Config;
