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
exports.AuthService = void 0;
const config_1 = __importDefault(require("../../config"));
const appError_1 = __importDefault(require("../../errors/appError"));
const jwtHelper_1 = require("../../helpers/jwtHelper");
const prisma_1 = __importDefault(require("../../shared/prisma"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const http_status_1 = __importDefault(require("http-status"));
const login = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: payload.email,
        },
    });
    const isCorrectPassword = yield bcrypt_1.default.compare(payload.password, user.password);
    if (!isCorrectPassword) {
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, "Password is incorrect!");
    }
    const accessToken = jwtHelper_1.jwtHelper.generateToken({ id: user.id, email: user.email, role: user.role, fullName: user.fullName, premium: user.premium }, config_1.default.jwt.jwt_secret, config_1.default.jwt.expires_in);
    const refreshToken = jwtHelper_1.jwtHelper.generateToken({ email: user.email, role: user.role }, config_1.default.jwt.refresh_token_secret, config_1.default.jwt.refresh_token_expires_in);
    return {
        accessToken,
        refreshToken,
    };
});
const refreshToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    let decodedData;
    try {
        decodedData = jwtHelper_1.jwtHelper.verifyToken(token, config_1.default.jwt.refresh_token_secret);
    }
    catch (err) {
        throw new Error("You are not authorized!");
    }
    const userData = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: decodedData.email,
        },
    });
    const accessToken = jwtHelper_1.jwtHelper.generateToken({
        email: userData.email,
        role: userData.role,
    }, config_1.default.jwt.jwt_secret, config_1.default.jwt.expires_in);
    return {
        accessToken,
    };
});
const changePassword = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: user.email,
        },
    });
    const isCorrectPassword = yield bcrypt_1.default.compare(payload.oldPassword, userData.password);
    if (!isCorrectPassword) {
        throw new Error("Password incorrect!");
    }
    const hashedPassword = yield bcrypt_1.default.hash(payload.newPassword, Number(config_1.default.salt_round));
    yield prisma_1.default.user.update({
        where: {
            email: userData.email,
        },
        data: {
            password: hashedPassword,
        },
    });
    return {
        message: "Password changed successfully!",
    };
});
// const forgotPassword = async (payload: { email: string }) => {
//     const userData = await prisma.user.findUniqueOrThrow({
//         where: {
//             email: payload.email,
//         }
//     });
//     const resetPassToken = jwtHelper.generateToken(
//         { email: userData.email, role: userData.role },
//         config.jwt.reset_pass_secret as Secret,
//         config.jwt.reset_pass_token_expires_in as string
//     )
//     const resetPassLink = config.reset_pass_link + `?userId=${userData.id}&token=${resetPassToken}`
//     await emailSender(
//         userData.email,
//         `
//         <div>
//             <p>Dear User,</p>
//             <p>Your password reset link
//                 <a href=${resetPassLink}>
//                     <button>
//                         Reset Password
//                     </button>
//                 </a>
//             </p>
//         </div>
//         `
//     )
// };
// const resetPassword = async (
//   token: string,
//   payload: { id: number; password: string }
// ) => {
//   const userData = await prisma.user.findUniqueOrThrow({
//     where: {
//       id: payload.id,
//     },
//   });
//   const isValidToken = jwtHelper.verifyToken(
//     token,
//     config.jwt.reset_pass_secret as Secret
//   );
//   if (!isValidToken) {
//     throw new AppError(httpStatus.FORBIDDEN, "Forbidden!");
//   }
//   // hash password
//   const password = await bcrypt.hash(
//     payload.password,
//     Number(config.salt_round)
//   );
//   // update into database
//   await prisma.user.update({
//     where: {
//       id: payload.id,
//     },
//     data: {
//       password,
//     },
//   });
// };
const getMe = (session) => __awaiter(void 0, void 0, void 0, function* () {
    const accessToken = session.accessToken;
    const decodedData = jwtHelper_1.jwtHelper.verifyToken(accessToken, config_1.default.jwt.jwt_secret);
    const userData = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: decodedData.email,
        },
    });
    const { id, fullName, email, role, profileImage, bio, travelInterests, visitedCountries, currentLocation, premium, } = userData;
    return {
        id,
        fullName,
        email,
        role,
        profileImage,
        bio,
        travelInterests,
        visitedCountries,
        currentLocation,
        premium,
    };
});
exports.AuthService = {
    login,
    changePassword,
    // forgotPassword,
    refreshToken,
    // resetPassword,
    getMe,
};
