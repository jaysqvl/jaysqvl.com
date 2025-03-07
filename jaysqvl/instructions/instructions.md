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

# Resume/Some of My Information
# Jay Esquivel Jr.

**Projects:** [github.com/Jaysqvl](https://github.com/Jaysqvl)  
**Full Legal Name:** Bob Dayupay Esquivel Jr.  
**LinkedIn:** [linkedin.com/in/Jaysqvl/](https://linkedin.com/in/Jaysqvl/)  
**Phone:** +1-778-991-1371  
**Email:** jaysqvl@gmail.com  

---

## Education

### Simon Fraser University, Burnaby, BC  
**Bachelor of Applied Science, Computer Science - Software Systems**  
*Sept 2022 – Present*  

### University of British Columbia, Vancouver, BC  
**Bachelor of Science, Computer Science & Mathematics**  
*Sept 2020 – Aug 2022*  
- **UBC CVC Social Club External Relations Executive**  
  - Event Planning for ~700 Members  
  - Maintain and Develop Brand Sponsorships  
  - Social Media Management  

---

## Experience

### **Software Engineer**  
**OffroadExpert** — *Python, Bash, Docker, HTML, CSS, JavaScript, Google Cloud Platform (GCP)*  
*June 2024 – Present | Vancouver, BC*  
- Automated vendor product data entry and processing using a pipe and filter back-end architecture, scaling product ingestion capacity **300x** and eliminating manual intervention.
- Developed dockerized, full-stack internal company tools combining React and TailwindCSS with Python to open product processing configuration to non-technical staff.
- Implemented an AI filter layer in the product processing pipeline incorporating OpenAI’s batch-processing API, prompt-caching, and prompt engineering techniques to improve SEO cost-effectively.
- Designed and deployed private cloud infrastructure including networking, virtual machines, docker management, and VPN setup, ensuring system reliability and security while reducing cloud operational costs.
- Deployed **OffRoadExpert.shop** by leveraging Shopify’s REST Admin API for back-end operations, front-end hosting, and e-commerce management tools to create a fully custom system.
- Actively developing a personalized front-end to optimize the user experience and align with business requirements.

### **Contract Software Developer**  
**Jaysqvl Solutions** — *Vancouver, BC / Remote*  
*Sept 2020 – Present*  
- Software consultations and development for small businesses including **generative AI applications, web, cloud, networking, virtualization, containerization, security systems, and IT infrastructure**.
- Developed **REST APIs, full-stack web applications,** and audited course content (debugging and testing) for various courses on **Udemy** and private platforms, contributing to **teaching 3000+ students** with a **4.5-star average rating**.
- Provided private tutoring in **Mathematics, Computer Science, and Data Science** for university students.

---

## Technical Skills

**Languages:** Python, Java, JavaScript, Kotlin, C++, C, HTML, CSS, SQL, R, Racket, LaTeX, Bash  
**AI Knowledge and Applications:** Langchain & HuggingFace, AI Agents, Fine-Tuning, Transformer Models, Neural Nets, Computer Vision, Vector Embeddings & Retrieval Augmented Generation (RAG), Prompt Engineering  
**Frameworks and Engines:** React.js, Node.js, Langchain, HuggingFace, Flask, Android, Hugo  
**Database:** Firebase, Supabase, Pinecone, PostgreSQL, Redis, Microsoft SQL Server, SQLite, MariaDB  
**Development/Deployment:** Git, Docker, Vercel, GitHub Pages, GitHub Actions  
**Test:** GoogleTest, GoogleMock, Libfuzzer, PIT, Stryker, Hypothesis, JUnit, PyTest, ACTS  
**Cloud:** Google Cloud (GCP), Amazon Web Services (AWS), Cloud Functions, Load Balancers & API Gateways, Virtual Machines, Dockerized Deployments, Storage Services  

---

## Projects

### **ExpensAI** — *An AI-Powered Spending and Financial Management App*  
*Kotlin, Python, Google Cloud (GCP), Firebase*  
- Deployed a **secure image API** on GCP Cloud Functions that validates base64-encoded images and utilizes OpenAI’s Vision API for classification.
- Developed a text API that takes **unidentifiable transaction history** and generates personalized insights.
- Created dynamic components that **synchronize in real-time** with both local and cloud persistence layers.
- Implemented **co-routines and threading** to optimize performance without compromising stability.
- Designed and implemented **Google Cloud infrastructure** services to optimize cost.

### **Cardiolo** — *Cardio Stats Tracking App with Trained Automatic Activity Classification*  
*Kotlin, Weka, Google Cloud (GCP)*  
- Trained and integrated a **WEKA Classification** background service to automatically identify cardiovascular activities based on phone movements.
- Deployed a custom map using the **Google Maps API** to track activity routes as a service.
- Developed a **dynamic UI** with co-routines, threading, and API pre-fetching for optimal performance.
- Integrated **Room databases** for secure user data storage and **CSV export**.

### **Jaysqvl.com** — *Portfolio Website*  
*HTML, CSS, JavaScript, React.js, Next.js, Vercel, GitHub Actions & Pages, Hugo*  
- Created **Jaysqvl.com** using the Hugo static site generating framework.
- Automated deployment of builds using **GitHub Actions**, reducing deployment time by 5 minutes per commit.
- Built **V2 using React.js and Next.js**, deployed on Vercel.

### **Impersonator** — *Full-Stack PDF ChatBot (Pre-ChatGPT File Ingest Capability)*  
*Python, Langchain, Docker, Supabase*  
- Designed a **polymorphic back-end** to support multiple **LLMs** (localized, fine-tuned, cloud).
- Streamlined development environment setup via **Dockerization**.
- Created a front-end using **Streamlit** to expedite development and UI integration.

### **Decode** — *Chrome Extension for Evaluating Product Sustainability While Shopping*  
*HTML, CSS, JavaScript, Python*  
- Developed an API that **scrapes the user’s product page, calculates sustainability scores, and returns insights**.
- Assisted in UI/UX implementation and development.

### **Divide and Conquer** — *Socket-Based Rendition of the Classic Game*  
*Java, Sockets*  
- Developed a **Java Swing-based** multiplayer game with a token-based **packet messaging system** to reduce client-to-client latency **5x**.
- Implemented **server-side asynchronous client handling**, improving performance based on logical threads.

### **PeerAdvice** — *Full-Stack Peer-to-Peer UBC Advising Platform*  
*HTML, CSS, JavaScript, Flask, PostgreSQL, FireBase*  
- Developed a **Flask-based back-end** featuring **GET and POST** API endpoints.
- Integrated **Google Authentication** and **Calendly** for seamless advisor bookings.

### **Hercules** — *Gamified Workout Mobile-App*  
*Java, Android*  
- Developed the **front-end using Java Android Library**.
- Optimized back-end data structures, reducing **run-time memory usage by over 200%**.

See all of my new projects and their demos at [github.com/jaysqvl](https://github.com/jaysqvl).

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
