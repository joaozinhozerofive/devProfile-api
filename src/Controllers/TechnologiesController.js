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
exports.TechnologiesController = void 0;
const AppError_1 = require("../utils/AppError");
const index_1 = require("../prisma/index");
class TechnologiesController {
    update(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { technologies } = request.body;
            const user_id = request.user.id;
            const technologiesExists = yield index_1.prisma.technologie.findFirst({
                where: {
                    user_id
                }
            });
            if (!technologies) {
                throw new AppError_1.AppError("Por favor, insira ao menos 1 tecnologia");
            }
            if (technologiesExists) {
                yield index_1.prisma.technologie.deleteMany({
                    where: {
                        user_id
                    }
                });
            }
            try {
                technologies.map((technologie) => __awaiter(this, void 0, void 0, function* () {
                    return yield index_1.prisma.technologie.createMany({
                        data: {
                            name: technologie.name,
                            user_id,
                            Updated_at: new Date(),
                        }
                    });
                }));
                return response.json({ message: "Tecnologias atualizadas com sucesso." });
            }
            catch (_a) {
                throw new AppError_1.AppError("Não foi possível atualizar as tecnologias");
            }
        });
    }
    show(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { user_id } = request.params;
                const technologies = yield index_1.prisma.technologie.findMany({
                    where: {
                        user_id: Number(user_id)
                    },
                    select: {
                        id: true,
                        name: true
                    }
                });
                return response.json(technologies);
            }
            catch (_a) {
                throw new AppError_1.AppError("Não foi possível encontrar tecnologias");
            }
        });
    }
}
exports.TechnologiesController = TechnologiesController;
