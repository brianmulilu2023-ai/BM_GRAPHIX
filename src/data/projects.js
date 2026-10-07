/**
 * BM Graphix — Initial Project Data
 * Single Source of Truth for projects.
 * Easily swappable for a REST or GraphQL backend.
 */

export const INITIAL_PROJECTS = [
  {
    id: "proj-1",
    slug: "zenia-sound-fest-motion-billboard",
    title: "Zenia Sound Fest — 3D Motion Identity",
    category: "motion",
    categoryLabel: "Animations & Motion",
    client: "Zenia Live Kenya",
    year: "2024",
    featured: true,
    thumbnail: "/assets/projects/zenia.jpeg",
    images: [
      "/assets/projects/zenia.jpeg",
      "/assets/projects/music-live.jpeg",
      "/assets/projects/youth-vibes.jpeg"
    ],
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    description: "An electrifying multi-format visual campaign for Nairobi's biggest sound and electronic live festival. Developed 3D kinetic typography, animated stage billboard loops, and vibrant social promo sequences with dynamic beat synchronization.",
    tools: ["After Effects", "Cinema 4D", "Photoshop", "Premiere Pro"],
    aspectRatio: "aspect-[4/5]",
    likes: 84,
    comments: [
      { id: "c1", name: "David M.", text: "The motion typography in the trailer was out of this world!", date: "2 days ago" },
      { id: "c2", name: "Grace Wanjiku", text: "Top-tier cinematic energy. BM never misses!", date: "1 week ago" }
    ]
  },
  {
    id: "proj-2",
    slug: "royal-media-services-broadcast-package",
    title: "Royal Media Services — News Motion Package",
    category: "videos",
    categoryLabel: "Video Promo Animation",
    client: "Royal Media Services",
    year: "2024",
    featured: true,
    thumbnail: "/assets/projects/conference-summit.jpeg",
    images: [
      "/assets/projects/conference-summit.jpeg",
      "/assets/projects/paul.jpeg",
      "/assets/projects/event-mb.jpeg"
    ],
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    description: "Complete broadcast graphics overhaul and on-air lower thirds, ident stingers, and title sequences created for Royal Media Services prime programming. Focused on crisp golden metallic reflections and modern TV broadcast fluidity.",
    tools: ["After Effects", "Cinema 4D", "Illustrator", "Audition"],
    aspectRatio: "aspect-[16/9]",
    likes: 128,
    comments: [
      { id: "c3", name: "Kevin Otieno", text: "Proud to see such broadcast quality coming straight out of Kenya.", date: "3 days ago" }
    ]
  },
  {
    id: "proj-3",
    slug: "cleo-haute-couture-campaign",
    title: "Cleo Couture — High Fashion Brand Campaign",
    category: "posters",
    categoryLabel: "Poster & Flyer Design",
    client: "Cleo Fashion Atelier",
    year: "2024",
    featured: true,
    thumbnail: "/assets/projects/cleo.jpeg",
    images: [
      "/assets/projects/cleo.jpeg",
      "/assets/projects/sharon.jpeg",
      "/assets/projects/event-gala.jpeg"
    ],
    videoUrl: null,
    description: "Editorial style poster series and advertising campaign celebrating contemporary African luxury fashion. Custom typography treatment blended with high-contrast studio photography and rich gold foil accents.",
    tools: ["Adobe Photoshop", "Adobe InDesign", "Lightroom"],
    aspectRatio: "aspect-[3/4]",
    likes: 95,
    comments: [
      { id: "c4", name: "Mercy Achieng", text: "Clean layout and the lighting balance is impeccable.", date: "5 days ago" }
    ]
  },
  {
    id: "proj-4",
    slug: "afro-surrealist-digital-photo-manipulation",
    title: "Celestial Echoes — Digital Photo Manipulation",
    category: "branding",
    categoryLabel: "Logos & Branding",
    client: "Gallery Persona",
    year: "2023",
    featured: true,
    thumbnail: "/assets/projects/manipulation.jpeg",
    images: [
      "/assets/projects/manipulation.jpeg",
      "/assets/projects/cleo.jpeg"
    ],
    videoUrl: null,
    description: "Complex surreal digital artwork combining over 40 individual photographic layers, custom atmospheric lighting, volumetric smoke brushes, and golden color grading.",
    tools: ["Adobe Photoshop", "Wacom Intuos", "Topaz Studio"],
    aspectRatio: "aspect-[1/1]",
    likes: 142,
    comments: [
      { id: "c5", name: "Brian K.", text: "The detail on the shadows and highlight rim is masterclass work.", date: "4 days ago" }
    ]
  },
  {
    id: "proj-5",
    slug: "kasyoki-live-in-concert-key-visual",
    title: "Kasyoki Live In Concert — Tour Key Art",
    category: "posters",
    categoryLabel: "Poster & Flyer Design",
    client: "Kasyoki Music Group",
    year: "2024",
    featured: true,
    thumbnail: "/assets/projects/kasyoki.jpeg",
    images: [
      "/assets/projects/kasyoki.jpeg",
      "/assets/projects/music-live.jpeg"
    ],
    videoUrl: null,
    description: "Official tour poster and promotional package for Kasyoki's East Africa concert tour. Designed across arena LED billboards, street banners, VIP passes, and social carousels.",
    tools: ["Adobe Photoshop", "Adobe Illustrator"],
    aspectRatio: "aspect-[3/4]",
    likes: 76,
    comments: [
      { id: "c6", name: "Samson N.", text: "Billboard looked incredible on Uhuru Highway!", date: "1 week ago" }
    ]
  },
  {
    id: "proj-6",
    slug: "joyce-glamour-brand-identity",
    title: "Joyce Beauty & Spa — Luxury Brand Identity",
    category: "branding",
    categoryLabel: "Logos & Branding",
    client: "Joyce Luxe Aesthetics",
    year: "2023",
    featured: true,
    thumbnail: "/assets/projects/joyce.jpeg",
    images: [
      "/assets/projects/joyce.jpeg",
      "/assets/projects/sharon.jpeg"
    ],
    videoUrl: null,
    description: "Complete visual identity package including minimalist emblem monogram, packaging box system, salon window graphics, and luxury price menu booklets stamped in brushed gold foil.",
    tools: ["Adobe Illustrator", "Photoshop", "Dimension 3D"],
    aspectRatio: "aspect-[4/5]",
    likes: 89,
    comments: [
      { id: "c7", name: "Joyce P.", text: "Clients constantly compliment our branding. Thank you Brian!", date: "2 weeks ago" }
    ]
  },
  {
    id: "proj-7",
    slug: "cosmas-gospel-album-art",
    title: "Cosmas Ministry — Sacred Sounds Album Art",
    category: "posters",
    categoryLabel: "Poster & Flyer Design",
    client: "Cosmas Ministries",
    year: "2024",
    featured: false,
    thumbnail: "/assets/projects/cosmas.jpeg",
    images: [
      "/assets/projects/cosmas.jpeg",
      "/assets/projects/church-service.jpeg",
      "/assets/projects/worship-night.jpeg"
    ],
    videoUrl: null,
    description: "Spiritual and uplifting album key visual and launch flyer package. Featuring bespoke golden radiant typography and high-dynamic range composite photography.",
    tools: ["Adobe Photoshop", "Lightroom"],
    aspectRatio: "aspect-[3/4]",
    likes: 67,
    comments: []
  },
  {
    id: "proj-8",
    slug: "lydia-acoustic-night-branding",
    title: "Lydia Sunset Sessions — Live Acoustic Promo",
    category: "posters",
    categoryLabel: "Poster & Flyer Design",
    client: "Sip & Unwind Lounge Nairobi",
    year: "2024",
    featured: false,
    thumbnail: "/assets/projects/lydia.jpeg",
    images: [
      "/assets/projects/lydia.jpeg",
      "/assets/projects/music-live.jpeg"
    ],
    videoUrl: null,
    description: "Warm, intimate flyer and promotional assets for a weekly acoustic live music showcase in Westlands, Nairobi. Warm amber and deep sepia tones evoking candlelit evening vibes.",
    tools: ["Adobe Photoshop", "Illustrator"],
    aspectRatio: "aspect-[3/4]",
    likes: 58,
    comments: []
  },
  {
    id: "proj-9",
    slug: "paul-executive-summit-promo-video",
    title: "Africa Leadership Summit — Kinetic Intro Video",
    category: "videos",
    categoryLabel: "Video Promo Animation",
    client: "Continental Leadership Forum",
    year: "2024",
    featured: false,
    thumbnail: "/assets/projects/paul.jpeg",
    images: [
      "/assets/projects/paul.jpeg",
      "/assets/projects/conference-summit.jpeg"
    ],
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    description: "High-octane opening motion reel and speaker announcement animations rendered for high-resolution stage display screens at the Radisson Blu Nairobi.",
    tools: ["After Effects", "Premiere Pro", "Blender"],
    aspectRatio: "aspect-[16/9]",
    likes: 110,
    comments: []
  },
  {
    id: "proj-10",
    slug: "sharon-haute-branding-identity",
    title: "Sharon Nairobi — Minimalist Apparel Identity",
    category: "branding",
    categoryLabel: "Logos & Branding",
    client: "Sharon Studio",
    year: "2023",
    featured: false,
    thumbnail: "/assets/projects/sharon.jpeg",
    images: [
      "/assets/projects/sharon.jpeg",
      "/assets/projects/cleo.jpeg"
    ],
    videoUrl: null,
    description: "Modern bespoke wordmark and garment tags for an independent ready-to-wear fashion house in Nairobi. Clean typographic hierarchy and sustainable kraft & gold foil printing specs.",
    tools: ["Adobe Illustrator", "Photoshop"],
    aspectRatio: "aspect-[4/5]",
    likes: 73,
    comments: []
  }
];

export const CATEGORIES = [
  { id: "all", label: "All Projects" },
  { id: "posters", label: "Posters & Flyers" },
  { id: "branding", label: "Logos & Branding" },
  { id: "motion", label: "Motion Graphics" },
  { id: "videos", label: "Videos & Promos" },
];
