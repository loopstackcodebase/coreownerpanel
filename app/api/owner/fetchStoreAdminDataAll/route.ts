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

    // Fetch complete owner info (excluding password)
    const owner = await UserModel.findById(userId).select("-password");

    if (!owner) {
      return NextResponse.json(
        { error: "Owner not found", success: false },
        { status: 404 }
      );
    }

    // Fetch complete store data
    const store = await StoreModel.findById(storeId);

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
          ownerId: store.ownerId,
          description: store.description,
          email: store.email,
          logo: store.logo,
          contact: {
            getInTouchContent: store.contact.getInTouchContent,
            whatsAppSupport: store.contact.whatsAppSupport,
            emailSupport: store.contact.emailSupport,
            available24x7: store.contact.available24x7,
            responseTime: store.contact.responseTime,
          },
          businessHours: store.businessHours.map((hour: any) => ({
            day: hour.day,
            isOpen: hour.isOpen,
          })),
          quickHelp: {
            liveChatSupport: store.quickHelp.liveChatSupport,
            technicalSupport: store.quickHelp.technicalSupport,
            accountHelp: store.quickHelp.accountHelp,
          },
          aboutUs: {
            ourStory: store.aboutUs.ourStory,
            mission: store.aboutUs.mission,
            vision: store.aboutUs.vision,
            values: {
              trust: store.aboutUs.values.trust,
              excellence: store.aboutUs.values.excellence,
              sustainability: store.aboutUs.values.sustainability,
              community: store.aboutUs.values.community,
            },
            whyChooseUs: {
              secureShopping: store.aboutUs.whyChooseUs.secureShopping,
              fastDelivery: store.aboutUs.whyChooseUs.fastDelivery,
              customerFirst: store.aboutUs.whyChooseUs.customerFirst,
            },
            statistics: {
              happyCustomers: store.aboutUs.statistics.happyCustomers,
              products: store.aboutUs.statistics.products,
              countriesServed: store.aboutUs.statistics.countriesServed,
              uptime: store.aboutUs.statistics.uptime,
            },
            ourTeam: store.aboutUs.ourTeam,
          },
          createdAt: store.createdAt,
          updatedAt: store.updatedAt,
        },
      },
      message: "Store admin complete data fetched successfully",
    });
  } catch (error: any) {
    console.error("Error fetching complete store admin data:", error);

    return NextResponse.json(
      { error: "Internal server error", success: false },
      { status: 500 }
    );
  }
}
