-- CreateTable
CREATE TABLE "Farmer" (
    "farmer_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT,
    "Bank_account_no" TEXT,
    "loan_history" TEXT,
    "kyc_verified" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Farmer_pkey" PRIMARY KEY ("farmer_id")
);

-- CreateTable
CREATE TABLE "Lender" (
    "lender_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "Bank_acoount_no" TEXT,
    "total_funded_loans" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Lender_pkey" PRIMARY KEY ("lender_id")
);

-- CreateTable
CREATE TABLE "Loan_Application" (
    "application_id" TEXT NOT NULL,
    "farmer_id" TEXT NOT NULL,
    "lender_id" TEXT,
    "amount" DECIMAL(65,30) NOT NULL,
    "tenure_months" INTEGER NOT NULL,
    "purpose" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "application_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "blockchain_hash" TEXT,

    CONSTRAINT "Loan_Application_pkey" PRIMARY KEY ("application_id")
);

-- CreateTable
CREATE TABLE "KYC_Details" (
    "kyc_id" TEXT NOT NULL,
    "farmer_id" TEXT NOT NULL,
    "verification_status" TEXT NOT NULL,
    "verification_date" TIMESTAMP(3),
    "identity_documents" TEXT,

    CONSTRAINT "KYC_Details_pkey" PRIMARY KEY ("kyc_id")
);

-- CreateTable
CREATE TABLE "Collateral_Document" (
    "document_id" TEXT NOT NULL,
    "application_id" TEXT NOT NULL,
    "document_type" TEXT NOT NULL,
    "file_path" TEXT,
    "upload_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Collateral_Document_pkey" PRIMARY KEY ("document_id")
);

-- CreateTable
CREATE TABLE "Repayment" (
    "repayment_id" TEXT NOT NULL,
    "application_id" TEXT NOT NULL,
    "farmer_id" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "repayment_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "transaction_hash" TEXT,
    "payment_type" TEXT,

    CONSTRAINT "Repayment_pkey" PRIMARY KEY ("repayment_id")
);

-- CreateTable
CREATE TABLE "Disbursement" (
    "disbursement_id" TEXT NOT NULL,
    "application_id" TEXT NOT NULL,
    "lender_id" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "disbursement_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "transaction_hash" TEXT,
    "status" TEXT NOT NULL,

    CONSTRAINT "Disbursement_pkey" PRIMARY KEY ("disbursement_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "KYC_Details_farmer_id_key" ON "KYC_Details"("farmer_id");

-- AddForeignKey
ALTER TABLE "Loan_Application" ADD CONSTRAINT "Loan_Application_farmer_id_fkey" FOREIGN KEY ("farmer_id") REFERENCES "Farmer"("farmer_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Loan_Application" ADD CONSTRAINT "Loan_Application_lender_id_fkey" FOREIGN KEY ("lender_id") REFERENCES "Lender"("lender_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KYC_Details" ADD CONSTRAINT "KYC_Details_farmer_id_fkey" FOREIGN KEY ("farmer_id") REFERENCES "Farmer"("farmer_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Collateral_Document" ADD CONSTRAINT "Collateral_Document_application_id_fkey" FOREIGN KEY ("application_id") REFERENCES "Loan_Application"("application_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Repayment" ADD CONSTRAINT "Repayment_application_id_fkey" FOREIGN KEY ("application_id") REFERENCES "Loan_Application"("application_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Repayment" ADD CONSTRAINT "Repayment_farmer_id_fkey" FOREIGN KEY ("farmer_id") REFERENCES "Farmer"("farmer_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Disbursement" ADD CONSTRAINT "Disbursement_application_id_fkey" FOREIGN KEY ("application_id") REFERENCES "Loan_Application"("application_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Disbursement" ADD CONSTRAINT "Disbursement_lender_id_fkey" FOREIGN KEY ("lender_id") REFERENCES "Lender"("lender_id") ON DELETE RESTRICT ON UPDATE CASCADE;
