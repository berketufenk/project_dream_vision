import express from 'express';
import { body, validationResult } from 'express-validator';
import { db } from '../database/init.js';

const router = express.Router();

// Get current user profile
router.get('/profile', async (req, res) => {
  try {
    const user = await db.getAsync(`
      SELECT id, name, surname, age, sex, horoscope, email, join_date, 
             trial_analyses_used, trial_analyses_limit, is_premium, profile_picture
      FROM users WHERE id = ?
    `, [req.user.userId]);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user profile
router.put('/profile', [
  body('name').trim().isLength({ min: 1 }).withMessage('Name is required'),
  body('surname').trim().isLength({ min: 1 }).withMessage('Surname is required'),
  body('age').isInt({ min: 1, max: 120 }).withMessage('Age must be between 1 and 120'),
  body('sex').isIn(['male', 'female', 'other']).withMessage('Invalid sex value'),
  body('horoscope').trim().isLength({ min: 1 }).withMessage('Horoscope is required'),
  body('email').isEmail().withMessage('Valid email is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, surname, age, sex, horoscope, email } = req.body;
    
    // Check if email is already taken by another user
    const existingUser = await db.getAsync(
      'SELECT id FROM users WHERE email = ? AND id != ?',
      [email, req.user.userId]
    );
    
    if (existingUser) {
      return res.status(400).json({ error: 'Email already taken' });
    }

    await db.runAsync(`
      UPDATE users 
      SET name = ?, surname = ?, age = ?, sex = ?, horoscope = ?, email = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [name, surname, age, sex, horoscope, email, req.user.userId]);

    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user statistics
router.get('/stats', async (req, res) => {
  try {
    const dreams = await db.allAsync('SELECT * FROM dreams WHERE user_id = ?', [req.user.userId]);
    
    if (dreams.length === 0) {
      return res.json({
        totalDreams: 0,
        averageMood: 0,
        averageLucidity: 0,
        mostCommonThemes: [],
        mostCommonSymbols: [],
        dreamingStreak: 0,
        monthlyDreams: Array(12).fill(0)
      });
    }

    const totalDreams = dreams.length;
    const averageMood = dreams.reduce((sum, dream) => sum + dream.mood, 0) / totalDreams;
    const averageLucidity = dreams.reduce((sum, dream) => sum + dream.lucidity, 0) / totalDreams;
    
    // Extract themes and symbols
    const allThemes = [];
    const allSymbols = [];
    
    dreams.forEach(dream => {
      const themes = JSON.parse(dream.themes || '[]');
      const symbols = JSON.parse(dream.symbols || '[]');
      allThemes.push(...themes);
      allSymbols.push(...symbols);
    });
    
    // Count occurrences
    const themeCount = allThemes.reduce((acc, theme) => {
      acc[theme] = (acc[theme] || 0) + 1;
      return acc;
    }, {});
    
    const symbolCount = allSymbols.reduce((acc, symbol) => {
      acc[symbol] = (acc[symbol] || 0) + 1;
      return acc;
    }, {});
    
    const mostCommonThemes = Object.entries(themeCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([theme]) => theme);
    
    const mostCommonSymbols = Object.entries(symbolCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([symbol]) => symbol);
    
    // Calculate monthly dreams
    const monthlyDreams = Array(12).fill(0);
    dreams.forEach(dream => {
      const month = new Date(dream.date).getMonth();
      monthlyDreams[month]++;
    });
    
    // Calculate dreaming streak (simplified)
    const dreamingStreak = calculateDreamingStreak(dreams);
    
    res.json({
      totalDreams,
      averageMood,
      averageLucidity,
      mostCommonThemes,
      mostCommonSymbols,
      dreamingStreak,
      monthlyDreams
    });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Upgrade to premium
router.post('/upgrade', async (req, res) => {
  try {
    await db.runAsync(
      'UPDATE users SET is_premium = TRUE, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [req.user.userId]
    );
    
    res.json({ message: 'Successfully upgraded to premium' });
  } catch (error) {
    console.error('Error upgrading user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Export user data
router.get('/export', async (req, res) => {
  try {
    const user = await db.getAsync(`
      SELECT id, name, surname, age, sex, horoscope, email, join_date, 
             trial_analyses_used, trial_analyses_limit, is_premium
      FROM users WHERE id = ?
    `, [req.user.userId]);
    
    const dreams = await db.allAsync(`
      SELECT d.*, da.overview, da.symbols, da.themes, da.emotions, 
             da.personalized_insights, da.horoscope_connection, 
             da.psychological_meaning
      FROM dreams d
      LEFT JOIN dream_analyses da ON d.id = da.dream_id
      WHERE d.user_id = ?
    `, [req.user.userId]);
    
    const exportData = {
      user,
      dreams: dreams.map(dream => ({
        ...dream,
        tags: JSON.parse(dream.tags || '[]'),
        symbols: JSON.parse(dream.symbols || '[]'),
        themes: JSON.parse(dream.themes || '[]')
      })),
      exportDate: new Date().toISOString()
    };
    
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename="dreamvision-export.json"');
    res.json(exportData);
  } catch (error) {
    console.error('Error exporting data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

function calculateDreamingStreak(dreams) {
  if (dreams.length === 0) return 0;
  
  const sortedDreams = dreams.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  let streak = 0;
  let currentDate = new Date(today);
  
  for (const dream of sortedDreams) {
    const dreamDate = new Date(dream.date);
    dreamDate.setHours(0, 0, 0, 0);
    
    if (dreamDate.getTime() === currentDate.getTime()) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else if (dreamDate.getTime() < currentDate.getTime()) {
      break;
    }
  }
  
  return streak;
}

export default router;