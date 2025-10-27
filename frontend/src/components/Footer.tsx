import React, { useState } from 'react';
import { 
  MapPinIcon, 
  PhoneIcon, 
  EnvelopeIcon
} from '@heroicons/react/24/outline';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      setSubscriptionStatus('error');
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setIsSubscribing(true);
    setSubscriptionStatus('idle');
    setErrorMessage('');

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setSubscriptionStatus('success');
        setEmail(''); // Clear the input
      } else {
        setSubscriptionStatus('error');
        setErrorMessage(data.message || 'Subscription failed. Please try again.');
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      setSubscriptionStatus('error');
      setErrorMessage('Network error. Please check your connection and try again.');
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-accent-400">AI Career Coach</h3>
            <p className="text-gray-400 leading-relaxed">
              Empowering professionals worldwide with AI-powered career guidance, 
              resume building, and interview preparation.
            </p>
            <div className="flex space-x-4">
              <a href="https://twitter.com/aicareercoach" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-accent-400 transition-colors">
                <TwitterIcon className="w-5 h-5" />
              </a>
              <a href="https://linkedin.com/company/aicareercoach" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-accent-400 transition-colors">
                <LinkedInIcon className="w-5 h-5" />
              </a>
              <a href="https://github.com/aicareercoach" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-accent-400 transition-colors">
                <GitHubIcon className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Quick Links</h4>
            <div className="space-y-2">
              <a href="#features" className="block text-gray-400 hover:text-white transition-colors">
                Features
              </a>
              <a href="#how-it-works" className="block text-gray-400 hover:text-white transition-colors">
                How It Works
              </a>
              <a href="#testimonials" className="block text-gray-400 hover:text-white transition-colors">
                Testimonials
              </a>
              <a href="/dashboard" className="block text-gray-400 hover:text-white transition-colors">
                Dashboard
              </a>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Services</h4>
            <div className="space-y-2">
              <a href="/resume-builder" className="block text-gray-400 hover:text-white transition-colors">
                Resume Builder
              </a>
              <a href="/interview-prep" className="block text-gray-400 hover:text-white transition-colors">
                Interview Prep
              </a>
              <a href="/career-guidance" className="block text-gray-400 hover:text-white transition-colors">
                Career Guidance
              </a>
              <a href="/skills-assessment" className="block text-gray-400 hover:text-white transition-colors">
                Skills Assessment
              </a>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <EnvelopeIcon className="w-5 h-5 text-accent-400" />
                <span className="text-gray-400">support@aicareercoach.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <PhoneIcon className="w-5 h-5 text-accent-400" />
                <span className="text-gray-400">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPinIcon className="w-5 h-5 text-accent-400" />
                <span className="text-gray-400">San Francisco, CA</span>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="max-w-md mx-auto text-center">
            <h4 className="text-lg font-semibold mb-4">Stay Updated</h4>
            <p className="text-gray-400 mb-6">
              Get the latest career tips and industry insights delivered to your inbox.
            </p>
            
            {subscriptionStatus === 'success' ? (
              <div className="p-4 bg-green-900/20 border border-green-800 rounded-lg">
                <div className="flex items-center justify-center space-x-2 text-green-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Thank you for subscribing!</span>
                </div>
                <p className="text-green-300 text-sm mt-2">
                  You'll receive career tips and insights in your inbox soon.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-4">
                <div className="flex space-x-2">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isSubscribing}
                    className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 text-white placeholder-gray-400 disabled:opacity-50"
                  />
                  <button 
                    type="submit"
                    disabled={isSubscribing || !email}
                    className="btn-accent px-6 py-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    {isSubscribing ? (
                      <>
                        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Subscribing...</span>
                      </>
                    ) : (
                      <span>Subscribe</span>
                    )}
                  </button>
                </div>
                
                {subscriptionStatus === 'error' && (
                  <div className="p-3 bg-red-900/20 border border-red-800 rounded-lg">
                    <div className="flex items-center space-x-2 text-red-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm">{errorMessage}</span>
                    </div>
                  </div>
                )}
              </form>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © {currentYear} AI Career Coach. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">
              Privacy Policy
            </a>
            <a href="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">
              Terms of Service
            </a>
            <a href="/cookies" className="text-gray-400 hover:text-white text-sm transition-colors">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Mock social media icons since they might not be available in heroicons
const TwitterIcon = ({ className }: { className: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
  </svg>
);

const LinkedInIcon = ({ className }: { className: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const GitHubIcon = ({ className }: { className: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
  </svg>
);

export default Footer;