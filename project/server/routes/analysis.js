import express from 'express';
import { db } from '../database/init.js';
import { analyzeDream } from '../services/dreamAnalysis.js';
import { generateId } from '../utils/helpers.js';

const router = express.Router();

// Get analysis for a dream
router.get('/dream/:dreamId', async (req, res) => {
  try {
    const { dreamId } = req.params;
    
    // Verify dream belongs to user
    const dream = await db.getAsync(
      'SELECT * FROM dreams WHERE id = ? AND user_id = ?',
      [dreamId, req.user.userId]
    );
    
    if (!dream) {
      return res.status(404).json({ error: 'Dream not found' });
    }
    
    // Get analysis
    const analysis = await db.getAsync(
      'SELECT * FROM dream_analyses WHERE dream_id = ?',
      [dreamId]
    );
    
    if (!analysis) {
      return res.status(404).json({ error: 'Analysis not found' });
    }
    
    res.json({
      ...analysis,
      symbols: JSON.parse(analysis.symbols || '[]'),
      themes: JSON.parse(analysis.themes || '[]'),
      emotions: JSON.parse(analysis.emotions || '[]'),
      personalizedInsights: JSON.parse(analysis.personalized_insights || '[]'),
      recurringPatterns: JSON.parse(analysis.recurring_patterns || '[]')
    });
  } catch (error) {
    console.error('Error fetching analysis:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Request new analysis for a dream
router.post('/dream/:dreamId', async (req, res) => {
  try {
    const { dreamId } = req.params;
    
    // Get user and dream
    const user = await db.getAsync('SELECT * FROM users WHERE id = ?', [req.user.userId]);
    const dream = await db.getAsync(
      'SELECT * FROM dreams WHERE id = ? AND user_id = ?',
      [dreamId, req.user.userId]
    );
    
    if (!dream) {
      return res.status(404).json({ error: 'Dream not found' });
    }
    
    // Check if user can get analysis
    const canAnalyze = user.is_premium || user.trial_analyses_used < user.trial_analyses_limit;
    
    if (!canAnalyze) {
      return res.status(403).json({ error: 'Analysis limit reached. Please upgrade to premium.' });
    }
    
    // Check if analysis already exists
    const existingAnalysis = await db.getAsync(
      'SELECT id FROM dream_analyses WHERE dream_id = ?',
      [dreamId]
    );
    
    if (existingAnalysis) {
      return res.status(400).json({ error: 'Analysis already exists for this dream' });
    }
    
    // Perform analysis
    const dreamData = {
      ...dream,
      tags: JSON.parse(dream.tags || '[]'),
      symbols: JSON.parse(dream.symbols || '[]'),
      themes: JSON.parse(dream.themes || '[]')
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
    
    res.status(201).json({
      message: 'Analysis created successfully',
      analysis
    });
  } catch (error) {
    console.error('Error creating analysis:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;