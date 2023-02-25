/*
  Warnings:

  - You are about to drop the column `payable_amount` on the `File` table. All the data in the column will be lost.
  - Added the required column `payable_amount` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "File" DROP COLUMN "payable_amount",
ALTER COLUMN "status" SET DEFAULT 'pending';

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "payable_amount" BIGINT NOT NULL,
ADD COLUMN     "status" VARCHAR NOT NULL DEFAULT 'payment_pending';
