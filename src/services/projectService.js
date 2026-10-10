import { INITIAL_PROJECTS } from '../data/projects';
import { storageDB } from '../utils/storageDB';
import {
  fetchServerProjects,
  saveServerProjects,
  uploadMediaToServer
} from '../utils/apiSync';

const STORAGE_KEY = 'bm_graphix_projects_v1';
const LIKES_KEY = 'bm_graphix_user_likes_v1';

/**
 * Project Service Layer
 * Decouples the UI from the persistence layer.
 * Uses Server API + IndexedDB as primary high-capacity storage for high-resolution artworks & MP4 videos,
 * syncing seamlessly across Windows desktop and mobile devices.
 */

class ProjectService {
  constructor() {
    this.initStorage();
  }

  async initStorage() {
    if (typeof window === 'undefined') return;
    try {
      // Check server first for cross-device synchronization
      const serverProjects = await fetchServerProjects();
      if (Array.isArray(serverProjects) && serverProjects.length > 0) {
        await storageDB.set(STORAGE_KEY, serverProjects);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(serverProjects));
        } catch {
          // ignore
        }
        return;
      }

      const dbProjects = await storageDB.get(STORAGE_KEY);
      const local = localStorage.getItem(STORAGE_KEY);
      if (!dbProjects && !local) {
        await storageDB.set(STORAGE_KEY, INITIAL_PROJECTS);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_PROJECTS));
        } catch {
          // ignore
        }
      } else if (local && !dbProjects) {
        try {
          const parsed = JSON.parse(local);
          await storageDB.set(STORAGE_KEY, parsed);
        } catch {
          // ignore
        }
      }

      const likes = localStorage.getItem(LIKES_KEY);
      if (!likes) {
        localStorage.setItem(LIKES_KEY, JSON.stringify([]));
      }
    } catch (e) {
      console.warn('initStorage notice:', e);
    }
  }

  async saveProjects(projects) {
    // 1. Save to high-capacity IndexedDB (stores 50MB+ MP4 videos and images smoothly)
    await storageDB.set(STORAGE_KEY, projects);

    // 2. Best-effort mirror to localStorage
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    } catch (e) {
      // Quota reached on localStorage is safely handled because IndexedDB has the data
      console.info('Media safely stored in IndexedDB store');
    }

    // 3. Mirror to server API so mobile devices and Windows desktop stay synchronized!
    try {
      await saveServerProjects(projects);
    } catch {
      // ignore
    }
  }

  // Get all projects
  async getProjects() {
    try {
      // Check server first so mobile device gets what was uploaded on Windows!
      const serverProjects = await fetchServerProjects();
      if (Array.isArray(serverProjects) && serverProjects.length > 0) {
        await storageDB.set(STORAGE_KEY, serverProjects);
        return serverProjects;
      }

      const dbProjects = await storageDB.get(STORAGE_KEY);
      if (Array.isArray(dbProjects) && dbProjects.length > 0) {
        return dbProjects;
      }
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) {
          storageDB.set(STORAGE_KEY, parsed);
          return parsed;
        }
      }
      return INITIAL_PROJECTS;
    } catch (e) {
      console.error('Error fetching projects from storage:', e);
      return INITIAL_PROJECTS;
    }
  }

  // Get single project
  async getProjectById(id) {
    const projects = await this.getProjects();
    return projects.find((p) => p.id === id || p.slug === id) || null;
  }

  // Add project (supports multiple images and video, uploaded cleanly to server)
  async addProject(projectData) {
    const projects = await this.getProjects();
    const newId = `proj-${Date.now()}`;
    const slug = (projectData.title || 'project')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    // Process media: upload to server to get real static URLs for mobile compatibility
    let finalThumbnail = projectData.thumbnail;
    if (finalThumbnail && finalThumbnail.startsWith('data:')) {
      finalThumbnail = await uploadMediaToServer(finalThumbnail, `${slug}-thumb`);
    }

    let finalImages = [];
    const sourceImages = Array.isArray(projectData.images) && projectData.images.length > 0
      ? projectData.images
      : [finalThumbnail || '/assets/BM_BLCK.png'];

    for (let i = 0; i < sourceImages.length; i++) {
      let img = sourceImages[i];
      if (img && img.startsWith('data:')) {
        img = await uploadMediaToServer(img, `${slug}-img-${i}`);
      }
      finalImages.push(img);
    }

    let finalVideoUrl = projectData.videoUrl || null;
    if (finalVideoUrl && finalVideoUrl.startsWith('data:')) {
      finalVideoUrl = await uploadMediaToServer(finalVideoUrl, `${slug}-video.mp4`);
    }

    const newProject = {
      id: newId,
      slug: `${slug}-${Math.floor(Math.random() * 1000)}`,
      title: projectData.title,
      category: projectData.category || 'posters',
      categoryLabel: projectData.categoryLabel || this.getCategoryLabel(projectData.category),
      client: projectData.client || 'Commissioned Project',
      year: projectData.year || new Date().getFullYear().toString(),
      featured: Boolean(projectData.featured),
      thumbnail: finalThumbnail || finalImages[0] || '/assets/BM_BLCK.png',
      images: finalImages,
      videoUrl: finalVideoUrl,
      description: projectData.description || '',
      tools: Array.isArray(projectData.tools) 
        ? projectData.tools 
        : (typeof projectData.tools === 'string' ? projectData.tools.split(',').map(s => s.trim()).filter(Boolean) : ['Photoshop']),
      aspectRatio: projectData.aspectRatio || 'aspect-[4/5]',
      likes: 0,
      comments: [],
      createdAt: new Date().toISOString()
    };

    const updated = [newProject, ...projects];
    await this.saveProjects(updated);
    return newProject;
  }

  // Update existing project
  async updateProject(id, updatedFields) {
    const projects = await this.getProjects();
    const index = projects.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Project not found');

    const current = projects[index];
    const updated = {
      ...current,
      ...updatedFields,
      tools: Array.isArray(updatedFields.tools)
        ? updatedFields.tools
        : (typeof updatedFields.tools === 'string' ? updatedFields.tools.split(',').map(s => s.trim()).filter(Boolean) : current.tools),
      updatedAt: new Date().toISOString()
    };

    projects[index] = updated;
    await this.saveProjects(projects);
    return updated;
  }

  // Delete project
  async deleteProject(id) {
    const projects = await this.getProjects();
    const filtered = projects.filter(p => p.id !== id);
    await this.saveProjects(filtered);
    return true;
  }

  // Toggle Like for a project
  async toggleLike(projectId) {
    const projects = await this.getProjects();
    const likedIds = this.getUserLikedProjectIds();
    const hasLiked = likedIds.includes(projectId);

    let updatedLikedIds;

    const projectIndex = projects.findIndex(p => p.id === projectId);
    if (projectIndex === -1) return { likes: 0, userHasLiked: false };

    if (hasLiked) {
      updatedLikedIds = likedIds.filter(id => id !== projectId);
      projects[projectIndex].likes = Math.max(0, (projects[projectIndex].likes || 1) - 1);
    } else {
      updatedLikedIds = [...likedIds, projectId];
      projects[projectIndex].likes = (projects[projectIndex].likes || 0) + 1;
    }

    try {
      localStorage.setItem(LIKES_KEY, JSON.stringify(updatedLikedIds));
    } catch {
      // ignore
    }
    await this.saveProjects(projects);

    return {
      likes: projects[projectIndex].likes,
      userHasLiked: !hasLiked
    };
  }

  getUserLikedProjectIds() {
    try {
      const data = localStorage.getItem(LIKES_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  isProjectLiked(projectId) {
    return this.getUserLikedProjectIds().includes(projectId);
  }

  // Add Comment
  async addComment(projectId, { name, text }) {
    if (!name || !text) throw new Error('Name and message are required.');
    const projects = await this.getProjects();
    const projectIndex = projects.findIndex(p => p.id === projectId);
    if (projectIndex === -1) throw new Error('Project not found');

    const newComment = {
      id: `comm-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      name: name.trim(),
      text: text.trim(),
      date: 'Just now',
      timestamp: new Date().toISOString()
    };

    if (!Array.isArray(projects[projectIndex].comments)) {
      projects[projectIndex].comments = [];
    }

    projects[projectIndex].comments.unshift(newComment);
    await this.saveProjects(projects);
    return newComment;
  }

  // Delete Comment (for Admin moderation)
  async deleteComment(projectId, commentId) {
    const projects = await this.getProjects();
    const projectIndex = projects.findIndex(p => p.id === projectId);
    if (projectIndex === -1) throw new Error('Project not found');

    projects[projectIndex].comments = (projects[projectIndex].comments || []).filter(c => c.id !== commentId);
    await this.saveProjects(projects);
    return true;
  }

  // Reset to initial mock data
  async resetToDefaults() {
    await this.saveProjects(INITIAL_PROJECTS);
    return INITIAL_PROJECTS;
  }

  getCategoryLabel(catId) {
    switch (catId) {
      case 'posters': return 'Poster & Flyer Design';
      case 'branding': return 'Logos & Branding';
      case 'motion': return 'Motion Graphics';
      case 'videos': return 'Video Promo Animation';
      default: return 'Visual Design';
    }
  }
}

export const projectService = new ProjectService();
