/*
  Warnings:

  - Added the required column `aadhar_number` to the `Farmer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Farmer" ADD COLUMN     "aadhar_number" TEXT NOT NULL,
ADD COLUMN     "pan_number" TEXT;
