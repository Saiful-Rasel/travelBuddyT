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
exports.newsletterController = void 0;
const catchAsync_1 = __importDefault(require("../../shared/catchAsync"));
const newsLetter_service_1 = require("./newsLetter.service");
const sendResponse_1 = __importDefault(require("../../shared/sendResponse"));
const subscribeController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    const subscriber = yield newsLetter_service_1.newsletterService.subscribeNewsletter(email);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Subscribed successfully",
        data: subscriber,
    });
}));
const listSubscribersController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.user);
    const subscribers = yield newsLetter_service_1.newsletterService.getAllSubscribers();
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Subscribers retrieved successfully",
        data: subscribers,
    });
}));
const deleteSubscriberController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const subscriber = yield newsLetter_service_1.newsletterService.removeSubscriber(id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Subscriber removed successfully",
        data: subscriber,
    });
}));
exports.newsletterController = {
    subscribeController,
    listSubscribersController,
    deleteSubscriberController,
};
