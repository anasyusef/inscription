/*
  Warnings:

  - The primary key for the `File` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `file_size` on the `File` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "File" DROP CONSTRAINT "File_pkey",
DROP COLUMN "file_size",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "object_id" DROP NOT NULL,
ALTER COLUMN "commit_tx" DROP NOT NULL,
ALTER COLUMN "inscription_id" DROP NOT NULL,
ALTER COLUMN "reveal_tx" DROP NOT NULL,
ALTER COLUMN "fees" DROP NOT NULL,
ADD CONSTRAINT "File_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "File_id_seq";
