import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/app/lib/dbconfig";
import { getStoreIdByUserId, validateUserAccess } from "@/utils/apiHelpers";
import { SocialLinksModel } from "@/app/model/social-links/social.schema";

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
    const { socialLinks } = body;

    // Get storeId using the helper function
    const storeId = await getStoreIdByUserId(userId);

    if (!storeId) {
      return NextResponse.json(
        { error: "Store not found for this owner", success: false },
        { status: 404 }
      );
    }

    if (!socialLinks || !Array.isArray(socialLinks)) {
      return NextResponse.json(
        { error: "socialLinks array is required", success: false },
        { status: 400 }
      );
    }

    // Validate each social link
    for (const link of socialLinks) {
      if (!link.title || !link.url) {
        return NextResponse.json(
          { error: "Each social link must have title and url", success: false },
          { status: 400 }
        );
      }

      // Basic URL validation
      try {
        new URL(link.url);
      } catch {
        return NextResponse.json(
          { error: `Invalid URL format: ${link.url}`, success: false },
          { status: 400 }
        );
      }
    }

    // Prepare the social links data
    const socialLinksData = socialLinks.map((link) => ({
      title: link.title.trim(),
      url: link.url.trim(),
    }));

    // Use findOneAndUpdate with upsert to either update existing or create new
    await SocialLinksModel.findOneAndUpdate(
      { storeId },
      {
        storeId,
        socialLinks: socialLinksData,
      },
      {
        upsert: true, // Create if doesn't exist
        new: true,
      }
    );

    return NextResponse.json({
      success: true,
      message: "Social links updated successfully",
    });
  } catch (error: any) {
    console.error("Error updating social links:", error);

    return NextResponse.json(
      { error: "Internal server error", success: false },
      { status: 500 }
    );
  }
}
