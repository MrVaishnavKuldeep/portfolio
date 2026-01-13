import { NextRequest, NextResponse } from "next/server";
import { updateGitHubFile, validateGitHubConfig } from "@/lib/github";

/**
 * API route to update data in GitHub
 * 
 * POST /api/data/[type]/update
 * 
 * Types: profile, skills, projects, experience
 * 
 * SECURITY NOTE:
 * - This endpoint should be protected by authentication middleware
 * - For now, authentication is handled client-side
 * - In production, add server-side authentication check here
 */
export async function POST(
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
      return NextResponse.json(
        { error: "GitHub not configured. Please set GITHUB_OWNER, GITHUB_REPO, GITHUB_TOKEN, and GITHUB_BRANCH environment variables." },
        { status: 500 }
      );
    }

    // Get request body
    const body = await request.json();
    const { data, message } = body;

    if (!data) {
      return NextResponse.json(
        { error: "Data is required" },
        { status: 400 }
      );
    }

    // Validate JSON
    let jsonContent: string;
    try {
      jsonContent = JSON.stringify(data, null, 2);
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid JSON data" },
        { status: 400 }
      );
    }

    // Update file in GitHub
    const filePath = `data/${type}.json`;
    const commitMessage = message || `Update ${type} data`;

    await updateGitHubFile(filePath, jsonContent, commitMessage);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error updating data:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update data" },
      { status: 500 }
    );
  }
}
