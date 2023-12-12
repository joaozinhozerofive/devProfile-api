"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authSecrets = void 0;
const authSecrets = {
    jwt: {
        secret: process.env.AUTH_SECRET || "default",
        expiresIn: "7d"
    }
};

exports.authSecrets = authSecrets;
