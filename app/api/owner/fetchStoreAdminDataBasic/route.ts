import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/app/lib/dbconfig";
import { getStoreIdByUserId, validateUserAccess } from "@/utils/apiHelpers";
import { StoreModel } from "@/app/model/store/store.schema";
import { UserModel } from "@/app/model/users/user.schema";

export async function GET(request: NextRequest) {
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

    // Get storeId using the helper function
    const storeId = await getStoreIdByUserId(userId);

    if (!storeId) {
      return NextResponse.json(
        { error: "Store not found for this owner", success: false },
        { status: 404 }
      );
    }

    // Fetch owner basic info
    const owner = await UserModel.findById(userId).select(
      "username phoneNumber status type createdAt updatedAt"
    );

    if (!owner) {
      return NextResponse.json(
        { error: "Owner not found", success: false },
        { status: 404 }
      );
    }

    // Fetch store basic info
    const store = await StoreModel.findById(storeId).select(
      "displayName description email logo createdAt updatedAt"
    );

    if (!store) {
      return NextResponse.json(
        { error: "Store not found", success: false },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        owner: {
          _id: owner._id,
          username: owner.username,
          phoneNumber: owner.phoneNumber,
          status: owner.status,
          type: owner.type,
          createdAt: owner.createdAt,
          updatedAt: owner.updatedAt,
        },
        store: {
          _id: store._id,
          displayName: store.displayName,
          description: store.description,
          email: store.email,
          logo: store.logo,
          createdAt: store.createdAt,
          updatedAt: store.updatedAt,
        },
      },
      message: "Store admin basic info fetched successfully",
    });
  } catch (error: any) {
    console.error("Error fetching store admin info:", error);

    return NextResponse.json(
      { error: "Internal server error", success: false },
      { status: 500 }
    );
  }
}
