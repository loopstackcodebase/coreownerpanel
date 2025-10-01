import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/app/lib/dbconfig";
import { getStoreIdByUserId, validateUserAccess } from "@/utils/apiHelpers";
import { SocialLinksModel } from "@/app/model/social-links/social.schema";

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

    // Fetch social links for the store
    const socialLinksDoc = await SocialLinksModel.findOne({ storeId });

    // Return empty array if no document found
    const socialLinks = socialLinksDoc ? socialLinksDoc.socialLinks : [];

    return NextResponse.json({
      success: true,
      data: socialLinks,
      message: "Social links fetched successfully",
    });
  } catch (error: any) {
    console.error("Error fetching social links:", error);

    return NextResponse.json(
      { error: "Internal server error", success: false },
      { status: 500 }
    );
  }
}
