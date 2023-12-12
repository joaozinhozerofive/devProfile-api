"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.experienceRoutes = void 0;
const express_1 = require("express");
const ExperienceController_1 = require("../Controllers/ExperienceController");
const ensureAuthenticated_1 = require("../middleware/ensureAuthenticated");
const experienceRoutes = (0, express_1.Router)();
exports.experienceRoutes = experienceRoutes;
const experienceController = new ExperienceController_1.ExperienceController();
experienceRoutes.post("/", ensureAuthenticated_1.ensureAuthenticated, experienceController.create);
experienceRoutes.put("/:experience_id", ensureAuthenticated_1.ensureAuthenticated, experienceController.update);
experienceRoutes.get("/:user_id", experienceController.index);
experienceRoutes.get("/:project_id/detail", experienceController.show);
experienceRoutes.delete("/:experience_id", ensureAuthenticated_1.ensureAuthenticated, experienceController.delete);
