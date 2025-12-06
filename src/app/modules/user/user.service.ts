import { Request } from "express";
import { fileUploader } from "../../helpers/fileUpload";
import bcrypt from "bcrypt";
import config from "../../config";
import prisma from "../../shared/prisma";


const createUser = async (req: Request,role: "USER" | "ADMIN" = "USER") => {
  if (req.file) {
    const uploadResult = await fileUploader.uploadToCloudinary(req.file);
    req.body.profilePhoto = uploadResult?.secure_url;
  }
  const hashPassword = await bcrypt.hash(
    req.body.password,
    Number(config.salt_round)
  );
  const result = await prisma.user.create({
    data: {
      fullName: req.body.fullName,
      email: req.body.email,
      password: hashPassword,
      bio: req.body.bio,
      role,
      currentLocation: req.body.currentLocation,
      travelInterests: req.body.travelInterests || [],
      visitedCountries: req.body.visitedCountries || [],
    },
  });
  const { password, ...userDetailsWithoutPassword } = result;
  return userDetailsWithoutPassword;
};

export const UserService = {
  createUser,
};
