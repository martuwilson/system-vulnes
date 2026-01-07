/*
  Warnings:

  - You are about to drop the column `stripeCustomerId` on the `subscriptions` table. All the data in the column will be lost.
  - You are about to drop the column `stripeSubscriptionId` on the `subscriptions` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[mercadopagoPaymentId]` on the table `subscriptions` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[mercadopagoPreapprovalId]` on the table `subscriptions` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "subscriptions_stripeSubscriptionId_key";

-- AlterTable
ALTER TABLE "subscriptions" DROP COLUMN "stripeCustomerId",
DROP COLUMN "stripeSubscriptionId",
ADD COLUMN     "canceledAt" TIMESTAMP(3),
ADD COLUMN     "mercadopagoPaymentId" TEXT,
ADD COLUMN     "mercadopagoPreapprovalId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "subscriptions_mercadopagoPaymentId_key" ON "subscriptions"("mercadopagoPaymentId");

-- CreateIndex
CREATE UNIQUE INDEX "subscriptions_mercadopagoPreapprovalId_key" ON "subscriptions"("mercadopagoPreapprovalId");
