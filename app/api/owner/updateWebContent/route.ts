import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/app/lib/dbconfig";
import { StoreModel } from "@/app/model/store/store.schema";
import { validateUserAccess } from "@/utils/apiHelpers";

export async function PUT(request: NextRequest) {
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

    // Find existing store
    const existingStore = await StoreModel.findOne({ ownerId: userId });

    if (!existingStore) {
      return NextResponse.json(
        { error: "Store not found", success: false },
        { status: 404 }
      );
    }

    // Prepare update object (only include provided fields)
    const updateData: any = {};

    if (displayName !== undefined) updateData.displayName = displayName;
    if (description !== undefined) updateData.description = description;
    if (email !== undefined) updateData.email = email;
    if (logo !== undefined) updateData.logo = logo;
    if (contact !== undefined) updateData.contact = contact;
    if (businessHours !== undefined) updateData.businessHours = businessHours;
    if (quickHelp !== undefined) updateData.quickHelp = quickHelp;
    if (aboutUs !== undefined) updateData.aboutUs = aboutUs;

    // Update the store
    const updatedStore = await StoreModel.findOneAndUpdate(
      { ownerId: userId },
      updateData,
      {
        new: true, // Return updated document
        runValidators: true, // Run schema validators
      }
    );

    return NextResponse.json({
      success: true,
      message: "Store web content updated successfully",
      data: {
        storeId: updatedStore._id,
        displayName: updatedStore.displayName,
        description: updatedStore.description,
        email: updatedStore.email,
        logo: updatedStore.logo,
        contact: updatedStore.contact,
        businessHours: updatedStore.businessHours,
        quickHelp: updatedStore.quickHelp,
        aboutUs: updatedStore.aboutUs,
      },
    });
  } catch (error: any) {
    console.error("Error updating store web content:", error);

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
