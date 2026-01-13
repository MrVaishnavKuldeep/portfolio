/**
 * Authentication utilities
 * 
 * SECURITY NOTE:
 * - Password is hashed using SHA-256
 * - Hash is stored in codebase (not ideal for production, but acceptable for admin/backup site)
 * - Session is stored in sessionStorage (client-side)
 * - This is a simple authentication system for an internal admin site
 * - For production use, consider using proper authentication providers
 */

/**
 * Hash password using SHA-256
 * This is a simple hash function - in production, use bcrypt or similar
 */
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  return hashHex;
}

/**
 * Password hash (SHA-256)
 * To set a new password:
 * 1. Generate hash: await hashPassword("your-password")
 * 2. Replace the value below
 * 
 * Default password hash (password: "admin")
 * You should change this to your own password hash
 */
export const ADMIN_PASSWORD_HASH = "d9e26dd88d5d99781a5ba52bcb76f1f064b7fb9fafecb2d98a46bdcd1ec5edbf";

/**
 * Verify password
 */
export async function verifyPassword(password: string): Promise<boolean> {
  const hash = await hashPassword(password);
  return hash === ADMIN_PASSWORD_HASH;
}

/**
 * Check if user is authenticated (client-side)
 */
export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem("admin_authenticated") === "true";
}

/**
 * Set authentication status (client-side)
 */
export function setAuthenticated(value: boolean): void {
  if (typeof window === "undefined") return;
  if (value) {
    sessionStorage.setItem("admin_authenticated", "true");
  } else {
    sessionStorage.removeItem("admin_authenticated");
  }
}
