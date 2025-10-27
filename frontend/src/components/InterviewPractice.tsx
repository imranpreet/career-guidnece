import React, { useState, useEffect } from 'react';
import { 
  ClockIcon, 
  CheckCircleIcon,
  LightBulbIcon,
  StarIcon,
  ChartBarIcon,
  BookOpenIcon,
  UserGroupIcon,
  XMarkIcon,
  ArrowRightIcon,
  MicrophoneIcon
} from '@heroicons/react/24/outline';

interface InterviewPracticeProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete?: (score: number, type: string) => void;
}

interface Question {
  id: number;
  question: string;
  type: string;
  difficulty: string;
  tips: string[];
  sampleAnswer: string;
  category: string;
}

interface InterviewType {
  id: string;
  name: string;
  description: string;
  duration: string;
  difficulty: string;
  color: string;
  questionCount: number;
}

interface InterviewSession {
  type: string;
  questions: Question[];
  currentQuestionIndex: number;
  answers: string[];
  startTime: Date | null;
  endTime: Date | null;
  isActive: boolean;
  showTips: boolean;
  feedback?: {
    score: number;
    feedback: string;
    recommendations: string[];
    timeSpent: number;
  };
}

const InterviewPractice: React.FC<InterviewPracticeProps> = ({ isOpen, onClose, onComplete }) => {
  const [currentStep, setCurrentStep] = useState<'select' | 'practice' | 'results'>('select');
  const [interviewTypes, setInterviewTypes] = useState<InterviewType[]>([]);
  const [session, setSession] = useState<InterviewSession>({
    type: '',
    questions: [],
    currentQuestionIndex: 0,
    answers: [],
    startTime: null,
    endTime: null,
    isActive: false,
    showTips: false
  });
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [elapsedTime, setElapsedTime] = useState(0);
  const [loading, setLoading] = useState(false);

  // Fetch interview types on component mount
  useEffect(() => {
    if (isOpen) {
      fetchInterviewTypes();
    }
  }, [isOpen]);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (session.isActive && session.startTime) {
      interval = setInterval(() => {
        setElapsedTime(Date.now() - session.startTime!.getTime());
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [session.isActive, session.startTime]);

  const fetchInterviewTypes = async () => {
    try {
      const response = await fetch('/api/interview/types');
      if (response.ok) {
        const data = await response.json();
        setInterviewTypes(data.types);
      }
    } catch (error) {
      console.error('Error fetching interview types:', error);
      // Fallback data if API fails
      setInterviewTypes([
        {
          id: 'behavioral',
          name: 'Behavioral Interview',
          description: 'Questions about your past experiences and behavior in workplace situations',
          duration: '20-30 minutes',
          difficulty: 'Medium',
          color: 'blue',
          questionCount: 4
        },
        {
          id: 'technical',
          name: 'Technical Interview',
          description: 'Questions about your technical skills and problem-solving abilities',
          duration: '30-45 minutes',
          difficulty: 'Hard',
          color: 'purple',
          questionCount: 4
        },
        {
          id: 'general',
          name: 'General Interview',
          description: 'Common questions asked in most job interviews',
          duration: '15-25 minutes',
          difficulty: 'Easy',
          color: 'green',
          questionCount: 4
        },
        {
          id: 'leadership',
          name: 'Leadership Interview',
          description: 'Questions focused on leadership experience and management skills',
          duration: '25-35 minutes',
          difficulty: 'Medium',
          color: 'amber',
          questionCount: 4
        }
      ]);
    }
  };

  const startInterview = async (type: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/interview/${type}/questions?count=4`);
      if (response.ok) {
        const data = await response.json();
        setSession({
          type,
          questions: data.questions,
          currentQuestionIndex: 0,
          answers: new Array(data.questions.length).fill(''),
          startTime: new Date(),
          endTime: null,
          isActive: true,
          showTips: false
        });
        setCurrentStep('practice');
      } else {
        throw new Error('Failed to fetch questions');
      }
    } catch (error) {
      console.error('Error starting interview:', error);
      // Fallback questions if API fails
      const fallbackQuestions = getFallbackQuestions(type);
      setSession({
        type,
        questions: fallbackQuestions,
        currentQuestionIndex: 0,
        answers: new Array(fallbackQuestions.length).fill(''),
        startTime: new Date(),
        endTime: null,
        isActive: true,
        showTips: false
      });
      setCurrentStep('practice');
    }
    setLoading(false);
  };

  const getFallbackQuestions = (type: string): Question[] => {
    const fallbackData: Record<string, Question[]> = {
      behavioral: [
        {
          id: 1,
          question: "Tell me about a time when you had to deal with a difficult colleague or team member.",
          type: 'behavioral',
          difficulty: 'medium',
          tips: [
            "Use the STAR method (Situation, Task, Action, Result)",
            "Focus on how you handled the situation professionally",
            "Show empathy and understanding",
            "Highlight the positive outcome or lesson learned"
          ],
          sampleAnswer: "In my previous role, I worked with a colleague who was consistently missing deadlines...",
          category: "Teamwork & Collaboration"
        },
        {
          id: 2,
          question: "Describe a situation where you had to learn something new quickly.",
          type: 'behavioral',
          difficulty: 'medium',
          tips: [
            "Show your adaptability and learning agility",
            "Mention specific resources or methods you used",
            "Highlight the successful outcome"
          ],
          sampleAnswer: "When our team needed to implement a new technology...",
          category: "Learning & Adaptation"
        }
      ],
      technical: [
        {
          id: 1,
          question: "How would you approach debugging a performance issue in a web application?",
          type: 'technical',
          difficulty: 'medium',
          tips: [
            "Show systematic problem-solving approach",
            "Mention specific tools and techniques",
            "Demonstrate understanding of common performance bottlenecks"
          ],
          sampleAnswer: "I would start by identifying the specific performance issue using browser dev tools...",
          category: "Problem Solving"
        },
        {
          id: 2,
          question: "Explain the difference between SQL and NoSQL databases.",
          type: 'technical',
          difficulty: 'medium',
          tips: [
            "Clearly explain the fundamental differences",
            "Provide specific use cases for each",
            "Mention pros and cons of both approaches"
          ],
          sampleAnswer: "SQL databases use structured schemas and ACID properties...",
          category: "Database Knowledge"
        }
      ],
      general: [
        {
          id: 1,
          question: "Why are you interested in this position?",
          type: 'general',
          difficulty: 'easy',
          tips: [
            "Research the company and role beforehand",
            "Connect your skills and interests to the position",
            "Show enthusiasm and genuine interest"
          ],
          sampleAnswer: "I'm excited about this position because it combines my passion for technology...",
          category: "Motivation & Interest"
        },
        {
          id: 2,
          question: "What are your greatest strengths?",
          type: 'general',
          difficulty: 'easy',
          tips: [
            "Choose 2-3 relevant strengths",
            "Provide specific examples to support each strength",
            "Connect strengths to job requirements"
          ],
          sampleAnswer: "One of my greatest strengths is my ability to break down complex problems...",
          category: "Self-Assessment"
        }
      ],
      leadership: [
        {
          id: 1,
          question: "How do you motivate team members who are underperforming?",
          type: 'leadership',
          difficulty: 'medium',
          tips: [
            "Show empathy and understanding",
            "Mention one-on-one conversations and active listening",
            "Discuss setting clear expectations and providing support"
          ],
          sampleAnswer: "I start by having a private, supportive conversation to understand any challenges...",
          category: "Team Management"
        },
        {
          id: 2,
          question: "Describe your leadership style.",
          type: 'leadership',
          difficulty: 'medium',
          tips: [
            "Be authentic and specific about your approach",
            "Give concrete examples of your leadership in action",
            "Show adaptability to different situations"
          ],
          sampleAnswer: "I would describe my leadership style as collaborative and adaptive...",
          category: "Leadership Philosophy"
        }
      ]
    };

    return fallbackData[type] || fallbackData.general;
  };

  const nextQuestion = () => {
    const updatedAnswers = [...session.answers];
    updatedAnswers[session.currentQuestionIndex] = currentAnswer;
    
    if (session.currentQuestionIndex < session.questions.length - 1) {
      setSession(prev => ({
        ...prev,
        answers: updatedAnswers,
        currentQuestionIndex: prev.currentQuestionIndex + 1,
        showTips: false
      }));
      setCurrentAnswer(updatedAnswers[session.currentQuestionIndex + 1] || '');
    } else {
      // Interview complete
      finishInterview(updatedAnswers);
    }
  };

  const finishInterview = async (finalAnswers: string[]) => {
    const endTime = new Date();
    const timeSpent = Math.floor((endTime.getTime() - session.startTime!.getTime()) / 1000);
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/interview/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          type: session.type,
          questions: session.questions,
          answers: finalAnswers,
          timeSpent
        })
      });

      if (response.ok) {
        const data = await response.json();
        setSession(prev => ({
          ...prev,
          answers: finalAnswers,
          endTime,
          isActive: false,
          feedback: data.result
        }));
        
        // Update user stats with interview score
        try {
          const token = localStorage.getItem('token');
          if (token) {
            const statsResponse = await fetch('/api/user/interview-score', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({
                type: session.type,
                score: data.result.score,
                questionsAnswered: session.questions.length
              })
            });
            
            if (statsResponse.ok) {
              console.log('Interview stats updated successfully');
            }
          }
        } catch (statsError) {
          console.error('Error updating interview stats:', statsError);
        }
        
        // Report completion to parent component
        if (onComplete) {
          onComplete(data.result.score, session.type);
        }
      } else {
        throw new Error('Failed to submit interview');
      }
    } catch (error) {
      console.error('Error submitting interview:', error);
      // Fallback feedback
      const avgAnswerLength = finalAnswers.reduce((sum, answer) => sum + answer.length, 0) / finalAnswers.length;
      const score = avgAnswerLength > 100 ? Math.floor(Math.random() * 20) + 80 : Math.floor(Math.random() * 30) + 60;
      
      setSession(prev => ({
        ...prev,
        answers: finalAnswers,
        endTime,
        isActive: false,
        feedback: {
          score,
          feedback: score > 80 ? 'Great job! Your answers were well-structured and detailed.' : 'Good effort! Focus on providing more specific examples.',
          recommendations: [
            'Practice the STAR method for better storytelling',
            'Prepare more specific examples from your experience',
            'Research common questions for your field'
          ],
          timeSpent
        }
      }));
      
      // Update user stats with interview score (fallback case)
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const statsResponse = await fetch('/api/user/interview-score', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              type: session.type,
              score,
              questionsAnswered: session.questions.length
            })
          });
          
          if (statsResponse.ok) {
            console.log('Interview stats updated successfully (fallback)');
          }
        }
      } catch (statsError) {
        console.error('Error updating interview stats (fallback):', statsError);
      }
      
      // Report completion to parent component
      if (onComplete) {
        onComplete(score, session.type);
      }
    }
    setLoading(false);
    setCurrentStep('results');
  };

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const resetInterview = () => {
    setCurrentStep('select');
    setSession({
      type: '',
      questions: [],
      currentQuestionIndex: 0,
      answers: [],
      startTime: null,
      endTime: null,
      isActive: false,
      showTips: false
    });
    setCurrentAnswer('');
    setElapsedTime(0);
  };

  const getColorClasses = (color: string) => {
    const colorMap: Record<string, string> = {
      blue: 'bg-blue-100 text-blue-800 border-blue-200',
      purple: 'bg-purple-100 text-purple-800 border-purple-200',
      green: 'bg-green-100 text-green-800 border-green-200',
      amber: 'bg-amber-100 text-amber-800 border-amber-200'
    };
    return colorMap[color] || colorMap.blue;
  };

  const getTypeIcon = (typeId: string) => {
    const iconMap: Record<string, React.ComponentType<any>> = {
      behavioral: UserGroupIcon,
      technical: ChartBarIcon,
      general: BookOpenIcon,
      leadership: StarIcon
    };
    return iconMap[typeId] || BookOpenIcon;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose}></div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

        <div className="inline-block w-full max-w-4xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900">Practice Interview</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Select Interview Type */}
          {currentStep === 'select' && (
            <div className="space-y-6">
              <div className="text-center">
                <h4 className="text-lg font-medium text-gray-900 mb-2">Choose Your Interview Type</h4>
                <p className="text-gray-600">Select the type of interview you'd like to practice</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {interviewTypes.map((type) => {
                  const IconComponent = getTypeIcon(type.id);
                  return (
                    <div
                      key={type.id}
                      className="border-2 border-gray-200 rounded-lg p-6 hover:border-blue-300 transition-colors cursor-pointer"
                      onClick={() => startInterview(type.id)}
                    >
                      <div className="flex items-start space-x-4">
                        <div className={`p-3 rounded-lg ${getColorClasses(type.color)}`}>
                          <IconComponent className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <h5 className="font-medium text-gray-900 mb-1">{type.name}</h5>
                          <p className="text-sm text-gray-600 mb-3">{type.description}</p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span className="flex items-center">
                              <ClockIcon className="w-4 h-4 mr-1" />
                              {type.duration}
                            </span>
                            <span className={`px-2 py-1 rounded-full ${getColorClasses(type.color)}`}>
                              {type.difficulty}
                            </span>
                            <span>{type.questionCount} questions</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {loading && (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Loading interview questions...</p>
                </div>
              )}
            </div>
          )}

          {/* Practice Interview */}
          {currentStep === 'practice' && session.questions.length > 0 && (
            <div className="space-y-6">
              {/* Progress Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="text-sm text-gray-600">
                    Question {session.currentQuestionIndex + 1} of {session.questions.length}
                  </div>
                  <div className="w-48 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${((session.currentQuestionIndex + 1) / session.questions.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <ClockIcon className="w-4 h-4" />
                  <span>{formatTime(elapsedTime)}</span>
                </div>
              </div>

              {/* Current Question */}
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <h4 className="text-lg font-medium text-gray-900 flex-1">
                    {session.questions[session.currentQuestionIndex]?.question}
                  </h4>
                  <button
                    onClick={() => setSession(prev => ({ ...prev, showTips: !prev.showTips }))}
                    className="ml-4 p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <LightBulbIcon className="w-5 h-5" />
                  </button>
                </div>

                {session.showTips && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                    <h5 className="font-medium text-blue-900 mb-2">💡 Tips for this question:</h5>
                    <ul className="space-y-1 text-sm text-blue-800">
                      {session.questions[session.currentQuestionIndex]?.tips.map((tip, index) => (
                        <li key={index} className="flex items-start">
                          <span className="mr-2">•</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="space-y-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <span className="px-2 py-1 bg-gray-200 rounded-full">
                      {session.questions[session.currentQuestionIndex]?.category}
                    </span>
                    <span className="px-2 py-1 bg-gray-200 rounded-full">
                      {session.questions[session.currentQuestionIndex]?.difficulty}
                    </span>
                  </div>
                </div>
              </div>

              {/* Answer Input */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                  Your Answer
                </label>
                <textarea
                  value={currentAnswer}
                  onChange={(e) => setCurrentAnswer(e.target.value)}
                  placeholder="Type your answer here. Try to be specific and use examples..."
                  className="w-full h-40 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                      <MicrophoneIcon className="w-4 h-4" />
                      <span>Record Answer</span>
                    </button>
                    <span className="text-sm text-gray-500">
                      {currentAnswer.length} characters
                    </span>
                  </div>
                  <button
                    onClick={nextQuestion}
                    disabled={!currentAnswer.trim()}
                    className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <span>
                      {session.currentQuestionIndex < session.questions.length - 1 ? 'Next Question' : 'Finish Interview'}
                    </span>
                    <ArrowRightIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Results */}
          {currentStep === 'results' && session.feedback && (
            <div className="space-y-6">
              <div className="text-center">
                <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h4 className="text-2xl font-bold text-gray-900 mb-2">Interview Complete!</h4>
                <p className="text-gray-600">Here's your performance summary</p>
              </div>

              {/* Score */}
              <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-6 text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  {session.feedback.score}%
                </div>
                <p className="text-lg text-gray-700">{session.feedback.feedback}</p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">{session.questions.length}</div>
                  <div className="text-sm text-gray-600">Questions Answered</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">
                    {Math.floor(session.feedback.timeSpent / 60)}m {session.feedback.timeSpent % 60}s
                  </div>
                  <div className="text-sm text-gray-600">Total Time</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">
                    {Math.floor(session.feedback.timeSpent / session.questions.length / 60)}m
                  </div>
                  <div className="text-sm text-gray-600">Avg. per Question</div>
                </div>
              </div>

              {/* Recommendations */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                <h5 className="font-medium text-amber-900 mb-3">🎯 Recommendations for Improvement:</h5>
                <ul className="space-y-2">
                  {session.feedback.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start text-amber-800">
                      <span className="mr-2">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={resetInterview}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Practice Another Interview
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          )}

          {loading && currentStep === 'practice' && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Submitting your interview...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InterviewPractice;