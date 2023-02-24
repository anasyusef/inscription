/*
  Warnings:

  - Added the required column `total_payable_amount` to the `File` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "File" ADD COLUMN     "total_payable_amount" BIGINT NOT NULL;
