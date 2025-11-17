import { PrismaClient } from '@prisma/client';
import { ethers } from 'ethers';

const prisma = new PrismaClient();

// Smart Contract Configuration
const CONTRACT_ADDRESS = '0x83233B09Ddd90333744Ea106f754af8780c97056';
const CONTRACT_ABI = [
  {
    "inputs": [
      {
        "components": [
          { "internalType": "string", "name": "farmerId", "type": "string" },
          { "internalType": "string", "name": "kycHash", "type": "string" },
          { "internalType": "string", "name": "lenderId", "type": "string" },
          { "internalType": "string", "name": "applicationId", "type": "string" }
        ],
        "internalType": "struct GlobalStorage.Record",
        "name": "rec",
        "type": "tuple"
      }
    ],
    "name": "addRecord",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "recordId", "type": "uint256" },
      { "indexed": false, "internalType": "string", "name": "farmerId", "type": "string" },
      { "indexed": false, "internalType": "string", "name": "kycHash", "type": "string" },
      { "indexed": false, "internalType": "string", "name": "lenderId", "type": "string" },
      { "indexed": false, "internalType": "string", "name": "applicationId", "type": "string" }
    ],
    "name": "RecordAdded",
    "type": "event"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "id", "type": "uint256" }],
    "name": "getRecord",
    "outputs": [
      {
        "components": [
          { "internalType": "string", "name": "farmerId", "type": "string" },
          { "internalType": "string", "name": "kycHash", "type": "string" },
          { "internalType": "string", "name": "lenderId", "type": "string" },
          { "internalType": "string", "name": "applicationId", "type": "string" }
        ],
        "internalType": "struct GlobalStorage.Record",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "recordCount",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  }
];

// Initialize provider and wallet
const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);
const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, wallet);

interface BlockchainRecord {
  farmerId: string;
  kycHash: string;
  lenderId: string;
  applicationId: string;
}

/**
 * Add a loan application record to the blockchain
 */
async function addRecordToBlockchain(
  applicationId: string
): Promise<{ txHash: string; recordId: number }> {
  try {
    // Fetch the loan application with related data
    const application = await prisma.loan_Application.findUnique({
      where: { application_id: applicationId },
      include: {
        farmer: {
          include: {
            kycDetails: true
          }
        },
        lender: true
      }
    });

    if (!application) {
      throw new Error(`Application ${applicationId} not found`);
    }

    if (!application.farmer.kycDetails) {
      throw new Error(`Farmer ${application.farmer_id} has no KYC details`);
    }

    if (!application.lender_id) {
      throw new Error(`Application ${applicationId} has no lender assigned`);
    }

    // Prepare the record
    const record: BlockchainRecord = {
      farmerId: application.farmer_id,
      kycHash: application.farmer.kycDetails.kyc_hash || '',
      lenderId: application.lender_id,
      applicationId: application.application_id
    };

    console.log('Adding record to blockchain:', record);

    // Send transaction
    const tx = await contract.addRecord(record);
    console.log('Transaction sent:', tx.hash);

    // Wait for confirmation
    const receipt = await tx.wait();
    console.log('Transaction confirmed in block:', receipt.blockNumber);

    // Parse the event to get the recordId
    const event = receipt.logs
      .map((log: any) => {
        try {
          return contract.interface.parseLog(log);
        } catch {
          return null;
        }
      })
      .find((e: any) => e && e.name === 'RecordAdded');

    const recordId = event ? Number(event.args.recordId) : -1;

    // Update the application with blockchain hash
    await prisma.loan_Application.update({
      where: { application_id: applicationId },
      data: { blockchain_hash: tx.hash }
    });

    return {
      txHash: tx.hash,
      recordId
    };
  } catch (error) {
    console.error('Error adding record to blockchain:', error);
    throw error;
  }
}

/**
 * Batch add multiple applications to blockchain
 */
async function batchAddRecordsToBlockchain(
  applicationIds: string[]
): Promise<Array<{ applicationId: string; txHash: string; recordId: number; error?: string }>> {
  const results = [];

  for (const appId of applicationIds) {
    try {
      const result = await addRecordToBlockchain(appId);
      results.push({
        applicationId: appId,
        ...result
      });
      
      // Add delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (error) {
      results.push({
        applicationId: appId,
        txHash: '',
        recordId: -1,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  return results;
}

/**
 * Sync all approved applications that haven't been added to blockchain
 */
async function syncApprovedApplicationsToBlockchain(): Promise<void> {
  try {
    // Find all approved applications without blockchain hash
    const applications = await prisma.loan_Application.findMany({
      where: {
        status: 'approved',
        blockchain_hash: null,
        lender_id: { not: null }
      },
      include: {
        farmer: {
          include: {
            kycDetails: true
          }
        }
      }
    });

    console.log(`Found ${applications.length} applications to sync`);

    // Filter applications with valid KYC
    const validApplications = applications.filter(
      app => app.farmer.kycDetails?.kyc_hash
    );

    console.log(`${validApplications.length} applications have valid KYC`);

    const applicationIds = validApplications.map(app => app.application_id);
    const results = await batchAddRecordsToBlockchain(applicationIds);

    console.log('Sync completed:', results);
  } catch (error) {
    console.error('Error syncing applications:', error);
    throw error;
  }
}

/**
 * Verify a record on the blockchain
 */
async function verifyRecordOnBlockchain(
  recordId: number
): Promise<BlockchainRecord> {
  try {
    const record = await contract.getRecord(recordId);
    return {
      farmerId: record.farmerId,
      kycHash: record.kycHash,
      lenderId: record.lenderId,
      applicationId: record.applicationId
    };
  } catch (error) {
    console.error('Error verifying record:', error);
    throw error;
  }
}

/**
 * Get total records count on blockchain
 */
async function getBlockchainRecordCount(): Promise<number> {
  try {
    const count = await contract.recordCount();
    return Number(count);
  } catch (error) {
    console.error('Error getting record count:', error);
    throw error;
  }
}

// Export functions
export {
  addRecordToBlockchain,
  batchAddRecordsToBlockchain,
  syncApprovedApplicationsToBlockchain,
  verifyRecordOnBlockchain,
  getBlockchainRecordCount
};

// Example usage
async function main() {
  try {
    // Example 1: Add a single application
    // const result = await addRecordToBlockchain('your-application-id');
    // console.log('Record added:', result);

    // Example 2: Sync all approved applications
    await syncApprovedApplicationsToBlockchain();

    // Example 3: Verify a record
    // const record = await verifyRecordOnBlockchain(0);
    // console.log('Verified record:', record);

    // Example 4: Get total count
    const count = await getBlockchainRecordCount();
    console.log('Total blockchain records:', count);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Uncomment to run
// main();