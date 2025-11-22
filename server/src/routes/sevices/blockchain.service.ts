// server/src/routes/sevices/blockchain.service.ts
import { ethers } from "ethers";
import prisma from "../../db";

// Smart Contract Configuration
const CONTRACT_ADDRESS = "0x83233B09Ddd90333744Ea106f754af8780c97056";
const CONTRACT_ABI = [
  {
    inputs: [
      {
        components: [
          { internalType: "string", name: "farmerId", type: "string" },
          { internalType: "string", name: "kycHash", type: "string" },
          { internalType: "string", name: "lenderId", type: "string" },
          { internalType: "string", name: "applicationId", type: "string" },
        ],
        internalType: "struct GlobalStorage.Record",
        name: "rec",
        type: "tuple",
      },
    ],
    name: "addRecord",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "recordId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "string",
        name: "farmerId",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "kycHash",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "lenderId",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "applicationId",
        type: "string",
      },
    ],
    name: "RecordAdded",
    type: "event",
  },
  {
    inputs: [{ internalType: "uint256", name: "id", type: "uint256" }],
    name: "getRecord",
    outputs: [
      {
        components: [
          { internalType: "string", name: "farmerId", type: "string" },
          { internalType: "string", name: "kycHash", type: "string" },
          { internalType: "string", name: "lenderId", type: "string" },
          { internalType: "string", name: "applicationId", type: "string" },
        ],
        internalType: "struct GlobalStorage.Record",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "recordCount",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
];

let provider: ethers.JsonRpcProvider;
let wallet: ethers.Wallet;
let contract: ethers.Contract;
let isInitialized = false;

async function initializeBlockchain() {
  try {
    console.log("\n🔧 Initializing blockchain connection...");

    if (!process.env.SEPOLIA_RPC_URL) {
      throw new Error("SEPOLIA_RPC_URL not found in environment variables");
    }
    if (!process.env.PRIVATE_KEY) {
      throw new Error("PRIVATE_KEY not found in environment variables");
    }

    let privateKey = process.env.PRIVATE_KEY.trim();
    if (!privateKey.startsWith("0x")) {
      privateKey = "0x" + privateKey;
    }

    provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);

    const network = await provider.getNetwork();
    console.log(
      "🌐 Connected to network:",
      network.name,
      "(chainId:",
      network.chainId.toString(),
      ")"
    );

    wallet = new ethers.Wallet(privateKey, provider);
    console.log("👛 Wallet:", wallet.address);

    const balance = await provider.getBalance(wallet.address);
    console.log("💰 Wallet balance:", ethers.formatEther(balance), "ETH");

    contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, wallet);
    console.log("📜 Contract:", CONTRACT_ADDRESS);

    const count = await contract.recordCount();
    console.log("✅ Contract reachable, current recordCount:", count.toString());

    isInitialized = true;
    console.log("✅ Blockchain initialized\n");
  } catch (err: any) {
    console.error("❌ Failed to initialize blockchain:", err.message);
    isInitialized = false;
    throw err;
  }
}

// run init on module load (non-blocking)
initializeBlockchain().catch(() => {});

interface BlockchainRecord {
  farmerId: string;
  kycHash: string;
  lenderId: string;
  applicationId: string;
}

/* ───────────────────────────────────────────────
   ADD SINGLE RECORD TO BLOCKCHAIN
──────────────────────────────────────────────── */
async function addRecordToBlockchain(
  applicationId: string
): Promise<{ txHash: string; recordId: number }> {
  if (!isInitialized) {
    console.log("⚙ Blockchain not initialized, re-initializing...");
    await initializeBlockchain();
  }

  console.log("\n====================");
  console.log("Adding application to blockchain:", applicationId);

  const application = await prisma.loan_Application.findUnique({
    where: { application_id: applicationId },
    include: {
      farmer: { include: { kycDetails: true } },
      lender: true,
    },
  });

  if (!application) {
    throw new Error(`Application ${applicationId} not found`);
  }
  if (!application.farmer.kycDetails) {
    throw new Error(`Farmer ${application.farmer_id} has no KYC`);
  }
  if (!application.lender_id) {
    throw new Error(`Application ${applicationId} has no lender assigned`);
  }

  const record: BlockchainRecord = {
    farmerId: application.farmer_id,
    kycHash: application.farmer.kycDetails.kyc_hash || "",
    lenderId: application.lender_id,
    applicationId: application.application_id,
  };

  console.log("📤 Record payload:", record);

  const gasEstimate = await contract.addRecord.estimateGas(record);
  const gasLimit = (gasEstimate * BigInt(120)) / BigInt(100); // +20%

  console.log("⛽ Gas estimate:", gasEstimate.toString());
  console.log("⛽ Gas limit used:", gasLimit.toString());

  const tx = await contract.addRecord(record, { gasLimit });
  console.log("📨 Tx sent:", tx.hash);
  console.log(
    "🔗 View on Etherscan: https://sepolia.etherscan.io/tx/" + tx.hash
  );

  const receipt = await tx.wait(1);
  console.log("✅ Tx confirmed in block:", receipt.blockNumber);

  const event = receipt.logs
    .map((log: any) => {
      try {
        return contract.interface.parseLog({
          topics: [...log.topics],
          data: log.data,
        });
      } catch {
        return null;
      }
    })
    .find((e: any) => e && e.name === "RecordAdded");

  const recordId = event ? Number(event.args.recordId) : -1;
  if (recordId >= 0) {
    console.log("✅ RecordAdded event parsed, recordId:", recordId);
  } else {
    console.warn("⚠ RecordAdded event not found in logs");
  }

  await prisma.loan_Application.update({
    where: { application_id: applicationId },
    data: { blockchain_hash: tx.hash },
  });
  console.log("💾 DB updated with tx hash");

  console.log("====================\n");

  return { txHash: tx.hash, recordId };
}

/* ───────────────────────────────────────────────
   BATCH ADD MULTIPLE RECORDS
──────────────────────────────────────────────── */
async function batchAddRecordsToBlockchain(
  applicationIds: string[]
): Promise<
  Array<{ applicationId: string; txHash: string; recordId: number; error?: string }>
> {
  const results: Array<{
    applicationId: string;
    txHash: string;
    recordId: number;
    error?: string;
  }> = [];

  console.log(
    `\n🚀 Batch sync started for ${applicationIds.length} application(s)`
  );

  for (let i = 0; i < applicationIds.length; i++) {
    const appId = applicationIds[i];
    console.log(`\n[${i + 1}/${applicationIds.length}] Processing: ${appId}`);

    try {
      const result = await addRecordToBlockchain(appId);
      results.push({ applicationId: appId, ...result });
      console.log(`[${i + 1}/${applicationIds.length}] ✅ Success`);

      if (i < applicationIds.length - 1) {
        console.log("⏳ Waiting 5s before next tx...");
        await new Promise((r) => setTimeout(r, 5000));
      }
    } catch (err: any) {
      console.error(`[${i + 1}/${applicationIds.length}] ❌ Failed:`, err.message);
      results.push({
        applicationId: appId,
        txHash: "",
        recordId: -1,
        error: err.message,
      });
    }
  }

  console.log("\n✅ Batch processing done");
  return results;
}

/* ───────────────────────────────────────────────
   SYNC APPROVED APPLICATIONS
──────────────────────────────────────────────── */
async function syncApprovedApplicationsToBlockchain(): Promise<void> {
  console.log("\n🔁 Starting blockchain sync for approved applications...");

  const applications = await prisma.loan_Application.findMany({
  where: {
    status: "disbursed",
    lender_id: { not: null },
    OR: [
      { blockchain_hash: null },
      { blockchain_hash: "" }
    ]
  },
  include: {
    farmer: {
      include: { kycDetails: true }
    }
  }
});


  console.log(
    `Found ${applications.length} approved application(s) without blockchain hash`
  );

  if (!applications.length) {
    console.log("✔ Nothing to sync, exiting.\n");
    return;
  }

  const valid = applications.filter((app) => app.farmer.kycDetails?.kyc_hash);
  const ids = valid.map((app) => app.application_id);

  console.log(
    `${valid.length} application(s) have valid KYC and will be synced now`
  );

  if (!ids.length) {
    console.log("⚠ No valid applications with KYC hash. Exiting.\n");
    return;
  }

  await batchAddRecordsToBlockchain(ids);
  console.log("🎉 Sync completed.\n");
}

/* ───────────────────────────────────────────────
   VERIFY RECORD ON BLOCKCHAIN
──────────────────────────────────────────────── */
async function verifyRecordOnBlockchain(
  recordId: number
): Promise<BlockchainRecord> {
  if (!isInitialized) await initializeBlockchain();

  console.log(`🔍 Verifying record ${recordId} on blockchain...`);
  const record = await contract.getRecord(recordId);

  const result: BlockchainRecord = {
    farmerId: record.farmerId,
    kycHash: record.kycHash,
    lenderId: record.lenderId,
    applicationId: record.applicationId,
  };

  console.log("✅ Record verified:", result);
  return result;
}

/* ───────────────────────────────────────────────
   GET BLOCKCHAIN RECORD COUNT
──────────────────────────────────────────────── */
async function getBlockchainRecordCount(): Promise<number> {
  if (!isInitialized) await initializeBlockchain();
  const count = await contract.recordCount();
  const num = Number(count);
  console.log("📊 Total blockchain records:", num);
  return num;
}

export {
  addRecordToBlockchain,
  batchAddRecordsToBlockchain,
  syncApprovedApplicationsToBlockchain,
  verifyRecordOnBlockchain,
  getBlockchainRecordCount,
};

export default {
  addRecordToBlockchain,
  batchAddRecordsToBlockchain,
  syncApprovedApplicationsToBlockchain,
  verifyRecordOnBlockchain,
  getBlockchainRecordCount,
};
