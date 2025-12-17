import { Router, Request, Response } from "express";
import prisma from "../../shared/prisma";
import { PaymentStatus } from "@prisma/client";

const router = Router();

router.get("/success", async (req: Request, res: Response) => {
  try {
    const tranId = req.query.tran_id as string;

    if (!tranId) {
      return res.status(400).send("tran_id is missing");
    }

    const payment = await prisma.payment.update({
      where: { tranId },
      data: { status: PaymentStatus.SUCCESS },
    });

    await prisma.user.update({
      where: { id: payment.userId },
      data: { premium: true },
    });

    return res.redirect(
      `http://localhost:3000/payment/success?tran_id=${tranId}`
    );
  } catch (error) {
    return res.redirect("http://localhost:3000/payment/fail");
  }
});

router.get("/fail", async (req: Request, res: Response) => {
  const tranId = req.query.tran_id as string;
  if (!tranId) return res.status(400).send("tran_id missing");

  await prisma.payment.update({
    where: { tranId },
    data: { status: PaymentStatus.FAILED },
  });

  res.redirect( `http://localhost:3000/payment/fail?tran_id=${tranId}`);
});

router.get("/cancel", async (req: Request, res: Response) => {
  const tranId = req.query.tran_id as string;
  if (!tranId) return res.status(400).send("tran_id missing");

  await prisma.payment.update({
    where: { tranId },
    data: { status: PaymentStatus.CANCELLED },
  });

  res.redirect(`http://localhost:3000/payment/cancel?tran_id=${tranId}`);
});

export default router;
