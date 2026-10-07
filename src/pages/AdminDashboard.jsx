import React, { useState } from 'react';
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
  ShieldAlert
} from 'lucide-react';
import { useProjects } from '../context/ProjectContext';

export default function AdminDashboard({ navigate }) {
  const {
    projects,
    isAdminLoggedIn,
    adminLogout,
    addProject,
    updateProject,
    deleteProject,
    deleteComment,
    openLightbox,
    resetDefaults,
    showToast
  } = useProjects();

  const [activeTab, setActiveTab] = useState('upload'); // 'upload' | 'projects' | 'comments'
  const [editingProject, setEditingProject] = useState(null);

  // Form State for new project
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('posters');
  const [client, setClient] = useState('');
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [description, setDescription] = useState('');
  const [toolsInput, setToolsInput] = useState('Photoshop, Illustrator');
  const [videoUrl, setVideoUrl] = useState('');
  const [featured, setFeatured] = useState(false);

  // Multi-image upload state
  const [uploadedImages, setUploadedImages] = useState([]);
  const [thumbnailIndex, setThumbnailIndex] = useState(0);
  const [isProcessingFiles, setIsProcessingFiles] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // Guard: Viewers must never see admin controls
  if (!isAdminLoggedIn) {
    return (
      <div className="relative z-10 min-h-[75vh] flex items-center justify-center px-4 pt-32 pb-24 text-center">
        <div className="max-w-md p-8 rounded-3xl glass-card border border-red-500/30 space-y-4">
          <ShieldAlert className="w-12 h-12 text-red-400 mx-auto" />
          <h2 className="font-display font-bold text-2xl text-[#F5F1E8]">Admin Area Restricted</h2>
          <p className="text-xs text-[#8A8A8A]">
            You must be logged in as an administrator to access the project management dashboard.
          </p>
          <button
            onClick={() => navigate('/admin/login')}
            className="px-6 py-2.5 rounded-full text-xs font-semibold text-black bg-[#D4AF37] hover:bg-[#F5D77A] transition"
          >
            Go To Admin Login &rarr;
          </button>
        </div>
      </div>
    );
  }

  // Handle file uploads (guaranteed to process all files)
  const handleFiles = (files) => {
    if (!files || files.length === 0) return;
    const fileList = Array.from(files);

    setIsProcessingFiles(true);
    setUploadProgress(10);

    const readers = fileList.map((file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = (e) => reject(e);
        reader.readAsDataURL(file);
      });
    });

    let completed = 0;
    const interval = setInterval(() => {
      completed += 15;
      setUploadProgress((p) => Math.min(p + 20, 90));
    }, 100);

    Promise.all(readers)
      .then((dataUrls) => {
        clearInterval(interval);
        setUploadProgress(100);
        setTimeout(() => {
          setUploadedImages((prev) => [...prev, ...dataUrls]);
          setIsProcessingFiles(false);
          setUploadProgress(0);
          showToast(`Successfully added ${dataUrls.length} ${dataUrls.length === 1 ? 'image' : 'images'}!`, 'success');
        }, 300);
      })
      .catch((err) => {
        clearInterval(interval);
        setIsProcessingFiles(false);
        setUploadProgress(0);
        showToast('Error reading uploaded files', 'error');
        console.error(err);
      });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer && e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
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

    if (uploadedImages.length === 0 && !videoUrl.trim()) {
      showToast('Please upload at least one image or provide a video URL', 'error');
      return;
    }

    try {
      const selectedThumbnail = uploadedImages[thumbnailIndex] || uploadedImages[0] || '/assets/BM_BLCK.png';
      await addProject({
        title,
        category,
        client: client || 'Commissioned Work',
        year: year || '2024',
        description,
        tools: toolsInput,
        featured,
        thumbnail: selectedThumbnail,
        images: uploadedImages.length > 0 ? uploadedImages : [selectedThumbnail],
        videoUrl: videoUrl.trim() || null
      });

      // Reset form
      setTitle('');
      setClient('');
      setDescription('');
      setVideoUrl('');
      setUploadedImages([]);
      setThumbnailIndex(0);
      setFeatured(false);
      setActiveTab('projects');
    } catch {
      // Error handled in context
    }
  };

  // Total stats
  const totalLikes = projects.reduce((acc, p) => acc + (p.likes || 0), 0);
  const totalComments = projects.reduce((acc, p) => acc + (p.comments ? p.comments.length : 0), 0);

  // All comments aggregated
  const allComments = projects.flatMap((p) =>
    (p.comments || []).map((c) => ({
      ...c,
      projectId: p.id,
      projectTitle: p.title
    }))
  );

  return (
    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-28 space-y-10">
      {/* Top Admin Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/15 text-xs font-mono text-[#F5D77A] border border-[#D4AF37]/30 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>BM Graphix Control Panel</span>
          </div>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-[#F5F1E8]">
            Creator Dashboard
          </h1>
          <p className="text-xs text-[#8A8A8A] mt-1">
            Logged in as <strong className="text-[#F5F1E8]">Brian Mulilu (Admin)</strong>. Manage artworks, uploads, and comments.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => navigate('/work')}
            className="px-4 py-2 rounded-xl text-xs font-medium text-[#F5F1E8] bg-white/5 hover:bg-white/10 border border-white/10 flex items-center gap-1.5 transition"
          >
            <Eye className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>View Live Site</span>
          </button>

          <button
            onClick={resetDefaults}
            className="px-4 py-2 rounded-xl text-xs font-medium text-[#8A8A8A] hover:text-[#F5F1E8] bg-white/5 hover:bg-white/10 border border-white/10 flex items-center gap-1.5 transition"
            title="Reset to default 10 sample projects"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Samples</span>
          </button>

          <button
            onClick={() => {
              adminLogout();
              navigate('/admin/login');
            }}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-red-400 bg-red-950/30 hover:bg-red-900/40 border border-red-500/30 flex items-center gap-1.5 transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Top Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl glass-card border border-white/5">
          <span className="text-xs uppercase tracking-wider text-[#8A8A8A] block mb-1">
            Total Projects
          </span>
          <div className="flex items-center justify-between">
            <span className="font-display font-bold text-3xl text-[#F5F1E8]">
              {projects.length}
            </span>
            <Layers className="w-6 h-6 text-[#D4AF37]" />
          </div>
        </div>

        <div className="p-5 rounded-2xl glass-card border border-white/5">
          <span className="text-xs uppercase tracking-wider text-[#8A8A8A] block mb-1">
            Total Likes
          </span>
          <div className="flex items-center justify-between">
            <span className="font-display font-bold text-3xl text-[#F5F77A] text-[#F5D77A]">
              {totalLikes}
            </span>
            <Heart className="w-6 h-6 text-[#D4AF37] fill-[#D4AF37]" />
          </div>
        </div>

        <div className="p-5 rounded-2xl glass-card border border-white/5">
          <span className="text-xs uppercase tracking-wider text-[#8A8A8A] block mb-1">
            Total Comments
          </span>
          <div className="flex items-center justify-between">
            <span className="font-display font-bold text-3xl text-[#F5F1E8]">
              {totalComments}
            </span>
            <MessageCircle className="w-6 h-6 text-[#D4AF37]" />
          </div>
        </div>

        <div className="p-5 rounded-2xl glass-card border border-white/5">
          <span className="text-xs uppercase tracking-wider text-[#8A8A8A] block mb-1">
            Featured Projects
          </span>
          <div className="flex items-center justify-between">
            <span className="font-display font-bold text-3xl text-[#F5D77A]">
              {projects.filter((p) => p.featured).length}
            </span>
            <Star className="w-6 h-6 text-[#D4AF37]" />
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-4">
        <button
          onClick={() => setActiveTab('upload')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold tracking-wider transition ${
            activeTab === 'upload'
              ? 'bg-gradient-to-r from-[#D4AF37] to-[#F5D77A] text-black shadow-md'
              : 'text-[#8A8A8A] hover:text-[#F5F1E8] bg-[#141414] border border-white/5'
          }`}
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Upload Project</span>
        </button>

        <button
          onClick={() => setActiveTab('projects')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold tracking-wider transition ${
            activeTab === 'projects'
              ? 'bg-gradient-to-r from-[#D4AF37] to-[#F5D77A] text-black shadow-md'
              : 'text-[#8A8A8A] hover:text-[#F5F1E8] bg-[#141414] border border-white/5'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Manage Projects ({projects.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('comments')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold tracking-wider transition ${
            activeTab === 'comments'
              ? 'bg-gradient-to-r from-[#D4AF37] to-[#F5D77A] text-black shadow-md'
              : 'text-[#8A8A8A] hover:text-[#F5F1E8] bg-[#141414] border border-white/5'
          }`}
        >
          <MessageCircle className="w-3.5 h-3.5" />
          <span>Moderation ({allComments.length})</span>
        </button>
      </div>

      {/* TAB 1: UPLOAD NEW PROJECT */}
      {activeTab === 'upload' && (
        <form onSubmit={handleCreateProject} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Col: Metadata */}
            <div className="lg:col-span-6 space-y-5 p-6 rounded-3xl glass-card border border-white/10">
              <h3 className="font-display font-bold text-lg text-[#F5F1E8] border-b border-white/5 pb-3">
                Project Information
              </h3>

              <div className="space-y-1.5">
                <label className="block text-xs uppercase tracking-wider text-[#F5F1E8] font-medium">
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
                  <label className="block text-xs uppercase tracking-wider text-[#F5F1E8] font-medium">
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
                  <label className="block text-xs uppercase tracking-wider text-[#F5F1E8] font-medium">
                    Year
                  </label>
                  <input
                    type="text"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#161616] border border-white/10 focus:border-[#D4AF37] focus:outline-none text-xs text-[#F5F1E8]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs uppercase tracking-wider text-[#F5F1E8] font-medium">
                  Client / Brand Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Royal Media Services / Independent Artist"
                  value={client}
                  onChange={(e) => setClient(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#161616] border border-white/10 focus:border-[#D4AF37] focus:outline-none text-xs text-[#F5F1E8]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs uppercase tracking-wider text-[#F5F1E8] font-medium">
                  Tools Used (comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Photoshop, Illustrator, Cinema 4D, After Effects"
                  value={toolsInput}
                  onChange={(e) => setToolsInput(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#161616] border border-white/10 focus:border-[#D4AF37] focus:outline-none text-xs text-[#F5F1E8]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs uppercase tracking-wider text-[#F5F1E8] font-medium">
                  Video URL (Optional for motion/promos)
                </label>
                <div className="relative">
                  <Film className="w-4 h-4 text-[#8A8A8A] absolute left-3.5 top-3.5" />
                  <input
                    type="url"
                    placeholder="https://...mp4 or Vimeo/YouTube video"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#161616] border border-white/10 focus:border-[#D4AF37] focus:outline-none text-xs text-[#F5F1E8]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs uppercase tracking-wider text-[#F5F1E8] font-medium">
                  Detailed Project Description
                </label>
                <textarea
                  rows={4}
                  placeholder="Artistic rationale, typography decisions, color grading and campaign impact..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#161616] border border-white/10 focus:border-[#D4AF37] focus:outline-none text-xs text-[#F5F1E8]"
                />
              </div>

              <div className="pt-2 flex items-center gap-3">
                <input
                  type="checkbox"
                  id="featuredToggle"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-700 text-[#D4AF37] focus:ring-[#D4AF37]"
                />
                <label htmlFor="featuredToggle" className="text-xs text-[#F5F1E8] font-medium cursor-pointer">
                  Feature this project on Homepage (Top 6 Spotlight)
                </label>
              </div>
            </div>

            {/* Right Col: Drag & Drop Multi-Image Upload */}
            <div className="lg:col-span-6 space-y-5 p-6 rounded-3xl glass-card border border-white/10 flex flex-col">
              <h3 className="font-display font-bold text-lg text-[#F5F1E8] border-b border-white/5 pb-3">
                Artwork & Media Files
              </h3>

              {/* Drag and Drop Zone */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${
                  isDragging
                    ? 'border-[#D4AF37] bg-[#D4AF37]/10 scale-[1.01]'
                    : 'border-white/15 bg-[#141414] hover:border-[#D4AF37]/50'
                }`}
              >
                <input
                  type="file"
                  id="multiImageInput"
                  multiple
                  accept="image/*"
                  onChange={(e) => handleFiles(e.target.files)}
                  className="hidden"
                />

                <div className="flex flex-col items-center justify-center space-y-3 pointer-events-none">
                  <div className="w-14 h-14 rounded-2xl bg-black border border-[#D4AF37]/40 flex items-center justify-center text-[#F5D77A] shadow-lg">
                    <Upload className="w-7 h-7" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#F5F1E8]">
                      Drag and drop artworks here
                    </p>
                    <p className="text-xs text-[#8A8A8A] mt-1">
                      Supports PNG, JPG, JPEG, WEBP. Select multiple files at once.
                    </p>
                  </div>
                </div>

                <label
                  htmlFor="multiImageInput"
                  className="mt-4 inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-black bg-[#D4AF37] hover:bg-[#F5D77A] cursor-pointer transition shadow-md"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Browse Files</span>
                </label>

                {/* Progress bar */}
                {isProcessingFiles && (
                  <div className="mt-6 space-y-2">
                    <div className="h-1.5 w-full bg-neutral-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#D4AF37] to-[#F5D77A] transition-all duration-200"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                    <p className="text-[11px] text-[#F5D77A]">Processing all files... {uploadProgress}%</p>
                  </div>
                )}
              </div>

              {/* Uploaded Images Preview List */}
              <div className="flex-1 space-y-3">
                <div className="flex items-center justify-between text-xs text-[#8A8A8A]">
                  <span>Uploaded Artworks ({uploadedImages.length})</span>
                  {uploadedImages.length > 0 && (
                    <span className="text-[11px] text-[#D4AF37]">
                      Click "Set Cover" to choose the main thumbnail
                    </span>
                  )}
                </div>

                {uploadedImages.length === 0 ? (
                  <div className="p-8 border border-white/5 rounded-2xl text-center text-xs text-[#8A8A8A] italic">
                    No images added yet. Add files via drag & drop or browse above.
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-64 overflow-y-auto p-2">
                    {uploadedImages.map((imgSrc, idx) => (
                      <div
                        key={idx}
                        className={`relative rounded-xl overflow-hidden border-2 group aspect-[3/4] bg-black ${
                          thumbnailIndex === idx ? 'border-[#D4AF37] shadow-[0_0_12px_#D4AF37]' : 'border-white/10'
                        }`}
                      >
                        <img src={imgSrc} alt="" className="w-full h-full object-cover" />

                        {/* Badges & Actions */}
                        {thumbnailIndex === idx && (
                          <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-[#D4AF37] text-black text-[9px] font-bold uppercase tracking-wider shadow">
                            Cover
                          </span>
                        )}

                        <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center gap-2 p-2">
                          {thumbnailIndex !== idx && (
                            <button
                              type="button"
                              onClick={() => setThumbnailIndex(idx)}
                              className="px-2 py-1 rounded bg-[#D4AF37] text-black text-[10px] font-semibold"
                            >
                              Set Cover
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => removeUploadedImage(idx)}
                            className="p-1.5 rounded-full bg-red-600/80 text-white hover:bg-red-600"
                            title="Remove Image"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-4 border-t border-white/5">
                <button
                  type="submit"
                  className="w-full py-4 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider text-black bg-gradient-to-r from-[#D4AF37] via-[#F5D77A] to-[#B8860B] shadow-[0_0_25px_rgba(212,175,55,0.3)] hover:scale-[1.01] active:scale-[0.99] transition flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Publish Project to Portfolio</span>
                </button>
              </div>
            </div>
          </div>
        </form>
      )}

      {/* TAB 2: MANAGE PROJECTS */}
      {activeTab === 'projects' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((proj) => (
              <div
                key={proj.id}
                className="rounded-2xl glass-card border border-white/10 overflow-hidden flex flex-col justify-between"
              >
                <div className="relative aspect-[16/10] bg-black overflow-hidden">
                  <img
                    src={proj.thumbnail || (proj.images && proj.images[0])}
                    alt={proj.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 flex items-center gap-1.5">
                    <span className="px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-[10px] font-mono uppercase text-[#F5D77A] border border-[#D4AF37]/30">
                      {proj.category}
                    </span>
                    {proj.featured && (
                      <span className="px-2 py-0.5 rounded-full bg-[#D4AF37] text-black text-[9px] font-bold uppercase">
                        Featured
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-display font-bold text-base text-[#F5F1E8] line-clamp-1">
                      {proj.title}
                    </h3>
                    <p className="text-xs text-[#8A8A8A] line-clamp-2 mt-1">
                      {proj.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs text-[#8A8A8A]">
                    <span className="flex items-center gap-1">
                      <Heart className="w-3.5 h-3.5 text-[#D4AF37] fill-[#D4AF37]" />
                      {proj.likes || 0} Likes
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="w-3.5 h-3.5 text-[#8A8A8A]" />
                      {(proj.comments || []).length} Comments
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 flex items-center gap-2">
                    <button
                      onClick={() => openLightbox(proj)}
                      className="flex-1 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-medium text-[#F5F1E8] flex items-center justify-center gap-1"
                    >
                      <Eye className="w-3 h-3 text-[#D4AF37]" />
                      <span>View</span>
                    </button>
                    <button
                      onClick={() => setEditingProject(proj)}
                      className="flex-1 py-2 rounded-lg bg-[#D4AF37]/15 hover:bg-[#D4AF37]/25 text-xs font-medium text-[#F5D77A] border border-[#D4AF37]/30 flex items-center justify-center gap-1"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`Delete project "${proj.title}"?`)) {
                          deleteProject(proj.id);
                        }
                      }}
                      className="p-2 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-500/20"
                      title="Delete Project"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: COMMENTS MODERATION */}
      {activeTab === 'comments' && (
        <div className="space-y-4">
          <div className="p-6 rounded-3xl glass-card border border-white/10 space-y-4">
            <h3 className="font-display font-bold text-lg text-[#F5F1E8]">
              Public Comments Moderation
            </h3>
            <p className="text-xs text-[#8A8A8A]">
              Review and moderate feedback left on your artworks. You can delete any spam or inappropriate comments.
            </p>

            {allComments.length === 0 ? (
              <div className="py-12 text-center text-xs text-[#8A8A8A] italic">
                No comments submitted yet.
              </div>
            ) : (
              <div className="space-y-3">
                {allComments.map((comm) => (
                  <div
                    key={comm.id}
                    className="p-4 rounded-xl bg-[#141414] border border-white/5 flex items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-xs text-[#F5D77A]">
                          {comm.name}
                        </span>
                        <span className="text-[10px] text-[#8A8A8A]">
                          on project <strong className="text-[#F5F1E8]">"{comm.projectTitle}"</strong>
                        </span>
                        <span className="text-[10px] text-[#8A8A8A]">({comm.date})</span>
                      </div>
                      <p className="text-xs text-[#E5E1D8]">{comm.text}</p>
                    </div>

                    <button
                      onClick={() => {
                        if (window.confirm(`Delete comment from ${comm.name}?`)) {
                          deleteComment(comm.projectId, comm.id);
                        }
                      }}
                      className="p-2 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-500/20 flex items-center gap-1 text-xs shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* EDIT PROJECT MODAL */}
      <AnimatePresence>
        {editingProject && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xl p-4 overflow-y-auto"
            onClick={() => setEditingProject(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-xl p-6 sm:p-8 rounded-3xl bg-[#121212] border border-[#D4AF37]/40 shadow-2xl space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="font-display font-bold text-xl text-[#F5F1E8]">
                  Edit Project
                </h3>
                <button
                  onClick={() => setEditingProject(null)}
                  className="p-1 rounded text-[#8A8A8A] hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="text-[#8A8A8A] uppercase tracking-wider font-semibold">
                    Title
                  </label>
                  <input
                    type="text"
                    value={editingProject.title}
                    onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#181818] border border-white/10 focus:border-[#D4AF37] focus:outline-none text-[#F5F1E8]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[#8A8A8A] uppercase tracking-wider font-semibold">
                      Category
                    </label>
                    <select
                      value={editingProject.category}
                      onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-[#181818] border border-white/10 text-[#F5F1E8]"
                    >
                      <option value="posters">Poster & Flyer Design</option>
                      <option value="branding">Logos & Branding</option>
                      <option value="motion">Motion Graphics</option>
                      <option value="videos">Video Promo Animation</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[#8A8A8A] uppercase tracking-wider font-semibold">
                      Client
                    </label>
                    <input
                      type="text"
                      value={editingProject.client || ''}
                      onChange={(e) => setEditingProject({ ...editingProject, client: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-[#181818] border border-white/10 text-[#F5F1E8]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[#8A8A8A] uppercase tracking-wider font-semibold">
                    Tools (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={Array.isArray(editingProject.tools) ? editingProject.tools.join(', ') : editingProject.tools}
                    onChange={(e) => setEditingProject({ ...editingProject, tools: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#181818] border border-white/10 text-[#F5F1E8]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[#8A8A8A] uppercase tracking-wider font-semibold">
                    Video URL
                  </label>
                  <input
                    type="url"
                    value={editingProject.videoUrl || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, videoUrl: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#181818] border border-white/10 text-[#F5F1E8]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[#8A8A8A] uppercase tracking-wider font-semibold">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={editingProject.description}
                    onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#181818] border border-white/10 text-[#F5F1E8]"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="editFeatured"
                    checked={editingProject.featured || false}
                    onChange={(e) => setEditingProject({ ...editingProject, featured: e.target.checked })}
                    className="w-4 h-4 rounded text-[#D4AF37]"
                  />
                  <label htmlFor="editFeatured" className="text-xs text-[#F5F1E8] cursor-pointer">
                    Featured on Home Page
                  </label>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setEditingProject(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#8A8A8A] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    await updateProject(editingProject.id, editingProject);
                    setEditingProject(null);
                  }}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-black bg-gradient-to-r from-[#D4AF37] to-[#F5D77A] shadow-md"
                >
                  Save Changes
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
