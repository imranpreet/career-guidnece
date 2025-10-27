import express from 'express';
import authenticateToken from '../middleware/auth';
import User from '../models/User';

const router = express.Router();

// Interview question database with comprehensive categories
const interviewQuestions = {
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
      sampleAnswer: "In my previous role, I worked with a colleague who was consistently missing deadlines... [Situation] My task was to ensure our project stayed on track... [Task] I scheduled a private conversation to understand their challenges... [Action] As a result, we improved communication and delivered the project successfully... [Result]",
      category: "Teamwork & Collaboration"
    },
    {
      id: 2,
      question: "Describe a situation where you had to learn something new quickly to complete a project.",
      type: 'behavioral',
      difficulty: 'medium',
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
      type: 'behavioral',
      difficulty: 'hard',
      tips: [
        "Show respect for authority while demonstrating independent thinking",
        "Focus on the professional approach you took",
        "Highlight how you presented alternative solutions",
        "Show the positive outcome of the conversation"
      ],
      sampleAnswer: "There was a situation where my manager wanted to rush a product release... [Situation] I felt this could impact quality and customer satisfaction... [Task] I prepared a detailed analysis with data and presented alternative timelines... [Action] My manager appreciated the thoroughness and we adjusted the timeline, resulting in a more successful launch... [Result]",
      category: "Communication & Leadership"
    },
    {
      id: 4,
      question: "Describe a time when you failed at something. How did you handle it?",
      type: 'behavioral',
      difficulty: 'medium',
      tips: [
        "Choose a real failure, not a disguised strength",
        "Focus on what you learned from the experience",
        "Show how you applied the lesson to future situations",
        "Demonstrate resilience and growth mindset"
      ],
      sampleAnswer: "Early in my career, I underestimated the complexity of a project and promised an unrealistic deadline... [Situation] I had to deliver a critical feature but realized I couldn't meet the commitment... [Task] I immediately informed stakeholders, presented a revised timeline with detailed reasoning, and worked extra hours to minimize the delay... [Action] The project was delivered successfully, and I learned to better estimate project scope and communicate proactively... [Result]",
      category: "Self-Awareness & Growth"
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
        "Demonstrate understanding of common performance bottlenecks",
        "Show how you would measure and validate improvements"
      ],
      sampleAnswer: "I would start by identifying the specific performance issue using browser dev tools and monitoring... Then isolate the problem by checking network requests, JavaScript execution, and rendering... Use profiling tools to pinpoint bottlenecks... Implement fixes incrementally and measure improvements...",
      category: "Problem Solving"
    },
    {
      id: 2,
      question: "Explain the difference between SQL and NoSQL databases. When would you use each?",
      type: 'technical',
      difficulty: 'medium',
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
      type: 'technical',
      difficulty: 'hard',
      tips: [
        "Start with high-level architecture",
        "Discuss scalability patterns (horizontal vs vertical scaling)",
        "Mention caching, load balancing, and database strategies",
        "Address monitoring and reliability concerns"
      ],
      sampleAnswer: "I would start with a microservices architecture behind a load balancer... Implement horizontal scaling with auto-scaling groups... Use caching layers like Redis for frequently accessed data... Implement database sharding or replication... Add monitoring and alerting systems...",
      category: "System Design"
    },
    {
      id: 4,
      question: "What is the difference between synchronous and asynchronous programming?",
      type: 'technical',
      difficulty: 'easy',
      tips: [
        "Explain the core concepts clearly",
        "Provide practical examples",
        "Mention benefits and drawbacks of each approach",
        "Show understanding of when to use each"
      ],
      sampleAnswer: "Synchronous programming executes code sequentially, blocking until each operation completes... Asynchronous programming allows multiple operations to run concurrently without blocking... Use async for I/O operations, API calls, and user interfaces to maintain responsiveness...",
      category: "Programming Concepts"
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
        "Show enthusiasm and genuine interest",
        "Mention specific aspects that excite you"
      ],
      sampleAnswer: "I'm excited about this position because it combines my passion for technology with the opportunity to make a meaningful impact... Your company's focus on innovation and customer-centric solutions aligns perfectly with my values... The role offers growth opportunities in areas I'm eager to develop...",
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
        "Connect strengths to job requirements",
        "Avoid generic or cliché answers"
      ],
      sampleAnswer: "One of my greatest strengths is my ability to break down complex problems into manageable components... For example, in my last project... Another strength is my communication skills, which help me collaborate effectively with both technical and non-technical team members...",
      category: "Self-Assessment"
    },
    {
      id: 3,
      question: "Where do you see yourself in 5 years?",
      type: 'general',
      difficulty: 'medium',
      tips: [
        "Show ambition but be realistic",
        "Align your goals with potential career paths at the company",
        "Focus on skills and impact rather than just titles",
        "Demonstrate long-term thinking"
      ],
      sampleAnswer: "In 5 years, I see myself having grown significantly in my technical expertise and taking on more leadership responsibilities... I'd love to be mentoring junior developers and contributing to architectural decisions... I'm interested in eventually leading a team while staying hands-on with technology...",
      category: "Career Goals"
    },
    {
      id: 4,
      question: "What is your greatest weakness?",
      type: 'general',
      difficulty: 'medium',
      tips: [
        "Choose a real weakness, not a strength in disguise",
        "Show self-awareness and honesty",
        "Explain what you're doing to improve",
        "Demonstrate growth mindset"
      ],
      sampleAnswer: "I've struggled with delegation in the past because I wanted to ensure everything was done perfectly... I've been working on this by setting clear expectations, providing proper resources, and gradually increasing the scope of responsibilities I delegate... This has helped me focus on higher-level tasks while developing my team...",
      category: "Self-Awareness"
    }
  ],
  leadership: [
    {
      id: 1,
      question: "How do you motivate team members who are underperforming?",
      type: 'behavioral',
      difficulty: 'medium',
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
      type: 'general',
      difficulty: 'medium',
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
      type: 'behavioral',
      difficulty: 'hard',
      tips: [
        "Show your conflict resolution process",
        "Emphasize listening to all parties involved",
        "Mention focusing on facts and solutions, not blame",
        "Highlight preventing future conflicts"
      ],
      sampleAnswer: "When conflicts arise, I address them quickly before they escalate... I meet with each party individually to understand their perspectives... Then I bring everyone together to focus on finding a solution that works for the team and project... I follow up to ensure the resolution is sustainable and look for ways to prevent similar conflicts...",
      category: "Conflict Resolution"
    },
    {
      id: 4,
      question: "Tell me about a time when you had to make a difficult decision as a leader.",
      type: 'behavioral',
      difficulty: 'hard',
      tips: [
        "Choose a decision with meaningful impact",
        "Explain your decision-making process",
        "Show consideration for different stakeholders",
        "Highlight the outcome and lessons learned"
      ],
      sampleAnswer: "As a team lead, I had to decide whether to rebuild a critical system or continue patching the existing one... [Situation] The rebuild would delay our current project but provide long-term benefits... [Task] I gathered data on costs, risks, and benefits, consulted with stakeholders, and presented options to leadership... [Action] We chose the rebuild, which initially caused delays but resulted in a 50% reduction in maintenance time and improved system reliability... [Result]",
      category: "Decision Making"
    }
  ]
};

// Get available interview types
router.get('/types', (req, res) => {
  try {
    const types = [
      {
        id: 'behavioral',
        name: 'Behavioral Interview',
        description: 'Questions about your past experiences and behavior in workplace situations',
        duration: '20-30 minutes',
        difficulty: 'Medium',
        color: 'blue',
        questionCount: interviewQuestions.behavioral.length
      },
      {
        id: 'technical',
        name: 'Technical Interview',
        description: 'Questions about your technical skills and problem-solving abilities',
        duration: '30-45 minutes',
        difficulty: 'Hard',
        color: 'purple',
        questionCount: interviewQuestions.technical.length
      },
      {
        id: 'general',
        name: 'General Interview',
        description: 'Common questions asked in most job interviews',
        duration: '15-25 minutes',
        difficulty: 'Easy',
        color: 'green',
        questionCount: interviewQuestions.general.length
      },
      {
        id: 'leadership',
        name: 'Leadership Interview',
        description: 'Questions focused on leadership experience and management skills',
        duration: '25-35 minutes',
        difficulty: 'Medium',
        color: 'amber',
        questionCount: interviewQuestions.leadership.length
      }
    ];

    res.json({ types });
  } catch (error) {
    console.error('Get interview types error:', error);
    res.status(500).json({ message: 'Error fetching interview types' });
  }
});

// Get interview questions for a specific type
router.get('/:type/questions', authenticateToken, async (req: any, res) => {
  try {
    const interviewType = req.params.type;
    const { count = 5, difficulty } = req.query;
    const user = req.user; // From authenticateToken

    const questions = interviewQuestions[interviewType as keyof typeof interviewQuestions];
    
    if (!questions) {
      return res.status(404).json({ 
        message: 'Interview type not found',
        availableTypes: Object.keys(interviewQuestions)
      });
    }

    // Filter by difficulty if specified
    let filteredQuestions = questions;
    if (difficulty && difficulty !== 'all') {
      filteredQuestions = questions.filter(q => q.difficulty === difficulty);
    }

    // Shuffle and return requested number of questions
    const shuffled = filteredQuestions.sort(() => Math.random() - 0.5);
    const selectedQuestions = shuffled.slice(0, parseInt(count as string));

    // Personalize technical questions based on user's primarySkill
    const personalizedQuestions = selectedQuestions.map(q => {
      if (interviewType === 'technical' && user.primarySkill) {
        return {
          ...q,
          question: `[${user.primarySkill}] ${q.question}`,
          note: `This question has been personalized for your primary skill: ${user.primarySkill}`
        };
      }
      return q;
    });

    res.json({
      type: interviewType,
      difficulty: difficulty || 'all',
      questions: personalizedQuestions,
      totalAvailable: questions.length,
      primarySkill: user.primarySkill,
      message: user.primarySkill 
        ? `Interview questions personalized for ${user.primarySkill}` 
        : 'Interview questions retrieved successfully'
    });

  } catch (error) {
    console.error('Get interview questions error:', error);
    res.status(500).json({ message: 'Error fetching interview questions' });
  }
});

// Submit interview session and get feedback
router.post('/submit', authenticateToken, async (req: any, res) => {
  try {
    const userId = req.user._id;
    const { type, questions, answers, timeSpent } = req.body;

    // Generate feedback based on interview type and performance
    let feedback = '';
    let score = 0;
    let recommendations: string[] = [];

    // Simple scoring based on answer length and time spent
    const avgAnswerLength = answers.reduce((sum: number, answer: string) => sum + answer.length, 0) / answers.length;
    const avgTimePerQuestion = timeSpent / questions.length;

    if (avgAnswerLength > 200 && avgTimePerQuestion > 60 && avgTimePerQuestion < 300) {
      score = Math.floor(Math.random() * 15) + 85; // 85-100
      feedback = `Excellent performance! Your answers were detailed and well-structured. You demonstrated strong ${type} skills.`;
      recommendations = [
        'Continue practicing with real interview scenarios',
        'Research specific companies and roles you\'re targeting',
        'Consider mock interviews with industry professionals'
      ];
    } else if (avgAnswerLength > 100 && avgTimePerQuestion > 30) {
      score = Math.floor(Math.random() * 20) + 70; // 70-89
      feedback = `Good performance! Your answers showed understanding, but could be more detailed and structured.`;
      recommendations = [
        'Practice the STAR method for behavioral questions',
        'Prepare more specific examples from your experience',
        'Work on articulating your thoughts more clearly'
      ];
    } else {
      score = Math.floor(Math.random() * 20) + 50; // 50-69
      feedback = `Areas for improvement identified. Focus on providing more detailed answers and specific examples.`;
      recommendations = [
        'Practice answering questions out loud',
        'Prepare 5-7 strong examples from your experience',
        'Research common interview questions for your field',
        'Consider taking additional time to think through your responses'
      ];
    }

    // Add type-specific recommendations
    switch (type) {
      case 'behavioral':
        recommendations.push('Master the STAR method for storytelling');
        recommendations.push('Prepare examples that show growth and learning');
        break;
      case 'technical':
        recommendations.push('Practice coding problems and system design');
        recommendations.push('Review fundamental computer science concepts');
        break;
      case 'leadership':
        recommendations.push('Develop examples of successful team leadership');
        recommendations.push('Study leadership frameworks and methodologies');
        break;
      case 'general':
        recommendations.push('Research the company and role thoroughly');
        recommendations.push('Prepare thoughtful questions to ask the interviewer');
        break;
    }

    // Update user's interview practice count
    await User.findByIdAndUpdate(userId, {
      $inc: { interviewsCompleted: 1 }
    });

    const result = {
      type,
      score,
      feedback,
      recommendations: recommendations.slice(0, 4), // Limit to 4 recommendations
      questionsAnswered: questions.length,
      timeSpent,
      completedAt: new Date(),
      averageTimePerQuestion: Math.round(avgTimePerQuestion),
      averageAnswerLength: Math.round(avgAnswerLength)
    };

    res.json({
      message: 'Interview session completed successfully',
      result
    });

  } catch (error) {
    console.error('Submit interview error:', error);
    res.status(500).json({ message: 'Error submitting interview session' });
  }
});

// Get user's interview history
router.get('/history', authenticateToken, async (req: any, res) => {
  try {
    const user = req.user;
    
    // Mock interview history - in production, store in database
    const interviewHistory = [
      {
        id: '1',
        type: 'behavioral',
        score: 87,
        completedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        timeSpent: 1440, // 24 minutes
        questionsAnswered: 4
      },
      {
        id: '2',
        type: 'technical',
        score: 78,
        completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        timeSpent: 2100, // 35 minutes
        questionsAnswered: 5
      },
      {
        id: '3',
        type: 'general',
        score: 92,
        completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        timeSpent: 900, // 15 minutes
        questionsAnswered: 3
      }
    ];

    res.json({
      interviewHistory,
      totalCompleted: user.interviewsCompleted || interviewHistory.length,
      averageScore: Math.round(interviewHistory.reduce((sum, session) => sum + session.score, 0) / interviewHistory.length)
    });

  } catch (error) {
    console.error('Get interview history error:', error);
    res.status(500).json({ message: 'Error fetching interview history' });
  }
});

// Get interview tips and best practices
router.get('/tips/:type', (req, res) => {
  try {
    const interviewType = req.params.type;

    const tips = {
      behavioral: {
        title: 'Behavioral Interview Tips',
        description: 'Behavioral interviews focus on how you\'ve handled situations in the past.',
        tips: [
          'Use the STAR method: Situation, Task, Action, Result',
          'Prepare 5-7 specific examples from your experience',
          'Focus on your role and contributions, not just team achievements',
          'Choose examples that show growth, learning, and positive outcomes',
          'Practice telling your stories concisely but with enough detail',
          'Be honest about challenges and what you learned from them'
        ],
        commonQuestions: [
          'Tell me about a time when you faced a challenge',
          'Describe a situation where you had to work with a difficult person',
          'Give an example of when you showed leadership',
          'Tell me about a mistake you made and how you handled it'
        ]
      },
      technical: {
        title: 'Technical Interview Tips',
        description: 'Technical interviews assess your problem-solving skills and technical knowledge.',
        tips: [
          'Think out loud - explain your reasoning process',
          'Ask clarifying questions before diving into solutions',
          'Start with a simple solution, then optimize if needed',
          'Consider edge cases and error handling',
          'Practice coding on a whiteboard or paper',
          'Review fundamental data structures and algorithms'
        ],
        commonQuestions: [
          'How would you debug a performance issue?',
          'Design a system to handle high traffic',
          'Explain the trade-offs between different technologies',
          'Walk through your approach to solving a coding problem'
        ]
      },
      general: {
        title: 'General Interview Tips',
        description: 'General interviews cover motivation, fit, and basic qualifications.',
        tips: [
          'Research the company, role, and industry thoroughly',
          'Prepare thoughtful questions about the role and company',
          'Practice your elevator pitch and career story',
          'Be ready to explain gaps in your resume',
          'Show enthusiasm and genuine interest',
          'Prepare examples that demonstrate your skills and achievements'
        ],
        commonQuestions: [
          'Why are you interested in this position?',
          'What are your greatest strengths and weaknesses?',
          'Where do you see yourself in 5 years?',
          'Why are you leaving your current job?'
        ]
      },
      leadership: {
        title: 'Leadership Interview Tips',
        description: 'Leadership interviews focus on your ability to guide and influence others.',
        tips: [
          'Prepare examples of successful team leadership',
          'Show how you develop and mentor others',
          'Discuss your approach to handling conflicts',
          'Demonstrate strategic thinking and vision',
          'Show emotional intelligence and empathy',
          'Explain how you adapt your leadership style to different situations'
        ],
        commonQuestions: [
          'How do you motivate underperforming team members?',
          'Describe your leadership style',
          'How do you handle conflicts within your team?',
          'Tell me about a difficult decision you had to make as a leader'
        ]
      }
    };

    const typeInfo = tips[interviewType as keyof typeof tips];
    
    if (!typeInfo) {
      return res.status(404).json({ 
        message: 'Interview type not found',
        availableTypes: Object.keys(tips)
      });
    }

    res.json({
      type: interviewType,
      ...typeInfo,
      message: 'Interview tips retrieved successfully'
    });

  } catch (error) {
    console.error('Get interview tips error:', error);
    res.status(500).json({ message: 'Error fetching interview tips' });
  }
});

export default router;