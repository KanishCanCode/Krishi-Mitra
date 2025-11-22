/*
  Warnings:

  - You are about to drop the column `Bank_acoount_no` on the `Lender` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Lender" DROP COLUMN "Bank_acoount_no",
ADD COLUMN     "Bank_account_no" TEXT;
