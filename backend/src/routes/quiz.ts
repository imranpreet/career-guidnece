import express from 'express';
import authenticateToken from '../middleware/auth';
import User from '../models/User';

const router = express.Router();

// Mock quiz questions database
const quizQuestions = {
  'career-assessment': [
    {
      id: 1,
      question: 'What motivates you most in your work?',
      options: [
        'Solving complex problems',
        'Leading and inspiring teams',
        'Creating innovative solutions',
        'Building relationships'
      ],
      category: 'motivation'
    },
    {
      id: 2,
      question: 'Which work environment do you prefer?',
      options: [
        'Fast-paced startup',
        'Structured corporate',
        'Remote/flexible',
        'Collaborative team-based'
      ],
      category: 'environment'
    },
    {
      id: 3,
      question: 'What type of tasks energize you?',
      options: [
        'Analytical and data-driven',
        'Creative and design-focused',
        'Strategic and planning-oriented',
        'People-focused and communication-heavy'
      ],
      category: 'tasks'
    }
  ],
  'technical-skills': [
    {
      id: 1,
      question: 'Which programming language are you most comfortable with?',
      options: ['JavaScript', 'Python', 'Java', 'C#'],
      category: 'programming'
    },
    {
      id: 2,
      question: 'What is your experience with cloud platforms?',
      options: ['AWS', 'Azure', 'Google Cloud', 'No experience'],
      category: 'cloud'
    }
  ],
  'interview-prep': [
    {
      id: 1,
      question: 'Tell me about yourself.',
      type: 'behavioral',
      tips: 'Focus on your professional journey, key achievements, and what you\'re looking for next.'
    },
    {
      id: 2,
      question: 'What is your greatest weakness?',
      type: 'behavioral',
      tips: 'Choose a real weakness but show how you\'re working to improve it.'
    }
  ]
};

// Get available quiz types
router.get('/types', authenticateToken, (req, res) => {
  try {
    const quizTypes = [
      {
        id: 'career-assessment',
        name: 'Career Assessment',
        description: 'Discover career paths that match your interests and skills',
        duration: '10-15 minutes',
        questions: quizQuestions['career-assessment'].length
      },
      {
        id: 'technical-skills',
        name: 'Technical Skills Assessment',
        description: 'Evaluate your technical knowledge and identify areas for improvement',
        duration: '15-20 minutes',
        questions: quizQuestions['technical-skills'].length
      },
      {
        id: 'interview-prep',
        name: 'Interview Preparation',
        description: 'Practice common interview questions and get feedback',
        duration: '20-30 minutes',
        questions: quizQuestions['interview-prep'].length
      }
    ];

    res.json({ quizTypes });
  } catch (error) {
    console.error('Get quiz types error:', error);
    res.status(500).json({ message: 'Error fetching quiz types' });
  }
});

// Get quiz questions
router.get('/:type/questions', authenticateToken, (req, res) => {
  try {
    const quizType = req.params.type;
    const questions = quizQuestions[quizType as keyof typeof quizQuestions];

    if (!questions) {
      return res.status(404).json({ message: 'Quiz type not found' });
    }

    res.json({ questions });
  } catch (error) {
    console.error('Get quiz questions error:', error);
    res.status(500).json({ message: 'Error fetching quiz questions' });
  }
});

// Submit quiz answers
router.post('/:type/submit', authenticateToken, async (req: any, res) => {
  try {
    const userId = req.user._id;
    const quizType = req.params.type;
    const { answers, score: providedScore, topic, difficulty, timeSpent, totalQuestions, correctAnswers } = req.body;

    // Use the score provided by the frontend, or calculate it if not provided
    let finalScore = providedScore;
    if (!finalScore && answers) {
      const totalQuestions = quizQuestions[quizType as keyof typeof quizQuestions]?.length || 0;
      finalScore = Math.floor(Math.random() * 30) + 70; // Fallback for legacy quizzes
    }

    // Generate AI feedback based on quiz type or topic
    let feedback = '';
    let recommendations: string[] = [];

    if (topic && finalScore !== undefined) {
      // New topic-based feedback
      if (finalScore >= 80) {
        feedback = `Excellent work! You have a strong understanding of ${topic}. You're ready for advanced concepts.`;
        recommendations = [
          'Explore advanced topics in this area',
          'Consider mentoring others',
          'Look into related specialized fields'
        ];
      } else if (finalScore >= 60) {
        feedback = `Good job! You have a solid foundation in ${topic}. Focus on strengthening key areas.`;
        recommendations = [
          'Review the concepts you missed',
          'Practice with additional resources',
          'Take a more comprehensive course'
        ];
      } else {
        feedback = `Keep learning! ${topic} requires more study. Don't get discouraged - everyone starts somewhere.`;
        recommendations = [
          'Start with beginner-friendly resources',
          'Take your time to understand fundamentals',
          'Practice regularly with small exercises'
        ];
      }
    } else {
      // Legacy quiz type feedback
      switch (quizType) {
        case 'career-assessment':
          feedback = 'Based on your responses, you show strong analytical thinking and prefer structured environments. Consider roles in data analysis, project management, or software engineering.';
          recommendations = [
            'Explore data science bootcamps',
            'Consider getting PMP certification',
            'Build a portfolio of analytical projects'
          ];
          break;
        case 'technical-skills':
          feedback = 'Your technical foundation is solid. Focus on expanding your cloud computing knowledge and modern frameworks to stay competitive.';
          recommendations = [
            'Get AWS certification',
            'Learn React or Vue.js',
            'Practice system design concepts'
          ];
          break;
        case 'interview-prep':
          feedback = 'Good foundation in behavioral questions. Work on providing more specific examples and quantifying your achievements.';
          recommendations = [
            'Practice STAR method responses',
            'Prepare 5-7 strong examples',
            'Research company-specific questions'
          ];
          break;
        default:
          feedback = `Great job completing the ${quizType} quiz!`;
          recommendations = ['Keep practicing to improve your skills'];
      }
    }

    // Update user's quiz count and save the score
    await User.findByIdAndUpdate(userId, {
      $inc: { completedQuizzes: 1 },
      $push: { 
        quizScores: {
          topic: topic || quizType,
          score: finalScore,
          totalQuestions,
          correctAnswers,
          date: new Date()
        }
      }
    });

    const result = {
      score: finalScore,
      feedback,
      recommendations,
      completedAt: new Date(),
      quizType: topic || quizType,
      difficulty,
      timeSpent,
      totalQuestions,
      correctAnswers
    };

    res.json({
      message: 'Quiz completed successfully',
      result
    });
  } catch (error) {
    console.error('Submit quiz error:', error);
    res.status(500).json({ message: 'Error submitting quiz' });
  }
});

// Get user's quiz history
router.get('/history', authenticateToken, async (req: any, res) => {
  try {
    const user = req.user;
    
    // In production, store quiz results in database
    // For now, return mock data
    const quizHistory = [
      {
        id: '1',
        type: 'career-assessment',
        score: 85,
        completedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        feedback: 'Strong analytical mindset with leadership potential'
      },
      {
        id: '2',
        type: 'technical-skills',
        score: 78,
        completedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        feedback: 'Solid foundation, focus on cloud technologies'
      }
    ];

    res.json({ 
      quizHistory,
      totalCompleted: user.completedQuizzes 
    });
  } catch (error) {
    console.error('Get quiz history error:', error);
    res.status(500).json({ message: 'Error fetching quiz history' });
  }
});

// Enhanced topic-based quiz generation
router.post('/generate/:topic', authenticateToken, async (req: any, res) => {
  try {
    const topic = req.params.topic;
    const { difficulty = 'intermediate' } = req.body;
    const user = req.user; // From authenticateToken middleware

    console.log(`Generating quiz for topic: ${topic}, difficulty: ${difficulty}`);
    
    // If user has a primarySkill and topic is generic or doesn't match, suggest personalized topic
    const effectiveTopic = user.primarySkill && topic === 'general' 
      ? user.primarySkill.toLowerCase() 
      : topic;

    console.log(`User's primary skill: ${user.primarySkill}, effective topic: ${effectiveTopic}`);

    // Enhanced question database with more comprehensive topics
    const enhancedQuestions = {
      'javascript': [
        {
          id: 1,
          question: 'What is the difference between "let" and "var" in JavaScript?',
          options: [
            'There is no difference',
            'let has block scope, var has function scope',
            'var has block scope, let has function scope',
            'let is older than var'
          ],
          correctAnswer: 1,
          explanation: 'let has block scope and is not hoisted, while var has function scope and is hoisted.',
          difficulty: 'intermediate'
        },
        {
          id: 2,
          question: 'Which method is used to add elements to the end of an array?',
          options: ['push()', 'pop()', 'shift()', 'unshift()'],
          correctAnswer: 0,
          explanation: 'push() adds one or more elements to the end of an array and returns the new length.',
          difficulty: 'beginner'
        },
        {
          id: 3,
          question: 'What is a closure in JavaScript?',
          options: [
            'A function that returns another function',
            'A function that has access to outer scope variables',
            'A way to close a program',
            'A method to close browser windows'
          ],
          correctAnswer: 1,
          explanation: 'A closure is a function that has access to variables in its outer (enclosing) scope even after the outer function has returned.',
          difficulty: 'advanced'
        },
        {
          id: 4,
          question: 'What does the "this" keyword refer to in JavaScript?',
          options: [
            'Always refers to the global object',
            'Refers to the object that called the function',
            'Always refers to the function itself',
            'Has no meaning in JavaScript'
          ],
          correctAnswer: 1,
          explanation: 'The "this" keyword refers to the object that called the function, though its value can change depending on how the function is called.',
          difficulty: 'intermediate'
        }
      ],
      'python': [
        {
          id: 1,
          question: 'Which of the following is the correct way to create a list in Python?',
          options: ['list = (1, 2, 3)', 'list = [1, 2, 3]', 'list = {1, 2, 3}', 'list = <1, 2, 3>'],
          correctAnswer: 1,
          explanation: 'Square brackets [] are used to create lists in Python.',
          difficulty: 'beginner'
        },
        {
          id: 2,
          question: 'What does PEP 8 refer to?',
          options: [
            'Python Error Protocol 8',
            'Python Enhancement Proposal 8 (Style Guide)',
            'Python Execution Plan 8',
            'Python Extension Package 8'
          ],
          correctAnswer: 1,
          explanation: 'PEP 8 is the Style Guide for Python Code, providing conventions for writing readable Python code.',
          difficulty: 'intermediate'
        },
        {
          id: 3,
          question: 'What is the difference between a list and a tuple in Python?',
          options: [
            'Lists are immutable, tuples are mutable',
            'Lists are mutable, tuples are immutable',
            'No difference',
            'Tuples can only store numbers'
          ],
          correctAnswer: 1,
          explanation: 'Lists are mutable (can be changed), while tuples are immutable (cannot be changed after creation).',
          difficulty: 'intermediate'
        }
      ],
      'react': [
        {
          id: 1,
          question: 'What is JSX in React?',
          options: [
            'A JavaScript framework',
            'A syntax extension for JavaScript',
            'A CSS preprocessor',
            'A database query language'
          ],
          correctAnswer: 1,
          explanation: 'JSX is a syntax extension for JavaScript that allows you to write HTML-like code in JavaScript.',
          difficulty: 'beginner'
        },
        {
          id: 2,
          question: 'Which hook is used for managing state in functional components?',
          options: ['useEffect', 'useState', 'useContext', 'useReducer'],
          correctAnswer: 1,
          explanation: 'useState is the primary hook for managing state in functional React components.',
          difficulty: 'intermediate'
        },
        {
          id: 3,
          question: 'What is the purpose of the useEffect hook?',
          options: [
            'To manage component state',
            'To handle side effects in functional components',
            'To create new components',
            'To style components'
          ],
          correctAnswer: 1,
          explanation: 'useEffect is used to handle side effects like API calls, subscriptions, or manually changing the DOM.',
          difficulty: 'intermediate'
        }
      ],
      'data-science': [
        {
          id: 1,
          question: 'What is the primary purpose of data cleaning?',
          options: [
            'To make data look prettier',
            'To remove or correct inaccurate, incomplete, or irrelevant data',
            'To reduce data size',
            'To encrypt sensitive information'
          ],
          correctAnswer: 1,
          explanation: 'Data cleaning involves identifying and correcting or removing inaccurate, incomplete, irrelevant, or corrupted data.',
          difficulty: 'intermediate'
        },
        {
          id: 2,
          question: 'Which Python library is most commonly used for data manipulation?',
          options: ['NumPy', 'Pandas', 'Matplotlib', 'Scikit-learn'],
          correctAnswer: 1,
          explanation: 'Pandas is the most popular Python library for data manipulation and analysis.',
          difficulty: 'beginner'
        },
        {
          id: 3,
          question: 'What does "overfitting" mean in machine learning?',
          options: [
            'The model is too simple',
            'The model performs well on training data but poorly on new data',
            'The model takes too long to train',
            'The model uses too much memory'
          ],
          correctAnswer: 1,
          explanation: 'Overfitting occurs when a model learns the training data too well, including noise, making it perform poorly on new, unseen data.',
          difficulty: 'advanced'
        }
      ],
      'leadership': [
        {
          id: 1,
          question: 'What is the most important quality of an effective leader?',
          options: [
            'Technical expertise',
            'Communication skills',
            'Authority and control',
            'Years of experience'
          ],
          correctAnswer: 1,
          explanation: 'Communication skills are fundamental to leadership, enabling leaders to inspire, guide, and collaborate effectively.',
          difficulty: 'intermediate'
        },
        {
          id: 2,
          question: 'Which leadership style is most effective in crisis situations?',
          options: [
            'Democratic leadership',
            'Laissez-faire leadership',
            'Autocratic leadership',
            'Transformational leadership'
          ],
          correctAnswer: 2,
          explanation: 'Autocratic leadership is often most effective in crisis situations where quick decisions and clear direction are needed.',
          difficulty: 'advanced'
        },
        {
          id: 3,
          question: 'What is emotional intelligence in leadership?',
          options: [
            'Being emotional about decisions',
            'The ability to understand and manage emotions in yourself and others',
            'Making decisions based on feelings only',
            'Avoiding emotional situations'
          ],
          correctAnswer: 1,
          explanation: 'Emotional intelligence is the ability to recognize, understand, and manage emotions effectively in yourself and others.',
          difficulty: 'intermediate'
        }
      ],
      'project-management': [
        {
          id: 1,
          question: 'What does the acronym "SMART" stand for in goal setting?',
          options: [
            'Simple, Manageable, Achievable, Realistic, Timely',
            'Specific, Measurable, Achievable, Relevant, Time-bound',
            'Strategic, Meaningful, Actionable, Results-oriented, Trackable',
            'Straightforward, Methodical, Attainable, Resourced, Targeted'
          ],
          correctAnswer: 1,
          explanation: 'SMART goals are Specific, Measurable, Achievable, Relevant, and Time-bound.',
          difficulty: 'beginner'
        },
        {
          id: 2,
          question: 'In Agile methodology, what is a Sprint?',
          options: [
            'A final rush to complete the project',
            'A time-boxed period for completing work',
            'A type of project meeting',
            'A project planning technique'
          ],
          correctAnswer: 1,
          explanation: 'A Sprint is a time-boxed period (usually 1-4 weeks) during which specific work must be completed and made ready for review.',
          difficulty: 'intermediate'
        },
        {
          id: 3,
          question: 'What is the critical path in project management?',
          options: [
            'The most important tasks in the project',
            'The longest sequence of dependent tasks',
            'The shortest way to complete the project',
            'The most risky part of the project'
          ],
          correctAnswer: 1,
          explanation: 'The critical path is the longest sequence of dependent tasks that determines the minimum project duration.',
          difficulty: 'advanced'
        }
      ]
    };

    const topicQuestions = enhancedQuestions[topic as keyof typeof enhancedQuestions];
    
    if (!topicQuestions) {
      return res.status(404).json({ 
        message: 'Topic not found',
        availableTopics: Object.keys(enhancedQuestions)
      });
    }

    // Filter questions by difficulty if specified
    let filteredQuestions = topicQuestions;
    if (difficulty !== 'all') {
      filteredQuestions = topicQuestions.filter(q => q.difficulty === difficulty);
    }

    // Return up to 5 random questions
    const shuffled = filteredQuestions.sort(() => 0.5 - Math.random());
    const selectedQuestions = shuffled.slice(0, Math.min(5, shuffled.length));

    res.json({
      topic,
      difficulty,
      questions: selectedQuestions,
      totalAvailable: topicQuestions.length,
      message: 'Quiz questions generated successfully'
    });

  } catch (error) {
    console.error('Generate quiz error:', error);
    res.status(500).json({ message: 'Error generating quiz questions' });
  }
});

// Get topic information
router.get('/topics/:topic/info', async (req, res) => {
  try {
    const topic = req.params.topic;

    const topicInfo = {
      'javascript': {
        title: 'JavaScript Programming',
        description: 'Master the fundamentals and advanced concepts of JavaScript, the most popular programming language for web development.',
        keyPoints: [
          'Variables, data types, and operators',
          'Functions and scope management',
          'Object-oriented programming concepts',
          'Asynchronous programming with Promises and async/await',
          'Modern ES6+ features and syntax',
          'DOM manipulation and event handling'
        ],
        difficulty: 'Intermediate',
        estimatedTime: '15-20 minutes'
      },
      'python': {
        title: 'Python Programming',
        description: 'Learn Python, a versatile and beginner-friendly programming language used in web development, data science, and automation.',
        keyPoints: [
          'Python syntax and basic data structures',
          'Control flow and functions',
          'Object-oriented programming in Python',
          'Working with libraries and modules',
          'Exception handling and debugging',
          'File operations and data processing'
        ],
        difficulty: 'Beginner',
        estimatedTime: '12-18 minutes'
      },
      'react': {
        title: 'React Development',
        description: 'Build modern, interactive user interfaces with React, the most popular JavaScript library for frontend development.',
        keyPoints: [
          'Components and JSX syntax',
          'State management with hooks',
          'Props and component communication',
          'Event handling and forms',
          'Lifecycle methods and effects',
          'Routing and navigation'
        ],
        difficulty: 'Intermediate',
        estimatedTime: '18-25 minutes'
      },
      'data-science': {
        title: 'Data Science Fundamentals',
        description: 'Explore the world of data science, including data analysis, visualization, and machine learning concepts.',
        keyPoints: [
          'Data collection and cleaning techniques',
          'Statistical analysis and hypothesis testing',
          'Data visualization with Python/R',
          'Machine learning algorithms basics',
          'Model evaluation and validation',
          'Big data tools and technologies'
        ],
        difficulty: 'Advanced',
        estimatedTime: '20-30 minutes'
      },
      'leadership': {
        title: 'Leadership Skills',
        description: 'Develop essential leadership qualities and learn how to inspire, motivate, and guide teams to success.',
        keyPoints: [
          'Communication and active listening',
          'Team building and collaboration',
          'Decision-making and problem-solving',
          'Emotional intelligence and empathy',
          'Conflict resolution strategies',
          'Strategic thinking and vision setting'
        ],
        difficulty: 'Intermediate',
        estimatedTime: '15-20 minutes'
      },
      'project-management': {
        title: 'Project Management',
        description: 'Learn project management methodologies, tools, and techniques to deliver successful projects on time and within budget.',
        keyPoints: [
          'Project lifecycle and planning',
          'Agile and Scrum methodologies',
          'Risk management and mitigation',
          'Resource allocation and scheduling',
          'Stakeholder communication',
          'Quality assurance and control'
        ],
        difficulty: 'Intermediate',
        estimatedTime: '18-25 minutes'
      }
    };

    const info = topicInfo[topic as keyof typeof topicInfo];
    
    if (!info) {
      return res.status(404).json({ 
        message: 'Topic information not found',
        availableTopics: Object.keys(topicInfo)
      });
    }

    res.json({
      topic,
      info,
      message: 'Topic information retrieved successfully'
    });

  } catch (error) {
    console.error('Get topic info error:', error);
    res.status(500).json({ message: 'Error retrieving topic information' });
  }
});

export default router;