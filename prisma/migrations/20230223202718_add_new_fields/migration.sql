/*
  Warnings:

  - You are about to drop the column `mime_type` on the `File` table. All the data in the column will be lost.
  - You are about to drop the column `path` on the `File` table. All the data in the column will be lost.
  - You are about to drop the column `file_path` on the `Job` table. All the data in the column will be lost.
  - You are about to drop the column `network_fee` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `payable_amount` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `priority_fee` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `service_fee` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `tx_speed` on the `Order` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[order_id]` on the table `Job` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `network_fee` to the `File` table without a default value. This is not possible if the table is not empty.
  - Added the required column `payable_amount` to the `File` table without a default value. This is not possible if the table is not empty.
  - Added the required column `priority_fee` to the `File` table without a default value. This is not possible if the table is not empty.
  - Added the required column `service_fee` to the `File` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tx_speed` to the `File` table without a default value. This is not possible if the table is not empty.
  - Added the required column `order_id` to the `Job` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Job" DROP CONSTRAINT "Job_file_path_fkey";

-- DropIndex
DROP INDEX "File_path_key";

-- DropIndex
DROP INDEX "Job_file_path_key";

-- AlterTable
ALTER TABLE "File" DROP COLUMN "mime_type",
DROP COLUMN "path",
ADD COLUMN     "network_fee" BIGINT NOT NULL,
ADD COLUMN     "payable_amount" BIGINT NOT NULL,
ADD COLUMN     "priority_fee" REAL NOT NULL,
ADD COLUMN     "service_fee" BIGINT NOT NULL,
ADD COLUMN     "tx_speed" VARCHAR NOT NULL;

-- AlterTable
ALTER TABLE "Job" DROP COLUMN "file_path",
ADD COLUMN     "order_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "network_fee",
DROP COLUMN "payable_amount",
DROP COLUMN "priority_fee",
DROP COLUMN "service_fee",
DROP COLUMN "tx_speed";

-- CreateIndex
CREATE UNIQUE INDEX "Job_order_id_key" ON "Job"("order_id");

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
