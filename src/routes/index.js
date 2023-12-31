"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routes = void 0;
const express_1 = require("express");
const users_routes_1 = require("./users.routes");
const sessions_routes_1 = require("./sessions.routes");
const contacts_routes_1 = require("./contacts.routes");
const technologies_routes_1 = require("./technologies.routes");
const projects_routes_1 = require("./projects.routes");
const experience_routes_1 = require("./experience.routes");
const routes = (0, express_1.Router)();
exports.routes = routes;
routes.use("/users", users_routes_1.usersRoutes);
routes.use("/sessions", sessions_routes_1.sessionsRoutes);
routes.use("/contacts", contacts_routes_1.contactsRoutes);
routes.use("/technologies", technologies_routes_1.technologiesRoutes);
routes.use("/projects", projects_routes_1.projectsRoutes);
routes.use("/experience", experience_routes_1.experienceRoutes);
