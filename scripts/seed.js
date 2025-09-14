require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function seed() {
  try {
    console.log("🌱 Seeding database...");

    // Clear existing data (for dev only, comment out in prod!)
    await prisma.note.deleteMany();
    await prisma.user.deleteMany();
    await prisma.tenant.deleteMany();

    const pwHash = await bcrypt.hash("password", 10);

    // Create Acme tenant with users
    await prisma.tenant.create({
      data: {
        name: "Acme",
        slug: "acme",
        plan: "FREE",
        users: {
          create: [
            {
              email: "admin@acme.test",
              password: pwHash,
              role: "ADMIN",
            },
            {
              email: "user@acme.test",
              password: pwHash,
              role: "MEMBER",
            },
          ],
        },
      },
    });

    // Create Globex tenant with users
    await prisma.tenant.create({
      data: {
        name: "Globex",
        slug: "globex",
        plan: "FREE",
        users: {
          create: [
            {
              email: "admin@globex.test",
              password: pwHash,
              role: "ADMIN",
            },
            {
              email: "user@globex.test",
              password: pwHash,
              role: "MEMBER",
            },
          ],
        },
      },
    });

    console.log("✅ Seeding complete. Test accounts created:");
    console.log("admin@acme.test / password");
    console.log("user@acme.test / password");
    console.log("admin@globex.test / password");
    console.log("user@globex.test / password");
  } catch (err) {
    console.error("❌ Seed failed:", err);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
