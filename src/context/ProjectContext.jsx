import React, { createContext, useContext, useState, useEffect } from 'react';
import { projectService } from '../services/projectService';
import { adminService } from '../services/adminService';
import { mediaService } from '../services/mediaService';
import { inquiryService } from '../services/inquiryService';

const ProjectContext = createContext(null);

export function ProjectProvider({ children }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [lightboxProject, setLightboxProject] = useState(null);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminUser, setAdminUser] = useState(() => adminService.getAdminAccount());
  const [siteSettings, setSiteSettings] = useState(() => adminService.getSiteSettings());
  const [mediaItems, setMediaItems] = useState(() => mediaService.getAllMedia());
  const [inquiries, setInquiries] = useState(() => inquiryService.getInquiries());
  const [toast, setToast] = useState(null);

  // Load projects, media, inquiries, and admin auth state
  useEffect(() => {
    loadProjects();
    setIsAdminLoggedIn(adminService.isAuthenticated());
    setAdminUser(adminService.getAdminAccount());
    setSiteSettings(adminService.getSiteSettings());
    setMediaItems(mediaService.getAllMedia());
    setInquiries(inquiryService.getInquiries());
  }, []);

  const showToast = (message, type = 'gold') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => setToast(null), 3500);
  };

  const loadProjects = async () => {
    try {
      setLoading(true);
      const data = await projectService.getProjects();
      setProjects(data);
    } catch (err) {
      console.error(err);
      showToast('Error loading projects', 'error');
    } finally {
      setLoading(false);
    }
  };

  const openLightbox = (project) => {
    setLightboxProject(project);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxProject(null);
    document.body.style.overflow = 'auto';
  };

  const handleToggleLike = async (projectId) => {
    try {
      const result = await projectService.toggleLike(projectId);
      setProjects((prev) =>
        prev.map((p) =>
          p.id === projectId ? { ...p, likes: result.likes } : p
        )
      );
      if (lightboxProject && lightboxProject.id === projectId) {
        setLightboxProject((prev) => ({ ...prev, likes: result.likes }));
      }
      return result;
    } catch (err) {
      console.error(err);
      showToast('Could not register like', 'error');
      return null;
    }
  };

  const handleAddComment = async (projectId, commentData) => {
    try {
      const newComment = await projectService.addComment(projectId, commentData);
      setProjects((prev) =>
        prev.map((p) =>
          p.id === projectId
            ? { ...p, comments: [newComment, ...(p.comments || [])] }
            : p
        )
      );
      if (lightboxProject && lightboxProject.id === projectId) {
        setLightboxProject((prev) => ({
          ...prev,
          comments: [newComment, ...(prev.comments || [])]
        }));
      }
      showToast('Comment posted successfully!', 'success');
      return newComment;
    } catch (err) {
      console.error(err);
      showToast(err.message || 'Error posting comment', 'error');
      throw err;
    }
  };

  const handleDeleteComment = async (projectId, commentId) => {
    try {
      await projectService.deleteComment(projectId, commentId);
      setProjects((prev) =>
        prev.map((p) =>
          p.id === projectId
            ? { ...p, comments: (p.comments || []).filter((c) => c.id !== commentId) }
            : p
        )
      );
      if (lightboxProject && lightboxProject.id === projectId) {
        setLightboxProject((prev) => ({
          ...prev,
          comments: (prev.comments || []).filter((c) => c.id !== commentId)
        }));
      }
      showToast('Comment deleted', 'gold');
    } catch (err) {
      console.error(err);
      showToast('Error deleting comment', 'error');
    }
  };

  const handleAddProject = async (projectData) => {
    try {
      const created = await projectService.addProject(projectData);
      setProjects((prev) => [created, ...prev]);
      showToast(`Project "${created.title}" published!`, 'success');
      return created;
    } catch (err) {
      console.error(err);
      showToast('Error uploading project', 'error');
      throw err;
    }
  };

  const handleUpdateProject = async (id, updatedFields) => {
    try {
      const updated = await projectService.updateProject(id, updatedFields);
      setProjects((prev) =>
        prev.map((p) => (p.id === id ? updated : p))
      );
      showToast('Project updated successfully!', 'success');
      return updated;
    } catch (err) {
      console.error(err);
      showToast('Error updating project', 'error');
      throw err;
    }
  };

  const handleDeleteProject = async (id) => {
    try {
      await projectService.deleteProject(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
      showToast('Project deleted successfully', 'gold');
      if (lightboxProject && lightboxProject.id === id) {
        closeLightbox();
      }
    } catch (err) {
      console.error(err);
      showToast('Error deleting project', 'error');
    }
  };

  const handleResetDefaults = async () => {
    const defaults = await projectService.resetToDefaults();
    setProjects(defaults);
    showToast('Reset to default portfolio projects', 'gold');
  };

  // --- Admin Authentication & Account Actions ---
  const adminLogin = (email, password) => {
    const result = adminService.login(email, password);
    if (result.success) {
      setIsAdminLoggedIn(true);
      setAdminUser(result.admin);
      showToast(`Welcome back, ${result.admin.name}! Admin unlocked.`, 'gold');
      return true;
    }
    showToast(result.error || 'Invalid admin credentials', 'error');
    return false;
  };

  const adminLogout = () => {
    adminService.logout();
    setIsAdminLoggedIn(false);
    showToast('Logged out from admin portal', 'gold');
  };

  const handleUpdateAdminProfile = (profileData) => {
    try {
      const updated = adminService.updateAdminAccount(profileData);
      setAdminUser(updated);
      showToast('Admin profile updated!', 'success');
      return updated;
    } catch (err) {
      showToast(err.message || 'Error updating profile', 'error');
      throw err;
    }
  };

  const handleUpdateAdminPassword = (newPass) => {
    try {
      adminService.updatePassword(newPass);
      setAdminUser(adminService.getAdminAccount());
      showToast('Admin password updated successfully!', 'success');
      return true;
    } catch (err) {
      showToast(err.message || 'Error updating password', 'error');
      throw err;
    }
  };

  const handleUpdateSiteSettings = (settingsData) => {
    try {
      const updated = adminService.updateSiteSettings(settingsData);
      setSiteSettings(updated);
      showToast('Website settings updated!', 'success');
      return updated;
    } catch (err) {
      showToast(err.message || 'Error updating settings', 'error');
      throw err;
    }
  };

  // --- Media Vault Actions ---
  const handleAddMediaItem = (item) => {
    try {
      const created = mediaService.addMediaItem(item);
      setMediaItems(mediaService.getAllMedia());
      showToast(`Media "${created.title}" added to vault!`, 'success');
      return created;
    } catch (err) {
      console.error(err);
      showToast('Error adding media', 'error');
      throw err;
    }
  };

  const handleDeleteMediaItem = (id) => {
    try {
      mediaService.deleteMediaItem(id);
      setMediaItems(mediaService.getAllMedia());
      showToast('Custom media removed from vault', 'gold');
    } catch (err) {
      console.error(err);
      showToast('Error removing media item', 'error');
    }
  };

  // --- Inquiries Actions ---
  const handleAddInquiry = (formData) => {
    try {
      const created = inquiryService.addInquiry(formData);
      setInquiries(inquiryService.getInquiries());
      return created;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const handleMarkInquiryStatus = (id, status) => {
    try {
      const updated = inquiryService.markStatus(id, status);
      setInquiries(updated);
      showToast(`Inquiry marked as ${status}`, 'gold');
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteInquiry = (id) => {
    try {
      const updated = inquiryService.deleteInquiry(id);
      setInquiries(updated);
      showToast('Inquiry removed', 'gold');
    } catch (err) {
      console.error(err);
      showToast('Error deleting inquiry', 'error');
    }
  };

  // Filtered and searched projects
  const filteredProjects = projects.filter((p) => {
    const matchesCategory =
      activeFilter === 'all' ? true : p.category === activeFilter;
    const query = searchQuery.trim().toLowerCase();
    if (!query) return matchesCategory;

    const matchesSearch =
      p.title.toLowerCase().includes(query) ||
      (p.description && p.description.toLowerCase().includes(query)) ||
      (p.categoryLabel && p.categoryLabel.toLowerCase().includes(query)) ||
      (p.tools && p.tools.some((t) => t.toLowerCase().includes(query))) ||
      (p.client && p.client.toLowerCase().includes(query));

    return matchesCategory && matchesSearch;
  });

  return (
    <ProjectContext.Provider
      value={{
        projects,
        filteredProjects,
        loading,
        activeFilter,
        setActiveFilter,
        searchQuery,
        setSearchQuery,
        lightboxProject,
        openLightbox,
        closeLightbox,
        toggleLike: handleToggleLike,
        addComment: handleAddComment,
        deleteComment: handleDeleteComment,
        addProject: handleAddProject,
        updateProject: handleUpdateProject,
        deleteProject: handleDeleteProject,
        resetDefaults: handleResetDefaults,
        isProjectLiked: (id) => projectService.isProjectLiked(id),

        // Admin Auth & Profile
        isAdminLoggedIn,
        adminUser,
        adminLogin,
        adminLogout,
        updateAdminProfile: handleUpdateAdminProfile,
        updateAdminPassword: handleUpdateAdminPassword,

        // Site Settings
        siteSettings,
        updateSiteSettings: handleUpdateSiteSettings,

        // Media Vault
        mediaItems,
        addMediaItem: handleAddMediaItem,
        deleteMediaItem: handleDeleteMediaItem,

        // Inquiries & Client Leads
        inquiries,
        addInquiry: handleAddInquiry,
        markInquiryStatus: handleMarkInquiryStatus,
        deleteInquiry: handleDeleteInquiry,

        // Toast Feedback
        toast,
        showToast
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export const useProjects = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
};
