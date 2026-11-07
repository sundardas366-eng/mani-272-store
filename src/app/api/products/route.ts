import { NextResponse } from "next/server";
import { getAllProducts } from "@/lib/productService";

export async function GET() {
  try {
    const products = getAllProducts();
    return NextResponse.json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch products" },
      { status: 500 }
    );
  }
}

