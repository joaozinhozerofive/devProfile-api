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
exports.SessionsController = void 0;
const AppError_1 = require("../utils/AppError");
const index_1 = require("../prisma/index");
const bcryptjs_1 = require("bcryptjs");
const jsonwebtoken_1 = require("jsonwebtoken");
const auth_1 = require("../configs/auth");
class SessionsController {
    create(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = request.body;
            const user = yield index_1.prisma.user.findFirst({
                where: {
                    email: email
                },
            });
            if (!email || !password) {
                throw new AppError_1.AppError("Preencha todos os campos, por favor.");
            }
            if (!user) {
                throw new AppError_1.AppError("Usuário e/ou senha incorretos. ");
            }
            const passwordMatched = yield (0, bcryptjs_1.compare)(password, user.password);
            if (!passwordMatched) {
                throw new AppError_1.AppError("Usuário e/ou senha incorretos. ");
            }
            const { secret, expiresIn } = auth_1.authSecrets.jwt;
            const token = (0, jsonwebtoken_1.sign)({}, secret, {
                subject: String(user.id),
                expiresIn
            });
            return response.json({ user, token });
        });
    }
}
exports.SessionsController = SessionsController;
