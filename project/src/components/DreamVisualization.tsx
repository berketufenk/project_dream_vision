import React, { useState } from 'react';
import { Image, Palette, Download, Share2, RefreshCw, Sparkles, Wand2 } from 'lucide-react';
import { Dream } from '../types';

interface DreamVisualizationProps {
  dream: Dream;
  onGenerateVisualization: (dreamId: string, style: string) => void;
}

export function DreamVisualization({ dream, onGenerateVisualization }: DreamVisualizationProps) {
  const [selectedStyle, setSelectedStyle] = useState('dreamy');
  const [isGenerating, setIsGenerating] = useState(false);

  const artStyles = [
    { id: 'dreamy', name: 'Dreamy Surreal', description: 'Soft, ethereal, Salvador Dalí inspired' },
    { id: 'realistic', name: 'Photorealistic', description: 'Lifelike, detailed, professional photography' },
    { id: 'watercolor', name: 'Watercolor', description: 'Soft, flowing, artistic painting style' },
    { id: 'digital', name: 'Digital Art', description: 'Modern, vibrant, conceptual digital artwork' },
    { id: 'abstract', name: 'Abstract', description: 'Symbolic, colorful, interpretive art' },
    { id: 'vintage', name: 'Vintage', description: 'Retro, nostalgic, classic art style' }
  ];

  const handleGenerate = async () => {
    setIsGenerating(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    onGenerateVisualization(dream.id, selectedStyle);
    setIsGenerating(false);
  };

  // Simulate different visualizations based on dream content
  const getVisualizationUrl = () => {
    const content = dream.content.toLowerCase();
    if (content.includes('ocean') || content.includes('water')) {
      return 'https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg?auto=compress&cs=tinysrgb&w=800';
    }
    if (content.includes('mountain') || content.includes('sky')) {
      return 'https://images.pexels.com/photos/1271619/pexels-photo-1271619.jpeg?auto=compress&cs=tinysrgb&w=800';
    }
    if (content.includes('forest') || content.includes('tree')) {
      return 'https://images.pexels.com/photos/1005417/pexels-photo-1005417.jpeg?auto=compress&cs=tinysrgb&w=800';
    }
    if (content.includes('night') || content.includes('dark')) {
      return 'https://images.pexels.com/photos/1624438/pexels-photo-1624438.jpeg?auto=compress&cs=tinysrgb&w=800';
    }
    return 'https://images.pexels.com/photos/1275929/pexels-photo-1275929.jpeg?auto=compress&cs=tinysrgb&w=800';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 text-white">
        <div className="flex items-center space-x-3 mb-4">
          <Wand2 className="w-8 h-8" />
          <div>
            <h2 className="text-2xl font-bold">Dream Visualization</h2>
            <p className="text-purple-100">Transform your dreams into stunning visual art</p>
          </div>
        </div>
        
        <div className="bg-white/10 rounded-lg p-4">
          <h3 className="font-semibold text-lg mb-2">{dream.title}</h3>
          <p className="text-sm text-purple-100 line-clamp-2">{dream.content}</p>
        </div>
      </div>

      {/* Current Visualization */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Generated Visualization</h3>
        
        <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden mb-4">
          <img
            src={getVisualizationUrl()}
            alt="Dream Visualization"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-600">Style: {selectedStyle}</p>
            <p className="text-xs text-gray-500">Generated based on your dream content and profile</p>
          </div>
          
          <div className="flex space-x-2">
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <Share2 className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <Download className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Art Style Selection */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Palette className="w-6 h-6 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-900">Choose Art Style</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {artStyles.map(style => (
            <button
              key={style.id}
              onClick={() => setSelectedStyle(style.id)}
              className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                selectedStyle === style.id
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <h4 className="font-medium text-gray-900 mb-1">{style.name}</h4>
              <p className="text-sm text-gray-600">{style.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Generation Controls */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Generate New Visualization</h3>
            <p className="text-gray-600">Create a new artistic interpretation of your dream</p>
          </div>
          
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className={`px-6 py-3 rounded-lg flex items-center space-x-2 transition-all duration-200 ${
              isGenerating
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700'
            }`}
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Generate Art</span>
              </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Personalized Generation</h4>
            <p>AI considers your horoscope, age, and gender for unique interpretations</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <h4 className="font-medium text-purple-900 mb-2">Multiple Styles</h4>
            <p>Choose from various artistic styles to match your vision</p>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Visualization Tips</h3>
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <Image className="w-5 h-5 text-purple-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-gray-900">Detailed Descriptions</h4>
              <p className="text-sm text-gray-600">More detailed dream descriptions create more accurate visualizations</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <Palette className="w-5 h-5 text-purple-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-gray-900">Experiment with Styles</h4>
              <p className="text-sm text-gray-600">Try different art styles to find the perfect representation</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <Sparkles className="w-5 h-5 text-purple-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-gray-900">Save Your Favorites</h4>
              <p className="text-sm text-gray-600">Download and share visualizations that resonate with you</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}