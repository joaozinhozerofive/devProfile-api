"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sessionsRoutes = void 0;
const express_1 = require("express");
const SessionsController_1 = require("../Controllers/SessionsController");
const sessionsRoutes = (0, express_1.Router)();
exports.sessionsRoutes = sessionsRoutes;
const sessionsController = new SessionsController_1.SessionsController();
sessionsRoutes.post("/", sessionsController.create);
