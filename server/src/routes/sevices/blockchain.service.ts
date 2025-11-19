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

// Initialize provider and wallet with error handling
let provider: ethers.JsonRpcProvider;
let wallet: ethers.Wallet;
let contract: ethers.Contract;
let isInitialized = false;

async function initializeBlockchain() {
  try {
    console.log('\n🔧 Initializing blockchain connection...');
    
    if (!process.env.SEPOLIA_RPC_URL) {
      throw new Error(' SEPOLIA_RPC_URL not found in environment variables');
    }
    if (!process.env.PRIVATE_KEY) {
      throw new Error(' PRIVATE_KEY not found in environment variables');
    }

    // Remove '0x' prefix if present and re-add it to ensure correct format
    let privateKey = process.env.PRIVATE_KEY.trim();
    if (!privateKey.startsWith('0x')) {
      privateKey = '0x' + privateKey;
    }

    console.log('🌐 RPC URL:', process.env.SEPOLIA_RPC_URL);
    console.log('📝 Private Key length:', privateKey.length, 'characters');

    provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
    
    // Test provider connection
    console.log('🔍 Testing RPC connection...');
    const network = await provider.getNetwork();
    console.log(' Connected to network:', network.name, '(chainId:', network.chainId.toString(), ')');
    
    // Verify it's Sepolia (chainId 11155111)
    if (network.chainId !== BigInt(11155111)) {
      console.warn('  Warning: Expected Sepolia (chainId 11155111), got chainId:', network.chainId.toString());
    }

    wallet = new ethers.Wallet(privateKey, provider);
    console.log(' Wallet address:', wallet.address);
    
    // Check wallet balance
    const balance = await provider.getBalance(wallet.address);
    const balanceInEth = ethers.formatEther(balance);
    console.log(' Wallet balance:', balanceInEth, 'ETH');
    
    if (balance === BigInt(0)) {
      console.error(' ERROR: Wallet has 0 balance!');
      console.error(' Get Sepolia testnet ETH from: https://sepoliafaucet.com/');
      console.error(' Or use: https://www.alchemy.com/faucets/ethereum-sepolia');
      throw new Error('Insufficient funds: Wallet balance is 0 ETH');
    }

    contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, wallet);
    console.log(' Contract address:', CONTRACT_ADDRESS);
    
    // Test contract connection by reading recordCount
    try {
      const count = await contract.recordCount();
      console.log('Current record count on blockchain:', count.toString());
      console.log(' Contract connection successful!');
    } catch (error: any) {
      console.error(' Failed to read from contract:', error.message);
      throw new Error('Contract connection failed - verify contract address and ABI');
    }
    
    isInitialized = true;
    console.log(' Blockchain initialized successfully!\n');
  } catch (error: any) {
    console.error(' Failed to initialize blockchain:', error.message);
    isInitialized = false;
    throw error;
  }
}

// Initialize on module load
initializeBlockchain().catch(err => {
  console.error('Failed to initialize blockchain on startup:', err);
});

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
  
  if (!isInitialized) {
    console.log('  Blockchain not initialized, attempting to initialize...');
    await initializeBlockchain();
  }

  try {
    console.log(`\n${'='.repeat(60)}`);
    console.log(` Processing application: ${applicationId}`);
    console.log('='.repeat(60));

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
      throw new Error(`Application ${applicationId} not found in database`);
    }

    console.log(' Application found in database');
    console.log('   - Status:', application.status);
    console.log('   - Amount:', application.amount.toString());
    console.log('   - Farmer ID:', application.farmer_id);
    console.log('   - Lender ID:', application.lender_id || 'NOT ASSIGNED');
    console.log('   - Blockchain Hash:', application.blockchain_hash || 'NOT SET');

    if (!application.farmer.kycDetails) {
      throw new Error(`Farmer ${application.farmer_id} has no KYC details`);
    }

    console.log('KYC details found');
    console.log('   - KYC Status:', application.farmer.kycDetails.verification_status);
    console.log('   - KYC Hash:', application.farmer.kycDetails.kyc_hash || 'NOT SET');

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

    console.log('\n📤 Preparing to send record to blockchain:');
    console.log(JSON.stringify(record, null, 2));

    // Check wallet balance before transaction
    const balance = await provider.getBalance(wallet.address);
    const balanceInEth = ethers.formatEther(balance);
    console.log('\n💰 Current wallet balance:', balanceInEth, 'ETH');

    if (balance === BigInt(0)) {
      throw new Error('Insufficient funds: Wallet balance is 0 ETH. Get testnet ETH from https://sepoliafaucet.com/');
    }

    // Estimate gas before sending transaction
    console.log('\n Estimating gas...');
    let gasEstimate;
    try {
      gasEstimate = await contract.addRecord.estimateGas(record);
      console.log(' Gas estimate:', gasEstimate.toString(), 'units');
      
      // Get current gas price
      const feeData = await provider.getFeeData();
      console.log(' Max fee per gas:', ethers.formatUnits(feeData.maxFeePerGas || BigInt(0), 'gwei'), 'gwei');
      console.log(' Max priority fee:', ethers.formatUnits(feeData.maxPriorityFeePerGas || BigInt(0), 'gwei'), 'gwei');
      
      // Calculate estimated cost
      const estimatedCost = gasEstimate * (feeData.maxFeePerGas || BigInt(0));
      console.log('Estimated transaction cost:', ethers.formatEther(estimatedCost), 'ETH');
      
      if (balance < estimatedCost) {
        throw new Error(`Insufficient funds. Need ${ethers.formatEther(estimatedCost)} ETH, have ${balanceInEth} ETH`);
      }
    } catch (error: any) {
      console.error(' Gas estimation failed:', error.message);
      if (error.data) {
        console.error('Error data:', error.data);
      }
      throw new Error(`Gas estimation failed: ${error.message}`);
    }

    // Send transaction with explicit gas limit (add 20% buffer)
    const gasLimit = (gasEstimate * BigInt(120)) / BigInt(100);
    console.log(' Setting gas limit:', gasLimit.toString(), '(+20% buffer)');
    
    console.log('\n Sending transaction to blockchain...');
    let tx;
    try {
      tx = await contract.addRecord(record, {
        gasLimit: gasLimit
      });
      console.log(' Transaction sent successfully!');
      console.log(' Transaction hash:', tx.hash);
      console.log(' View on Etherscan: https://sepolia.etherscan.io/tx/' + tx.hash);
    } catch (error: any) {
      console.error(' Transaction failed to send:', error.message);
      if (error.code) console.error('Error code:', error.code);
      if (error.reason) console.error('Error reason:', error.reason);
      if (error.data) console.error('Error data:', error.data);
      throw error;
    }
    
    console.log('\n Waiting for transaction confirmation...');
    console.log('   (This may take 15-30 seconds on Sepolia testnet)');

    // Wait for confirmation with timeout
    let receipt;
    try {
      receipt = await tx.wait(1); // Wait for 1 confirmation
    } catch (error: any) {
      console.error(' Transaction confirmation failed:', error.message);
      throw new Error(`Transaction failed during confirmation: ${error.message}`);
    }
    
    if (!receipt) {
      throw new Error('Transaction receipt is null');
    }

    console.log(' Transaction confirmed!');
    console.log(' Block number:', receipt.blockNumber);
    console.log(' Gas used:', receipt.gasUsed.toString());
    console.log(' Effective gas price:', ethers.formatUnits(receipt.gasPrice || BigInt(0), 'gwei'), 'gwei');
    
    const txCost = receipt.gasUsed * (receipt.gasPrice || BigInt(0));
    console.log(' Total transaction cost:', ethers.formatEther(txCost), 'ETH');

    // Parse the event to get recordId
    console.log('\nParsing transaction logs...');
    const event = receipt.logs
      .map((log: any) => {
        try {
          return contract.interface.parseLog({
            topics: [...log.topics],
            data: log.data
          });
        } catch {
          return null;
        }
      })
      .find((e: any) => e && e.name === 'RecordAdded');

    const recordId = event ? Number(event.args.recordId) : -1;
    
    if (recordId >= 0) {
      console.log('RecordAdded event found');
      console.log(' Blockchain Record ID:', recordId);
    } else {
      console.warn('  RecordAdded event not found in transaction logs');
    }

    // Update database with blockchain hash
    console.log('\n Updating database with transaction hash...');
    await prisma.loan_Application.update({
      where: { application_id: applicationId },
      data: { 
        blockchain_hash: tx.hash
      }
    });
    console.log(' Database updated successfully');

    console.log('\n' + '='.repeat(60));
    console.log(' TRANSACTION COMPLETED SUCCESSFULLY!');
    console.log('='.repeat(60) + '\n');

    return {
      txHash: tx.hash,
      recordId
    };
  } catch (error: any) {
    console.error('\n' + '='.repeat(60));
    console.error(' TRANSACTION FAILED');
    console.error('='.repeat(60));
    console.error('Error message:', error.message);
    
    if (error.code) {
      console.error('Error code:', error.code);
    }
    if (error.reason) {
      console.error('Error reason:', error.reason);
    }
    if (error.transaction) {
      console.error('Failed transaction:', JSON.stringify(error.transaction, null, 2));
    }
    if (error.receipt) {
      console.error('Transaction receipt:', JSON.stringify(error.receipt, null, 2));
    }
    console.error('='.repeat(60) + '\n');
    
    throw error;
  }
}

/**
 * Batch add multiple records to blockchain
 */
async function batchAddRecordsToBlockchain(
  applicationIds: string[]
): Promise<Array<{ applicationId: string; txHash: string; recordId: number; error?: string }>> {
  const results = [];

  console.log(`\n${'='.repeat(60)}`);
  console.log(` BATCH PROCESSING: ${applicationIds.length} applications`);
  console.log('='.repeat(60) + '\n');

  for (let i = 0; i < applicationIds.length; i++) {
    const appId = applicationIds[i];
    console.log(`\n[${i + 1}/${applicationIds.length}] Processing: ${appId}`);
    
    try {
      const result = await addRecordToBlockchain(appId);
      results.push({
        applicationId: appId,
        ...result
      });
      
      console.log(` [${i + 1}/${applicationIds.length}] Success: ${appId}`);
      
      // Wait 5 seconds between transactions to avoid nonce issues
      if (i < applicationIds.length - 1) {
        console.log('\n⏳ Waiting 5 seconds before next transaction...');
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(` [${i + 1}/${applicationIds.length}] Failed: ${appId}`);
      console.error('   Error:', errorMessage);
      
      results.push({
        applicationId: appId,
        txHash: '',
        recordId: -1,
        error: errorMessage
      });
      
      // Continue with next transaction even if one fails
      console.log('   Continuing with next transaction...');
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log(' BATCH PROCESSING COMPLETED');
  console.log('='.repeat(60));
  console.log(` Successful: ${results.filter(r => !r.error).length}`);
  console.log(` Failed: ${results.filter(r => r.error).length}`);
  console.log('='.repeat(60) + '\n');

  return results;
}

/**
 * Sync all approved applications to blockchain
 */
async function syncApprovedApplicationsToBlockchain(): Promise<void> {
  try {
    console.log('\n' + '='.repeat(60));
    console.log(' SYNC: Starting sync of approved applications');
    console.log('='.repeat(60) + '\n');

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

    console.log(` Found ${applications.length} approved applications without blockchain hash`);

    if (applications.length === 0) {
      console.log(' No applications to sync - all up to date!');
      console.log('='.repeat(60) + '\n');
      return;
    }

    // Filter for valid applications
    const validApplications = applications.filter(
      app => app.farmer.kycDetails?.kyc_hash
    );

    console.log(`${validApplications.length} applications have valid KYC`);
    
    if (validApplications.length < applications.length) {
      const missingKyc = applications.length - validApplications.length;
      console.log(`  ${missingKyc} applications skipped (missing KYC hash)`);
      
      // Log which applications are missing KYC
      const missingKycApps = applications.filter(app => !app.farmer.kycDetails?.kyc_hash);
      console.log('\n Applications missing KYC hash:');
      missingKycApps.forEach(app => {
        console.log(`   - ${app.application_id} (Farmer: ${app.farmer_id})`);
      });
    }

    if (validApplications.length === 0) {
      console.log(' No valid applications to sync');
      console.log('='.repeat(60) + '\n');
      return;
    }

    const applicationIds = validApplications.map(app => app.application_id);
    const results = await batchAddRecordsToBlockchain(applicationIds);

    // Log final results
    const successful = results.filter(r => !r.error);
    const failed = results.filter(r => r.error);

    console.log('\n' + '='.repeat(60));
    console.log(' SYNC SUMMARY');
    console.log('='.repeat(60));
    console.log(`Successfully synced: ${successful.length}`);
    console.log(` Failed to sync: ${failed.length}`);
    
    if (successful.length > 0) {
      console.log('\n Successful transactions:');
      successful.forEach(s => {
        console.log(`   - ${s.applicationId}`);
        console.log(`     TX: https://sepolia.etherscan.io/tx/${s.txHash}`);
      });
    }
    
    if (failed.length > 0) {
      console.log('\n Failed transactions:');
      failed.forEach(f => {
        console.log(`   - ${f.applicationId}: ${f.error}`);
      });
    }
    console.log('='.repeat(60) + '\n');
  } catch (error: any) {
    console.error('\n' + '='.repeat(60));
    console.error(' SYNC ERROR');
    console.error('='.repeat(60));
    console.error('Error:', error.message);
    console.error('='.repeat(60) + '\n');
    throw error;
  }
}

/**
 * Verify a record on the blockchain
 */
async function verifyRecordOnBlockchain(
  recordId: number
): Promise<BlockchainRecord> {
  if (!isInitialized) {
    await initializeBlockchain();
  }

  try {
    console.log(`🔍 Verifying record ${recordId} on blockchain...`);
    const record = await contract.getRecord(recordId);
    
    const result = {
      farmerId: record.farmerId,
      kycHash: record.kycHash,
      lenderId: record.lenderId,
      applicationId: record.applicationId
    };
    
    console.log(' Record verified:', JSON.stringify(result, null, 2));
    return result;
  } catch (error: any) {
    console.error(' Error verifying record:', error.message);
    throw error;
  }
}

/**
 * Get the total count of records on the blockchain
 */
async function getBlockchainRecordCount(): Promise<number> {
  if (!isInitialized) {
    await initializeBlockchain();
  }

  try {
    const count = await contract.recordCount();
    const numCount = Number(count);
    console.log(` Total blockchain records: ${numCount}`);
    return numCount;
  } catch (error: any) {
    console.error(' Error getting record count:', error.message);
    throw error;
  }
}

export {
  addRecordToBlockchain,
  batchAddRecordsToBlockchain,
  syncApprovedApplicationsToBlockchain,
  verifyRecordOnBlockchain,
  getBlockchainRecordCount
};

export default {
  addRecordToBlockchain,
  batchAddRecordsToBlockchain,
  syncApprovedApplicationsToBlockchain,
  verifyRecordOnBlockchain,
  getBlockchainRecordCount
};

// CLI testing interface
if (require.main === module) {
  async function main() {
    try {
      console.log('🚀 Blockchain Service Test Started\n');

      // Test 1: Get current record count
      console.log('TEST 1: Getting blockchain record count...');
      const count = await getBlockchainRecordCount();
      console.log(`Result: ${count} records\n`);

      // Test 2: Check for applications to sync
      console.log('TEST 2: Checking for applications to sync...');
      const apps = await prisma.loan_Application.findMany({
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
      
      console.log(`Found ${apps.length} applications to sync`);
      
      if (apps.length > 0) {
        console.log('\nApplications details:');
        apps.forEach((app, i) => {
          console.log(`\n${i + 1}. Application ID: ${app.application_id}`);
          console.log(`   Status: ${app.status}`);
          console.log(`   Farmer: ${app.farmer_id}`);
          console.log(`   Lender: ${app.lender_id}`);
          console.log(`   KYC Hash: ${app.farmer.kycDetails?.kyc_hash || 'MISSING'}`);
        });
      }

      // Test 3: Sync applications
      console.log('\n\nTEST 3: Syncing applications to blockchain...');
      await syncApprovedApplicationsToBlockchain();

      console.log('\n All tests completed!');

    } catch (error: any) {
      console.error('\n Test failed:', error.message);
      console.error(error);
      process.exit(1);
    } finally {
      await prisma.$disconnect();
      process.exit(0);
    }
  }

  main();
}