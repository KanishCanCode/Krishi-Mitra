/*
  Warnings:

  - You are about to drop the column `Bank_account_no` on the `Farmer` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Farmer" DROP COLUMN "Bank_account_no",
ADD COLUMN     "bank_account" TEXT;
