/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `Farmer` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `Lender` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `Farmer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `passwordHash` to the `Farmer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Farmer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `Lender` table without a default value. This is not possible if the table is not empty.
  - Added the required column `passwordHash` to the `Lender` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Lender` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Farmer" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "passwordHash" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Lender" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "passwordHash" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Farmer_email_key" ON "Farmer"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Lender_email_key" ON "Lender"("email");
