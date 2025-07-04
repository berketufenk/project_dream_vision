import React from 'react';
import { Brain, Star, Heart, Eye, Sparkles, BookOpen, Zap } from 'lucide-react';
import { Dream, DreamAnalysis as DreamAnalysisType } from '../types';

interface DreamAnalysisProps {
  dream: Dream;
  analysis: DreamAnalysisType;
}

export function DreamAnalysis({ dream, analysis }: DreamAnalysisProps) {
  const getMoodColor = (mood: number) => {
    if (mood >= 4) return 'text-green-600 bg-green-100';
    if (mood >= 3) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getLucidityColor = (lucidity: number) => {
    if (lucidity >= 4) return 'text-purple-600 bg-purple-100';
    if (lucidity >= 3) return 'text-blue-600 bg-blue-100';
    return 'text-gray-600 bg-gray-100';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 text-white">
        <div className="flex items-center space-x-3 mb-4">
          <Brain className="w-8 h-8" />
          <div>
            <h2 className="text-2xl font-bold">AI Dream Analysis</h2>
            <p className="text-purple-100">Personalized insights into your dream</p>
          </div>
        </div>
        
        <div className="bg-white/10 rounded-lg p-4">
          <h3 className="font-semibold text-lg mb-2">{dream.title}</h3>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4" />
              <span>Mood: {dream.mood}/5</span>
            </div>
            <div className="flex items-center space-x-1">
              <Eye className="w-4 h-4" />
              <span>Lucidity: {dream.lucidity}/5</span>
            </div>
          </div>
        </div>
      </div>

      {/* Overview */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Overview</h3>
        </div>
        <p className="text-gray-700 leading-relaxed">{analysis.overview}</p>
      </div>

      {/* Symbols */}
      {analysis.symbols.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Symbol Interpretations</h3>
          </div>
          <div className="space-y-4">
            {analysis.symbols.map((symbol, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2 capitalize">{symbol.symbol}</h4>
                <p className="text-gray-700 text-sm mb-2">{symbol.meaning}</p>
                <p className="text-purple-600 text-sm font-medium">{symbol.personalRelevance}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Themes and Emotions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <Zap className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Themes</h3>
          </div>
          <div className="space-y-2">
            {analysis.themes.map((theme, index) => (
              <div key={index} className="px-3 py-2 bg-green-50 rounded-lg text-green-800 text-sm">
                {theme}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <Heart className="w-5 h-5 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Emotions</h3>
          </div>
          <div className="space-y-2">
            {analysis.emotions.map((emotion, index) => (
              <div key={index} className="px-3 py-2 bg-red-50 rounded-lg text-red-800 text-sm">
                {emotion}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Personalized Insights */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
            <Star className="w-5 h-5 text-yellow-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Personalized Insights</h3>
        </div>
        <div className="space-y-3">
          {analysis.personalizedInsights.map((insight, index) => (
            <div key={index} className="p-4 bg-yellow-50 rounded-lg">
              <p className="text-gray-700 text-sm">{insight}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Horoscope Connection */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
            <Star className="w-5 h-5 text-indigo-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Horoscope Connection</h3>
        </div>
        <div className="p-4 bg-indigo-50 rounded-lg">
          <p className="text-gray-700 text-sm">{analysis.horoscopeConnection}</p>
        </div>
      </div>

      {/* Psychological Meaning */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
            <Brain className="w-5 h-5 text-pink-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Psychological Meaning</h3>
        </div>
        <div className="p-4 bg-pink-50 rounded-lg">
          <p className="text-gray-700 text-sm">{analysis.psychologicalMeaning}</p>
        </div>
      </div>
    </div>
  );
}