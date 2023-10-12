-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "vector";

-- CreateEnum
CREATE TYPE "FileUploadType" AS ENUM ('BILL_OF_LADING', 'CONTRACT', 'INVOICE');

-- CreateTable
CREATE TABLE "FileUpload" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "FileUploadType" NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "embedding" vector(1536),
    CONSTRAINT "FileUpload_pkey" PRIMARY KEY ("id")
);