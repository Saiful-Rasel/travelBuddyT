"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkPremium = checkPremium;
function checkPremium(req, res, next) {
    if (!(req === null || req === void 0 ? void 0 : req.user)) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    if (!req.user.premium) {
        return res.status(403).json({ success: false, message: "Only premium users can access this service" });
    }
    next();
}
