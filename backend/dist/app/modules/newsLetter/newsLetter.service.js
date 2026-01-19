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
exports.newsletterService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const appError_1 = __importDefault(require("../../errors/appError"));
const prisma_1 = __importDefault(require("../../shared/prisma"));
const subscribeNewsletter = (email) => __awaiter(void 0, void 0, void 0, function* () {
    if (!email || !email.includes("@")) {
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, "Invalid email");
    }
    const existing = yield prisma_1.default.newsletter.findUnique({ where: { email } });
    if (existing) {
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, "Email already subscribed");
    }
    return prisma_1.default.newsletter.create({
        data: { email },
    });
});
const getAllSubscribers = () => __awaiter(void 0, void 0, void 0, function* () {
    return prisma_1.default.newsletter.findMany({
        orderBy: { subscribedAt: "desc" },
    });
});
const removeSubscriber = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const subscriber = yield prisma_1.default.newsletter.findUnique({ where: { id } });
    if (!subscriber) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, "Subscriber not found");
    }
    return prisma_1.default.newsletter.delete({ where: { id } });
});
exports.newsletterService = {
    subscribeNewsletter,
    getAllSubscribers,
    removeSubscriber,
};
