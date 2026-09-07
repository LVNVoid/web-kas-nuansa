import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

function hashPassword(password: string): string {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    hash = (hash << 5) - hash + password.charCodeAt(i);
    hash |= 0;
  }
  return `pwd_h_${Math.abs(hash)}_${password.length}`;
}

async function main() {
  console.log("🌱 Starting database seeding...");

  // 1. Seed Admin
  const defaultAdmin = await prisma.adminUser.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      username: "admin",
      passwordHash: hashPassword("admin123"),
      name: "Bendahara RT",
    },
  });
  console.log(`✓ Admin seeded: ${defaultAdmin.username}`);

  // 2. Seed Resident Blocks (Blok B1-B28 & C1-C20)
  const blocks: string[] = [];
  for (let i = 1; i <= 28; i++) blocks.push(`B${i}`);
  for (let i = 1; i <= 20; i++) blocks.push(`C${i}`);

  console.log(`Seeding ${blocks.length} resident blocks...`);
  for (const blockName of blocks) {
    await prisma.residentBlock.upsert({
      where: { blockName },
      update: {},
      create: {
        blockName,
        isOccupied: true,
        ownerName: `Warga ${blockName}`,
      },
    });
  }
  console.log("✓ Resident blocks seeded.");

  // 3. Seed Current Period (September 2026)
  const period = await prisma.period.upsert({
    where: {
      month_year: {
        month: 9,
        year: 2026,
      },
    },
    update: {},
    create: {
      month: 9,
      year: 2026,
      name: "September 2026",
      hasThr: false,
    },
  });
  console.log(`✓ Period seeded: ${period.name}`);

  // 4. Seed initial sample payment records for some blocks
  const allBlocks = await prisma.residentBlock.findMany();
  for (let i = 0; i < allBlocks.length; i++) {
    const block = allBlocks[i];
    const isPaid = i % 3 !== 0; // ~66% already paid for demo
    const iuranAmount = isPaid ? 50000 : 0;
    const kasAmount = isPaid ? 25000 : 0;
    const infaqAmount = isPaid && i % 2 === 0 ? 25000 : 0;
    const totalAmount = iuranAmount + kasAmount + infaqAmount;

    await prisma.paymentRecord.upsert({
      where: {
        blockId_periodId: {
          blockId: block.id,
          periodId: period.id,
        },
      },
      update: {},
      create: {
        blockId: block.id,
        periodId: period.id,
        isPaid,
        paidAt: isPaid ? new Date("2026-09-02") : null,
        iuranAmount,
        kasAmount,
        infaqAmount,
        thrAmount: 0,
        totalAmount,
      },
    });
  }
  console.log("✓ Sample payment records seeded.");

  // 5. Seed sample expenses
  await prisma.expenseRecord.createMany({
    data: [
      {
        periodId: period.id,
        date: new Date("2026-09-03"),
        category: "Kebersihan",
        title: "Honor Petugas Sampah & Kebersihan",
        amount: 1200000,
        notes: "Gaji 2 petugas sampah bulan September",
      },
      {
        periodId: period.id,
        date: new Date("2026-09-05"),
        category: "Fasum",
        title: "Penggantian Lampu Jalan Blok B",
        amount: 350000,
        notes: "Pembelian 5 unit lampu LED & fitting",
      },
    ],
    skipDuplicates: true,
  });
  console.log("✓ Sample expenses seeded.");

  console.log("✅ Seeding completed successfully.");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
