
import httpStatus from "http-status";
import AppError from "../../errors/appError";
import prisma from "../../shared/prisma";

const subscribeNewsletter = async (email: string) => {
  if (!email || !email.includes("@")) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid email");
  }

  const existing = await prisma.newsletter.findUnique({ where: { email } });
  if (existing) {
    throw new AppError(httpStatus.BAD_REQUEST, "Email already subscribed");
  }

  return prisma.newsletter.create({
    data: { email },
  });
};

const getAllSubscribers = async () => {
  return prisma.newsletter.findMany({
    orderBy: { subscribedAt: "desc" },
  });
};

const removeSubscriber = async (id: string) => {
  const subscriber = await prisma.newsletter.findUnique({ where: { id } });
  if (!subscriber) {
    throw new AppError(httpStatus.NOT_FOUND, "Subscriber not found");
  }
  return prisma.newsletter.delete({ where: { id } });
};

export const newsletterService = {
  subscribeNewsletter,
  getAllSubscribers,
  removeSubscriber,
};
