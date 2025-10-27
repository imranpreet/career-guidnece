import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HeroSection from './components/HeroSection';
import FeaturesSection from './components/FeaturesSection';
import HowItWorksSection from './components/HowItWorksSection';
import TestimonialsSection from './components/TestimonialsSection';
import CTASection from './components/CTASection';
import AIChat from './components/AIChat';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import './App.css';
import { ToastProvider } from './components/ui/ToastProvider';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);

  // Load dark mode preference from localStorage
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode) {
      setDarkMode(JSON.parse(savedDarkMode));
    }
  }, []);

  // Apply dark mode to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const openAIChat = () => {
    setIsAIChatOpen(true);
  };

  const closeAIChat = () => {
    setIsAIChatOpen(false);
  };

  // Home component for the landing page
  const Home = () => (
    <main className="pt-16">
      <section id="home">
        <HeroSection />
      </section>
      
      <section id="features">
        <FeaturesSection />
      </section>
      
      <section id="how-it-works">
        <HowItWorksSection />
      </section>
      
      <section id="testimonials">
        <TestimonialsSection />
      </section>
      
      <CTASection />
    </main>
  );

  return (
    <Router>
      <ToastProvider>
      <div className="App">
        <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
        
        <Footer />
        
        {/* Floating AI Chat Button */}
        <button
          onClick={openAIChat}
          className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 animate-bounce hover:animate-none"
          aria-label="Open AI Chat"
        >
          <ChatBubbleLeftRightIcon className="w-6 h-6" />
        </button>
        
        {/* AI Chat Modal */}
        <AIChat isOpen={isAIChatOpen} onClose={closeAIChat} />
      </div>
      </ToastProvider>
    </Router>
  );
}

export default App;
