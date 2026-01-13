# Admin Dashboard Quick Setup Guide

## Quick Start

1. **Set Environment Variables**
   
   Create `.env.local` file:
   ```env
   GITHUB_OWNER=your-github-username
   GITHUB_REPO=your-repo-name
   GITHUB_TOKEN=your-github-token
   GITHUB_BRANCH=main
   ```

2. **Get GitHub Token**
   - Go to: GitHub Settings > Developer settings > Personal access tokens > Tokens (classic)
   - Generate new token with `repo` scope
   - Copy and paste into `.env.local`

3. **Default Login**
   - URL: `http://localhost:3000/admin/login`
   - Password: `admin` (change this in `lib/auth.ts`)

4. **Run the App**
   ```bash
   npm run dev
   ```

## Changing the Password

1. Open `lib/auth.ts`
2. Generate a new hash (see ADMIN_README.md for instructions)
3. Update `ADMIN_PASSWORD_HASH` constant

## File Structure

- `/admin/login` - Login page
- `/admin/dashboard` - Admin dashboard
- `/api/data/[type]` - Data API endpoints
- `/data/*.json` - JSON data files (stored in GitHub)

## Important Notes

- The admin site is separate from your public portfolio
- All changes are committed to GitHub
- Data files are in the `data/` directory
- See `ADMIN_README.md` for detailed documentation
