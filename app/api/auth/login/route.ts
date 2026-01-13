import { NextRequest, NextResponse } from "next/server";
import { verifyPassword } from "@/lib/auth";

/**
 * API route for authentication
 * 
 * POST /api/auth/login
 * 
 * SECURITY NOTE:
 * - Password verification happens server-side
 * - Returns success status only (no token for now)
 * - Client-side stores authentication in sessionStorage
 * - This is a simple auth system for an internal admin site
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password } = body;

    if (!password) {
      return NextResponse.json(
        { error: "Password is required" },
        { status: 400 }
      );
    }

    const isValid = await verifyPassword(password);

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid password" },
        { status: 401 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error during login:", error);
    return NextResponse.json(
      { error: "Login failed" },
      { status: 500 }
    );
  }
}
