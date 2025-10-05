import { FeeAmount } from "@uniswap/v3-sdk";

const FEE_SIZE = 3;

export function encodePath(path: string[], fees: number[]): string {
  let encoded = "0x";
  for (let i = 0; i < path.length - 1; i++) {
    // 20 byte encoding of the address
    encoded += path[i].slice(2);
    // 3 byte encoding of the fee
    encoded += Number(fees[i])
      .toString(16)
      .padStart(2 * FEE_SIZE, "0");
  }
  // encode the final token
  encoded += path[path.length - 1].slice(2);

  return encoded.toLowerCase();
}

export function encodePathExactInput(tokens: string[], fees: number[]): string {
  return encodePath(tokens, fees);
}
