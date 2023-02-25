/*
  Warnings:

  - Made the column `is_service_fee_exempt` on table `File` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "File" ALTER COLUMN "is_service_fee_exempt" SET NOT NULL;
