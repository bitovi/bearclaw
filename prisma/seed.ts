import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seed() {
  const emails = ["zach.casper@bigbear.ai", "eric.conway@bigbear.ai"];

  // cleanup the existing database
  await prisma.user.deleteMany({}).catch(() => {
    // no worries if it doesn't exist yet
  });

  const hashedPassword = await bcrypt.hash("m3ssWithB34rGetTheCl@w", 10);

  for (const email of emails) {
    await prisma.user.create({
      data: {
        email,
        password: {
          create: {
            hash: hashedPassword,
          },
        },
      },
    });
  }

  console.log(`Database has been seeded. 🌱`);
}

/**
 * For local development purposes, to keep our data tables synced with Stripe, clears out any created Stripe customers in the Stripe test table whenever we initially seed our database.
 */
// async function clearStripeCustomers() {

//   const { data: customers } = await serverStripe.customers.list();
//   const removeCustomers = customers.map((c) => {
//     return serverStripe.customers.del(c.id);
//   });
//   await Promise.all(removeCustomers).then((r) => {
//     console.log("Stripe dev customer database cleared 👍", JSON.stringify(r));
//   });
// }
seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
