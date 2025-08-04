import { defineChain, erc20Abi, toHex, parseUnits, createWalletClient, http, createPublicClient, getAddress } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { exchangeContractAbi } from "./sample/exchange.abi";

export const ETHEREAL_TESTNET_CHAIN = defineChain({
  id: 657468,
  name: "Ethereal Testnet",
  nativeCurrency: {
    decimals: 18,
    name: "USDe",
    symbol: "USDe",
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.etherealtest.net"],
      webSocket: ["wss://rpc.etherealtest.net"],
    },
  },
  testnet: true,
});

const DEFAULT_SUBACCOUNT = toHex("primary", { size: 32 });

// @see: https://explorer.etherealtest.net/address/0xa1623E0AA40B142Cf755938b325321fB2c61Cf05
const USDE_ADDRESS = "0xa1623E0AA40B142Cf755938b325321fB2c61Cf05";

const MAKER_MAKER_PK = "0x..."; // Your test private key

// `verifyingContract` can be found via `HTTP GET /v1/rpc/config`
const exchangeContract = getAddress(domain.verifyingContract);

const wallet = createWalletClient({
  account: privateKeyToAccount(MAKER_MAKER_PK),
  chain: ETHEREAL_TESTNET_CHAIN,
  transport: http(),
});
const publicClient = createPublicClient({ chain: ETHEREAL_TESTNET_CHAIN, transport: http() });

const deposit = async (amount: string) => {
  const nativeAmount = parseUnits(amount, 18); // USDe has 18 deciamls.
  const approveHash = await wallet.writeContract({
    address: USDE_ADDRESS,
    abi: erc20Abi,
    functionName: "approve",
    args: [exchangeContract, nativeAmount],
  });
  await publicClient.waitForTransactionReceipt({ hash: approveHash });
  const hash = await wallet.writeContract({
    address: exchangeContract,
    abi: exchangeContractAbi,
    functionName: "deposit",
    args: [DEFAULT_SUBACCOUNT, USDE_ADDRESS, nativeAmount, toHex("refCode", { size: 32 })],
  });
  await publicClient.waitForTransactionReceipt({ hash });
  console.log("Deposited!");
};

deposit("1000"); // Deposit 1000 USDe
