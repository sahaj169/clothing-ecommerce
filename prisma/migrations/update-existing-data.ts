import { PrismaClient, Department } from "@prisma/client";
import { slugify } from "../../src/lib/utils";

const prisma = new PrismaClient();

const departmentMapping: { [key: string]: Department } = {
  Engineering: Department.ENGINEERING,
  Design: Department.DESIGN,
  Marketing: Department.MARKETING,
  Sales: Department.SALES,
  "Customer Service": Department.CUSTOMER_SERVICE,
  Operations: Department.OPERATIONS,
  Finance: Department.FINANCE,
  HR: Department.HR,
  Product: Department.PRODUCT,
  Other: Department.OTHER,
};

async function main() {
  try {
    // Update Products
    const products = await prisma.product.findMany();
    console.log(`Updating ${products.length} products...`);
    for (const product of products) {
      await prisma.product.update({
        where: { id: product.id },
        data: {
          slug: slugify(product.name),
          sku: `SKU-${product.id.slice(-6).toUpperCase()}`,
        },
      });
    }

    console.log("Successfully updated products");

    // Update Orders
    const orders = await prisma.order.findMany();
    console.log(`Updating ${orders.length} orders...`);
    for (const order of orders) {
      await prisma.order.update({
        where: { id: order.id },
        data: {
          orderNumber: `ORD-${order.id.slice(-6).toUpperCase()}`,
          paymentMethod: "COD",
          subtotal: order.total,
          tax: 0,
          shipping: 0,
        },
      });
    }

    // Update Careers
    const careers = await prisma.career.findMany();
    console.log(`Updating ${careers.length} careers...`);
    for (const career of careers) {
      const department = career.department as string;
      await prisma.career.update({
        where: { id: career.id },
        data: {
          slug: slugify(career.title),
          department: departmentMapping[department] || Department.OTHER,
        },
      });
    }

    console.log("Successfully updated existing records");
  } catch (error) {
    console.error("Error updating records:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
