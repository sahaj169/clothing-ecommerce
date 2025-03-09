import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  try {
    // Get all orders
    const orders = await prisma.order.findMany({
      include: {
        user: {
          include: {
            addresses: true,
          },
        },
      },
    });

    console.log(`Updating ${orders.length} orders...`);

    // Update each order
    for (const order of orders) {
      // Get default address or first address
      const address =
        order.user.addresses.find((addr) => addr.isDefault) ||
        order.user.addresses[0];

      if (!address) {
        console.log(`No address found for order ${order.id}, skipping...`);
        continue;
      }

      await prisma.order.update({
        where: { id: order.id },
        data: {
          orderNumber: `ORD-${order.id.slice(-6).toUpperCase()}`,
          paymentStatus: "PAID",
          paymentMethod: "COD",
          subtotal: order.total,
          tax: order.total * 0.18, // 18% tax
          shipping: 100, // Fixed shipping
          addressId: address.id,
          estimatedDelivery: new Date(
            order.createdAt.getTime() + 7 * 24 * 60 * 60 * 1000
          ), // 7 days from order date
        },
      });
    }

    console.log("Successfully updated orders");
  } catch (error) {
    console.error("Error updating orders:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
