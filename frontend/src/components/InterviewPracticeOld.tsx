import React, { useState } from 'react';
import {
  XMarkIcon,
  MicrophoneIcon,
  PauseIcon,
  PlayIcon,
  ArrowRightIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  LightBulbIcon,
  ChatBubbleLeftEllipsisIcon
} from '@heroicons/react/24/outline';

interface InterviewPracticeProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Question {
  id: number;
  question: string;
  type: 'behavioral' | 'technical' | 'situational' | 'general';
  difficulty: 'easy' | 'medium' | 'hard';
  tips: string[];
  sampleAnswer?: string;
  category: string;
}

interface InterviewSession {
  questions: Question[];
  currentIndex: number;
  answers: string[];
  startTime: Date;
  isRecording: boolean;
}

const InterviewPractice: React.FC<InterviewPracticeProps> = ({ isOpen, onClose }) => {
  const [currentView, setCurrentView] = useState<'select' | 'practice' | 'feedback'>('select');
  const [selectedType, setSelectedType] = useState<string>('');
  const [session, setSession] = useState<InterviewSession | null>(null);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [timeSpent, setTimeSpent] = useState(0);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

  const interviewTypes = [
    {
      id: 'behavioral',
      name: 'Behavioral Interview',
      description: 'Questions about your past experiences and behavior in workplace situations',
      duration: '20-30 minutes',
      difficulty: 'Medium',
      color: 'blue'
    },
    {
      id: 'technical',
      name: 'Technical Interview',
      description: 'Questions about your technical skills and problem-solving abilities',
      duration: '30-45 minutes',
      difficulty: 'Hard',
      color: 'purple'
    },
    {
      id: 'general',
      name: 'General Interview',
      description: 'Common questions asked in most job interviews',
      duration: '15-25 minutes',
      difficulty: 'Easy',
      color: 'green'
    },
    {
      id: 'leadership',
      name: 'Leadership Interview',
      description: 'Questions focused on leadership experience and management skills',
      duration: '25-35 minutes',
      difficulty: 'Medium',
      color: 'amber'
    }
  ];

  const questionDatabase = {
    behavioral: [
      {
        id: 1,
        question: "Tell me about a time when you had to deal with a difficult colleague or team member.",
        type: 'behavioral' as const,
        difficulty: 'medium' as const,
        tips: [
          "Use the STAR method (Situation, Task, Action, Result)",
          "Focus on how you handled the situation professionally",
          "Show empathy and understanding",
          "Highlight the positive outcome or lesson learned"
        ],
        sampleAnswer: "In my previous role, I worked with a colleague who was consistently missing deadlines... [Situation] My task was to ensure our project stayed on track... [Task] I scheduled a private conversation to understand their challenges... [Action] As a result, we improved communication and delivered the project successfully... [Result]",
        category: "Teamwork & Collaboration"
      },
      {
        id: 2,
        question: "Describe a situation where you had to learn something new quickly to complete a project.",
        type: 'behavioral' as const,
        difficulty: 'medium' as const,
        tips: [
          "Show your adaptability and learning agility",
          "Mention specific resources or methods you used to learn",
          "Highlight the successful outcome",
          "Demonstrate initiative and problem-solving"
        ],
        sampleAnswer: "When our team needed to implement a new technology I wasn't familiar with... [Situation] I needed to become proficient enough to contribute meaningfully... [Task] I dedicated evenings to online courses and reached out to experts... [Action] I successfully implemented the feature and even trained other team members... [Result]",
        category: "Learning & Adaptation"
      },
      {
        id: 3,
        question: "Tell me about a time when you disagreed with your manager's decision. How did you handle it?",
        type: 'behavioral' as const,
        difficulty: 'hard' as const,
        tips: [
          "Show respect for authority while demonstrating independent thinking",
          "Focus on the professional approach you took",
          "Highlight how you presented alternative solutions",
          "Show the positive outcome of the conversation"
        ],
        sampleAnswer: "There was a situation where my manager wanted to rush a product release... [Situation] I felt this could impact quality and customer satisfaction... [Task] I prepared a detailed analysis with data and presented alternative timelines... [Action] My manager appreciated the thoroughness and we adjusted the timeline, resulting in a more successful launch... [Result]",
        category: "Communication & Leadership"
      }
    ],
    technical: [
      {
        id: 1,
        question: "How would you approach debugging a performance issue in a web application?",
        type: 'technical' as const,
        difficulty: 'medium' as const,
        tips: [
          "Show systematic problem-solving approach",
          "Mention specific tools and techniques",
          "Demonstrate understanding of common performance bottlenecks",
          "Show how you would measure and validate improvements"
        ],
        sampleAnswer: "I would start by identifying the specific performance issue using browser dev tools and monitoring... Then isolate the problem by checking network requests, JavaScript execution, and rendering... Use profiling tools to pinpoint bottlenecks... Implement fixes incrementally and measure improvements...",
        category: "Problem Solving"
      },
      {
        id: 2,
        question: "Explain the difference between SQL and NoSQL databases. When would you use each?",
        type: 'technical' as const,
        difficulty: 'medium' as const,
        tips: [
          "Clearly explain the fundamental differences",
          "Provide specific use cases for each",
          "Mention pros and cons of both approaches",
          "Show understanding of scalability considerations"
        ],
        sampleAnswer: "SQL databases use structured schemas and ACID properties, ideal for complex relationships and transactions... NoSQL databases offer flexibility and horizontal scaling, better for large-scale applications with varying data structures... Use SQL for financial systems, NoSQL for social media or IoT applications...",
        category: "Database Knowledge"
      },
      {
        id: 3,
        question: "How would you design a system to handle millions of users?",
        type: 'technical' as const,
        difficulty: 'hard' as const,
        tips: [
          "Start with high-level architecture",
          "Discuss scalability patterns (horizontal vs vertical scaling)",
          "Mention caching, load balancing, and database strategies",
          "Address monitoring and reliability concerns"
        ],
        sampleAnswer: "I would start with a microservices architecture behind a load balancer... Implement horizontal scaling with auto-scaling groups... Use caching layers like Redis for frequently accessed data... Implement database sharding or replication... Add monitoring and alerting systems...",
        category: "System Design"
      }
    ],
    general: [
      {
        id: 1,
        question: "Why are you interested in this position?",
        type: 'general' as const,
        difficulty: 'easy' as const,
        tips: [
          "Research the company and role beforehand",
          "Connect your skills and interests to the position",
          "Show enthusiasm and genuine interest",
          "Mention specific aspects that excite you"
        ],
        sampleAnswer: "I'm excited about this position because it combines my passion for technology with the opportunity to make a meaningful impact... Your company's focus on innovation and customer-centric solutions aligns perfectly with my values... The role offers growth opportunities in areas I'm eager to develop...",
        category: "Motivation & Interest"
      },
      {
        id: 2,
        question: "What are your greatest strengths?",
        type: 'general' as const,
        difficulty: 'easy' as const,
        tips: [
          "Choose 2-3 relevant strengths",
          "Provide specific examples to support each strength",
          "Connect strengths to job requirements",
          "Avoid generic or cliché answers"
        ],
        sampleAnswer: "One of my greatest strengths is my ability to break down complex problems into manageable components... For example, in my last project... Another strength is my communication skills, which help me collaborate effectively with both technical and non-technical team members...",
        category: "Self-Assessment"
      },
      {
        id: 3,
        question: "Where do you see yourself in 5 years?",
        type: 'general' as const,
        difficulty: 'medium' as const,
        tips: [
          "Show ambition but be realistic",
          "Align your goals with potential career paths at the company",
          "Focus on skills and impact rather than just titles",
          "Demonstrate long-term thinking"
        ],
        sampleAnswer: "In 5 years, I see myself having grown significantly in my technical expertise and taking on more leadership responsibilities... I'd love to be mentoring junior developers and contributing to architectural decisions... I'm interested in eventually leading a team while staying hands-on with technology...",
        category: "Career Goals"
      }
    ],
    leadership: [
      {
        id: 1,
        question: "How do you motivate team members who are underperforming?",
        type: 'behavioral' as const,
        difficulty: 'medium' as const,
        tips: [
          "Show empathy and understanding",
          "Mention one-on-one conversations and active listening",
          "Discuss setting clear expectations and providing support",
          "Highlight coaching and development approach"
        ],
        sampleAnswer: "I start by having a private, supportive conversation to understand any challenges they're facing... I work with them to set clear, achievable goals and provide the resources they need... I offer regular check-ins and celebrate small wins to build confidence... The goal is to identify and remove obstacles while maintaining accountability...",
        category: "Team Management"
      },
      {
        id: 2,
        question: "Describe your leadership style.",
        type: 'general' as const,
        difficulty: 'medium' as const,
        tips: [
          "Be authentic and specific about your approach",
          "Give concrete examples of your leadership in action",
          "Show adaptability to different situations and people",
          "Mention how you develop others"
        ],
        sampleAnswer: "I would describe my leadership style as collaborative and adaptive... I believe in empowering team members by providing clear vision and goals, then giving them autonomy to achieve them... I adjust my approach based on individual needs - some people need more guidance, others thrive with independence... I focus on developing people's strengths and helping them grow...",
        category: "Leadership Philosophy"
      },
      {
        id: 3,
        question: "How do you handle conflicts within your team?",
        type: 'behavioral' as const,
        difficulty: 'hard' as const,
        tips: [
          "Show your conflict resolution process",
          "Emphasize listening to all parties involved",
          "Mention focusing on facts and solutions, not blame",
          "Highlight preventing future conflicts"
        ],
        sampleAnswer: "When conflicts arise, I address them quickly before they escalate... I meet with each party individually to understand their perspectives... Then I bring everyone together to focus on finding a solution that works for the team and project... I follow up to ensure the resolution is sustainable and look for ways to prevent similar conflicts...",
        category: "Conflict Resolution"
      }
    ]
  };

  const startInterview = (type: string) => {
    const questions = questionDatabase[type as keyof typeof questionDatabase] || [];
    const shuffledQuestions = [...questions].sort(() => Math.random() - 0.5).slice(0, 5);
    
    const newSession: InterviewSession = {
      questions: shuffledQuestions,
      currentIndex: 0,
      answers: [],
      startTime: new Date(),
      isRecording: false
    };

    setSession(newSession);
    setSelectedType(type);
    setCurrentView('practice');
    setTimeSpent(0);
    
    // Start timer
    const intervalId = setInterval(() => {
      setTimeSpent(prev => prev + 1);
    }, 1000);
    setTimer(intervalId);
  };

  const toggleRecording = () => {
    if (session) {
      setSession({ ...session, isRecording: !session.isRecording });
    }
  };

  const submitAnswer = () => {
    if (session && currentAnswer.trim()) {
      const newAnswers = [...session.answers, currentAnswer];
      setSession({ ...session, answers: newAnswers });
      setCurrentAnswer('');
      
      if (session.currentIndex < session.questions.length - 1) {
        setSession({ ...session, currentIndex: session.currentIndex + 1 });
      } else {
        finishInterview(newAnswers);
      }
    }
  };

  const finishInterview = (answers: string[]) => {
    if (timer) {
      clearInterval(timer);
      setTimer(null);
    }
    setCurrentView('feedback');
  };

  const resetInterview = () => {
    setCurrentView('select');
    setSession(null);
    setCurrentAnswer('');
    setTimeSpent(0);
    setSelectedType('');
    if (timer) {
      clearInterval(timer);
      setTimer(null);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTypeColor = (color: string) => {
    const colors = {
      blue: 'from-blue-500 to-blue-600',
      purple: 'from-purple-500 to-purple-600',
      green: 'from-green-500 to-green-600',
      amber: 'from-amber-500 to-amber-600'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-4xl h-[600px] max-h-[90vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-4 rounded-t-2xl flex justify-between items-center">
          <div className="flex items-center">
            <ChatBubbleLeftEllipsisIcon className="w-6 h-6 mr-2" />
            <h3 className="text-lg font-bold">
              {currentView === 'select' && 'Interview Practice'}
              {currentView === 'practice' && `${selectedType.charAt(0).toUpperCase() + selectedType.slice(1)} Interview`}
              {currentView === 'feedback' && 'Interview Feedback'}
            </h3>
          </div>
          <div className="flex items-center space-x-4">
            {currentView === 'practice' && (
              <div className="flex items-center text-sm bg-white/20 px-3 py-1 rounded-lg">
                <ClockIcon className="w-4 h-4 mr-1" />
                {formatTime(timeSpent)}
              </div>
            )}
            <button onClick={onClose} className="text-white hover:text-gray-300 transition-colors">
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Interview Type Selection */}
          {currentView === 'select' && (
            <div className="p-6">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Choose Your Interview Type
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Practice with realistic questions and get personalized feedback to improve your interview skills.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {interviewTypes.map((type) => (
                  <div
                    key={type.id}
                    onClick={() => startInterview(type.id)}
                    className="group cursor-pointer bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:border-indigo-300 dark:hover:border-indigo-500"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {type.name}
                      </h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        type.difficulty === 'Easy' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                        type.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                        'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {type.difficulty}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm leading-relaxed">
                      {type.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-500">
                        <ClockIcon className="w-4 h-4 mr-1" />
                        {type.duration}
                      </div>
                      <button className={`bg-gradient-to-r ${getTypeColor(type.color)} text-white px-4 py-2 rounded-lg hover:shadow-md transition-all duration-300 text-sm font-medium`}>
                        Start Practice →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Interview Practice */}
          {currentView === 'practice' && session && (
            <div className="p-6">
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Question {session.currentIndex + 1} of {session.questions.length}
                  </span>
                  <div className="w-48 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${((session.currentIndex + 1) / session.questions.length) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {session.questions[session.currentIndex].question}
                  </h3>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <span className={`px-2 py-1 rounded-full text-xs mr-3 ${
                      session.questions[session.currentIndex].type === 'behavioral' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                      session.questions[session.currentIndex].type === 'technical' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
                      'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    }`}>
                      {session.questions[session.currentIndex].type}
                    </span>
                    <span>Category: {session.questions[session.currentIndex].category}</span>
                  </div>
                </div>

                {/* Tips Section */}
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-6">
                  <h4 className="flex items-center text-amber-800 dark:text-amber-200 font-semibold mb-2">
                    <LightBulbIcon className="w-4 h-4 mr-1" />
                    Tips for answering:
                  </h4>
                  <ul className="space-y-1">
                    {session.questions[session.currentIndex].tips.map((tip, index) => (
                      <li key={index} className="text-amber-700 dark:text-amber-300 text-sm flex items-start">
                        <span className="mr-2">•</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Answer Input */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Your Answer:
                  </label>
                  <button
                    onClick={toggleRecording}
                    className={`flex items-center px-3 py-1 rounded-lg text-sm transition-colors ${
                      session.isRecording
                        ? 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300'
                        : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                    }`}
                  >
                    {session.isRecording ? (
                      <>
                        <PauseIcon className="w-4 h-4 mr-1" />
                        Recording...
                      </>
                    ) : (
                      <>
                        <MicrophoneIcon className="w-4 h-4 mr-1" />
                        Start Recording
                      </>
                    )}
                  </button>
                </div>
                
                <textarea
                  value={currentAnswer}
                  onChange={(e) => setCurrentAnswer(e.target.value)}
                  placeholder="Type your answer here... Use the STAR method for behavioral questions (Situation, Task, Action, Result)."
                  className="w-full h-32 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white resize-none"
                />
                
                <div className="flex justify-between items-center mt-3">
                  <span className="text-sm text-gray-500">
                    {currentAnswer.length} characters
                  </span>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => setCurrentView('select')}
                      className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                    >
                      Back to Types
                    </button>
                    <button
                      onClick={submitAnswer}
                      disabled={!currentAnswer.trim()}
                      className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {session.currentIndex === session.questions.length - 1 ? 'Finish Interview' : 'Next Question'} →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Feedback */}
          {currentView === 'feedback' && session && (
            <div className="p-6">
              <div className="text-center mb-6">
                <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Interview Complete!
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  You completed {session.questions.length} questions in {formatTime(timeSpent)}
                </p>
              </div>

              {/* Performance Summary */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Performance Summary
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-indigo-600">
                      {session.questions.length}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Questions Answered</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {formatTime(timeSpent)}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Total Time</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {Math.round(timeSpent / session.questions.length / 60 * 10) / 10}m
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Avg per Question</div>
                  </div>
                </div>
              </div>

              {/* General Feedback */}
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
                <h4 className="text-blue-800 dark:text-blue-200 font-semibold mb-2">
                  General Feedback:
                </h4>
                <p className="text-blue-700 dark:text-blue-300 text-sm">
                  Great job completing the {selectedType} interview! Here are some general tips for improvement:
                </p>
                <ul className="mt-3 space-y-1 text-blue-700 dark:text-blue-300 text-sm">
                  <li>• Practice the STAR method for behavioral questions</li>
                  <li>• Research the company and role thoroughly before interviews</li>
                  <li>• Prepare specific examples that demonstrate your skills</li>
                  <li>• Practice speaking your answers out loud to improve fluency</li>
                  <li>• Ask thoughtful questions about the role and company</li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center space-x-4">
                <button
                  onClick={resetInterview}
                  className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Practice Again
                </button>
                <button
                  onClick={onClose}
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InterviewPractice;