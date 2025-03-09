import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { Category, Gender } from "@prisma/client";

// Get all products with optional filtering
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") as Category | null;
    const gender = searchParams.get("gender") as Gender | null;
    const featured = searchParams.get("featured") === "true";
    const limit = parseInt(searchParams.get("limit") || "10");
    const page = parseInt(searchParams.get("page") || "1");
    const skip = (page - 1) * limit;

    // Build filter object
    const filter: any = {
      inStock: true,
    };

    if (category) {
      filter.category = category;
    }

    if (gender) {
      filter.gender = gender;
    }

    if (featured) {
      filter.featured = true;
    }

    // Get products
    const products = await prisma.product.findMany({
      where: filter,
      take: limit,
      skip,
      orderBy: {
        createdAt: "desc",
      },
    });

    // Get total count for pagination
    const total = await prisma.product.count({
      where: filter,
    });

    return NextResponse.json({
      products,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}

// Get a single product by ID
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { message: "Product ID is required" },
        { status: 400 }
      );
    }

    const product = await prisma.product.findUnique({
      where: {
        id,
      },
      include: {
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ product });
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
