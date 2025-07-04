import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'your-openai-api-key'
});

const horoscopeTraits = {
  'Aries': ['leadership', 'courage', 'impulsiveness', 'adventure'],
  'Taurus': ['stability', 'sensuality', 'stubbornness', 'comfort'],
  'Gemini': ['communication', 'curiosity', 'duality', 'adaptability'],
  'Cancer': ['emotions', 'nurturing', 'protection', 'family'],
  'Leo': ['creativity', 'confidence', 'attention', 'drama'],
  'Virgo': ['perfectionism', 'service', 'analysis', 'health'],
  'Libra': ['harmony', 'relationships', 'beauty', 'balance'],
  'Scorpio': ['intensity', 'transformation', 'mystery', 'depth'],
  'Sagittarius': ['freedom', 'adventure', 'philosophy', 'truth'],
  'Capricorn': ['ambition', 'structure', 'responsibility', 'success'],
  'Aquarius': ['innovation', 'friendship', 'rebellion', 'idealism'],
  'Pisces': ['intuition', 'creativity', 'spirituality', 'empathy']
};

const dreamSymbols = {
  'water': 'emotions, subconscious, cleansing, life force',
  'flying': 'freedom, transcendence, overcoming obstacles, spiritual elevation',
  'animals': 'instincts, natural desires, untamed aspects of self',
  'death': 'transformation, endings, rebirth, fear of change',
  'house': 'self, mind, different aspects of personality',
  'falling': 'loss of control, anxiety, fear of failure',
  'chase': 'avoidance, running from problems, confronting fears',
  'fire': 'passion, anger, destruction, purification',
  'mirror': 'self-reflection, truth, vanity, self-perception',
  'money': 'value, self-worth, security, power',
  'baby': 'new beginnings, innocence, vulnerability, potential',
  'car': 'control, direction in life, personal drive',
  'school': 'learning, testing, anxiety, past experiences',
  'wedding': 'commitment, unity, new phase, celebration'
};

export async function analyzeDream(dream, user) {
  try {
    // Use OpenAI for advanced analysis if API key is available
    if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your-openai-api-key') {
      return await analyzeWithOpenAI(dream, user);
    } else {
      // Fallback to local analysis
      return analyzeLocally(dream, user);
    }
  } catch (error) {
    console.error('Error in dream analysis:', error);
    // Fallback to local analysis if OpenAI fails
    return analyzeLocally(dream, user);
  }
}

async function analyzeWithOpenAI(dream, user) {
  const prompt = `
    Analyze this dream for a ${user.age}-year-old ${user.sex} ${user.horoscope}:
    
    Title: ${dream.title}
    Content: ${dream.content}
    Mood: ${dream.mood}/5
    Lucidity: ${dream.lucidity}/5
    
    Please provide a comprehensive analysis including:
    1. Overview (2-3 sentences)
    2. Key symbols and their meanings
    3. Main themes
    4. Emotions present
    5. Personalized insights based on their profile
    6. Connection to their ${user.horoscope} horoscope
    7. Psychological meaning
    
    Format the response as JSON with the following structure:
    {
      "overview": "string",
      "symbols": [{"symbol": "string", "meaning": "string", "personalRelevance": "string"}],
      "themes": ["string"],
      "emotions": ["string"],
      "personalizedInsights": ["string"],
      "horoscopeConnection": "string",
      "psychologicalMeaning": "string"
    }
  `;

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: "You are an expert dream analyst with knowledge of psychology, symbolism, and astrology. Provide insightful, personalized dream interpretations."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    temperature: 0.7,
    max_tokens: 1500
  });

  try {
    return JSON.parse(response.choices[0].message.content);
  } catch (parseError) {
    console.error('Error parsing OpenAI response:', parseError);
    return analyzeLocally(dream, user);
  }
}

function analyzeLocally(dream, user) {
  const content = dream.content.toLowerCase();
  
  // Extract symbols
  const foundSymbols = Object.keys(dreamSymbols).filter(symbol => 
    content.includes(symbol)
  );
  
  // Extract themes
  const themes = extractThemes(content);
  
  // Extract emotions
  const emotions = extractEmotions(content);
  
  // Create symbol interpretations
  const symbolInterpretations = foundSymbols.map(symbol => ({
    symbol,
    meaning: dreamSymbols[symbol],
    personalRelevance: generatePersonalRelevance(symbol, user)
  }));
  
  // Generate personalized insights
  const personalizedInsights = generatePersonalizedInsights(dream, user, themes, emotions);
  
  // Generate horoscope connection
  const horoscopeConnection = generateHoroscopeConnection(user.horoscope, themes, emotions);
  
  // Generate overview
  const overview = generateOverview(dream, user, themes, emotions);
  
  return {
    overview,
    symbols: symbolInterpretations,
    themes,
    emotions,
    personalizedInsights,
    horoscopeConnection,
    recurringPatterns: [],
    psychologicalMeaning: generatePsychologicalMeaning(themes, emotions, user)
  };
}

function extractThemes(content) {
  const themes = [];
  
  if (content.includes('family') || content.includes('parent') || content.includes('child')) {
    themes.push('Family & Relationships');
  }
  if (content.includes('work') || content.includes('job') || content.includes('career')) {
    themes.push('Career & Achievement');
  }
  if (content.includes('love') || content.includes('romantic') || content.includes('partner')) {
    themes.push('Love & Romance');
  }
  if (content.includes('fear') || content.includes('scared') || content.includes('anxiety')) {
    themes.push('Fear & Anxiety');
  }
  if (content.includes('travel') || content.includes('journey') || content.includes('adventure')) {
    themes.push('Adventure & Exploration');
  }
  if (content.includes('past') || content.includes('memory') || content.includes('childhood')) {
    themes.push('Past & Memory');
  }
  if (content.includes('future') || content.includes('dream') || content.includes('goal')) {
    themes.push('Future & Aspirations');
  }
  
  return themes;
}

function extractEmotions(content) {
  const emotions = [];
  
  if (content.includes('happy') || content.includes('joy') || content.includes('excited')) {
    emotions.push('Joy');
  }
  if (content.includes('sad') || content.includes('cry') || content.includes('tears')) {
    emotions.push('Sadness');
  }
  if (content.includes('angry') || content.includes('mad') || content.includes('rage')) {
    emotions.push('Anger');
  }
  if (content.includes('scared') || content.includes('fear') || content.includes('terrified')) {
    emotions.push('Fear');
  }
  if (content.includes('peaceful') || content.includes('calm') || content.includes('serene')) {
    emotions.push('Peace');
  }
  if (content.includes('confused') || content.includes('lost') || content.includes('uncertain')) {
    emotions.push('Confusion');
  }
  if (content.includes('powerful') || content.includes('strong') || content.includes('confident')) {
    emotions.push('Empowerment');
  }
  
  return emotions;
}

function generatePersonalRelevance(symbol, user) {
  const age = user.age;
  const sex = user.sex;
  const horoscope = user.horoscope;
  
  if (symbol === 'water' && horoscope === 'Pisces') {
    return 'As a Pisces, water in your dreams represents your deep emotional nature and intuitive abilities.';
  }
  if (symbol === 'flying' && age < 30) {
    return 'Flying dreams often represent your desire for freedom and independence as you navigate life\'s challenges.';
  }
  if (symbol === 'house' && age > 40) {
    return 'Houses in dreams often reflect your sense of self and security, particularly relevant during midlife transitions.';
  }
  
  return `This symbol resonates with your ${horoscope} nature and current life stage.`;
}

function generatePersonalizedInsights(dream, user, themes, emotions) {
  const insights = [];
  
  if (themes.includes('Family & Relationships') && user.horoscope === 'Cancer') {
    insights.push('Your Cancer sign\'s deep connection to family is reflected in this dream, suggesting important familial bonds or concerns.');
  }
  
  if (emotions.includes('Fear') && user.age < 25) {
    insights.push('Fear-based dreams are common during periods of transition and growth, which align with your current life stage.');
  }
  
  if (dream.lucidity > 3 && user.horoscope === 'Scorpio') {
    insights.push('Your Scorpio intensity may be contributing to increased dream lucidity and deeper psychological awareness.');
  }
  
  if (themes.includes('Career & Achievement') && user.age > 30) {
    insights.push('Career themes in dreams often reflect professional ambitions and concerns about success and recognition.');
  }
  
  insights.push(`Your ${user.sex} perspective brings unique insights to the interpretation of these dream symbols.`);
  
  return insights;
}

function generateHoroscopeConnection(horoscope, themes, emotions) {
  const traits = horoscopeTraits[horoscope] || ['adaptability'];
  
  return `As a ${horoscope}, your dreams reflect your natural ${traits[0]} and ${traits[1]}. The themes of ${themes.join(', ')} align with your zodiac sign's focus on ${traits[2]} and ${traits[3]}.`;
}

function generateOverview(dream, user, themes, emotions) {
  return `This dream reveals important insights about your subconscious mind. The primary themes of ${themes.join(', ')} suggest you're processing ${emotions.join(', ').toLowerCase()} in your waking life. Your ${user.horoscope} nature influences how you interpret these experiences, bringing a unique perspective to your dream world.`;
}

function generatePsychologicalMeaning(themes, emotions, user) {
  const primaryTheme = themes[0] || 'Personal Growth';
  const primaryEmotion = emotions[0] || 'Curiosity';
  
  return `From a psychological perspective, this dream represents your mind's way of processing ${primaryTheme.toLowerCase()} while experiencing ${primaryEmotion.toLowerCase()}. The dream serves as a safe space to explore these feelings and work through subconscious concerns.`;
}