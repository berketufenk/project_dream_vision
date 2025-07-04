import React, { useState } from 'react';
import { Plus, Tag, Star, Moon, Save, Sparkles, Lock, Crown } from 'lucide-react';
import { Dream, User } from '../types';

interface DreamFormProps {
  onSave: (dream: Omit<Dream, 'id' | 'userId' | 'date'>) => void;
  onCancel: () => void;
  user: User;
  onUpgrade?: () => void;
}

export function DreamForm({ onSave, onCancel, user, onUpgrade }: DreamFormProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState(3);
  const [lucidity, setLucidity] = useState(2);
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [requestAnalysis, setRequestAnalysis] = useState(true);

  const canRequestAnalysis = user.isPremium || user.trialAnalysesUsed < user.trialAnalysesLimit;
  const remainingAnalyses = user.trialAnalysesLimit - user.trialAnalysesUsed;

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && content.trim()) {
      onSave({
        title: title.trim(),
        content: content.trim(),
        mood,
        lucidity,
        tags,
        themes: [], // Will be populated by analysis
        symbols: [], // Will be populated by analysis
        isTrialAnalysis: !user.isPremium && requestAnalysis
      });
    }
  };

  const moodLabels = ['Terrible', 'Poor', 'Okay', 'Good', 'Amazing'];
  const lucidityLabels = ['None', 'Slight', 'Moderate', 'High', 'Full'];

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
          <Plus className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Record New Dream</h2>
          <p className="text-gray-600">Capture the details of your dream experience</p>
        </div>
      </div>

      {/* AI Analysis Option */}
      <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <div>
              <h3 className="font-medium text-gray-900">AI Dream Analysis</h3>
              {user.isPremium ? (
                <p className="text-sm text-gray-600">Unlimited analyses with Premium</p>
              ) : (
                <p className="text-sm text-gray-600">
                  {remainingAnalyses} free {remainingAnalyses === 1 ? 'analysis' : 'analyses'} remaining
                </p>
              )}
            </div>
          </div>
          
          {canRequestAnalysis ? (
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={requestAnalysis}
                onChange={(e) => setRequestAnalysis(e.target.checked)}
                className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
              />
              <span className="text-sm text-gray-700">Request Analysis</span>
            </label>
          ) : (
            <div className="flex items-center space-x-2">
              <Lock className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-500">Trial Expired</span>
              {onUpgrade && (
                <button
                  onClick={onUpgrade}
                  className="text-sm text-purple-600 hover:text-purple-800 font-medium"
                >
                  Upgrade
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Dream Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Give your dream a memorable title..."
            required
          />
        </div>

        {/* Content */}
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
            Dream Description
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={8}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Describe your dream in detail... What happened? Who was there? How did you feel?"
            required
          />
        </div>

        {/* Mood and Lucidity */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Star className="w-4 h-4 inline mr-1" />
              Dream Mood
            </label>
            <div className="space-y-2">
              <input
                type="range"
                min="1"
                max="5"
                value={mood}
                onChange={(e) => setMood(Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>1</span>
                <span>2</span>
                <span>3</span>
                <span>4</span>
                <span>5</span>
              </div>
              <p className="text-sm text-gray-600 text-center">
                {mood}/5 - {moodLabels[mood - 1]}
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Moon className="w-4 h-4 inline mr-1" />
              Lucidity Level
            </label>
            <div className="space-y-2">
              <input
                type="range"
                min="1"
                max="5"
                value={lucidity}
                onChange={(e) => setLucidity(Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>1</span>
                <span>2</span>
                <span>3</span>
                <span>4</span>
                <span>5</span>
              </div>
              <p className="text-sm text-gray-600 text-center">
                {lucidity}/5 - {lucidityLabels[lucidity - 1]}
              </p>
            </div>
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Tag className="w-4 h-4 inline mr-1" />
            Tags
          </label>
          <div className="flex flex-wrap gap-2 mb-3">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-2 text-purple-600 hover:text-purple-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <div className="flex space-x-2">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Add a tag..."
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Add
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Dream</span>
          </button>
        </div>
      </form>
    </div>
  );
}