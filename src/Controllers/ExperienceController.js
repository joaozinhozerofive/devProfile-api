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
exports.ExperienceController = void 0;
const AppError_1 = require("../utils/AppError");
const index_1 = require("../prisma/index");
class ExperienceController {
    create(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { companyName, city, FU, startDate, endDate, description } = request.body;
            const user_id = request.user.id;
            if (!companyName || !city || !FU || !startDate || !endDate || !description) {
                throw new AppError_1.AppError("Por favor preencha todos os campos.");
            }
            try {
                const experience = yield index_1.prisma.work.create({
                    data: {
                        user_id,
                        companyName,
                        city,
                        FU,
                        startDate,
                        endDate,
                        description
                    }
                });
                return response.json(experience);
            }
            catch (_a) {
                throw new AppError_1.AppError("Não foi possível criar experiência");
            }
        });
    }
    update(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { companyName, city, FU, startDate, endDate, description } = request.body;
            const { experience_id } = request.params;
            const user_id = request.user.id;
            const experience = yield index_1.prisma.work.findFirst({
                where: {
                    id: Number(experience_id)
                }
            });
            if (!experience) {
                throw new AppError_1.AppError("Experiência não encontrada");
            }
            const userIdMatched = experience.user_id === user_id;
            if (!userIdMatched) {
                throw new AppError_1.AppError('Você não pode atualizar informações de outro usuário');
            }
            experience.companyName = companyName !== null && companyName !== void 0 ? companyName : experience.companyName;
            experience.city = city !== null && city !== void 0 ? city : experience.city;
            experience.FU = FU !== null && FU !== void 0 ? FU : experience.FU;
            experience.startDate = startDate !== null && startDate !== void 0 ? startDate : experience.startDate;
            experience.endDate = endDate !== null && endDate !== void 0 ? endDate : experience.endDate;
            experience.description = description !== null && description !== void 0 ? description : experience.description;
            try {
                yield index_1.prisma.work.update({
                    where: {
                        id: experience.id
                    },
                    data: Object.assign({}, experience)
                });
                return response.json(experience);
            }
            catch (_a) {
                throw new AppError_1.AppError("Não foi possível atualizar os dados desta experiência.");
            }
        });
    }
    delete(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { experience_id } = request.params;
            const user_id = request.user.id;
            const experiences = yield index_1.prisma.work.findFirst({
                where: {
                    id: Number(experience_id)
                }
            });
            if (!experiences) {
                throw new AppError_1.AppError("Experiência não encontrada.");
            }
            const userIdMatched = user_id == experiences.user_id;
            if (!userIdMatched) {
                throw new AppError_1.AppError("Você não pode excluir informações de outro usuário");
            }
            try {
                yield index_1.prisma.work.delete({
                    where: {
                        id: experiences.id
                    }
                });
                return response.json('Experiência excluída com sucesso!');
            }
            catch (_a) {
                throw new AppError_1.AppError("Não foi possível excluir esta experiencia");
            }
        });
    }
    index(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { user_id } = request.params;
                const experiences = yield index_1.prisma.work.findMany({
                    where: {
                        user_id: Number(user_id)
                    }
                });
                if (!experiences) {
                    throw new AppError_1.AppError("Não foi possível encontrar experiências deste usuário ");
                }
                else {
                    return response.json(experiences);
                }
            }
            catch (_a) {
                throw new AppError_1.AppError("Não foi possível encontrar informações de experiência");
            }
        });
    }
    show(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { project_id } = request.params;
                const project = yield index_1.prisma.work.findFirst({
                    where: {
                        id: Number(project_id)
                    }
                });
                return response.json(project);
            }
            catch (_a) {
                throw new AppError_1.AppError("Não foi possível visualizar esta experiência");
            }
        });
    }
}
exports.ExperienceController = ExperienceController;
