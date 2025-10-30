import dotenv from "dotenv";

dotenv.config();

export const envConfig = {
  PRIVATE_KEY: process.env.PRIVATE_KEY,
  CHAIN_ID: 8453,
};

const getConfig = () => {
  switch (envConfig.CHAIN_ID) {
    case 8453:
      return {
        rpc: "https://8453.rpc.thirdweb.com",
        contracts: {
          MULTICALL3: "0xca11bde05977b3631167028862be2a173976ca11",
          PERMIT2_ADDRESS: "0x000000000022D473030F116dDEE9F6B43aC78BA3",
          BATCH_DISTRIBUTOR: "0x4F57fE90Ba8A20302b6C64D40225876f2ae8fe70",
          FREE_DISTRIBUTOR: "0xfc710Fa940B4C3E5B9c58161cEEA8ECfdd62B960",
        },
      };
    case 84532:
      return {
        rpc: "https://84532.rpc.thirdweb.com",
        contracts: {
          MULTICALL3: "0xca11bde05977b3631167028862be2a173976ca11",
          PERMIT2_ADDRESS: "0x000000000022D473030F116dDEE9F6B43aC78BA3",
          BATCH_DISTRIBUTOR: "0xYourBatchDistributorAddressFor84532",
          FREE_DISTRIBUTOR: "0xE23143D2825F54C07ff9190832E087fF501DeD86",
        },
      };
    default:
      throw new Error("Unsupported CHAIN_ID");
  }
};

export const config = getConfig();
