"use strict";
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
exports.addVersionBumpTag = void 0;
const exec_1 = require("@actions/exec");
function addVersionBumpTag({ branch, tagName }) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield (0, exec_1.exec)(`git pull origin ${branch} --rebase`);
            yield (0, exec_1.exec)(`git tag "${tagName}"`);
            yield (0, exec_1.exec)('git push origin --tags');
        }
        catch (err) {
            console.log(`Failed to create create tag ${tagName}`);
            // core.setFailed(err.message)
            // console.log(err)
            // process.exit(1)
        }
    });
}
exports.addVersionBumpTag = addVersionBumpTag;
