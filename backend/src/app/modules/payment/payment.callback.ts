import { Router, Request, Response } from "express";
import prisma from "../../shared/prisma";
import { PaymentStatus } from "@prisma/client";
import config from "../../config";
import { jwtHelper } from "../../helpers/jwtHelper";
import { Secret } from "jsonwebtoken";

const router = Router();

/**
 * Success callback
 * SSLCommerz redirects with GET, not POST
 */
router.get("/success", async (req: Request, res: Response) => {
  try {
    const tranId = req.query.tranId as string;
   
    if (!tranId) return res.status(400).send("tranId is missing");

    const payment = await prisma.payment.update({
      where: { tranId },
      data: { status: PaymentStatus.SUCCESS },
    });

    const user = await prisma.user.update({
      where: { id: payment.userId },
      data: { premium: true },
    });

    const accessToken = jwtHelper.generateToken(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        fullName: user.fullName,
        premium: user.premium,
      },
      config.jwt.jwt_secret as Secret,
      config.jwt.expires_in as string
    );

    const refreshToken = jwtHelper.generateToken(
      { email: user.email, role: user.role },
      config.jwt.refresh_token_secret as Secret,
      config.jwt.refresh_token_expires_in as string
    );

    res.cookie("accessToken", accessToken, {
      secure: true,
      httpOnly: true,
      sameSite: "none",
      maxAge: 1000 * 60 * 60,
    });

    res.cookie("refreshToken", refreshToken, {
      secure: true,
      httpOnly: true,
      sameSite: "none",
      maxAge: 1000 * 60 * 60 * 24 * 90,
    });

    return res.redirect(
      `https://travel-buddy-t.vercel.app/payment/success?tranId=${tranId}`
    );
  } catch (error) {
    console.error("Payment success error:", error);
    return res.redirect("https://travel-buddy-t.vercel.app/payment/fail");
  }
});

/**
 * Failed payment
 */
router.get("/fail", async (req: Request, res: Response) => {
  const tranId = req.query.tranId as string;
  if (!tranId) return res.status(400).send("tranId missing");

  await prisma.payment.update({
    where: { tranId },
    data: { status: PaymentStatus.FAILED },
  });

  res.redirect(`https://travel-buddy-t.vercel.app/payment/fail?tranId=${tranId}`);
});

/**
 * Cancelled payment
 */
router.get("/cancel", async (req: Request, res: Response) => {
  const tranId = req.query.tranId as string;
  if (!tranId) return res.status(400).send("tranId missing");

  await prisma.payment.update({
    where: { tranId },
    data: { status: PaymentStatus.CANCELLED },
  });

  res.redirect(`https://travel-buddy-t.vercel.app/payment/cancel?tranId=${tranId}`);
});

export default router;
