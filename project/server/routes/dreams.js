import express from 'express';
import { body, validationResult } from 'express-validator';
import { db } from '../database/init.js';
import { generateId } from '../utils/helpers.js';
import { analyzeDream } from '../services/dreamAnalysis.js';

const router = express.Router();

// Get all dreams for user
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, search, tags } = req.query;
    const offset = (page - 1) * limit;
    
    let query = `
      SELECT d.*, da.overview, da.symbols, da.themes, da.emotions, 
             da.personalized_insights, da.horoscope_connection, 
             da.psychological_meaning
      FROM dreams d
      LEFT JOIN dream_analyses da ON d.id = da.dream_id
      WHERE d.user_id = ?
    `;
    
    const params = [req.user.userId];
    
    if (search) {
      query += ' AND (d.title LIKE ? OR d.content LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }
    
    if (tags) {
      query += ' AND d.tags LIKE ?';
      params.push(`%${tags}%`);
    }
    
    query += ' ORDER BY d.date DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);
    
    const dreams = await db.allAsync(query, params);
    
    // Parse JSON fields
    const formattedDreams = dreams.map(dream => ({
      ...dream,
      tags: JSON.parse(dream.tags || '[]'),
      symbols: JSON.parse(dream.symbols || '[]'),
      themes: JSON.parse(dream.themes || '[]'),
      analysis: dream.overview ? {
        overview: dream.overview,
        symbols: JSON.parse(dream.symbols || '[]'),
        themes: JSON.parse(dream.themes || '[]'),
        emotions: JSON.parse(dream.emotions || '[]'),
        personalizedInsights: JSON.parse(dream.personalized_insights || '[]'),
        horoscopeConnection: dream.horoscope_connection,
        psychologicalMeaning: dream.psychological_meaning
      } : null
    }));
    
    res.json(formattedDreams);
  } catch (error) {
    console.error('Error fetching dreams:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single dream
router.get('/:id', async (req, res) => {
  try {
    const dream = await db.getAsync(`
      SELECT d.*, da.overview, da.symbols, da.themes, da.emotions, 
             da.personalized_insights, da.horoscope_connection, 
             da.psychological_meaning
      FROM dreams d
      LEFT JOIN dream_analyses da ON d.id = da.dream_id
      WHERE d.id = ? AND d.user_id = ?
    `, [req.params.id, req.user.userId]);
    
    if (!dream) {
      return res.status(404).json({ error: 'Dream not found' });
    }
    
    // Parse JSON fields
    const formattedDream = {
      ...dream,
      tags: JSON.parse(dream.tags || '[]'),
      symbols: JSON.parse(dream.symbols || '[]'),
      themes: JSON.parse(dream.themes || '[]'),
      analysis: dream.overview ? {
        overview: dream.overview,
        symbols: JSON.parse(dream.symbols || '[]'),
        themes: JSON.parse(dream.themes || '[]'),
        emotions: JSON.parse(dream.emotions || '[]'),
        personalizedInsights: JSON.parse(dream.personalized_insights || '[]'),
        horoscopeConnection: dream.horoscope_connection,
        psychologicalMeaning: dream.psychological_meaning
      } : null
    };
    
    res.json(formattedDream);
  } catch (error) {
    console.error('Error fetching dream:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new dream
router.post('/', [
  body('title').trim().isLength({ min: 1 }).withMessage('Title is required'),
  body('content').trim().isLength({ min: 1 }).withMessage('Content is required'),
  body('mood').isInt({ min: 1, max: 5 }).withMessage('Mood must be between 1 and 5'),
  body('lucidity').isInt({ min: 1, max: 5 }).withMessage('Lucidity must be between 1 and 5'),
  body('tags').isArray().withMessage('Tags must be an array')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, content, mood, lucidity, tags, requestAnalysis } = req.body;
    const dreamId = generateId();
    const date = new Date().toISOString();

    // Get user info for analysis
    const user = await db.getAsync('SELECT * FROM users WHERE id = ?', [req.user.userId]);
    
    // Check if user can get analysis
    const canAnalyze = user.is_premium || user.trial_analyses_used < user.trial_analyses_limit;
    
    // Create dream
    await db.runAsync(`
      INSERT INTO dreams (id, user_id, title, content, date, mood, lucidity, tags, symbols, themes, is_trial_analysis)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      dreamId, 
      req.user.userId, 
      title, 
      content, 
      date, 
      mood, 
      lucidity, 
      JSON.stringify(tags),
      JSON.stringify([]),
      JSON.stringify([]),
      !user.is_premium && requestAnalysis
    ]);

    // Perform analysis if requested and allowed
    if (requestAnalysis && canAnalyze) {
      const dreamData = {
        id: dreamId,
        title,
        content,
        mood,
        lucidity,
        tags
      };
      
      const analysis = await analyzeDream(dreamData, user);
      
      // Save analysis
      await db.runAsync(`
        INSERT INTO dream_analyses (id, dream_id, overview, symbols, themes, emotions, 
                                   personalized_insights, horoscope_connection, psychological_meaning)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        generateId(),
        dreamId,
        analysis.overview,
        JSON.stringify(analysis.symbols),
        JSON.stringify(analysis.themes),
        JSON.stringify(analysis.emotions),
        JSON.stringify(analysis.personalizedInsights),
        analysis.horoscopeConnection,
        analysis.psychologicalMeaning
      ]);
      
      // Update dream with extracted themes and symbols
      await db.runAsync(`
        UPDATE dreams SET themes = ?, symbols = ? WHERE id = ?
      `, [
        JSON.stringify(analysis.themes),
        JSON.stringify(analysis.symbols.map(s => s.symbol)),
        dreamId
      ]);
      
      // Increment trial usage if not premium
      if (!user.is_premium) {
        await db.runAsync(`
          UPDATE users SET trial_analyses_used = trial_analyses_used + 1 WHERE id = ?
        `, [req.user.userId]);
      }
    }

    // Get the created dream with analysis
    const createdDream = await db.getAsync(`
      SELECT d.*, da.overview, da.symbols, da.themes, da.emotions, 
             da.personalized_insights, da.horoscope_connection, 
             da.psychological_meaning
      FROM dreams d
      LEFT JOIN dream_analyses da ON d.id = da.dream_id
      WHERE d.id = ?
    `, [dreamId]);

    res.status(201).json({
      message: 'Dream created successfully',
      dream: {
        ...createdDream,
        tags: JSON.parse(createdDream.tags || '[]'),
        symbols: JSON.parse(createdDream.symbols || '[]'),
        themes: JSON.parse(createdDream.themes || '[]')
      }
    });
  } catch (error) {
    console.error('Error creating dream:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update dream
router.put('/:id', [
  body('title').trim().isLength({ min: 1 }).withMessage('Title is required'),
  body('content').trim().isLength({ min: 1 }).withMessage('Content is required'),
  body('mood').isInt({ min: 1, max: 5 }).withMessage('Mood must be between 1 and 5'),
  body('lucidity').isInt({ min: 1, max: 5 }).withMessage('Lucidity must be between 1 and 5'),
  body('tags').isArray().withMessage('Tags must be an array')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, content, mood, lucidity, tags } = req.body;
    
    // Check if dream exists and belongs to user
    const existingDream = await db.getAsync(
      'SELECT * FROM dreams WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.userId]
    );
    
    if (!existingDream) {
      return res.status(404).json({ error: 'Dream not found' });
    }

    // Update dream
    await db.runAsync(`
      UPDATE dreams 
      SET title = ?, content = ?, mood = ?, lucidity = ?, tags = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ? AND user_id = ?
    `, [title, content, mood, lucidity, JSON.stringify(tags), req.params.id, req.user.userId]);

    res.json({ message: 'Dream updated successfully' });
  } catch (error) {
    console.error('Error updating dream:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete dream
router.delete('/:id', async (req, res) => {
  try {
    const result = await db.runAsync(
      'DELETE FROM dreams WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.userId]
    );
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Dream not found' });
    }

    res.json({ message: 'Dream deleted successfully' });
  } catch (error) {
    console.error('Error deleting dream:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;