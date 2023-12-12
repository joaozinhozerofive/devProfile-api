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
exports.ProjectsController = void 0;
const AppError_1 = require("../utils/AppError");
const index_1 = require("../prisma/index");
class ProjectsController {
    create(request, response) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const { name, description, technologies, link } = request.body;
            const img = (_a = request.file) === null || _a === void 0 ? void 0 : _a.filename;
            const user_id = request.user.id;
            if (!name || !description || !link) {
                throw new AppError_1.AppError("Por favor, preencha todos os campos");
            }
            if (!technologies) {
                throw new AppError_1.AppError("Por favor, insira ao menos uma tecnologia.");
            }
            try {
                const project = yield index_1.prisma.project.create({
                    data: {
                        user_id,
                        name,
                        link,
                        description,
                        img: img !== null && img !== void 0 ? img : ""
                    }
                });
                technologies.map((technologies) => __awaiter(this, void 0, void 0, function* () {
                    return yield index_1.prisma.projectTechnologie.create({
                        data: {
                            project_id: project.id,
                            name,
                            Updated_at: new Date()
                        }
                    });
                }));
                return response.json({ message: "Projeto criado com sucesso", project, technologies });
            }
            catch (_b) {
                throw new AppError_1.AppError("Não foi possível criar este projeto");
            }
        });
    }
    update(request, response) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const { name, description, technologies, link } = request.body;
            const { project_id } = request.params;
            let img = (_a = request.file) === null || _a === void 0 ? void 0 : _a.filename;
            const user_id = request.user.id;
            const project = yield index_1.prisma.project.findFirst({
                where: {
                    id: Number(project_id)
                }
            });
            const userIdMatched = project.user_id === user_id;
            const technologiesExists = yield index_1.prisma.projectTechnologie.findFirst({
                where: {
                    project_id: project.id
                }
            });
            if (!userIdMatched) {
                throw new AppError_1.AppError("Você não pode atualizar informações de outros usuários");
            }
            if (!project) {
                throw new AppError_1.AppError("Projeto não encontrado");
            }
            if (!technologies) {
                throw new AppError_1.AppError("Por favor, insira pelo menos uma tecnologia");
            }
            if (technologiesExists) {
                yield index_1.prisma.projectTechnologie.deleteMany({
                    where: {
                        project_id: project.id
                    }
                });
            }
            try {
                const newTechs = yield Promise.all(technologies.map((technologie) => __awaiter(this, void 0, void 0, function* () {
                    return yield index_1.prisma.projectTechnologie.create({
                        data: {
                            name: technologie,
                            project_id: project.id,
                            Updated_at: new Date(),
                        }
                    });
                })));
                project.name = name !== null && name !== void 0 ? name : project.name;
                project.description = description !== null && description !== void 0 ? description : project.description;
                project.link = link !== null && link !== void 0 ? link : project.link;
                project.img = img !== null && img !== void 0 ? img : project.img;
                project.Updated_at = new Date();
                yield index_1.prisma.project.update({
                    where: {
                        id: project.id
                    },
                    data: Object.assign({}, project)
                });
                return response.json(newTechs);
            }
            catch (_b) {
                throw new AppError_1.AppError("Não foi possível atualizar o projeto.");
            }
        });
    }
    index(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { user_id } = request.params;
                const user = yield index_1.prisma.user.findFirst({
                    where: {
                        id: Number(user_id)
                    }
                });
                const projects = yield index_1.prisma.project.findMany({
                    where: {
                        user_id: user.id
                    },
                    include: {
                        technologies: true
                    }
                });
                return response.json(projects);
            }
            catch (_a) {
                throw new AppError_1.AppError("Não foi possível encontrar informações de projetos");
            }
        });
    }
    show(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { project_id } = request.params;
                const project = yield index_1.prisma.project.findFirst({
                    where: {
                        id: Number(project_id)
                    },
                    include: {
                        technologies: true
                    }
                });
                if (!project) {
                    throw new AppError_1.AppError("Projeto não encontrado");
                }
                return response.json(project);
            }
            catch (_a) {
                throw new AppError_1.AppError("Não foi possível visualizar este projeto");
            }
        });
    }
    delete(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { project_id } = request.params;
            const user_id = request.user.id;
            const user = yield index_1.prisma.user.findFirst({
                where: {
                    id: user_id
                }
            });
            const project = yield index_1.prisma.project.findFirst({
                where: {
                    id: Number(project_id)
                }
            });
            if (!project) {
                throw new AppError_1.AppError("Não foi possível encontrar este projeto");
            }
            try {
                const userIdMatched = user_id === project.user_id;
                if (!userIdMatched) {
                    throw new AppError_1.AppError("Você não pode excluir informações de outro usuário.");
                }
                else {
                    yield index_1.prisma.project.delete({
                        where: {
                            id: project.id
                        }
                    });
                }
                return response.json({ message: "Esse projeto foi excluido com sucesso!" });
            }
            catch (_a) {
                throw new AppError_1.AppError('Não foi possível excluir este projeto');
            }
        });
    }
}
exports.ProjectsController = ProjectsController;
