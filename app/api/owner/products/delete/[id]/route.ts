import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/app/lib/dbconfig";
import { ProductModel } from "@/app/model/products/product.schema";
import { validateUserAccess } from "@/utils/apiHelpers";
import mongoose from "mongoose";

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  try {
    const validation = await validateUserAccess(request);
    if (!validation.isValid) {
      return validation.response;
    }

    // Get user info from validation result
    const { userId, type } = validation.userInfo!;

    // Check if user is owner
    if (type !== "owner") {
      return NextResponse.json(
        { error: "Owner access required", success: false },
        { status: 403 }
      );
    }

    // Connect to database
    await connectToDatabase();

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid product ID", success: false },
        { status: 400 }
      );
    }

    // Soft delete: mark softDelete as true
    const updatedProduct = await ProductModel.findByIdAndUpdate(
      id,
      { softDelete: true },
      { new: true }
    );

    if (!updatedProduct) {
      return NextResponse.json(
        { error: "Product not found", success: false },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Product soft deleted successfully",
      data: {
        productId: id,
        productName: updatedProduct.name,
      },
    });
  } catch (error: any) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Internal server error", success: false },
      { status: 500 }
    );
  }
}
