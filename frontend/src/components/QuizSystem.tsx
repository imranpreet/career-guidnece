import React, { useState } from 'react';
import {
  XMarkIcon,
  MagnifyingGlassIcon,
  AcademicCapIcon,
  ClockIcon,
  QuestionMarkCircleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowRightIcon,
  BookOpenIcon,
  LightBulbIcon
} from '@heroicons/react/24/outline';

const API_URL = process.env.REACT_APP_API_URL || 'https://career-guidnece-production-d6a5.up.railway.app/api';

interface QuizSystemProps {
  isOpen: boolean;
  onClose: () => void;
  onQuizCompleted?: () => void;
}

interface TopicInfo {
  title: string;
  description: string;
  keyPoints: string[];
  learningOutcomes: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedTime: string;
}

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  category: string;
}

interface QuizResult {
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  feedback: string;
  recommendations: string[];
  timeSpent: string;
}

const QuizSystem: React.FC<QuizSystemProps> = ({ isOpen, onClose, onQuizCompleted }) => {
  const [currentView, setCurrentView] = useState<'search' | 'info' | 'quiz' | 'results'>('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [topicInfo, setTopicInfo] = useState<TopicInfo | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [startTime, setStartTime] = useState<Date | null>(null);
  
  // Get user's primary skill from localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userPrimarySkill = user.primarySkill?.toLowerCase() || '';

  // Mock topic database with enhanced information
  const topicsDatabase = {
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
      learningOutcomes: [
        'Write clean, efficient JavaScript code',
        'Understand closures and prototypes',
        'Handle asynchronous operations effectively',
        'Debug and troubleshoot JavaScript applications'
      ],
      difficulty: 'Intermediate' as const,
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
      learningOutcomes: [
        'Write Pythonic code following best practices',
        'Use Python for automation and scripting',
        'Understand Python\'s object model',
        'Work with popular Python libraries'
      ],
      difficulty: 'Beginner' as const,
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
      learningOutcomes: [
        'Build responsive React applications',
        'Manage application state effectively',
        'Create reusable components',
        'Implement modern React patterns'
      ],
      difficulty: 'Intermediate' as const,
      estimatedTime: '18-25 minutes'
    },
    'java': {
      title: 'Java Programming',
      description: 'Master Java, one of the most popular enterprise programming languages for building robust, scalable applications.',
      keyPoints: [
        'Object-oriented programming concepts',
        'Classes, objects, and inheritance',
        'Exception handling and debugging',
        'Collections framework',
        'Multithreading and concurrency',
        'Java streams and lambda expressions'
      ],
      learningOutcomes: [
        'Write clean, maintainable Java code',
        'Understand OOP principles deeply',
        'Handle exceptions and errors effectively',
        'Work with Java collections and streams'
      ],
      difficulty: 'Intermediate' as const,
      estimatedTime: '15-20 minutes'
    },
    'c++': {
      title: 'C++ Programming',
      description: 'Learn C++, a powerful language for system programming, game development, and high-performance applications.',
      keyPoints: [
        'Pointers and memory management',
        'Object-oriented programming in C++',
        'Templates and generic programming',
        'STL (Standard Template Library)',
        'Move semantics and rvalue references',
        'Performance optimization techniques'
      ],
      learningOutcomes: [
        'Manage memory efficiently',
        'Use STL containers and algorithms',
        'Write high-performance C++ code',
        'Understand modern C++ features'
      ],
      difficulty: 'Advanced' as const,
      estimatedTime: '18-25 minutes'
    },
    'node.js': {
      title: 'Node.js Development',
      description: 'Build scalable server-side applications with Node.js, the JavaScript runtime for backend development.',
      keyPoints: [
        'Event-driven architecture',
        'Asynchronous programming patterns',
        'Express.js framework basics',
        'RESTful API development',
        'Database integration (MongoDB, PostgreSQL)',
        'Authentication and security'
      ],
      learningOutcomes: [
        'Build RESTful APIs with Express',
        'Handle asynchronous operations effectively',
        'Integrate databases with Node.js',
        'Implement authentication systems'
      ],
      difficulty: 'Intermediate' as const,
      estimatedTime: '15-20 minutes'
    },
    'typescript': {
      title: 'TypeScript Development',
      description: 'Add type safety to JavaScript with TypeScript, the typed superset that scales to large applications.',
      keyPoints: [
        'Type annotations and inference',
        'Interfaces and type aliases',
        'Generics and advanced types',
        'Decorators and metadata',
        'TypeScript with React/Node.js',
        'Configuration and tooling'
      ],
      learningOutcomes: [
        'Write type-safe JavaScript code',
        'Use advanced TypeScript features',
        'Integrate TypeScript in projects',
        'Catch errors at compile time'
      ],
      difficulty: 'Intermediate' as const,
      estimatedTime: '15-20 minutes'
    },
    'java-oop': {
      title: 'Java Object-Oriented Programming',
      description: 'Deep dive into OOP concepts in Java including inheritance, polymorphism, and encapsulation.',
      keyPoints: [
        'Classes and objects',
        'Inheritance and super keyword',
        'Polymorphism and method overriding',
        'Encapsulation and access modifiers',
        'Abstract classes and interfaces',
        'Constructor chaining'
      ],
      learningOutcomes: [
        'Design object-oriented solutions',
        'Apply inheritance and polymorphism',
        'Use interfaces effectively',
        'Write maintainable OOP code'
      ],
      difficulty: 'Intermediate' as const,
      estimatedTime: '15-20 minutes'
    },
    'java-collections': {
      title: 'Java Collections Framework',
      description: 'Master Java Collections including List, Set, Map, and their implementations.',
      keyPoints: [
        'List implementations (ArrayList, LinkedList)',
        'Set implementations (HashSet, TreeSet)',
        'Map implementations (HashMap, TreeMap)',
        'Queue and Deque interfaces',
        'Collections utility methods',
        'Comparator and Comparable'
      ],
      learningOutcomes: [
        'Choose the right collection type',
        'Optimize collection performance',
        'Sort and search collections',
        'Use advanced collection features'
      ],
      difficulty: 'Intermediate' as const,
      estimatedTime: '18-22 minutes'
    },
    'java-multithreading': {
      title: 'Java Multithreading',
      description: 'Learn concurrent programming in Java with threads, synchronization, and parallel processing.',
      keyPoints: [
        'Thread creation and lifecycle',
        'Synchronization and locks',
        'Thread pools and ExecutorService',
        'Concurrent collections',
        'CompletableFuture and async programming',
        'Thread safety best practices'
      ],
      learningOutcomes: [
        'Create and manage threads',
        'Handle thread synchronization',
        'Use concurrent utilities',
        'Write thread-safe code'
      ],
      difficulty: 'Advanced' as const,
      estimatedTime: '20-25 minutes'
    },
    'python-basics': {
      title: 'Python Programming Fundamentals',
      description: 'Master Python basics including syntax, data structures, and core programming concepts.',
      keyPoints: [
        'Python syntax and indentation',
        'Data types and variables',
        'Control flow (if, loops)',
        'Functions and lambda expressions',
        'List comprehensions',
        'File handling'
      ],
      learningOutcomes: [
        'Write clean Python code',
        'Use Python data structures',
        'Handle files and exceptions',
        'Apply Pythonic patterns'
      ],
      difficulty: 'Beginner' as const,
      estimatedTime: '15-18 minutes'
    },
    'python-oop': {
      title: 'Python Object-Oriented Programming',
      description: 'Learn OOP concepts in Python including classes, inheritance, and special methods.',
      keyPoints: [
        'Classes and self parameter',
        'Inheritance and super()',
        'Special methods (dunder methods)',
        'Property decorators',
        'Class and static methods',
        'Multiple inheritance'
      ],
      learningOutcomes: [
        'Design Python classes',
        'Use inheritance effectively',
        'Implement special methods',
        'Apply OOP principles'
      ],
      difficulty: 'Intermediate' as const,
      estimatedTime: '18-22 minutes'
    },
    'python-libraries': {
      title: 'Python Libraries & Frameworks',
      description: 'Explore essential Python libraries for data science, web development, and automation.',
      keyPoints: [
        'NumPy for numerical computing',
        'Pandas for data manipulation',
        'Matplotlib for visualization',
        'Flask/Django for web development',
        'Requests for HTTP operations',
        'Virtual environments'
      ],
      learningOutcomes: [
        'Use NumPy and Pandas',
        'Create data visualizations',
        'Build web applications',
        'Manage project dependencies'
      ],
      difficulty: 'Intermediate' as const,
      estimatedTime: '20-25 minutes'
    },
    'c++-oop': {
      title: 'C++ Object-Oriented Programming',
      description: 'Master OOP in C++ including classes, inheritance, virtual functions, and polymorphism.',
      keyPoints: [
        'Classes and objects in C++',
        'Constructors and destructors',
        'Virtual functions and polymorphism',
        'Operator overloading',
        'Friend functions and classes',
        'Multiple inheritance'
      ],
      learningOutcomes: [
        'Design C++ classes',
        'Use polymorphism effectively',
        'Overload operators',
        'Implement inheritance'
      ],
      difficulty: 'Advanced' as const,
      estimatedTime: '20-25 minutes'
    },
    'c++-stl': {
      title: 'C++ Standard Template Library',
      description: 'Learn STL containers, algorithms, and iterators for efficient C++ programming.',
      keyPoints: [
        'STL containers (vector, map, set)',
        'Iterators and their types',
        'STL algorithms (sort, find, transform)',
        'Function objects and lambdas',
        'Smart pointers',
        'Template programming'
      ],
      learningOutcomes: [
        'Use STL containers effectively',
        'Apply STL algorithms',
        'Work with iterators',
        'Write generic code with templates'
      ],
      difficulty: 'Advanced' as const,
      estimatedTime: '22-28 minutes'
    },
    'react-hooks': {
      title: 'React Hooks',
      description: 'Master React Hooks for state management and side effects in functional components.',
      keyPoints: [
        'useState and useEffect',
        'useContext for state sharing',
        'useReducer for complex state',
        'useMemo and useCallback',
        'Custom hooks creation',
        'Hooks best practices'
      ],
      learningOutcomes: [
        'Use React Hooks effectively',
        'Manage component state',
        'Optimize performance',
        'Create reusable custom hooks'
      ],
      difficulty: 'Intermediate' as const,
      estimatedTime: '18-22 minutes'
    },
    'react-advanced': {
      title: 'Advanced React Patterns',
      description: 'Learn advanced React patterns including HOCs, render props, and performance optimization.',
      keyPoints: [
        'Higher-Order Components',
        'Render props pattern',
        'Context API advanced usage',
        'Code splitting and lazy loading',
        'Performance optimization',
        'Error boundaries'
      ],
      learningOutcomes: [
        'Apply advanced React patterns',
        'Optimize React apps',
        'Handle errors gracefully',
        'Structure large applications'
      ],
      difficulty: 'Advanced' as const,
      estimatedTime: '22-28 minutes'
    },
    'node-express': {
      title: 'Express.js Framework',
      description: 'Build robust web servers and APIs with Express.js, the most popular Node.js framework.',
      keyPoints: [
        'Express routing and middleware',
        'Request and response handling',
        'Error handling middleware',
        'Template engines',
        'Session management',
        'Security best practices'
      ],
      learningOutcomes: [
        'Build Express applications',
        'Create RESTful APIs',
        'Handle authentication',
        'Implement middleware'
      ],
      difficulty: 'Intermediate' as const,
      estimatedTime: '18-22 minutes'
    },
    'node-database': {
      title: 'Node.js Database Integration',
      description: 'Connect Node.js applications to databases including MongoDB, PostgreSQL, and MySQL.',
      keyPoints: [
        'MongoDB with Mongoose',
        'PostgreSQL with Sequelize',
        'Database design patterns',
        'CRUD operations',
        'Transactions and migrations',
        'Query optimization'
      ],
      learningOutcomes: [
        'Integrate databases with Node.js',
        'Design database schemas',
        'Perform CRUD operations',
        'Optimize database queries'
      ],
      difficulty: 'Intermediate' as const,
      estimatedTime: '20-25 minutes'
    },
    'typescript-advanced': {
      title: 'Advanced TypeScript',
      description: 'Master advanced TypeScript features including utility types, conditional types, and decorators.',
      keyPoints: [
        'Utility types (Partial, Pick, Omit)',
        'Conditional types',
        'Mapped types',
        'Decorators and metadata',
        'Type guards and assertions',
        'Module augmentation'
      ],
      learningOutcomes: [
        'Use advanced type features',
        'Create utility types',
        'Implement decorators',
        'Write type-safe generic code'
      ],
      difficulty: 'Advanced' as const,
      estimatedTime: '22-28 minutes'
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
      learningOutcomes: [
        'Analyze and interpret data effectively',
        'Create meaningful visualizations',
        'Apply basic machine learning techniques',
        'Make data-driven decisions'
      ],
      difficulty: 'Advanced' as const,
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
      learningOutcomes: [
        'Lead teams effectively',
        'Communicate with clarity and impact',
        'Make informed decisions under pressure',
        'Build and maintain strong relationships'
      ],
      difficulty: 'Intermediate' as const,
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
      learningOutcomes: [
        'Plan and execute projects successfully',
        'Apply Agile methodologies effectively',
        'Manage project risks and changes',
        'Communicate with stakeholders clearly'
      ],
      difficulty: 'Intermediate' as const,
      estimatedTime: '18-25 minutes'
    }
  };

  // Mock questions generator - expanded to 5+ questions per topic
  const generateQuestions = (topic: string): Question[] => {
    const questionTemplates = {
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
          category: 'basics'
        },
        {
          id: 2,
          question: 'Which method is used to add elements to the end of an array?',
          options: ['push()', 'pop()', 'shift()', 'unshift()'],
          correctAnswer: 0,
          explanation: 'push() adds one or more elements to the end of an array and returns the new length.',
          category: 'arrays'
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
          category: 'advanced'
        },
        {
          id: 4,
          question: 'What does the "===" operator do in JavaScript?',
          options: [
            'Assigns a value to a variable',
            'Compares values without type coercion',
            'Compares values with type coercion',
            'Checks if variables are declared'
          ],
          correctAnswer: 1,
          explanation: '=== is the strict equality operator that compares both value and type without type coercion.',
          category: 'operators'
        },
        {
          id: 5,
          question: 'Which method is used to iterate over an array in JavaScript?',
          options: [
            'forEach()',
            'forIn()',
            'iterate()',
            'loop()'
          ],
          correctAnswer: 0,
          explanation: 'forEach() is a method that executes a provided function once for each array element.',
          category: 'arrays'
        },
        {
          id: 6,
          question: 'What is the purpose of the "async/await" syntax?',
          options: [
            'To make code run faster',
            'To handle asynchronous operations in a synchronous-like manner',
            'To create multiple threads',
            'To optimize memory usage'
          ],
          correctAnswer: 1,
          explanation: 'async/await provides a cleaner way to work with Promises, making asynchronous code look more like synchronous code.',
          category: 'async'
        }
      ],
      'python': [
        {
          id: 1,
          question: 'Which of the following is the correct way to create a list in Python?',
          options: ['list = (1, 2, 3)', 'list = [1, 2, 3]', 'list = {1, 2, 3}', 'list = <1, 2, 3>'],
          correctAnswer: 1,
          explanation: 'Square brackets [] are used to create lists in Python.',
          category: 'basics'
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
          category: 'style'
        },
        {
          id: 3,
          question: 'What is the difference between a list and a tuple in Python?',
          options: [
            'Lists are immutable, tuples are mutable',
            'Lists are mutable, tuples are immutable',
            'There is no difference',
            'Lists are faster than tuples'
          ],
          correctAnswer: 1,
          explanation: 'Lists can be modified after creation (mutable), while tuples cannot be modified (immutable).',
          category: 'data-structures'
        },
        {
          id: 4,
          question: 'Which keyword is used to create a function in Python?',
          options: ['function', 'def', 'func', 'define'],
          correctAnswer: 1,
          explanation: 'The "def" keyword is used to define a function in Python.',
          category: 'functions'
        },
        {
          id: 5,
          question: 'What does the "self" parameter represent in Python class methods?',
          options: [
            'A reference to the current instance of the class',
            'A reference to the class itself',
            'A built-in Python function',
            'A private variable'
          ],
          correctAnswer: 0,
          explanation: '"self" represents the instance of the class and is used to access instance variables and methods.',
          category: 'oop'
        },
        {
          id: 6,
          question: 'How do you handle exceptions in Python?',
          options: [
            'Using if-else statements',
            'Using try-except blocks',
            'Using switch-case statements',
            'Using error() function'
          ],
          correctAnswer: 1,
          explanation: 'Python uses try-except blocks to catch and handle exceptions.',
          category: 'error-handling'
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
          category: 'basics'
        },
        {
          id: 2,
          question: 'Which hook is used for managing state in functional components?',
          options: ['useEffect', 'useState', 'useContext', 'useReducer'],
          correctAnswer: 1,
          explanation: 'useState is the primary hook for managing state in functional React components.',
          category: 'hooks'
        },
        {
          id: 3,
          question: 'What is the Virtual DOM in React?',
          options: [
            'A real DOM that React uses',
            'A lightweight copy of the actual DOM',
            'A database for storing components',
            'A testing tool for React'
          ],
          correctAnswer: 1,
          explanation: 'Virtual DOM is a lightweight representation of the actual DOM that React uses for efficient updates.',
          category: 'concepts'
        },
        {
          id: 4,
          question: 'What is the purpose of useEffect hook?',
          options: [
            'To manage component state',
            'To perform side effects in functional components',
            'To create context',
            'To handle events'
          ],
          correctAnswer: 1,
          explanation: 'useEffect is used to perform side effects like data fetching, subscriptions, or manually changing the DOM.',
          category: 'hooks'
        },
        {
          id: 5,
          question: 'How do you pass data from a parent component to a child component?',
          options: [
            'Using state',
            'Using props',
            'Using context',
            'Using refs'
          ],
          correctAnswer: 1,
          explanation: 'Props are used to pass data from parent components to child components in React.',
          category: 'props'
        },
        {
          id: 6,
          question: 'What is React Router used for?',
          options: [
            'State management',
            'Navigation between different pages/views',
            'API calls',
            'Component styling'
          ],
          correctAnswer: 1,
          explanation: 'React Router is a library for handling navigation and routing in React applications.',
          category: 'routing'
        }
      ],
      'java': [
        {
          id: 1,
          question: 'What is the difference between JDK, JRE, and JVM?',
          options: [
            'They are all the same thing',
            'JDK includes JRE and JVM; JRE includes JVM',
            'JVM includes JRE and JDK',
            'JRE is for development, JDK is for running programs'
          ],
          correctAnswer: 1,
          explanation: 'JDK (Java Development Kit) contains tools for development and includes JRE. JRE (Java Runtime Environment) includes JVM and libraries needed to run Java programs. JVM (Java Virtual Machine) executes Java bytecode.',
          category: 'basics'
        },
        {
          id: 2,
          question: 'Which keyword is used to inherit a class in Java?',
          options: ['inherits', 'extends', 'implements', 'super'],
          correctAnswer: 1,
          explanation: 'The "extends" keyword is used for class inheritance in Java.',
          category: 'oop'
        },
        {
          id: 3,
          question: 'What is the difference between == and equals() in Java?',
          options: [
            'They are exactly the same',
            '== compares references, equals() compares content',
            '== compares content, equals() compares references',
            'equals() is faster than =='
          ],
          correctAnswer: 1,
          explanation: '== compares object references (memory addresses), while equals() compares the actual content of objects.',
          category: 'comparison'
        },
        {
          id: 4,
          question: 'What is a constructor in Java?',
          options: [
            'A method that destroys objects',
            'A special method used to initialize objects',
            'A method that constructs buildings',
            'A keyword for creating variables'
          ],
          correctAnswer: 1,
          explanation: 'A constructor is a special method that is called when an object is instantiated, used to initialize the object.',
          category: 'oop'
        },
        {
          id: 5,
          question: 'Which collection allows duplicate elements in Java?',
          options: [
            'Set',
            'HashSet',
            'ArrayList',
            'Map'
          ],
          correctAnswer: 2,
          explanation: 'ArrayList allows duplicate elements. Sets do not allow duplicates.',
          category: 'collections'
        },
        {
          id: 6,
          question: 'What is the purpose of the "final" keyword in Java?',
          options: [
            'To delete variables',
            'To make variables, methods, or classes unchangeable',
            'To finalize the program',
            'To create final exams'
          ],
          correctAnswer: 1,
          explanation: 'The "final" keyword prevents variables from being reassigned, methods from being overridden, and classes from being inherited.',
          category: 'keywords'
        }
      ],
      'c++': [
        {
          id: 1,
          question: 'What is a pointer in C++?',
          options: [
            'A variable that points to the sky',
            'A variable that stores the memory address of another variable',
            'A function that points to errors',
            'A data type for decimals'
          ],
          correctAnswer: 1,
          explanation: 'A pointer is a variable that stores the memory address of another variable.',
          category: 'pointers'
        },
        {
          id: 2,
          question: 'What is the difference between new and malloc?',
          options: [
            'There is no difference',
            'new is a C++ operator and calls constructors, malloc is a C function and does not',
            'malloc is faster than new',
            'new is deprecated'
          ],
          correctAnswer: 1,
          explanation: 'new is a C++ operator that allocates memory and calls the constructor, while malloc is a C function that only allocates memory.',
          category: 'memory'
        },
        {
          id: 3,
          question: 'What is a virtual function in C++?',
          options: [
            'A function that does not exist',
            'A function that enables runtime polymorphism',
            'A function in virtual reality',
            'A deprecated function'
          ],
          correctAnswer: 1,
          explanation: 'A virtual function is a member function that can be overridden in derived classes, enabling runtime polymorphism.',
          category: 'oop'
        },
        {
          id: 4,
          question: 'What does RAII stand for in C++?',
          options: [
            'Random Access Iteration Interface',
            'Resource Acquisition Is Initialization',
            'Runtime Allocation and Initialization',
            'Reference And Instance Interface'
          ],
          correctAnswer: 1,
          explanation: 'RAII (Resource Acquisition Is Initialization) is a C++ programming idiom that ties resource management to object lifetime.',
          category: 'concepts'
        },
        {
          id: 5,
          question: 'What is the STL in C++?',
          options: [
            'Standard Template Library',
            'Super Template Language',
            'System Tool Library',
            'Static Type Library'
          ],
          correctAnswer: 0,
          explanation: 'STL (Standard Template Library) is a collection of C++ template classes providing common data structures and algorithms.',
          category: 'stl'
        }
      ],
      'node.js': [
        {
          id: 1,
          question: 'What is Node.js built on?',
          options: [
            'Python runtime',
            'V8 JavaScript engine',
            'Java Virtual Machine',
            '.NET Framework'
          ],
          correctAnswer: 1,
          explanation: 'Node.js is built on Chrome\'s V8 JavaScript engine, allowing JavaScript to run server-side.',
          category: 'basics'
        },
        {
          id: 2,
          question: 'What is npm?',
          options: [
            'Node Package Manager',
            'New Programming Method',
            'Network Protocol Manager',
            'Node Performance Monitor'
          ],
          correctAnswer: 0,
          explanation: 'npm (Node Package Manager) is the default package manager for Node.js.',
          category: 'tools'
        },
        {
          id: 3,
          question: 'What is the purpose of the package.json file?',
          options: [
            'To store user data',
            'To manage project dependencies and metadata',
            'To configure the database',
            'To style the application'
          ],
          correctAnswer: 1,
          explanation: 'package.json contains metadata about the project and manages dependencies.',
          category: 'configuration'
        },
        {
          id: 4,
          question: 'What is Express.js?',
          options: [
            'A database',
            'A web application framework for Node.js',
            'A front-end library',
            'A testing tool'
          ],
          correctAnswer: 1,
          explanation: 'Express.js is a minimal and flexible Node.js web application framework.',
          category: 'frameworks'
        },
        {
          id: 5,
          question: 'How does Node.js handle concurrency?',
          options: [
            'Using multiple threads',
            'Using event loop and non-blocking I/O',
            'Using multiple processes only',
            'It does not support concurrency'
          ],
          correctAnswer: 1,
          explanation: 'Node.js uses an event-driven, non-blocking I/O model with an event loop to handle concurrency efficiently.',
          category: 'concurrency'
        }
      ],
      'typescript': [
        {
          id: 1,
          question: 'What is TypeScript?',
          options: [
            'A new programming language',
            'A typed superset of JavaScript',
            'A JavaScript framework',
            'A CSS preprocessor'
          ],
          correctAnswer: 1,
          explanation: 'TypeScript is a typed superset of JavaScript that compiles to plain JavaScript.',
          category: 'basics'
        },
        {
          id: 2,
          question: 'What is the purpose of interfaces in TypeScript?',
          options: [
            'To create animations',
            'To define the structure of an object',
            'To connect to databases',
            'To style components'
          ],
          correctAnswer: 1,
          explanation: 'Interfaces define the structure and shape of objects, providing type checking.',
          category: 'types'
        },
        {
          id: 3,
          question: 'What does the "any" type mean in TypeScript?',
          options: [
            'It represents any number',
            'It disables type checking for that variable',
            'It only accepts strings',
            'It is an error type'
          ],
          correctAnswer: 1,
          explanation: 'The "any" type opts out of type checking, allowing any value to be assigned.',
          category: 'types'
        },
        {
          id: 4,
          question: 'What is a generic in TypeScript?',
          options: [
            'A general variable',
            'A way to create reusable components that work with multiple types',
            'A type of function',
            'A styling method'
          ],
          correctAnswer: 1,
          explanation: 'Generics allow you to create reusable components that can work with multiple types while maintaining type safety.',
          category: 'generics'
        },
        {
          id: 5,
          question: 'How do you compile TypeScript code?',
          options: [
            'It runs directly in browsers',
            'Using the TypeScript compiler (tsc)',
            'Using Node.js only',
            'It does not need compilation'
          ],
          correctAnswer: 1,
          explanation: 'TypeScript code is compiled to JavaScript using the TypeScript compiler (tsc).',
          category: 'compilation'
        }
      ],
      'java-oop': [
        {
          id: 1,
          question: 'What is encapsulation in Java?',
          options: [
            'Hiding implementation details',
            'Creating multiple classes',
            'Using loops',
            'Importing packages'
          ],
          correctAnswer: 0,
          explanation: 'Encapsulation is the bundling of data and methods that operate on that data within a class, hiding internal details.',
          category: 'oop'
        },
        {
          id: 2,
          question: 'What is the difference between abstract class and interface?',
          options: [
            'No difference',
            'Abstract class can have implementation, interface cannot (before Java 8)',
            'Interface is faster',
            'Abstract class is deprecated'
          ],
          correctAnswer: 1,
          explanation: 'Abstract classes can have concrete methods, while interfaces (before Java 8) could only have abstract methods.',
          category: 'oop'
        },
        {
          id: 3,
          question: 'What is polymorphism in Java?',
          options: [
            'Having many forms',
            'Using multiple classes',
            'The ability of objects to take many forms',
            'Creating loops'
          ],
          correctAnswer: 2,
          explanation: 'Polymorphism allows objects of different classes to be treated as objects of a common superclass.',
          category: 'oop'
        },
        {
          id: 4,
          question: 'What is method overriding?',
          options: [
            'Creating new methods',
            'Redefining a parent class method in child class',
            'Deleting methods',
            'Calling methods'
          ],
          correctAnswer: 1,
          explanation: 'Method overriding allows a subclass to provide a specific implementation of a method already defined in its superclass.',
          category: 'oop'
        },
        {
          id: 5,
          question: 'What is the purpose of "super" keyword?',
          options: [
            'To make methods super fast',
            'To refer to parent class members',
            'To create superheroes',
            'To delete variables'
          ],
          correctAnswer: 1,
          explanation: 'The super keyword is used to access parent class constructors, methods, and fields.',
          category: 'oop'
        }
      ],
      'java-collections': [
        {
          id: 1,
          question: 'What is the difference between ArrayList and LinkedList?',
          options: [
            'No difference',
            'ArrayList uses array, LinkedList uses doubly-linked nodes',
            'LinkedList is always faster',
            'ArrayList is deprecated'
          ],
          correctAnswer: 1,
          explanation: 'ArrayList is backed by a dynamic array, while LinkedList uses a doubly-linked list structure.',
          category: 'collections'
        },
        {
          id: 2,
          question: 'Which collection does not allow duplicate elements?',
          options: [
            'ArrayList',
            'LinkedList',
            'HashSet',
            'Vector'
          ],
          correctAnswer: 2,
          explanation: 'HashSet implements the Set interface and does not allow duplicate elements.',
          category: 'collections'
        },
        {
          id: 3,
          question: 'What is a HashMap in Java?',
          options: [
            'A type of array',
            'A key-value pair collection',
            'A sorting algorithm',
            'A loop structure'
          ],
          correctAnswer: 1,
          explanation: 'HashMap stores elements as key-value pairs and allows fast retrieval based on keys.',
          category: 'collections'
        },
        {
          id: 4,
          question: 'What is the time complexity of get() in HashMap?',
          options: [
            'O(n)',
            'O(log n)',
            'O(1) average case',
            'O(n²)'
          ],
          correctAnswer: 2,
          explanation: 'HashMap provides O(1) average-case time complexity for get() operations using hashing.',
          category: 'collections'
        },
        {
          id: 5,
          question: 'What is the difference between Comparable and Comparator?',
          options: [
            'No difference',
            'Comparable is for natural ordering, Comparator for custom ordering',
            'Comparator is deprecated',
            'Comparable is faster'
          ],
          correctAnswer: 1,
          explanation: 'Comparable defines natural ordering within the class, while Comparator provides external custom ordering logic.',
          category: 'collections'
        }
      ],
      'java-multithreading': [
        {
          id: 1,
          question: 'How can you create a thread in Java?',
          options: [
            'Only by extending Thread class',
            'Extending Thread or implementing Runnable',
            'Using loops',
            'Using if statements'
          ],
          correctAnswer: 1,
          explanation: 'Threads can be created by extending the Thread class or implementing the Runnable interface.',
          category: 'threads'
        },
        {
          id: 2,
          question: 'What is synchronization in Java?',
          options: [
            'Running threads at the same time',
            'Controlling access to shared resources',
            'Starting threads',
            'Stopping threads'
          ],
          correctAnswer: 1,
          explanation: 'Synchronization controls the access of multiple threads to shared resources to prevent data inconsistency.',
          category: 'threads'
        },
        {
          id: 3,
          question: 'What is a deadlock?',
          options: [
            'A stopped thread',
            'When threads wait for each other indefinitely',
            'A fast thread',
            'A deleted thread'
          ],
          correctAnswer: 1,
          explanation: 'Deadlock occurs when two or more threads are blocked forever, waiting for each other to release locks.',
          category: 'threads'
        },
        {
          id: 4,
          question: 'What is the purpose of ExecutorService?',
          options: [
            'To delete threads',
            'To manage thread pools',
            'To stop programs',
            'To create variables'
          ],
          correctAnswer: 1,
          explanation: 'ExecutorService provides a high-level API for managing thread pools and executing tasks asynchronously.',
          category: 'threads'
        },
        {
          id: 5,
          question: 'What is a volatile keyword used for?',
          options: [
            'To make variables explode',
            'To ensure visibility of changes across threads',
            'To delete variables',
            'To speed up threads'
          ],
          correctAnswer: 1,
          explanation: 'The volatile keyword ensures that changes to a variable are immediately visible to all threads.',
          category: 'threads'
        }
      ],
      'python-basics': [
        {
          id: 1,
          question: 'What is the correct way to create a function in Python?',
          options: [
            'function myFunc()',
            'def myFunc():',
            'create myFunc()',
            'func myFunc()'
          ],
          correctAnswer: 1,
          explanation: 'Functions in Python are defined using the def keyword followed by function name and colon.',
          category: 'syntax'
        },
        {
          id: 2,
          question: 'What is a list comprehension in Python?',
          options: [
            'A way to delete lists',
            'A concise way to create lists',
            'A type of loop',
            'A function'
          ],
          correctAnswer: 1,
          explanation: 'List comprehensions provide a concise way to create lists based on existing lists or iterables.',
          category: 'data-structures'
        },
        {
          id: 3,
          question: 'What is the difference between list and tuple?',
          options: [
            'No difference',
            'Lists are mutable, tuples are immutable',
            'Tuples are faster for all operations',
            'Lists are deprecated'
          ],
          correctAnswer: 1,
          explanation: 'Lists are mutable (can be changed), while tuples are immutable (cannot be changed after creation).',
          category: 'data-structures'
        },
        {
          id: 4,
          question: 'What does "PEP 8" refer to?',
          options: [
            'A Python version',
            'Python style guide',
            'A Python library',
            'A data type'
          ],
          correctAnswer: 1,
          explanation: 'PEP 8 is the official Python style guide for writing clean and readable code.',
          category: 'best-practices'
        },
        {
          id: 5,
          question: 'What is a lambda function?',
          options: [
            'A Greek letter',
            'An anonymous function',
            'A loop type',
            'A variable type'
          ],
          correctAnswer: 1,
          explanation: 'Lambda functions are small anonymous functions defined with the lambda keyword.',
          category: 'functions'
        }
      ],
      'python-oop': [
        {
          id: 1,
          question: 'What is "__init__" in Python?',
          options: [
            'A loop',
            'A constructor method',
            'A variable',
            'A library'
          ],
          correctAnswer: 1,
          explanation: '__init__ is a special method (constructor) called when creating a new instance of a class.',
          category: 'oop'
        },
        {
          id: 2,
          question: 'What is "self" in Python classes?',
          options: [
            'A keyword for loops',
            'Reference to the instance of the class',
            'A data type',
            'A library'
          ],
          correctAnswer: 1,
          explanation: 'self refers to the instance of the class and is used to access instance variables and methods.',
          category: 'oop'
        },
        {
          id: 3,
          question: 'What is inheritance in Python?',
          options: [
            'Copying code',
            'A class deriving properties from another class',
            'Deleting classes',
            'Creating variables'
          ],
          correctAnswer: 1,
          explanation: 'Inheritance allows a class to inherit attributes and methods from another class.',
          category: 'oop'
        },
        {
          id: 4,
          question: 'What are dunder methods?',
          options: [
            'Regular methods',
            'Special methods with double underscores',
            'Deleted methods',
            'Fast methods'
          ],
          correctAnswer: 1,
          explanation: 'Dunder methods (double underscore) are special methods like __init__, __str__, __repr__ that Python calls automatically.',
          category: 'oop'
        },
        {
          id: 5,
          question: 'What is the @property decorator used for?',
          options: [
            'To delete properties',
            'To create getter methods',
            'To create loops',
            'To import libraries'
          ],
          correctAnswer: 1,
          explanation: 'The @property decorator allows you to define methods that can be accessed like attributes.',
          category: 'oop'
        }
      ],
      'python-libraries': [
        {
          id: 1,
          question: 'What is NumPy used for?',
          options: [
            'Web development',
            'Numerical computing and arrays',
            'Creating games',
            'File management'
          ],
          correctAnswer: 1,
          explanation: 'NumPy is a library for numerical computing, providing support for large, multi-dimensional arrays and matrices.',
          category: 'libraries'
        },
        {
          id: 2,
          question: 'What is Pandas used for?',
          options: [
            'Animal research',
            'Data manipulation and analysis',
            'Web scraping only',
            'Gaming'
          ],
          correctAnswer: 1,
          explanation: 'Pandas provides data structures and tools for data manipulation and analysis, especially with DataFrames.',
          category: 'libraries'
        },
        {
          id: 3,
          question: 'What is Flask?',
          options: [
            'A data type',
            'A lightweight web framework',
            'A database',
            'A testing tool'
          ],
          correctAnswer: 1,
          explanation: 'Flask is a lightweight WSGI web application framework for building web applications in Python.',
          category: 'libraries'
        },
        {
          id: 4,
          question: 'What is pip in Python?',
          options: [
            'A data type',
            'Package installer for Python',
            'A loop structure',
            'A function'
          ],
          correctAnswer: 1,
          explanation: 'pip is the package installer for Python, used to install and manage software packages.',
          category: 'tools'
        },
        {
          id: 5,
          question: 'What is a virtual environment?',
          options: [
            'A VR game',
            'Isolated Python environment for projects',
            'A cloud service',
            'A data structure'
          ],
          correctAnswer: 1,
          explanation: 'Virtual environments allow you to create isolated Python environments for different projects with separate dependencies.',
          category: 'tools'
        }
      ],
      'c++-oop': [
        {
          id: 1,
          question: 'What is a constructor in C++?',
          options: [
            'A function that destroys objects',
            'A special member function for initialization',
            'A loop structure',
            'A variable type'
          ],
          correctAnswer: 1,
          explanation: 'A constructor is a special member function that initializes objects when they are created.',
          category: 'oop'
        },
        {
          id: 2,
          question: 'What is a destructor in C++?',
          options: [
            'Creates objects',
            'Cleans up when object is destroyed',
            'A loop',
            'An operator'
          ],
          correctAnswer: 1,
          explanation: 'A destructor is called when an object is destroyed to release resources and perform cleanup.',
          category: 'oop'
        },
        {
          id: 3,
          question: 'What is operator overloading?',
          options: [
            'Creating too many operators',
            'Defining custom behavior for operators',
            'Deleting operators',
            'A syntax error'
          ],
          correctAnswer: 1,
          explanation: 'Operator overloading allows you to redefine the behavior of operators for user-defined types.',
          category: 'oop'
        },
        {
          id: 4,
          question: 'What is a friend function?',
          options: [
            'A social function',
            'A function that can access private members',
            'A deprecated function',
            'A loop'
          ],
          correctAnswer: 1,
          explanation: 'Friend functions can access private and protected members of a class despite not being members themselves.',
          category: 'oop'
        },
        {
          id: 5,
          question: 'What is multiple inheritance in C++?',
          options: [
            'Inheriting multiple times',
            'A class inheriting from multiple base classes',
            'Creating multiple classes',
            'A syntax error'
          ],
          correctAnswer: 1,
          explanation: 'Multiple inheritance allows a class to inherit from more than one base class.',
          category: 'oop'
        }
      ],
      'c++-stl': [
        {
          id: 1,
          question: 'What is a vector in C++ STL?',
          options: [
            'A math concept',
            'A dynamic array container',
            'A pointer',
            'A loop'
          ],
          correctAnswer: 1,
          explanation: 'Vector is a dynamic array container that can grow and shrink in size automatically.',
          category: 'stl'
        },
        {
          id: 2,
          question: 'What is the difference between map and unordered_map?',
          options: [
            'No difference',
            'map is sorted, unordered_map uses hashing',
            'unordered_map is deprecated',
            'map is faster'
          ],
          correctAnswer: 1,
          explanation: 'map stores elements in sorted order using a tree structure, while unordered_map uses hashing for faster access.',
          category: 'stl'
        },
        {
          id: 3,
          question: 'What is an iterator in C++ STL?',
          options: [
            'A loop',
            'An object to traverse containers',
            'A function',
            'A variable'
          ],
          correctAnswer: 1,
          explanation: 'Iterators are objects that point to elements in containers and allow traversal through them.',
          category: 'stl'
        },
        {
          id: 4,
          question: 'What is std::sort() used for?',
          options: [
            'Creating arrays',
            'Sorting elements in a range',
            'Deleting elements',
            'Finding elements'
          ],
          correctAnswer: 1,
          explanation: 'std::sort() is an STL algorithm that sorts elements in a specified range.',
          category: 'stl'
        },
        {
          id: 5,
          question: 'What are smart pointers?',
          options: [
            'Fast pointers',
            'RAII-based automatic memory management pointers',
            'Intelligent AI',
            'A data type'
          ],
          correctAnswer: 1,
          explanation: 'Smart pointers (unique_ptr, shared_ptr, weak_ptr) manage memory automatically using RAII principles.',
          category: 'stl'
        }
      ],
      'react-hooks': [
        {
          id: 1,
          question: 'What is the purpose of useState hook?',
          options: [
            'To delete state',
            'To add state to functional components',
            'To style components',
            'To fetch data'
          ],
          correctAnswer: 1,
          explanation: 'useState allows you to add state management to functional components.',
          category: 'hooks'
        },
        {
          id: 2,
          question: 'When does useEffect run?',
          options: [
            'Only once',
            'After every render by default',
            'Never',
            'Before render'
          ],
          correctAnswer: 1,
          explanation: 'useEffect runs after every render by default, but can be controlled with dependency array.',
          category: 'hooks'
        },
        {
          id: 3,
          question: 'What is useContext used for?',
          options: [
            'Creating contexts',
            'Consuming context values',
            'Deleting contexts',
            'Styling'
          ],
          correctAnswer: 1,
          explanation: 'useContext allows you to consume values from React Context without wrapping components.',
          category: 'hooks'
        },
        {
          id: 4,
          question: 'What is useMemo used for?',
          options: [
            'Creating memos',
            'Memoizing expensive calculations',
            'Deleting memory',
            'Styling'
          ],
          correctAnswer: 1,
          explanation: 'useMemo memoizes the result of expensive calculations to optimize performance.',
          category: 'hooks'
        },
        {
          id: 5,
          question: 'What is the difference between useMemo and useCallback?',
          options: [
            'No difference',
            'useMemo returns value, useCallback returns function',
            'useCallback is deprecated',
            'useMemo is faster'
          ],
          correctAnswer: 1,
          explanation: 'useMemo memoizes a computed value, while useCallback memoizes a function definition.',
          category: 'hooks'
        }
      ],
      'react-advanced': [
        {
          id: 1,
          question: 'What is a Higher-Order Component (HOC)?',
          options: [
            'A component at the top',
            'A function that takes a component and returns a new component',
            'A fast component',
            'A deleted component'
          ],
          correctAnswer: 1,
          explanation: 'HOCs are functions that take a component and return a new enhanced component.',
          category: 'patterns'
        },
        {
          id: 2,
          question: 'What is code splitting?',
          options: [
            'Breaking code randomly',
            'Dividing code into smaller chunks loaded on demand',
            'Deleting code',
            'Copying code'
          ],
          correctAnswer: 1,
          explanation: 'Code splitting divides your app into smaller chunks that can be loaded on demand to improve performance.',
          category: 'optimization'
        },
        {
          id: 3,
          question: 'What is React.lazy() used for?',
          options: [
            'Making components slow',
            'Lazy loading components',
            'Deleting components',
            'Styling'
          ],
          correctAnswer: 1,
          explanation: 'React.lazy() enables lazy loading of components, loading them only when needed.',
          category: 'optimization'
        },
        {
          id: 4,
          question: 'What is an Error Boundary?',
          options: [
            'A syntax error',
            'A component that catches JavaScript errors',
            'A boundary line',
            'A style property'
          ],
          correctAnswer: 1,
          explanation: 'Error Boundaries catch JavaScript errors in their child component tree and display fallback UI.',
          category: 'error-handling'
        },
        {
          id: 5,
          question: 'What is the render props pattern?',
          options: [
            'Styling components',
            'Sharing code using a prop whose value is a function',
            'Rendering fast',
            'Deleting props'
          ],
          correctAnswer: 1,
          explanation: 'Render props is a pattern for sharing code between components using a prop whose value is a function.',
          category: 'patterns'
        }
      ],
      'node-express': [
        {
          id: 1,
          question: 'What is middleware in Express?',
          options: [
            'Software in the middle',
            'Functions that have access to request and response objects',
            'A database',
            'A frontend library'
          ],
          correctAnswer: 1,
          explanation: 'Middleware functions have access to request and response objects and can modify them or end the request-response cycle.',
          category: 'middleware'
        },
        {
          id: 2,
          question: 'How do you define a GET route in Express?',
          options: [
            'app.get(\'/path\', handler)',
            'app.route(\'/path\')',
            'app.create(\'/path\')',
            'app.fetch(\'/path\')'
          ],
          correctAnswer: 0,
          explanation: 'app.get() defines a route that handles GET requests to a specified path.',
          category: 'routing'
        },
        {
          id: 3,
          question: 'What is app.use() in Express?',
          options: [
            'To use apps',
            'To mount middleware functions',
            'To delete routes',
            'To style apps'
          ],
          correctAnswer: 1,
          explanation: 'app.use() mounts middleware functions at a specified path or globally.',
          category: 'middleware'
        },
        {
          id: 4,
          question: 'What is req.params in Express?',
          options: [
            'Request body',
            'Route parameters from URL',
            'Query string',
            'Request headers'
          ],
          correctAnswer: 1,
          explanation: 'req.params contains route parameters (named URL segments).',
          category: 'routing'
        },
        {
          id: 5,
          question: 'What is the purpose of next() in middleware?',
          options: [
            'To go to next page',
            'To pass control to next middleware',
            'To delete middleware',
            'To refresh page'
          ],
          correctAnswer: 1,
          explanation: 'next() passes control to the next middleware function in the stack.',
          category: 'middleware'
        }
      ],
      'node-database': [
        {
          id: 1,
          question: 'What is Mongoose?',
          options: [
            'An animal',
            'MongoDB ODM for Node.js',
            'A database',
            'A frontend library'
          ],
          correctAnswer: 1,
          explanation: 'Mongoose is an Object Data Modeling (ODM) library for MongoDB and Node.js.',
          category: 'database'
        },
        {
          id: 2,
          question: 'What is a schema in Mongoose?',
          options: [
            'A diagram',
            'A structure definition for documents',
            'A query',
            'A function'
          ],
          correctAnswer: 1,
          explanation: 'A schema defines the structure of documents within a collection in MongoDB.',
          category: 'database'
        },
        {
          id: 3,
          question: 'What does CRUD stand for?',
          options: [
            'Create Read Update Delete',
            'Copy Run Update Deploy',
            'Create Remove Upload Download',
            'Connect Read Use Delete'
          ],
          correctAnswer: 0,
          explanation: 'CRUD represents the four basic operations: Create, Read, Update, and Delete.',
          category: 'database'
        },
        {
          id: 4,
          question: 'What is SQL injection?',
          options: [
            'A medical procedure',
            'A security vulnerability from unsanitized input',
            'A database feature',
            'A fast query'
          ],
          correctAnswer: 1,
          explanation: 'SQL injection is a security vulnerability where malicious SQL code is inserted through user input.',
          category: 'security'
        },
        {
          id: 5,
          question: 'What is indexing in databases?',
          options: [
            'Numbering rows',
            'Creating structures for faster queries',
            'Deleting data',
            'Copying data'
          ],
          correctAnswer: 1,
          explanation: 'Indexing creates data structures that improve the speed of data retrieval operations.',
          category: 'optimization'
        }
      ],
      'typescript-advanced': [
        {
          id: 1,
          question: 'What is a utility type in TypeScript?',
          options: [
            'A useful type',
            'Built-in type transformations like Partial, Pick',
            'A deleted type',
            'A function type'
          ],
          correctAnswer: 1,
          explanation: 'Utility types are built-in TypeScript types that facilitate common type transformations.',
          category: 'types'
        },
        {
          id: 2,
          question: 'What does Partial<T> do?',
          options: [
            'Deletes type',
            'Makes all properties of T optional',
            'Makes type partial',
            'Creates arrays'
          ],
          correctAnswer: 1,
          explanation: 'Partial<T> constructs a type with all properties of T set to optional.',
          category: 'types'
        },
        {
          id: 3,
          question: 'What is a conditional type?',
          options: [
            'A type with conditions',
            'A type that depends on a condition, like T extends U ? X : Y',
            'An if statement',
            'A loop'
          ],
          correctAnswer: 1,
          explanation: 'Conditional types select one of two possible types based on a condition expressed as a type relationship test.',
          category: 'types'
        },
        {
          id: 4,
          question: 'What is a mapped type?',
          options: [
            'A GPS type',
            'A type that transforms properties of another type',
            'A deleted type',
            'An array'
          ],
          correctAnswer: 1,
          explanation: 'Mapped types create new types by transforming properties of an existing type.',
          category: 'types'
        },
        {
          id: 5,
          question: 'What is a decorator in TypeScript?',
          options: [
            'A decoration',
            'A special declaration that can modify classes or members',
            'A function',
            'A variable'
          ],
          correctAnswer: 1,
          explanation: 'Decorators are special declarations that can be attached to classes, methods, or properties to modify their behavior.',
          category: 'decorators'
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
          category: 'communication'
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
          category: 'styles'
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
          category: 'emotional-intelligence'
        },
        {
          id: 4,
          question: 'What is the primary goal of transformational leadership?',
          options: [
            'Maintaining the status quo',
            'Inspiring and motivating team members to exceed expectations',
            'Controlling all aspects of work',
            'Minimizing team interaction'
          ],
          correctAnswer: 1,
          explanation: 'Transformational leadership focuses on inspiring and motivating people to achieve exceptional outcomes.',
          category: 'transformation'
        },
        {
          id: 5,
          question: 'How should a leader handle conflict within a team?',
          options: [
            'Ignore it and hope it resolves itself',
            'Address it directly with empathy and fairness',
            'Take sides with the stronger party',
            'Remove all conflicting parties'
          ],
          correctAnswer: 1,
          explanation: 'Effective leaders address conflicts directly with empathy, listening to all parties and finding fair solutions.',
          category: 'conflict-resolution'
        }
      ],
      'data-science': [
        {
          id: 1,
          question: 'What is the purpose of data normalization?',
          options: [
            'To delete outliers',
            'To scale features to a similar range',
            'To increase data size',
            'To remove duplicates'
          ],
          correctAnswer: 1,
          explanation: 'Data normalization scales numerical features to a similar range, improving model performance.',
          category: 'preprocessing'
        },
        {
          id: 2,
          question: 'Which metric is commonly used to evaluate classification models?',
          options: [
            'Mean Squared Error',
            'R-squared',
            'Accuracy, Precision, Recall',
            'Standard Deviation'
          ],
          correctAnswer: 2,
          explanation: 'Accuracy, Precision, and Recall are key metrics for evaluating classification model performance.',
          category: 'evaluation'
        },
        {
          id: 3,
          question: 'What is overfitting in machine learning?',
          options: [
            'When a model performs well on training data but poorly on new data',
            'When a model is too simple',
            'When there is too much data',
            'When the model trains too fast'
          ],
          correctAnswer: 0,
          explanation: 'Overfitting occurs when a model learns the training data too well, including noise, and fails to generalize.',
          category: 'ml-concepts'
        },
        {
          id: 4,
          question: 'What is the purpose of train-test split?',
          options: [
            'To speed up training',
            'To evaluate model performance on unseen data',
            'To increase dataset size',
            'To remove outliers'
          ],
          correctAnswer: 1,
          explanation: 'Train-test split separates data to train the model on one set and evaluate it on another unseen set.',
          category: 'validation'
        },
        {
          id: 5,
          question: 'Which visualization library is most popular in Python?',
          options: [
            'Plotly',
            'Matplotlib',
            'Seaborn',
            'Bokeh'
          ],
          correctAnswer: 1,
          explanation: 'Matplotlib is the most widely used plotting library in Python for data visualization.',
          category: 'visualization'
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
          category: 'planning'
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
          category: 'agile'
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
          category: 'scheduling'
        },
        {
          id: 4,
          question: 'What is a stakeholder in project management?',
          options: [
            'Only the project manager',
            'Anyone who has an interest in or is affected by the project',
            'Only the client',
            'Only the development team'
          ],
          correctAnswer: 1,
          explanation: 'Stakeholders include anyone who has an interest in or is affected by the project\'s outcome.',
          category: 'stakeholders'
        },
        {
          id: 5,
          question: 'What is a project scope?',
          options: [
            'The project budget',
            'The defined boundaries and deliverables of a project',
            'The project timeline',
            'The project team size'
          ],
          correctAnswer: 1,
          explanation: 'Project scope defines the boundaries, objectives, and deliverables of a project.',
          category: 'scope'
        }
      ]
    };

    return questionTemplates[topic as keyof typeof questionTemplates] || [];
  };

  // Filter topics based on user's primary skill
  const skillMapping: { [key: string]: string[] } = {
    'javascript': ['javascript'],
    'python': ['python', 'python-basics', 'python-oop', 'python-libraries'],
    'java': ['java', 'java-oop', 'java-collections', 'java-multithreading'],
    'c++': ['c++', 'c++-oop', 'c++-stl'],
    'react': ['react', 'react-hooks', 'react-advanced', 'javascript'],
    'node.js': ['node.js', 'node-express', 'node-database', 'javascript'],
    'typescript': ['typescript', 'typescript-advanced', 'javascript'],
    'angular': ['javascript', 'typescript', 'typescript-advanced'],
    'vue.js': ['javascript', 'react'],
    'sql': ['data-science'],
    'devops': ['project-management', 'node.js'],
    'cloud computing': ['project-management'],
    'machine learning': ['data-science', 'python', 'python-libraries'],
    'data science': ['data-science', 'python', 'python-libraries'],
    'mobile development': ['javascript', 'react', 'react-hooks'],
    'ui/ux design': ['leadership'],
    'project management': ['project-management', 'leadership'],
    'product management': ['leadership', 'project-management'],
    'leadership': ['leadership']
  };

  const relevantTopicKeys = userPrimarySkill 
    ? (skillMapping[userPrimarySkill] || [userPrimarySkill]) 
    : Object.keys(topicsDatabase);

  const filteredTopics = Object.entries(topicsDatabase).filter(([key, topic]) => {
    const matchesSkill = relevantTopicKeys.includes(key) || !userPrimarySkill;
    const matchesSearch = topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      key.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesSkill && matchesSearch;
  });

  const handleTopicSelect = (topicKey: string) => {
    setSelectedTopic(topicKey);
    setTopicInfo(topicsDatabase[topicKey as keyof typeof topicsDatabase]);
    setCurrentView('info');
  };

  const startQuiz = () => {
    const quizQuestions = generateQuestions(selectedTopic);
    setQuestions(quizQuestions);
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setSelectedAnswer(null);
    setStartTime(new Date());
    setCurrentView('quiz');
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const nextQuestion = () => {
    if (selectedAnswer !== null) {
      const newAnswers = [...userAnswers, selectedAnswer];
      setUserAnswers(newAnswers);
      setSelectedAnswer(null);

      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        finishQuiz(newAnswers);
      }
    }
  };

  const finishQuiz = async (answers: number[]) => {
    const correctAnswers = answers.filter((answer, index) => answer === questions[index].correctAnswer).length;
    const score = Math.round((correctAnswers / questions.length) * 100);
    const timeSpent = startTime ? `${Math.round((Date.now() - startTime.getTime()) / 1000 / 60)} minutes` : 'Unknown';

    let feedback = '';
    let recommendations: string[] = [];

    if (score >= 80) {
      feedback = `Excellent work! You have a strong understanding of ${topicInfo?.title}. You're ready for advanced concepts.`;
      recommendations = [
        'Explore advanced topics in this area',
        'Consider mentoring others',
        'Look into related specialized fields'
      ];
    } else if (score >= 60) {
      feedback = `Good job! You have a solid foundation in ${topicInfo?.title}. Focus on strengthening key areas.`;
      recommendations = [
        'Review the concepts you missed',
        'Practice with additional resources',
        'Take a more comprehensive course'
      ];
    } else {
      feedback = `Keep learning! ${topicInfo?.title} requires more study. Don't get discouraged - everyone starts somewhere.`;
      recommendations = [
        'Start with beginner-friendly resources',
        'Take your time to understand fundamentals',
        'Practice regularly with small exercises'
      ];
    }

    const result: QuizResult = {
      score,
      totalQuestions: questions.length,
      correctAnswers,
      feedback,
      recommendations,
      timeSpent
    };

    // Submit quiz results to backend
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const submitData = {
          answers: answers.map((answer, index) => ({
            questionId: questions[index].id,
            selectedAnswer: answer,
            correctAnswer: questions[index].correctAnswer,
            isCorrect: answer === questions[index].correctAnswer
          })),
          score,
          topic: selectedTopic,
          difficulty: topicInfo?.difficulty?.toLowerCase() || 'intermediate',
          timeSpent,
          totalQuestions: questions.length,
          correctAnswers
        };

        const response = await fetch(`${API_URL}/quiz/${selectedTopic}/submit`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(submitData)
        });

        if (response.ok) {
          console.log('Quiz results submitted successfully');
          
          // Update user stats with quiz score
          try {
            const statsResponse = await fetch(`${API_URL}/user/quiz-score`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({
                topic: selectedTopic,
                score,
                totalQuestions: questions.length,
                correctAnswers
              })
            });
            
            if (statsResponse.ok) {
              const statsData = await statsResponse.json();
              console.log('User stats updated successfully:', statsData);
            } else {
              console.error('Failed to update user stats:', await statsResponse.text());
            }
          } catch (statsError) {
            console.error('Error updating user stats:', statsError);
          }
          
          // Always trigger dashboard refresh after quiz completion
          console.log('Calling onQuizCompleted callback...');
          if (onQuizCompleted) {
            onQuizCompleted();
          }
        } else {
          console.error('Failed to submit quiz results');
        }
      }
    } catch (error) {
      console.error('Error submitting quiz results:', error);
    }

    setQuizResult(result);
    setCurrentView('results');
  };

  const resetQuiz = () => {
    setCurrentView('search');
    setSearchQuery('');
    setSelectedTopic('');
    setTopicInfo(null);
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setSelectedAnswer(null);
    setQuizResult(null);
    setStartTime(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-4xl h-[600px] max-h-[90vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-t-2xl flex justify-between items-center">
          <div className="flex items-center">
            <AcademicCapIcon className="w-6 h-6 mr-2" />
            <h3 className="text-lg font-bold">
              {currentView === 'search' && 'Smart Quiz System'}
              {currentView === 'info' && `About ${topicInfo?.title}`}
              {currentView === 'quiz' && `Quiz: ${topicInfo?.title}`}
              {currentView === 'results' && 'Quiz Results'}
            </h3>
          </div>
          <button onClick={onClose} className="text-white hover:text-gray-300 transition-colors">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Search View */}
          {currentView === 'search' && (
            <div className="p-6">
              <div className="mb-6">
                <div className="relative">
                  <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search for topics (e.g., JavaScript, Python, Leadership, Data Science...)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredTopics.map(([key, topic]) => (
                  <div
                    key={key}
                    onClick={() => handleTopicSelect(key)}
                    className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-gray-900 dark:text-white">{topic.title}</h4>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        topic.difficulty === 'Beginner' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                        topic.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                        'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {topic.difficulty}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{topic.description}</p>
                    <div className="flex items-center text-xs text-gray-500">
                      <ClockIcon className="w-4 h-4 mr-1" />
                      {topic.estimatedTime}
                    </div>
                  </div>
                ))}
              </div>

              {filteredTopics.length === 0 && searchQuery && (
                <div className="text-center py-8">
                  <QuestionMarkCircleIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">
                    No topics found for "{searchQuery}". Try searching for JavaScript, Python, React, Leadership, or Data Science.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Topic Info View */}
          {currentView === 'info' && topicInfo && (
            <div className="p-6">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{topicInfo.title}</h2>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    topicInfo.difficulty === 'Beginner' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                    topicInfo.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                    'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}>
                    {topicInfo.difficulty}
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-4">{topicInfo.description}</p>
                <div className="flex items-center text-sm text-gray-500 mb-6">
                  <ClockIcon className="w-4 h-4 mr-1" />
                  Estimated time: {topicInfo.estimatedTime}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="flex items-center text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    <BookOpenIcon className="w-5 h-5 mr-2" />
                    Key Topics Covered
                  </h3>
                  <ul className="space-y-2">
                    {topicInfo.keyPoints.map((point, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircleIcon className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-600 dark:text-gray-400 text-sm">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="flex items-center text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    <LightBulbIcon className="w-5 h-5 mr-2" />
                    Learning Outcomes
                  </h3>
                  <ul className="space-y-2">
                    {topicInfo.learningOutcomes.map((outcome, index) => (
                      <li key={index} className="flex items-start">
                        <ArrowRightIcon className="w-4 h-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-600 dark:text-gray-400 text-sm">{outcome}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setCurrentView('search')}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                >
                  ← Back to Topics
                </button>
                <button
                  onClick={startQuiz}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-colors"
                >
                  Start Quiz →
                </button>
              </div>
            </div>
          )}

          {/* Quiz View */}
          {currentView === 'quiz' && questions.length > 0 && (
            <div className="p-6">
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Question {currentQuestionIndex + 1} of {questions.length}
                  </span>
                  <div className="w-48 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  {questions[currentQuestionIndex].question}
                </h3>
              </div>

              <div className="space-y-3 mb-6">
                {questions[currentQuestionIndex].options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    className={`w-full p-4 text-left border rounded-lg transition-colors ${
                      selectedAnswer === index
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                        : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <span className="font-medium mr-3">{String.fromCharCode(65 + index)}.</span>
                    {option}
                  </button>
                ))}
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setCurrentView('info')}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                >
                  ← Back to Info
                </button>
                <button
                  onClick={nextQuestion}
                  disabled={selectedAnswer === null}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {currentQuestionIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question'} →
                </button>
              </div>
            </div>
          )}

          {/* Results View */}
          {currentView === 'results' && quizResult && (
            <div className="p-6">
              <div className="text-center mb-6">
                <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 ${
                  quizResult.score >= 80 ? 'bg-green-100 text-green-600' :
                  quizResult.score >= 60 ? 'bg-yellow-100 text-yellow-600' :
                  'bg-red-100 text-red-600'
                }`}>
                  {quizResult.score >= 80 ? <CheckCircleIcon className="w-10 h-10" /> :
                   quizResult.score >= 60 ? <QuestionMarkCircleIcon className="w-10 h-10" /> :
                   <XCircleIcon className="w-10 h-10" />}
                </div>
                
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {quizResult.score}%
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-2">
                  You got {quizResult.correctAnswers} out of {quizResult.totalQuestions} questions correct
                </p>
                <p className="text-sm text-gray-500">
                  Time spent: {quizResult.timeSpent}
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Feedback</h3>
                <p className="text-gray-600 dark:text-gray-400">{quizResult.feedback}</p>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Recommendations</h3>
                <ul className="space-y-2">
                  {quizResult.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start">
                      <ArrowRightIcon className="w-4 h-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600 dark:text-gray-400 text-sm">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex justify-center space-x-4">
                <button
                  onClick={resetQuiz}
                  className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Take Another Quiz
                </button>
                <button
                  onClick={onClose}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-colors"
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

export default QuizSystem;