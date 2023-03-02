/*
  Warnings:

  - You are about to drop the column `referred_by` on the `Order` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "referred_by",
ADD COLUMN     "ref" TEXT;
