import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient {
  const client = new PrismaClient({
    log: [
      { emit: "event", level: "error" },
      { emit: "event", level: "warn" },
    ],
  });

  // @ts-ignore - Prisma event listener
  client.$on("error", (e: any) => {
    const msg = typeof e === "string" ? e : e?.message || "";
    // Suppress routine serverless idle socket resets by Neon/PgBouncer
    if (
      msg.includes("Connection reset by peer") ||
      msg.includes("Connection closed") ||
      msg.includes("kind: Closed") ||
      msg.includes("code: 104")
    ) {
      return;
    }
    console.error("Prisma error:", msg || e);
  });

  return client;
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

globalForPrisma.prisma = prisma;

export default prisma;
