/*
  Warnings:

  - You are about to drop the column `ownerId` on the `TravelPlan` table. All the data in the column will be lost.
  - Added the required column `userId` to the `TravelPlan` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "TravelPlan" DROP CONSTRAINT "TravelPlan_ownerId_fkey";

-- DropIndex
DROP INDEX "TravelPlan_ownerId_idx";

-- AlterTable
ALTER TABLE "TravelPlan" DROP COLUMN "ownerId",
ADD COLUMN     "userId" INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX "TravelPlan_userId_idx" ON "TravelPlan"("userId");

-- AddForeignKey
ALTER TABLE "TravelPlan" ADD CONSTRAINT "TravelPlan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
