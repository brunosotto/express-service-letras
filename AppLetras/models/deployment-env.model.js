"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DeploymentEnv {
    constructor(nameOrDeploymentEnv, port, lastDeploy, lastLog, versions) {
        if (typeof nameOrDeploymentEnv === 'string') {
            this.name = nameOrDeploymentEnv;
            this.port = port;
            this.lastDeploy = lastDeploy;
            this.lastLog = lastLog;
            this.versions = versions;
        }
        else {
            this.name = nameOrDeploymentEnv.name;
            this.port = nameOrDeploymentEnv.port;
            this.lastDeploy = nameOrDeploymentEnv.lastDeploy;
            this.lastLog = nameOrDeploymentEnv.lastLog;
            this.versions = nameOrDeploymentEnv.versions;
        }
    }
}
exports.DeploymentEnv = DeploymentEnv;
