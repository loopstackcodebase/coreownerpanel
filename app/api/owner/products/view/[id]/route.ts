import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/app/lib/dbconfig";
import { ProductModel } from "@/app/model/products/product.schema";
import { validateUserAccess } from "@/utils/apiHelpers";
import mongoose from "mongoose";

// GET /fetchProductById
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const validation = await validateUserAccess(request);
    if (!validation.isValid) {
      return validation.response;
    }

    // Connect to database
    await connectToDatabase();

    const { id } = await params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid product ID", success: false },
        { status: 400 }
      );
    }

    // Find product by ID and populate store info
    const product = await ProductModel.findById(id);

    if (!product) {
      return NextResponse.json(
        { error: "Product not found", success: false },
        { status: 404 }
      );
    }

    // Increment view count
    await ProductModel.findByIdAndUpdate(id, { $inc: { totalViews: 1 } });

    return NextResponse.json({
      success: true,
      message: "Product fetched successfully",
      data: product,
    });
  } catch (error: any) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Internal server error", success: false },
      { status: 500 }
    );
  }
}
