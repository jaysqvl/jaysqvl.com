# Project Overview
You are building a portfolio website where recruiters can see a short about me section, view my work experience, see my education, view a list of my most updated recent projects, view my pdf resume, and/or find where to contact me. It should be sleek, modern, and minimalistic. There should be a dark and light theme switcher and the following sections.

You will be using NextJS 15, shadcn, tailwind, and lucide icons.

# Core Functionalities
- Responsive landing screen with a picture of myself, my name, title, a resume button, github button, and a linkedin button
- Sections for
    - About me
    - Experience
    - Education
    - Projects
- Light and dark mode switcher

# Doc


# Current File Structure
.
├── README.md
├── app
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components
│   └── ui
├── components.json
├── eslint.config.mjs
├── instructions
│   └── instructions.md
├── lib
│   └── utils.ts
├── next-env.d.ts
├── next.config.ts
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── public
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
└── tsconfig.json

7 directories, 20 files

# Product Requirements Document (PRD)

## 1. Purpose & Objectives

The objective of this project is to create a sleek, modern, minimalistic portfolio website to showcase:

- A short "About Me" section
- Work experience & education history
- A regularly updated list of recent projects
- A PDF resume download or view capability
- Links for contacting or following (e.g., GitHub, LinkedIn)
- A light and dark theme switcher

The website must be responsive and easy to maintain, with all critical functionalities clearly defined for future iterations.

## 2. Scope

### In-Scope Features
- Landing Screen with:
  - Profile image
  - Name and job title
  - Buttons for Resume (PDF), GitHub, and LinkedIn
  - About Me section
  - Experience section
  - Education section
  - Projects section (to highlight selected recent projects)
  - Light/Dark Mode Switcher (should be easily extensible)

### Out-of-Scope (Initially)
- Blog or long-form content
- Complex analytics or tracking
- CMS integrations
- Detailed admin interface for project uploads

## 3. Technology Stack
- **Framework**: Next.js 15+ (using the app/ directory structure introduced in Next 13, or in line with stable app routing in "Next 15")
- **UI Library**: shadcn/ui for prebuilt, stylized, and themable components
- **Styling**: Tailwind CSS for utility-first, responsive style
- **Icons**: lucide-icons for iconography
- **Language**: TypeScript for type safety and maintainability

## 4. Core Functional Requirements

### Responsive Landing Screen
- Must adapt seamlessly to mobile, tablet, and desktop viewports
- Contains a personal photo, user name, job title (e.g., "Software Engineer")
- Three immediate Call-to-Action buttons or links:
  - Resume (PDF link or dynamic embed)
  - GitHub (redirect to user's GitHub profile)
  - LinkedIn (redirect to user's LinkedIn profile)

### Sections
- **About Me**: Brief info describing the user's background and skill set
- **Experience**: High-level timeline or bullet points of relevant jobs/roles
- **Education**: Summary of university or relevant educational milestones
- **Projects**: Showcase the user's recent or most relevant projects, with short descriptions, technologies used, and optional links for demos/GitHub repos

### Light and Dark Mode Switcher
- A toggle that allows quick switching between light and dark themes
- Should be placed in a noticeable but non-intrusive location, often in the header or top-right corner

### Resume View/Download
- Option to view the PDF in-browser or directly download it from a link in the public folder

## 5. Minimal File Structure

```
.
├── README.md
├── app
│   ├── favicon.ico           // Favicon
│   ├── globals.css           // Tailwind + any global styles
│   ├── layout.tsx            // Root layout for Next.js
│   └── page.tsx              // Main (landing) page with all sections
├── components
│   ├── theme-switcher.tsx    // Light/dark theme toggle (shadcn, lucide icons)
│   └── ui                    // If you need more shadcn-generated UI components
├── lib
│   └── utils.ts              // Utility functions
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── public
│   ├── your-image.jpg        // Profile image or other static assets
│   └── resume.pdf            // Resume PDF
├── tsconfig.json
└── ...
```

### Notes on Structure
- `app/layout.tsx`: Handles global structure (e.g., `<html>` tags, site-wide `<header>` or `<footer>` if needed)
- `app/page.tsx`: Contains the landing page with nested sections (About Me, Experience, Education, Projects)
- `components/theme-switcher.tsx`: Houses logic to toggle between light and dark themes
- `public/resume.pdf`: The user's resume, allowing direct downloads or opening in a new tab

## 6. User Flow / Navigation

### Home (Landing) Page
- User sees a hero section with personal image, name, short tagline
- Buttons for GitHub, LinkedIn, and Resume are immediately visible

### Scrolling Down / Navigating
- About Me → Experience → Education → Projects (or whichever order is decided)
- Each section is accessible in-page through anchor links or site-wide navigation

### Theme Switcher
- User can toggle between light and dark mode at any point, with the application re-styling instantly

## 7. Implementation Guidelines

### Responsive Design
- Use Tailwind's responsive utility classes (`sm:`, `md:`, `lg:`) to ensure consistent styling across breakpoints

### Accessibility
- Make sure text has sufficient contrast in both light and dark modes
- Use semantic HTML tags (e.g., `<nav>`, `<section>`, `<article>` where appropriate)

### Performance
- Keep images optimized; store them in `public/` and reference via Next.js's built-in image component (optional)
- Keep the bundle size small by avoiding unnecessary dependencies

### Style & Theming
- Integrate the theming approach recommended by shadcn/ui with Tailwind to unify the color palette in both modes

### SEO
- Provide meta tags in `layout.tsx` for page title, description, and relevant social sharing data if needed

## 8. Documentation
Currently, there are no additional external docs to reference. If example docs or responses become available, they should be added here for future reference. The intention is for any important constraints, clarifications, or design decisions to be collected in a single location (the PRD) or a corresponding "docs" folder.

## 9. Acceptance Criteria
- The final website should display correctly on modern browsers (Chrome, Firefox, Safari, Edge)
- Core user flow (landing + sections + PDF resume link + theme toggle) must function without errors
- All sections described (About Me, Experience, Education, Projects) are present and visible
- Light/Dark mode is easily toggled; the user's choice persists if the site is revisited (using localStorage or a similar approach if decided)
- Minimalistic, clean UI that aligns with the user's overall design aesthetic
