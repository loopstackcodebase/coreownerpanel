// pages/api/upload-images.ts
import { getStoreIdByUserId } from "@/utils/apiHelpers";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Helper function to get user from headers
const getUserFromHeaders = async (request: NextRequest) => {
  const userId: any = request.headers.get("x-user-id");

  const storeId = await getStoreIdByUserId(userId);

  if (!userId) {
    throw new Error("User not authenticated");
  }

  if (!storeId) {
    throw new Error("Store not found");
  }

  return { userId, storeId };
};

// Helper function to generate unique filename
const generateUniqueFilename = (): string => {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
};

// Helper function to upload single image to ImageHippo
const uploadToImageHippo = async (
  file: File,
  filename: string
): Promise<string> => {
  const apiKey = process.env.IMGHIPPO_API_KEY;

  if (!apiKey) {
    throw new Error("ImageHippo API key not configured");
  }

  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const formData = new (globalThis.FormData || FormData)();
    formData.append("api_key", apiKey);
    formData.append("title", filename);

    const blob = new Blob([buffer], { type: file.type });
    formData.append("file", blob, `${filename}.${file.name.split(".").pop()}`);

    const response = await fetch("https://api.imghippo.com/v1/upload", {
      method: "POST",
      body: formData,
    });

    const responseText = await response.text();

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      if (responseText.includes("Unexpected end of form")) {
        throw new Error(
          "Form data formatting error - multipart boundary issue"
        );
      } else if (responseText.includes("rate limited")) {
        throw new Error("API rate limited or unavailable");
      } else {
        throw new Error(
          `Server returned HTML instead of JSON: ${response.status}`
        );
      }
    }

    if (data.success === false || data.status === 400) {
      throw new Error(
        `ImageHippo API error: ${data.message || "Unknown error"}`
      );
    }

    if (data.data && data.data.view_url) {
      return data.data.view_url;
    } else if (data.view_url) {
      return data.view_url;
    } else if (data.url) {
      return data.url;
    } else if (data.image && data.image.url) {
      return data.image.url;
    } else {
      throw new Error(`Unexpected response structure: ${JSON.stringify(data)}`);
    }
  } catch (error) {
    throw error;
  }
};

export async function POST(request: NextRequest) {
  try {
    //check header have userid and store id
    getUserFromHeaders(request);

    const apiKey = process.env.IMGHIPPO_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        {
          error: "ImageHippo API configuration error",
          details: "Missing API key",
        },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const files = formData.getAll("files") as File[];

    // Basic validation
    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }

    // File validation
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      if (!allowedTypes.includes(file.type.toLowerCase())) {
        return NextResponse.json(
          {
            error: `Invalid file type for file ${i + 1}: ${
              file.type
            }. Allowed types: JPG, PNG, GIF, WebP`,
          },
          { status: 400 }
        );
      }

      if (file.size > maxSize) {
        return NextResponse.json(
          {
            error: `File ${i + 1} is too large: ${Math.round(
              file.size / 1024 / 1024
            )}MB. Maximum size: 5MB`,
          },
          { status: 400 }
        );
      }
    }

    // Upload all images
    const uploadPromises = files.map(async (file) => {
      const filename = generateUniqueFilename();
      return await uploadToImageHippo(file, filename);
    });

    const uploadedUrls = await Promise.all(uploadPromises);

    return NextResponse.json({
      urls: uploadedUrls,
      message: `Successfully uploaded ${uploadedUrls.length} image(s)`,
      count: uploadedUrls.length,
    });
  } catch (error) {
    let errorMessage = "Unknown error";

    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json(
      {
        error: "Failed to upload images",
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}
