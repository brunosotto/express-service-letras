"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DeployedVersions {
    constructor(version, date) {
        if (typeof version === 'string') {
            this.version = version;
            this.date = date;
        }
        else {
            this.version = version.version;
            this.date = version.date;
        }
    }
}
exports.DeployedVersions = DeployedVersions;
