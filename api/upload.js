/**
 * Vercel Serverless Function: /api/upload
 * Handles media upload requests across mobile, desktop, and tablet platforms.
 */
export default async function handler(req, res) {
  // Universal CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    try {
      const { filename, dataUrl } = req.body || {};
      if (!dataUrl) {
        return res.status(400).json({ error: 'Missing dataUrl' });
      }

      // Safe media identifier for client persistence
      const extMatch = filename ? filename.match(/\.[0-9a-z]+$/i) : null;
      const ext = extMatch ? extMatch[0] : (dataUrl.includes('video') ? '.mp4' : '.jpg');
      const safeName = `media-${Date.now()}-${Math.floor(Math.random() * 10000)}${ext}`;

      return res.status(200).json({
        success: true,
        url: dataUrl,
        filename: safeName,
        platform: 'all'
      });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
