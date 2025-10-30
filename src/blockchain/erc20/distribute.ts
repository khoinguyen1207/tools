import { ethers, formatUnits, parseUnits } from "ethers";
import { config, envConfig } from "../config";
import BATCH_DISTRIBUTOR_ABI from "../abis/distribute";
import fs from "fs";

const provider = new ethers.JsonRpcProvider(config.rpc);

const TOKEN_ADDRESS = "0x1111111111166b7fe7bd91427724b487980afc69";
const BATCH_SIZE = 100;
const DECIMALS = 18;

const readFile = async (path: string) => {
  const accounts = fs
    .readFileSync(path, "utf-8")
    .toString()
    .split("\n")
    .filter((line) => line.trim().length > 0);
  const wallets = [];
  for (const wallet of accounts) {
    const [privateKey, address] = wallet.split(",");
    if (address) {
      wallets.push({ privateKey, address });
    }
  }
  return wallets.slice(0, BATCH_SIZE);
};

const main = async () => {
  const wallets = await readFile("./src/data/accounts.csv");

  const wallet = new ethers.Wallet(envConfig.PRIVATE_KEY as string, provider);
  const contract = new ethers.Contract(config.contracts.BATCH_DISTRIBUTOR, BATCH_DISTRIBUTOR_ABI, wallet);
  const platformFee = parseUnits("0.003", DECIMALS);
  const tokenPerWallet = parseUnits("0.01", DECIMALS);

  const receivers = wallets.map((w) => w.address);
  const amounts = wallets.map(() => tokenPerWallet);
  const totalAmount = amounts.reduce((sum, amount) => sum + amount, 0n);

  console.table({
    wallets: wallets.length,
    signer: wallet.address,
    platformFee: formatUnits(platformFee, DECIMALS),
    tokenPerWallet: formatUnits(tokenPerWallet, DECIMALS),
    tokenPerWalletWei: tokenPerWallet,
    totalAmount: formatUnits(totalAmount, DECIMALS),
    totalAmountWei: totalAmount,
  });

  const gasEstimate = await contract.distributeERC20.estimateGas(TOKEN_ADDRESS, receivers, amounts, totalAmount, {
    value: platformFee,
  });
  console.log("====> Gas Estimate: ", gasEstimate);
};

main().catch((error) => {
  console.error("Error in approval process:", error);
  process.exit(1);
});
