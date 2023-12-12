"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadConfig = void 0;
const multer_1 = __importDefault(require("multer"));
const crypto_1 = __importDefault(require("crypto"));
const path_1 = __importDefault(require("path"));
const TMP_FOLDER = path_1.default.resolve(__dirname, "..", "..", "tmp");
const uploadConfig = {
    storage: multer_1.default.diskStorage({
        destination: TMP_FOLDER,
        filename(request, file, callback) {
            const fileHash = crypto_1.default.randomBytes(16).toString("hex");
            const filename = `${fileHash}-${file.originalname}`;
            return callback(null, filename);
        }
    })
};
exports.uploadConfig = uploadConfig;
