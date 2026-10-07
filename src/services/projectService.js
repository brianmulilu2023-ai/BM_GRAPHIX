import { INITIAL_PROJECTS } from '../data/projects';

const STORAGE_KEY = 'bm_graphix_projects_v1';
const LIKES_KEY = 'bm_graphix_user_likes_v1';

/**
 * Project Service Layer
 * Decouples the UI from the persistence layer.
 * Ready to be swapped with an API client (REST / Supabase / Firebase / GraphQL).
 */

class ProjectService {
  constructor() {
    this.initStorage();
  }

  initStorage() {
    if (typeof window === 'undefined') return;
    const existing = localStorage.getItem(STORAGE_KEY);
    if (!existing) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_PROJECTS));
    }
    const likes = localStorage.getItem(LIKES_KEY);
    if (!likes) {
      localStorage.setItem(LIKES_KEY, JSON.stringify([]));
    }
  }

  // Get all projects
  async getProjects() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : INITIAL_PROJECTS;
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

  // Add project (supports multiple images and video)
  async addProject(projectData) {
    const projects = await this.getProjects();
    const newId = `proj-${Date.now()}`;
    const slug = (projectData.title || 'project')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    const newProject = {
      id: newId,
      slug: `${slug}-${Math.floor(Math.random() * 1000)}`,
      title: projectData.title,
      category: projectData.category || 'posters',
      categoryLabel: projectData.categoryLabel || this.getCategoryLabel(projectData.category),
      client: projectData.client || 'Commissioned Project',
      year: projectData.year || new Date().getFullYear().toString(),
      featured: Boolean(projectData.featured),
      thumbnail: projectData.thumbnail || (projectData.images && projectData.images[0]) || '/assets/BM_BLCK.png',
      images: Array.isArray(projectData.images) && projectData.images.length > 0 
        ? projectData.images 
        : [projectData.thumbnail || '/assets/BM_BLCK.png'],
      videoUrl: projectData.videoUrl || null,
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
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
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
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    return updated;
  }

  // Delete project
  async deleteProject(id) {
    const projects = await this.getProjects();
    const filtered = projects.filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  }

  // Toggle Like for a project
  async toggleLike(projectId) {
    const projects = await this.getProjects();
    const likedIds = this.getUserLikedProjectIds();
    const hasLiked = likedIds.includes(projectId);

    let updatedLikedIds;
    let newLikeCount;

    const projectIndex = projects.findIndex(p => p.id === projectId);
    if (projectIndex === -1) return { likes: 0, userHasLiked: false };

    if (hasLiked) {
      updatedLikedIds = likedIds.filter(id => id !== projectId);
      projects[projectIndex].likes = Math.max(0, (projects[projectIndex].likes || 1) - 1);
    } else {
      updatedLikedIds = [...likedIds, projectId];
      projects[projectIndex].likes = (projects[projectIndex].likes || 0) + 1;
    }

    localStorage.setItem(LIKES_KEY, JSON.stringify(updatedLikedIds));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));

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
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    return newComment;
  }

  // Delete Comment (for Admin moderation)
  async deleteComment(projectId, commentId) {
    const projects = await this.getProjects();
    const projectIndex = projects.findIndex(p => p.id === projectId);
    if (projectIndex === -1) throw new Error('Project not found');

    projects[projectIndex].comments = (projects[projectIndex].comments || []).filter(c => c.id !== commentId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    return true;
  }

  // Reset to initial mock data
  async resetToDefaults() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_PROJECTS));
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
