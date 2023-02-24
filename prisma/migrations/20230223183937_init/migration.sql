-- CreateTable
CREATE TABLE "Job" (
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "file_path" TEXT NOT NULL,
    "retries" SMALLINT DEFAULT 1,
    "status" VARCHAR DEFAULT 'pending',

    CONSTRAINT "Job_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "payable_amount" BIGINT NOT NULL,
    "priority_fee" REAL NOT NULL,
    "service_fee" BIGINT NOT NULL,
    "network_fee" BIGINT NOT NULL,
    "tx_speed" VARCHAR NOT NULL,
    "uid" UUID NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "File" (
    "id" SERIAL NOT NULL,
    "path" TEXT,
    "recipient_address" TEXT NOT NULL,
    "assigned_taproot_address" TEXT NOT NULL,
    "status" VARCHAR NOT NULL DEFAULT 'payment_pending',
    "object_id" UUID NOT NULL,
    "order_id" UUID NOT NULL,
    "commit_tx" VARCHAR NOT NULL,
    "inscription_id" VARCHAR NOT NULL,
    "reveal_tx" VARCHAR NOT NULL,
    "fees" BIGINT NOT NULL,
    "send_tx" TEXT DEFAULT '',
    "name" TEXT NOT NULL,

    CONSTRAINT "File_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "tx_hash" VARCHAR NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "received_at" TIMESTAMPTZ(6) NOT NULL,
    "amount_sats" BIGINT NOT NULL,
    "confirmations" INTEGER NOT NULL,
    "order_id" UUID NOT NULL,

    CONSTRAINT "tx_new_pkey" PRIMARY KEY ("tx_hash")
);

-- CreateIndex
CREATE UNIQUE INDEX "Job_file_path_key" ON "Job"("file_path");

-- CreateIndex
CREATE UNIQUE INDEX "File_path_key" ON "File"("path");

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_file_path_fkey" FOREIGN KEY ("file_path") REFERENCES "File"("path") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
