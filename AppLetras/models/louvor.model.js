"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Louvor {
    constructor(nameOrLouvor, text, arr) {
        if (typeof nameOrLouvor === 'string') {
            this.name = nameOrLouvor;
            this.text = text;
            this.arr = arr;
        }
        else {
            this.id = nameOrLouvor.id;
            this.name = nameOrLouvor.name;
            this.text = nameOrLouvor.text;
            this.arr = nameOrLouvor.arr;
        }
    }
}
exports.Louvor = Louvor;
