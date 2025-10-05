import { CommandType, RoutePlanner } from "@uniswap/universal-router-sdk";
import { ethers } from "ethers";
import { envConfig } from "../config";
import { encodePathExactInput } from "../utils/uniswap-v3";

// Example configuration - replace with your own values
// Unichain Mainnet: 130

const provider = new ethers.JsonRpcProvider("https://130.rpc.thirdweb.com");
const wallet = new ethers.Wallet(envConfig.PRIVATE_KEY as string, provider);

const ADDRESSES = {
  UNIVERSAL_ROUTER: "0xef740bf23acae26f6492b10de645d6b98dc8eaf3",
  MULTICALL3: "0xca11bde05977b3631167028862be2a173976ca11",
  ETH: "0x00000000000000000000000000000000000000000",
  WETH9: "0x4200000000000000000000000000000000000006",
  USDC: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  USDT: "0xdAC17F958A7e4cE539739dF2C5dAcb4c659F2488D",
};

const main = async () => {
  const routePlanner = new RoutePlanner();

  const deadline = Math.floor(Date.now() / 1000) + 3600;
  const amountIn = ethers.parseUnits("0.001", 18); // 0.001 ETH

  const pathTokens = [ADDRESSES.ETH, ADDRESSES.USDC, ADDRESSES.USDT];
  const poolFees = [3000, 100];

  routePlanner.addCommand(CommandType.WRAP_ETH, [ADDRESSES.UNIVERSAL_ROUTER, amountIn]);
  routePlanner.addCommand(CommandType.V3_SWAP_EXACT_IN, [
    wallet.address, // recipient
    amountIn,
    0,
    encodePathExactInput(pathTokens, poolFees),
    false,
  ]);
  const { commands, inputs } = routePlanner;

  const universalRouter = new ethers.Contract(
    ADDRESSES.UNIVERSAL_ROUTER,
    ["function execute(tuple(uint8,bytes)[],uint256,uint256,(address,uint256)[]) payable returns (uint256)"],
    wallet
  );

  const tx = await universalRouter.execute(commands, inputs, deadline, {
    value: amountIn,
  });

  const receipt = await tx.wait();
  console.log("Multi-hop swap completed! Transaction hash:", receipt.transactionHash);
};
