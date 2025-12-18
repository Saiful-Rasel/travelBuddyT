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
const node_cron_1 = __importDefault(require("node-cron"));
const prisma_1 = __importDefault(require("../../shared/prisma"));
node_cron_1.default.schedule("0 0 * * *", () => __awaiter(void 0, void 0, void 0, function* () {
    console.log(" Cron Running: Checking expired travel plans...");
    try {
        const expiredPlans = yield prisma_1.default.travelPlan.findMany({
            where: {
                endDate: { lt: new Date() },
                isActive: true,
            },
        });
        console.log("Expired Plans Found:", expiredPlans.length);
        const updated = yield prisma_1.default.travelPlan.updateMany({
            where: {
                endDate: { lt: new Date() },
                isActive: true,
            },
            data: { isActive: false },
        });
        console.log(`✔ ${updated.count} travel plans deactivated.`);
    }
    catch (error) {
        console.error(" Cron Error:", error);
    }
}));
