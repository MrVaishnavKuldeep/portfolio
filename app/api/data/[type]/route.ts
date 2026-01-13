import { NextRequest, NextResponse } from "next/server";
import { getGitHubFile, validateGitHubConfig } from "@/lib/github";

/**
 * API route to fetch data from GitHub
 * 
 * GET /api/data/[type]
 * 
 * Types: profile, skills, projects, experience
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ type: string }> }
) {
  try {
    const { type } = await params;
    
    // Validate type
    const validTypes = ["profile", "skills", "projects", "experience"];
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: "Invalid data type" },
        { status: 400 }
      );
    }

    // Check if GitHub is configured
    if (!validateGitHubConfig()) {
      // Fallback to local file if GitHub is not configured
      try {
        const fs = await import("fs/promises");
        const path = await import("path");
        const filePath = path.join(process.cwd(), "data", `${type}.json`);
        const fileContent = await fs.readFile(filePath, "utf-8");
        return NextResponse.json(JSON.parse(fileContent));
      } catch (error) {
        return NextResponse.json(
          { error: "GitHub not configured and local file not found" },
          { status: 500 }
        );
      }
    }

    // Fetch from GitHub
    const filePath = `data/${type}.json`;
    const content = await getGitHubFile(filePath);

    if (!content) {
      return NextResponse.json(
        { error: "File not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(JSON.parse(content));
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}
