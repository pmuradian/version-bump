"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupForVersionBump = void 0;
const exec_1 = require("@actions/exec");
const core = __importStar(require("@actions/core"));
function setupForVersionBump({ userName, userEmail, githubToken, githubActor, githubRepository, }) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!githubToken) {
                console.log('missing required env vars, skipping commit creation');
                core.setFailed('missing required env vars');
                return;
            }
            const REMOTE_REPO = `https://${githubActor}:${githubToken}@github.com/${githubRepository}.git`;
            const options = {
                cwd: process.env.GITHUB_WORKSPACE,
                listeners: {
                    stdline: core.debug,
                    stderr: core.debug,
                    debug: core.debug,
                },
            };
            yield (0, exec_1.exec)('git', ['config', 'user.name', `${userName}`], options);
            yield (0, exec_1.exec)('git', ['config', 'user.email', `${userEmail}`], options);
            yield (0, exec_1.exec)('git', ['remote', 'set-url', 'origin', REMOTE_REPO], options);
        }
        catch (err) {
            core.setFailed(err.message);
            console.log(err);
            process.exit(1);
        }
    });
}
exports.setupForVersionBump = setupForVersionBump;
