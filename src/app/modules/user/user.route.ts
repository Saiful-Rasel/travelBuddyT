import { NextFunction, Request, Response, Router } from "express"
import { fileUploader } from "../../helpers/fileUpload"
import { registerUserSchema } from "./userValidation"
import { userController } from "./user.controller"

const router = Router()
router.post(
    "/register",
    fileUploader.upload.single('file'),
    
    (req: Request, res: Response, next: NextFunction) => {
        req.body = registerUserSchema.parse(JSON.parse(req.body.data))
        return userController.createUser(req, res, next)
    }
)
router.post(
    "/register-admin",
    fileUploader.upload.single('file'),
    
    (req: Request, res: Response, next: NextFunction) => {
        req.body = registerUserSchema.parse(JSON.parse(req.body.data))
        return userController.createUser(req, res, next)
    }
)


export const userRoutes = router
