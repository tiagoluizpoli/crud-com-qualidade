-- CreateTable
CREATE TABLE "Todo" (
    "id" UUID NOT NULL,
    "content" VARCHAR(200) NOT NULL,
    "date" TIMESTAMP NOT NULL,
    "done" BOOLEAN NOT NULL,

    CONSTRAINT "Todo_pkey" PRIMARY KEY ("id")
);
