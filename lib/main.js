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
const core = __importStar(require("@actions/core"));
const fs = __importStar(require("fs"));
const commit_1 = require("./commit");
const createTag_1 = require("./createTag");
const gitSetupHelper_1 = require("./gitSetupHelper");
const githubHelper_1 = require("./githubHelper");
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        const githubToken = process.env.GITHUB_TOKEN;
        const versionName = core.getInput('version_name');
        const versionCode = core.getInput('version_code');
        const wearableVersionName = core.getInput('wearable_version_name');
        const wearableVersionCode = core.getInput('wearable_version_code');
        const brand = core.getInput('brand');
        const region = core.getInput('region');
        const GITHUB_REF = process.env.GITHUB_REF || '';
        const branch = core.getInput('branch') ||
            process.env.BRANCH ||
            GITHUB_REF.replace('refs/heads/', '') ||
            GITHUB_REF.split('/').reverse()[0] ||
            'develop';
        if (!versionName) {
            console.log('Skipping version bump');
        }
        else {
            const versionPath = core.getInput('version_file');
            if (!fs.existsSync(versionPath)) {
                fs.writeFileSync(versionPath, '0.0.0', 'utf8');
            }
            const versionsAsString = fs.readFileSync(versionPath, 'utf8').toString().trim();
            const versionsAsList = versionsAsString.split(/\r?\n/);
            var versionNameKey = `${brand.toUpperCase()}_${region.toUpperCase()}_VERSION_NAME`;
            var versionCodeKey = `${brand.toUpperCase()}_${region.toUpperCase()}_VERSION_CODE`;
            var wearableVersionNameKey = `${brand.toUpperCase()}_WEARABLE_${region.toUpperCase()}_VERSION_NAME`;
            var wearableVersionCodeKey = `${brand.toUpperCase()}_WEARABLE_${region.toUpperCase()}_VERSION_CODE`;
            var oldVersionName = '';
            var oldVersionCode = '';
            var newVersionName = '';
            var newVersionCode = '';
            const updatedVersions = versionsAsList.map(line => {
                const splitVersionLine = line.split('=');
                if (splitVersionLine[0] == versionNameKey) {
                    oldVersionName = splitVersionLine[1];
                    splitVersionLine[1] = versionName == '' ? oldVersionName : versionName;
                    newVersionName = splitVersionLine[1];
                }
                if (splitVersionLine[0] == versionCodeKey) {
                    oldVersionCode = splitVersionLine[1];
                    splitVersionLine[1] = versionCode == '' ? `${parseInt(oldVersionCode) + 1}` : versionCode;
                    newVersionCode = splitVersionLine[1];
                }
                if (splitVersionLine[0] == wearableVersionNameKey) {
                    splitVersionLine[1] = wearableVersionName == '' ? versionName : wearableVersionName;
                }
                if (splitVersionLine[0] == wearableVersionCodeKey) {
                    splitVersionLine[1] = wearableVersionCode == '' ? `${parseInt(splitVersionLine[1]) + 1}` : wearableVersionCode;
                }
                return splitVersionLine[0] + '=' + splitVersionLine[1];
            }).join('\n');
            console.log('Old versions:');
            console.log(versionsAsString);
            console.log('New versions:');
            console.log(updatedVersions);
            console.log('Writing new version file');
            fs.writeFileSync(versionPath, updatedVersions, 'utf8');
            const prefix = brand == 'Infiniti' ? 'inf' : 'nis';
            const postfix = region == 'Nna' ? 'nna' : 'nci';
            const ccs2 = core.getInput('is_CCS2') == 'yes' ? 'ccs2' : '';
            const tagName = `${prefix}${ccs2 == '' ? postfix : ccs2}-${versionName}`;
            const commitMessage = `Bump ${brand} ${region} ${ccs2} version from ${oldVersionName} (${oldVersionCode}) to ${newVersionName} (${newVersionCode})`;
            const versionBumpBranch = `chore/${brand.toLocaleLowerCase()}-${postfix}${ccs2 == '' ? '' : '-ccs2'}-version-bump`;
            yield (0, gitSetupHelper_1.setupForVersionBump)({
                userEmail: 'octtovius@bethinklabs.com',
                userName: 'Octto Octtovius',
                githubToken: githubToken,
                githubActor: process.env.GITHUB_ACTOR,
                githubRepository: process.env.GITHUB_REPOSITORY,
            });
            yield (0, commit_1.commitVersionBump)({
                versionBumpBranch: versionBumpBranch,
                commitMessage: commitMessage,
            });
            yield (0, githubHelper_1.createAndMergeVersionBumpPullRequest)({
                versionBumpBranch: versionBumpBranch,
                commitMessage: commitMessage,
                branch: branch
            });
            yield (0, createTag_1.addVersionBumpTag)({
                branch: branch,
                tagName: tagName
            });
        }
    });
}
try {
    run();
}
catch (e) {
    console.error(e);
}
