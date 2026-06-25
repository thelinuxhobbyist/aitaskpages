import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./migrations",
  dialect: "sqlite",
  driver: "d1-http",
  dbCredentials: {
    accountId:
      process.env.CLOUDFLARE_ACCOUNT_ID ?? "2c9fa9806d36682d8166c2b25c3ec166",
    databaseId:
      process.env.CLOUDFLARE_D1_DATABASE_ID ??
      "3f306411-f30c-4593-8cc4-37f798e752e5",
    token: process.env.CLOUDFLARE_API_TOKEN!,
  },
});
