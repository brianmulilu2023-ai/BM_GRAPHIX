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
  Calendar
} from 'lucide-react';
import { useProjects } from '../context/ProjectContext';

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

      results.forEach((item) => {
        addMediaItem({
          title: results.length === 1 && mediaUploadTitle.trim() ? mediaUploadTitle : item.name.replace(/\.[^/.]+$/, ''),
          category: mediaUploadCategory,
          type: item.isVideo ? 'video' : 'image',
          path: item.dataUrl,
          tags: mediaUploadTags ? mediaUploadTags.split(',').map(s => s.trim()) : ['custom', mediaUploadCategory]
        });
      });

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
      name: profileName,
      email: profileEmail,
      role: profileRole,
      phone: profilePhone
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

  return (
    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-28 space-y-8">
      {/* ============================================================
          TOP ADMIN HEADER & QUICK ACTIONS
          ============================================================ */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-white/10">
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.4)] flex-shrink-0 bg-black">
            <img
              src={adminUser?.avatar || '/assets/brian-mulilu.jpg'}
              alt={adminUser?.name || 'Brian Mulilu'}
              className="w-full h-full object-cover object-[center_18%]"
            />
            <span className="absolute bottom-1 right-1 w-3 h-3 rounded-full bg-green-500 border-2 border-black" />
          </div>

          <div>
            <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-[#D4AF37]/15 text-[11px] font-mono text-[#F5D77A] border border-[#D4AF37]/30 mb-1">
              <Sparkles className="w-3 h-3 text-[#D4AF37]" />
              <span>BM Graphix Central Platform</span>
            </div>
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-[#F5F1E8]">
              {adminUser?.name || 'Brian Mulilu'}
              <span className="text-xs font-normal font-sans text-[#8A8A8A] ml-2.5 px-2.5 py-0.5 rounded-md bg-white/5 border border-white/10">
                Administrator
              </span>
            </h1>
            <p className="text-xs text-[#8A8A8A] mt-0.5">
              {adminUser?.role || 'Lead Visual Designer & Creative Director'} • <span className="text-[#F5D77A]">{adminUser?.email}</span>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => navigate('/work')}
            className="px-3.5 py-2 rounded-xl text-xs font-medium text-[#F5F1E8] bg-white/5 hover:bg-white/10 border border-white/10 flex items-center gap-1.5 transition"
          >
            <Eye className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>View Live Website</span>
          </button>

          <button
            onClick={resetDefaults}
            className="px-3.5 py-2 rounded-xl text-xs font-medium text-[#8A8A8A] hover:text-[#F5F1E8] bg-white/5 hover:bg-white/10 border border-white/10 flex items-center gap-1.5 transition"
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
            className="px-3.5 py-2 rounded-xl text-xs font-semibold text-red-400 bg-red-950/40 hover:bg-red-900/50 border border-red-500/40 flex items-center gap-1.5 transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* ============================================================
          METRICS & ANALYTICS BAR
          ============================================================ */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4">
        <div
          onClick={() => setActiveTab('projects')}
          className="p-4 sm:p-5 rounded-2xl glass-card border border-white/5 hover:border-[#D4AF37]/40 cursor-pointer transition group"
        >
          <span className="text-[11px] uppercase tracking-wider text-[#8A8A8A] block mb-1">
            Projects Posted
          </span>
          <div className="flex items-center justify-between">
            <span className="font-display font-bold text-2xl sm:text-3xl text-[#F5F1E8] group-hover:text-[#F5D77A] transition">
              {projects.length}
            </span>
            <Layers className="w-5 h-5 text-[#D4AF37]" />
          </div>
        </div>

        <div
          onClick={() => setActiveTab('media')}
          className="p-4 sm:p-5 rounded-2xl glass-card border border-white/5 hover:border-[#D4AF37]/40 cursor-pointer transition group"
        >
          <span className="text-[11px] uppercase tracking-wider text-[#8A8A8A] block mb-1">
            Media Vault Assets
          </span>
          <div className="flex items-center justify-between">
            <span className="font-display font-bold text-2xl sm:text-3xl text-[#F5D77A]">
              {mediaItems.length}
            </span>
            <ImageIcon className="w-5 h-5 text-[#D4AF37]" />
          </div>
        </div>

        <div
          onClick={() => setActiveTab('inquiries')}
          className="p-4 sm:p-5 rounded-2xl glass-card border border-white/5 hover:border-[#D4AF37]/40 cursor-pointer transition group relative overflow-hidden"
        >
          {newInquiriesCount > 0 && (
            <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-[#D4AF37] text-black text-[9px] font-bold animate-pulse">
              {newInquiriesCount} NEW
            </span>
          )}
          <span className="text-[11px] uppercase tracking-wider text-[#8A8A8A] block mb-1">
            Client Inquiries
          </span>
          <div className="flex items-center justify-between">
            <span className="font-display font-bold text-2xl sm:text-3xl text-[#F5F1E8] group-hover:text-[#F5D77A] transition">
              {inquiries.length}
            </span>
            <Inbox className="w-5 h-5 text-[#D4AF37]" />
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl glass-card border border-white/5">
          <span className="text-[11px] uppercase tracking-wider text-[#8A8A8A] block mb-1">
            Total Likes
          </span>
          <div className="flex items-center justify-between">
            <span className="font-display font-bold text-2xl sm:text-3xl text-[#F5D77A]">
              {totalLikes}
            </span>
            <Heart className="w-5 h-5 text-[#D4AF37] fill-[#D4AF37]" />
          </div>
        </div>

        <div
          onClick={() => setActiveTab('comments')}
          className="p-4 sm:p-5 rounded-2xl glass-card border border-white/5 hover:border-[#D4AF37]/40 cursor-pointer transition group"
        >
          <span className="text-[11px] uppercase tracking-wider text-[#8A8A8A] block mb-1">
            Comments
          </span>
          <div className="flex items-center justify-between">
            <span className="font-display font-bold text-2xl sm:text-3xl text-[#F5F1E8] group-hover:text-[#F5D77A] transition">
              {totalComments}
            </span>
            <MessageCircle className="w-5 h-5 text-[#D4AF37]" />
          </div>
        </div>
      </div>

      {/* ============================================================
          MAIN NAVIGATION TABS
          ============================================================ */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-3 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-semibold tracking-wider whitespace-nowrap transition ${
            activeTab === 'overview'
              ? 'bg-gradient-to-r from-[#D4AF37] to-[#F5D77A] text-black shadow-md shadow-[#D4AF37]/20 font-bold'
              : 'text-[#8A8A8A] hover:text-[#F5F1E8] bg-[#141414] border border-white/5'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Overview</span>
        </button>

        <button
          onClick={() => setActiveTab('upload')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-semibold tracking-wider whitespace-nowrap transition ${
            activeTab === 'upload'
              ? 'bg-gradient-to-r from-[#D4AF37] to-[#F5D77A] text-black shadow-md shadow-[#D4AF37]/20 font-bold'
              : 'text-[#8A8A8A] hover:text-[#F5F1E8] bg-[#141414] border border-white/5'
          }`}
        >
          <FolderPlus className="w-3.5 h-3.5" />
          <span>New Project</span>
        </button>

        <button
          onClick={() => setActiveTab('projects')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-semibold tracking-wider whitespace-nowrap transition ${
            activeTab === 'projects'
              ? 'bg-gradient-to-r from-[#D4AF37] to-[#F5D77A] text-black shadow-md shadow-[#D4AF37]/20 font-bold'
              : 'text-[#8A8A8A] hover:text-[#F5F1E8] bg-[#141414] border border-white/5'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Manage Projects ({projects.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('media')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-semibold tracking-wider whitespace-nowrap transition ${
            activeTab === 'media'
              ? 'bg-gradient-to-r from-[#D4AF37] to-[#F5D77A] text-black shadow-md shadow-[#D4AF37]/20 font-bold'
              : 'text-[#8A8A8A] hover:text-[#F5F1E8] bg-[#141414] border border-white/5'
          }`}
        >
          <ImageIcon className="w-3.5 h-3.5" />
          <span>Media Vault ({mediaItems.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('inquiries')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-semibold tracking-wider whitespace-nowrap transition relative ${
            activeTab === 'inquiries'
              ? 'bg-gradient-to-r from-[#D4AF37] to-[#F5D77A] text-black shadow-md shadow-[#D4AF37]/20 font-bold'
              : 'text-[#8A8A8A] hover:text-[#F5F1E8] bg-[#141414] border border-white/5'
          }`}
        >
          <Inbox className="w-3.5 h-3.5" />
          <span>Client Inquiries ({inquiries.length})</span>
          {newInquiriesCount > 0 && (
            <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-ping" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('comments')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-semibold tracking-wider whitespace-nowrap transition ${
            activeTab === 'comments'
              ? 'bg-gradient-to-r from-[#D4AF37] to-[#F5D77A] text-black shadow-md shadow-[#D4AF37]/20 font-bold'
              : 'text-[#8A8A8A] hover:text-[#F5F1E8] bg-[#141414] border border-white/5'
          }`}
        >
          <MessageCircle className="w-3.5 h-3.5" />
          <span>Moderation ({allComments.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-semibold tracking-wider whitespace-nowrap transition ${
            activeTab === 'settings'
              ? 'bg-gradient-to-r from-[#D4AF37] to-[#F5D77A] text-black shadow-md shadow-[#D4AF37]/20 font-bold'
              : 'text-[#8A8A8A] hover:text-[#F5F1E8] bg-[#141414] border border-white/5'
          }`}
        >
          <Settings className="w-3.5 h-3.5" />
          <span>Account & Settings</span>
        </button>
      </div>

      {/* ============================================================
          TAB 1: OVERVIEW & DASHBOARD SUMMARY
          ============================================================ */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Hero Quick Action Banner */}
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

          {/* Quick 2-Column Split: Recent Projects + Latest Inquiries */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left: Recent Projects */}
            <div className="lg:col-span-7 space-y-4 p-6 rounded-3xl glass-card border border-white/10">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#D4AF37]" />
                  <h3 className="font-display font-bold text-base text-[#F5F1E8]">
                    Recent Portfolio Artworks
                  </h3>
                </div>
                <button
                  onClick={() => setActiveTab('projects')}
                  className="text-xs text-[#D4AF37] hover:underline"
                >
                  View All ({projects.length}) &rarr;
                </button>
              </div>

              <div className="space-y-2.5">
                {projects.slice(0, 5).map((project) => (
                  <div
                    key={project.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 transition"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-12 h-14 rounded-lg overflow-hidden bg-black border border-white/10 flex-shrink-0">
                        <img
                          src={project.thumbnail || (project.images && project.images[0]) || '/assets/logo/BM_OFFICIAL_LOGO.png'}
                          alt={project.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-semibold text-[#F5F1E8] truncate">
                          {project.title}
                        </h4>
                        <p className="text-[11px] text-[#8A8A8A] flex items-center gap-2 mt-0.5">
                          <span className="text-[#D4AF37]">{project.categoryLabel}</span>
                          <span>•</span>
                          <span>{project.client}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                      <div className="flex items-center gap-1 text-[11px] text-[#8A8A8A] px-2 py-1 rounded-md bg-white/5">
                        <Heart className="w-3 h-3 text-[#D4AF37] fill-[#D4AF37]" />
                        <span>{project.likes || 0}</span>
                      </div>
                      <button
                        onClick={() => openLightbox(project)}
                        className="p-1.5 rounded-lg text-[#8A8A8A] hover:text-[#F5F1E8] hover:bg-white/10"
                        title="Quick Preview"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Latest Client Leads / Inquiries */}
            <div className="lg:col-span-5 space-y-4 p-6 rounded-3xl glass-card border border-white/10">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Inbox className="w-4 h-4 text-[#25D366]" />
                  <h3 className="font-display font-bold text-base text-[#F5F1E8]">
                    Latest Inquiries & Quotes
                  </h3>
                </div>
                <button
                  onClick={() => setActiveTab('inquiries')}
                  className="text-xs text-[#D4AF37] hover:underline"
                >
                  Inbox ({inquiries.length}) &rarr;
                </button>
              </div>

              <div className="space-y-2.5">
                {inquiries.slice(0, 4).map((inq) => {
                  const cleanPhone = (inq.phone || '').replace(/[^0-9]/g, '');
                  const waUrl = `https://wa.me/${cleanPhone || '254798405726'}?text=${encodeURIComponent(`Hi ${inq.name}, thank you for reaching out to BM Graphix regarding your ${inq.serviceLabel} project.`)}`;

                  return (
                    <div
                      key={inq.id}
                      className="p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 transition space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#F5F1E8]">{inq.name}</span>
                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                          inq.status === 'new'
                            ? 'bg-[#D4AF37]/20 text-[#F5D77A] border border-[#D4AF37]/40'
                            : 'bg-white/5 text-[#8A8A8A]'
                        }`}>
                          {inq.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#A0A0A0] line-clamp-2">
                        "{inq.message}"
                      </p>
                      <div className="flex items-center justify-between pt-1 text-[10px] text-[#8A8A8A]">
                        <span>{inq.budgetLabel}</span>
                        <a
                          href={waUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#25D366] hover:underline flex items-center gap-1 font-semibold"
                        >
                          <MessageCircle className="w-3 h-3 fill-[#25D366]" />
                          <span>WhatsApp Reply</span>
                        </a>
                      </div>
                    </div>
                  );
                })}
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
                  <video
                    src={uploadedVideoDataUrl}
                    controls
                    playsInline
                    className="w-full rounded-xl border border-[#D4AF37]/30 max-h-44 bg-black"
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
                        src={media.path}
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition"
                        muted
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
                  <video
                    src={previewMedia.path}
                    controls
                    autoPlay
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
      </AnimatePresence>
    </div>
  );
}
