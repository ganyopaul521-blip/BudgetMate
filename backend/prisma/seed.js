const { PrismaClient } = require("@prisma/client");
const { DEFAULT_EXPENSE_CATEGORIES, DEFAULT_INCOME_CATEGORIES } = require("../src/constants/categories");

const prisma = new PrismaClient();

async function main() {
  for (const name of DEFAULT_EXPENSE_CATEGORIES) {
    const existing = await prisma.category.findFirst({ where: { name, isSystem: true, type: "expense" } });
    if (!existing) {
      await prisma.category.create({ data: { name, type: "expense", isSystem: true } });
    }
  }

  for (const name of DEFAULT_INCOME_CATEGORIES) {
    const existing = await prisma.category.findFirst({ where: { name, isSystem: true, type: "income" } });
    if (!existing) {
      await prisma.category.create({ data: { name, type: "income", isSystem: true } });
    }
  }

  console.log("Seeded system categories.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
