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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const fileUpload_1 = require("../../helpers/fileUpload");
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_1 = __importDefault(require("../../config"));
const prisma_1 = __importDefault(require("../../shared/prisma"));
const paginationHelper_1 = require("../../helpers/paginationHelper");
const createUser = (req) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.file) {
        const uploadResult = yield fileUpload_1.fileUploader.uploadToCloudinary(req.file);
        req.body.profileImage = uploadResult === null || uploadResult === void 0 ? void 0 : uploadResult.secure_url;
    }
    const hashPassword = yield bcrypt_1.default.hash(req.body.password, Number(config_1.default.salt_round));
    const result = yield prisma_1.default.user.create({
        data: {
            fullName: req.body.fullName,
            email: req.body.email,
            password: hashPassword,
            bio: req.body.bio,
            profileImage: req.body.profileImage,
            currentLocation: req.body.currentLocation,
            travelInterests: req.body.travelInterests || [],
            visitedCountries: req.body.visitedCountries || [],
        },
    });
    const { password } = result, userDetailsWithoutPassword = __rest(result, ["password"]);
    return userDetailsWithoutPassword;
});
const getAllUser = (options) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelper.calculatePagination(options);
    // total count
    const total = yield prisma_1.default.user.count({
        where: { role: "USER" },
    });
    const data = yield prisma_1.default.user.findMany({
        where: { role: "USER" },
        skip,
        take: limit,
        orderBy: sortBy && sortOrder ? { [sortBy]: sortOrder } : { createdAt: "desc" },
        omit: {
            password: true,
        },
    });
    return {
        meta: {
            page,
            limit,
            total,
        },
        data,
    };
});
const getSingleUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.default.user.findUniqueOrThrow({
        where: { id },
        omit: {
            password: true,
        },
    });
});
const updateUser = (id, data, file) => __awaiter(void 0, void 0, void 0, function* () {
    let profileImageUrl;
    if (file) {
        const uploadResult = yield fileUpload_1.fileUploader.uploadToCloudinary(file);
        profileImageUrl = uploadResult === null || uploadResult === void 0 ? void 0 : uploadResult.secure_url;
    }
    const updatedUser = yield prisma_1.default.user.update({
        where: { id },
        data: {
            fullName: data.fullName,
            bio: data.bio,
            currentLocation: data.currentLocation,
            travelInterests: data.travelInterests || [],
            visitedCountries: data.visitedCountries || [],
            profileImage: profileImageUrl || undefined,
        },
    });
    const { password } = updatedUser, userWithoutPassword = __rest(updatedUser, ["password"]);
    return userWithoutPassword;
});
exports.UserService = {
    createUser,
    getAllUser,
    getSingleUser,
    updateUser,
};
