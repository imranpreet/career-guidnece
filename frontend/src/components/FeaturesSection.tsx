import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  CpuChipIcon, 
  DocumentTextIcon, 
  ChatBubbleLeftRightIcon,
  ChartBarIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import QuizDemo from './QuizDemo';
import AIChat from './AIChat';
import ResumeBuilder from './ResumeBuilder';

const features = [
  {
    id: 'ai-guidance',
    icon: CpuChipIcon,
    title: 'AI-Powered Career Guidance',
    description: 'Get personalized career recommendations based on your skills, experience, and industry trends. Real-time suggestions for career growth and development.',
    color: 'from-purple-500 to-pink-500',
    actionText: 'Try AI Chat',
    demoContent: {
      title: 'AI Career Guidance Demo',
      description: 'Experience personalized career advice powered by artificial intelligence.',
      features: [
        'Personalized career path recommendations',
        'Skills gap analysis and development suggestions',
        'Industry trend insights and opportunities',
        'Real-time career coaching and guidance'
      ]
    }
  },
  {
    id: 'interview-prep',
    icon: ChatBubbleLeftRightIcon,
    title: 'Interview Preparation',
    description: 'Practice with interactive quizzes and mock interviews. AI generates questions relevant to current industry needs and tracks your performance.',
    color: 'from-blue-500 to-cyan-500',
    actionText: 'Start Practice',
    demoContent: {
      title: 'Interview Preparation Tools',
      description: 'Master your interviews with AI-powered practice sessions.',
      features: [
        'Industry-specific interview questions',
        'Mock interview simulations with feedback',
        'Performance tracking and improvement tips',
        'Behavioral and technical question practice'
      ]
    }
  },
  {
    id: 'industry-insights',
    icon: ChartBarIcon,
    title: 'Industry Insights',
    description: 'Stay updated with trending skills, roles, and companies. Get analytics on demand and discover new career opportunities in your field.',
    color: 'from-green-500 to-teal-500',
    actionText: 'View Insights',
    demoContent: {
      title: 'Industry Analytics & Insights',
      description: 'Stay ahead with real-time industry data and trends.',
      features: [
        'Trending skills and technologies',
        'Salary benchmarks and market rates',
        'Company growth and hiring trends',
        'Career opportunity predictions'
      ]
    }
  },
  {
    id: 'resume-builder',
    icon: DocumentTextIcon,
    title: 'Smart Resume Creation',
    description: 'Build professional resumes with AI assistance. Input your details and get a ready-to-download resume following industry standards.',
    color: 'from-orange-500 to-red-500',
    actionText: 'Build Resume',
    demoContent: {
      title: 'AI-Powered Resume Builder',
      description: 'Create professional resumes that stand out to employers.',
      features: [
        'ATS-optimized resume templates',
        'AI-powered content suggestions',
        'Industry-specific formatting',
        'Real-time optimization feedback'
      ]
    }
  }
];

const FeaturesSection: React.FC = () => {
  const [selectedFeature, setSelectedFeature] = useState<any>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [isResumeBuilderOpen, setIsResumeBuilderOpen] = useState(false);
  const navigate = useNavigate();

  // Check if user is logged in
  React.useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleFeatureClick = (feature: any) => {
    if (feature.id === 'ai-guidance') {
      // Open AI Chat directly
      setIsAIChatOpen(true);
    } else if (feature.id === 'resume-builder') {
      // Open Resume Builder directly
      setIsResumeBuilderOpen(true);
    } else if (isLoggedIn) {
      // Navigate to specific feature pages for logged-in users
      switch (feature.id) {
        case 'interview-prep':
          navigate('/dashboard'); // Could be a specific interview prep page
          break;
        case 'industry-insights':
          navigate('/dashboard'); // Could be a specific insights page
          break;
        default:
          navigate('/dashboard');
      }
    } else {
      // Show demo modal for non-logged users
      setSelectedFeature(feature);
    }
  };

  const handleActionClick = (feature: any) => {
    if (feature.id === 'ai-guidance') {
      setIsAIChatOpen(true);
    } else if (feature.id === 'resume-builder') {
      setIsResumeBuilderOpen(true);
    } else if (isLoggedIn) {
      handleFeatureClick(feature);
    } else {
      // For interview prep and insights, show demo modal first
      setSelectedFeature(feature);
    }
  };

  const closeModal = () => {
    setSelectedFeature(null);
  };
  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Powerful Features for Your{' '}
            <span className="text-indigo-600">Career Growth</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Discover comprehensive tools designed to accelerate your professional journey 
            and unlock your full potential in today's competitive job market.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="card group hover:scale-105 transform transition-all duration-300 cursor-pointer"
              onClick={() => handleFeatureClick(feature)}
            >
              <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {feature.title}
              </h3>
              
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {feature.description}
              </p>
              
              <div className="mt-6">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleActionClick(feature);
                  }}
                  className="text-indigo-600 hover:text-indigo-800 font-semibold flex items-center group-hover:translate-x-2 transition-transform"
                >
                  {feature.id === 'ai-guidance' || feature.id === 'resume-builder' ? feature.actionText : (isLoggedIn ? feature.actionText : 'Try Demo')}
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Feature Demo Modal */}
      {selectedFeature && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Modal Header */}
            <div className={`bg-gradient-to-r ${selectedFeature.color} text-white p-6 rounded-t-2xl flex justify-between items-center`}>
              <div className="flex items-center">
                <selectedFeature.icon className="w-8 h-8 mr-3" />
                <h3 className="text-2xl font-bold">{selectedFeature.demoContent.title}</h3>
              </div>
              <button 
                onClick={closeModal}
                className="text-white hover:text-gray-300 transition-colors"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            
            {/* Modal Content */}
            <div className="p-6">
              <p className="text-gray-600 dark:text-gray-300 text-lg mb-6">
                {selectedFeature.demoContent.description}
              </p>
              
              <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Key Features:
              </h4>
              
              <ul className="space-y-3 mb-8">
                {selectedFeature.demoContent.features.map((item: string, index: number) => (
                  <li key={index} className="flex items-center text-gray-700 dark:text-gray-300">
                    <div className={`w-2 h-2 bg-gradient-to-r ${selectedFeature.color} rounded-full mr-3`}></div>
                    {item}
                  </li>
                ))}
              </ul>
              
              {/* Demo Actions */}
              <div className="flex flex-col sm:flex-row gap-4">
                {isLoggedIn ? (
                  <>
                    <button 
                      onClick={() => {
                        closeModal();
                        handleFeatureClick(selectedFeature);
                      }}
                      className="btn-primary flex-1"
                    >
                      {selectedFeature.actionText}
                    </button>
                    <Link 
                      to="/dashboard"
                      className="btn-secondary flex-1 text-center"
                      onClick={closeModal}
                    >
                      Go to Dashboard
                    </Link>
                  </>
                ) : (
                  <>
                    <Link 
                      to="/register"
                      className="btn-primary flex-1 text-center"
                      onClick={closeModal}
                    >
                      Get Started Free
                    </Link>
                    <Link 
                      to="/login"
                      className="btn-secondary flex-1 text-center"
                      onClick={closeModal}
                    >
                      Sign In
                    </Link>
                  </>
                )}
              </div>
              
              {/* Demo Preview */}
              {selectedFeature.id === 'ai-guidance' && (
                <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <h5 className="font-bold text-gray-900 dark:text-white mb-2">Demo Preview:</h5>
                  <div className="bg-white dark:bg-gray-800 p-3 rounded border-l-4 border-purple-500">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">AI Career Coach:</p>
                    <p className="text-gray-800 dark:text-gray-200">
                      "Based on your software engineering background, I recommend exploring cloud architecture roles. 
                      The demand has grown 45% this year, and your current skills align well with this path."
                    </p>
                  </div>
                </div>
              )}
              
              {selectedFeature.id === 'interview-prep' && (
                <div className="mt-8">
                  <h5 className="font-bold text-gray-900 dark:text-white mb-4">Try Interactive Quiz:</h5>
                  <QuizDemo />
                </div>
              )}
              
              {selectedFeature.id === 'industry-insights' && (
                <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <h5 className="font-bold text-gray-900 dark:text-white mb-4">Sample Insights:</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white dark:bg-gray-800 p-3 rounded">
                      <h6 className="font-semibold text-green-600 mb-1">Trending Skill</h6>
                      <p className="text-sm text-gray-900 dark:text-white">AI/Machine Learning</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">+45% demand</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-3 rounded">
                      <h6 className="font-semibold text-blue-600 mb-1">Avg Salary</h6>
                      <p className="text-sm text-gray-900 dark:text-white">$95k - $140k</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Software Engineer</p>
                    </div>
                  </div>
                </div>
              )}
              
              {selectedFeature.id === 'resume-builder' && (
                <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <h5 className="font-bold text-gray-900 dark:text-white mb-2">Sample Resume Section:</h5>
                  <div className="bg-white dark:bg-gray-800 p-3 rounded border">
                    <p className="font-semibold text-gray-900 dark:text-white">Senior Software Engineer</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">• Led team of 5 developers in building scalable microservices</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">• Reduced system latency by 40% through optimization</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">• Implemented CI/CD pipeline reducing deployment time by 60%</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* AI Chat Modal */}
      <AIChat 
        isOpen={isAIChatOpen} 
        onClose={() => setIsAIChatOpen(false)} 
      />

      {/* Resume Builder Modal */}
      <ResumeBuilder 
        isOpen={isResumeBuilderOpen} 
        onClose={() => setIsResumeBuilderOpen(false)} 
      />
    </section>
  );
};

export default FeaturesSection;