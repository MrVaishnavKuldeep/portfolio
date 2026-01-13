# Kuldeep Vaishnav - Portfolio Website

A modern, professional portfolio website for a Senior Java Backend Developer built with Next.js, TypeScript, Tailwind CSS, and shadcn/ui.

## 🚀 Features

- **Modern Design**: Clean, premium, minimal UI focused on developer aesthetics
- **Fully Responsive**: Optimized for both desktop and mobile devices
- **SEO-Friendly**: Proper metadata and semantic HTML structure
- **Smooth Animations**: Subtle fade-in animations for better UX
- **Performance Optimized**: Built with Next.js 16 for optimal performance

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Deployment**: Vercel-ready

## 📦 Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 🎨 Sections

1. **Hero**: Name, role, and tagline with call-to-action buttons
2. **About Me**: Professional background and expertise
3. **Skills**: Grouped by proficiency (Strong / Basic)
4. **Experience**: Timeline of work experience with achievements
5. **Projects**: Key projects with architecture descriptions
6. **Tech Stack**: Comprehensive technology breakdown
7. **Contact**: Email and LinkedIn contact information

## 📝 Customization

### Update Contact Information

Edit `/components/Contact.tsx`:
- Replace `your.email@example.com` with your actual email
- Replace `https://linkedin.com/in/yourprofile` with your LinkedIn URL

### Update Content

All content is stored in component files:
- Personal info: `components/Hero.tsx`
- About section: `components/About.tsx`
- Skills: `components/Skills.tsx`
- Experience: `components/Experience.tsx`
- Projects: `components/Projects.tsx`
- Tech Stack: `components/TechStack.tsx`

### Update Metadata

Edit `app/layout.tsx` to update SEO metadata, title, and description.

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import the repository in Vercel
3. Vercel will automatically detect Next.js and configure the build
4. Your site will be live!

### Manual Deployment

```bash
npm run build
npm start
```

## 📄 License

This project is private and personal.

## 👤 Author

**Kuldeep Vaishnav**
- Senior Java Backend Developer
- 6+ years of experience
- Specialized in Microservices, Spring Boot, and scalable backend systems
