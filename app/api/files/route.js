import { NextResponse } from "next/server";
import cloudinary from "@/server/cloudinary.config";

function getExt(name) {
  return name.split(".").pop().toLowerCase();
}

function formatSize(bytes) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

export async function GET() {
  try {
    let allResources = [];
    let nextCursor = null;

    // Paginate through all resources
    do {
      const options = {
        type: "upload",
        prefix: "documents/",
        resource_type: "raw",
        context: true,
        max_results: 100,
      };
      if (nextCursor) options.next_cursor = nextCursor;

      const result = await cloudinary.api.resources(options);
      allResources = allResources.concat(result.resources || []);
      nextCursor = result.next_cursor;
    } while (nextCursor);

    const files = allResources.map((r) => {
      const ctx = r.context?.custom || {};
      const name = ctx.originalName || r.public_id.split("/").pop();
      const ext = getExt(name);
      const sizeBytes = parseInt(ctx.fileSize, 10) || r.bytes || 0;

      return {
        id: r.asset_id || r.public_id,
        name,
        ext,
        tag: "MY UPLOADS",
        category: ctx.category || "academic",
        date: new Date(r.created_at)
          .toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
          })
          .toUpperCase(),
        size: formatSize(sizeBytes),
        sizeBytes,
        avatars: ["ME"],
        extra: 0,
        url: r.secure_url,
        public_id: r.public_id,
        created_at: r.created_at,
      };
    });

    // Sort by newest first
    files.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    return NextResponse.json({ files });
  } catch (error) {
    console.error("Error listing files:", error);
    return NextResponse.json(
      { error: "Failed to list files" },
      { status: 500 }
    );
  }
}
