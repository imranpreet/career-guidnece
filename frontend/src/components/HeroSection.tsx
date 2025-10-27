import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRightIcon, PlayIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import VideoGallery from './VideoGallery';
import AIChat from './AIChat';

const HeroSection: React.FC = () => {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);

  const openVideo = () => {
    setIsVideoOpen(true);
  };

  const closeVideo = () => {
    setIsVideoOpen(false);
  };

  const openAIChat = () => {
    setIsAIChatOpen(true);
  };

  const closeAIChat = () => {
    setIsAIChatOpen(false);
  };
  return (
    <div className="gradient-bg min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-accent-500 rounded-full opacity-10 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-secondary-400 rounded-full opacity-10 animate-pulse delay-1000"></div>
      </div>
      
      <div className="container mx-auto px-6 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Accelerate Your Career with{' '}
            <span className="text-accent-400">AI-Powered</span> Guidance
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-200 mb-12 max-w-3xl mx-auto leading-relaxed">
            Transform your career journey with personalized AI coaching, smart resume building, 
            interview preparation, and industry insights that adapt to your unique goals.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link to="/register" className="btn-accent group">
              Get Started
              <ChevronRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <button 
              onClick={openVideo}
              className="flex items-center text-white hover:text-accent-400 transition-colors bg-white/10 backdrop-blur-sm px-6 py-3 rounded-lg hover:bg-white/20 group"
            >
              <PlayIcon className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform" />
              Watch Demo
            </button>
            
            <button 
              onClick={openAIChat}
              className="flex items-center text-white hover:text-white transition-all bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 px-8 py-4 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 group animate-pulse hover:animate-none"
            >
              <ChatBubbleLeftRightIcon className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform" />
              <span className="font-semibold">Chat with AI Coach Now! 🚀</span>
            </button>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-20 text-white">
            <div>
              <div className="text-4xl font-bold text-accent-400">10K+</div>
              <div className="text-gray-300">Career Success Stories</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-accent-400">95%</div>
              <div className="text-gray-300">Interview Success Rate</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-accent-400">24/7</div>
              <div className="text-gray-300">AI Career Support</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>

      {/* Video Gallery Modal */}
      <VideoGallery 
        isOpen={isVideoOpen} 
        onClose={closeVideo} 
      />

      {/* AI Chat Modal */}
      <AIChat 
        isOpen={isAIChatOpen} 
        onClose={closeAIChat} 
      />
    </div>
  );
};

export default HeroSection;