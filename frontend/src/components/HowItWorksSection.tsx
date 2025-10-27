import React from 'react';
import { Link } from 'react-router-dom';

const steps = [
  {
    number: '01',
    title: 'Professional Onboarding',
    description: 'Share your experience, education, and skills with our AI system for personalized guidance setup.',
    icon: '👤'
  },
  {
    number: '02',
    title: 'Craft Your Document',
    description: 'Build professional resumes, cover letters, and portfolios with AI-powered templates and suggestions.',
    icon: '📄'
  },
  {
    number: '03',
    title: 'Prepare for Interview',
    description: 'Practice with AI-powered interview simulations and receive detailed feedback on your performance.',
    icon: '🎯'
  },
  {
    number: '04',
    title: 'Track Your Progress',
    description: 'Monitor your scores, completed tasks, and receive personalized improvement recommendations.',
    icon: '📊'
  }
];

const HowItWorksSection: React.FC = () => {
  return (
    <section className="py-20 bg-white dark:bg-gray-800">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            How It <span className="text-primary-600">Works</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Follow our simple four-step process to transform your career journey 
            with AI-powered insights and personalized guidance.
          </p>
        </div>
        
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-primary-600 to-secondary-600 z-0"></div>
                )}
                
                <div className="relative z-10 text-center group">
                  {/* Number Circle */}
                  <div className="w-16 h-16 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white font-bold text-xl group-hover:scale-110 transition-transform">
                    {step.number}
                  </div>
                  
                  {/* Icon */}
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
                    {step.icon}
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    {step.title}
                  </h3>
                  
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          {/* CTA Button */}
          <div className="text-center mt-16">
            <Link to="/register" className="btn-primary">
              Start Your Journey Today
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;