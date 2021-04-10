"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DeployProject {
    constructor(projectIdOrObject, environment, branch) {
        if (typeof projectIdOrObject === 'string') {
            this.projectId = projectIdOrObject;
            this.environment = environment;
            this.branch = branch;
        }
        else {
            this.projectId = projectIdOrObject.projectId;
            this.environment = projectIdOrObject.environment;
            this.branch = projectIdOrObject.branch;
        }
    }
}
exports.DeployProject = DeployProject;
