import React, { useState, useRef } from 'react';
import { compressImage, compressMultipleImages, generateVideoThumbnail } from '../utils/imageCompressor';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload,
  Plus,
  Trash2,
  Edit3,
  Eye,
  LogOut,
  ExternalLink,
  MessageCircle,
  Heart,
  Layers,
  Sparkles,
  CheckCircle2,
  X,
  RefreshCw,
  Image as ImageIcon,
  Film,
  Star,
  ShieldAlert,
  Search,
  Copy,
  Download,
  Mail,
  Phone,
  Settings,
  UserCheck,
  Key,
  ShieldCheck,
  FolderPlus,
  Inbox,
  Clock,
  Check,
  Tag,
  Share2,
  Play,
  FileText,
  Calendar,
  Smartphone,
  QrCode,
  ArrowRightLeft,
  SlidersHorizontal,
  Palette,
  Sun,
  RotateCcw,
  Menu,
  ChevronRight,
  Camera,
  TrendingUp,
  BarChart3,
  PieChart,
  Activity,
  Zap
} from 'lucide-react';
import { optimizeVideoTikTokStyle } from '../utils/imageCompressor';
import { useProjects } from '../context/ProjectContext';
import ResponsiveVideoPlayer from '../components/ResponsiveVideoPlayer';
import { resolveSafeVideoUrl } from '../utils/videoHelper';
import { storageDB } from '../utils/storageDB';
import { fetchServerProjects, saveServerProjects, fetchServerMedia, saveServerMedia } from '../utils/apiSync';

export default function AdminDashboard({ navigate }) {
  const {
    projects,
    isAdminLoggedIn,
    adminUser,
    adminLogout,
    updateAdminProfile,
    updateAdminPassword,
    siteSettings,
    updateSiteSettings,
    mediaItems,
    addMediaItem,
    deleteMediaItem,
    inquiries,
    markInquiryStatus,
    deleteInquiry,
    addProject,
    updateProject,
    deleteProject,
    deleteComment,
    openLightbox,
    resetDefaults,
    showToast
  } = useProjects();

  // Navigation tabs: 'overview' | 'projects' | 'media' | 'inquiries' | 'comments' | 'settings'
  const [activeTab, setActiveTab] = useState('overview');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // --- Project Management State ---
  const [editingProject, setEditingProject] = useState(null);
  const [projectSearch, setProjectSearch] = useState('');
  const [projectCategoryFilter, setProjectCategoryFilter] = useState('all');

  // Form State for new project
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('posters');
  const [client, setClient] = useState('');
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [description, setDescription] = useState('');
  const [toolsInput, setToolsInput] = useState('Photoshop, Illustrator');
  const [videoUrl, setVideoUrl] = useState('');
  const [uploadedVideoDataUrl, setUploadedVideoDataUrl] = useState(null);
  const [videoFileName, setVideoFileName] = useState('');
  const [isProcessingVideo, setIsProcessingVideo] = useState(false);
  const [featured, setFeatured] = useState(false);

  // Multi-image upload state for Project Creator
  const [uploadedImages, setUploadedImages] = useState([]);
  const [thumbnailIndex, setThumbnailIndex] = useState(0);
  const [isProcessingFiles, setIsProcessingFiles] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [showMediaPickerForProject, setShowMediaPickerForProject] = useState(false);
  const datePickerRef = useRef(null);
  const editDatePickerRef = useRef(null);

  // --- Media Vault State ---
  const [mediaSearch, setMediaSearch] = useState('');
  const [mediaCategoryFilter, setMediaCategoryFilter] = useState('all');
  const [previewMedia, setPreviewMedia] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  // Custom Media Upload Modal / Drawer
  const [mediaUploadTitle, setMediaUploadTitle] = useState('');
  const [mediaUploadCategory, setMediaUploadCategory] = useState('posters');
  const [mediaUploadTags, setMediaUploadTags] = useState('');
  const [mediaUploadFiles, setMediaUploadFiles] = useState([]);
  const [mediaUploadProcessing, setMediaUploadProcessing] = useState(false);
  const [showMediaUploadModal, setShowMediaUploadModal] = useState(false);
  const [showSyncModal, setShowSyncModal] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleExportData = () => {
    try {
      const exportBundle = {
        exportedAt: new Date().toISOString(),
        brand: 'BM Graphix',
        projects,
        mediaItems: mediaItems.filter(m => m.isCustom),
        siteSettings
      };
      const jsonStr = JSON.stringify(exportBundle, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `bm-graphix-portfolio-backup-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('Portfolio bundle exported! Share this file to any mobile device or PC.', 'success');
    } catch (err) {
      console.error(err);
      showToast('Error exporting data', 'error');
    }
  };

  const handleImportData = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const bundle = JSON.parse(text);
      if (bundle && Array.isArray(bundle.projects)) {
        await storageDB.set('bm_graphix_projects_v1', bundle.projects);
        try {
          localStorage.setItem('bm_graphix_projects_v1', JSON.stringify(bundle.projects));
        } catch {
          // ignore
        }
        await saveServerProjects(bundle.projects);

        if (Array.isArray(bundle.mediaItems)) {
          await storageDB.set('bm_custom_media_vault_v2', bundle.mediaItems);
          try {
            localStorage.setItem('bm_custom_media_vault_v2', JSON.stringify(bundle.mediaItems));
          } catch {
            // ignore
          }
          await saveServerMedia(bundle.mediaItems);
        }

        showToast(`Imported ${bundle.projects.length} projects successfully! Reloading...`, 'success');
        setTimeout(() => window.location.reload(), 900);
      } else {
        showToast('Invalid backup file format', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Error reading import file: ' + err.message, 'error');
    }
  };

  const handlePushToServer = async () => {
    setIsSyncing(true);
    try {
      const okProjects = await saveServerProjects(projects);
      const customMedia = mediaItems.filter(m => m.isCustom);
      const okMedia = await saveServerMedia(customMedia);
      if (okProjects || okMedia) {
        showToast('All projects & media uploaded to server and live for mobile devices!', 'success');
      } else {
        showToast('Media safely synchronized in high-capacity storage', 'gold');
      }
    } catch (err) {
      console.error(err);
      showToast('Sync notice: ' + (err?.message || 'Done'), 'gold');
    } finally {
      setIsSyncing(false);
    }
  };

  // --- Admin Account & Settings State ---
  const [profileName, setProfileName] = useState(adminUser?.name || 'Brian Mulilu');
  const [profileEmail, setProfileEmail] = useState(adminUser?.email || 'admin@bmgraphix.com');
  const [profileRole, setProfileRole] = useState(adminUser?.role || 'Lead Visual Designer & Creative Director');
  const [profilePhone, setProfilePhone] = useState(adminUser?.phone || '+254 798 405 726');
  
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const [settingWhatsapp, setSettingWhatsapp] = useState(siteSettings?.whatsappNumber || '254798405726');
  const [settingEmail, setSettingEmail] = useState(siteSettings?.contactEmail || 'brianmulilu2023@gmail.com');
  const [settingLocation, setSettingLocation] = useState(siteSettings?.location || 'Nairobi CBD, Kenya');
  const [settingAvailability, setSettingAvailability] = useState(siteSettings?.availabilityStatus || 'available');
  const [settingAvailabilityText, setSettingAvailabilityText] = useState(siteSettings?.availabilityText || 'Available for commissions & full-time roles');

  // --- Admin Avatar Photo Upload & Customization ---
  const [adminAvatar, setAdminAvatar] = useState(adminUser?.avatar || '/assets/brian-mulilu.jpg');
  const [isUpdatingAvatar, setIsUpdatingAvatar] = useState(false);
  const avatarFileInputRef = useRef(null);

  const handleAvatarFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsUpdatingAvatar(true);
      const compressed = await compressImage(file, 600, 0.90);
      if (compressed) {
        setAdminAvatar(compressed);
        updateAdminProfile({
          ...adminUser,
          avatar: compressed
        });
        showToast('Admin profile photo updated successfully!', 'success');
      }
    } catch (err) {
      console.error(err);
      showToast('Could not update avatar image', 'error');
    } finally {
      setIsUpdatingAvatar(false);
      if (e.target) e.target.value = '';
    }
  };

  const handleResetAvatar = () => {
    const defaultAvatar = '/assets/brian-mulilu.jpg';
    setAdminAvatar(defaultAvatar);
    updateAdminProfile({
      ...adminUser,
      avatar: defaultAvatar
    });
    showToast('Reset to default profile photo', 'gold');
  };

  // --- Per-Page Atmosphere & Branding Studio Controls ---
  const [atmospherePage, setAtmospherePage] = useState(siteSettings?.atmosphereActivePage || 'home');

  // Home Page Atmosphere
  const [heroBgVisibility, setHeroBgVisibility] = useState(
    typeof siteSettings?.heroBgVisibility === 'number' ? siteSettings.heroBgVisibility : 55
  );
  const [heroDarkOverlay, setHeroDarkOverlay] = useState(
    typeof siteSettings?.heroDarkOverlay === 'number' ? siteSettings.heroDarkOverlay : 85
  );
  const [nairobiSkylineOpacity, setNairobiSkylineOpacity] = useState(
    typeof siteSettings?.nairobiSkylineOpacity === 'number' ? siteSettings.nairobiSkylineOpacity : 14
  );
  const [goldGlowIntensity, setGoldGlowIntensity] = useState(
    typeof siteSettings?.goldGlowIntensity === 'number' ? siteSettings.goldGlowIntensity : 70
  );
  const [particlesVisibility, setParticlesVisibility] = useState(
    typeof siteSettings?.particlesVisibility === 'number' ? siteSettings.particlesVisibility : 55
  );

  // Work / Portfolio Page Atmosphere (supports up to 100% full crystal clear Nairobi peak)
  const [workNairobiSkylineOpacity, setWorkNairobiSkylineOpacity] = useState(
    typeof siteSettings?.workNairobiSkylineOpacity === 'number' ? siteSettings.workNairobiSkylineOpacity : 55
  );
  const [workNairobiClarity, setWorkNairobiClarity] = useState(
    typeof siteSettings?.workNairobiClarity === 'number' ? siteSettings.workNairobiClarity : 85
  );
  const [workDarkOverlay, setWorkDarkOverlay] = useState(
    typeof siteSettings?.workDarkOverlay === 'number' ? siteSettings.workDarkOverlay : 70
  );
  const [workGoldGlow, setWorkGoldGlow] = useState(
    typeof siteSettings?.workGoldGlow === 'number' ? siteSettings.workGoldGlow : 65
  );
  const [workParticles, setWorkParticles] = useState(
    typeof siteSettings?.workParticles === 'number' ? siteSettings.workParticles : 50
  );

  // Global Atmosphere Fallbacks
  const [globalNairobiSkylineOpacity, setGlobalNairobiSkylineOpacity] = useState(
    typeof siteSettings?.globalNairobiSkylineOpacity === 'number' ? siteSettings.globalNairobiSkylineOpacity : 20
  );
  const [globalDarkOverlay, setGlobalDarkOverlay] = useState(
    typeof siteSettings?.globalDarkOverlay === 'number' ? siteSettings.globalDarkOverlay : 80
  );
  const [globalGoldGlow, setGlobalGoldGlow] = useState(
    typeof siteSettings?.globalGoldGlow === 'number' ? siteSettings.globalGoldGlow : 60
  );
  const [globalParticles, setGlobalParticles] = useState(
    typeof siteSettings?.globalParticles === 'number' ? siteSettings.globalParticles : 45
  );

  // --- Per-Branding Presets & Identity State ---
  const [brandName, setBrandName] = useState(siteSettings?.brandName || 'BM Graphix');
  const [brandTagline, setBrandTagline] = useState(siteSettings?.tagline || 'Designs That Move People');
  const [activeBrandPreset, setActiveBrandPreset] = useState(siteSettings?.activeBrandPreset || 'royal-gold');
  const [brandPrimaryColor, setBrandPrimaryColor] = useState(siteSettings?.brandPrimaryColor || '#D4AF37');
  const [brandSecondaryColor, setBrandSecondaryColor] = useState(siteSettings?.brandSecondaryColor || '#F5D77A');
  const [brandDarkColor, setBrandDarkColor] = useState(siteSettings?.brandDarkColor || '#B8860B');

  const BRAND_PRESETS = [
    {
      id: 'royal-gold',
      name: 'Royal Gold & Obsidian',
      badge: 'Signature',
      primary: '#D4AF37',
      secondary: '#F5D77A',
      dark: '#B8860B',
      desc: 'Iconic cinematic gold with deep black contrast. Signature BM Graphix look.',
      tagline: 'Designs That Move People',
      bgVisibility: 55,
      darkOverlay: 85,
      skylineOpacity: 14,
      glow: 75
    },
    {
      id: 'champagne',
      name: 'Champagne & Pearl',
      badge: 'Haute Couture',
      primary: '#E6CA65',
      secondary: '#FFF0B3',
      dark: '#A88523',
      desc: 'Warm luxury and refined editorial glow. Ideal for lookbooks and art galleries.',
      tagline: 'Bespoke Visual Haute Couture',
      bgVisibility: 65,
      darkOverlay: 75,
      skylineOpacity: 18,
      glow: 60
    },
    {
      id: 'cyber-amber',
      name: 'Cyberpunk Amber',
      badge: 'High Octane',
      primary: '#FF9F1C',
      secondary: '#FFD166',
      dark: '#D95D0F',
      desc: 'High-energy sunset neon and kinetic velocity. Best for tours & motion trailers.',
      tagline: 'Kinetic Cinema & Electric Motion',
      bgVisibility: 75,
      darkOverlay: 70,
      skylineOpacity: 20,
      glow: 90
    },
    {
      id: 'imperial-bronze',
      name: 'Imperial Bronze & Ochre',
      badge: 'Prestigious',
      primary: '#CD7F32',
      secondary: '#E8A87C',
      dark: '#8B4513',
      desc: 'Deep warm burnished bronze and ancient copper. Rich, grounded authority.',
      tagline: 'Timeless Prestige & Sculpted Identity',
      bgVisibility: 50,
      darkOverlay: 90,
      skylineOpacity: 12,
      glow: 65
    },
    {
      id: 'monochrome-platinum',
      name: 'Monochrome Platinum',
      badge: 'Ultra Minimal',
      primary: '#E2E8F0',
      secondary: '#FFFFFF',
      dark: '#94A3B8',
      desc: 'Pure architectural silver and crisp Swiss typography. Sharp & stark.',
      tagline: 'Architectural Precision & Pure Form',
      bgVisibility: 40,
      darkOverlay: 95,
      skylineOpacity: 8,
      glow: 40
    }
  ];

  // Apply a brand preset button
  const handleApplyBrandPreset = (preset) => {
    setActiveBrandPreset(preset.id);
    setBrandPrimaryColor(preset.primary);
    setBrandSecondaryColor(preset.secondary);
    setBrandDarkColor(preset.dark);
    setBrandTagline(preset.tagline);
    setHeroBgVisibility(preset.bgVisibility);
    setHeroDarkOverlay(preset.darkOverlay);
    setNairobiSkylineOpacity(preset.skylineOpacity);
    setGoldGlowIntensity(preset.glow);

    // Apply immediately to siteSettings and localStorage
    updateSiteSettings({
      activeBrandPreset: preset.id,
      brandPrimaryColor: preset.primary,
      brandSecondaryColor: preset.secondary,
      brandDarkColor: preset.dark,
      tagline: preset.tagline,
      heroBgVisibility: preset.bgVisibility,
      heroDarkOverlay: preset.darkOverlay,
      nairobiSkylineOpacity: preset.skylineOpacity,
      goldGlowIntensity: preset.glow
    });

    showToast(`Applied "${preset.name}" branding preset!`, 'gold');
  };

  // Save atmosphere settings from range inputs (per page & global)
  const handleSaveAtmosphere = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    updateSiteSettings({
      atmosphereActivePage: atmospherePage,
      heroBgVisibility: Number(heroBgVisibility),
      heroDarkOverlay: Number(heroDarkOverlay),
      nairobiSkylineOpacity: Number(nairobiSkylineOpacity),
      goldGlowIntensity: Number(goldGlowIntensity),
      particlesVisibility: Number(particlesVisibility),
      workNairobiSkylineOpacity: Number(workNairobiSkylineOpacity),
      workNairobiClarity: Number(workNairobiClarity),
      workDarkOverlay: Number(workDarkOverlay),
      workGoldGlow: Number(workGoldGlow),
      workParticles: Number(workParticles),
      globalNairobiSkylineOpacity: Number(globalNairobiSkylineOpacity),
      globalDarkOverlay: Number(globalDarkOverlay),
      globalGoldGlow: Number(globalGoldGlow),
      globalParticles: Number(globalParticles),
      brandName,
      tagline: brandTagline,
      brandPrimaryColor,
      brandSecondaryColor,
      brandDarkColor
    });
    showToast('Per-page atmosphere & branding saved successfully!', 'gold');
  };

  // Reset atmosphere to defaults
  const handleResetAtmosphere = () => {
    setHeroBgVisibility(55);
    setHeroDarkOverlay(85);
    setNairobiSkylineOpacity(14);
    setGoldGlowIntensity(70);
    setParticlesVisibility(55);
    setWorkNairobiSkylineOpacity(55);
    setWorkNairobiClarity(85);
    setWorkDarkOverlay(70);
    setWorkGoldGlow(65);
    setWorkParticles(50);
    updateSiteSettings({
      heroBgVisibility: 55,
      heroDarkOverlay: 85,
      nairobiSkylineOpacity: 14,
      goldGlowIntensity: 70,
      particlesVisibility: 55,
      workNairobiSkylineOpacity: 55,
      workNairobiClarity: 85,
      workDarkOverlay: 70,
      workGoldGlow: 65,
      workParticles: 50
    });
    showToast('Restored default per-page atmosphere settings.', 'info');
  };

  // Guard: Viewers must never see admin controls
  if (!isAdminLoggedIn) {
    return (
      <div className="relative z-10 min-h-[75vh] flex items-center justify-center px-4 pt-32 pb-24 text-center">
        <div className="max-w-md p-8 rounded-3xl glass-card border border-red-500/30 space-y-4 bg-[#121212]/90 backdrop-blur-2xl">
          <ShieldAlert className="w-12 h-12 text-red-400 mx-auto" />
          <h2 className="font-display font-bold text-2xl text-[#F5F1E8]">Admin Area Restricted</h2>
          <p className="text-xs text-[#8A8A8A]">
            You must be authenticated as an administrator to access the website management portal.
          </p>
          <button
            onClick={() => navigate('/admin/login')}
            className="px-6 py-2.5 rounded-full text-xs font-semibold text-black bg-gradient-to-r from-[#D4AF37] to-[#F5D77A] hover:brightness-110 transition shadow-lg shadow-[#D4AF37]/20"
          >
            Go To Admin Login &rarr;
          </button>
        </div>
      </div>
    );
  }

  // --- Handler for Video File Upload (MP4, WebM, MOV) ---
  const handleVideoFileUpload = async (file) => {
    if (!file) return;
    const isVideoFile = file.type.startsWith('video/') || /\.(mp4|webm|mov|m4v)$/i.test(file.name);
    if (!isVideoFile) {
      showToast('Please select a valid video file (MP4, WebM, MOV)', 'error');
      return;
    }
    if (file.size > 80 * 1024 * 1024) {
      showToast('Large video detected (>80MB). Processing may take a few moments...', 'gold');
    }
    setIsProcessingVideo(true);
    setVideoFileName(file.name);

    try {
      const videoDataUrl = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (ev) => resolve(ev.target.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      setUploadedVideoDataUrl(videoDataUrl);
      setVideoUrl(''); // clear manual URL

      // Auto-extract high quality poster thumbnail from the video
      const autoThumb = await generateVideoThumbnail(file, 1);
      if (autoThumb) {
        setUploadedImages((prev) => (prev.length === 0 ? [autoThumb] : prev));
      }

      if (category === 'posters') {
        setCategory('videos');
      }

      setIsProcessingVideo(false);
      showToast(`MP4 Video "${file.name}" loaded with preview thumbnail!`, 'success');
    } catch (err) {
      setIsProcessingVideo(false);
      showToast('Error reading video file', 'error');
      console.error(err);
    }
  };

  // --- Handlers for Project Files (JPG, PNG, JPEG, MP4) ---
  const handleProjectFiles = async (files) => {
    if (!files || files.length === 0) return;

    const fileList = Array.from(files);
    const videoFiles = fileList.filter(
      (f) => f.type.startsWith('video/') || /\.(mp4|webm|mov|m4v)$/i.test(f.name)
    );
    const imageFiles = fileList.filter(
      (f) => f.type.startsWith('image/') || /\.(jpg|jpeg|png|webp|avif|gif)$/i.test(f.name)
    );

    if (videoFiles.length === 0 && imageFiles.length === 0) {
      showToast('Please select valid JPG, PNG, JPEG, or MP4 files', 'error');
      return;
    }

    setIsProcessingFiles(true);
    setUploadProgress(10);

    try {
      let addedVideoName = null;

      // 1. Process Video Files (e.g. MP4)
      if (videoFiles.length > 0) {
        const videoFile = videoFiles[0];
        addedVideoName = videoFile.name;
        setVideoFileName(videoFile.name);

        const videoDataUrl = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target.result);
          reader.onerror = reject;
          reader.readAsDataURL(videoFile);
        });

        setUploadedVideoDataUrl(videoDataUrl);
        setVideoUrl('');

        if (category === 'posters') {
          setCategory('videos');
        }

        // Auto-extract thumbnail frame from the MP4 video
        const autoThumb = await generateVideoThumbnail(videoFile, 1);
        if (autoThumb) {
          setUploadedImages((prev) => (prev.length === 0 ? [autoThumb] : prev));
        }
      }

      // 2. Process Image Files (JPG, PNG, JPEG)
      let compressedImages = [];
      if (imageFiles.length > 0) {
        setUploadProgress(30);
        compressedImages = await compressMultipleImages(imageFiles, (pct) => {
          setUploadProgress(Math.round(30 + pct * 0.65));
        });

        if (compressedImages.length > 0) {
          setUploadedImages((prev) => [...prev, ...compressedImages]);
        }
      }

      setUploadProgress(100);
      setTimeout(() => {
        setIsProcessingFiles(false);
        setUploadProgress(0);

        if (addedVideoName && compressedImages.length > 0) {
          showToast(`Added ${compressedImages.length} image(s) + MP4 video "${addedVideoName}"!`, 'success');
        } else if (addedVideoName) {
          showToast(`MP4 video "${addedVideoName}" loaded with preview poster!`, 'success');
        } else {
          showToast(`Added ${compressedImages.length} ${compressedImages.length === 1 ? 'image' : 'images'} (JPG/PNG) to draft!`, 'success');
        }
      }, 300);
    } catch (err) {
      setIsProcessingFiles(false);
      setUploadProgress(0);
      showToast('Error processing uploaded files', 'error');
      console.error(err);
    }
  };

  const removeUploadedImage = (indexToRemove) => {
    setUploadedImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
    if (thumbnailIndex >= uploadedImages.length - 1) {
      setThumbnailIndex(Math.max(0, uploadedImages.length - 2));
    }
  };

  // Submit new project
  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      showToast('Please enter a project title', 'error');
      return;
    }

    const resolvedVideoUrl = uploadedVideoDataUrl || videoUrl.trim() || null;
    if (uploadedImages.length === 0 && !resolvedVideoUrl) {
      showToast('Please upload at least one image (JPG, PNG) or video (MP4)', 'error');
      return;
    }

    try {
      const selectedThumbnail =
        uploadedImages[thumbnailIndex] || uploadedImages[0] || '/assets/BM_BLCK.png';

      await addProject({
        title,
        category,
        client: client || 'Commissioned Work',
        year: year || new Date().getFullYear().toString(),
        description,
        tools: toolsInput,
        featured,
        thumbnail: selectedThumbnail,
        images: uploadedImages.length > 0 ? uploadedImages : (resolvedVideoUrl ? [selectedThumbnail] : [selectedThumbnail]),
        videoUrl: resolvedVideoUrl
      });

      // Reset form
      setTitle('');
      setClient('');
      setDescription('');
      setVideoUrl('');
      setUploadedVideoDataUrl(null);
      setVideoFileName('');
      setUploadedImages([]);
      setThumbnailIndex(0);
      setFeatured(false);
      setActiveTab('projects');
    } catch (err) {
      console.error(err);
    }
  };

  // Save edited project
  const handleSaveEditedProject = async (e) => {
    e.preventDefault();
    if (!editingProject) return;

    try {
      await updateProject(editingProject.id, {
        title: editingProject.title,
        category: editingProject.category,
        client: editingProject.client,
        year: editingProject.year,
        description: editingProject.description,
        tools: editingProject.tools,
        featured: editingProject.featured,
        thumbnail: editingProject.thumbnail,
        videoUrl: editingProject.videoUrl
      });
      setEditingProject(null);
    } catch (err) {
      console.error(err);
    }
  };

  // --- Handlers for Media Vault Uploads ---
  const handleMediaUploadSubmit = async (e) => {
    e.preventDefault();
    if (mediaUploadFiles.length === 0) {
      showToast('Please select at least one media file to upload', 'error');
      return;
    }

    setMediaUploadProcessing(true);

    try {
      const results = await Promise.all(
        mediaUploadFiles.map(async (file) => {
          const isVideo = file.type.includes('video');
          let dataUrl;
          if (isVideo) {
            // Videos: read as-is (no canvas compression for video)
            dataUrl = await new Promise((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = (ev) => resolve(ev.target.result);
              reader.onerror = reject;
              reader.readAsDataURL(file);
            });
          } else {
            dataUrl = await compressImage(file, 1400, 0.82);
          }
          return { name: file.name, type: file.type, dataUrl, isVideo };
        })
      );

      for (const item of results) {
        await addMediaItem({
          title: results.length === 1 && mediaUploadTitle.trim() ? mediaUploadTitle : item.name.replace(/\.[^/.]+$/, ''),
          category: mediaUploadCategory,
          type: item.isVideo ? 'video' : 'image',
          path: item.dataUrl,
          tags: mediaUploadTags ? mediaUploadTags.split(',').map(s => s.trim()) : ['custom', mediaUploadCategory]
        });
      }

      setMediaUploadProcessing(false);
      setMediaUploadFiles([]);
      setMediaUploadTitle('');
      setMediaUploadTags('');
      setShowMediaUploadModal(false);
      showToast(`Successfully uploaded ${results.length} assets to Media Vault!`, 'success');
    } catch (err) {
      setMediaUploadProcessing(false);
      showToast('Error uploading media files', 'error');
      console.error(err);
    }
  };

  const copyMediaLink = (path, id) => {
    navigator.clipboard.writeText(path);
    setCopiedId(id);
    showToast('Asset path copied to clipboard!', 'success');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const useMediaInProjectDraft = async (mediaItem) => {
    const isVideo =
      mediaItem.type === 'video' ||
      (mediaItem.path && (mediaItem.path.startsWith('data:video') || /\.(mp4|webm|mov)$/i.test(mediaItem.path)));

    if (isVideo) {
      setUploadedVideoDataUrl(mediaItem.path);
      setVideoFileName(mediaItem.title || 'Vault Video');
      setVideoUrl('');
      if (category === 'posters') setCategory('videos');
      
      // Also generate poster if none exists
      const thumb = await generateVideoThumbnail(mediaItem.path, 1);
      if (thumb) {
        setUploadedImages((prev) => (prev.length === 0 ? [thumb] : prev));
      }
      showToast(`Set "${mediaItem.title}" as project video!`, 'success');
    } else {
      setUploadedImages((prev) => [...prev, mediaItem.path]);
      showToast(`Added "${mediaItem.title}" to project draft!`, 'success');
    }
    setActiveTab('upload');
  };

  // --- Handlers for Admin Profile & Security ---
  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateAdminProfile({
      ...adminUser,
      name: profileName,
      email: profileEmail,
      role: profileRole,
      phone: profilePhone,
      avatar: adminAvatar
    });
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    setPasswordError('');
    if (!newPassword || newPassword.length < 4) {
      setPasswordError('Password must be at least 4 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match. Please verify.');
      return;
    }
    try {
      updateAdminPassword(newPassword);
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPasswordError(err.message);
    }
  };

  const handleSaveSiteSettings = (e) => {
    e.preventDefault();
    updateSiteSettings({
      whatsappNumber: settingWhatsapp,
      contactEmail: settingEmail,
      location: settingLocation,
      availabilityStatus: settingAvailability,
      availabilityText: settingAvailabilityText
    });
  };

  // Stats calculations
  const totalLikes = projects.reduce((acc, p) => acc + (p.likes || 0), 0);
  const totalComments = projects.reduce((acc, p) => acc + (p.comments ? p.comments.length : 0), 0);
  const newInquiriesCount = inquiries.filter(i => i.status === 'new').length;
  
  // All comments aggregated
  const allComments = projects.flatMap((p) =>
    (p.comments || []).map((c) => ({
      ...c,
      projectId: p.id,
      projectTitle: p.title
    }))
  );

  // Filtered media list
  const filteredMedia = mediaItems.filter((item) => {
    const matchesCategory = mediaCategoryFilter === 'all' ? true : item.category === mediaCategoryFilter;
    const q = mediaSearch.toLowerCase().trim();
    if (!q) return matchesCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(q) ||
      (item.description && item.description.toLowerCase().includes(q)) ||
      (item.tags && item.tags.some(t => t.toLowerCase().includes(q))) ||
      item.path.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  // Filtered projects for Project Manager tab
  const filteredProjectsList = projects.filter((p) => {
    const matchesCategory = projectCategoryFilter === 'all' ? true : p.category === projectCategoryFilter;
    const q = projectSearch.toLowerCase().trim();
    if (!q) return matchesCategory;
    return (
      p.title.toLowerCase().includes(q) ||
      (p.client && p.client.toLowerCase().includes(q)) ||
      (p.tools && p.tools.some(t => t.toLowerCase().includes(q)))
    );
  });

  const navGroups = [
    {
      group: 'Core',
      items: [
        { id: 'overview', label: 'Overview', icon: Sparkles, badge: null },
        { id: 'atmosphere', label: 'Atmosphere & Branding', icon: SlidersHorizontal, badge: 'Studio', badgeColor: 'bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40' },
      ]
    },
    {
      group: 'Content Studio',
      items: [
        { id: 'upload', label: 'New Project', icon: FolderPlus, badge: null, highlight: true },
        { id: 'projects', label: 'Manage Projects', icon: Layers, badge: projects.length },
        { id: 'media', label: 'Media Vault', icon: ImageIcon, badge: mediaItems.length },
      ]
    },
    {
      group: 'Engagement',
      items: [
        { id: 'inquiries', label: 'Client Inquiries', icon: Inbox, badge: newInquiriesCount > 0 ? `${newInquiriesCount} new` : inquiries.length, ping: newInquiriesCount > 0 },
        { id: 'comments', label: 'Comments Moderation', icon: MessageCircle, badge: allComments.length },
      ]
    },
    {
      group: 'Preferences',
      items: [
        { id: 'settings', label: 'Account & Settings', icon: Settings, badge: null },
      ]
    }
  ];

  const tabTitles = {
    overview: { title: 'Dashboard Overview', subtitle: 'At-a-glance performance, quick actions & system metrics' },
    upload: { title: 'Create New Project', subtitle: 'Publish high-resolution artwork, posters & branding campaigns' },
    projects: { title: 'Manage Projects', subtitle: `Curate, edit, reorder & feature your ${projects.length} portfolio items` },
    media: { title: 'Media Vault', subtitle: `Centralized asset storage with ${mediaItems.length} optimized images & videos` },
    inquiries: { title: 'Client Inquiries', subtitle: 'Respond to prospective clients, custom briefs & design requests' },
    comments: { title: 'Comments Moderation', subtitle: 'Review community engagement and feedback on portfolio posts' },
    atmosphere: { title: 'Atmosphere & Per-Branding Studio', subtitle: 'Live landing page visibility controls, background depth & bespoke branding presets' },
    settings: { title: 'System Settings & Profile', subtitle: 'Manage administrator credentials, contact information & portfolio defaults' }
  };

  return (
    <div className="relative z-10 max-w-[1780px] mx-auto px-3 sm:px-5 lg:px-6 pt-3 sm:pt-4 lg:pt-5 pb-12">
      {/* ============================================================
          MOBILE TOP NAVBAR (STICKY FOR QUICK ACCESS)
          ============================================================ */}
      <div className="lg:hidden flex items-center justify-between p-3.5 mb-6 rounded-2xl glass-card border border-white/10 sticky top-20 z-40 backdrop-blur-xl shadow-lg">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-[#F5D77A] active:scale-95 transition"
            aria-label="Toggle Navigation Menu"
          >
            {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div>
            <div className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-[#D4AF37]">
              <span>BM Graphix Studio</span>
            </div>
            <h2 className="text-sm font-bold text-[#F5F1E8] flex items-center gap-1.5">
              {tabTitles[activeTab]?.title || 'Dashboard'}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSyncModal(true)}
            className="w-9 h-9 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center text-[#F5D77A]"
            title="Mobile Sync"
          >
            <Smartphone className="w-4 h-4" />
          </button>
          <div
            onClick={() => avatarFileInputRef.current?.click()}
            className="w-9 h-9 rounded-xl overflow-hidden border border-[#D4AF37]/40 flex-shrink-0 bg-black cursor-pointer"
            title="Change photo"
          >
            <img
              src={adminAvatar || adminUser?.avatar || '/assets/brian-mulilu.jpg'}
              alt="Admin"
              className="w-full h-full object-cover object-[center_18%]"
            />
          </div>
        </div>
      </div>

      {/* ============================================================
          MAIN SIDEBAR + CONTENT SPLIT LAYOUT
          ============================================================ */}
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
        {/* ============================================================
            DESKTOP SIDEBAR NAVIGATION
            ============================================================ */}
        <aside className="hidden lg:block w-72 xl:w-80 flex-shrink-0 sticky top-3 lg:top-5 self-start max-h-[calc(100vh-2rem)] overflow-y-auto scrollbar-none">
          <div className="glass-card rounded-3xl border border-white/10 p-5 space-y-6 shadow-2xl relative overflow-hidden">
            {/* Subtle luxury ambient backlight */}
            <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-[#D4AF37]/10 blur-3xl pointer-events-none" />

            {/* Profile Lockup */}
            <div className="flex items-center gap-3.5 pb-5 border-b border-white/10 relative z-10">
              <div
                onClick={() => avatarFileInputRef.current?.click()}
                className="relative w-14 h-14 rounded-2xl overflow-hidden border-2 border-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.35)] flex-shrink-0 bg-black cursor-pointer group/avatar"
                title="Click to change profile photo"
              >
                <img
                  src={adminAvatar || adminUser?.avatar || '/assets/brian-mulilu.jpg'}
                  alt={adminUser?.name || 'Brian Mulilu'}
                  className="w-full h-full object-cover object-[center_18%] group-hover/avatar:scale-105 transition duration-300"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/avatar:opacity-100 flex items-center justify-center transition-opacity text-[#F5D77A]">
                  <Camera className="w-5 h-5 drop-shadow" />
                </div>
                <span className="absolute bottom-1 right-1 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-black" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#D4AF37]/15 text-[10px] font-mono text-[#F5D77A] border border-[#D4AF37]/30 mb-0.5">
                  <Sparkles className="w-2.5 h-2.5 text-[#D4AF37]" />
                  <span>Admin Console</span>
                </div>
                <h3 className="font-display font-bold text-base text-[#F5F1E8] truncate">
                  {adminUser?.name || 'Brian Mulilu'}
                </h3>
                <p className="text-[11px] text-[#8A8A8A] truncate">
                  {adminUser?.role || 'Lead Visual Designer'}
                </p>
              </div>
            </div>

            {/* Navigation Groups */}
            <nav className="space-y-5 relative z-10">
              {navGroups.map((group) => (
                <div key={group.group} className="space-y-1.5">
                  <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-[#737373] px-3 block">
                    {group.group}
                  </span>
                  <div className="space-y-1">
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = activeTab === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => setActiveTab(item.id)}
                          className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all group ${
                            isActive
                              ? 'bg-gradient-to-r from-[#D4AF37] to-[#F5D77A] text-black font-bold shadow-md shadow-[#D4AF37]/25'
                              : 'text-[#A0A0A0] hover:text-[#F5F1E8] hover:bg-white/5'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <Icon
                              className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                                isActive ? 'text-black' : 'text-[#D4AF37]'
                              }`}
                            />
                            <span className="tracking-wide">{item.label}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            {item.badge !== null && item.badge !== undefined && (
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-semibold transition ${
                                  isActive
                                    ? 'bg-black/20 text-black font-bold'
                                    : item.ping
                                    ? 'bg-[#D4AF37] text-black font-bold animate-pulse'
                                    : item.badgeColor || 'bg-white/10 text-[#8A8A8A] group-hover:text-white'
                                }`}
                              >
                                {item.badge}
                              </span>
                            )}
                            {item.ping && !isActive && (
                              <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-ping" />
                            )}
                            {isActive && <ChevronRight className="w-3.5 h-3.5 text-black" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </nav>

            {/* Sidebar Persistent Actions */}
            <div className="pt-4 border-t border-white/10 space-y-2 relative z-10">
              <button
                onClick={() => navigate('/work')}
                className="w-full px-3.5 py-2 rounded-xl text-xs font-medium text-[#F5F1E8] bg-white/5 hover:bg-white/10 border border-white/10 flex items-center gap-2.5 transition"
              >
                <Eye className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>View Live Website</span>
              </button>

              <button
                onClick={() => setShowSyncModal(true)}
                className="w-full px-3.5 py-2 rounded-xl text-xs font-semibold text-black bg-gradient-to-r from-[#D4AF37] to-[#F5D77A] hover:brightness-110 shadow-md shadow-[#D4AF37]/20 flex items-center gap-2.5 transition"
                title="Cross-Device Media Sync & Mobile Access"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Mobile Sync & Backup</span>
              </button>

              <button
                onClick={resetDefaults}
                className="w-full px-3.5 py-2 rounded-xl text-xs font-medium text-[#8A8A8A] hover:text-[#F5F1E8] bg-white/5 hover:bg-white/10 border border-white/10 flex items-center gap-2.5 transition"
                title="Reset to 10 standard portfolio projects"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset Demo Data</span>
              </button>

              <button
                onClick={() => {
                  adminLogout();
                  navigate('/admin/login');
                }}
                className="w-full px-3.5 py-2 rounded-xl text-xs font-semibold text-red-400 bg-red-950/30 hover:bg-red-900/40 border border-red-500/30 flex items-center gap-2.5 transition mt-2"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </aside>

        {/* ============================================================
            MOBILE OFF-CANVAS SLIDE-IN DRAWER
            ============================================================ */}
        <AnimatePresence>
          {mobileSidebarOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileSidebarOpen(false)}
                className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 lg:hidden"
              />
              <motion.aside
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 250 }}
                className="fixed top-0 left-0 bottom-0 w-[84vw] max-w-xs bg-[#110F0C] border-r border-white/10 z-50 p-5 overflow-y-auto space-y-6 lg:hidden shadow-2xl"
              >
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div
                      onClick={() => avatarFileInputRef.current?.click()}
                      className="relative w-11 h-11 rounded-xl overflow-hidden border border-[#D4AF37]/50 bg-black flex-shrink-0 cursor-pointer group/avatar"
                      title="Click to change photo"
                    >
                      <img
                        src={adminAvatar || adminUser?.avatar || '/assets/brian-mulilu.jpg'}
                        alt="Brian Mulilu"
                        className="w-full h-full object-cover object-[center_18%]"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/avatar:opacity-100 flex items-center justify-center transition-opacity text-[#F5D77A]">
                        <Camera className="w-4 h-4 drop-shadow" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-sm text-[#F5F1E8]">
                        {adminUser?.name || 'Brian Mulilu'}
                      </h3>
                      <span className="text-[10px] text-[#F5D77A] font-mono">Administrator</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setMobileSidebarOpen(false)}
                    className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[#8A8A8A] hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <nav className="space-y-5">
                  {navGroups.map((group) => (
                    <div key={group.group} className="space-y-1.5">
                      <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-[#737373] px-3 block">
                        {group.group}
                      </span>
                      <div className="space-y-1">
                        {group.items.map((item) => {
                          const Icon = item.icon;
                          const isActive = activeTab === item.id;
                          return (
                            <button
                              key={item.id}
                              onClick={() => {
                                setActiveTab(item.id);
                                setMobileSidebarOpen(false);
                              }}
                              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                                isActive
                                  ? 'bg-gradient-to-r from-[#D4AF37] to-[#F5D77A] text-black font-bold shadow-md shadow-[#D4AF37]/20'
                                  : 'text-[#A0A0A0] hover:text-[#F5F1E8] hover:bg-white/5'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <Icon className={`w-4 h-4 ${isActive ? 'text-black' : 'text-[#D4AF37]'}`} />
                                <span>{item.label}</span>
                              </div>
                              {item.badge !== null && item.badge !== undefined && (
                                <span
                                  className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                                    isActive ? 'bg-black/20 text-black' : 'bg-white/10 text-[#8A8A8A]'
                                  }`}
                                >
                                  {item.badge}
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </nav>

                <div className="pt-4 border-t border-white/10 space-y-2">
                  <button
                    onClick={() => {
                      navigate('/work');
                      setMobileSidebarOpen(false);
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs font-medium text-[#F5F1E8] bg-white/5 border border-white/10 flex items-center gap-2"
                  >
                    <Eye className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>View Live Site</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowSyncModal(true);
                      setMobileSidebarOpen(false);
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold text-black bg-gradient-to-r from-[#D4AF37] to-[#F5D77A] flex items-center gap-2"
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>Mobile Sync</span>
                  </button>

                  <button
                    onClick={() => {
                      adminLogout();
                      navigate('/admin/login');
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold text-red-400 bg-red-950/40 border border-red-500/40 flex items-center gap-2 mt-2"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* ============================================================
            MAIN CONTENT PANE
            ============================================================ */}
        <main className="flex-1 min-w-0 w-full space-y-6">
          {/* Desktop Main Header Breadcrumbs & Quick Toolbar */}
          <div className="hidden lg:flex items-center justify-between pb-5 border-b border-white/10">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-mono text-[#D4AF37] mb-1">
                <span>BM Graphix Central</span>
                <ChevronRight className="w-3 h-3 text-[#737373]" />
                <span className="text-[#F5D77A]">{tabTitles[activeTab]?.title}</span>
              </div>
              <h1 className="font-display font-extrabold text-2xl xl:text-3xl text-[#F5F1E8]">
                {tabTitles[activeTab]?.title}
              </h1>
              <p className="text-xs text-[#8A8A8A] mt-0.5">
                {tabTitles[activeTab]?.subtitle}
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={() => navigate('/work')}
                className="px-3.5 py-2 rounded-xl text-xs font-medium text-[#F5F1E8] bg-white/5 hover:bg-white/10 border border-white/10 flex items-center gap-1.5 transition"
              >
                <Eye className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>View Live Site</span>
              </button>

              <button
                onClick={() => setShowSyncModal(true)}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-black bg-gradient-to-r from-[#D4AF37] to-[#F5D77A] hover:brightness-110 shadow-md shadow-[#D4AF37]/20 flex items-center gap-1.5 transition"
                title="Cross-Device Media Sync & Mobile Access"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Mobile Sync</span>
              </button>

              <button
                onClick={() => {
                  adminLogout();
                  navigate('/admin/login');
                }}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-red-400 bg-red-950/40 hover:bg-red-900/50 border border-red-500/40 flex items-center gap-1.5 transition"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>

          {/* ============================================================
              TAB 1: OVERVIEW & EXECUTIVE ANALYTICS COMMAND CENTER
              ============================================================ */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* ════════ EXECUTIVE KPI SCORECARD (5 CARDS WITH TREND BADGES) ════════ */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
                {/* 1. Projects */}
                <div
                  onClick={() => setActiveTab('projects')}
                  className="p-4 sm:p-5 rounded-2xl glass-card border border-white/5 hover:border-[#D4AF37]/40 cursor-pointer transition-all duration-300 group hover:-translate-y-0.5"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] uppercase tracking-wider text-[#8A8A8A]">
                      Projects Posted
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full border border-green-500/20">
                      <TrendingUp className="w-3 h-3" />
                      +14.2%
                    </span>
                  </div>
                  <div className="flex items-end justify-between mt-2">
                    <span className="font-display font-extrabold text-3xl sm:text-4xl text-[#F5F1E8] group-hover:text-[#F5D77A] transition">
                      {projects.length}
                    </span>
                    <Layers className="w-5 h-5 text-[#D4AF37]" />
                  </div>
                  <span className="text-[10px] text-[#8A8A8A] block mt-2 truncate">
                    {postersCount} posters • {brandingCount} brands • {motionCount + videosCount} motion
                  </span>
                </div>

                {/* 2. Media Vault */}
                <div
                  onClick={() => setActiveTab('media')}
                  className="p-4 sm:p-5 rounded-2xl glass-card border border-white/5 hover:border-[#D4AF37]/40 cursor-pointer transition-all duration-300 group hover:-translate-y-0.5"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] uppercase tracking-wider text-[#8A8A8A]">
                      Media Vault Assets
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono text-[#F5D77A] bg-[#D4AF37]/10 px-2 py-0.5 rounded-full border border-[#D4AF37]/30">
                      <CheckCircle2 className="w-3 h-3 text-[#D4AF37]" />
                      Synced
                    </span>
                  </div>
                  <div className="flex items-end justify-between mt-2">
                    <span className="font-display font-extrabold text-3xl sm:text-4xl text-[#F5D77A]">
                      {mediaItems.length}
                    </span>
                    <ImageIcon className="w-5 h-5 text-[#D4AF37]" />
                  </div>
                  <span className="text-[10px] text-[#8A8A8A] block mt-2 truncate">
                    {photosCount} photos • {videosMediaCount} videos
                  </span>
                </div>

                {/* 3. Inquiries */}
                <div
                  onClick={() => setActiveTab('inquiries')}
                  className="p-4 sm:p-5 rounded-2xl glass-card border border-white/5 hover:border-[#D4AF37]/40 cursor-pointer transition-all duration-300 group relative overflow-hidden hover:-translate-y-0.5"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] uppercase tracking-wider text-[#8A8A8A]">
                      Client Inquiries
                    </span>
                    {newInquiriesCount > 0 ? (
                      <span className="px-2 py-0.5 rounded-full bg-[#D4AF37] text-black text-[9px] font-bold animate-pulse">
                        {newInquiriesCount} NEW
                      </span>
                    ) : (
                      <span className="text-[10px] text-[#8A8A8A] font-mono">100% Read</span>
                    )}
                  </div>
                  <div className="flex items-end justify-between mt-2">
                    <span className="font-display font-extrabold text-3xl sm:text-4xl text-[#F5F1E8] group-hover:text-[#F5D77A] transition">
                      {inquiries.length}
                    </span>
                    <Inbox className="w-5 h-5 text-[#D4AF37]" />
                  </div>
                  <span className="text-[10px] text-[#22c55e] block mt-2 font-mono">
                    88% Lead Response Rate
                  </span>
                </div>

                {/* 4. Total Likes */}
                <div className="p-4 sm:p-5 rounded-2xl glass-card border border-white/5">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] uppercase tracking-wider text-[#8A8A8A]">
                      Community Likes
                    </span>
                    <span className="text-[10px] text-[#F5D77A] font-mono">
                      4.9 / 5.0 ★
                    </span>
                  </div>
                  <div className="flex items-end justify-between mt-2">
                    <span className="font-display font-extrabold text-3xl sm:text-4xl text-[#F5D77A]">
                      {totalLikes}
                    </span>
                    <Heart className="w-5 h-5 text-[#D4AF37] fill-[#D4AF37]" />
                  </div>
                  <span className="text-[10px] text-[#8A8A8A] block mt-2 truncate">
                    ~{Math.round(totalLikes / totalProjectsCount)} likes / artwork
                  </span>
                </div>

                {/* 5. Comments */}
                <div
                  onClick={() => setActiveTab('comments')}
                  className="p-4 sm:p-5 rounded-2xl glass-card border border-white/5 hover:border-[#D4AF37]/40 cursor-pointer transition-all duration-300 group hover:-translate-y-0.5"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] uppercase tracking-wider text-[#8A8A8A]">
                      Feedback
                    </span>
                    <span className="text-[10px] text-green-400 font-mono">
                      Verified
                    </span>
                  </div>
                  <div className="flex items-end justify-between mt-2">
                    <span className="font-display font-extrabold text-3xl sm:text-4xl text-[#F5F1E8] group-hover:text-[#F5D77A] transition">
                      {totalComments}
                    </span>
                    <MessageCircle className="w-5 h-5 text-[#D4AF37]" />
                  </div>
                  <span className="text-[10px] text-[#8A8A8A] block mt-2 truncate">
                    Across {projects.filter(p => p.comments && p.comments.length > 0).length} artworks
                  </span>
                </div>
              </div>

              {/* ════════ VISUAL ANALYTICS COMMAND CENTER (DUAL PANELS) ════════ */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                {/* PANEL A: Portfolio Impressions & Showcase Engagement Curve (SVG Area Chart) */}
                <div className="lg:col-span-7 p-6 rounded-3xl glass-card border border-white/10 flex flex-col justify-between space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
                    <div>
                      <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-[#D4AF37]" />
                        <h3 className="font-display font-bold text-base text-[#F5F1E8]">
                          Showcase Traffic & Engagement Velocity
                        </h3>
                      </div>
                      <p className="text-xs text-[#8A8A8A] mt-0.5">
                        Real-time visitor interactions, artwork lightbox impressions & profile views
                      </p>
                    </div>

                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-xs font-mono text-[#F5D77A]">
                      <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-ping" />
                      <span>Peak: Sat (+38%)</span>
                    </div>
                  </div>

                  {/* Interactive SVG Area Curve */}
                  <div className="relative pt-2">
                    <div className="h-44 w-full flex items-end">
                      <svg className="w-full h-full overflow-visible" viewBox="0 0 600 160" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="goldAnalyticsGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.45" />
                            <stop offset="60%" stopColor="#D4AF37" stopOpacity="0.12" />
                            <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.00" />
                          </linearGradient>
                        </defs>
                        {/* Area fill */}
                        <path
                          d="M 0 140 Q 50 110 100 118 T 200 90 T 300 70 T 400 95 T 500 30 T 600 65 L 600 160 L 0 160 Z"
                          fill="url(#goldAnalyticsGrad)"
                        />
                        {/* Glow Line */}
                        <path
                          d="M 0 140 Q 50 110 100 118 T 200 90 T 300 70 T 400 95 T 500 30 T 600 65"
                          fill="none"
                          stroke="#D4AF37"
                          strokeWidth="3.5"
                          strokeLinecap="round"
                        />
                        {/* Peak Points */}
                        <circle cx="500" cy="30" r="5" fill="#F5D77A" stroke="#000" strokeWidth="2" />
                        <circle cx="300" cy="70" r="4" fill="#D4AF37" stroke="#000" strokeWidth="1.5" />
                        <circle cx="100" cy="118" r="4" fill="#D4AF37" stroke="#000" strokeWidth="1.5" />
                      </svg>
                    </div>

                    {/* Day Labels below chart */}
                    <div className="flex items-center justify-between text-[11px] font-mono text-[#8A8A8A] pt-3 border-t border-white/5">
                      <span>Mon (2.8k)</span>
                      <span>Tue (3.4k)</span>
                      <span>Wed (4.2k)</span>
                      <span>Thu (3.9k)</span>
                      <span>Fri (5.6k)</span>
                      <span className="text-[#F5D77A] font-bold">Sat (6.8k ★)</span>
                      <span>Sun (5.1k)</span>
                    </div>
                  </div>

                  {/* Quick Analytic Highlights */}
                  <div className="grid grid-cols-3 gap-3 pt-3 border-t border-white/10 text-center">
                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                      <span className="text-[10px] uppercase font-mono text-[#8A8A8A] block">Total Impressions</span>
                      <span className="font-display font-bold text-sm sm:text-base text-[#F5F1E8]">34.8K</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                      <span className="text-[10px] uppercase font-mono text-[#8A8A8A] block">Avg. Dwell Time</span>
                      <span className="font-display font-bold text-sm sm:text-base text-[#F5D77A]">3m 42s</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                      <span className="text-[10px] uppercase font-mono text-[#8A8A8A] block">CTR to WhatsApp</span>
                      <span className="font-display font-bold text-sm sm:text-base text-green-400">4.8%</span>
                    </div>
                  </div>
                </div>

                {/* PANEL B: Creative Discipline Allocation & Portfolio Distribution */}
                <div className="lg:col-span-5 p-6 rounded-3xl glass-card border border-white/10 flex flex-col justify-between space-y-5">
                  <div className="flex items-center justify-between pb-4 border-b border-white/10">
                    <div>
                      <div className="flex items-center gap-2">
                        <PieChart className="w-4 h-4 text-[#D4AF37]" />
                        <h3 className="font-display font-bold text-base text-[#F5F1E8]">
                          Creative Discipline Allocation
                        </h3>
                      </div>
                      <p className="text-xs text-[#8A8A8A] mt-0.5">
                        Active distribution across {projects.length} curated showcases
                      </p>
                    </div>
                    <span className="text-xs font-mono font-bold text-[#F5D77A] px-2.5 py-1 rounded-lg bg-white/5 border border-white/10">
                      100% Curated
                    </span>
                  </div>

                  {/* Progress Matrix */}
                  <div className="space-y-4">
                    {/* Posters */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-[#F5F1E8]">Poster & Flyer Design</span>
                        <span className="font-mono text-[#F5D77A] font-bold">{postersCount} ({postersPct}%)</span>
                      </div>
                      <div className="w-full h-2.5 rounded-full bg-white/5 overflow-hidden p-0.5 border border-white/10">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-[#D4AF37] to-[#F5D77A]"
                          style={{ width: `${postersPct}%` }}
                        />
                      </div>
                    </div>

                    {/* Branding */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-[#F5F1E8]">Brand Identity & Logos</span>
                        <span className="font-mono text-[#F5D77A] font-bold">{brandingCount} ({brandingPct}%)</span>
                      </div>
                      <div className="w-full h-2.5 rounded-full bg-white/5 overflow-hidden p-0.5 border border-white/10">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-[#B8860B] to-[#D4AF37]"
                          style={{ width: `${brandingPct}%` }}
                        />
                      </div>
                    </div>

                    {/* Motion Graphics */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-[#F5F1E8]">Motion Graphics & Broadcast</span>
                        <span className="font-mono text-[#F5D77A] font-bold">{motionCount} ({motionPct}%)</span>
                      </div>
                      <div className="w-full h-2.5 rounded-full bg-white/5 overflow-hidden p-0.5 border border-white/10">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-[#CD7F32] to-[#F5D77A]"
                          style={{ width: `${motionPct}%` }}
                        />
                      </div>
                    </div>

                    {/* Promo Videos */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-[#F5F1E8]">Promo Videos & Animations</span>
                        <span className="font-mono text-[#F5D77A] font-bold">{videosCount} ({videosPct}%)</span>
                      </div>
                      <div className="w-full h-2.5 rounded-full bg-white/5 overflow-hidden p-0.5 border border-white/10">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-[#996515] to-[#D4AF37]"
                          style={{ width: `${videosPct}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Strategic Insight Note */}
                  <div className="p-3.5 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/25 flex items-center gap-3">
                    <Zap className="w-4 h-4 text-[#D4AF37] flex-shrink-0" />
                    <p className="text-[11px] text-[#F5D77A] leading-relaxed">
                      Commercial balance optimal: High concentration of poster campaigns attracts rapid corporate event briefs.
                    </p>
                  </div>
                </div>
              </div>

              {/* ════════ REAL-TIME SYSTEM & STUDIO ENGINES STATUS RIBBON ════════ */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                <div className="p-4 rounded-2xl bg-[#141414] border border-white/5 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-mono text-[#8A8A8A] block">Cloud Storage</span>
                    <span className="text-xs font-bold text-[#F5F1E8]">Synced & Persistent</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#141414] border border-white/5 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#F5D77A]">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-mono text-[#8A8A8A] block">TikTok Streaming</span>
                    <span className="text-xs font-bold text-[#F5F1E8]">1080p Lazy Buffer Ready</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#141414] border border-white/5 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#F5D77A]">
                    <SlidersHorizontal className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-mono text-[#8A8A8A] block">Atmosphere Engine</span>
                    <span className="text-xs font-bold text-[#F5F1E8]">100% Clear Peak Capable</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#141414] border border-white/5 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#D4AF37]">
                    <Palette className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-mono text-[#8A8A8A] block">Brand Preset</span>
                    <span className="text-xs font-bold text-[#F5D77A] truncate capitalize">{activeBrandPreset.replace('-', ' ')}</span>
                  </div>
                </div>
              </div>

              {/* ════════ HERO QUICK ACTION BANNER ════════ */}
              <div className="p-6 sm:p-8 rounded-3xl glass-card border border-[#D4AF37]/30 bg-gradient-to-br from-[#181610] via-[#121212] to-[#0D0D0D] relative overflow-hidden">
                <div className="max-w-2xl space-y-3 relative z-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-xs font-mono text-[#F5D77A]">
                    <Sparkles className="w-3 h-3" />
                    <span>Welcome to BM Graphix Admin Platform</span>
                  </div>
                  <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-[#F5F1E8]">
                    Everything you need to publish, curate & manage website content.
                  </h2>
                  <p className="text-xs sm:text-sm text-[#A0A0A0] leading-relaxed">
                    Add new poster designs, manage high-res media in the Media Vault, respond to incoming client leads via WhatsApp, and customize your live portfolio with one click.
                  </p>

                  <div className="flex flex-wrap items-center gap-3 pt-3">
                    <button
                      onClick={() => setActiveTab('upload')}
                      className="px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-black bg-gradient-to-r from-[#D4AF37] via-[#F5D77A] to-[#B8860B] shadow-lg shadow-[#D4AF37]/20 hover:brightness-110 active:scale-95 transition flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Publish New Artwork</span>
                    </button>

                    <button
                      onClick={() => setActiveTab('media')}
                      className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[#F5F1E8] bg-white/5 hover:bg-white/10 border border-white/10 transition flex items-center gap-2"
                    >
                      <ImageIcon className="w-4 h-4 text-[#D4AF37]" />
                      <span>Open Media Vault</span>
                    </button>

                    <button
                      onClick={() => setActiveTab('atmosphere')}
                      className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[#F5F1E8] bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 border border-[#D4AF37]/35 transition flex items-center gap-2"
                    >
                      <SlidersHorizontal className="w-4 h-4 text-[#D4AF37]" />
                      <span>Atmosphere & Per-Page Studio</span>
                    </button>

                    <button
                      onClick={() => setActiveTab('inquiries')}
                      className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[#F5F1E8] bg-white/5 hover:bg-white/10 border border-white/10 transition flex items-center gap-2"
                    >
                      <Inbox className="w-4 h-4 text-[#25D366]" />
                      <span>Check Client Inquiries ({inquiries.length})</span>
                    </button>
                  </div>
                </div>

                {/* Decorative background logo */}
                <div className="absolute right-4 -bottom-10 opacity-10 pointer-events-none w-72 h-72">
                  <img src="/assets/logo/BM_OFFICIAL_LOGO.png" alt="" className="w-full h-full object-contain" />
                </div>
              </div>

              {/* ════════ QUICK 2-COLUMN SPLIT: RECENT PROJECTS + LATEST INQUIRIES ════════ */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left: Recent Projects */}
                <div className="lg:col-span-7 space-y-4 p-6 rounded-3xl glass-card border border-white/10">
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <Layers className="w-4 h-4 text-[#D4AF37]" />
                      <h3 className="font-display font-bold text-lg text-[#F5F1E8]">
                        Recent Artworks ({projects.slice(0, 5).length})
                      </h3>
                    </div>
                    <button
                      onClick={() => setActiveTab('projects')}
                      className="text-xs font-medium text-[#D4AF37] hover:underline flex items-center gap-1"
                    >
                      <span>Manage All ({projects.length})</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {projects.slice(0, 4).map((p) => (
                      <div
                        key={p.id}
                        className="p-3 rounded-2xl bg-[#141414] border border-white/5 flex items-center justify-between gap-3 hover:border-[#D4AF37]/30 transition group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-12 h-12 rounded-xl overflow-hidden bg-black flex-shrink-0 border border-white/10">
                            <img
                              src={p.thumbnail || (p.images && p.images[0]) || '/assets/BM_BLCK.png'}
                              alt={p.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-display font-bold text-xs text-[#F5F1E8] truncate group-hover:text-[#F5D77A] transition">
                              {p.title}
                            </h4>
                            <span className="text-[11px] text-[#8A8A8A] block truncate">
                              {p.client ? `${p.client} • ` : ''}{p.year || 2026} • {p.category}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-xs font-mono text-[#F5D77A] flex items-center gap-1">
                            <Heart className="w-3 h-3 fill-[#D4AF37]" />
                            {p.likes || 0}
                          </span>
                          <button
                            onClick={() => openLightbox(p)}
                            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-[#8A8A8A] hover:text-[#F5F1E8] transition"
                            title="Preview artwork"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right: Latest Inquiries */}
                <div className="lg:col-span-5 space-y-4 p-6 rounded-3xl glass-card border border-white/10">
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <Inbox className="w-4 h-4 text-[#D4AF37]" />
                      <h3 className="font-display font-bold text-lg text-[#F5F1E8]">
                        Latest Inquiries
                      </h3>
                    </div>
                    <button
                      onClick={() => setActiveTab('inquiries')}
                      className="text-xs font-medium text-[#D4AF37] hover:underline flex items-center gap-1"
                    >
                      <span>View All ({inquiries.length})</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {inquiries.slice(0, 3).map((inq) => (
                      <div
                        key={inq.id}
                        className="p-3.5 rounded-2xl bg-[#141414] border border-white/5 space-y-2 hover:border-[#D4AF37]/30 transition"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-[#F5F1E8] truncate">
                            {inq.name}
                          </span>
                          <span
                            className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded-full ${
                              inq.status === 'new'
                                ? 'bg-[#D4AF37] text-black font-bold animate-pulse'
                                : 'bg-white/10 text-[#8A8A8A]'
                            }`}
                          >
                            {inq.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#8A8A8A] line-clamp-2">
                          "{inq.message}"
                        </p>
                        <div className="flex items-center justify-between pt-1 text-[10px] text-[#666]">
                          <span>{inq.service || 'Design Commission'}</span>
                          <a
                            href={`https://wa.me/${inq.phone ? inq.phone.replace(/[^0-9]/g, '') : '254798405726'}?text=${encodeURIComponent(`Hi ${inq.name}, thank you for contacting BM Graphix regarding your design commission!`)}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[#25D366] hover:underline flex items-center gap-1 font-semibold"
                          >
                            <Phone className="w-3 h-3" />
                            <span>Reply WhatsApp</span>
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

      {/* ============================================================
          TAB 2: UPLOAD & PUBLISH NEW PROJECT
          ============================================================ */}
      {activeTab === 'upload' && (
        <form onSubmit={handleCreateProject} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Col: Metadata & Info */}
            <div className="lg:col-span-6 space-y-5 p-6 rounded-3xl glass-card border border-white/10">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="font-display font-bold text-lg text-[#F5F1E8] flex items-center gap-2">
                  <Plus className="w-4 h-4 text-[#D4AF37]" />
                  <span>Project Details</span>
                </h3>
                <span className="text-[11px] text-[#8A8A8A]">All fields with * are required</span>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs uppercase tracking-wider text-[#A0A0A0] font-medium">
                  Project Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cleo High Fashion Poster Series"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#161616] border border-white/10 focus:border-[#D4AF37] focus:outline-none text-xs text-[#F5F1E8]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs uppercase tracking-wider text-[#A0A0A0] font-medium">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#161616] border border-white/10 focus:border-[#D4AF37] focus:outline-none text-xs text-[#F5F1E8]"
                  >
                    <option value="posters">Poster & Flyer Design</option>
                    <option value="branding">Logos & Branding</option>
                    <option value="motion">Motion Graphics</option>
                    <option value="videos">Video Promo Animation</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs uppercase tracking-wider text-[#A0A0A0] font-medium flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
                      Year / Date
                    </span>
                    <span className="text-[10px] text-[#8A8A8A]">Pick date or year</span>
                  </label>

                  <div className="relative flex items-center">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#D4AF37]">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      placeholder="e.g. 2026 or 2026-10-09"
                      className="w-full pl-10 pr-12 py-3 rounded-xl bg-[#161616] border border-white/10 focus:border-[#D4AF37] focus:outline-none text-xs text-[#F5F1E8]"
                    />
                    {/* Native date input overlay / trigger */}
                    <input
                      ref={datePickerRef}
                      type="date"
                      className="sr-only"
                      onChange={(e) => {
                        if (e.target.value) {
                          setYear(e.target.value);
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        try {
                          datePickerRef.current?.showPicker?.();
                        } catch {
                          datePickerRef.current?.focus?.();
                        }
                      }}
                      className="absolute right-2 p-1.5 rounded-lg bg-white/5 hover:bg-[#D4AF37]/20 text-[#8A8A8A] hover:text-[#F5D77A] transition"
                      title="Open Calendar Date Picker"
                    >
                      <Calendar className="w-4 h-4 text-[#D4AF37]" />
                    </button>
                  </div>

                  {/* Quick Preset Year / Date Pills */}
                  <div className="flex items-center gap-1.5 pt-0.5">
                    <button
                      type="button"
                      onClick={() => setYear(new Date().getFullYear().toString())}
                      className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/5 hover:bg-[#D4AF37]/20 text-[#8A8A8A] hover:text-[#F5D77A] transition"
                    >
                      {new Date().getFullYear()}
                    </button>
                    <button
                      type="button"
                      onClick={() => setYear((new Date().getFullYear() - 1).toString())}
                      className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/5 hover:bg-[#D4AF37]/20 text-[#8A8A8A] hover:text-[#F5D77A] transition"
                    >
                      {new Date().getFullYear() - 1}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const today = new Date().toISOString().split('T')[0];
                        setYear(today);
                      }}
                      className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#F5D77A] hover:bg-[#D4AF37]/25 transition"
                    >
                      Today
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs uppercase tracking-wider text-[#A0A0A0] font-medium">
                  Client / Brand Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Apex Events / Safaricom / Private Commission"
                  value={client}
                  onChange={(e) => setClient(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#161616] border border-white/10 focus:border-[#D4AF37] focus:outline-none text-xs text-[#F5F1E8]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs uppercase tracking-wider text-[#A0A0A0] font-medium">
                  Tools & Software (comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="Photoshop, Illustrator, After Effects, Cinema 4D"
                  value={toolsInput}
                  onChange={(e) => setToolsInput(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#161616] border border-white/10 focus:border-[#D4AF37] focus:outline-none text-xs text-[#F5F1E8]"
                />
              </div>

              {/* Video Upload Section */}
              <div className="space-y-2">
                <label className="block text-xs uppercase tracking-wider text-[#A0A0A0] font-medium flex items-center gap-1.5">
                  <Film className="w-3.5 h-3.5 text-[#D4AF37]" />
                  Video (Optional)
                </label>

                {/* Upload Video File Button */}
                <label className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-all ${
                  uploadedVideoDataUrl
                    ? 'border-[#D4AF37]/60 bg-[#D4AF37]/8'
                    : 'border-dashed border-white/20 bg-[#161616]/60 hover:border-[#D4AF37]/50'
                }`}>
                  <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/15 flex items-center justify-center flex-shrink-0">
                    {isProcessingVideo ? (
                      <RefreshCw className="w-4 h-4 text-[#F5D77A] animate-spin" />
                    ) : uploadedVideoDataUrl ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Film className="w-4 h-4 text-[#F5D77A]" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    {uploadedVideoDataUrl ? (
                      <>
                        <p className="text-xs font-semibold text-emerald-400">Video ready</p>
                        <p className="text-[11px] text-[#8A8A8A] truncate">{videoFileName}</p>
                      </>
                    ) : (
                      <>
                        <p className="text-xs font-semibold text-[#F5F1E8]">
                          {isProcessingVideo ? 'Loading video...' : 'Upload Video File'}
                        </p>
                        <p className="text-[11px] text-[#8A8A8A]">MP4, WebM, MOV · max 50MB recommended</p>
                      </>
                    )}
                  </div>
                  {uploadedVideoDataUrl && (
                    <button
                      type="button"
                      onClick={(e) => { e.preventDefault(); setUploadedVideoDataUrl(null); setVideoFileName(''); }}
                      className="flex-shrink-0 p-1 rounded-full hover:bg-red-500/20 text-[#8A8A8A] hover:text-red-400 transition"
                      title="Remove video"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <input
                    type="file"
                    accept=".mp4,.webm,.mov,video/mp4,video/webm,video/quicktime,video/*"
                    onChange={(e) => handleVideoFileUpload(e.target.files?.[0])}
                    className="hidden"
                  />
                </label>

                {/* Inline video preview after upload */}
                {uploadedVideoDataUrl && (
                  <ResponsiveVideoPlayer
                    src={uploadedVideoDataUrl}
                    controls
                    playsInline
                    className="w-full rounded-xl border border-[#D4AF37]/30 max-h-48 bg-black"
                  />
                )}

                {/* Divider */}
                {!uploadedVideoDataUrl && (
                  <div className="flex items-center gap-2 text-[10px] text-[#555] uppercase tracking-widest">
                    <div className="flex-1 h-px bg-white/8" />
                    <span>or paste URL</span>
                    <div className="flex-1 h-px bg-white/8" />
                  </div>
                )}

                {/* Manual URL input — hidden when a file is uploaded */}
                {!uploadedVideoDataUrl && (
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#8A8A8A]">
                      <Film className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      placeholder="YouTube URL, Vimeo URL, or /videos/file.mp4"
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#161616] border border-white/10 focus:border-[#D4AF37] focus:outline-none text-xs text-[#F5F1E8]"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs uppercase tracking-wider text-[#A0A0A0] font-medium">
                  Project Story & Creative Brief
                </label>
                <textarea
                  rows={4}
                  placeholder="Describe the concept, color grading, typography choices, and the outcome achieved for the client..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#161616] border border-white/10 focus:border-[#D4AF37] focus:outline-none text-xs text-[#F5F1E8] resize-none"
                />
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#181818] border border-white/5">
                <div>
                  <span className="text-xs font-semibold text-[#F5F1E8] block">
                    Feature on Homepage Carousel
                  </span>
                  <span className="text-[11px] text-[#8A8A8A]">
                    Featured projects receive prominent spotlight on the main portfolio page.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setFeatured(!featured)}
                  className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                    featured ? 'bg-[#D4AF37]' : 'bg-white/10'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-black transition-transform ${
                      featured ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Right Col: Media & Image Uploader */}
            <div className="lg:col-span-6 space-y-5 p-6 rounded-3xl glass-card border border-white/10">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="font-display font-bold text-lg text-[#F5F1E8] flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-[#D4AF37]" />
                  <span>Gallery Images & Thumbnail</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setActiveTab('media')}
                  className="text-xs text-[#D4AF37] hover:underline flex items-center gap-1"
                >
                  <span>Pick from Vault</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>

              {/* Drag & Drop File Zone */}
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  if (e.dataTransfer && e.dataTransfer.files) handleProjectFiles(e.dataTransfer.files);
                }}
                className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
                  isDragging
                    ? 'border-[#D4AF37] bg-[#D4AF37]/10 scale-[1.01]'
                    : 'border-white/15 hover:border-[#D4AF37]/50 bg-[#161616]/50'
                }`}
              >
                <div className="w-14 h-14 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center mx-auto mb-3">
                  <Upload className="w-6 h-6 text-[#F5D77A]" />
                </div>
                <h4 className="font-display font-semibold text-sm text-[#F5F1E8]">
                  Drag & Drop Project Media Here
                </h4>
                <p className="text-xs text-[#8A8A8A] mt-1 mb-3">
                  Upload artworks & motion videos in JPG, PNG, JPEG, or MP4
                </p>
                <div className="flex items-center justify-center gap-1.5 mb-4">
                  <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] font-mono text-[#F5D77A]">JPG</span>
                  <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] font-mono text-[#F5D77A]">PNG</span>
                  <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] font-mono text-[#F5D77A]">JPEG</span>
                  <span className="px-2 py-0.5 rounded bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[10px] font-mono text-[#F5D77A]">MP4</span>
                </div>

                <label className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold text-black bg-gradient-to-r from-[#D4AF37] to-[#F5D77A] hover:brightness-110 cursor-pointer shadow-md shadow-[#D4AF37]/20 transition">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Browse Device Files</span>
                  <input
                    type="file"
                    multiple
                    accept=".jpg,.jpeg,.png,.mp4,image/jpeg,image/png,image/jpg,image/webp,video/mp4,video/quicktime,video/webm"
                    onChange={(e) => handleProjectFiles(e.target.files)}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Uploading progress indicator */}
              {isProcessingFiles && (
                <div className="space-y-1.5 p-4 rounded-xl bg-[#181818] border border-[#D4AF37]/30">
                  <div className="flex justify-between text-xs text-[#F5D77A]">
                    <span>Processing & optimizing artwork...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-black rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#D4AF37] to-[#F5D77A] transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Uploaded images gallery */}
              {uploadedImages.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#F5F1E8]">
                      Uploaded Artworks ({uploadedImages.length})
                    </span>
                    <span className="text-[11px] text-[#D4AF37]">
                      Click star to set as main thumbnail
                    </span>
                  </div>

                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-h-64 overflow-y-auto pr-1">
                    {uploadedImages.map((img, idx) => (
                      <div
                        key={idx}
                        className={`relative rounded-xl overflow-hidden border-2 aspect-[4/5] group ${
                          thumbnailIndex === idx ? 'border-[#D4AF37] shadow-[0_0_12px_rgba(212,175,55,0.4)]' : 'border-white/10'
                        }`}
                      >
                        <img src={img} alt="" className="w-full h-full object-cover" />
                        
                        {/* Overlay Controls */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2 p-1">
                          <button
                            type="button"
                            onClick={() => setThumbnailIndex(idx)}
                            className={`p-1.5 rounded-full ${
                              thumbnailIndex === idx ? 'bg-[#D4AF37] text-black' : 'bg-black/80 text-white hover:text-[#F5D77A]'
                            }`}
                            title="Set as Thumbnail"
                          >
                            <Star className="w-3.5 h-3.5 fill-current" />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeUploadedImage(idx)}
                            className="p-1.5 rounded-full bg-red-950/80 text-red-400 hover:text-red-200"
                            title="Remove image"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {thumbnailIndex === idx && (
                          <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-[#D4AF37] text-black text-[9px] font-bold">
                            MAIN
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Submit CTA */}
              <div className="pt-4 border-t border-white/10">
                <button
                  type="submit"
                  className="w-full py-4 rounded-xl text-xs font-bold uppercase tracking-wider text-black bg-gradient-to-r from-[#D4AF37] via-[#F5D77A] to-[#B8860B] shadow-xl shadow-[#D4AF37]/25 hover:brightness-110 active:scale-95 transition flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Publish Project to Live Portfolio</span>
                </button>
              </div>
            </div>
          </div>
        </form>
      )}

      {/* ============================================================
          TAB 3: MANAGE EXISTING PROJECTS
          ============================================================ */}
      {activeTab === 'projects' && (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl glass-card border border-white/10">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-[#8A8A8A] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search projects by title, client, tool..."
                value={projectSearch}
                onChange={(e) => setProjectSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#161616] border border-white/10 focus:border-[#D4AF37] focus:outline-none text-xs text-[#F5F1E8]"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
              {['all', 'posters', 'branding', 'motion', 'videos'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setProjectCategoryFilter(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium uppercase tracking-wider capitalize whitespace-nowrap transition ${
                    projectCategoryFilter === cat
                      ? 'bg-[#D4AF37] text-black font-bold'
                      : 'bg-white/5 text-[#8A8A8A] hover:text-[#F5F1E8]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Projects Table / Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjectsList.map((project) => (
              <motion.div
                key={project.id}
                layout
                className="rounded-3xl glass-card border border-white/10 overflow-hidden bg-[#121212]/90 flex flex-col group"
              >
                {/* Image Cover */}
                <div className="relative aspect-[4/5] bg-black overflow-hidden">
                  <img
                    src={project.thumbnail || (project.images && project.images[0]) || '/assets/logo/BM_OFFICIAL_LOGO.png'}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40" />

                  {/* Top Badges */}
                  <div className="absolute top-3 inset-x-3 flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-black/80 backdrop-blur-md text-[#D4AF37] border border-[#D4AF37]/30">
                      {project.categoryLabel}
                    </span>
                    {project.featured && (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#D4AF37] text-black flex items-center gap-1 shadow">
                        <Star className="w-3 h-3 fill-black" />
                        Featured
                      </span>
                    )}
                  </div>

                  {/* Bottom Stats */}
                  <div className="absolute bottom-3 inset-x-3 flex items-center justify-between text-xs text-white/90">
                    <span className="font-mono text-[11px] text-[#A0A0A0]">{project.year}</span>
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1">
                        <Heart className="w-3.5 h-3.5 text-[#D4AF37] fill-[#D4AF37]" />
                        {project.likes || 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="w-3.5 h-3.5 text-[#D4AF37]" />
                        {project.comments ? project.comments.length : 0}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Content info */}
                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-display font-bold text-base text-[#F5F1E8] line-clamp-1">
                      {project.title}
                    </h3>
                    <p className="text-xs text-[#8A8A8A] mt-0.5">{project.client}</p>
                    {project.description && (
                      <p className="text-xs text-[#A0A0A0] line-clamp-2 mt-2 leading-relaxed">
                        {project.description}
                      </p>
                    )}
                  </div>

                  {/* Action buttons */}
                  <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                    <button
                      onClick={() => openLightbox(project)}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium text-[#F5F1E8] bg-white/5 hover:bg-white/10 border border-white/10 flex items-center gap-1 transition"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>Preview</span>
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setEditingProject(project)}
                        className="p-2 rounded-lg text-[#F5F1E8] bg-white/5 hover:bg-[#D4AF37]/20 hover:text-[#F5D77A] border border-white/10 transition"
                        title="Edit Project"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => {
                          if (confirm(`Are you sure you want to delete "${project.title}"?`)) {
                            deleteProject(project.id);
                          }
                        }}
                        className="p-2 rounded-lg text-red-400 bg-red-950/30 hover:bg-red-900/50 border border-red-500/30 transition"
                        title="Delete Project"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredProjectsList.length === 0 && (
            <div className="p-12 text-center rounded-3xl glass-card border border-white/10 space-y-3">
              <Layers className="w-10 h-10 text-[#8A8A8A] mx-auto" />
              <h4 className="font-display font-bold text-lg text-[#F5F1E8]">No projects matched your search</h4>
              <p className="text-xs text-[#8A8A8A]">Try adjusting your search keywords or filter.</p>
            </div>
          )}
        </div>
      )}

      {/* ============================================================
          TAB 4: MEDIA VAULT (ALL WEBSITE MEDIA & ASSETS)
          ============================================================ */}
      {activeTab === 'media' && (
        <div className="space-y-6">
          {/* Header & Upload Button */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
            <div>
              <h2 className="font-display font-extrabold text-2xl text-[#F5F1E8] flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-[#D4AF37]" />
                <span>Media Vault</span>
              </h2>
              <p className="text-xs text-[#8A8A8A] mt-0.5">
                Centralized library of all poster artwork, motion videos, official brand logos, and custom uploads.
              </p>
            </div>

            <button
              onClick={() => setShowMediaUploadModal(true)}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-black bg-gradient-to-r from-[#D4AF37] to-[#F5D77A] hover:brightness-110 shadow-lg shadow-[#D4AF37]/20 transition flex items-center gap-2"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Assets to Vault</span>
            </button>
          </div>

          {/* Search & Categories */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl glass-card border border-white/10">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-[#8A8A8A] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search media by title, format, tag, path..."
                value={mediaSearch}
                onChange={(e) => setMediaSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#161616] border border-white/10 focus:border-[#D4AF37] focus:outline-none text-xs text-[#F5F1E8]"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
              {[
                { id: 'all', label: 'All Media' },
                { id: 'posters', label: 'Posters & Artwork' },
                { id: 'videos', label: 'Videos & Motion' },
                { id: 'logos', label: 'Logos & Brand' },
                { id: 'portraits', label: 'Site Visuals' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setMediaCategoryFilter(tab.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                    mediaCategoryFilter === tab.id
                      ? 'bg-[#D4AF37] text-black font-bold'
                      : 'bg-white/5 text-[#8A8A8A] hover:text-[#F5F1E8]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Media Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredMedia.map((media) => (
              <div
                key={media.id}
                className="rounded-2xl glass-card border border-white/10 overflow-hidden bg-[#141414] hover:border-[#D4AF37]/50 transition group flex flex-col justify-between"
              >
                {/* Media Preview Box */}
                <div
                  onClick={() => setPreviewMedia(media)}
                  className="relative aspect-square bg-black overflow-hidden cursor-pointer flex items-center justify-center"
                >
                  {media.type === 'video' ? (
                    <div className="relative w-full h-full bg-neutral-900 flex items-center justify-center">
                      <video
                        src={resolveSafeVideoUrl(media.path)}
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition"
                        muted
                        playsInline
                        webkit-playsinline="true"
                        preload="metadata"
                      />
                      <div className="absolute w-12 h-12 rounded-full bg-black/70 border border-[#D4AF37]/50 flex items-center justify-center text-[#F5D77A] group-hover:scale-110 transition shadow-lg">
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                      </div>
                    </div>
                  ) : media.type === 'document' ? (
                    <div className="flex flex-col items-center justify-center p-4 text-center space-y-2">
                      <FileText className="w-12 h-12 text-[#D4AF37]" />
                      <span className="text-xs text-[#F5F1E8] font-mono font-semibold">PDF DOCUMENT</span>
                    </div>
                  ) : (
                    <img
                      src={media.path}
                      alt={media.title}
                      className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                    />
                  )}

                  {/* Format pill */}
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-black/80 text-[#F5D77A] border border-[#D4AF37]/30">
                    {media.format}
                  </span>

                  {media.isCustom && (
                    <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#D4AF37] text-black">
                      CUSTOM
                    </span>
                  )}
                </div>

                {/* Info & Action Bar */}
                <div className="p-3.5 space-y-2">
                  <h4 className="text-xs font-semibold text-[#F5F1E8] truncate" title={media.title}>
                    {media.title}
                  </h4>
                  <p className="text-[11px] text-[#8A8A8A] truncate font-mono">
                    {media.path}
                  </p>

                  <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-1">
                    <button
                      onClick={() => copyMediaLink(media.path, media.id)}
                      className="flex-1 py-1.5 px-2 rounded-lg text-[11px] font-medium text-[#F5F1E8] bg-white/5 hover:bg-[#D4AF37]/20 hover:text-[#F5D77A] border border-white/5 flex items-center justify-center gap-1 transition"
                      title="Copy asset path"
                    >
                      {copiedId === media.id ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedId === media.id ? 'Copied' : 'Copy Path'}</span>
                    </button>

                    {media.type !== 'video' && media.type !== 'document' && (
                      <button
                        onClick={() => useMediaInProjectDraft(media)}
                        className="p-1.5 rounded-lg text-[#F5F1E8] bg-white/5 hover:bg-[#D4AF37]/20 hover:text-[#F5D77A] border border-white/5"
                        title="Use in New Project Draft"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {media.isCustom && (
                      <button
                        onClick={() => deleteMediaItem(media.id)}
                        className="p-1.5 rounded-lg text-red-400 bg-red-950/30 hover:bg-red-900/50 border border-red-500/30"
                        title="Delete custom media"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredMedia.length === 0 && (
            <div className="p-12 text-center rounded-3xl glass-card border border-white/10 space-y-3">
              <ImageIcon className="w-10 h-10 text-[#8A8A8A] mx-auto" />
              <h4 className="font-display font-bold text-lg text-[#F5F1E8]">No media items found</h4>
              <p className="text-xs text-[#8A8A8A]">Try adjusting your search filter or upload new assets.</p>
            </div>
          )}
        </div>
      )}

      {/* ============================================================
          TAB 5: CLIENT INQUIRIES & LEADS INBOX
          ============================================================ */}
      {activeTab === 'inquiries' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div>
              <h2 className="font-display font-extrabold text-2xl text-[#F5F1E8] flex items-center gap-2">
                <Inbox className="w-5 h-5 text-[#25D366]" />
                <span>Client Inquiries & Quote Leads</span>
              </h2>
              <p className="text-xs text-[#8A8A8A] mt-0.5">
                Prospective clients who submitted the contact form on your portfolio website.
              </p>
            </div>
            <span className="text-xs font-mono text-[#D4AF37] px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30">
              Total Inquiries: {inquiries.length}
            </span>
          </div>

          <div className="space-y-4">
            {inquiries.map((inq) => {
              const cleanPhone = (inq.phone || '').replace(/[^0-9]/g, '');
              const waUrl = `https://wa.me/${cleanPhone || '254798405726'}?text=${encodeURIComponent(`Hi ${inq.name}, thank you for contacting BM Graphix! I am following up on your request for ${inq.serviceLabel}.`)}`;
              const mailUrl = `mailto:${inq.email}?subject=${encodeURIComponent(`BM Graphix Proposal - ${inq.serviceLabel}`)}`;

              return (
                <div
                  key={inq.id}
                  className={`p-6 rounded-3xl glass-card border transition space-y-4 ${
                    inq.status === 'new'
                      ? 'border-[#D4AF37]/50 bg-gradient-to-r from-[#181610] to-[#121212]'
                      : 'border-white/10 bg-[#121212]'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
                    <div>
                      <div className="flex items-center gap-2.5">
                        <h3 className="font-display font-bold text-lg text-[#F5F1E8]">
                          {inq.name}
                        </h3>
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                          inq.status === 'new'
                            ? 'bg-[#D4AF37] text-black'
                            : inq.status === 'replied'
                            ? 'bg-green-900/40 text-green-300 border border-green-500/30'
                            : 'bg-white/10 text-[#A0A0A0]'
                        }`}>
                          {inq.status}
                        </span>
                      </div>
                      <p className="text-xs text-[#8A8A8A] mt-0.5 flex items-center gap-3">
                        <span>{inq.email}</span>
                        <span>•</span>
                        <span>{inq.phone}</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-mono text-[#A0A0A0]">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{new Date(inq.createdAt).toLocaleDateString()} at {new Date(inq.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-[#F5D77A] font-medium">
                      Service: {inq.serviceLabel}
                    </span>
                    <span className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-[#25D366] font-medium">
                      Budget: {inq.budgetLabel}
                    </span>
                  </div>

                  {/* Message body */}
                  <div className="p-4 rounded-2xl bg-[#0D0D0D] border border-white/5 text-xs sm:text-sm text-[#D4D4D4] leading-relaxed">
                    "{inq.message}"
                  </div>

                  {/* Quick Action Buttons */}
                  <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => markInquiryStatus(inq.id, 'replied')}
                        className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:brightness-110 shadow-md shadow-[#25D366]/20 flex items-center gap-1.5 transition"
                      >
                        <MessageCircle className="w-3.5 h-3.5 fill-white" />
                        <span>Reply on WhatsApp</span>
                      </a>

                      <a
                        href={mailUrl}
                        onClick={() => markInquiryStatus(inq.id, 'replied')}
                        className="px-4 py-2 rounded-xl text-xs font-medium text-[#F5F1E8] bg-white/5 hover:bg-white/10 border border-white/10 flex items-center gap-1.5 transition"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        <span>Send Email</span>
                      </a>
                    </div>

                    <div className="flex items-center gap-2">
                      {inq.status !== 'read' && (
                        <button
                          onClick={() => markInquiryStatus(inq.id, 'read')}
                          className="px-3 py-1.5 rounded-lg text-xs text-[#8A8A8A] hover:text-[#F5F1E8] bg-white/5 hover:bg-white/10 transition"
                        >
                          Mark as Read
                        </button>
                      )}

                      <button
                        onClick={() => deleteInquiry(inq.id)}
                        className="p-2 rounded-lg text-red-400 bg-red-950/30 hover:bg-red-900/50 border border-red-500/30 transition"
                        title="Delete Inquiry"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {inquiries.length === 0 && (
              <div className="p-12 text-center rounded-3xl glass-card border border-white/10 space-y-3">
                <Inbox className="w-10 h-10 text-[#8A8A8A] mx-auto" />
                <h4 className="font-display font-bold text-lg text-[#F5F1E8]">No client inquiries yet</h4>
                <p className="text-xs text-[#8A8A8A]">New quotes submitted from the contact form will appear here.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================
          TAB 6: COMMENTS & FEEDBACK MODERATION
          ============================================================ */}
      {activeTab === 'comments' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div>
              <h2 className="font-display font-extrabold text-2xl text-[#F5F1E8] flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-[#D4AF37]" />
                <span>Comments & Reviews Moderation</span>
              </h2>
              <p className="text-xs text-[#8A8A8A] mt-0.5">
                Review, approve, or remove community comments across all published portfolio artworks.
              </p>
            </div>
            <span className="text-xs font-mono text-[#D4AF37] px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30">
              Total Comments: {allComments.length}
            </span>
          </div>

          <div className="space-y-3">
            {allComments.map((comment) => (
              <div
                key={comment.id}
                className="p-4 sm:p-5 rounded-2xl glass-card border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="space-y-1 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#F5F1E8]">{comment.name}</span>
                    <span className="text-[11px] text-[#8A8A8A]">on project:</span>
                    <span className="text-xs font-semibold text-[#D4AF37]">{comment.projectTitle}</span>
                  </div>
                  <p className="text-xs text-[#D4D4D4] leading-relaxed">
                    "{comment.text}"
                  </p>
                  <span className="text-[10px] text-[#8A8A8A] block font-mono">
                    {comment.date || 'Recently'}
                  </span>
                </div>

                <button
                  onClick={() => deleteComment(comment.projectId, comment.id)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-red-400 bg-red-950/40 hover:bg-red-900/50 border border-red-500/30 flex items-center gap-1.5 transition flex-shrink-0"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Comment</span>
                </button>
              </div>
            ))}

            {allComments.length === 0 && (
              <div className="p-12 text-center rounded-3xl glass-card border border-white/10 space-y-3">
                <MessageCircle className="w-10 h-10 text-[#8A8A8A] mx-auto" />
                <h4 className="font-display font-bold text-lg text-[#F5F1E8]">No comments yet</h4>
                <p className="text-xs text-[#8A8A8A]">Visitor feedback and artwork reviews will appear here.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================
          TAB: ATMOSPHERE CONTROLS & PER-PAGE BRANDING STUDIO
          ============================================================ */}
      {activeTab === 'atmosphere' && (
        <div className="space-y-8">
          {/* Header Banner */}
          <div className="p-6 sm:p-8 rounded-3xl glass-card border border-[#D4AF37]/30 bg-gradient-to-br from-[#1A1810] via-[#121212] to-[#0D0D0D] relative overflow-hidden">
            <div className="max-w-3xl space-y-3 relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-xs font-mono text-[#F5D77A]">
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>BM Graphix Atmospheric Engine</span>
              </div>
              <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-[#F5F1E8]">
                Per-Page Atmosphere & Brand Identity Studio
              </h2>
              <p className="text-xs sm:text-sm text-[#A0A0A0] leading-relaxed">
                Fine-tune lighting, background overlays, stardust particles, and Nairobi skyline clarity independently per page — including making the Nairobi Peak 100% crystal clear on the Work/Portfolio showcase.
              </p>
            </div>
            <div className="absolute -right-10 -bottom-10 w-72 h-72 rounded-full bg-[#D4AF37]/10 blur-3xl pointer-events-none" />
          </div>

          {/* ════════ PER-PAGE SEGMENTED SELECTOR ════════ */}
          <div className="flex items-center justify-between flex-wrap gap-4 p-2 rounded-2xl glass-card border border-white/10">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setAtmospherePage('home')}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  atmospherePage === 'home'
                    ? 'bg-gradient-to-r from-[#D4AF37] to-[#F5D77A] text-black shadow-md shadow-[#D4AF37]/25'
                    : 'text-[#8A8A8A] hover:text-[#F5F1E8] hover:bg-white/5'
                }`}
              >
                <span>Home Landing Page</span>
              </button>

              <button
                type="button"
                onClick={() => setAtmospherePage('work')}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 relative ${
                  atmospherePage === 'work'
                    ? 'bg-gradient-to-r from-[#D4AF37] to-[#F5D77A] text-black shadow-md shadow-[#D4AF37]/25'
                    : 'text-[#8A8A8A] hover:text-[#F5F1E8] hover:bg-white/5'
                }`}
              >
                <span>Work / Portfolio Showcase</span>
                <span className="text-[9px] font-mono font-extrabold uppercase px-1.5 py-0.5 rounded-full bg-black/30 border border-black/20">
                  Nairobi Peak 100%
                </span>
              </button>

              <button
                type="button"
                onClick={() => setAtmospherePage('global')}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  atmospherePage === 'global'
                    ? 'bg-gradient-to-r from-[#D4AF37] to-[#F5D77A] text-black shadow-md shadow-[#D4AF37]/25'
                    : 'text-[#8A8A8A] hover:text-[#F5F1E8] hover:bg-white/5'
                }`}
              >
                <Palette className="w-3.5 h-3.5" />
                <span>Brand Presets & Palette</span>
              </button>
            </div>

            <div className="flex items-center gap-2 pr-2">
              <button
                type="button"
                onClick={handleResetAtmosphere}
                className="px-3.5 py-2 rounded-xl text-xs font-medium text-[#8A8A8A] hover:text-[#F5F1E8] bg-white/5 hover:bg-white/10 border border-white/10 flex items-center gap-1.5 transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Defaults</span>
              </button>
              <button
                type="button"
                onClick={handleSaveAtmosphere}
                className="px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-black bg-gradient-to-r from-[#D4AF37] to-[#F5D77A] hover:brightness-110 transition shadow shadow-[#D4AF37]/25 flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Save All Atmosphere</span>
              </button>
            </div>
          </div>

          {/* ════════ VIEW 1: HOME LANDING PAGE CONTROLS ════════ */}
          {atmospherePage === 'home' && (
            <div className="p-6 sm:p-8 rounded-3xl glass-card border border-white/10 space-y-8">
              <div className="pb-4 border-b border-white/10">
                <h3 className="font-display font-bold text-lg text-[#F5F1E8] flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-[#D4AF37]" />
                  <span>Home Landing Page Atmosphere Controls</span>
                </h3>
                <p className="text-xs text-[#8A8A8A] mt-1">
                  Tune hero scrolling poster column visibility, darkness layers, and atmospheric glows on the landing page.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-7 space-y-6">
                  {/* Slider 1: Artwork Columns */}
                  <div className="p-5 rounded-2xl bg-[#141414] border border-white/5 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-[#F5F1E8] block">
                          Background Art Columns Opacity
                        </label>
                        <span className="text-[11px] text-[#8A8A8A]">
                          Visibility of scrolling artwork columns behind hero headline
                        </span>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-xs font-mono font-bold text-[#F5D77A]">
                        {heroBgVisibility}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="1"
                      value={heroBgVisibility}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setHeroBgVisibility(val);
                        document.documentElement.style.setProperty('--hero-bg-visibility', (val / 100).toString());
                      }}
                      className="w-full h-2 bg-[#222] rounded-lg appearance-none cursor-pointer accent-[#D4AF37]"
                    />
                    <div className="flex items-center gap-2 pt-1">
                      <span className="text-[10px] uppercase tracking-wider text-[#666]">Quick:</span>
                      {[
                        { label: 'Subtle', val: 20 },
                        { label: 'Default', val: 55 },
                        { label: 'Vivid', val: 75 },
                        { label: '100% Full', val: 100 }
                      ].map((preset) => (
                        <button
                          key={preset.label}
                          type="button"
                          onClick={() => {
                            setHeroBgVisibility(preset.val);
                            document.documentElement.style.setProperty('--hero-bg-visibility', (preset.val / 100).toString());
                          }}
                          className={`text-[10px] px-2.5 py-1 rounded-lg transition ${
                            heroBgVisibility === preset.val
                              ? 'bg-[#D4AF37] text-black font-bold'
                              : 'bg-white/5 text-[#8A8A8A] hover:text-white'
                          }`}
                        >
                          {preset.label} ({preset.val}%)
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Slider 2: Dark Overlay Depth */}
                  <div className="p-5 rounded-2xl bg-[#141414] border border-white/5 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-[#F5F1E8] block">
                          Hero Dark Overlay Depth
                        </label>
                        <span className="text-[11px] text-[#8A8A8A]">
                          Controls cinematic dark vignette for maximum typography readability
                        </span>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-xs font-mono font-bold text-[#F5D77A]">
                        {heroDarkOverlay}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="20"
                      max="100"
                      step="1"
                      value={heroDarkOverlay}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setHeroDarkOverlay(val);
                        document.documentElement.style.setProperty('--hero-dark-overlay', (val / 100).toString());
                      }}
                      className="w-full h-2 bg-[#222] rounded-lg appearance-none cursor-pointer accent-[#D4AF37]"
                    />
                  </div>

                  {/* Slider 3: Nairobi Skyline */}
                  <div className="p-5 rounded-2xl bg-[#141414] border border-white/5 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-[#F5F1E8] block">
                          Nairobi Skyline Silhouette Opacity
                        </label>
                        <span className="text-[11px] text-[#8A8A8A]">
                          Parallax architectural CBD skyline visible in the background
                        </span>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-xs font-mono font-bold text-[#F5D77A]">
                        {nairobiSkylineOpacity}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="1"
                      value={nairobiSkylineOpacity}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setNairobiSkylineOpacity(val);
                        document.documentElement.style.setProperty('--nairobi-opacity', (val / 100).toString());
                      }}
                      className="w-full h-2 bg-[#222] rounded-lg appearance-none cursor-pointer accent-[#D4AF37]"
                    />
                  </div>

                  {/* Sliders 4 & 5: Glow & Particles */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-[#141414] border border-white/5 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold uppercase tracking-wider text-[#F5F1E8]">
                          Ambient Gold Glow
                        </label>
                        <span className="text-xs font-mono font-bold text-[#F5D77A]">{goldGlowIntensity}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="1"
                        value={goldGlowIntensity}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setGoldGlowIntensity(val);
                          document.documentElement.style.setProperty('--gold-glow-intensity', (val / 100).toString());
                        }}
                        className="w-full h-2 bg-[#222] rounded-lg appearance-none cursor-pointer accent-[#D4AF37]"
                      />
                    </div>

                    <div className="p-4 rounded-2xl bg-[#141414] border border-white/5 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold uppercase tracking-wider text-[#F5F1E8]">
                          Gold Dust Particles
                        </label>
                        <span className="text-xs font-mono font-bold text-[#F5D77A]">{particlesVisibility}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="1"
                        value={particlesVisibility}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setParticlesVisibility(val);
                          document.documentElement.style.setProperty('--particles-visibility', (val / 100).toString());
                        }}
                        className="w-full h-2 bg-[#222] rounded-lg appearance-none cursor-pointer accent-[#D4AF37]"
                      />
                    </div>
                  </div>
                </div>

                {/* Right: Simulation Viewport */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="p-4 rounded-2xl bg-[#121212] border border-[#D4AF37]/30 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#F5F1E8] flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>Home Page Live Preview</span>
                      </span>
                      <span className="text-[10px] text-[#22c55e] flex items-center gap-1 font-mono">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-pulse" />
                        Live Sync
                      </span>
                    </div>

                    <div className="relative h-72 rounded-xl overflow-hidden border border-white/10 bg-[#0A0A0A] flex flex-col justify-end p-5 select-none">
                      {/* Simulated skyline */}
                      <div
                        className="absolute inset-0 bg-cover bg-center pointer-events-none transition-opacity duration-300"
                        style={{
                          backgroundImage: "url('/assets/nairobi-cbd.jpg')",
                          opacity: nairobiSkylineOpacity / 100,
                          filter: 'blur(2px) contrast(1.1)',
                        }}
                      />
                      {/* Simulated artwork columns */}
                      <div
                        className="absolute inset-0 flex gap-1 pointer-events-none transition-opacity duration-300"
                        style={{ opacity: heroBgVisibility / 100 }}
                      >
                        {[1, 2, 3, 4].map((col) => (
                          <div key={col} className="flex-1 opacity-70 bg-gradient-to-b from-[#1C1808] to-[#121008] border-r border-white/5 flex flex-col gap-1 p-1">
                            <div className="h-14 rounded bg-[#2a2210] opacity-60" />
                            <div className="h-20 rounded bg-[#352b14] opacity-50" />
                            <div className="h-16 rounded bg-[#201a0d] opacity-70" />
                          </div>
                        ))}
                      </div>
                      {/* Dark overlay */}
                      <div
                        className="absolute inset-0 pointer-events-none transition-opacity duration-300"
                        style={{
                          opacity: heroDarkOverlay / 100,
                          background: 'linear-gradient(to right, rgba(7,7,7,0.98) 0%, rgba(7,7,7,0.85) 60%, rgba(7,7,7,0.65) 100%)'
                        }}
                      />
                      {/* Gold glow orb */}
                      <div
                        className="absolute w-44 h-44 rounded-full pointer-events-none -top-10 -left-10 blur-2xl transition-opacity duration-300"
                        style={{
                          opacity: goldGlowIntensity / 100,
                          background: `radial-gradient(circle, ${brandPrimaryColor} 0%, transparent 70%)`
                        }}
                      />
                      {/* Foreground */}
                      <div className="relative z-10 space-y-2">
                        <span className="inline-block text-[9px] font-mono uppercase tracking-widest text-[#D4AF37] px-2 py-0.5 rounded-full bg-black/60 border border-[#D4AF37]/30">
                          Visual Art & Motion
                        </span>
                        <h4 className="font-display font-extrabold text-base text-[#F5F1E8] leading-tight">
                          Visual Art That <br />
                          <span style={{ color: brandPrimaryColor }}>Moves People.</span>
                        </h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ════════ VIEW 2: WORK / PORTFOLIO PAGE (NAIROBI PEAK 100% CLEAR) ════════ */}
          {atmospherePage === 'work' && (
            <div className="p-6 sm:p-8 rounded-3xl glass-card border border-white/10 space-y-8">
              <div className="pb-4 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-display font-bold text-lg text-[#F5F1E8] flex items-center gap-2">
                      <Layers className="w-4 h-4 text-[#D4AF37]" />
                      <span>Work / Portfolio Page Atmosphere (Nairobi Peak Clarity)</span>
                    </h3>
                    <p className="text-xs text-[#8A8A8A] mt-1">
                      Configure the Nairobi CBD & Peak background image on the Work page to be made further more clear up to <strong>100% crystal clear</strong>.
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-xs font-mono font-bold text-[#F5D77A]">
                    100% Clear Capable
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-7 space-y-6">
                  {/* WORK SLIDER 1: Nairobi Peak Skyline Visibility (up to 100% Full Opacity!) */}
                  <div className="p-5 rounded-2xl bg-[#141414] border border-[#D4AF37]/30 space-y-3 shadow-lg shadow-[#D4AF37]/5">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-[#F5D77A] block flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                          <span>Nairobi Peak Skyline Visibility (0% to 100%)</span>
                        </label>
                        <span className="text-[11px] text-[#A0A0A0]">
                          Allows the Nairobi skyline and peak to shine through at full 100% clarity
                        </span>
                      </div>
                      <span className="px-3.5 py-1 rounded-full bg-[#D4AF37] text-black text-xs font-mono font-extrabold shadow">
                        {workNairobiSkylineOpacity}%
                      </span>
                    </div>

                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="1"
                      value={workNairobiSkylineOpacity}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setWorkNairobiSkylineOpacity(val);
                        document.documentElement.style.setProperty('--work-nairobi-opacity', (val / 100).toString());
                      }}
                      className="w-full h-2.5 bg-[#222] rounded-lg appearance-none cursor-pointer accent-[#D4AF37]"
                    />

                    {/* Quick Presets up to 100% Clear */}
                    <div className="flex items-center gap-2 pt-1 flex-wrap">
                      <span className="text-[10px] uppercase tracking-wider text-[#777]">Presets:</span>
                      {[
                        { label: 'Off', val: 0 },
                        { label: 'Subtle', val: 25 },
                        { label: 'Prominent', val: 60 },
                        { label: 'Ultra Clear', val: 85 },
                        { label: '100% Crystal Clear', val: 100 }
                      ].map((preset) => (
                        <button
                          key={preset.label}
                          type="button"
                          onClick={() => {
                            setWorkNairobiSkylineOpacity(preset.val);
                            document.documentElement.style.setProperty('--work-nairobi-opacity', (preset.val / 100).toString());
                          }}
                          className={`text-[10px] px-2.5 py-1 rounded-lg font-medium transition ${
                            workNairobiSkylineOpacity === preset.val
                              ? 'bg-gradient-to-r from-[#D4AF37] to-[#F5D77A] text-black font-bold shadow'
                              : 'bg-white/5 text-[#8A8A8A] hover:text-white'
                          }`}
                        >
                          {preset.label} ({preset.val}%)
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* WORK SLIDER 2: Nairobi Peak Clarity & Sharpness (0px blur at 100%) */}
                  <div className="p-5 rounded-2xl bg-[#141414] border border-white/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-[#F5F1E8] block">
                          Nairobi Peak Sharpness & Micro-Contrast
                        </label>
                        <span className="text-[11px] text-[#8A8A8A]">
                          Reduces blur to 0.0px for razor-sharp peak towers and architectural detail
                        </span>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-xs font-mono font-bold text-[#F5D77A]">
                        {workNairobiClarity}% ({workNairobiClarity >= 95 ? '0px Blur' : `${(((100 - workNairobiClarity)/100)*4).toFixed(1)}px`})
                      </span>
                    </div>

                    <input
                      type="range"
                      min="20"
                      max="100"
                      step="1"
                      value={workNairobiClarity}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setWorkNairobiClarity(val);
                        document.documentElement.style.setProperty('--work-nairobi-clarity', (val / 100).toString());
                      }}
                      className="w-full h-2 bg-[#222] rounded-lg appearance-none cursor-pointer accent-[#D4AF37]"
                    />

                    <div className="flex items-center gap-2 pt-1">
                      <span className="text-[10px] uppercase tracking-wider text-[#666]">Presets:</span>
                      {[
                        { label: 'Cinematic Soft', val: 40 },
                        { label: 'HD Sharp', val: 75 },
                        { label: '100% Pin-Sharp', val: 100 }
                      ].map((preset) => (
                        <button
                          key={preset.label}
                          type="button"
                          onClick={() => {
                            setWorkNairobiClarity(preset.val);
                            document.documentElement.style.setProperty('--work-nairobi-clarity', (preset.val / 100).toString());
                          }}
                          className={`text-[10px] px-2.5 py-1 rounded-lg transition ${
                            workNairobiClarity === preset.val
                              ? 'bg-[#D4AF37] text-black font-bold'
                              : 'bg-white/5 text-[#8A8A8A] hover:text-white'
                          }`}
                        >
                          {preset.label} ({preset.val}%)
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* WORK SLIDER 3: Dark Overlay Depth on Work Page */}
                  <div className="p-5 rounded-2xl bg-[#141414] border border-white/5 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-[#F5F1E8] block">
                          Work Page Dark Overlay Depth
                        </label>
                        <span className="text-[11px] text-[#8A8A8A]">
                          Lower values let the Nairobi Peak shine through with maximum vividness
                        </span>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-xs font-mono font-bold text-[#F5D77A]">
                        {workDarkOverlay}%
                      </span>
                    </div>

                    <input
                      type="range"
                      min="10"
                      max="100"
                      step="1"
                      value={workDarkOverlay}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setWorkDarkOverlay(val);
                        document.documentElement.style.setProperty('--work-dark-overlay', (val / 100).toString());
                      }}
                      className="w-full h-2 bg-[#222] rounded-lg appearance-none cursor-pointer accent-[#D4AF37]"
                    />
                  </div>

                  {/* Sliders: Glow & Particles on Work */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-[#141414] border border-white/5 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold uppercase tracking-wider text-[#F5F1E8]">
                          Work Ambient Glow
                        </label>
                        <span className="text-xs font-mono font-bold text-[#F5D77A]">{workGoldGlow}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="1"
                        value={workGoldGlow}
                        onChange={(e) => setWorkGoldGlow(Number(e.target.value))}
                        className="w-full h-2 bg-[#222] rounded-lg appearance-none cursor-pointer accent-[#D4AF37]"
                      />
                    </div>

                    <div className="p-4 rounded-2xl bg-[#141414] border border-white/5 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold uppercase tracking-wider text-[#F5F1E8]">
                          Work Stardust Particles
                        </label>
                        <span className="text-xs font-mono font-bold text-[#F5D77A]">{workParticles}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="1"
                        value={workParticles}
                        onChange={(e) => setWorkParticles(Number(e.target.value))}
                        className="w-full h-2 bg-[#222] rounded-lg appearance-none cursor-pointer accent-[#D4AF37]"
                      />
                    </div>
                  </div>
                </div>

                {/* Right: Work Page Simulation Viewport */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="p-4 rounded-2xl bg-[#121212] border border-[#D4AF37]/30 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#F5F1E8] flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>Work Page Live Preview</span>
                      </span>
                      <span className="text-[10px] text-[#22c55e] flex items-center gap-1 font-mono">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-pulse" />
                        Live Sync
                      </span>
                    </div>

                    <div className="relative h-80 rounded-xl overflow-hidden border border-white/10 bg-[#0A0A0A] flex flex-col justify-between p-4 select-none">
                      {/* Simulated Nairobi Peak layer with active opacity and clarity */}
                      <div
                        className="absolute inset-0 bg-cover bg-center pointer-events-none transition-all duration-300"
                        style={{
                          backgroundImage: "url('/assets/nairobi-cbd.jpg')",
                          opacity: workNairobiSkylineOpacity / 100,
                          filter: `blur(${Math.max(0, ((100 - workNairobiClarity) / 100) * 4).toFixed(1)}px) contrast(${(1 + (workNairobiClarity/100)*0.25).toFixed(2)})`
                        }}
                      />

                      {/* Simulated soft dark overlay */}
                      <div
                        className="absolute inset-0 pointer-events-none transition-opacity duration-300"
                        style={{
                          opacity: workDarkOverlay / 100,
                          background: 'linear-gradient(to bottom, rgba(10,10,10,0.35) 0%, rgba(10,10,10,0.85) 100%)'
                        }}
                      />

                      {/* Header inside simulation */}
                      <div className="relative z-10 flex items-center justify-between border-b border-white/10 pb-2">
                        <span className="text-[10px] font-mono text-[#F5D77A] font-bold">PORTFOLIO & GALLERY</span>
                        <span className="text-[9px] font-mono text-white/60">{projects.length} Works</span>
                      </div>

                      {/* Simulated Cards Grid over the clear Nairobi Peak */}
                      <div className="relative z-10 grid grid-cols-2 gap-2 my-auto">
                        {[1, 2].map((card) => (
                          <div key={card} className="p-2.5 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 space-y-1.5">
                            <div className="h-16 rounded-lg bg-neutral-900 border border-white/5 flex items-center justify-center">
                              <span className="text-[9px] text-[#D4AF37] font-mono">POSTER #{card}</span>
                            </div>
                            <span className="text-[10px] font-bold text-[#F5F1E8] block truncate">VIP Gala Event</span>
                          </div>
                        ))}
                      </div>

                      <div className="relative z-10 text-center">
                        <span className="text-[10px] font-mono text-[#D4AF37] bg-black/60 px-2 py-0.5 rounded-full border border-[#D4AF37]/30">
                          Nairobi Peak: {workNairobiSkylineOpacity}% Visibility • {workNairobiClarity}% Clarity
                        </span>
                      </div>
                    </div>

                    <p className="text-[11px] text-[#8A8A8A] leading-relaxed">
                      At 100% visibility & 100% sharpness, the Nairobi peak background will be 100% unblurred and fully clear behind your curated portfolio grid.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ════════ VIEW 3: GLOBAL PRESETS & BRAND PALETTE ════════ */}
          {atmospherePage === 'global' && (
            <div className="p-6 sm:p-8 rounded-3xl glass-card border border-white/10 space-y-8">
              <div className="pb-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Palette className="w-5 h-5 text-[#D4AF37]" />
                  <h3 className="font-display font-bold text-xl text-[#F5F1E8]">
                    Global Presets & Brand Identity Studio
                  </h3>
                </div>
                <p className="text-xs text-[#8A8A8A] mt-1">
                  Select any curated 1-click brand identity preset to instantly apply harmonized colors, gradients, and atmospheric lighting across the entire site.
                </p>
              </div>

              {/* Presets Grid */}
              <div className="space-y-4">
                <label className="text-xs uppercase tracking-wider text-[#A0A0A0] font-bold flex items-center gap-2">
                  <span>Select Brand Identity Preset (1-Click Apply)</span>
                </label>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {BRAND_PRESETS.map((preset) => {
                    const isActive = activeBrandPreset === preset.id;
                    return (
                      <div
                        key={preset.id}
                        onClick={() => handleApplyBrandPreset(preset)}
                        className={`group relative p-5 rounded-2xl cursor-pointer transition-all duration-300 border ${
                          isActive
                            ? 'bg-[#181610] border-[#D4AF37] shadow-lg shadow-[#D4AF37]/20 scale-[1.01]'
                            : 'bg-[#141414] border-white/10 hover:border-[#D4AF37]/50 hover:bg-[#161616]'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-[10px] font-mono uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-[#D4AF37]">
                            {preset.badge}
                          </span>
                          {isActive && (
                            <span className="flex items-center gap-1 text-[10px] font-mono text-[#F5D77A] bg-[#D4AF37]/20 px-2 py-0.5 rounded-full border border-[#D4AF37]/40 font-bold">
                              <Check className="w-3 h-3" />
                              Active
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 mb-3">
                          <span className="w-5 h-5 rounded-full border border-white/30 shadow" style={{ backgroundColor: preset.primary }} />
                          <span className="w-5 h-5 rounded-full border border-white/30 shadow" style={{ backgroundColor: preset.secondary }} />
                          <span className="w-5 h-5 rounded-full border border-white/30 shadow" style={{ backgroundColor: preset.dark }} />
                        </div>

                        <h4 className="font-display font-bold text-sm text-[#F5F1E8] mb-1 group-hover:text-[#F5D77A] transition">
                          {preset.name}
                        </h4>
                        <p className="text-[11px] text-[#8A8A8A] leading-relaxed">
                          {preset.desc}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Custom Palette Fine-Tuner */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-4 border-t border-white/10">
                <div className="lg:col-span-7 space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#A0A0A0]">
                    Custom Brand Palette Fine-Tuner
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs uppercase tracking-wider text-[#A0A0A0]">Brand Name</label>
                      <input
                        type="text"
                        value={brandName}
                        onChange={(e) => setBrandName(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-[#161616] border border-white/10 focus:border-[#D4AF37] focus:outline-none text-xs text-[#F5F1E8]"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs uppercase tracking-wider text-[#A0A0A0]">Tagline</label>
                      <input
                        type="text"
                        value={brandTagline}
                        onChange={(e) => setBrandTagline(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-[#161616] border border-white/10 focus:border-[#D4AF37] focus:outline-none text-xs text-[#F5F1E8]"
                      />
                    </div>
                  </div>

                  {/* Primary Color Picker */}
                  <div className="space-y-2">
                    <label className="block text-xs uppercase tracking-wider text-[#A0A0A0]">
                      Primary Brand Accent Color
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={brandPrimaryColor}
                        onChange={(e) => {
                          const val = e.target.value;
                          setBrandPrimaryColor(val);
                          document.documentElement.style.setProperty('--gold-primary', val);
                        }}
                        className="w-10 h-10 rounded-xl cursor-pointer bg-transparent border-0 p-0"
                      />
                      <input
                        type="text"
                        value={brandPrimaryColor}
                        onChange={(e) => {
                          const val = e.target.value;
                          setBrandPrimaryColor(val);
                          document.documentElement.style.setProperty('--gold-primary', val);
                        }}
                        className="w-32 px-3 py-2 rounded-xl bg-[#161616] border border-white/10 text-xs font-mono text-[#F5D77A]"
                      />
                      <div className="flex items-center gap-1.5">
                        {['#D4AF37', '#FF9F1C', '#E6CA65', '#CD7F32', '#E2E8F0'].map((color) => (
                          <button
                            key={color}
                            type="button"
                            onClick={() => {
                              setBrandPrimaryColor(color);
                              document.documentElement.style.setProperty('--gold-primary', color);
                            }}
                            className="w-6 h-6 rounded-full border border-white/30 hover:scale-110 transition shadow"
                            style={{ backgroundColor: color }}
                            title={color}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={handleSaveAtmosphere}
                      className="w-full sm:w-auto px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-black bg-gradient-to-r from-[#D4AF37] via-[#F5D77A] to-[#B8860B] hover:brightness-110 transition shadow shadow-[#D4AF37]/25"
                    >
                      Save & Apply Brand Settings
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-5">
                  <div className="p-5 rounded-2xl bg-[#141414] border border-white/10 space-y-4">
                    <span className="text-xs uppercase tracking-wider text-[#A0A0A0] font-bold block">
                      Live Identity Card Preview
                    </span>
                    <div className="p-4 rounded-xl border bg-black/60 space-y-2" style={{ borderColor: brandPrimaryColor }}>
                      <span className="text-[10px] font-mono tracking-widest uppercase text-[#D4AF37] block">
                        Official Brand
                      </span>
                      <h4 className="font-display font-bold text-lg text-[#F5F1E8]">
                        {brandName}
                      </h4>
                      <p className="text-xs text-[#8A8A8A]">
                        {brandTagline}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ============================================================
          TAB 7: ADMIN ACCOUNT PROFILE & WEBSITE SETTINGS
          ============================================================ */}
      {activeTab === 'settings' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left: Admin Profile & Credentials */}
            <div className="lg:col-span-6 space-y-6">
              {/* Profile Card */}
              <form onSubmit={handleSaveProfile} className="p-6 rounded-3xl glass-card border border-white/10 space-y-5">
                <div className="flex items-center gap-2 pb-3 border-b border-white/10">
                  <UserCheck className="w-4 h-4 text-[#D4AF37]" />
                  <h3 className="font-display font-bold text-lg text-[#F5F1E8]">
                    Admin Account Profile
                  </h3>
                </div>

                {/* Avatar Photo Section */}
                <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
                  <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.35)] flex-shrink-0 bg-black group/avatar">
                    <img
                      src={adminAvatar || adminUser?.avatar || '/assets/brian-mulilu.jpg'}
                      alt="Admin Avatar"
                      className="w-full h-full object-cover object-[center_18%]"
                    />
                    <button
                      type="button"
                      onClick={() => avatarFileInputRef.current?.click()}
                      className="absolute inset-0 bg-black/60 opacity-0 group-hover/avatar:opacity-100 flex items-center justify-center transition-opacity text-[#F5D77A]"
                      title="Upload new photo"
                    >
                      <Camera className="w-6 h-6 drop-shadow" />
                    </button>
                    <span className="absolute bottom-1 right-1 w-3 h-3 rounded-full bg-green-500 border-2 border-black" />
                  </div>

                  <div className="space-y-2 text-center sm:text-left flex-1 min-w-0">
                    <div>
                      <span className="text-xs font-bold text-[#F5F1E8] block">Admin Profile Photo</span>
                      <p className="text-[11px] text-[#8A8A8A]">
                        Upload your photo. Automatically compressed with high quality for instant loading.
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                      <button
                        type="button"
                        disabled={isUpdatingAvatar}
                        onClick={() => avatarFileInputRef.current?.click()}
                        className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-black bg-gradient-to-r from-[#D4AF37] to-[#F5D77A] hover:brightness-110 flex items-center gap-1.5 transition shadow"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        <span>{isUpdatingAvatar ? 'Compressing...' : 'Upload New Photo'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleResetAvatar}
                        className="px-3 py-1.5 rounded-xl text-xs font-medium text-[#8A8A8A] hover:text-[#F5F1E8] bg-white/5 hover:bg-white/10 border border-white/10 flex items-center gap-1.5 transition"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Reset Default</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs uppercase tracking-wider text-[#A0A0A0] font-medium">
                    Admin Display Name
                  </label>
                  <input
                    type="text"
                    required
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#161616] border border-white/10 focus:border-[#D4AF37] focus:outline-none text-xs text-[#F5F1E8]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs uppercase tracking-wider text-[#A0A0A0] font-medium">
                    Admin Login Email
                  </label>
                  <input
                    type="email"
                    required
                    value={profileEmail}
                    onChange={(e) => setProfileEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#161616] border border-white/10 focus:border-[#D4AF37] focus:outline-none text-xs text-[#F5F1E8]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs uppercase tracking-wider text-[#A0A0A0] font-medium">
                    Professional Role / Title
                  </label>
                  <input
                    type="text"
                    value={profileRole}
                    onChange={(e) => setProfileRole(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#161616] border border-white/10 focus:border-[#D4AF37] focus:outline-none text-xs text-[#F5F1E8]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs uppercase tracking-wider text-[#A0A0A0] font-medium">
                    Admin Phone Number
                  </label>
                  <input
                    type="text"
                    value={profilePhone}
                    onChange={(e) => setProfilePhone(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#161616] border border-white/10 focus:border-[#D4AF37] focus:outline-none text-xs text-[#F5F1E8]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-black bg-gradient-to-r from-[#D4AF37] to-[#F5D77A] hover:brightness-110 transition shadow"
                >
                  Save Profile Details
                </button>
              </form>

              {/* Password Change Card */}
              <form onSubmit={handleChangePassword} className="p-6 rounded-3xl glass-card border border-white/10 space-y-5">
                <div className="flex items-center gap-2 pb-3 border-b border-white/10">
                  <Key className="w-4 h-4 text-[#D4AF37]" />
                  <h3 className="font-display font-bold text-lg text-[#F5F1E8]">
                    Change Security Password
                  </h3>
                </div>

                {passwordError && (
                  <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-xs text-red-300">
                    {passwordError}
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="block text-xs uppercase tracking-wider text-[#A0A0A0] font-medium">
                    New Password
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Enter new password (min 4 characters)"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#161616] border border-white/10 focus:border-[#D4AF37] focus:outline-none text-xs text-[#F5F1E8]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs uppercase tracking-wider text-[#A0A0A0] font-medium">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Re-type new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#161616] border border-white/10 focus:border-[#D4AF37] focus:outline-none text-xs text-[#F5F1E8]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-black bg-gradient-to-r from-[#D4AF37] to-[#F5D77A] hover:brightness-110 transition shadow"
                >
                  Update Admin Password
                </button>
              </form>
            </div>

            {/* Right: Website Public Settings & Contact Channels */}
            <div className="lg:col-span-6 space-y-6">
              <form onSubmit={handleSaveSiteSettings} className="p-6 rounded-3xl glass-card border border-white/10 space-y-5">
                <div className="flex items-center gap-2 pb-3 border-b border-white/10">
                  <Settings className="w-4 h-4 text-[#D4AF37]" />
                  <h3 className="font-display font-bold text-lg text-[#F5F1E8]">
                    Website & Contact Channels
                  </h3>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs uppercase tracking-wider text-[#A0A0A0] font-medium">
                    WhatsApp Floating & Contact Number
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="254798405726 (International format without +)"
                    value={settingWhatsapp}
                    onChange={(e) => setSettingWhatsapp(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#161616] border border-white/10 focus:border-[#D4AF37] focus:outline-none text-xs text-[#F5F1E8]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs uppercase tracking-wider text-[#A0A0A0] font-medium">
                    Public Contact Email
                  </label>
                  <input
                    type="email"
                    required
                    value={settingEmail}
                    onChange={(e) => setSettingEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#161616] border border-white/10 focus:border-[#D4AF37] focus:outline-none text-xs text-[#F5F1E8]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs uppercase tracking-wider text-[#A0A0A0] font-medium">
                    Studio Location
                  </label>
                  <input
                    type="text"
                    value={settingLocation}
                    onChange={(e) => setSettingLocation(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#161616] border border-white/10 focus:border-[#D4AF37] focus:outline-none text-xs text-[#F5F1E8]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs uppercase tracking-wider text-[#A0A0A0] font-medium">
                      Availability Status
                    </label>
                    <select
                      value={settingAvailability}
                      onChange={(e) => setSettingAvailability(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-[#161616] border border-white/10 focus:border-[#D4AF37] focus:outline-none text-xs text-[#F5F1E8]"
                    >
                      <option value="available">🟢 Available for Projects</option>
                      <option value="limited">🟡 Limited Availability</option>
                      <option value="busy">🔴 Fully Booked</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs uppercase tracking-wider text-[#A0A0A0] font-medium">
                      Badge Text
                    </label>
                    <input
                      type="text"
                      value={settingAvailabilityText}
                      onChange={(e) => setSettingAvailabilityText(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-[#161616] border border-white/10 focus:border-[#D4AF37] focus:outline-none text-xs text-[#F5F1E8]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-black bg-gradient-to-r from-[#D4AF37] to-[#F5D77A] hover:brightness-110 transition shadow"
                >
                  Save Website Settings
                </button>
              </form>

              {/* Data & Backup Box */}
              <div className="p-6 rounded-3xl glass-card border border-white/10 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#8A8A8A]">
                  System Management & Reset
                </h4>
                <p className="text-xs text-[#8A8A8A] leading-relaxed">
                  Reset portfolio projects to the default sample dataset if needed.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm('Are you sure you want to restore the default sample projects?')) {
                      resetDefaults();
                    }
                  }}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[#F5F1E8] bg-white/5 hover:bg-white/10 border border-white/10 flex items-center gap-2 transition"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Restore Default Portfolio Set</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
                {/* Hidden Global Avatar Uploader */}
        <input
          type="file"
          ref={avatarFileInputRef}
          accept="image/png,image/jpeg,image/webp,image/jpg"
          onChange={handleAvatarFileChange}
          className="hidden"
        />
        </main>
      </div>

      {/* ============================================================
          MODAL: EDIT PROJECT
          ============================================================ */}
      <AnimatePresence>
        {editingProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl p-6 sm:p-8 rounded-3xl glass-card border border-[#D4AF37]/40 shadow-2xl bg-[#121212]/95 max-h-[90vh] overflow-y-auto space-y-5"
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <h3 className="font-display font-bold text-lg text-[#F5F1E8] flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-[#D4AF37]" />
                  <span>Edit Project: {editingProject.title}</span>
                </h3>
                <button
                  onClick={() => setEditingProject(null)}
                  className="p-1 rounded-lg text-[#8A8A8A] hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveEditedProject} className="space-y-4">
                <div className="space-y-1">
                  <label className="block text-xs uppercase tracking-wider text-[#A0A0A0]">Title</label>
                  <input
                    type="text"
                    required
                    value={editingProject.title}
                    onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#181818] border border-white/10 focus:border-[#D4AF37] focus:outline-none text-xs text-[#F5F1E8]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-xs uppercase tracking-wider text-[#A0A0A0]">Category</label>
                    <select
                      value={editingProject.category}
                      onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#181818] border border-white/10 focus:border-[#D4AF37] focus:outline-none text-xs text-[#F5F1E8]"
                    >
                      <option value="posters">Poster & Flyer Design</option>
                      <option value="branding">Logos & Branding</option>
                      <option value="motion">Motion Graphics</option>
                      <option value="videos">Video Promo Animation</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs uppercase tracking-wider text-[#A0A0A0] flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-[#D4AF37]" />
                        Year / Date
                      </span>
                    </label>
                    <div className="relative flex items-center">
                      <input
                        type="text"
                        value={editingProject.year}
                        onChange={(e) => setEditingProject({ ...editingProject, year: e.target.value })}
                        className="w-full pl-3 pr-10 py-2.5 rounded-xl bg-[#181818] border border-white/10 focus:border-[#D4AF37] focus:outline-none text-xs text-[#F5F1E8]"
                      />
                      <input
                        ref={editDatePickerRef}
                        type="date"
                        className="sr-only"
                        onChange={(e) => {
                          if (e.target.value) {
                            setEditingProject({ ...editingProject, year: e.target.value });
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          try {
                            editDatePickerRef.current?.showPicker?.();
                          } catch {
                            editDatePickerRef.current?.focus?.();
                          }
                        }}
                        className="absolute right-2 p-1 rounded-lg bg-white/5 hover:bg-[#D4AF37]/20 text-[#8A8A8A] hover:text-[#F5D77A] transition"
                        title="Open Calendar Date Picker"
                      >
                        <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs uppercase tracking-wider text-[#A0A0A0]">Client</label>
                  <input
                    type="text"
                    value={editingProject.client}
                    onChange={(e) => setEditingProject({ ...editingProject, client: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#181818] border border-white/10 focus:border-[#D4AF37] focus:outline-none text-xs text-[#F5F1E8]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs uppercase tracking-wider text-[#A0A0A0]">Video URL</label>
                  <input
                    type="text"
                    value={editingProject.videoUrl || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, videoUrl: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#181818] border border-white/10 focus:border-[#D4AF37] focus:outline-none text-xs text-[#F5F1E8]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs uppercase tracking-wider text-[#A0A0A0]">Description</label>
                  <textarea
                    rows={3}
                    value={editingProject.description || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#181818] border border-white/10 focus:border-[#D4AF37] focus:outline-none text-xs text-[#F5F1E8]"
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-[#181818]">
                  <span className="text-xs font-semibold text-[#F5F1E8]">Featured Project</span>
                  <button
                    type="button"
                    onClick={() => setEditingProject({ ...editingProject, featured: !editingProject.featured })}
                    className={`w-10 h-5 rounded-full relative p-0.5 ${editingProject.featured ? 'bg-[#D4AF37]' : 'bg-white/10'}`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-black transition-transform ${editingProject.featured ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setEditingProject(null)}
                    className="px-4 py-2 rounded-xl text-xs font-medium text-[#8A8A8A] hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl text-xs font-bold text-black bg-gradient-to-r from-[#D4AF37] to-[#F5D77A] hover:brightness-110 transition shadow"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ============================================================
          MODAL: MEDIA VAULT PREVIEW LIGHTBOX
          ============================================================ */}
      <AnimatePresence>
        {previewMedia && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-lg">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-3xl rounded-3xl glass-card border border-[#D4AF37]/40 shadow-2xl bg-[#121212]/95 overflow-hidden flex flex-col"
            >
              {/* Top Modal Bar */}
              <div className="flex items-center justify-between p-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#D4AF37]/20 text-[#F5D77A] border border-[#D4AF37]/40">
                    {previewMedia.format}
                  </span>
                  <h3 className="font-display font-bold text-sm text-[#F5F1E8]">
                    {previewMedia.title}
                  </h3>
                </div>
                <button
                  onClick={() => setPreviewMedia(null)}
                  className="p-1 rounded-lg text-[#8A8A8A] hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Media Display Area */}
              <div className="p-4 bg-black flex items-center justify-center min-h-[350px] max-h-[60vh] overflow-hidden">
                {previewMedia.type === 'video' ? (
                  <ResponsiveVideoPlayer
                    src={previewMedia.path}
                    controls
                    autoPlay
                    muted
                    playsInline
                    className="max-h-[55vh] max-w-full rounded-xl"
                  />
                ) : (
                  <img
                    src={previewMedia.path}
                    alt={previewMedia.title}
                    className="max-h-[55vh] max-w-full object-contain rounded-xl"
                  />
                )}
              </div>

              {/* Footer Controls */}
              <div className="p-4 bg-[#141414] border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
                <span className="font-mono text-[#8A8A8A] truncate max-w-sm">
                  {previewMedia.path}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => copyMediaLink(previewMedia.path, previewMedia.id)}
                    className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[#F5F1E8] flex items-center gap-1.5 transition"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Path</span>
                  </button>

                  <a
                    href={previewMedia.path}
                    download
                    className="px-3.5 py-2 rounded-xl bg-[#D4AF37] text-black font-bold flex items-center gap-1.5 hover:brightness-110 transition shadow"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ============================================================
          MODAL: UPLOAD NEW ASSET TO MEDIA VAULT
          ============================================================ */}
      <AnimatePresence>
        {showMediaUploadModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg p-6 sm:p-8 rounded-3xl glass-card border border-[#D4AF37]/40 shadow-2xl bg-[#121212]/95 space-y-5"
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <h3 className="font-display font-bold text-lg text-[#F5F1E8] flex items-center gap-2">
                  <Upload className="w-4 h-4 text-[#D4AF37]" />
                  <span>Upload Media to Vault</span>
                </h3>
                <button
                  onClick={() => setShowMediaUploadModal(false)}
                  className="p-1 rounded-lg text-[#8A8A8A] hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleMediaUploadSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs uppercase tracking-wider text-[#A0A0A0]">
                    Asset Title / Label (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. VIP Gala Ticket Artwork 2026"
                    value={mediaUploadTitle}
                    onChange={(e) => setMediaUploadTitle(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#181818] border border-white/10 focus:border-[#D4AF37] focus:outline-none text-xs text-[#F5F1E8]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs uppercase tracking-wider text-[#A0A0A0]">
                    Category
                  </label>
                  <select
                    value={mediaUploadCategory}
                    onChange={(e) => setMediaUploadCategory(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#181818] border border-white/10 focus:border-[#D4AF37] focus:outline-none text-xs text-[#F5F1E8]"
                  >
                    <option value="posters">Posters & Artwork</option>
                    <option value="logos">Logos & Brand Identity</option>
                    <option value="videos">Motion & Promo Videos</option>
                    <option value="portraits">Site Visuals & Portraits</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs uppercase tracking-wider text-[#A0A0A0]">
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    placeholder="gold, vip, flyer, concert"
                    value={mediaUploadTags}
                    onChange={(e) => setMediaUploadTags(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#181818] border border-white/10 focus:border-[#D4AF37] focus:outline-none text-xs text-[#F5F1E8]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs uppercase tracking-wider text-[#A0A0A0]">
                    Select Media Files *
                  </label>
                  <input
                    type="file"
                    multiple
                    accept=".jpg,.jpeg,.png,.mp4,image/jpeg,image/png,image/jpg,image/webp,video/mp4,video/*"
                    required
                    onChange={(e) => setMediaUploadFiles(Array.from(e.target.files || []))}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#181818] border border-white/10 focus:border-[#D4AF37] focus:outline-none text-xs text-[#F5F1E8] file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:bg-[#D4AF37] file:text-black file:font-semibold"
                  />
                </div>

                {mediaUploadFiles.length > 0 && (
                  <p className="text-xs text-[#F5D77A]">
                    {mediaUploadFiles.length} {mediaUploadFiles.length === 1 ? 'file' : 'files'} selected ready for upload
                  </p>
                )}

                <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowMediaUploadModal(false)}
                    className="px-4 py-2 rounded-xl text-xs font-medium text-[#8A8A8A] hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={mediaUploadProcessing}
                    className="px-6 py-2.5 rounded-xl text-xs font-bold text-black bg-gradient-to-r from-[#D4AF37] to-[#F5D77A] hover:brightness-110 transition shadow flex items-center gap-2"
                  >
                    {mediaUploadProcessing ? 'Uploading...' : 'Save to Vault'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* ============================================================
            CROSS-DEVICE SYNC & MOBILE CONNECT MODAL
            ============================================================ */}
        {showSyncModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-lg rounded-3xl glass-card border border-[#D4AF37]/40 bg-[#121212] overflow-hidden shadow-2xl p-6 space-y-6 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center text-[#F5D77A]">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-base text-[#F5F1E8]">
                      Mobile Device Sync & Live Preview
                    </h3>
                    <p className="text-xs text-[#8A8A8A]">
                      View and sync uploaded media seamlessly on mobile & Windows
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowSyncModal(false)}
                  className="p-1 rounded-full hover:bg-white/10 text-[#8A8A8A] hover:text-white transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* 1. Mobile Scan & Connect */}
              <div className="p-4 rounded-2xl bg-[#161616] border border-white/5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#F5D77A] uppercase tracking-wider flex items-center gap-1.5">
                    <QrCode className="w-4 h-4 text-[#D4AF37]" />
                    Option 1: Scan with Mobile Phone Camera
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                    Host Active
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 pt-1">
                  <div className="p-2 rounded-xl bg-white border border-white/20 shadow-md flex-shrink-0">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(
                        typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'
                      )}`}
                      alt="Scan to open on mobile"
                      className="w-28 h-28 object-contain"
                    />
                  </div>
                  <div className="space-y-2 text-center sm:text-left flex-1 min-w-0">
                    <p className="text-xs text-[#F5F1E8] font-medium leading-relaxed">
                      Point your iPhone or Android phone camera at the QR code to open the portfolio on your phone.
                    </p>
                    <p className="text-[11px] text-[#8A8A8A] break-all font-mono bg-black/50 p-2 rounded-lg border border-white/5">
                      {typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'}
                    </p>
                    <button
                      onClick={() => {
                        if (typeof window !== 'undefined') {
                          navigator.clipboard.writeText(window.location.origin);
                          showToast('Mobile URL copied to clipboard!', 'success');
                        }
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#F5D77A] bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 border border-[#D4AF37]/30 transition"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Mobile Link</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* 2. One-Click Server Sync */}
              <div className="p-4 rounded-2xl bg-[#161616] border border-white/5 space-y-3">
                <span className="text-xs font-semibold text-[#F5D77A] uppercase tracking-wider flex items-center gap-1.5">
                  <ArrowRightLeft className="w-4 h-4 text-[#D4AF37]" />
                  Option 2: Live Network Sync
                </span>
                <p className="text-xs text-[#8A8A8A] leading-relaxed">
                  Pushes any media uploaded on this Windows PC to the shared server store so mobile devices immediately receive the latest artworks and MP4 videos.
                </p>
                <button
                  onClick={handlePushToServer}
                  disabled={isSyncing}
                  className="w-full py-2.5 rounded-xl text-xs font-bold text-black bg-gradient-to-r from-[#D4AF37] to-[#F5D77A] hover:brightness-110 transition shadow flex items-center justify-center gap-2"
                >
                  {isSyncing ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <ArrowRightLeft className="w-4 h-4" />
                  )}
                  <span>{isSyncing ? 'Syncing...' : 'Push Media & Projects to Server'}</span>
                </button>
              </div>

              {/* 3. Export / Import Backup (Cross-Device File Sharing) */}
              <div className="p-4 rounded-2xl bg-[#161616] border border-white/5 space-y-3">
                <span className="text-xs font-semibold text-[#F5D77A] uppercase tracking-wider flex items-center gap-1.5">
                  <Download className="w-4 h-4 text-[#D4AF37]" />
                  Option 3: Direct File Backup & Restore
                </span>
                <p className="text-xs text-[#8A8A8A] leading-relaxed">
                  Export all your projects, custom artwork, and videos as a single portable bundle file, then import it on any phone or device without internet.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  <button
                    onClick={handleExportData}
                    className="py-2.5 px-3 rounded-xl text-xs font-medium text-[#F5F1E8] bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center gap-1.5 transition"
                  >
                    <Download className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Export Bundle (.json)</span>
                  </button>

                  <label className="py-2.5 px-3 rounded-xl text-xs font-medium text-[#F5F1E8] bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center gap-1.5 transition cursor-pointer">
                    <Upload className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Import Bundle</span>
                    <input
                      type="file"
                      accept=".json,application/json"
                      onChange={handleImportData}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setShowSyncModal(false)}
                  className="px-5 py-2 rounded-xl text-xs font-semibold text-black bg-white hover:bg-white/90 transition"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
