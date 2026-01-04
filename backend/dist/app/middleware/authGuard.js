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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_1 = __importDefault(require("http-status"));
const jwtHelper_1 = require("../helpers/jwtHelper");
const appError_1 = __importDefault(require("../errors/appError"));
const config_1 = __importDefault(require("../config"));
const auth = (...roles) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        try {
            let token;
            if ((_a = req.cookies) === null || _a === void 0 ? void 0 : _a.accessToken) {
                token = req.cookies.accessToken;
            }
            else if ((_b = req.headers.authorization) === null || _b === void 0 ? void 0 : _b.startsWith("Bearer ")) {
                token = req.headers.authorization.split(" ")[1];
            }
            if (!token) {
                throw new appError_1.default(http_status_1.default.UNAUTHORIZED, "You are not authorized! Token missing.");
            }
            let verifyUser;
            try {
                verifyUser = jwtHelper_1.jwtHelper.verifyToken(token, config_1.default.jwt.jwt_secret);
            }
            catch (err) {
                throw new appError_1.default(http_status_1.default.UNAUTHORIZED, "Invalid or malformed token");
            }
            req.user = verifyUser;
            if (roles.length && !roles.includes(verifyUser.role)) {
                throw new appError_1.default(http_status_1.default.UNAUTHORIZED, "You are not authorized for this role!");
            }
            next();
        }
        catch (err) {
            next(err);
        }
    });
};
exports.default = auth;
