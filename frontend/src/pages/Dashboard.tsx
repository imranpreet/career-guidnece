import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChartBarIcon,
  DocumentTextIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  UserCircleIcon,
  MagnifyingGlassIcon,
  BellIcon,
  CogIcon,
  ChatBubbleLeftRightIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import AIChat from '../components/AIChat';
import ResumeBuilder from '../components/ResumeBuilder';

const API_URL = process.env.REACT_APP_API_URL || 'https://career-guidnece-production-d6a5.up.railway.app/api';

import QuizSystem from '../components/QuizSystem';
import InterviewPractice from '../components/InterviewPractice';

interface JobRole {
  title: string;
  match: string;
  demand: string;
  salary: string;
}

interface JobRoleDetails {
  title: string;
  description: string;
  responsibilities: string[];
  requiredSkills: string[];
  experienceLevel: string;
  averageSalary: string;
  growthOutlook: string;
  practiceQuestions: {
    question: string;
    type: string;
    difficulty: string;
  }[];
}

interface RecentActivity {
  type: string;
  title: string;
  time: string;
  score?: number;
  icon: string;
}

interface UserData {
  userName: string;
  email: string;
  experience: string;
  currentRole: string;
  targetRole: string;
  completedQuizzes: number;
  resumesGenerated: number;
  interviewsCompleted: number;
  progressScore: number;
  averageQuizScore: number;
  averageInterviewScore: number;
  recentActivities: RecentActivity[];
  recommendations: string[];
  topJobRoles: JobRole[];
}

interface Notification {
  email: string;
  subscribedAt: string;
  message: string;
}

const Dashboard: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [isResumeBuilderOpen, setIsResumeBuilderOpen] = useState(false);
  const [isQuizSystemOpen, setIsQuizSystemOpen] = useState(false);
  const [isInterviewPracticeOpen, setIsInterviewPracticeOpen] = useState(false);
  const [isJobRoleModalOpen, setIsJobRoleModalOpen] = useState(false);
  const [selectedJobRole, setSelectedJobRole] = useState<JobRoleDetails | null>(null);
  const [isSkillsModalOpen, setIsSkillsModalOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close notification dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationOpen(false);
      }
    };

    if (isNotificationOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isNotificationOpen]);

  // Function to refresh user data
  const refreshUserData = async () => {
    try {
      setRefreshing(true);

      const token = localStorage.getItem('token');
      if (!token) return;

      console.log('Refreshing dashboard data...');
      const response = await fetch(`${API_URL}/user/dashboard`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        // Add cache busting to force fresh data
        cache: 'no-cache'
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Dashboard data refreshed successfully:', {
          completedQuizzes: data.completedQuizzes,
          resumesGenerated: data.resumesGenerated,
          interviewsCompleted: data.interviewsCompleted,
          progressScore: data.progressScore,
          averageQuizScore: data.averageQuizScore
        });
        setUserData(data);
      } else {
        console.error('Failed to refresh dashboard:', response.status);
      }
    } catch (error) {
      console.error('Error refreshing dashboard data:', error);
    } finally {
      setRefreshing(false);
    }
  };

  // Function to fetch notifications
  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`${API_URL}/newsletter/notifications`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications || []);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  // Function to mark notifications as read
  const markNotificationsAsRead = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      await fetch(`${API_URL}/newsletter/notifications/mark-read`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      setNotifications([]);
    } catch (error) {
      console.error('Error marking notifications as read:', error);
    }
  };

  // Function to format time ago
  const formatTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
    const weeks = Math.floor(days / 7);
    return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
  };

  // Check authentication and fetch user data
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await fetch(`${API_URL}/user/dashboard`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUserData(data);
        } else {
          // If token is invalid, redirect to login
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/login');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        // Use mock data as fallback
        setUserData({
          userName: 'John Doe',
          email: 'john.doe@example.com',
          experience: 'mid',
          currentRole: 'Software Engineer',
          targetRole: 'Senior Software Engineer',
          completedQuizzes: 5,
          resumesGenerated: 3,
          interviewsCompleted: 8,
          progressScore: 72,
          averageQuizScore: 85,
          averageInterviewScore: 78,
          recentActivities: [
            { type: 'quiz', title: 'Completed Technical Skills Assessment', time: '2 hours ago', score: 85, icon: 'AcademicCapIcon' },
            { type: 'resume', title: 'Generated new resume template', time: '1 day ago', icon: 'DocumentTextIcon' },
            { type: 'interview', title: 'Practiced behavioral questions', time: '3 days ago', score: 78, icon: 'BriefcaseIcon' }
          ],
          recommendations: [
            'Complete your professional profile',
            'Take a skills assessment quiz',
            'Generate your first AI-powered resume',
            'Practice interview questions'
          ],
          topJobRoles: [
            { title: 'Senior Software Engineer', match: '95%', demand: 'High', salary: '$90k - $130k' },
            { title: 'Product Manager', match: '87%', demand: 'Medium', salary: '$85k - $120k' },
            { title: 'Data Scientist', match: '78%', demand: 'High', salary: '$95k - $140k' },
            { title: 'DevOps Engineer', match: '65%', demand: 'Medium', salary: '$80k - $115k' },
            { title: 'Frontend Developer', match: '88%', demand: 'High', salary: '$70k - $110k' },
            { title: 'Backend Developer', match: '82%', demand: 'High', salary: '$75k - $125k' },
            { title: 'Full Stack Developer', match: '85%', demand: 'High', salary: '$80k - $140k' },
            { title: 'UX Designer', match: '72%', demand: 'Medium', salary: '$65k - $120k' },
            { title: 'QA Engineer', match: '70%', demand: 'Medium', salary: '$60k - $100k' },
            { title: 'Mobile Developer', match: '75%', demand: 'High', salary: '$70k - $120k' }
          ]
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
    fetchNotifications();

    // Poll for new notifications every 30 seconds
    const notificationInterval = setInterval(fetchNotifications, 30000);

    return () => clearInterval(notificationInterval);
  }, [navigate]);

  const topJobRoles = userData?.topJobRoles || [
    { title: 'Software Engineer', match: '95%', demand: 'High', salary: '$90k - $130k' },
    { title: 'Product Manager', match: '87%', demand: 'Medium', salary: '$85k - $120k' },
    { title: 'Data Analyst', match: '78%', demand: 'High', salary: '$95k - $140k' },
    { title: 'UX Designer', match: '65%', demand: 'Medium', salary: '$80k - $115k' }
  ];

  const recentActivities = userData?.recentActivities || [
    { type: 'welcome', title: 'Welcome to AI Career Coach!', time: 'Today', icon: 'SparklesIcon' }
  ];

  // Search filter functions
  const filterJobRoles = (roles: JobRole[]) => {
    if (!searchQuery.trim()) return roles;
    return roles.filter(role => 
      role.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      role.demand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      role.salary.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const filterRecommendations = (recommendations: string[]) => {
    if (!searchQuery.trim()) return recommendations;
    return recommendations.filter(rec => 
      rec.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const filterActivities = (activities: RecentActivity[]) => {
    if (!searchQuery.trim()) return activities;
    return activities.filter(activity => 
      activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.type.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  // Quick actions that can be searched
  const quickActions = [
    { name: 'Take Smart Quiz', action: () => setIsQuizSystemOpen(true), keywords: ['quiz', 'test', 'assessment', 'skills', 'evaluation'] },
    { name: 'Build Resume', action: () => setIsResumeBuilderOpen(true), keywords: ['resume', 'cv', 'curriculum', 'profile', 'document'] },
    { name: 'Practice Interview', action: () => setIsInterviewPracticeOpen(true), keywords: ['interview', 'practice', 'questions', 'preparation'] },
    { name: 'AI Chat', action: () => setIsAIChatOpen(true), keywords: ['chat', 'ai', 'assistant', 'help', 'guidance'] }
  ];

  const filterQuickActions = () => {
    if (!searchQuery.trim()) return quickActions;
    return quickActions.filter(action => 
      action.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      action.keywords.some(keyword => keyword.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  };

  // Apply filters
  const filteredJobRoles = filterJobRoles(topJobRoles);
  const filteredRecommendations = userData?.recommendations ? filterRecommendations(userData.recommendations) : [];
  const filteredActivities = filterActivities(recentActivities);
  const filteredQuickActions = filterQuickActions();

  // Get detailed job role information
  const getJobRoleDetails = (jobTitle: string): JobRoleDetails => {
    const jobDetailsMap: { [key: string]: JobRoleDetails } = {
      'Senior Software Engineer': {
        title: 'Senior Software Engineer',
        description: 'Senior software engineers lead development teams, architect complex systems, and mentor junior developers while building scalable software solutions.',
        responsibilities: [
          'Lead technical design and architecture decisions',
          'Mentor junior and mid-level developers',
          'Code review and ensure best practices',
          'Collaborate with product and design teams',
          'Drive technical innovation and improvements'
        ],
        requiredSkills: ['Advanced Programming', 'System Design', 'Leadership', 'Architecture', 'Code Review'],
        experienceLevel: '5+ years experience',
        averageSalary: '$90k - $130k',
        growthOutlook: 'Excellent growth (22% by 2030)',
        practiceQuestions: [
          { question: 'Design a distributed system for a social media platform.', type: 'System Design', difficulty: 'Hard' },
          { question: 'How do you approach technical debt in legacy systems?', type: 'Technical', difficulty: 'Medium' },
          { question: 'Describe your experience mentoring junior developers.', type: 'Leadership', difficulty: 'Medium' },
          { question: 'How do you ensure code quality across a large team?', type: 'Process', difficulty: 'Medium' },
          { question: 'Tell me about a time you had to make a difficult architectural decision.', type: 'Behavioral', difficulty: 'Hard' }
        ]
      },
      'Product Manager': {
        title: 'Product Manager',
        description: 'Product managers define product strategy, work with cross-functional teams, and drive product development from conception to launch.',
        responsibilities: [
          'Define product roadmap and strategy',
          'Gather and prioritize product requirements',
          'Work with engineering, design, and marketing teams',
          'Analyze market trends and user feedback',
          'Drive product launches and go-to-market strategies'
        ],
        requiredSkills: ['Product Strategy', 'Data Analysis', 'User Research', 'Project Management', 'Communication'],
        experienceLevel: '3-7 years experience',
        averageSalary: '$85k - $120k',
        growthOutlook: 'Strong growth (19% by 2030)',
        practiceQuestions: [
          { question: 'How would you prioritize features for a mobile app?', type: 'Product Strategy', difficulty: 'Medium' },
          { question: 'Tell me about a product you launched from start to finish.', type: 'Behavioral', difficulty: 'Medium' },
          { question: 'How do you handle conflicting stakeholder requirements?', type: 'Process', difficulty: 'Medium' },
          { question: 'What metrics would you use to measure product success?', type: 'Analytics', difficulty: 'Medium' },
          { question: 'How do you conduct user research and incorporate feedback?', type: 'Research', difficulty: 'Easy' }
        ]
      },
      'Data Scientist': {
        title: 'Data Scientist',
        description: 'Data scientists analyze complex datasets, build predictive models, and extract actionable insights to drive business decisions.',
        responsibilities: [
          'Analyze large datasets to identify trends and patterns',
          'Build and deploy machine learning models',
          'Create data visualizations and reports',
          'Collaborate with stakeholders to define data requirements',
          'Present findings to technical and non-technical audiences'
        ],
        requiredSkills: ['Python/R', 'Machine Learning', 'Statistics', 'SQL', 'Data Visualization'],
        experienceLevel: '2-6 years experience',
        averageSalary: '$95k - $140k',
        growthOutlook: 'Exceptional growth (36% by 2030)',
        practiceQuestions: [
          { question: 'Explain the difference between supervised and unsupervised learning.', type: 'Technical', difficulty: 'Easy' },
          { question: 'How would you handle missing data in a dataset?', type: 'Technical', difficulty: 'Medium' },
          { question: 'Describe a machine learning project you worked on end-to-end.', type: 'Behavioral', difficulty: 'Medium' },
          { question: 'How do you evaluate the performance of a classification model?', type: 'Technical', difficulty: 'Medium' },
          { question: 'What is overfitting and how do you prevent it?', type: 'Technical', difficulty: 'Hard' }
        ]
      },
      'DevOps Engineer': {
        title: 'DevOps Engineer',
        description: 'DevOps engineers bridge development and operations, implementing CI/CD pipelines, managing infrastructure, and ensuring system reliability.',
        responsibilities: [
          'Implement and maintain CI/CD pipelines',
          'Manage cloud infrastructure and deployments',
          'Monitor system performance and reliability',
          'Automate operational processes',
          'Ensure security and compliance standards'
        ],
        requiredSkills: ['AWS/Azure/GCP', 'Docker/Kubernetes', 'CI/CD', 'Infrastructure as Code', 'Monitoring'],
        experienceLevel: '3-7 years experience',
        averageSalary: '$80k - $115k',
        growthOutlook: 'Very strong growth (25% by 2030)',
        practiceQuestions: [
          { question: 'Explain the difference between Docker and Kubernetes.', type: 'Technical', difficulty: 'Medium' },
          { question: 'How would you design a CI/CD pipeline for a microservices architecture?', type: 'System Design', difficulty: 'Hard' },
          { question: 'Describe your experience with infrastructure as code.', type: 'Technical', difficulty: 'Medium' },
          { question: 'How do you handle a production outage?', type: 'Process', difficulty: 'Medium' },
          { question: 'What monitoring and alerting strategies do you implement?', type: 'Technical', difficulty: 'Medium' }
        ]
      },
      'Frontend Developer': {
        title: 'Frontend Developer',
        description: 'Frontend developers create user-facing web applications using HTML, CSS, JavaScript, and modern frameworks like React, Vue, or Angular.',
        responsibilities: [
          'Develop responsive web applications',
          'Collaborate with designers to implement UI/UX designs',
          'Write clean, maintainable code',
          'Optimize applications for performance',
          'Test and debug applications across browsers'
        ],
        requiredSkills: ['HTML/CSS', 'JavaScript', 'React/Vue/Angular', 'Git', 'Responsive Design'],
        experienceLevel: 'Entry to Senior level',
        averageSalary: '$70k - $110k',
        growthOutlook: 'Strong growth (22% by 2030)',
        practiceQuestions: [
          { question: 'Explain the difference between let, const, and var in JavaScript.', type: 'Technical', difficulty: 'Easy' },
          { question: 'How would you optimize a React application for better performance?', type: 'Technical', difficulty: 'Medium' },
          { question: 'Describe how you would implement responsive design principles.', type: 'Technical', difficulty: 'Medium' },
          { question: 'What is the virtual DOM and how does it improve performance?', type: 'Technical', difficulty: 'Hard' },
          { question: 'Tell me about a challenging frontend project you worked on.', type: 'Behavioral', difficulty: 'Medium' }
        ]
      },
      'Backend Developer': {
        title: 'Backend Developer',
        description: 'Backend developers build server-side applications, APIs, and databases that power web and mobile applications.',
        responsibilities: [
          'Design and develop server-side applications',
          'Create and maintain APIs',
          'Manage databases and data storage',
          'Implement security measures',
          'Monitor application performance'
        ],
        requiredSkills: ['Python/Java/Node.js', 'SQL/NoSQL', 'API Development', 'Cloud Services', 'Security'],
        experienceLevel: 'Entry to Senior level',
        averageSalary: '$75k - $125k',
        growthOutlook: 'Excellent growth prospects (22% by 2030)',
        practiceQuestions: [
          { question: 'Explain the difference between SQL and NoSQL databases.', type: 'Technical', difficulty: 'Easy' },
          { question: 'How would you design a RESTful API for a blog system?', type: 'System Design', difficulty: 'Medium' },
          { question: 'What are microservices and their advantages?', type: 'Technical', difficulty: 'Medium' },
          { question: 'How do you handle database transactions and ACID properties?', type: 'Technical', difficulty: 'Hard' },
          { question: 'Describe a time when you had to optimize database performance.', type: 'Behavioral', difficulty: 'Medium' }
        ]
      },
      'Full Stack Developer': {
        title: 'Full Stack Developer',
        description: 'Full stack developers work on both frontend and backend technologies, creating complete web applications from start to finish.',
        responsibilities: [
          'Develop both client and server-side applications',
          'Design system architecture',
          'Manage deployment and DevOps',
          'Integrate third-party services',
          'Maintain code quality across the stack'
        ],
        requiredSkills: ['Frontend frameworks', 'Backend languages', 'Databases', 'DevOps', 'System Design'],
        experienceLevel: 'Mid to Senior level',
        averageSalary: '$80k - $140k',
        growthOutlook: 'High demand (13% growth by 2030)',
        practiceQuestions: [
          { question: 'How would you structure a full-stack application architecture?', type: 'System Design', difficulty: 'Medium' },
          { question: 'Explain the difference between authentication and authorization.', type: 'Technical', difficulty: 'Easy' },
          { question: 'How do you ensure data consistency across frontend and backend?', type: 'Technical', difficulty: 'Hard' },
          { question: 'Describe your approach to testing full-stack applications.', type: 'Technical', difficulty: 'Medium' },
          { question: 'Tell me about a project where you built everything from scratch.', type: 'Behavioral', difficulty: 'Medium' }
        ]
      },
      'UX Designer': {
        title: 'UX Designer',
        description: 'UX designers research user needs and create intuitive, user-centered designs for digital products.',
        responsibilities: [
          'Conduct user research and usability testing',
          'Create wireframes and prototypes',
          'Design user journeys and information architecture',
          'Collaborate with developers and stakeholders',
          'Iterate designs based on feedback'
        ],
        requiredSkills: ['User Research', 'Prototyping', 'Figma/Sketch', 'Usability Testing', 'Design Systems'],
        experienceLevel: 'Entry to Senior level',
        averageSalary: '$65k - $120k',
        growthOutlook: 'Strong growth (13% by 2030)',
        practiceQuestions: [
          { question: 'How do you approach user research for a new product?', type: 'Process', difficulty: 'Easy' },
          { question: 'Describe your process for creating user personas.', type: 'Process', difficulty: 'Medium' },
          { question: 'How would you redesign a poorly performing checkout flow?', type: 'Design Challenge', difficulty: 'Medium' },
          { question: 'What methods do you use to validate design decisions?', type: 'Process', difficulty: 'Medium' },
          { question: 'Tell me about a time when user feedback changed your design approach.', type: 'Behavioral', difficulty: 'Medium' }
        ]
      },
      'QA Engineer': {
        title: 'QA Engineer',
        description: 'QA engineers ensure software quality through testing, automation, and quality assurance processes.',
        responsibilities: [
          'Design and execute test plans and test cases',
          'Develop automated testing frameworks',
          'Identify and report bugs and defects',
          'Collaborate with development teams on quality standards',
          'Perform regression and performance testing'
        ],
        requiredSkills: ['Test Automation', 'Selenium/Cypress', 'API Testing', 'Performance Testing', 'Bug Tracking'],
        experienceLevel: 'Entry to Senior level',
        averageSalary: '$60k - $100k',
        growthOutlook: 'Steady growth (8% by 2030)',
        practiceQuestions: [
          { question: 'What is the difference between functional and non-functional testing?', type: 'Technical', difficulty: 'Easy' },
          { question: 'How do you prioritize test cases when time is limited?', type: 'Process', difficulty: 'Medium' },
          { question: 'Describe your experience with test automation frameworks.', type: 'Technical', difficulty: 'Medium' },
          { question: 'How do you handle flaky tests in automation?', type: 'Technical', difficulty: 'Medium' },
          { question: 'Tell me about a critical bug you found and how you handled it.', type: 'Behavioral', difficulty: 'Medium' }
        ]
      },
      'Mobile Developer': {
        title: 'Mobile Developer',
        description: 'Mobile developers create applications for iOS and Android platforms using native or cross-platform technologies.',
        responsibilities: [
          'Develop native or cross-platform mobile applications',
          'Optimize apps for performance and user experience',
          'Integrate with backend APIs and services',
          'Publish and maintain apps in app stores',
          'Stay updated with mobile development trends'
        ],
        requiredSkills: ['iOS/Android Development', 'React Native/Flutter', 'Mobile UI/UX', 'API Integration', 'App Store Guidelines'],
        experienceLevel: 'Entry to Senior level',
        averageSalary: '$70k - $120k',
        growthOutlook: 'Strong growth (22% by 2030)',
        practiceQuestions: [
          { question: 'What are the key differences between iOS and Android development?', type: 'Technical', difficulty: 'Easy' },
          { question: 'How do you handle different screen sizes and orientations?', type: 'Technical', difficulty: 'Medium' },
          { question: 'Describe your experience with cross-platform development.', type: 'Technical', difficulty: 'Medium' },
          { question: 'How do you optimize mobile app performance?', type: 'Technical', difficulty: 'Medium' },
          { question: 'Tell me about a challenging mobile app feature you implemented.', type: 'Behavioral', difficulty: 'Medium' }
        ]
      }
    };

    return jobDetailsMap[jobTitle] || {
      title: jobTitle,
      description: 'An exciting career opportunity in the tech industry.',
      responsibilities: ['Key responsibilities for this role'],
      requiredSkills: ['Relevant technical skills'],
      experienceLevel: 'Various levels',
      averageSalary: 'Competitive salary',
      growthOutlook: 'Positive growth outlook',
      practiceQuestions: [
        { question: 'Tell me about yourself and your interest in this role.', type: 'Behavioral', difficulty: 'Easy' },
        { question: 'What are your greatest strengths for this position?', type: 'Behavioral', difficulty: 'Easy' },
        { question: 'Describe a challenging project you worked on.', type: 'Behavioral', difficulty: 'Medium' }
      ]
    };
  };

  // Handle job role click
  const handleJobRoleClick = (jobTitle: string) => {
    const details = getJobRoleDetails(jobTitle);
    setSelectedJobRole(details);
    setIsJobRoleModalOpen(true);
  };

  // Check if any results found
  const hasSearchResults = searchQuery.trim() ? (
    filteredJobRoles.length > 0 || 
    filteredRecommendations.length > 0 || 
    filteredActivities.length > 0 || 
    filteredQuickActions.length > 0
  ) : true;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16">
      {loading ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
        </div>
      ) : !userData ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Unable to load dashboard
            </h2>
            <button
              onClick={() => navigate('/login')}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Go to Login
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
            <div className="container mx-auto px-6 py-4">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Welcome back, {userData?.userName}!
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    {userData?.currentRole} → {userData?.targetRole}
                  </p>
                </div>
            
            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative">
                <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search jobs, recommendations, actions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-10 py-2 w-80 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    ✕
                  </button>
                )}
              </div>
              
              {/* Notifications */}
              <div className="relative" ref={notificationRef}>
                <button 
                  onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                  className="relative p-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
                >
                  <BellIcon className="w-6 h-6" />
                  {notifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-semibold">
                      {notifications.length}
                    </span>
                  )}
                </button>

                {/* Notification Dropdown */}
                {isNotificationOpen && (
                  <div className="absolute right-0 mt-2 w-96 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Notifications
                      </h3>
                      {notifications.length > 0 && (
                        <button
                          onClick={markNotificationsAsRead}
                          className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-8 text-center">
                          <BellIcon className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
                          <p className="text-gray-500 dark:text-gray-400">No new notifications</p>
                          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                            We'll notify you when someone subscribes to your newsletter
                          </p>
                        </div>
                      ) : (
                        <div className="divide-y divide-gray-200 dark:divide-gray-700">
                          {notifications.map((notification, index) => (
                            <div
                              key={index}
                              className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                              <div className="flex items-start space-x-3">
                                <div className="flex-shrink-0">
                                  <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                                    <svg 
                                      className="w-5 h-5 text-primary-600 dark:text-primary-400" 
                                      fill="none" 
                                      stroke="currentColor" 
                                      viewBox="0 0 24 24"
                                    >
                                      <path 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round" 
                                        strokeWidth={2} 
                                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" 
                                      />
                                    </svg>
                                  </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    New Newsletter Subscriber
                                  </p>
                                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                                    <span className="font-semibold">{notification.email}</span> subscribed to your newsletter
                                  </p>
                                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                    {formatTimeAgo(notification.subscribedAt)}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {notifications.length > 0 && (
                      <div className="p-3 border-t border-gray-200 dark:border-gray-700 text-center">
                        <button
                          onClick={() => setIsNotificationOpen(false)}
                          className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                        >
                          Close
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              {/* Settings */}
              <button 
                onClick={() => navigate('/settings')}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                title="Settings"
              >
                <CogIcon className="w-6 h-6" />
              </button>
              
              {/* Profile */}
              <button className="flex items-center space-x-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                <UserCircleIcon className="w-8 h-8 text-gray-600 dark:text-gray-400" />
                <span className="text-gray-700 dark:text-gray-300 hidden md:block">{userData?.userName}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Search Results Summary */}
        {searchQuery && (
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">
                  Search Results for "{searchQuery}"
                </h3>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Found {filteredJobRoles.length + filteredRecommendations.length + filteredActivities.length + filteredQuickActions.length} results
                </p>
              </div>
              <button
                onClick={() => setSearchQuery('')}
                className="px-3 py-1 text-sm bg-blue-100 hover:bg-blue-200 dark:bg-blue-800 dark:hover:bg-blue-700 text-blue-700 dark:text-blue-300 rounded-lg transition-colors"
              >
                Clear Search
              </button>
            </div>
            {!hasSearchResults && (
              <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <p className="text-yellow-800 dark:text-yellow-200 text-sm">
                  No results found. Try searching for job roles, recommendations, activities, or actions like "quiz", "resume", "interview", or "chat".
                </p>
              </div>
            )}
          </div>
        )}

        {/* Stats Cards */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Your Progress</h2>
          <button
            onClick={refreshUserData}
            disabled={refreshing}
            className="flex items-center space-x-2 px-3 py-1 text-sm bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg transition-colors disabled:opacity-50"
          >
            <ArrowPathIcon className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8" key={userData?.completedQuizzes}>
                    <div className="card transition-all duration-300 hover:shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Progress Score</p>
                <p className="text-3xl font-bold text-primary-600 transition-all duration-500">{userData?.progressScore || 0}%</p>
              </div>
              <ChartBarIcon className="w-12 h-12 text-primary-600" />
            </div>
            {refreshing && (
              <div className="mt-2 text-xs text-blue-600 dark:text-blue-400 flex items-center">
                <ArrowPathIcon className="w-3 h-3 animate-spin mr-1" />
                Updating...
              </div>
            )}
          </div>
          
          <div className="card transition-all duration-300 hover:shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Completed Quizzes</p>
                <p className="text-3xl font-bold text-secondary-600 transition-all duration-500">{userData?.completedQuizzes || 0}</p>
                {userData?.averageQuizScore && userData.averageQuizScore > 0 && (
                  <p className="text-xs text-gray-500 mt-1">Avg: {userData.averageQuizScore}%</p>
                )}
              </div>
              <AcademicCapIcon className="w-12 h-12 text-secondary-600" />
            </div>
            {refreshing && (
              <div className="mt-2 text-xs text-blue-600 dark:text-blue-400 flex items-center">
                <ArrowPathIcon className="w-3 h-3 animate-spin mr-1" />
                Updating...
              </div>
            )}
          </div>
          
          <div className="card transition-all duration-300 hover:shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Resumes Generated</p>
                <p className="text-3xl font-bold text-accent-600 transition-all duration-500">{userData?.resumesGenerated || 0}</p>
              </div>
              <DocumentTextIcon className="w-12 h-12 text-accent-600" />
            </div>
            {refreshing && (
              <div className="mt-2 text-xs text-blue-600 dark:text-blue-400 flex items-center">
                <ArrowPathIcon className="w-3 h-3 animate-spin mr-1" />
                Updating...
              </div>
            )}
          </div>
          
          <div className="card transition-all duration-300 hover:shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Interview Practice</p>
                <p className="text-3xl font-bold text-green-600 transition-all duration-500">{userData?.interviewsCompleted || 0}</p>
                {userData?.averageInterviewScore && userData.averageInterviewScore > 0 && (
                  <p className="text-xs text-gray-500 mt-1">Avg: {userData.averageInterviewScore}%</p>
                )}
              </div>
              <BriefcaseIcon className="w-12 h-12 text-green-600" />
            </div>
            {refreshing && (
              <div className="mt-2 text-xs text-blue-600 dark:text-blue-400 flex items-center">
                <ArrowPathIcon className="w-3 h-3 animate-spin mr-1" />
                Updating...
              </div>
            )}
          </div>
        </div>

        {/* Performance Summary */}
        {(userData && (userData.averageQuizScore > 0 || userData.averageInterviewScore > 0 || userData.progressScore > 0)) && (
          <div className="card mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                📈 Your Progress Journey
              </h3>
              <div className="text-sm text-gray-500">
                Goal: 100% Complete
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Overall Progress</span>
                <span className="text-sm font-bold text-purple-600">{userData.progressScore}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 dark:bg-gray-700">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full transition-all duration-1000 ease-out relative"
                  style={{ width: `${Math.min(userData.progressScore, 100)}%` }}
                >
                  <div className="absolute inset-0 bg-white opacity-30 rounded-full animate-pulse"></div>
                </div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Beginner</span>
                <span>Intermediate</span>
                <span>Expert</span>
              </div>
            </div>

            {/* Progress Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {/* Quiz Progress */}
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <AcademicCapIcon className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-blue-900 dark:text-blue-100">Quizzes</span>
                  </div>
                  <button 
                    onClick={() => setIsQuizSystemOpen(true)}
                    className="text-xs bg-blue-100 hover:bg-blue-200 dark:bg-blue-800 dark:hover:bg-blue-700 text-blue-700 dark:text-blue-200 px-2 py-1 rounded transition-colors"
                  >
                    Take Quiz
                  </button>
                </div>
                <div className="text-2xl font-bold text-blue-600 mb-1">{userData.completedQuizzes}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  {userData.averageQuizScore > 0 ? `Avg Score: ${userData.averageQuizScore}%` : 'No quizzes yet'}
                </div>
                <div className="mt-2 bg-blue-200 dark:bg-blue-800 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((userData.completedQuizzes / 5) * 100, 100)}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500 mt-1">Goal: 5 quizzes</div>
              </div>

              {/* Resume Progress */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-4 rounded-lg border border-green-100 dark:border-green-800">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <DocumentTextIcon className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-green-900 dark:text-green-100">Resumes</span>
                  </div>
                  <button 
                    onClick={() => setIsResumeBuilderOpen(true)}
                    className="text-xs bg-green-100 hover:bg-green-200 dark:bg-green-800 dark:hover:bg-green-700 text-green-700 dark:text-green-200 px-2 py-1 rounded transition-colors"
                  >
                    Build Resume
                  </button>
                </div>
                <div className="text-2xl font-bold text-green-600 mb-1">{userData.resumesGenerated}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  {userData.resumesGenerated > 0 ? `${userData.resumesGenerated} generated` : 'Create your first resume'}
                </div>
                <div className="mt-2 bg-green-200 dark:bg-green-800 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((userData.resumesGenerated / 3) * 100, 100)}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500 mt-1">Goal: 3 resumes</div>
              </div>

              {/* Interview Progress */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-4 rounded-lg border border-purple-100 dark:border-purple-800">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <BriefcaseIcon className="w-5 h-5 text-purple-600" />
                    <span className="font-medium text-purple-900 dark:text-purple-100">Interviews</span>
                  </div>
                  <button 
                    onClick={() => setIsInterviewPracticeOpen(true)}
                    className="text-xs bg-purple-100 hover:bg-purple-200 dark:bg-purple-800 dark:hover:bg-purple-700 text-purple-700 dark:text-purple-200 px-2 py-1 rounded transition-colors"
                  >
                    Practice
                  </button>
                </div>
                <div className="text-2xl font-bold text-purple-600 mb-1">{userData.interviewsCompleted}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  {userData.averageInterviewScore > 0 ? `Avg Score: ${userData.averageInterviewScore}%` : 'Start practicing'}
                </div>
                <div className="mt-2 bg-purple-200 dark:bg-purple-800 rounded-full h-2">
                  <div 
                    className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((userData.interviewsCompleted / 5) * 100, 100)}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500 mt-1">Goal: 5 interviews</div>
              </div>
            </div>

            {/* Achievement Badges */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">🏆 Achievements</h4>
              <div className="flex flex-wrap gap-2">
                {userData.completedQuizzes >= 1 && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    🧠 First Quiz
                  </span>
                )}
                {userData.completedQuizzes >= 3 && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    📚 Quiz Master
                  </span>
                )}
                {userData.resumesGenerated >= 1 && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    📄 Resume Builder
                  </span>
                )}
                {userData.interviewsCompleted >= 1 && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                    💼 Interview Ready
                  </span>
                )}
                {userData.progressScore >= 50 && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                    ⭐ Halfway Hero
                  </span>
                )}
                {userData.progressScore >= 100 && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gold-100 text-gold-800 dark:bg-gold-900 dark:text-gold-200">
                    🎖️ Career Champion
                  </span>
                )}
                {userData.completedQuizzes === 0 && userData.resumesGenerated === 0 && userData.interviewsCompleted === 0 && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                    🚀 Getting Started
                  </span>
                )}
              </div>
            </div>

            {/* Next Steps */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">🎯 Next Steps</h4>
              <div className="space-y-2">
                {userData.completedQuizzes === 0 && (
                  <button 
                    onClick={() => setIsQuizSystemOpen(true)}
                    className="w-full text-left p-3 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 rounded-lg transition-colors group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-blue-700 dark:text-blue-300">Take your first skill assessment quiz</span>
                      <span className="text-blue-500 group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                  </button>
                )}
                {userData.resumesGenerated === 0 && (
                  <button 
                    onClick={() => setIsResumeBuilderOpen(true)}
                    className="w-full text-left p-3 bg-green-50 hover:bg-green-100 dark:bg-green-900/20 dark:hover:bg-green-900/30 rounded-lg transition-colors group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-green-700 dark:text-green-300">Generate your first AI-powered resume</span>
                      <span className="text-green-500 group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                  </button>
                )}
                {userData.interviewsCompleted === 0 && (
                  <button 
                    onClick={() => setIsInterviewPracticeOpen(true)}
                    className="w-full text-left p-3 bg-purple-50 hover:bg-purple-100 dark:bg-purple-900/20 dark:hover:bg-purple-900/30 rounded-lg transition-colors group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-purple-700 dark:text-purple-300">Start practicing interview questions</span>
                      <span className="text-purple-500 group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                  </button>
                )}
                {userData.completedQuizzes >= 1 && userData.resumesGenerated >= 1 && userData.interviewsCompleted >= 1 && userData.progressScore < 100 && (
                  <div className="p-3 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg">
                    <span className="text-sm text-gray-700 dark:text-gray-300">🎉 Great progress! Continue completing activities to reach 100%</span>
                  </div>
                )}
                {userData.progressScore >= 100 && (
                  <div className="p-3 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg">
                    <span className="text-sm text-gray-700 dark:text-gray-300">🏆 Congratulations! You've mastered all career development activities!</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Performance Summary - Fallback for new users */}
        {userData && userData.progressScore === 0 && userData.completedQuizzes === 0 && userData.resumesGenerated === 0 && userData.interviewsCompleted === 0 && (
          <div className="card mb-8">
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-white">🚀</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Welcome to Your Career Journey!
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Start building your professional profile with our AI-powered tools
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button 
                  onClick={() => setIsQuizSystemOpen(true)}
                  className="p-4 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 rounded-lg transition-colors group"
                >
                  <AcademicCapIcon className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <div className="font-medium text-blue-900 dark:text-blue-100">Take Quiz</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Assess your skills</div>
                </button>
                <button 
                  onClick={() => setIsResumeBuilderOpen(true)}
                  className="p-4 bg-green-50 hover:bg-green-100 dark:bg-green-900/20 dark:hover:bg-green-900/30 rounded-lg transition-colors group"
                >
                  <DocumentTextIcon className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <div className="font-medium text-green-900 dark:text-green-100">Build Resume</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Create professional resume</div>
                </button>
                <button 
                  onClick={() => setIsInterviewPracticeOpen(true)}
                  className="p-4 bg-purple-50 hover:bg-purple-100 dark:bg-purple-900/20 dark:hover:bg-purple-900/30 rounded-lg transition-colors group"
                >
                  <BriefcaseIcon className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <div className="font-medium text-purple-900 dark:text-purple-100">Practice Interview</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Prepare for interviews</div>
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Top Job Roles */}
          <div className="card">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              Top Job Roles for You
              {searchQuery && (
                <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-2">
                  ({filteredJobRoles.length} results)
                </span>
              )}
            </h3>
            <div className="space-y-4">
              {filteredJobRoles.length > 0 ? (
                filteredJobRoles.map((job: JobRole, index: number) => (
                  <div 
                    key={index} 
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                    onClick={() => handleJobRoleClick(job.title)}
                  >
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 dark:text-white">{job.title}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{job.salary}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-primary-600">{job.match}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{job.demand} demand</div>
                    </div>
                  </div>
                ))
              ) : searchQuery ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  No job roles found for "{searchQuery}"
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  No job roles available
                </div>
              )}
            </div>
          </div>

          {/* Recent Activities */}
          <div className="card">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              Recent Activities
              {searchQuery && (
                <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-2">
                  ({filteredActivities.length} results)
                </span>
              )}
            </h3>
            <div className="space-y-4">
              {filteredActivities.length > 0 ? (
                filteredActivities.map((activity: RecentActivity, index: number) => (
                  <div key={index} className="flex items-center space-x-4 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      activity.type === 'quiz' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300' :
                      activity.type === 'resume' ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300' :
                      activity.type === 'interview' ? 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300' :
                      'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                    }`}>
                      {activity.type === 'quiz' && <AcademicCapIcon className="w-5 h-5" />}
                      {activity.type === 'resume' && <DocumentTextIcon className="w-5 h-5" />}
                      {activity.type === 'interview' && <BriefcaseIcon className="w-5 h-5" />}
                      {activity.type === 'insight' && <ChartBarIcon className="w-5 h-5" />}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-white">{activity.title}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{activity.time}</p>
                    </div>
                    {activity.score && (
                      <div className="text-right">
                        <div className="text-sm font-semibold text-primary-600">{activity.score}%</div>
                      </div>
                    )}
                  </div>
                ))
              ) : searchQuery ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  No activities found for "{searchQuery}"
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  No recent activities
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recommendations */}
        {(filteredRecommendations.length > 0 || searchQuery) && (
          <div className="card mb-8">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              🎯 Personalized Recommendations
              {searchQuery && (
                <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-2">
                  ({filteredRecommendations.length} results)
                </span>
              )}
            </h3>
            {filteredRecommendations.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredRecommendations.map((recommendation: string, index: number) => (
                  <div key={index} className="flex items-start space-x-3 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg">
                    <div className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center mt-0.5">
                      <span className="text-xs font-bold text-blue-600 dark:text-blue-300">{index + 1}</span>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{recommendation}</p>
                  </div>
                ))}
              </div>
            ) : searchQuery ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                No recommendations found for "{searchQuery}"
              </div>
            ) : null}
          </div>
        )}

        {/* Quick Actions */}
        <div className="card">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            Quick Actions
            {searchQuery && (
              <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-2">
                ({filteredQuickActions.length} results)
              </span>
            )}
          </h3>
          {filteredQuickActions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredQuickActions.map((action, index) => (
                <button 
                  key={index}
                  onClick={action.action}
                  className={`flex flex-col items-center p-6 rounded-xl transition-colors ${
                    action.name === 'Take Smart Quiz' ? 'bg-primary-50 dark:bg-primary-900/20 hover:bg-primary-100 dark:hover:bg-primary-900/30' :
                    action.name === 'Build Resume' ? 'bg-secondary-50 dark:bg-secondary-900/20 hover:bg-secondary-100 dark:hover:bg-secondary-900/30' :
                    action.name === 'Practice Interview' ? 'bg-accent-50 dark:bg-accent-900/20 hover:bg-accent-100 dark:hover:bg-accent-900/30' :
                    'bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30'
                  }`}
                >
                  {action.name === 'Take Smart Quiz' && <AcademicCapIcon className="w-8 h-8 text-primary-600 mb-2" />}
                  {action.name === 'Build Resume' && <DocumentTextIcon className="w-8 h-8 text-secondary-600 mb-2" />}
                  {action.name === 'Practice Interview' && <BriefcaseIcon className="w-8 h-8 text-accent-600 mb-2" />}
                  {action.name === 'AI Chat' && <ChatBubbleLeftRightIcon className="w-8 h-8 text-green-600 mb-2" />}
                  <span className={`font-semibold ${
                    action.name === 'Take Smart Quiz' ? 'text-primary-600' :
                    action.name === 'Build Resume' ? 'text-secondary-600' :
                    action.name === 'Practice Interview' ? 'text-accent-600' :
                    'text-green-600'
                  }`}>{action.name}</span>
                </button>
              ))}
            </div>
          ) : searchQuery ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No actions found for "{searchQuery}"
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <button 
                onClick={() => setIsQuizSystemOpen(true)}
                className="flex flex-col items-center p-6 bg-primary-50 dark:bg-primary-900/20 hover:bg-primary-100 dark:hover:bg-primary-900/30 rounded-xl transition-colors"
              >
                <AcademicCapIcon className="w-8 h-8 text-primary-600 mb-2" />
                <span className="font-semibold text-primary-600">Take Smart Quiz</span>
              </button>
              
              <button 
                onClick={() => setIsResumeBuilderOpen(true)}
                className="flex flex-col items-center p-6 bg-secondary-50 dark:bg-secondary-900/20 hover:bg-secondary-100 dark:hover:bg-secondary-900/30 rounded-xl transition-colors"
              >
                <DocumentTextIcon className="w-8 h-8 text-secondary-600 mb-2" />
                <span className="font-semibold text-secondary-600">Build Resume</span>
              </button>
              
              <button 
                onClick={() => setIsInterviewPracticeOpen(true)}
                className="flex flex-col items-center p-6 bg-accent-50 dark:bg-accent-900/20 hover:bg-accent-100 dark:hover:bg-accent-900/30 rounded-xl transition-colors"
              >
                <BriefcaseIcon className="w-8 h-8 text-accent-600 mb-2" />
                <span className="font-semibold text-accent-600">Practice Interview</span>
              </button>
              
              <button 
                onClick={() => setIsAIChatOpen(true)}
                className="flex flex-col items-center p-6 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-xl transition-colors"
              >
                <ChatBubbleLeftRightIcon className="w-8 h-8 text-green-600 mb-2" />
                <span className="font-semibold text-green-600">AI Chat</span>
              </button>
            </div>
          )}
        </div>
      </div>

        {/* AI Chat Modal */}
        <AIChat 
          isOpen={isAIChatOpen} 
          onClose={() => setIsAIChatOpen(false)} 
        />

        {/* Resume Builder Modal */}
        <ResumeBuilder 
          isOpen={isResumeBuilderOpen} 
          onClose={() => {
            setIsResumeBuilderOpen(false);
            // Refresh dashboard data when resume is generated
            setTimeout(refreshUserData, 500);
          }}
        />

        {/* Quiz System Modal */}
        <QuizSystem 
          isOpen={isQuizSystemOpen} 
          onClose={() => {
            setIsQuizSystemOpen(false);
            // Refresh dashboard data immediately when quiz modal is closed
            refreshUserData();
          }}
          onQuizCompleted={() => {
            // Immediate refresh when quiz is completed
            console.log('Quiz completed! Refreshing dashboard...');
            refreshUserData();
          }}
        />

        {/* Interview Practice Modal */}
        <InterviewPractice 
          isOpen={isInterviewPracticeOpen} 
          onClose={() => {
            setIsInterviewPracticeOpen(false);
            // Refresh dashboard data when interview is completed
            setTimeout(refreshUserData, 500);
          }}
          onComplete={(score, type) => {
            // Immediate refresh when interview is completed
            refreshUserData();
          }}
        />

        {/* Job Role Details Modal */}
        {isJobRoleModalOpen && selectedJobRole && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                {/* Header */}
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedJobRole.title}</h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">{selectedJobRole.experienceLevel}</p>
                  </div>
                  <button
                    onClick={() => setIsJobRoleModalOpen(false)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Content */}
                <div className="space-y-6">
                  {/* Description */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">About This Role</h3>
                    <p className="text-gray-700 dark:text-gray-300">{selectedJobRole.description}</p>
                  </div>

                  {/* Key Info Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">💰 Average Salary</h4>
                      <p className="text-gray-700 dark:text-gray-300">{selectedJobRole.averageSalary}</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">📈 Growth Outlook</h4>
                      <p className="text-gray-700 dark:text-gray-300">{selectedJobRole.growthOutlook}</p>
                    </div>
                  </div>

                  {/* Responsibilities */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Key Responsibilities</h3>
                    <ul className="space-y-2">
                      {selectedJobRole.responsibilities.map((responsibility, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-primary-600 mr-2">•</span>
                          <span className="text-gray-700 dark:text-gray-300">{responsibility}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Required Skills */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Required Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedJobRole.requiredSkills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200 rounded-full text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Practice Questions */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Practice Questions</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Here are some common interview questions for this role to help you prepare:
                    </p>
                    <div className="space-y-4">
                      {selectedJobRole.practiceQuestions.map((q, index) => (
                        <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
                              {q.type}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded ${
                              q.difficulty === 'Easy' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                              q.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                              'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                            }`}>
                              {q.difficulty}
                            </span>
                          </div>
                          <p className="text-gray-900 dark:text-white">{q.question}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200 dark:border-gray-600">
                    <button
                      onClick={() => {
                        setIsJobRoleModalOpen(false);
                        setIsInterviewPracticeOpen(true);
                      }}
                      className="flex-1 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      Start Interview Practice
                    </button>
                    <button
                      onClick={() => {
                        setIsJobRoleModalOpen(false);
                        setIsQuizSystemOpen(true);
                      }}
                      className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Take Skills Quiz
                    </button>
                    <button
                      onClick={() => {
                        setIsSkillsModalOpen(true);
                      }}
                      className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Relevant Skills
                    </button>
                    <button
                      onClick={() => setIsJobRoleModalOpen(false)}
                      className="flex-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Relevant Skills Modal */}
        {isSkillsModalOpen && selectedJobRole && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                {/* Header */}
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Relevant Skills</h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">For {selectedJobRole.title}</p>
                  </div>
                  <button
                    onClick={() => setIsSkillsModalOpen(false)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Skills Content */}
                <div className="space-y-6">
                  {/* Core Skills */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Core Technical Skills</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedJobRole.requiredSkills.map((skill, index) => (
                        <div key={index} className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-semibold text-blue-900 dark:text-blue-100">{skill}</h4>
                              <p className="text-sm text-blue-700 dark:text-blue-300">Essential for this role</p>
                            </div>
                            <div className="text-blue-600 dark:text-blue-400">
                              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Skill Development Paths */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">How to Develop These Skills</h3>
                    <div className="space-y-4">
                      {selectedJobRole.requiredSkills.slice(0, 3).map((skill, index) => (
                        <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{skill}</h4>
                          <div className="space-y-2">
                            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                              Practice with hands-on projects
                            </div>
                            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                              Take online courses and certifications
                            </div>
                            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                              <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                              Join communities and contribute to open source
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Skills Assessment */}
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">🎯 Skills Assessment</h3>
                    <p className="text-gray-700 dark:text-gray-300 mb-4">
                      Ready to test your knowledge in these areas? Take our role-specific quizzes to assess your current skill level.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={() => {
                          setIsSkillsModalOpen(false);
                          setIsJobRoleModalOpen(false);
                          setIsQuizSystemOpen(true);
                        }}
                        className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
                      >
                        Take Skills Quiz
                      </button>
                      <button
                        onClick={() => {
                          setIsSkillsModalOpen(false);
                          setIsJobRoleModalOpen(false);
                          setIsInterviewPracticeOpen(true);
                        }}
                        className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Practice Interview Questions
                      </button>
                    </div>
                  </div>

                  {/* Close Button */}
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
                    <button
                      onClick={() => setIsSkillsModalOpen(false)}
                      className="w-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        </>
      )}
    </div>
  );
};

export default Dashboard;