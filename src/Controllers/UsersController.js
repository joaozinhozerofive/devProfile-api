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
exports.UsersController = void 0;
const AppError_1 = require("../utils/AppError");
const index_1 = require("../prisma/index");
const bcryptjs_1 = require("bcryptjs");
class UsersController {
    create(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, email, password, ocupation } = request.body;
            const missingPasswordLength = Math.abs(password.length - 6);
            const hashedPassword = yield (0, bcryptjs_1.hash)(password, 8);
            const user = yield index_1.prisma.user.findFirst({
                where: {
                    email: email
                },
            });
            if (!name || !email || !password || !ocupation) {
                throw new AppError_1.AppError("Por favor, insira todos os dados.");
            }
            if (user) {
                throw new AppError_1.AppError("Este email já está cadastrado");
            }
            if (password.length < 6) {
                throw new AppError_1.AppError(`Ops! Faltou ${missingPasswordLength} caracteres na sua senha`);
            }
            try {
                yield index_1.prisma.user.create({
                    data: {
                        name: name,
                        email: email,
                        password: hashedPassword,
                        ocupation
                    }
                });
                return response.json({ message: "Usuário criado com sucesso" });
            }
            catch (_a) {
                throw new AppError_1.AppError("Falha ao criar usuário");
            }
        });
    }
    update(request, response) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const { name, email, password, old_password, ocupation, about } = request.body;
            const user_id = request.user.id;
            const img = (_a = request.file) === null || _a === void 0 ? void 0 : _a.filename;
            const user = yield index_1.prisma.user.findFirst({
                where: {
                    id: user_id
                }
            });
            user.name = name !== null && name !== void 0 ? name : user.name;
            user.email = email !== null && email !== void 0 ? email : user.email,
                user.about = about !== null && about !== void 0 ? about : user.about,
                user.ocupation = ocupation !== null && ocupation !== void 0 ? ocupation : user.ocupation;
            user.img = img !== null && img !== void 0 ? img : user.img;
            user.Updated_at = new Date();
            const checkEmailExists = yield index_1.prisma.user.findFirst({
                where: {
                    email: user.email
                }
            });
            if (checkEmailExists && checkEmailExists.id !== user.id) {
                throw new AppError_1.AppError("Este e-mail já está em uso");
            }
            if (password && !old_password) {
                throw new AppError_1.AppError("Você precisa informar a senha antiga para definir a nova senha.");
            }
            if (password && old_password) {
                const checkOldPassword = yield (0, bcryptjs_1.compare)(old_password, user.password);
                if (!checkOldPassword) {
                    throw new AppError_1.AppError("A senha antiga não confere");
                }
                user.password = password ? yield (0, bcryptjs_1.hash)(password, 8) : user.password;
            }
            try {
                yield index_1.prisma.user.update({
                    where: {
                        id: user_id
                    },
                    data: Object.assign({}, user)
                });
                return response.json({ user });
            }
            catch (_b) {
                throw new AppError_1.AppError("Não foi possível atualizar seus dados.");
            }
        });
    }
    index(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name } = request.query;
                const users = yield index_1.prisma.user.findMany({
                    where: {
                        name: {
                            contains: name,
                            mode: "insensitive"
                        }
                    },
                    select: {
                        id: true,
                        name: true,
                        ocupation: true,
                        about: true,
                        img: true
                    },
                });
                return response.json(users);
            }
            catch (_a) {
                throw new AppError_1.AppError("Não foi possível obter informações dos usuário");
            }
        });
    }
    show(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { user_id } = request.params;
                const user = yield index_1.prisma.user.findFirst({
                    where: {
                        id: Number(user_id)
                    }
                });
                if (!user) {
                    throw new AppError_1.AppError("Usário não encontrado");
                }
                return response.json(user);
            }
            catch (_a) {
                throw new AppError_1.AppError("Não foi possível obter informações do usuário");
            }
        });
    }
    delete(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const user_id = request.user.id;
            try {
                const user = yield index_1.prisma.user.findFirst({
                    where: {
                        id: user_id
                    }
                });
                if (!user) {
                    throw new AppError_1.AppError("Usuário não encontrado");
                }
                yield index_1.prisma.user.delete({
                    where: {
                        id: user.id
                    }
                });
                return response.json("Portfólio excluído com sucesso!");
            }
            catch (_a) {
                throw new AppError_1.AppError("Não foi possível excluir portifólio");
            }
        });
    }
}
exports.UsersController = UsersController;
