import cron from "node-cron";
import prisma from "../../shared/prisma";



cron.schedule("0 0 * * *", async () => {
  console.log(" Cron Running: Checking expired travel plans...");

    try {
    const expiredPlans = await prisma.travelPlan.findMany({
      where: {
        endDate: { lt: new Date() },
        isActive: true,
      },
    });

    console.log("Expired Plans Found:", expiredPlans.length);


    const updated = await prisma.travelPlan.updateMany({
      where: {
        endDate: { lt: new Date() },
        isActive: true,
      },
      data: { isActive: false },
    });

    console.log(`✔ ${updated.count} travel plans deactivated.`);
  } catch (error) {
    console.error(" Cron Error:", error);
  }
});
