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
exports.seedSuperAdmin = void 0;
const config_1 = __importDefault(require("../config"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma_1 = __importDefault(require("../shared/prisma"));
const client_1 = require("@prisma/client");
const seedSuperAdmin = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isAdminEXist = yield prisma_1.default.user.findUnique({
            where: {
                email: config_1.default.admin.email,
            },
        });
        if (isAdminEXist) {
            console.log("Super Admin Already Exists!");
            return;
        }
        console.log("Trying to create Super Admin...");
        const hashedPassword = yield bcrypt_1.default.hash(config_1.default.admin.password, Number(config_1.default.salt_round));
        const payload = {
            fullName: "Super Admin",
            role: client_1.Role.ADMIN,
            email: config_1.default.admin.email,
            password: hashedPassword,
            bio: "I am the super admin of TravelBuddy.",
            currentLocation: null,
        };
        const admin = yield prisma_1.default.user.create({
            data: payload,
        });
        console.log("Super Admin Created Successfuly! \n");
    }
    catch (error) {
        console.log(error);
    }
});
exports.seedSuperAdmin = seedSuperAdmin;
