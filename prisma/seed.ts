import { PrismaClient } from "@prisma/client";
import { products } from "../products";

const prisma = new PrismaClient();

const main = async () => {
  for (let product of products) {
    await prisma.product.create({
      data: product,
    });
  }
};

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
