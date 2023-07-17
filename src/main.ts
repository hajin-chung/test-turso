import { type Client, createClient } from "@libsql/client";
import * as fs from "fs/promises";
import "dotenv/config";

async function initializeDB(client: Client) {
  const sqlContent = (await fs.readFile("./data.sql")).toString();

  console.log("starting query");
  console.log(sqlContent);
  const res = await client.executeMultiple(sqlContent);
  console.log(res);
}

async function queryDB(client: Client) {
  const query = "SELECT * FROM albums LIMIT 100";
  const res = await client.execute(query);
  return res;
}

async function timeFunction(f: () => any) {
  const start = Date.now();

  const res = await f();

  const end = Date.now();

  console.log(`execution time: ${end - start}ms`);
  console.log(`result: ${JSON.stringify(res)}`);
}

async function main() {
  const client = createClient({
    url: process.env.TURSO_URL,
    authToken: process.env.TURSO_TOKEN,
  });

  // initializeDB(client);

  await timeFunction(async () => await queryDB(client));
}

main().catch((e) => console.error(e));
