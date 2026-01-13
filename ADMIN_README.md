# Admin Dashboard Documentation

This is the admin/backup website for managing the portfolio content dynamically.

## Overview

The admin dashboard allows you to modify the content of your portfolio website by editing JSON files stored in a GitHub repository. All changes are committed directly to GitHub, treating it as your database.

## Features

- **Password-protected login** - Secure access using SHA-256 hashed password
- **Editable forms** for:
  - Profile information (name, title, description, about paragraphs, contact info)
  - Skills (strong skills and basic skills)
  - Projects (add, edit, remove projects)
  - Experience (add, edit, remove work experience)
- **GitHub integration** - All changes are saved directly to GitHub repository
- **Simple UX** - Clean, reliable interface focused on functionality

## Setup

### 1. Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
GITHUB_OWNER=your-github-username
GITHUB_REPO=your-repo-name
GITHUB_TOKEN=your-github-personal-access-token
GITHUB_BRANCH=main
```

### 2. GitHub Personal Access Token

1. Go to GitHub Settings > Developer settings > Personal access tokens > Tokens (classic)
2. Generate a new token with `repo` scope (full control of private repositories)
3. Copy the token and add it to your `.env.local` file

### 3. Default Password

The default password is `admin`. To change it:

1. Generate a new hash using the `hashPassword` function in `lib/auth.ts`
2. Update `ADMIN_PASSWORD_HASH` in `lib/auth.ts` with your new hash

**To generate a new password hash:**
```typescript
// In browser console or Node.js
const encoder = new TextEncoder();
const data = encoder.encode("your-password");
const hashBuffer = await crypto.subtle.digest("SHA-256", data);
const hashArray = Array.from(new Uint8Array(hashBuffer));
const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
console.log(hashHex);
```

### 4. Data Files Structure

The admin dashboard expects JSON files in the `data/` directory:

- `data/profile.json` - Profile information
- `data/skills.json` - Skills data
- `data/projects.json` - Projects array
- `data/experience.json` - Experience array

These files should already exist in your repository. If not, create them with the initial data structure.

## Usage

### Accessing the Admin Dashboard

1. Navigate to `/admin/login`
2. Enter your password
3. You'll be redirected to `/admin/dashboard`

### Editing Content

1. Select a tab (Profile, Skills, Projects, or Experience)
2. Make your changes in the form
3. Click "Save Changes" to commit to GitHub
4. You'll see a success or error message

### Logging Out

Click the "Logout" button in the top-right corner. This clears your session and redirects to the login page.

## Security Notes

⚠️ **Important Security Considerations:**

1. **Password Storage**: The password hash is stored in the codebase. This is acceptable for an internal admin/backup site but not ideal for production public-facing applications.

2. **Session Storage**: Authentication is stored in `sessionStorage`, which means:
   - Session persists only for the current browser tab
   - Session is cleared when the tab is closed
   - Not shared across browser tabs

3. **GitHub Token**: 
   - Never expose your GitHub token in client-side code
   - The token is only used server-side in API routes
   - Keep your `.env.local` file secure and never commit it

4. **API Routes**: 
   - Currently, authentication is handled client-side
   - For production use, consider adding server-side authentication middleware

## Architecture

### File Structure

```
app/
  admin/
    login/
      page.tsx          # Login page
    dashboard/
      page.tsx          # Admin dashboard with forms
    layout.tsx          # Admin layout
    page.tsx            # Admin redirect page
  api/
    auth/
      login/
        route.ts        # Login API endpoint
    data/
      [type]/
        route.ts        # GET data from GitHub
        update/
          route.ts      # POST update to GitHub

lib/
  auth.ts               # Authentication utilities
  github.ts             # GitHub API utilities

data/
  profile.json          # Profile data
  skills.json           # Skills data
  projects.json         # Projects data
  experience.json       # Experience data
```

### Data Flow

1. **Reading Data**: Components fetch from `/api/data/[type]` → GitHub API → JSON files
2. **Writing Data**: Admin dashboard → `/api/data/[type]/update` → GitHub API → Commit to repository

### Fallback Behavior

If GitHub is not configured, the API routes will attempt to read from local `data/` files. This allows the site to work without GitHub configuration, but updates won't be saved.

## Troubleshooting

### "GitHub not configured" Error

- Check that all environment variables are set in `.env.local`
- Restart your development server after adding environment variables
- Verify your GitHub token has the correct permissions

### "Failed to save data" Error

- Check your GitHub token permissions
- Verify the repository name and owner are correct
- Ensure the branch name matches your repository's default branch
- Check that the JSON data is valid

### Login Not Working

- Verify the password hash in `lib/auth.ts` matches your password
- Clear browser sessionStorage and try again
- Check browser console for errors

## Development

### Running Locally

```bash
npm run dev
```

Then navigate to `http://localhost:3000/admin/login`

### Building for Production

```bash
npm run build
npm start
```

Make sure to set environment variables in your production environment (Vercel, etc.).

## Notes

- This is an **internal admin/backup site**, not the public website
- The code is designed to be clean and beginner-friendly
- No fancy animations - focused on reliability and clarity
- All content changes are version-controlled through GitHub commits
