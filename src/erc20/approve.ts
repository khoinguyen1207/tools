import { ethers } from "ethers";
import { envConfig } from "../config";
import { erc20Abi } from "viem";

// Base
const rpc = "https://8453.rpc.thirdweb.com";
const provider = new ethers.JsonRpcProvider(rpc);

const TOKEN_ADDRESS = "0x1111111111166b7fe7bd91427724b487980afc69";
const PERMIT2_ADDRESS = "0x000000000022D473030F116dDEE9F6B43aC78BA3";
const GAS_LIMIT = 60000;

const getGasPrice = async () => {
  const block = await provider.getBlock("latest");
  if (block && block.baseFeePerGas) {
    return (block.baseFeePerGas * 110n) / 100n; // 10% increase over base fee
  }
  throw new Error("Failed to fetch gas price");
};

const main = async () => {
  const wallet = new ethers.Wallet(envConfig.PRIVATE_KEY as string, provider);
  const tokenContract = new ethers.Contract(TOKEN_ADDRESS, erc20Abi, wallet);

  const gasPrice = await getGasPrice();
  console.log("Gas Price: ", gasPrice);

  const allowance = await tokenContract.allowance(wallet.address, PERMIT2_ADDRESS);
  console.log("Current allowance:", allowance);

  if (allowance > 0) {
    console.log("Token already approved for Permit2.");
    return;
  }

  const tx = await tokenContract.approve(PERMIT2_ADDRESS, ethers.MaxUint256, {
    gasLimit: GAS_LIMIT,
    maxFeePerGas: gasPrice,
    maxPriorityFeePerGas: gasPrice,
  });
  console.log("Approval transaction hash:", tx.hash);
  const receipt = await tx.wait();
  console.log("Approval transaction confirmed");
  console.log("Receipt", receipt);
};

main().catch((error) => {
  console.error("Error in approval process:", error);
  process.exit(1);
});
