import pLimit from "p-limit";

const limit = pLimit(2); // chỉ chạy 2 task song song

async function swap(account: string) {
  console.log("🔄 Swap", account);
  await new Promise((r) => setTimeout(r, 2000));
  console.log("✅ Done", account);
}

async function main() {
  const accounts = ["acc1", "acc2", "acc3", "acc4"];

  await Promise.all(accounts.map((acc) => limit(() => swap(acc))));
}

main();
