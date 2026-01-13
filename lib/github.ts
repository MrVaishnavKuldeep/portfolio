/**
 * GitHub API utility functions
 * 
 * SECURITY NOTE:
 * - GitHub token is stored in environment variable GITHUB_TOKEN
 * - Token should have repo scope for read/write access
 * - Token is never exposed to the client-side code
 * - All GitHub operations happen server-side only
 */

const GITHUB_OWNER = process.env.GITHUB_OWNER || "";
const GITHUB_REPO = process.env.GITHUB_REPO || "";
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || "";
const GITHUB_BRANCH = process.env.GITHUB_BRANCH || "main";

const GITHUB_API_BASE = "https://api.github.com";

interface GitHubFile {
  path: string;
  content: string;
  sha?: string;
}

/**
 * Get file content from GitHub repository
 */
export async function getGitHubFile(path: string): Promise<string | null> {
  try {
    const url = `${GITHUB_API_BASE}/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}?ref=${GITHUB_BRANCH}`;
    
    const response = await fetch(url, {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    // Decode base64 content
    if (data.content) {
      return Buffer.from(data.content, "base64").toString("utf-8");
    }
    
    return null;
  } catch (error) {
    console.error("Error fetching file from GitHub:", error);
    throw error;
  }
}

/**
 * Update file content in GitHub repository
 */
export async function updateGitHubFile(
  path: string,
  content: string,
  message: string
): Promise<boolean> {
  try {
    // First, get the current file to get its SHA
    const getUrl = `${GITHUB_API_BASE}/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}?ref=${GITHUB_BRANCH}`;
    
    const getResponse = await fetch(getUrl, {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
      },
    });

    let sha: string | undefined;
    if (getResponse.ok) {
      const fileData = await getResponse.json();
      sha = fileData.sha;
    }

    // Encode content to base64
    const encodedContent = Buffer.from(content, "utf-8").toString("base64");

    // Update the file
    const updateUrl = `${GITHUB_API_BASE}/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}`;
    
    const updateResponse = await fetch(updateUrl, {
      method: "PUT",
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
        content: encodedContent,
        branch: GITHUB_BRANCH,
        ...(sha && { sha }),
      }),
    });

    if (!updateResponse.ok) {
      const errorData = await updateResponse.json();
      throw new Error(`GitHub API error: ${updateResponse.status} - ${JSON.stringify(errorData)}`);
    }

    return true;
  } catch (error) {
    console.error("Error updating file in GitHub:", error);
    throw error;
  }
}

/**
 * Validate GitHub configuration
 */
export function validateGitHubConfig(): boolean {
  return !!(
    GITHUB_OWNER &&
    GITHUB_REPO &&
    GITHUB_TOKEN &&
    GITHUB_BRANCH
  );
}
