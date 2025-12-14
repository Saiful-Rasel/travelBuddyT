import config from "../config";
import bcrypt from "bcrypt";
import prisma from "../shared/prisma";
import { Role } from "@prisma/client";

export const seedSuperAdmin = async () => {
  try {
    const isAdminEXist = await prisma.user.findUnique({
      where: {
        email: config.admin.email,
      },
    });

    if (isAdminEXist) {
      console.log("Super Admin Already Exists!");
      return;
    }

    console.log("Trying to create Super Admin...");

    const hashedPassword = await bcrypt.hash(
      config.admin.password as string,
      Number(config.salt_round)
    );

    const payload = {
      fullName: "Super Admin",
      role: Role.ADMIN,
      email: config.admin.email as string,
      password: hashedPassword,
      bio: "I am the super admin of TravelBuddy.",
      currentLocation: null,
    };

    const admin = await prisma.user.create({
      data: payload,
    });
    console.log("Super Admin Created Successfuly! \n");
  } catch (error) {
    console.log(error);
  }
};
