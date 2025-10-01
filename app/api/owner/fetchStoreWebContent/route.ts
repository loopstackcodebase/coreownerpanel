import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/app/lib/dbconfig";
import { StoreModel } from "@/app/model/store/store.schema";
import { getUserFromHeaders } from "@/utils/apiHelpers";

export async function GET(request: NextRequest) {
  try {
    // Connect to database
    await connectToDatabase();

    // Get user info from middleware headers
    const { userId, type } = getUserFromHeaders(request);

    if (!userId || type !== "owner") {
      return NextResponse.json(
        { error: "Unauthorized access", success: false },
        { status: 403 }
      );
    }

    // Find store by owner ID
    const store = await StoreModel.findOne({ ownerId: userId });

    if (!store) {
      return NextResponse.json(
        { error: "Store not found", success: false },
        { status: 404 }
      );
    }

    // Return store web content
    return NextResponse.json({
      success: true,
      data: {
        storeId: store._id,
        displayName: store.displayName,
        description: store.description,
        email: store.email,
        logo: store.logo,
        contact: store.contact,
        businessHours: store.businessHours,
        quickHelp: store.quickHelp,
        aboutUs: store.aboutUs,
      },
    });
  } catch (error) {
    console.error("Error fetching store web content:", error);
    return NextResponse.json(
      { error: "Internal server error", success: false },
      { status: 500 }
    );
  }
}
