import { PoolKey } from "@uniswap/v4-sdk";

type PathKey = {
  intermediateCurrency: string;
  fee: number;
  tickSpacing: number;
  hooks: string;
  hookData: string;
};

export function encodeMultihopExactInPath(poolKeys: PoolKey[], currencyIn: string): PathKey[] {
  const pathKeys: PathKey[] = [];
  let currentCurrencyIn = currencyIn;

  for (let i = 0; i < poolKeys.length; i++) {
    // Determine the output currency for this hop
    const currencyOut = currentCurrencyIn === poolKeys[i].currency0 ? poolKeys[i].currency1 : poolKeys[i].currency0;

    // Create path key for this hop
    const pathKey: PathKey = {
      intermediateCurrency: currencyOut,
      fee: poolKeys[i].fee,
      tickSpacing: poolKeys[i].tickSpacing,
      hooks: poolKeys[i].hooks,
      hookData: "0x",
    };

    pathKeys.push(pathKey);
    currentCurrencyIn = currencyOut; // Output becomes input for next hop
  }

  return pathKeys;
}

export const encodeMultihopExactOutPath = (poolKeys: any[], currencyOut: string): any[] => {
  let pathKeys = [];
  for (let i = poolKeys.length; i > 0; i--) {
    let currencyIn = currencyOut == poolKeys[i - 1].currency0 ? poolKeys[i - 1].currency1 : poolKeys[i - 1].currency0;
    let pathKey = {
      intermediateCurrency: currencyIn,
      fee: poolKeys[i - 1].fee,
      tickSpacing: poolKeys[i - 1].tickSpacing,
      hooks: poolKeys[i - 1].hooks,
      hookData: "0x",
    };
    // unshift pushes to the beginning of the array
    pathKeys.unshift(pathKey);
    currencyOut = currencyIn;
  }
  return pathKeys;
};
