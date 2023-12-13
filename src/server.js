"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("express-async-errors");
const cors_1 = __importDefault(require("cors"));
const routes_1 = require("./routes");
const AppError_1 = require("./utils/AppError");
const multer_1 = require("./configs/multer");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use(routes_1.routes);
app.use("/files", express_1.default.static(multer_1.TMP_FOLDER));
app.use((error, request, response, next) => {
    if (error instanceof AppError_1.AppError) {
        return response.status(error.statusCode).json({
            status: "error",
            message: error.message
        });
    }
    console.log(error);
    return response.status(500).json({
        status: "error",
        message: "internal server error"
    });
});
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log("Server is running on PORT:" + PORT);
});
