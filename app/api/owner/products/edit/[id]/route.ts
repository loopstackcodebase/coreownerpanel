import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/app/lib/dbconfig";
import { ProductModel } from "@/app/model/products/product.schema";
import { StoreModel } from "@/app/model/store/store.schema";
import { validateUserAccess } from "@/utils/apiHelpers";
import mongoose from "mongoose";

export async function PUT(
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

    // Parse request body
    const body = await request.json();
    const {
      name,
      description,
      category,
      images,
      actualPrice,
      offerPrice,
      totalQuantity,
      availableLocation,
      inStock,
      keyFeatures,
    } = body;

    // Validate price values if provided
    if (actualPrice !== undefined && actualPrice <= 0) {
      return NextResponse.json(
        { error: "Actual price must be greater than 0", success: false },
        { status: 400 }
      );
    }

    if (offerPrice && actualPrice && offerPrice >= actualPrice) {
      return NextResponse.json(
        { error: "Offer price must be less than actual price", success: false },
        { status: 400 }
      );
    }

    // Build update object (only include provided fields)
    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (category !== undefined) updateData.category = category;
    if (images !== undefined) updateData.images = images;
    if (actualPrice !== undefined) updateData.actualPrice = actualPrice;
    if (offerPrice !== undefined) updateData.offerPrice = offerPrice;
    if (totalQuantity !== undefined) updateData.totalQuantity = totalQuantity;
    if (availableLocation !== undefined)
      updateData.availableLocation = availableLocation;
    if (inStock !== undefined) updateData.inStock = inStock;
    if (keyFeatures !== undefined) updateData.keyFeatures = keyFeatures;

    // Update product
    const updatedProduct = await ProductModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return NextResponse.json(
        { error: "Product not found", success: false },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (error: any) {
    console.error("Error updating product:", error);

    // Handle duplicate key error
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return NextResponse.json(
        { error: `${field} already exists`, success: false },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error", success: false },
      { status: 500 }
    );
  }
}
