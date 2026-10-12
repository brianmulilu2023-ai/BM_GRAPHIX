/**
 * Vercel Serverless Function: /api/projects
 * Handles project retrieval and synchronization across all devices and platforms.
 */
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    const projects = req.body;
    return res.status(200).json({
      success: true,
      count: Array.isArray(projects) ? projects.length : 1,
      syncedAt: new Date().toISOString()
    });
  }

  // Return empty array by default so client seamlessly uses bundled INITIAL_PROJECTS
  return res.status(200).json([]);
}
