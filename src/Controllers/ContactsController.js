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
exports.ContactsController = void 0;
const AppError_1 = require("../utils/AppError");
const index_1 = require("../prisma/index");
class ContactsController {
    update(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, github, linkedin, whatsapp } = request.body;
            const user_id = request.user.id;
            if (!email || !github || !linkedin || !whatsapp) {
                throw new AppError_1.AppError("Por favor, informe todas as opções de contato");
            }
            try {
                const contactsExists = yield index_1.prisma.contact.findFirst({
                    where: {
                        user_id: user_id
                    }
                });
                if (contactsExists) {
                    yield index_1.prisma.contact.update({
                        where: {
                            id: contactsExists.id
                        },
                        data: {
                            email: email !== null && email !== void 0 ? email : contactsExists.email,
                            github: github !== null && github !== void 0 ? github : contactsExists.github,
                            linkedin: linkedin !== null && linkedin !== void 0 ? linkedin : contactsExists.linkedin,
                            whatsapp: whatsapp !== null && whatsapp !== void 0 ? whatsapp : contactsExists.whatsapp,
                            Updated_at: new Date()
                        }
                    });
                }
                else {
                    yield index_1.prisma.contact.create({
                        data: {
                            user_id,
                            email,
                            github,
                            linkedin,
                            whatsapp,
                        }
                    });
                }
                return response.json({ message: "Contatos atualizados com sucesso. " });
            }
            catch (_a) {
                throw new AppError_1.AppError("Não foi possível editar informações de contato");
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
                    throw new AppError_1.AppError("Usuário não encontrado");
                }
                const userContacts = yield index_1.prisma.contact.findFirst({
                    where: {
                        user_id: user.id
                    },
                });
                if (!userContacts) {
                    throw new AppError_1.AppError("Não foi possível encontrar contatos para este usuário.");
                }
                return response.json(userContacts);
            }
            catch (_a) {
                throw new AppError_1.AppError("Não foi possível obter informações de contato.");
            }
        });
    }
}
exports.ContactsController = ContactsController;
