import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import "./app/modules/travelPlan/travelPlan.cron";
import cors from "cors";
import notFound from "./app/middleware/notFound";
import router from "./app/routes";
import globalErrorHandler from "./app/middleware/globalErrorHandler";
import cookieParser from "cookie-parser";
import paymentCallback from "./app/modules/payment/payment.callback";

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

app.get("/", (req: Request, res: Response) => {
  res.send(" Travel Buddy Started Successfully");
});
app.use("/api", router);
app.use("/api/payment", paymentCallback);

app.use(globalErrorHandler);
app.use(notFound);

export default app;
