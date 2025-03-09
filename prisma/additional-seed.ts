import {
  PrismaClient,
  Department,
  JobType,
  JobStatus,
  ExperienceLevel,
  Gender,
  Category,
  Size,
  Color,
  BlogCategory,
} from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  try {
    console.log("Adding additional sample data...");

    // Get existing users for reference
    const users = await prisma.user.findMany({ take: 3 });
    if (users.length === 0) {
      console.error("No users found. Please run the main seed file first.");
      return;
    }

    // Additional products with diverse categories
    const additionalProducts = [
      {
        name: "Premium Leather Jacket",
        slug: "premium-leather-jacket",
        description:
          "Genuine leather jacket with stylish design and comfortable fit",
        price: 249.99,
        images: [
          "https://images.unsplash.com/photo-1551028719-00167b16eac5",
          "https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504",
        ],
        category: Category.JACKET,
        gender: Gender.MEN,
        size: [Size.S, Size.M, Size.L, Size.XL],
        colors: [Color.BLACK, Color.BROWN],
        inStock: true,
        stockCount: 25,
        featured: true,
        brand: "StyleHub",
        sku: "SH-LJ-001",
        weight: 2.5,
        dimensions: "25x15x5",
        tags: ["leather", "winter", "premium"],
        discount: 0,
        rating: 4.8,
        reviewCount: 0,
      },
      {
        name: "Athletic Running Shoes",
        slug: "athletic-running-shoes",
        description:
          "Lightweight and comfortable running shoes with excellent support",
        price: 129.99,
        images: [
          "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
          "https://images.unsplash.com/photo-1608231387042-66d1773070a5",
        ],
        category: Category.SHOES,
        gender: Gender.UNISEX,
        size: [Size.S, Size.M, Size.L, Size.XL],
        colors: [Color.BLACK, Color.WHITE, Color.RED],
        inStock: true,
        stockCount: 45,
        featured: true,
        brand: "SportFlex",
        sku: "SF-RS-001",
        weight: 0.8,
        dimensions: "30x15x10",
        tags: ["running", "sports", "athletic"],
        discount: 10,
        rating: 4.5,
        reviewCount: 0,
      },
      {
        name: "Elegant Evening Dress",
        slug: "elegant-evening-dress",
        description: "Stunning evening dress perfect for formal occasions",
        price: 179.99,
        images: [
          "https://images.unsplash.com/photo-1566174053879-31528523f8ae",
          "https://images.unsplash.com/photo-1595777457583-95e059d581b8",
        ],
        category: Category.DRESS,
        gender: Gender.WOMEN,
        size: [Size.XS, Size.S, Size.M, Size.L],
        colors: [Color.BLACK, Color.NAVY, Color.RED],
        inStock: true,
        stockCount: 20,
        featured: true,
        brand: "Elegance",
        sku: "EL-ED-001",
        weight: 0.5,
        dimensions: "40x30x5",
        tags: ["formal", "evening", "elegant"],
        discount: 0,
        rating: 4.9,
        reviewCount: 0,
      },
      {
        name: "Casual Graphic T-Shirt",
        slug: "casual-graphic-tshirt",
        description: "Comfortable cotton t-shirt with trendy graphic design",
        price: 29.99,
        images: [
          "https://images.unsplash.com/photo-1576566588028-4147f3842f27",
          "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9",
        ],
        category: Category.TSHIRT,
        gender: Gender.UNISEX,
        size: [Size.S, Size.M, Size.L, Size.XL, Size.XXL],
        colors: [Color.WHITE, Color.BLACK, Color.GREY],
        inStock: true,
        stockCount: 100,
        featured: false,
        brand: "UrbanStyle",
        sku: "US-GT-001",
        weight: 0.2,
        dimensions: "25x20x2",
        tags: ["casual", "graphic", "cotton"],
        discount: 5,
        rating: 4.2,
        reviewCount: 0,
      },
      {
        name: "Designer Sunglasses",
        slug: "designer-sunglasses",
        description: "Premium UV protection sunglasses with stylish frames",
        price: 149.99,
        images: [
          "https://images.unsplash.com/photo-1577803645773-f96470509666",
          "https://images.unsplash.com/photo-1572635196237-14b3f281503f",
        ],
        category: Category.ACCESSORIES,
        gender: Gender.UNISEX,
        size: [Size.FREE_SIZE],
        colors: [Color.BLACK, Color.BROWN],
        inStock: true,
        stockCount: 30,
        featured: true,
        brand: "VisionElite",
        sku: "VE-SG-001",
        weight: 0.1,
        dimensions: "15x5x5",
        tags: ["sunglasses", "accessories", "summer"],
        discount: 0,
        rating: 4.7,
        reviewCount: 0,
      },
      {
        name: "Traditional Embroidered Kurta",
        slug: "traditional-embroidered-kurta",
        description: "Handcrafted cotton kurta with intricate embroidery",
        price: 89.99,
        images: [
          "https://images.unsplash.com/photo-1602810316693-3667c854239a",
          "https://images.unsplash.com/photo-1614548539924-5c1f205b3747",
        ],
        category: Category.ETHNIC,
        gender: Gender.MEN,
        size: [Size.S, Size.M, Size.L, Size.XL],
        colors: [Color.WHITE, Color.BEIGE, Color.BLUE],
        inStock: true,
        stockCount: 35,
        featured: false,
        brand: "EthnicWear",
        sku: "EW-EK-001",
        weight: 0.3,
        dimensions: "30x25x3",
        tags: ["ethnic", "traditional", "embroidered"],
        discount: 0,
        rating: 4.6,
        reviewCount: 0,
      },
      {
        name: "Performance Yoga Pants",
        slug: "performance-yoga-pants",
        description:
          "Stretchable and comfortable yoga pants for maximum flexibility",
        price: 59.99,
        images: [
          "https://images.unsplash.com/photo-1506629082955-511b1aa562c8",
          "https://images.unsplash.com/photo-1515775538093-d2d95c5ee4f5",
        ],
        category: Category.SPORTSWEAR,
        gender: Gender.WOMEN,
        size: [Size.XS, Size.S, Size.M, Size.L, Size.XL],
        colors: [Color.BLACK, Color.NAVY, Color.GREY],
        inStock: true,
        stockCount: 50,
        featured: false,
        brand: "ActiveFit",
        sku: "AF-YP-001",
        weight: 0.25,
        dimensions: "25x20x2",
        tags: ["yoga", "fitness", "activewear"],
        discount: 15,
        rating: 4.4,
        reviewCount: 0,
      },
      {
        name: "Business Suit Set",
        slug: "business-suit-set",
        description: "Professional business suit perfect for formal occasions",
        price: 299.99,
        images: [
          "https://images.unsplash.com/photo-1507679799987-c73779587ccf",
          "https://images.unsplash.com/photo-1598522325074-042db73aa4e6",
        ],
        category: Category.FORMAL,
        gender: Gender.MEN,
        size: [Size.S, Size.M, Size.L, Size.XL],
        colors: [Color.BLACK, Color.NAVY, Color.GREY],
        inStock: true,
        stockCount: 15,
        featured: true,
        brand: "ExecutiveStyle",
        sku: "ES-BS-001",
        weight: 1.5,
        dimensions: "50x40x10",
        tags: ["formal", "business", "professional"],
        discount: 0,
        rating: 4.8,
        reviewCount: 0,
      },
      {
        name: "Kids Winter Jacket",
        slug: "kids-winter-jacket",
        description: "Warm and cozy winter jacket for children",
        price: 79.99,
        images: [
          "https://images.unsplash.com/photo-1604671801908-6f0c6a092c05",
          "https://images.unsplash.com/photo-1604671801790-f1bda7c43e5c",
        ],
        category: Category.JACKET,
        gender: Gender.KIDS,
        size: [Size.XS, Size.S, Size.M],
        colors: [Color.RED, Color.BLUE, Color.PINK],
        inStock: true,
        stockCount: 40,
        featured: false,
        brand: "KidCozy",
        sku: "KC-WJ-001",
        weight: 0.8,
        dimensions: "30x25x5",
        tags: ["kids", "winter", "jacket"],
        discount: 10,
        rating: 4.5,
        reviewCount: 0,
      },
      {
        name: "Handcrafted Leather Wallet",
        slug: "handcrafted-leather-wallet",
        description: "Premium genuine leather wallet with multiple card slots",
        price: 49.99,
        images: [
          "https://images.unsplash.com/photo-1627123424574-724758594e93",
          "https://images.unsplash.com/photo-1606503825008-909a67e63c3d",
        ],
        category: Category.ACCESSORIES,
        gender: Gender.UNISEX,
        size: [Size.FREE_SIZE],
        colors: [Color.BLACK, Color.BROWN],
        inStock: true,
        stockCount: 60,
        featured: false,
        brand: "LeatherCraft",
        sku: "LC-LW-001",
        weight: 0.15,
        dimensions: "10x8x2",
        tags: ["wallet", "leather", "accessories"],
        discount: 0,
        rating: 4.6,
        reviewCount: 0,
      },
    ];

    // Create products
    for (const product of additionalProducts) {
      await prisma.product.create({
        data: product,
      });
    }

    // Get all products for reviews
    const allProducts = await prisma.product.findMany();

    // Create reviews for products
    const reviews = [
      {
        rating: 5,
        comment:
          "Absolutely love this product! The quality is exceptional and it fits perfectly.",
        userId: users[0].id,
        productId: allProducts[0].id,
        title: "Perfect Purchase",
        isVerified: true,
        helpful: 15,
      },
      {
        rating: 4,
        comment:
          "Great product overall. The material is high quality but sizing runs a bit small.",
        userId: users[1].id,
        productId: allProducts[1].id,
        title: "Good Quality",
        isVerified: true,
        helpful: 8,
      },
      {
        rating: 5,
        comment:
          "Exceeded my expectations! Fast shipping and the product looks even better in person.",
        userId: users[2].id,
        productId: allProducts[2].id,
        title: "Highly Recommend",
        isVerified: true,
        helpful: 12,
      },
      {
        rating: 3,
        comment:
          "Decent product for the price. The color is slightly different from what's shown in the pictures.",
        userId: users[0].id,
        productId: allProducts[3].id,
        title: "Okay Purchase",
        isVerified: true,
        helpful: 5,
      },
      {
        rating: 5,
        comment:
          "Perfect fit and excellent quality. Will definitely buy more from this brand!",
        userId: users[1].id,
        productId: allProducts[4].id,
        title: "Excellent Quality",
        isVerified: true,
        helpful: 20,
      },
      {
        rating: 4,
        comment:
          "Very comfortable and stylish. Shipping was quick and packaging was great.",
        userId: users[2].id,
        productId: allProducts[5].id,
        title: "Comfortable and Stylish",
        isVerified: true,
        helpful: 7,
      },
      {
        rating: 5,
        comment:
          "Absolutely stunning! The craftsmanship is exceptional and worth every penny.",
        userId: users[0].id,
        productId: allProducts[6].id,
        title: "Worth Every Penny",
        isVerified: true,
        helpful: 18,
      },
      {
        rating: 4,
        comment:
          "Great value for money. The product is durable and looks premium.",
        userId: users[1].id,
        productId: allProducts[7].id,
        title: "Great Value",
        isVerified: true,
        helpful: 9,
      },
      {
        rating: 5,
        comment:
          "Exactly as described! The fit is perfect and the material is high quality.",
        userId: users[2].id,
        productId: allProducts[8].id,
        title: "Perfect Fit",
        isVerified: true,
        helpful: 14,
      },
      {
        rating: 4,
        comment:
          "Very satisfied with my purchase. The design is elegant and the quality is good.",
        userId: users[0].id,
        productId: allProducts[9].id,
        title: "Satisfied Customer",
        isVerified: true,
        helpful: 11,
      },
    ];

    // Create reviews
    for (const review of reviews) {
      await prisma.review.create({
        data: review,
      });
    }

    // Update product review counts
    for (const product of allProducts) {
      const reviewCount = await prisma.review.count({
        where: { productId: product.id },
      });

      if (reviewCount > 0) {
        const avgRating = await prisma.review.aggregate({
          where: { productId: product.id },
          _avg: { rating: true },
        });

        await prisma.product.update({
          where: { id: product.id },
          data: {
            reviewCount: reviewCount,
            rating: avgRating._avg.rating || 0,
          },
        });
      }
    }

    // Additional career opportunities
    const additionalCareers = [
      {
        title: "UI/UX Designer",
        slug: "ui-ux-designer",
        department: Department.DESIGN,
        location: "San Francisco, CA",
        type: JobType.FULL_TIME,
        description:
          "We're looking for a talented UI/UX designer to create beautiful and functional user interfaces for our e-commerce platform.",
        requirements: [
          "3+ years experience in UI/UX design",
          "Proficiency in Figma, Sketch, and Adobe Creative Suite",
          "Portfolio showcasing web and mobile design projects",
          "Understanding of user-centered design principles",
        ],
        responsibilities: [
          "Create wireframes, prototypes, and high-fidelity mockups",
          "Conduct user research and usability testing",
          "Collaborate with developers to implement designs",
          "Maintain design system and component library",
        ],
        status: JobStatus.OPEN,
        salary: {
          min: 85000,
          max: 110000,
          currency: "USD",
        },
        experience: ExperienceLevel.MID,
        skills: [
          "Figma",
          "Sketch",
          "User Research",
          "Prototyping",
          "Design Systems",
        ],
        benefits: [
          "Health Insurance",
          "401k",
          "Flexible Work Hours",
          "Professional Development Budget",
        ],
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        positions: 2,
      },
      {
        title: "Full Stack Developer",
        slug: "full-stack-developer",
        department: Department.ENGINEERING,
        location: "Remote",
        type: JobType.FULL_TIME,
        description:
          "Join our engineering team to build and maintain our e-commerce platform using modern web technologies.",
        requirements: [
          "4+ years experience in full stack development",
          "Proficiency in React, Node.js, and TypeScript",
          "Experience with database design and ORM frameworks",
          "Knowledge of RESTful API design principles",
        ],
        responsibilities: [
          "Develop and maintain front-end and back-end components",
          "Optimize application performance and scalability",
          "Implement security best practices",
          "Collaborate with design and product teams",
        ],
        status: JobStatus.OPEN,
        salary: {
          min: 90000,
          max: 130000,
          currency: "USD",
        },
        experience: ExperienceLevel.MID,
        skills: ["React", "Node.js", "TypeScript", "MongoDB", "AWS", "Git"],
        benefits: [
          "Health Insurance",
          "Remote Work",
          "Stock Options",
          "Flexible Hours",
        ],
        deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days from now
        positions: 3,
      },
      {
        title: "Social Media Manager",
        slug: "social-media-manager",
        department: Department.MARKETING,
        location: "New York, NY",
        type: JobType.FULL_TIME,
        description:
          "We're seeking a creative and data-driven social media manager to grow our brand presence across multiple platforms.",
        requirements: [
          "2+ years experience in social media management",
          "Experience with content creation and scheduling tools",
          "Understanding of social media analytics",
          "Excellent writing and communication skills",
        ],
        responsibilities: [
          "Develop and implement social media strategy",
          "Create engaging content for multiple platforms",
          "Analyze performance metrics and optimize campaigns",
          "Collaborate with marketing and design teams",
        ],
        status: JobStatus.OPEN,
        salary: {
          min: 60000,
          max: 80000,
          currency: "USD",
        },
        experience: ExperienceLevel.JUNIOR,
        skills: [
          "Content Creation",
          "Social Media Strategy",
          "Analytics",
          "Copywriting",
        ],
        benefits: [
          "Health Insurance",
          "Paid Time Off",
          "Professional Development",
        ],
        deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000), // 20 days from now
        positions: 1,
      },
      {
        title: "Customer Support Specialist",
        slug: "customer-support-specialist",
        department: Department.CUSTOMER_SERVICE,
        location: "Chicago, IL",
        type: JobType.FULL_TIME,
        description:
          "Join our customer support team to provide exceptional service to our customers via email, chat, and phone.",
        requirements: [
          "1+ years experience in customer service",
          "Excellent communication and problem-solving skills",
          "Ability to work in a fast-paced environment",
          "Basic knowledge of e-commerce operations",
        ],
        responsibilities: [
          "Respond to customer inquiries and resolve issues",
          "Process returns and exchanges",
          "Document customer feedback for product improvement",
          "Maintain high customer satisfaction ratings",
        ],
        status: JobStatus.OPEN,
        salary: {
          min: 45000,
          max: 55000,
          currency: "USD",
        },
        experience: ExperienceLevel.ENTRY,
        skills: [
          "Customer Service",
          "Problem Solving",
          "Communication",
          "Patience",
        ],
        benefits: ["Health Insurance", "Employee Discount", "Paid Time Off"],
        deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
        positions: 5,
      },
      {
        title: "Supply Chain Manager",
        slug: "supply-chain-manager",
        department: Department.OPERATIONS,
        location: "Atlanta, GA",
        type: JobType.FULL_TIME,
        description:
          "We're looking for an experienced supply chain manager to optimize our inventory management and logistics operations.",
        requirements: [
          "5+ years experience in supply chain management",
          "Bachelor's degree in Supply Chain, Business, or related field",
          "Experience with inventory management systems",
          "Strong analytical and problem-solving skills",
        ],
        responsibilities: [
          "Develop and implement supply chain strategies",
          "Manage relationships with suppliers and logistics partners",
          "Optimize inventory levels and reduce costs",
          "Analyze supply chain metrics and implement improvements",
        ],
        status: JobStatus.OPEN,
        salary: {
          min: 85000,
          max: 120000,
          currency: "USD",
        },
        experience: ExperienceLevel.SENIOR,
        skills: [
          "Inventory Management",
          "Logistics",
          "Negotiation",
          "Data Analysis",
        ],
        benefits: [
          "Health Insurance",
          "401k",
          "Bonus Program",
          "Professional Development",
        ],
        deadline: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000), // 40 days from now
        positions: 1,
      },
    ];

    // Create careers
    for (const career of additionalCareers) {
      await prisma.career.create({
        data: career,
      });
    }

    console.log("✅ Additional seed data inserted successfully");
  } catch (error) {
    console.error("❌ Error seeding additional data:", error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error("❌ Error in additional seed script:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
