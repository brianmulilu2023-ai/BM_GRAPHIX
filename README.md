# BM Graphix — Premium Portfolio Website

> **"Designs that move people."**  
> A cinema-grade, luxury front-end portfolio built for **Brian Mulilu (BM Graphix)** — graphic designer and motion artist based in Nairobi, Kenya.

---

## 🌟 Brand & Visual Identity
- **Brand Name**: BM Graphix
- **Founder**: Brian Mulilu
- **Personality**: Premium, cinematic, confident, modern, luxury.
- **Palette**:
  - Near-black base (`#0A0A0A` / `#121212`)
  - Brushed-gold accents (`#D4AF37` &rarr; `#F5D77A` &rarr; `#B8860B`)
  - Warm white text (`#F5F1E8`)
  - Muted secondary grey (`#8A8A8A`)
- **Typography**:
  - Headings: `Syne` & `Playfair Display` (bold display fonts via Google Fonts)
  - Body: `Inter` (crisp, modern sans-serif)
- **Background**: Dynamic dark-to-gold gradient blended with a Nairobi CBD skyline parallax layer (`/assets/nairobi-cbd.jpg`).

---

## 🚀 Key Features

### 1. Home Page
- **Hero Section**: BM gold logo (`BM_BLCK.png`), punchy headline *"Designs that move people"*, subtext, animated gold badges, and quick CTA buttons (*"View Work"*, *"Hire Me"*).
- **Luxury Stats Ticker**: 5+ Years Experience, 150+ Delivered Projects, 40+ Happy Brands, 100% Kinetic Energy.
- **Featured Masterpieces**: Curated 6-project showcase with animated cards and direct lightbox access.
- **Creative Services**: Poster & Flyer Design, Logo & Branding, Motion Graphics, Video Promo Animation.
- **About Teaser**: Designer portrait, Royal Media Services experience mention, and direct CV download.
- **High-Impact CTA Banner**: Direct inquiry funnel.

### 2. Portfolio / Gallery
- **Masonry (Pinterest-Style) Grid**: Dynamic layout with fluid column flow.
- **Category Filter Tabs**: Animated Framer Motion sliding pill (*All*, *Posters & Flyers*, *Logos & Branding*, *Motion Graphics*, *Videos & Promos*).
- **Search Bar**: Instant real-time filtering across titles, categories, tools, clients, and descriptions.
- **Hover Overlays**: Dark gradient overlay, category badge, and interactive like button with heart burst animation.

### 3. Cinema Lightbox & Project Details
- **Full-Screen Responsive Modal**: High-res image display with zoom controls (Zoom In, Zoom Out, Reset), swipe gestures on touch devices, carousel arrows, and `ESC` key to close.
- **HTML5 Video Player**: Seamless video playback with controls for motion and video promo projects.
- **Project Detail View**: Title, client name, release year, category tag, tool badges (Photoshop, Illustrator, After Effects, Cinema 4D, etc.), and complete creative rationale.
- **Interactive Likes**: Real-time heart animation with persistent counter.
- **Real-Time Comment Section**: Submit comments with name and message; instantly added to project feedback.

### 4. About Page
- **Designer Portrait**: High-resolution studio photograph of Brian Mulilu.
- **Biography**: Art direction philosophy and background.
- **Animated Skills Progress Bars**: Photoshop (98%), Illustrator (95%), After Effects (92%), Premiere Pro (90%), Brand Strategy (94%), Cinema 4D / Blender (82%).
- **Creative Stack & Tools**: Software badges with icon emblems.
- **Experience Timeline**: Includes **Royal Media Services (RMS)** broadcast motion graphics role, BM Graphix director milestones, and agency history.
- **Download CV (PDF)**: Directly linked to `/assets/Brian_Mulilu_CV.pdf`.

### 5. Contact & Booking
- **Click-to-Call**: Direct `tel:+254798405726` link.
- **Direct WhatsApp**: Opens `wa.me/254798405726` with pre-filled greeting.
- **Direct Email**: `brianmulilu2023@gmail.com`.
- **Project Inquiry Brief Form**: Interactive form with validation (name, email, service required, budget range, and project brief) plus a celebratory gold confetti burst upon submission.
- **Floating WhatsApp Button**: Persistent on every page with pulsing ring, notification badge, and quick chat greeting.

### 6. Creator Admin Portal (`/admin/dashboard`)
- **Protected Route**: Secured with front-end mock authentication.
- **Login (`/admin/login`)**:
  - Demo Email: `admin@bmgraphix.com`
  - Demo Password: `admin123`
  - Includes a convenient **"One-Click Demo Sign In"** button for quick testing.
- **Drag-and-Drop Multi-Image Upload**:
  - **Batch upload support**: Handles multiple files simultaneously with a progress bar. Every selected file is processed and displayed.
  - Set any image as the primary cover thumbnail.
  - Video URL support for motion graphics and commercials.
- **Project Management**: Edit existing project details or delete projects with live synchronization to `localStorage`.
- **Comments Moderation**: View all incoming comments across every artwork with a direct **Delete Comment** action.
- **Viewer Isolation**: Viewers never see admin controls unless authenticated.

---

## 📂 Project Architecture

```
portfolio/
├── index.html                   # HTML entry point, SEO metadata & Google Fonts
├── vite.config.js               # Vite configuration
├── tailwind.config.js           # Custom gold & near-black design system
├── postcss.config.js            # PostCSS plugins
├── package.json                 # Dependencies & scripts
├── public/
│   ├── assets/
│   │   ├── BM_BLCK.png          # Primary brand logo (gold on black)
│   │   ├── nairobi-cbd.jpg      # Nairobi CBD skyline background
│   │   ├── brian-mulilu.jpg     # Designer portrait photo
│   │   ├── Brian_Mulilu_CV.pdf  # Curriculum Vitae
│   │   ├── logo/                # Logo variants & apple touch icons
│   │   └── projects/            # Real project artworks & posters
└── src/
    ├── main.jsx                 # Application entry point
    ├── App.jsx                  # Navigation, layout & routing orchestration
    ├── index.css                # Tailwind directives & luxury gold utilities
    ├── components/
    │   ├── Navbar.jsx           # Glassmorphism header that becomes solid on scroll
    │   ├── Footer.jsx           # Footer with logo, contact info, and discreet admin link
    │   ├── NairobiBackground.jsx# Parallax Nairobi skyline background with gold glow
    │   ├── GoldCursor.jsx       # Custom gold cursor with magnetic hover (desktop)
    │   ├── Preloader.jsx        # Gold animated logo preloader
    │   ├── FloatingWhatsApp.jsx # Floating WhatsApp button on every page
    │   ├── Lightbox.jsx         # Full-screen lightbox with zoom, comments & likes
    │   ├── ProjectCard.jsx      # Card with hover overlay and like counter
    │   ├── SkeletonCard.jsx     # Shimmer skeleton loader
    │   └── Toast.jsx            # Gold notification toasts
    ├── pages/
    │   ├── Home.jsx             # Hero, 6 featured works, services, about teaser, CTA
    │   ├── Gallery.jsx          # Pinterest masonry grid, category filters, search
    │   ├── Services.jsx         # Detailed capabilities and 4-step creative workflow
    │   ├── About.jsx            # Bio, animated skill bars, Royal Media Services timeline
    │   ├── Contact.jsx          # Direct call, WhatsApp, email, validated brief form
    │   ├── AdminLogin.jsx       # Admin login with one-click demo access
    │   └── AdminDashboard.jsx   # Project upload (multi-image), edit/delete, moderation
    ├── data/
    │   └── projects.js          # Initial project mock data & category definitions
    ├── services/
    │   └── projectService.js    # Single data layer & persistence service (swappable for API)
    └── context/
        └── ProjectContext.jsx   # Global state for projects, likes, comments, and admin auth
```

---

## 🛠️ How to Run Locally

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open in your browser
# Navigate to http://localhost:3000/
```

To create an optimized production build:
```bash
npm run build
npm run preview
```

---

## 🎨 How to Customize & Replace Content

### 1. Replacing the Logo
- Place your updated logo at `/public/assets/BM_BLCK.png` (or `/public/assets/logo/BM_BLCK.png`).
- It is automatically referenced across the Navbar, Hero, Preloader, and Footer.

### 2. Replacing the Nairobi CBD Background Image
- Replace the file at `/public/assets/nairobi-cbd.jpg`.
- The CSS parallax overlay in [src/components/NairobiBackground.jsx](file:///c:/Users/Administrator/Downloads/portfolio/src/components/NairobiBackground.jsx) automatically applies the low opacity, cinematic dark-to-gold gradient blend, and soft blur.

### 3. Replacing the Designer Portrait Photo
- Replace the file at `/public/assets/brian-mulilu.jpg`.

### 4. Updating or Adding Sample Projects
- **Via the Admin Dashboard**:
  1. Open `/admin/login` (or click **Admin** in the footer).
  2. Click **One-Click Demo Sign In**.
  3. Upload new images, specify the category, client, year, tools, and description.
- **Via the Codebase**:
  - Edit [src/data/projects.js](file:///c:/Users/Administrator/Downloads/portfolio/src/data/projects.js).

### 5. Updating Contact Details & Social Links
- Phone: Change `+254 798 405 726` in `Contact.jsx`, `Footer.jsx`, and `FloatingWhatsApp.jsx`.
- WhatsApp: Change `254798405726` in `FloatingWhatsApp.jsx` and `Contact.jsx`.
- Email: Change `brianmulilu2023@gmail.com` in `Contact.jsx` and `Footer.jsx`.

---

## ☁️ Deployment (Vercel / Netlify / Standalone)

This project is a 100% client-side React single-page app (SPA) with zero server dependencies required:

### Netlify Deployment
Create a `_redirects` file in `public/` (or `dist/`):
```
/*    /index.html   200
```
Run `npm run build`, and drag the `dist/` folder into Netlify Drop.

### Vercel Deployment
Run `vercel` or connect your GitHub repository to Vercel:
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

---

## 🛡️ Admin Credentials
- **URL**: `http://localhost:3000/admin/login`
- **Email**: `admin@bmgraphix.com`
- **Password**: `admin123`
- *(Includes a **One-Click Demo Sign In** button for instantaneous evaluation)*.
