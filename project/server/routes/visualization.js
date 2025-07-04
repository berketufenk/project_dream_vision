import express from 'express';
import { db } from '../database/init.js';

const router = express.Router();

// Generate visualization for a dream
router.post('/dream/:dreamId', async (req, res) => {
  try {
    const { dreamId } = req.params;
    const { style = 'dreamy' } = req.body;
    
    // Verify dream belongs to user
    const dream = await db.getAsync(
      'SELECT * FROM dreams WHERE id = ? AND user_id = ?',
      [dreamId, req.user.userId]
    );
    
    if (!dream) {
      return res.status(404).json({ error: 'Dream not found' });
    }
    
    // Simulate visualization generation
    // In a real implementation, this would call an AI image generation service
    const visualizationUrl = generateVisualizationUrl(dream.content, style);
    
    // Update dream with visualization URL
    await db.runAsync(
      'UPDATE dreams SET visualization_url = ? WHERE id = ?',
      [visualizationUrl, dreamId]
    );
    
    res.json({
      message: 'Visualization generated successfully',
      visualizationUrl
    });
  } catch (error) {
    console.error('Error generating visualization:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get visualization for a dream
router.get('/dream/:dreamId', async (req, res) => {
  try {
    const { dreamId } = req.params;
    
    const dream = await db.getAsync(
      'SELECT visualization_url FROM dreams WHERE id = ? AND user_id = ?',
      [dreamId, req.user.userId]
    );
    
    if (!dream) {
      return res.status(404).json({ error: 'Dream not found' });
    }
    
    if (!dream.visualization_url) {
      return res.status(404).json({ error: 'No visualization found for this dream' });
    }
    
    res.json({
      visualizationUrl: dream.visualization_url
    });
  } catch (error) {
    console.error('Error fetching visualization:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

function generateVisualizationUrl(content, style) {
  // Simulate different visualizations based on dream content and style
  const contentLower = content.toLowerCase();
  
  const imageMap = {
    ocean: 'https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg?auto=compress&cs=tinysrgb&w=800',
    mountain: 'https://images.pexels.com/photos/1271619/pexels-photo-1271619.jpeg?auto=compress&cs=tinysrgb&w=800',
    forest: 'https://images.pexels.com/photos/1005417/pexels-photo-1005417.jpeg?auto=compress&cs=tinysrgb&w=800',
    night: 'https://images.pexels.com/photos/1624438/pexels-photo-1624438.jpeg?auto=compress&cs=tinysrgb&w=800',
    city: 'https://images.pexels.com/photos/1519088/pexels-photo-1519088.jpeg?auto=compress&cs=tinysrgb&w=800',
    default: 'https://images.pexels.com/photos/1275929/pexels-photo-1275929.jpeg?auto=compress&cs=tinysrgb&w=800'
  };
  
  for (const [keyword, url] of Object.entries(imageMap)) {
    if (keyword !== 'default' && contentLower.includes(keyword)) {
      return `${url}&style=${style}`;
    }
  }
  
  return `${imageMap.default}&style=${style}`;
}

export default router;