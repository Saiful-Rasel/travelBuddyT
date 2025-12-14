import { Request } from "express";
import { fileUploader } from "../../helpers/fileUpload";
import bcrypt from "bcrypt";
import config from "../../config";
import prisma from "../../shared/prisma";
import { paginationHelper } from "../../helpers/paginationHelper";

const createUser = async (req: Request) => {
  if (req.file) {
    const uploadResult = await fileUploader.uploadToCloudinary(req.file);

    req.body.profileImage = uploadResult?.secure_url;
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
      profileImage: req.body.profileImage,
      currentLocation: req.body.currentLocation,
      travelInterests: req.body.travelInterests || [],
      visitedCountries: req.body.visitedCountries || [],
    },
  });
  const { password, ...userDetailsWithoutPassword } = result;
  return userDetailsWithoutPassword;
};

const getAllUser = async (options: any) => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);

  // total count
  const total = await prisma.user.count({
    where: { role: "USER" },
  });

  // paginated users
  const data = await prisma.user.findMany({
    where: { role: "USER" },
    skip,
    take: limit,
    orderBy:
      sortBy && sortOrder ? { [sortBy]: sortOrder } : { createdAt: "desc" },
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
};

const getSingleUser = async (id: number) => {
  return await prisma.user.findUniqueOrThrow({
    where: { id },
    omit: {
      password: true,
    },
  });
};

interface UpdateUserData {
  fullName?: string;
  bio?: string;
  currentLocation?: string;
  travelInterests?: string[];
  visitedCountries?: string[];
}

const updateUser = async (
  id: number,
  data: UpdateUserData,
  file?: Express.Multer.File
) => {
  let profileImageUrl: string | undefined;

  if (file) {
    const uploadResult = await fileUploader.uploadToCloudinary(file);
    profileImageUrl = uploadResult?.secure_url;
  }

  

  const updatedUser = await prisma.user.update({
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

  const { password, ...userWithoutPassword } = updatedUser;
  return userWithoutPassword;
};
export const UserService = {
  createUser,
  getAllUser,
  getSingleUser,
  updateUser,
};
