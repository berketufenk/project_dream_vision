import React from 'react';
import { Moon, Star, BookOpen, TrendingUp, Calendar, Brain, Target } from 'lucide-react';
import { DreamStats, User } from '../types';
import { TrialStatus } from './TrialStatus';

interface DashboardProps {
  stats: DreamStats;
  user: User;
  onUpgrade?: () => void;
}

export function Dashboard({ stats, user, onUpgrade }: DashboardProps) {
  const StatCard = ({ title, value, icon: Icon, color, subtitle }: any) => (
    <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`w-12 h-12 rounded-lg ${color} flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  return (
    <div className="space-y-6">
      {/* Trial Status */}
      <TrialStatus user={user} onUpgrade={onUpgrade} />

      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Welcome to Your Dream Dashboard</h2>
        <p className="text-purple-100">Track your dreams, discover patterns, and unlock the mysteries of your subconscious mind.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Dreams"
          value={stats.totalDreams}
          icon={Moon}
          color="bg-blue-500"
          subtitle="Dreams recorded"
        />
        <StatCard
          title="Average Mood"
          value={stats.averageMood.toFixed(1)}
          icon={Star}
          color="bg-yellow-500"
          subtitle="Out of 5.0"
        />
        <StatCard
          title="Average Lucidity"
          value={stats.averageLucidity.toFixed(1)}
          icon={Brain}
          color="bg-purple-500"
          subtitle="Lucid dreaming level"
        />
        <StatCard
          title="Dream Streak"
          value={stats.dreamingStreak}
          icon={Target}
          color="bg-green-500"
          subtitle="Consecutive days"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Dreams Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Dream Activity</h3>
          <div className="space-y-3">
            {months.map((month, index) => (
              <div key={month} className="flex items-center space-x-3">
                <span className="text-sm font-medium text-gray-600 w-8">{month}</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full"
                    style={{ width: `${(stats.monthlyDreams[index] / Math.max(...stats.monthlyDreams)) * 100}%` }}
                  />
                </div>
                <span className="text-sm text-gray-500 w-8">{stats.monthlyDreams[index]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Common Themes */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Most Common Themes</h3>
          <div className="space-y-3">
            {stats.mostCommonThemes.slice(0, 6).map((theme, index) => (
              <div key={theme} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">{theme}</span>
                <span className="text-xs text-gray-500">#{index + 1}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Dream Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <TrendingUp className="w-6 h-6 text-blue-600 mb-2" />
            <h4 className="font-medium text-gray-900">Pattern Recognition</h4>
            <p className="text-sm text-gray-600 mt-1">AI has detected recurring themes in your dreams</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <Calendar className="w-6 h-6 text-purple-600 mb-2" />
            <h4 className="font-medium text-gray-900">Sleep Cycle</h4>
            <p className="text-sm text-gray-600 mt-1">Your dreams show patterns related to your sleep schedule</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <BookOpen className="w-6 h-6 text-green-600 mb-2" />
            <h4 className="font-medium text-gray-900">Journal Progress</h4>
            <p className="text-sm text-gray-600 mt-1">Keep up the great work with consistent dream logging</p>
          </div>
        </div>
      </div>
    </div>
  );
}