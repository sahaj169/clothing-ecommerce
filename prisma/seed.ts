import {
  PrismaClient,
  Department,
  JobType,
  JobStatus,
  ExperienceLevel,
  Role,
  Gender,
  Category,
  Size,
  Color,
  OrderStatus,
  PaymentStatus,
  PaymentMethod,
  ApplicationStatus,
  BlogCategory,
} from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  try {
    // Clear existing data
    console.log("Clearing existing data...");
    await prisma.jobApplication.deleteMany();
    await prisma.career.deleteMany();
    await prisma.cartItem.deleteMany();
    await prisma.cart.deleteMany();
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.review.deleteMany();
    await prisma.product.deleteMany();
    await prisma.user.deleteMany();

    // Create users with different roles
    const adminUser = await prisma.user.create({
      data: {
        name: "Admin User",
        email: "admin@stylehub.com",
        hashedPassword: await hash("Admin@123", 12),
        role: Role.ADMIN,
        image: "https://images.unsplash.com/photo-1633332755192-727a05c4013d",
      },
    });

    const managerUser = await prisma.user.create({
      data: {
        name: "Manager User",
        email: "manager@stylehub.com",
        hashedPassword: await hash("Manager@123", 12),
        role: Role.MANAGER,
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
      },
    });

    const regularUser = await prisma.user.create({
      data: {
        name: "John Doe",
        email: "user@stylehub.com",
        hashedPassword: await hash("User@123", 12),
        role: Role.USER,
        image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36",
      },
    });

    // Create products
    const products = [
      {
        name: "Classic White Shirt",
        slug: "classic-white-shirt",
        description: "A timeless white shirt perfect for any occasion",
        price: 49.99,
        images: [
          "https://images.unsplash.com/photo-1603252109303-2751441dd157",
          "https://images.unsplash.com/photo-1598033129183-c4f50c736f10",
        ],
        category: Category.SHIRT,
        gender: Gender.MEN,
        size: [Size.S, Size.M, Size.L, Size.XL],
        colors: [Color.WHITE],
        inStock: true,
        stockCount: 50,
        featured: true,
        brand: "StyleHub",
        sku: "SH-WS-001",
      },
      {
        name: "Blue Denim Jeans",
        slug: "blue-denim-jeans",
        description: "Comfortable and stylish denim jeans",
        price: 79.99,
        images: [
          "https://images.unsplash.com/photo-1542272604-787c3835535d",
          "https://images.unsplash.com/photo-1541099649105-f69ad21f3246",
        ],
        category: Category.JEANS,
        gender: Gender.MEN,
        size: [Size.S, Size.M, Size.L, Size.XL],
        colors: [Color.BLUE],
        inStock: true,
        stockCount: 40,
        featured: false,
        brand: "StyleHub",
        sku: "SH-BJ-001",
      },
      {
        name: "Floral Summer Dress",
        slug: "floral-summer-dress",
        description: "Beautiful floral dress perfect for summer",
        price: 89.99,
        images: [
          "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1",
          "https://images.unsplash.com/photo-1612336307429-8a898d10e223",
        ],
        category: Category.DRESS,
        gender: Gender.WOMEN,
        size: [Size.XS, Size.S, Size.M, Size.L],
        colors: [Color.MULTI],
        inStock: true,
        stockCount: 30,
        featured: true,
        brand: "StyleHub",
        sku: "SH-FD-001",
      },
      {
        name: "Designer Silk Saree",
        slug: "designer-silk-saree",
        description: "Elegant silk saree with traditional design",
        price: 199.99,
        images: [
          "https://images.unsplash.com/photo-1610030469983-98e550d6193c",
          "https://images.unsplash.com/photo-1583391733956-6c78dd16ea25",
        ],
        category: Category.SAREE,
        gender: Gender.WOMEN,
        size: [Size.FREE_SIZE],
        colors: [Color.RED, Color.MAROON],
        inStock: true,
        stockCount: 20,
        featured: true,
        brand: "StyleHub",
        sku: "SH-SS-001",
      },
      {
        name: "Kids Casual T-Shirt",
        slug: "kids-casual-tshirt",
        description: "Comfortable cotton t-shirt for kids",
        price: 24.99,
        images: [
          "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8",
          "https://images.unsplash.com/photo-1622290291289-dd6f8c1b7595",
        ],
        category: Category.TSHIRT,
        gender: Gender.KIDS,
        size: [Size.XS, Size.S, Size.M],
        colors: [Color.BLUE, Color.RED],
        inStock: true,
        stockCount: 60,
        featured: false,
        brand: "StyleHub",
        sku: "SH-KT-001",
      },
    ];

    for (const product of products) {
      await prisma.product.create({
        data: product,
      });
    }

    // Create addresses
    const address = await prisma.address.create({
      data: {
        userId: regularUser.id,
        name: "John Doe",
        street: "123 Main St",
        city: "New York",
        state: "NY",
        postalCode: "10001",
        country: "USA",
        phone: "+1234567890",
        isDefault: true,
        type: "HOME",
      },
    });

    // Create cart
    const cart = await prisma.cart.create({
      data: {
        userId: regularUser.id,
        items: {
          create: {
            quantity: 1,
            size: Size.M,
            color: Color.WHITE,
            productId: (await prisma.product.findFirst())!.id,
          },
        },
      },
    });

    // Create blog posts
    const blogs = [
      {
        title: "Spring Fashion Trends 2024",
        slug: "spring-fashion-trends-2024",
        excerpt: "Discover the hottest fashion trends for Spring 2024",
        content: `<p>Spring 2024 is all about bold colors and sustainable fashion...</p>
                  <h2>1. Vibrant Colors</h2>
                  <p>This season's palette features bright yellows and deep greens...</p>`,
        authorId: adminUser.id,
        category: BlogCategory.FASHION_TRENDS,
        image: "https://images.unsplash.com/photo-1483985988355-763728e1935b",
        tags: ["spring", "trends", "fashion"],
        published: true,
      },
      {
        title: "Sustainable Fashion Guide",
        slug: "sustainable-fashion-guide",
        excerpt: "Learn how to build a sustainable wardrobe",
        content: `<p>Sustainable fashion is more than just a trend...</p>
                  <h2>Why Choose Sustainable Fashion?</h2>
                  <p>Making conscious choices about our clothing...</p>`,
        authorId: managerUser.id,
        category: BlogCategory.SUSTAINABLE_FASHION,
        image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b",
        tags: ["sustainable", "eco-friendly", "fashion"],
        published: true,
      },
    ];

    for (const blog of blogs) {
      await prisma.blog.create({
        data: blog,
      });
    }

    // Create career opportunities
    const careers = [
      {
        title: "Senior Fashion Designer",
        slug: "senior-fashion-designer",
        department: Department.DESIGN,
        location: "New York, NY",
        type: JobType.FULL_TIME,
        description: "We're looking for an experienced fashion designer...",
        requirements: [
          "5+ years experience",
          "Bachelor's degree in Fashion Design",
        ],
        responsibilities: ["Create seasonal collections", "Lead design team"],
        status: JobStatus.OPEN,
        salary: {
          min: 80000,
          max: 120000,
          currency: "USD",
        },
        experience: ExperienceLevel.SENIOR,
        skills: ["Adobe Illustrator", "Fashion Design", "Trend Analysis"],
        benefits: ["Health Insurance", "401k", "Remote Work Options"],
      },
      {
        title: "E-commerce Manager",
        slug: "ecommerce-manager",
        department: Department.MARKETING,
        location: "Remote",
        type: JobType.FULL_TIME,
        description: "Looking for an experienced e-commerce manager...",
        requirements: ["3+ years experience", "Bachelor's degree in Marketing"],
        responsibilities: ["Manage online store", "Optimize conversion rates"],
        status: JobStatus.OPEN,
        salary: {
          min: 70000,
          max: 100000,
          currency: "USD",
        },
        experience: ExperienceLevel.MID,
        skills: ["Shopify", "SEO", "Digital Marketing"],
        benefits: ["Health Insurance", "Stock Options", "Remote Work"],
      },
    ];

    for (const career of careers) {
      await prisma.career.create({
        data: career,
      });
    }

    // Create job applications
    await prisma.jobApplication.create({
      data: {
        userId: regularUser.id,
        careerId: (await prisma.career.findFirst())!.id,
        resume: "https://example.com/resume.pdf",
        coverLetter: "I am very interested in this position...",
        status: ApplicationStatus.PENDING,
        experience: 5,
        currentCtc: 75000,
        expectedCtc: 90000,
        noticePeriod: 30,
        currentCompany: "Fashion Corp",
        currentRole: "Fashion Designer",
        portfolio: "https://example.com/portfolio",
        linkedIn: "https://linkedin.com/in/johndoe",
      },
    });

    // Create reviews
    await prisma.review.create({
      data: {
        rating: 5,
        comment: "Great product, excellent quality!",
        userId: regularUser.id,
        productId: (await prisma.product.findFirst())!.id,
        title: "Excellent Purchase",
        isVerified: true,
        helpful: 10,
      },
    });

    // Create orders
    await prisma.order.create({
      data: {
        userId: regularUser.id,
        orderNumber: "ORD-2024-001",
        status: OrderStatus.DELIVERED,
        paymentStatus: PaymentStatus.PAID,
        paymentMethod: PaymentMethod.CREDIT_CARD,
        total: 129.98,
        subtotal: 99.98,
        tax: 20.0,
        shipping: 10.0,
        addressId: address.id,
        items: {
          create: {
            quantity: 2,
            size: Size.M,
            color: Color.WHITE,
            price: 49.99,
            productId: (await prisma.product.findFirst())!.id,
          },
        },
      },
    });

    console.log("✅ Seed data inserted successfully");
  } catch (error) {
    console.error("❌ Error seeding data:", error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error("❌ Error in seed script:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
