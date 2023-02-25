/*
  Warnings:

  - You are about to drop the column `total_payable_amount` on the `File` table. All the data in the column will be lost.
  - You are about to drop the column `payable_amount` on the `Order` table. All the data in the column will be lost.
  - Added the required column `payable_amount` to the `File` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total_payable_amount` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "File" DROP COLUMN "total_payable_amount",
ADD COLUMN     "payable_amount" BIGINT NOT NULL;

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "payable_amount",
ADD COLUMN     "total_payable_amount" BIGINT NOT NULL;
