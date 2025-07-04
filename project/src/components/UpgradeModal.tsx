import React from 'react';
import { X, Crown, Check, Zap, Star, Brain, Image, Download } from 'lucide-react';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
}

export function UpgradeModal({ isOpen, onClose, onUpgrade }: UpgradeModalProps) {
  if (!isOpen) return null;

  const features = [
    { icon: Brain, text: 'Unlimited AI dream analyses' },
    { icon: Image, text: 'Unlimited dream visualizations' },
    { icon: Star, text: 'Advanced pattern recognition' },
    { icon: Download, text: 'Premium export formats' },
    { icon: Zap, text: 'Priority AI processing' },
    { icon: Crown, text: 'Exclusive premium insights' }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Crown className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Upgrade to Premium</h2>
          <p className="text-gray-600">Unlock unlimited dream analysis and exclusive features</p>
        </div>

        <div className="space-y-3 mb-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-green-600" />
                </div>
                <div className="flex items-center space-x-2">
                  <Icon className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-700">{feature.text}</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 mb-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 mb-1">$9.99</div>
            <div className="text-sm text-gray-600">per month</div>
            <div className="text-xs text-green-600 font-medium mt-1">7-day free trial</div>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={onUpgrade}
            className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-200"
          >
            Start Free Trial
          </button>
          <button
            onClick={onClose}
            className="w-full px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Maybe Later
          </button>
        </div>

        <p className="text-xs text-gray-500 text-center mt-4">
          Cancel anytime. No commitment required.
        </p>
      </div>
    </div>
  );
}