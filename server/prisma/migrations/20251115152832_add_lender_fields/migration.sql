-- AlterTable
ALTER TABLE "Loan_Application" ADD COLUMN     "due_date" TIMESTAMP(3),
ADD COLUMN     "interest_rate" DOUBLE PRECISION,
ADD COLUMN     "rejection_reason" TEXT;
