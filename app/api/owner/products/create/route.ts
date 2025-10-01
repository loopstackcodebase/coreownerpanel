import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/app/lib/dbconfig";
import { getStoreIdByUserId, validateUserAccess } from "@/utils/apiHelpers";
import { ProductModel } from "@/app/model/products/product.schema";

export async function POST(request: NextRequest) {
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

    // Validate required fields
    if (!name || !category || !actualPrice || !totalQuantity) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: name, category, actualPrice, totalQuantity, storeId",
          success: false,
        },
        { status: 400 }
      );
    }

    // Get storeId using the helper function
    const storeId = await getStoreIdByUserId(userId);

    if (!storeId) {
      return NextResponse.json(
        { error: "Store not found for this owner", success: false },
        { status: 404 }
      );
    }

    // Check for duplicate product in the same store
    const existingProduct = await ProductModel.findOne({
      storeId: storeId,
      name: { $regex: new RegExp(`^${name}$`, "i") }, // case-insensitive match
    });

    if (existingProduct) {
      return NextResponse.json(
        {
          error: "A product with the same name already exists in this store",
          success: false,
        },
        { status: 409 }
      );
    }

    // Validate price values
    if (actualPrice <= 0) {
      return NextResponse.json(
        { error: "Actual price must be greater than 0", success: false },
        { status: 400 }
      );
    }

    if (offerPrice && offerPrice >= actualPrice) {
      return NextResponse.json(
        { error: "Offer price must be less than actual price", success: false },
        { status: 400 }
      );
    }

    // Create new product
    const newProduct = new ProductModel({
      name,
      description: description || "",
      category,
      images: images || [],
      actualPrice,
      offerPrice: offerPrice || 0,
      totalQuantity,
      availableLocation: availableLocation || "",
      inStock: inStock !== undefined ? inStock : true,
      keyFeatures: keyFeatures || [],
      storeId,
    });

    await newProduct.save();

    return NextResponse.json({
      success: true,
      message: "Product created successfully",
    });
  } catch (error: any) {
    console.error("Error creating product:", error);

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
