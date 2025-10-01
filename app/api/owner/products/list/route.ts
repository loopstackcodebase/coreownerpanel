import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/app/lib/dbconfig";
import { getStoreIdByUserId, validateUserAccess } from "@/utils/apiHelpers";
import { ProductModel } from "@/app/model/products/product.schema";

export async function GET(request: NextRequest) {
  try {
    const validation = await validateUserAccess(request);
    if (!validation.isValid) {
      return validation.response;
    }

    // Get user info from validation result
    const { userId, type } = validation.userInfo!;

    console.log(userId, "userId in produts list");
    // Check if user is owner
    if (type !== "owner") {
      return NextResponse.json(
        { error: "Owner access required", success: false },
        { status: 403 }
      );
    }

    // Connect to database
    await connectToDatabase();

    // Get storeId using the helper function
    const storeId = await getStoreIdByUserId(userId);

    if (!storeId) {
      return NextResponse.json(
        { error: "Store not found for this owner", success: false },
        { status: 404 }
      );
    }

    // Get query parameters for filtering/pagination
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const category = searchParams.get("category");
    const inStock = searchParams.get("inStock");

    // Build filter object - only products from this owner's store and not soft deleted
    const filter: any = {
      storeId: storeId,
      softDelete: false, // Only fetch non-deleted products
    };

    // Add optional filters
    if (category) filter.category = category;
    if (inStock !== null && inStock !== undefined) {
      filter.inStock = inStock === "true";
    }

    // Calculate skip for pagination
    const skip = (page - 1) * limit;

    // Fetch products with pagination
    const products = await ProductModel.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("storeId", "displayName"); // Populate store info

    // Get total count for pagination info
    const totalProducts = await ProductModel.countDocuments(filter);
    const totalPages = Math.ceil(totalProducts / limit);

    return NextResponse.json({
      success: true,
      message: "Products fetched successfully",
      data: {
        products,
        pagination: {
          currentPage: page,
          totalPages,
          totalProducts,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      },
    });
  } catch (error: any) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Internal server error", success: false },
      { status: 500 }
    );
  }
}
