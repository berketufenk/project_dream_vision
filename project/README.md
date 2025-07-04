# DreamVision - AI Dream Analysis & Visualization MVP

A beautiful, secure, and personalized AI-powered platform where users can log, analyze, and visualize their dreams with tailored insights based on personal profiles including horoscope, age, and gender.

![DreamVision Dashboard](https://images.pexels.com/photos/1275929/pexels-photo-1275929.jpeg?auto=compress&cs=tinysrgb&w=1200)

## ✨ Features

### 🔐 User Profile Management
- **Secure Registration**: Email/password authentication with profile customization
- **Personal Details**: Name, surname, age, gender, and horoscope sign
- **Profile Customization**: Editable personal information and preferences
- **Privacy Controls**: Full control over data sharing and visibility

### 📖 Dream Logging & Journal
- **Rich Dream Entry**: Text input with automatic date/time stamps
- **Smart Tagging**: Custom tags for themes, emotions, and symbols
- **Mood & Lucidity Rating**: 1-5 scale rating system for dream quality
- **Dream History**: Chronological list with search and filter capabilities
- **Data Export**: Export dreams and analysis in JSON format

### 🧠 AI-Powered Dream Analysis
- **Intelligent Analysis**: NLP extracts symbols, themes, and emotions
- **Personalized Insights**: Tailored interpretations based on user profile
- **Symbol Dictionary**: Comprehensive symbol and archetype explanations
- **Pattern Recognition**: Tracks recurring motifs and themes
- **Horoscope Integration**: Zodiac-based dream interpretations

### 🎨 Dream Visualization
- **AI Image Generation**: Creates personalized visuals from dream descriptions
- **Multiple Art Styles**: Dreamy surreal, photorealistic, watercolor, digital art, abstract, vintage
- **Profile-Influenced**: Visuals adapted based on horoscope and personal details
- **Save & Share**: Download and share generated dream visualizations

### 📊 Analytics & Insights
- **Dream Statistics**: Track patterns, emotions, and recurring symbols
- **Monthly Activity**: Visual charts of dream logging frequency
- **Mood Tracking**: Average mood and lucidity trends
- **Streak Counter**: Consecutive days of dream logging
- **Horoscope Insights**: Personalized insights based on zodiac sign

### 💎 Free Trial & Premium
- **3 Free Analyses**: New users get 3 complimentary AI dream analyses
- **Trial Tracking**: Visual progress indicators for remaining analyses
- **Premium Upgrade**: Unlimited analyses and advanced features
- **Flexible Pricing**: $9.99/month with 7-day free trial

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/dreamvision-mvp.git
   cd dreamvision-mvp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to view the application

### Build for Production

```bash
npm run build
npm run preview
```

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Fast build tool and development server
- **Lucide React** - Beautiful, customizable icons

### Storage & Data
- **LocalStorage** - Client-side data persistence
- **JSON Export** - Data portability and backup

### AI Integration Ready
- **OpenAI GPT** - Natural language processing for dream analysis
- **DALL-E** - AI image generation for dream visualization
- **Modular Architecture** - Easy integration with various AI services

## 📁 Project Structure

```
src/
├── components/           # React components
│   ├── Dashboard.tsx    # Main dashboard with statistics
│   ├── DreamForm.tsx    # Dream entry form
│   ├── DreamList.tsx    # Dream history and management
│   ├── DreamAnalysis.tsx # AI analysis display
│   ├── DreamVisualization.tsx # AI image generation
│   ├── Layout.tsx       # Main app layout
│   ├── OnboardingFlow.tsx # User registration flow
│   ├── Profile.tsx      # User profile management
│   ├── TrialStatus.tsx  # Free trial tracking
│   └── UpgradeModal.tsx # Premium upgrade modal
├── utils/               # Utility functions
│   ├── dreamAnalysis.ts # AI analysis logic
│   └── storage.ts       # Data persistence
├── types/               # TypeScript type definitions
│   └── index.ts         # Core data models
├── App.tsx              # Main application component
└── main.tsx             # Application entry point
```

## 🎯 Core Data Models

### User Profile
```typescript
interface User {
  id: string;
  name: string;
  surname: string;
  age: number;
  sex: 'male' | 'female' | 'other';
  horoscope: string;
  email: string;
  joinDate: string;
  trialAnalysesUsed: number;
  trialAnalysesLimit: number;
  isPremium: boolean;
}
```

### Dream Entry
```typescript
interface Dream {
  id: string;
  userId: string;
  title: string;
  content: string;
  date: string;
  tags: string[];
  mood: number; // 1-5 scale
  lucidity: number; // 1-5 scale
  symbols: string[];
  themes: string[];
  analysis?: DreamAnalysis;
  visualizationUrl?: string;
}
```

## 🔮 AI Analysis Features

### Symbol Interpretation
- **Water**: Emotions, subconscious, cleansing, life force
- **Flying**: Freedom, transcendence, overcoming obstacles
- **Animals**: Instincts, natural desires, untamed aspects
- **Death**: Transformation, endings, rebirth, fear of change
- **House**: Self, mind, different aspects of personality

### Horoscope Integration
- **Aries**: Leadership, courage, impulsiveness, adventure
- **Pisces**: Intuition, creativity, spirituality, empathy
- **Scorpio**: Intensity, transformation, mystery, depth
- *And all 12 zodiac signs with unique characteristics*

### Personalized Insights
- Age-appropriate interpretations
- Gender-specific symbol meanings
- Horoscope-based pattern recognition
- Cultural and psychological context

## 🎨 Design Philosophy

### Visual Design
- **Apple-level aesthetics** with meticulous attention to detail
- **Gradient backgrounds** and smooth transitions
- **Consistent 8px spacing** system
- **Comprehensive color palette** with 6+ color ramps
- **Responsive design** for all device sizes

### User Experience
- **Progressive disclosure** to manage complexity
- **Contextual help** and tooltips
- **Smooth animations** and micro-interactions
- **Intuitive navigation** with clear visual hierarchy

## 🔒 Security & Privacy

### Data Protection
- **Local Storage**: All data stored securely on user's device
- **No Server Dependencies**: Complete privacy with client-side storage
- **Data Export**: Users can export all their data anytime
- **Data Deletion**: Complete data clearing functionality

### Privacy Features
- **No Tracking**: No analytics or user tracking
- **Offline Capable**: Works without internet connection
- **User Control**: Full control over data sharing and deletion

## 🚀 Deployment

### Netlify (Recommended)
1. Build the project: `npm run build`
2. Deploy the `dist` folder to Netlify
3. Configure redirects for SPA routing

### Vercel
1. Connect your GitHub repository
2. Vercel will automatically detect Vite configuration
3. Deploy with zero configuration

### Manual Deployment
1. Run `npm run build`
2. Upload the `dist` folder to any static hosting service
3. Configure server for SPA routing

## 🔮 Future Enhancements

### AI Integration
- [ ] OpenAI GPT-4 integration for advanced analysis
- [ ] DALL-E 3 integration for dream visualization
- [ ] Voice-to-text dream entry
- [ ] Multi-language support

### Advanced Features
- [ ] Dream sharing and community features
- [ ] Advanced pattern recognition
- [ ] Sleep cycle integration
- [ ] Meditation and lucid dreaming guides

### Mobile App
- [ ] React Native mobile application
- [ ] Push notifications for dream logging
- [ ] Offline synchronization
- [ ] Camera integration for dream sketches

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

For support, email support@dreamvision.app or create an issue in this repository.

## 🙏 Acknowledgments

- **Lucide React** for beautiful icons
- **Tailwind CSS** for utility-first styling
- **Pexels** for stock photography
- **React Team** for the amazing framework
- **Vite Team** for the lightning-fast build tool

---

**Made with ❤️ for dreamers everywhere**

*Transform your dreams into insights and art with DreamVision*