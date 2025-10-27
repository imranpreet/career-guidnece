import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { RocketLaunchIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const CTASection: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: 'Hello! I\'m your AI Career Coach. How can I help you accelerate your career today?'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check if user is logged in
  React.useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const openChat = () => {
    setIsChatOpen(true);
  };

  const closeChat = () => {
    setIsChatOpen(false);
  };

  const sendMessage = async () => {
    if (inputMessage.trim()) {
      const userMessage: ChatMessage = {
        role: 'user',
        content: inputMessage
      };
      
      setMessages([...messages, userMessage]);
      setInputMessage('');
      setIsLoading(true);
      
      try {
        if (!isLoggedIn) {
          // Show login prompt for non-authenticated users
          setTimeout(() => {
            const loginPrompt: ChatMessage = {
              role: 'assistant',
              content: 'To get personalized AI career guidance, please create an account or sign in. I can provide much better advice when I know your background and career goals!'
            };
            setMessages(prev => [...prev, loginPrompt]);
            setIsLoading(false);
          }, 1000);
          return;
        }

        // Call backend AI API
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/ai/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            message: inputMessage,
            context: messages.slice(-5) // Send last 5 messages for context
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const aiResponse: ChatMessage = {
            role: 'assistant',
            content: data.response
          };
          setMessages(prev => [...prev, aiResponse]);
        } else {
          throw new Error('Failed to get AI response');
        }
      } catch (error) {
        console.error('Error sending message:', error);
        const errorResponse: ChatMessage = {
          role: 'assistant',
          content: 'I apologize, but I\'m having trouble connecting right now. Please try again in a moment, or feel free to explore our other features!'
        };
        setMessages(prev => [...prev, errorResponse]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <section className="py-20 gradient-bg relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-32 h-32 bg-accent-500 rounded-full opacity-10 animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-secondary-400 rounded-full opacity-10 animate-pulse delay-700"></div>
      </div>
      
      <div className="container mx-auto px-6 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Ready to Accelerate Your{' '}
            <span className="text-accent-400">Career?</span>
          </h2>
          
          <p className="text-xl md:text-2xl text-gray-200 mb-12 max-w-3xl mx-auto leading-relaxed">
            Start your journey today with personalized AI guidance. 
            Get instant answers to your career questions and unlock your potential.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            {isLoggedIn ? (
              <button 
                onClick={openChat}
                className="btn-accent group text-xl px-12 py-4"
              >
                <RocketLaunchIcon className="w-6 h-6 mr-3 group-hover:animate-bounce" />
                Start Your AI Career Chat
              </button>
            ) : (
              <>
                <Link to="/register" className="btn-accent group text-xl px-12 py-4">
                  <RocketLaunchIcon className="w-6 h-6 mr-3 group-hover:animate-bounce" />
                  Get Started Free
                </Link>
                <button 
                  onClick={openChat}
                  className="btn-secondary group text-xl px-8 py-4"
                >
                  Try AI Chat Demo
                </button>
              </>
            )}
          </div>
          
          <div className="mt-12 text-gray-300">
            <p className="text-lg">Join <span className="text-accent-400 font-bold">10,000+</span> professionals already using our platform</p>
          </div>
        </div>
      </div>
      
      {/* AI Chat Modal */}
      {isChatOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md h-96 flex flex-col shadow-2xl">
            {/* Chat Header */}
            <div className="bg-primary-600 text-white p-4 rounded-t-2xl flex justify-between items-center">
              <h3 className="font-bold">AI Career Coach</h3>
              <button 
                onClick={closeChat}
                className="text-white hover:text-gray-300"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            
            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {messages.map((message, index) => (
                <div 
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-xs p-3 rounded-lg ${
                      message.role === 'user' 
                        ? 'bg-primary-600 text-white' 
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white p-3 rounded-lg max-w-xs">
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>
                      <span>AI is thinking...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Input */}
            <div className="p-4 border-t dark:border-gray-700">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Ask about your career..."
                  className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
                <button 
                  onClick={sendMessage}
                  disabled={isLoading || !inputMessage.trim()}
                  className="btn-primary px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Sending...' : 'Send'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default CTASection;