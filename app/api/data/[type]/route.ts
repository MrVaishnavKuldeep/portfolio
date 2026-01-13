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
  let type: string = "profile"; // Default fallback
  try {
    const resolvedParams = await params;
    type = resolvedParams.type;
    
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

    // Try to fetch from GitHub first
    let content: string | null = null;
    try {
      const filePath = `data/${type}.json`;
      content = await getGitHubFile(filePath);
    } catch (githubError) {
      console.log("GitHub fetch failed, falling back to local file:", githubError);
    }

    // If GitHub fetch failed or returned null, use local file
    if (!content) {
      try {
        const fs = await import("fs/promises");
        const path = await import("path");
        const localFilePath = path.join(process.cwd(), "data", `${type}.json`);
        content = await fs.readFile(localFilePath, "utf-8");
      } catch (localError) {
        console.error("Local file also not found:", localError);
        // Return default empty data structure
        const defaultData: Record<string, any> = {
          profile: { name: "", title: "", description: "", about: [], contact: { email: "", linkedin: "" } },
          skills: { strongSkills: [], basicSkills: [] },
          projects: [],
          experience: [],
        };
        return NextResponse.json(defaultData[type] || {});
      }
    }

    // Parse and return the content
    try {
      return NextResponse.json(JSON.parse(content));
    } catch (parseError) {
      console.error("Error parsing JSON:", parseError);
      // Return default empty data structure
      const defaultData: Record<string, any> = {
        profile: { name: "", title: "", description: "", about: [], contact: { email: "", linkedin: "" } },
        skills: { strongSkills: [], basicSkills: [] },
        projects: [],
        experience: [],
      };
      return NextResponse.json(defaultData[type] || {});
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    // Return default empty data structure instead of error
    const defaultData: Record<string, any> = {
      profile: { name: "", title: "", description: "", about: [], contact: { email: "", linkedin: "" } },
      skills: { strongSkills: [], basicSkills: [] },
      projects: [],
      experience: [],
    };
    return NextResponse.json(defaultData[type] || {});
  }
}
