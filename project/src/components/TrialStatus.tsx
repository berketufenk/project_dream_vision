import React from 'react';
import { Star, Crown, Zap, Gift } from 'lucide-react';
import { User } from '../types';

interface TrialStatusProps {
  user: User;
  onUpgrade?: () => void;
}

export function TrialStatus({ user, onUpgrade }: TrialStatusProps) {
  const remainingAnalyses = user.trialAnalysesLimit - user.trialAnalysesUsed;
  const isTrialExpired = remainingAnalyses <= 0 && !user.isPremium;
  
  if (user.isPremium) {
    return (
      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl p-4 text-white">
        <div className="flex items-center space-x-3">
          <Crown className="w-6 h-6" />
          <div>
            <h3 className="font-semibold">Premium Member</h3>
            <p className="text-sm text-yellow-100">Unlimited dream analyses & visualizations</p>
          </div>
        </div>
      </div>
    );
  }

  if (isTrialExpired) {
    return (
      <div className="bg-gradient-to-r from-red-500 to-pink-600 rounded-xl p-4 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Zap className="w-6 h-6" />
            <div>
              <h3 className="font-semibold">Trial Expired</h3>
              <p className="text-sm text-red-100">Upgrade to continue analyzing your dreams</p>
            </div>
          </div>
          {onUpgrade && (
            <button
              onClick={onUpgrade}
              className="px-4 py-2 bg-white text-red-600 rounded-lg font-medium hover:bg-red-50 transition-colors"
            >
              Upgrade Now
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-4 text-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Gift className="w-6 h-6" />
          <div>
            <h3 className="font-semibold">Free Trial</h3>
            <p className="text-sm text-blue-100">
              {remainingAnalyses} of {user.trialAnalysesLimit} free analyses remaining
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {Array.from({ length: user.trialAnalysesLimit }).map((_, index) => (
            <Star
              key={index}
              className={`w-4 h-4 ${
                index < user.trialAnalysesUsed ? 'text-yellow-300 fill-current' : 'text-white/50'
              }`}
            />
          ))}
        </div>
      </div>
      {remainingAnalyses <= 1 && onUpgrade && (
        <div className="mt-3 pt-3 border-t border-white/20">
          <button
            onClick={onUpgrade}
            className="w-full px-4 py-2 bg-white/20 text-white rounded-lg font-medium hover:bg-white/30 transition-colors"
          >
            Upgrade for Unlimited Access
          </button>
        </div>
      )}
    </div>
  );
}