import React, { useState } from 'react';
import { Search, Filter, Calendar, Star, Moon, Tag, Eye, Trash2, Edit, Sparkles } from 'lucide-react';
import { Dream } from '../types';

interface DreamListProps {
  dreams: Dream[];
  onDreamSelect: (dream: Dream) => void;
  onDeleteDream: (dreamId: string) => void;
  onEditDream: (dream: Dream) => void;
}

export function DreamList({ dreams, onDreamSelect, onDeleteDream, onEditDream }: DreamListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'date' | 'mood' | 'lucidity'>('date');

  const allTags = Array.from(new Set(dreams.flatMap(dream => dream.tags)));

  const filteredDreams = dreams
    .filter(dream => {
      const matchesSearch = dream.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          dream.content.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTags = selectedTags.length === 0 || selectedTags.some(tag => dream.tags.includes(tag));
      return matchesSearch && matchesTags;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'mood':
          return b.mood - a.mood;
        case 'lucidity':
          return b.lucidity - a.lucidity;
        default:
          return 0;
      }
    });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Dream Journal</h2>
          <p className="text-gray-600">Browse and manage your dream entries</p>
        </div>
        <div className="text-sm text-gray-500">
          {filteredDreams.length} of {dreams.length} dreams
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search dreams..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Sort */}
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'mood' | 'lucidity')}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="date">Sort by Date</option>
              <option value="mood">Sort by Mood</option>
              <option value="lucidity">Sort by Lucidity</option>
            </select>
          </div>
        </div>

        {/* Tag Filter */}
        {allTags.length > 0 && (
          <div className="mt-4">
            <div className="flex flex-wrap gap-2">
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => {
                    setSelectedTags(prev => 
                      prev.includes(tag) 
                        ? prev.filter(t => t !== tag)
                        : [...prev, tag]
                    );
                  }}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    selectedTags.includes(tag)
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Dream List */}
      <div className="space-y-4">
        {filteredDreams.map(dream => (
          <div key={dream.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{dream.title}</h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{dream.content}</p>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(dream.date)}</span>
                    </div>
                    <div className={`flex items-center space-x-1 px-2 py-1 rounded-full ${getMoodColor(dream.mood)}`}>
                      <Star className="w-4 h-4" />
                      <span>{dream.mood}/5</span>
                    </div>
                    <div className={`flex items-center space-x-1 px-2 py-1 rounded-full ${getLucidityColor(dream.lucidity)}`}>
                      <Moon className="w-4 h-4" />
                      <span>{dream.lucidity}/5</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => onDreamSelect(dream)}
                    className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onEditDream(dream)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit Dream"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDeleteDream(dream.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete Dream"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Tags */}
              {dream.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {dream.tags.map(tag => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700"
                    >
                      <Tag className="w-3 h-3 mr-1" />
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Analysis Status */}
              {dream.analysis && (
                <div className="flex items-center space-x-2 text-sm text-green-600">
                  <Sparkles className="w-4 h-4" />
                  <span>AI Analysis Available</span>
                </div>
              )}
            </div>
          </div>
        ))}

        {filteredDreams.length === 0 && (
          <div className="text-center py-12">
            <Moon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No dreams found</h3>
            <p className="text-gray-600">
              {searchTerm || selectedTags.length > 0 
                ? 'Try adjusting your search or filters' 
                : 'Start by recording your first dream'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}