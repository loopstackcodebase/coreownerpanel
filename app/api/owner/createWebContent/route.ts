import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/app/lib/dbconfig";
import { StoreModel } from "@/app/model/store/store.schema";
import { getUserFromHeaders, validateUserAccess } from "@/utils/apiHelpers";

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

    if (!userId || type !== "owner") {
      return NextResponse.json(
        { error: "Unauthorized access", success: false },
        { status: 403 }
      );
    }

    // Parse request body
    const body = await request.json();
    const {
      displayName,
      description,
      email,
      logo,
      contact,
      businessHours,
      quickHelp,
      aboutUs,
    } = body;

    // Validate required fields
    if (!displayName) {
      return NextResponse.json(
        { error: "Display name is required", success: false },
        { status: 400 }
      );
    }

    // Check if store already exists for this owner
    const existingStore = await StoreModel.findOne({ ownerId: userId });

    if (existingStore) {
      return NextResponse.json(
        { error: "Store already exists for this owner", success: false },
        { status: 409 }
      );
    }

    // Create new store
    const newStore = new StoreModel({
      displayName,
      ownerId: userId,
      description: description || "",
      email: email || "",
      logo: logo || "",
      contact: contact || {},
      businessHours: businessHours || undefined, // Will use default from schema
      quickHelp: quickHelp || {},
      aboutUs: aboutUs || {},
    });

    const savedStore = await newStore.save();

    return NextResponse.json({
      success: true,
      message: "Store web content created successfully",
      data: {
        storeId: savedStore._id,
        displayName: savedStore.displayName,
        description: savedStore.description,
        email: savedStore.email,
        logo: savedStore.logo,
        contact: savedStore.contact,
        businessHours: savedStore.businessHours,
        quickHelp: savedStore.quickHelp,
        aboutUs: savedStore.aboutUs,
      },
    });
  } catch (error: any) {
    console.error("Error creating store web content:", error);

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
