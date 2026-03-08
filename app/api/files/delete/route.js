import { NextResponse } from "next/server";
import cloudinary from "@/server/cloudinary.config";

export async function DELETE(req) {
  try {
    const { public_id } = await req.json();

    if (!public_id) {
      return NextResponse.json(
        { error: "public_id is required" },
        { status: 400 }
      );
    }

    const result = await cloudinary.uploader.destroy(public_id, {
      resource_type: "raw",
    });

    if (result.result === "ok" || result.result === "not found") {
      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { error: "Failed to delete file", details: result },
      { status: 500 }
    );
  } catch (error) {
    console.error("Error deleting file:", error);
    return NextResponse.json(
      { error: "Failed to delete file" },
      { status: 500 }
    );
  }
}
