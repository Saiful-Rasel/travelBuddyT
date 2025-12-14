import { NextFunction, Request, Response, Router } from "express";
import { fileUploader } from "../../helpers/fileUpload";
import { parseToArray, registerUserSchema, updateUserSchema } from "./userValidation";
import { userController } from "./user.controller";

const router = Router();
router.get("/", userController.getAllUser);
router.get("/:id", userController.getSingleUser);

router.post(
  "/register",
  fileUploader.upload.single("file"),

  (req: Request, res: Response, next: NextFunction) => {
    req.body = registerUserSchema.parse(JSON.parse(req.body.data));
    return userController.createUser(req, res, next);
  }
);

   router.patch(
  "/:id",
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    try {
    
      const parsedData = req.body.data ? JSON.parse(req.body.data) : {};

   
      const parseToArray = (input?: string | string[]): string[] | undefined => {
        if (!input) return undefined;
        if (Array.isArray(input)) return input.map(c => c.trim()).filter(Boolean);
        return input.split(",").map(c => c.trim()).filter(Boolean);
      };

      parsedData.visitedCountries = parseToArray(parsedData.visitedCountries);
      parsedData.travelInterests = parseToArray(parsedData.travelInterests);

  
      req.body = updateUserSchema.parse(parsedData);

      return userController.updateUser(req, res, next);
    } catch (err) {
      next(err);
    }
  }
);


export const userRoutes = router;
