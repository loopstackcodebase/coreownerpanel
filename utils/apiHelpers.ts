import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/app/lib/dbconfig";
import { UserModel } from "@/app/model/users/user.schema";
import { UserInfo } from "@/app/types/user.types";
import { StoreModel } from "@/app/model/store/store.schema";

// Get user info from middleware headers
export function getUserFromHeaders(request: NextRequest): UserInfo {
  return {
    userId: request.headers.get("x-user-id") || "",
    type: request.headers.get("x-user-type") || "",
    username: request.headers.get("x-username") || "",
  };
}

// Check user status in API routes
export async function checkUserStatus(
  userId: string
): Promise<{ isActive: boolean; error?: string }> {
  try {
    await connectToDatabase();

    const user = await UserModel.findById(userId).select("status");

    if (!user) {
      return { isActive: false, error: "User not found" };
    }

    const isActive = user.status === "active";

    return {
      isActive,
      error: isActive ? undefined : `User account is ${user.status}`,
    };
  } catch (error) {
    console.error("Error checking user status:", error);
    return { isActive: false, error: "Failed to verify user status" };
  }
}

// Combined validation function
export async function validateUserAccess(request: NextRequest): Promise<{
  isValid: boolean;
  response?: NextResponse;
  userInfo?: UserInfo;
}> {
  const userInfo = getUserFromHeaders(request);
  console.log(userInfo, "userinfo");
  if (!userInfo.userId) {
    return {
      isValid: false,
      response: NextResponse.json(
        { error: "User information missing", success: false },
        { status: 401 }
      ),
    };
  }

  const statusCheck = await checkUserStatus(userInfo.userId);

  if (!statusCheck.isActive) {
    return {
      isValid: false,
      response: NextResponse.json(
        {
          error: statusCheck.error || "User account is inactive",
          success: false,
        },
        { status: 403 }
      ),
    };
  }

  return {
    isValid: true,
    userInfo,
  };
}

/**
 * Get store ID by user ID (owner ID)
 * @param userId - The owner's user ID
 * @returns Promise<string | null> - Returns storeId or null if not found
 */
export const getStoreIdByUserId = async (
  userId: string
): Promise<string | null> => {
  try {
    await connectToDatabase();
    const store = await StoreModel.findOne({ ownerId: userId }).select("_id");
    return store ? store._id.toString() : null;
  } catch (error) {
    console.error("Error fetching store ID:", error);
    return null;
  }
};

export const getTokenFromCookies = (): string | null => {
  if (typeof document === "undefined") return null;

  const cookies = document.cookie.split(";");
  for (let cookie of cookies) {
    const [name, value] = cookie.trim().split("=");
    if (name === "token") {
      return decodeURIComponent(value);
    }
  }
  return null;
};
