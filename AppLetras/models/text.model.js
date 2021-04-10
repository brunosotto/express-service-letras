"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class TextModel {
    constructor(idOrConfig, top, size, pad, text) {
        if (typeof idOrConfig === 'string') {
            this.id = idOrConfig;
            this.top = top;
            this.size = size;
            this.pad = pad;
            this.text = text;
        }
        else {
            this.id = idOrConfig.id;
            this.top = idOrConfig.top;
            this.size = idOrConfig.size;
            this.pad = idOrConfig.pad;
            this.text = idOrConfig.text;
        }
    }
}
exports.TextModel = TextModel;
