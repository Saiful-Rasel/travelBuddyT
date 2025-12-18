"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const express_1 = require("express");
const fileUpload_1 = require("../../helpers/fileUpload");
const userValidation_1 = require("./userValidation");
const user_controller_1 = require("./user.controller");
const router = (0, express_1.Router)();
router.get("/", user_controller_1.userController.getAllUser);
router.get("/:id", user_controller_1.userController.getSingleUser);
router.post("/register", fileUpload_1.fileUploader.upload.single("file"), (req, res, next) => {
    req.body = userValidation_1.registerUserSchema.parse(JSON.parse(req.body.data));
    return user_controller_1.userController.createUser(req, res, next);
});
router.patch("/:id", fileUpload_1.fileUploader.upload.single("file"), (req, res, next) => {
    try {
        const parsedData = req.body.data ? JSON.parse(req.body.data) : {};
        const parseToArray = (input) => {
            if (!input)
                return undefined;
            if (Array.isArray(input))
                return input.map(c => c.trim()).filter(Boolean);
            return input.split(",").map(c => c.trim()).filter(Boolean);
        };
        parsedData.visitedCountries = parseToArray(parsedData.visitedCountries);
        parsedData.travelInterests = parseToArray(parsedData.travelInterests);
        req.body = userValidation_1.updateUserSchema.parse(parsedData);
        return user_controller_1.userController.updateUser(req, res, next);
    }
    catch (err) {
        next(err);
    }
});
exports.userRoutes = router;
