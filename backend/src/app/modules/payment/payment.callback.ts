import { Router, Request, Response } from "express";
import prisma from "../../shared/prisma";
import { PaymentStatus } from "@prisma/client";

const router = Router();

router.get("/success", async (req: Request, res: Response) => {

  const tranId = req.query.tran_id as string;

  if (!tranId) return res.status(400).send("tran_idis  missing");

  const payment = await prisma.payment.update({
    where: { tranId },
    data: { status: PaymentStatus.SUCCESS },
  });

  
  await prisma.user.update({
    where: { id: payment.userId },
    data: { premium: true },
  });

  res.json({
    success: true,
    message: "Payment completed successfully",
    tranId,
    status: PaymentStatus.SUCCESS,
  });
//   res.redirect("/frontend/success");
});

router.get("/fail", async (req: Request, res: Response) => {
  const tranId = req.query.tran_id as string;
  if (!tranId) return res.status(400).send("tran_id missing");

  await prisma.payment.update({
    where: { tranId },
    data: { status: PaymentStatus.FAILED },
  });

  res.redirect("/frontend/fail");
});

router.get("/cancel", async (req: Request, res: Response) => {
  const tranId = req.query.tran_id as string;
  if (!tranId) return res.status(400).send("tran_id missing");

  await prisma.payment.update({
    where: { tranId },
    data: { status: PaymentStatus.CANCELLED },
  });

  res.redirect("/frontend/cancel");
});

export default router;
