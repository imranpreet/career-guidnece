import express from 'express';
import OpenAI from 'openai';
import authenticateToken from '../middleware/auth';

const router = express.Router();

// Check if OpenAI is configured
const isOpenAIConfigured = () => {
  return process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your-openai-api-key-here';
};

// Initialize OpenAI client only if API key is available
let openai: OpenAI | null = null;
try {
  if (isOpenAIConfigured()) {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
} catch (error) {
  console.log('OpenAI initialization skipped - API key not configured');
  openai = null;
}

// AI Career Chat endpoint
router.post('/chat', async (req: any, res) => {
  try {
    const { message, context } = req.body;
    
    // Get user info if authenticated, otherwise use defaults
    let user = {
      experience: 'entry',
      currentRole: 'Professional',
      targetRole: 'Next Level',
      skills: ['Communication', 'Problem Solving'],
      primarySkill: ''
    };
    
    // If user is authenticated, get their actual profile
    if (req.headers.authorization) {
      try {
        const token = req.headers.authorization.replace('Bearer ', '');
        const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
        const decoded = require('jsonwebtoken').verify(token, JWT_SECRET);
        const authenticatedUser = await require('../models/User').default.findById(decoded.userId);
        if (authenticatedUser) {
          user = authenticatedUser;
        }
      } catch (authError) {
        // Continue with default user if authentication fails
        console.log('Using default user profile for chat');
      }
    }

    let aiResponse = '';
    let suggestions: string[] = [];

    if (isOpenAIConfigured() && openai) {
      // Use OpenAI API for real AI responses
      try {
        const completion = await openai!.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: `You are an AI Career Coach helping professionals advance their careers. You can discuss ANY topic that relates to professional development and career success. The user's profile:
              - Experience Level: ${user.experience || 'Not specified'}
              - Current Role: ${user.currentRole || 'Not specified'}
              - Target Role: ${user.targetRole || 'Not specified'}
              - Primary Skill: ${user.primarySkill || 'Not specified'}
              - Skills: ${user.skills?.join(', ') || 'Not specified'}
              
              ${user.primarySkill ? `**IMPORTANT: The user's primary skill is ${user.primarySkill}. All advice, recommendations, quizzes, and interview preparation should be tailored specifically for ${user.primarySkill} unless they ask for something different.**` : ''}
              
              You should provide helpful, actionable career advice on any topic the user asks about. This includes but is not limited to: career planning, skill development, industry insights, job searching, networking, leadership, entrepreneurship, work-life balance, salary negotiation, professional relationships, personal branding, technology trends, and any other topic that could impact someone's professional life.
              
              Keep responses comprehensive yet conversational (3-5 sentences). Be encouraging and provide practical next steps. If a topic isn't directly career-related, find a way to connect it to professional development or career growth.`
            },
            {
              role: "user",
              content: message
            }
          ],
          max_tokens: 200,
          temperature: 0.7,
        });

        aiResponse = completion.choices[0]?.message?.content || 'I apologize, but I couldn\'t generate a response at the moment. Please try again.';
        
        // Generate contextual suggestions based on the message
        suggestions = generateContextualSuggestions(message);

      } catch (openaiError) {
        console.error('OpenAI API error:', openaiError);
        // Fall back to mock responses if OpenAI fails
        aiResponse = await getMockResponse(message, user);
        suggestions = generateContextualSuggestions(message);
      }
    } else {
      // Use mock responses when OpenAI is not configured
      aiResponse = await getMockResponse(message, user);
      suggestions = generateContextualSuggestions(message);
    }

    res.json({
      response: aiResponse,
      suggestions: suggestions.slice(0, 2),
      timestamp: new Date(),
      isAIPowered: isOpenAIConfigured()
    });
  } catch (error) {
    console.error('AI chat error:', error);
    res.status(500).json({ message: 'Error processing AI chat request' });
  }
});

// Enhanced AI response function with unlimited career topic capabilities
async function getMockResponse(message: string, user: any): Promise<string> {
  const lowerMessage = message.toLowerCase();
  
  // First check for specific high-value career topics
  const responses = [
    // Cybersecurity - comprehensive coverage
    {
      trigger: ['cybersecurity', 'cyber security', 'information security', 'infosec', 'security analyst', 'ethical hacking', 'penetration testing', 'security engineer', 'ciso', 'security architecture'],
      response: `Cybersecurity is one of the fastest-growing and most critical fields in tech! Here's your comprehensive guide:

🔐 **Cybersecurity Career Landscape:**

**🚀 High-Demand Roles:**
• **Security Analyst:** Monitor and respond to security threats ($65,000-$95,000)
• **Penetration Tester:** Find vulnerabilities before attackers do ($80,000-$120,000)
• **Security Engineer:** Design and implement security systems ($90,000-$140,000)
• **Security Architect:** Plan enterprise security strategy ($120,000-$180,000)
• **CISO/Security Manager:** Lead security teams and strategy ($150,000-$300,000+)

**💪 Essential Skills to Master:**
• **Technical:** Network security, cryptography, incident response, SIEM tools
• **Certifications:** CompTIA Security+, CISSP, CEH, SANS certifications
• **Programming:** Python, PowerShell, SQL for automation and analysis
• **Cloud Security:** AWS/Azure security, container security, DevSecOps
• **Soft Skills:** Risk assessment, communication, continuous learning mindset

**📈 Industry Outlook:**
• 32% job growth (much faster than average)
• 3.5 million unfilled cybersecurity jobs globally
• Average salary increase of 15% year-over-year
• Remote work opportunities abundant

**🎯 Getting Started Path:**
1. **Foundation (Months 1-3):** CompTIA Security+ certification
2. **Specialization (Months 4-8):** Choose focus area (analyst, pentesting, etc.)
3. **Experience (Months 9-12):** Home lab, internships, entry-level positions
4. **Advanced (Year 2+):** Advanced certifications, specialized skills

**🔥 Hot Specializations:**
• Cloud Security (AWS, Azure, GCP)
• Zero Trust Architecture
• AI/ML Security
• IoT Security
• Blockchain Security

What specific area of cybersecurity interests you most? I can provide detailed guidance for your chosen path!`
    },

    // Technology and AI - enhanced coverage
    {
      trigger: ['artificial intelligence', 'machine learning', 'ai engineer', 'data scientist', 'deep learning', 'neural networks', 'nlp', 'computer vision'],
      response: `AI and Machine Learning are revolutionizing every industry! Here's your roadmap to success:

🤖 **AI/ML Career Guide:**

**🚀 Top AI Roles:**
• **AI Engineer:** Build and deploy AI systems ($100,000-$160,000)
• **Data Scientist:** Extract insights from data ($90,000-$140,000)
• **ML Engineer:** Optimize ML models for production ($110,000-$170,000)
• **Research Scientist:** Advance AI technology ($120,000-$200,000+)
• **AI Product Manager:** Guide AI product strategy ($130,000-$180,000)

**💡 Essential Skills:**
• **Programming:** Python, R, SQL, TensorFlow, PyTorch
• **Mathematics:** Statistics, linear algebra, calculus
• **Specializations:** NLP, Computer Vision, Reinforcement Learning
• **Tools:** Jupyter, Git, Docker, Kubernetes, cloud platforms
• **Business:** Understanding domain applications, ethics

**📊 Learning Path:**
1. **Foundation:** Python programming, statistics basics
2. **Core ML:** Supervised/unsupervised learning, neural networks
3. **Specialization:** Choose NLP, CV, or other focus area
4. **Advanced:** Deep learning, MLOps, model deployment
5. **Domain:** Apply AI to specific industries (healthcare, finance, etc.)

**🔥 Trending Areas:**
• Generative AI (GPT, Stable Diffusion)
• MLOps and Model Management
• Edge AI and Mobile Deployment
• Responsible AI and Ethics
• Multimodal AI Systems

The field is growing 22% annually with incredible opportunities! What aspect of AI/ML excites you most?`
    },

    // Data Science and Analytics
    {
      trigger: ['data science', 'data analyst', 'business intelligence', 'data engineer', 'analytics', 'big data', 'data visualization'],
      response: `Data Science is the backbone of modern business decisions! Here's your complete guide:

📊 **Data Science Career Roadmap:**

**🎯 Core Roles:**
• **Data Analyst:** Analyze data for business insights ($55,000-$85,000)
• **Data Scientist:** Build predictive models ($80,000-$130,000)
• **Data Engineer:** Build data infrastructure ($90,000-$140,000)
• **BI Developer:** Create business dashboards ($70,000-$110,000)
• **Chief Data Officer:** Lead data strategy ($180,000-$300,000+)

**🛠️ Technical Skills:**
• **Programming:** Python, R, SQL, Scala
• **Visualization:** Tableau, Power BI, matplotlib, seaborn
• **Databases:** PostgreSQL, MongoDB, Spark, Hadoop
• **Statistics:** Hypothesis testing, regression, A/B testing
• **Cloud:** AWS, Azure, GCP data services

**📈 Industry Applications:**
• **Healthcare:** Drug discovery, patient outcomes
• **Finance:** Risk modeling, fraud detection
• **Marketing:** Customer segmentation, recommendation engines
• **Manufacturing:** Predictive maintenance, quality control
• **Retail:** Demand forecasting, price optimization

**🚀 Success Strategy:**
1. Master SQL and Python/R fundamentals
2. Build a portfolio with real-world projects
3. Learn domain expertise in target industry
4. Develop storytelling skills with data
5. Stay current with emerging tools and techniques

What industry or type of data analysis interests you most? I can provide specific guidance!`
    },

    // Software Development
    {
      trigger: ['software developer', 'programming', 'web development', 'mobile development', 'full stack', 'frontend', 'backend', 'devops'],
      response: `Software Development offers incredible career flexibility and growth! Here's your comprehensive guide:

💻 **Software Development Career Paths:**

**🚀 Popular Specializations:**
• **Frontend Developer:** User interfaces ($65,000-$110,000)
• **Backend Developer:** Server-side logic ($70,000-$120,000)
• **Full Stack Developer:** End-to-end development ($75,000-$125,000)
• **Mobile Developer:** iOS/Android apps ($80,000-$130,000)
• **DevOps Engineer:** Development operations ($90,000-$140,000)

**💡 Essential Technologies:**
• **Frontend:** HTML/CSS, JavaScript, React, Vue, Angular
• **Backend:** Node.js, Python, Java, C#, Go
• **Mobile:** Swift (iOS), Kotlin (Android), React Native, Flutter
• **Database:** SQL, NoSQL, PostgreSQL, MongoDB
• **DevOps:** Docker, Kubernetes, CI/CD, AWS/Azure

**📈 Industry Trends:**
• Cloud-native development
• Microservices architecture
• AI integration in applications
• Low-code/no-code platforms
• Progressive Web Apps

**🎯 Getting Started:**
1. Choose a programming language (Python/JavaScript recommended)
2. Build projects and create a portfolio
3. Learn version control (Git/GitHub)
4. Understand databases and APIs
5. Deploy projects to the cloud

**🔥 Hot Areas:**
• AI/ML integration
• Blockchain development
• IoT applications
• AR/VR development
• Edge computing

What type of software development interests you most? I can provide specific learning resources and project ideas!`
    },
    // Leadership and management
    {
      trigger: ['leadership', 'management', 'manager', 'lead team', 'supervisor', 'boss', 'leadership skills'],
      response: `Leadership skills are valuable at every career level! Here's how to develop them:

👑 **Leadership Development:**
• **Communication:** Practice active listening and clear, empathetic communication
• **Emotional Intelligence:** Understand and manage your emotions and others'
• **Decision Making:** Learn to make informed decisions quickly and confidently
• **Team Building:** Foster collaboration, trust, and shared goals
• **Mentoring:** Help others grow - it develops your own leadership abilities

**Pro Tip:** You don't need a title to be a leader. Start leading projects, initiatives, or by example in your current role!

What leadership challenges are you facing? Team management, decision-making, or developing your leadership style?`
    },
    
    // Career guidance and planning
    {
      trigger: ['career change', 'switch career', 'new career', 'career transition', 'change job', 'career pivot'],
      response: `Based on your ${user?.experience || 'current'} experience level, I can help you navigate career transitions. Here's my advice:

✨ **Key Steps for Career Change:**
• Assess your transferable skills and how they apply to your target field
• Research industry requirements and growth trends
• Network with professionals in your desired industry
• Consider getting relevant certifications or additional training
• Start with informational interviews to learn more

What specific field or role are you considering? I can provide more targeted guidance based on your interests!`
    },
    
    // Resume and CV help
    {
      trigger: ['resume', 'cv', 'curriculum vitae', 'resume help', 'resume tips', 'resume builder'],
      response: `Great choice! A strong resume is your ticket to career success. Here's how to make yours stand out:

📄 **Resume Best Practices:**
• Use action verbs and quantify achievements (increased sales by 25%)
• Tailor your resume to each specific job application
• Keep it concise (1-2 pages) with clear, professional formatting
• Include relevant keywords from the job description
• Showcase your most impressive accomplishments first

Would you like me to help you with a specific section of your resume, or do you have questions about formatting for a particular industry?`
    },
    
    // Interview preparation
    {
      trigger: ['interview', 'job interview', 'interview prep', 'interview questions', 'interview tips'],
      response: `Interview preparation is absolutely crucial! Let me help you ace your next interview:

🎯 **Interview Success Strategy:**
• Research the company thoroughly (mission, recent news, culture)
• Practice the STAR method for behavioral questions (Situation, Task, Action, Result)
• Prepare thoughtful questions to ask the interviewer
• Practice your elevator pitch and key achievements
• Plan your outfit and arrival time in advance

What type of interview are you preparing for? I can provide specific tips for technical interviews, behavioral interviews, or panel interviews!`
    },
    
    // Skills and development
    {
      trigger: ['skills', 'skill development', 'learn', 'training', 'courses', 'certification', 'upskill'],
      response: `Excellent question! Continuous learning is key to career growth. Here are the most in-demand skills for 2025:

🚀 **Top Skills to Develop:**
• **Technical:** AI/ML, Cloud Computing, Data Analysis, Cybersecurity
• **Soft Skills:** Communication, Leadership, Problem-solving, Adaptability
• **Digital:** Project Management Tools, CRM Systems, Social Media Marketing
• **Industry-Specific:** Varies by field but always in demand

What industry are you in or interested in? I can recommend specific skills and the best platforms to learn them (Coursera, LinkedIn Learning, Udemy, etc.)`
    },
    
    // Salary and compensation
    {
      trigger: ['salary', 'compensation', 'pay', 'wage', 'money', 'earnings', 'income', 'negotiate'],
      response: `Salary discussions are crucial for your financial growth! Here's how to approach compensation strategically:

💰 **Salary Negotiation Guide:**
• Research market rates using Glassdoor, PayScale, and LinkedIn Salary Insights
• Consider the total compensation package (benefits, PTO, stock options)
• Document your achievements and quantify your value to the company
• Practice your negotiation conversation beforehand
• Know when to negotiate (typically after a job offer, not during initial interviews)

What position and location are you inquiring about? I can help you research typical salary ranges!`
    },
    
    // General conversation and greetings
    {
      trigger: ['hello', 'hi there', 'hey there', 'good morning', 'good afternoon', 'how are you', 'hi!', 'hello!'],
      response: `Hello! 👋 I'm excited to help you with your career journey today! 

I'm your AI Career Coach, and I can assist you with any career-related topic you'd like to discuss. Feel free to ask me about anything - from career planning to industry insights to professional development!

What would you like to explore today?`
    },
    
    // Thanks and appreciation
    {
      trigger: ['thank you', 'thanks', 'appreciate', 'helpful', 'great advice'],
      response: `You're very welcome! 😊 I'm so glad I could help you with your career questions.

Remember, career growth is a journey, not a destination. Keep learning, stay curious, and don't be afraid to take calculated risks. You've got this! 🚀

Is there anything else I can help you with today? I'm here for any career topic you'd like to discuss!`
    }
  ];

  // Check for specific trigger matches first
  for (const responseOption of responses) {
    const hasMatch = responseOption.trigger.some(trigger => {
      if (trigger.includes(' ')) {
        return lowerMessage.includes(trigger);
      } else {
        const regex = new RegExp(`\\b${trigger}\\b|${trigger}s\\b|${trigger}ing\\b`, 'i');
        return regex.test(lowerMessage) || lowerMessage.includes(trigger);
      }
    });
    
    if (hasMatch) {
      return responseOption.response;
    }
  }

  // AI-powered comprehensive career guidance for ANY topic
  return generateComprehensiveCareerAdvice(message, user);
}

// Function to generate comprehensive career advice for any topic
function generateComprehensiveCareerAdvice(message: string, user: any): string {
  const lowerMessage = message.toLowerCase();
  
  // Industry-specific responses
  const industries = [
    'cybersecurity', 'cyber security', 'information security', 'infosec', 'security analyst', 'penetration testing', 'ethical hacking',
    'technology', 'tech', 'software', 'programming', 'coding', 'development', 'engineering',
    'healthcare', 'medical', 'nursing', 'doctor', 'pharmacy', 'therapy',
    'finance', 'banking', 'accounting', 'investment', 'economics', 'financial',
    'marketing', 'advertising', 'social media', 'content', 'brand', 'digital marketing',
    'education', 'teaching', 'academic', 'research', 'university', 'school',
    'sales', 'business development', 'account management', 'client relations',
    'design', 'graphic design', 'ux', 'ui', 'creative', 'artist', 'visual',
    'consulting', 'strategy', 'business analyst', 'management consulting',
    'legal', 'law', 'attorney', 'paralegal', 'compliance', 'contracts',
    'real estate', 'property', 'real estate agent', 'broker', 'property management',
    'data science', 'data analyst', 'business intelligence', 'analytics', 'big data'
  ];

  const detectedIndustry = industries.find(industry => lowerMessage.includes(industry));

  // Career stages and goals
  const careerStages: { [key: string]: string[] } = {
    entry: ['entry level', 'new graduate', 'first job', 'junior', 'recent graduate', 'starting career'],
    mid: ['mid level', 'senior', 'experienced', 'career change', 'promotion', 'advancement'],
    executive: ['executive', 'director', 'vp', 'ceo', 'leadership', 'c-suite', 'senior management']
  };

  const detectedStage = Object.keys(careerStages).find(stage => 
    careerStages[stage].some((keyword: string) => lowerMessage.includes(keyword))
  );

  // Skill-related topics
  const skillKeywords = [
    'learn', 'skill', 'training', 'course', 'certification', 'development', 'improve',
    'communication', 'presentation', 'public speaking', 'teamwork', 'collaboration',
    'problem solving', 'critical thinking', 'analytical', 'creativity', 'innovation',
    'time management', 'organization', 'productivity', 'efficiency', 'planning'
  ];

  const isSkillRelated = skillKeywords.some(keyword => lowerMessage.includes(keyword));

  // Generate contextual response based on detected topics
  if (detectedIndustry) {
    return generateIndustrySpecificAdvice(detectedIndustry, message, user);
  } else if (detectedStage) {
    return generateStageSpecificAdvice(detectedStage, message, user);
  } else if (isSkillRelated) {
    return generateSkillDevelopmentAdvice(message, user);
  } else if (lowerMessage.includes('?')) {
    return generateQuestionBasedAdvice(message, user);
  } else {
    return generateGeneralCareerAdvice(message, user);
  }
}

function generateIndustrySpecificAdvice(industry: string, message: string, user: any): string {
  const industryAdvice: { [key: string]: any } = {
    cybersecurity: {
      title: "Cybersecurity Career Mastery Guide",
      trends: "Zero Trust Architecture, AI-powered Security, Cloud Security, IoT Protection, and Quantum-safe Cryptography",
      skills: "Network Security, Incident Response, Risk Assessment, Ethical Hacking, Security Architecture",
      growth: "Cybersecurity growing 32% annually with 3.5M unfilled positions globally - highest demand ever!",
      certifications: "CompTIA Security+, CISSP, CEH, SANS certifications, AWS Security Specialty",
      salaryRange: "$65,000 - $300,000+ depending on role and experience"
    },
    technology: {
      title: "Technology & Software Career Guidance",
      trends: "AI/ML, Cloud Computing, Cybersecurity, DevOps, and Mobile Development",
      skills: "Programming languages, System design, Agile methodologies, Version control",
      growth: "Tech industry continues rapid growth with 22% increase in job opportunities",
      certifications: "AWS, Azure, Google Cloud, programming certifications",
      salaryRange: "$70,000 - $200,000+ based on specialization"
    },
    healthcare: {
      title: "Healthcare Career Guidance",
      trends: "Telemedicine, Digital Health, Precision Medicine, and Healthcare Analytics",
      skills: "Patient care, Medical technology, Communication, Continuous learning",
      growth: "Healthcare growing 15% faster than average due to aging population",
      certifications: "Medical licenses, healthcare IT certifications",
      salaryRange: "$50,000 - $400,000+ depending on role"
    },
    finance: {
      title: "Finance Career Guidance",
      trends: "FinTech, Cryptocurrency, Sustainable Finance, and AI in Finance",
      skills: "Financial analysis, Risk management, Regulatory knowledge, Data analytics",
      growth: "Fintech revolution creating new opportunities in traditional finance",
      certifications: "CFA, FRM, Series licenses, fintech certifications",
      salaryRange: "$60,000 - $500,000+ based on role and location"
    },
    marketing: {
      title: "Marketing & Digital Media Career Guidance",
      trends: "Influencer Marketing, AI-driven Campaigns, Video Content, and Performance Marketing",
      skills: "Digital marketing, Content creation, Analytics, Social media strategy",
      growth: "Digital marketing growing 25% annually as businesses shift online",
      certifications: "Google Ads, Facebook Blueprint, HubSpot, Adobe certifications",
      salaryRange: "$45,000 - $150,000+ depending on specialization"
    }
  };

  // Map variations to main categories
  if (industry.includes('cyber') || industry.includes('security') || industry.includes('infosec')) {
    industry = 'cybersecurity';
  } else if (industry.includes('tech') || industry.includes('software') || industry.includes('programming')) {
    industry = 'technology';
  } else if (industry.includes('health') || industry.includes('medical')) {
    industry = 'healthcare';
  } else if (industry.includes('finance') || industry.includes('banking')) {
    industry = 'finance';
  } else if (industry.includes('marketing') || industry.includes('advertising')) {
    industry = 'marketing';
  }

  const advice = industryAdvice[industry] || industryAdvice.technology;

  return `Excellent question about the ${industry} field! Here's my comprehensive guidance:

🚀 **${advice.title}**

**🔥 Current Industry Trends:**
${advice.trends}

**💪 Essential Skills to Develop:**
${advice.skills}

**📈 Market Outlook:**
${advice.growth}

**� Key Certifications:**
${advice.certifications}

**💰 Salary Range:**
${advice.salaryRange}

**�🎯 My Recommendations:**
• Start with foundational skills and entry-level certifications
• Build hands-on experience through labs, internships, or projects
• Network with professionals through LinkedIn and industry events
• Stay updated with latest trends and emerging technologies
• Consider specializing in high-demand areas

**💡 Next Steps:**
Based on your interest in ${industry}, I'd suggest focusing on the most in-demand skills first. Would you like specific recommendations for:
- Learning resources and certification paths
- Building a portfolio or lab environment
- Networking opportunities and job search strategies
- Salary negotiation for your experience level

What specific aspect of ${industry} careers interests you most?`;
}

function generateStageSpecificAdvice(stage: string, message: string, user: any): string {
  const stageAdvice: { [key: string]: any } = {
    entry: {
      title: "Early Career Success Strategy",
      focus: "Building foundation skills and gaining experience",
      priorities: ["Learn constantly", "Build network", "Seek mentorship", "Take on challenges"],
      timeline: "Focus on growth over immediate compensation"
    },
    mid: {
      title: "Mid-Career Advancement Strategy",
      focus: "Specialization and leadership development",
      priorities: ["Develop expertise", "Lead projects", "Mentor others", "Consider career pivots"],
      timeline: "Balance specialization with strategic career moves"
    },
    executive: {
      title: "Executive Leadership Strategy",
      focus: "Strategic thinking and organizational impact",
      priorities: ["Vision setting", "Team building", "Industry influence", "Board readiness"],
      timeline: "Focus on long-term impact and legacy building"
    }
  };

  const advice = stageAdvice[stage] || stageAdvice.mid;

  return `Great question about your career stage! Here's my tailored guidance:

🎯 **${advice.title}**

**🔍 Current Focus Area:**
${advice.focus}

  **⭐ Key Priorities:**
${advice.priorities.map((priority: string) => `• ${priority}`).join('\n')}**⏰ Timeline Perspective:**
${advice.timeline}

**🚀 Actionable Steps:**
• **Week 1:** Assess your current skills and identify gaps
• **Month 1:** Set specific, measurable career goals
• **Quarter 1:** Start networking and building industry relationships
• **Year 1:** Achieve one major professional milestone

**💡 Pro Tips for Your Stage:**
• Document your achievements regularly for performance reviews
• Seek feedback from peers, managers, and direct reports
• Invest in continuous learning - both technical and soft skills
• Build relationships across different departments and levels

What specific challenge or goal would you like help with at your current career stage?`;
}

function generateSkillDevelopmentAdvice(message: string, user: any): string {
  return `Fantastic focus on skill development! This is the key to career acceleration. Here's my comprehensive guidance:

🧠 **Skill Development Mastery Plan**

**🔥 Most In-Demand Skills 2025:**
• **Technical:** AI/ML, Data Analysis, Cloud Computing, Cybersecurity
• **Soft Skills:** Emotional Intelligence, Leadership, Adaptability, Communication
• **Digital:** Social Media Marketing, Project Management, CRM Systems
• **Emerging:** Sustainability Knowledge, Remote Team Management, AI Collaboration

**📚 Learning Strategy:**
• **80/20 Rule:** Focus 80% on skills directly relevant to your goals
• **Multi-Modal Learning:** Combine courses, books, practice, and mentorship
• **Just-in-Time Learning:** Learn skills right before you need to apply them
• **Teaching Others:** Solidify learning by explaining concepts to colleagues

**🎯 Implementation Plan:**
1. **Assess Current Skills:** Use tools like LinkedIn Skills Assessment
2. **Choose 2-3 Priority Skills:** Don't try to learn everything at once
3. **Set Learning Goals:** Specific, measurable, time-bound objectives
4. **Practice Regularly:** Dedicate 30 minutes daily to skill development
5. **Apply Immediately:** Use new skills in real projects

**🏆 Skill Validation:**
• Get certified through recognized platforms (Coursera, edX, industry bodies)
• Build a portfolio demonstrating your new capabilities
• Seek feedback from managers and peers on your progress
• Share your learning journey on LinkedIn

**💡 Pro Tips:**
• Learn skills that combine technical and business knowledge
• Focus on skills that complement AI rather than compete with it
• Network with others learning the same skills for peer support

What specific skill are you most interested in developing? I can provide detailed learning resources and strategies!`;
}

function generateQuestionBasedAdvice(message: string, user: any): string {
  return `That's an excellent question! I love helping professionals think through important career decisions. Let me provide you with a comprehensive perspective:

🤔 **Strategic Career Thinking**

**🔍 Let's Break This Down:**
Your question shows you're thinking strategically about your career - that's already a great sign! Here's how I approach any career question:

**📊 Analysis Framework:**
• **Current Situation:** Where are you now professionally?
• **Desired Outcome:** What specific result are you hoping to achieve?
• **Available Options:** What different paths could you take?
• **Resource Requirements:** What time, money, or support do you need?
• **Risk Assessment:** What are the potential upsides and downsides?

**💡 My Methodology:**
1. **Gather Information:** Research thoroughly before making decisions
2. **Seek Multiple Perspectives:** Talk to people who've faced similar situations
3. **Test Small:** Try pilot projects or informational interviews first
4. **Measure Progress:** Set milestones to track your advancement
5. **Stay Flexible:** Be ready to adjust your approach based on results

**🎯 Actionable Next Steps:**
• Define exactly what success looks like for your situation
• Identify 2-3 people who could provide valuable insights
• Create a timeline with specific milestones
• List the resources and support you'll need
• Plan how you'll measure and adjust your progress

**🚀 Career Success Principles:**
• Focus on building valuable skills and relationships
• Take calculated risks that align with your long-term goals
• Stay curious and keep learning continuously
• Help others succeed - it often comes back to benefit you

Would you like me to help you think through the specific details of your question? I can provide more targeted guidance once I understand your particular situation better!`;
}

function generateGeneralCareerAdvice(message: string, user: any): string {
  return `Thank you for reaching out! I'm here to help you with any career-related topic. Let me provide some valuable insights:

💼 **Comprehensive Career Guidance**

**🌟 Universal Career Success Principles:**
• **Continuous Learning:** The most successful professionals never stop growing
• **Relationship Building:** Your network is often your net worth
• **Value Creation:** Focus on solving problems and delivering results
• **Strategic Thinking:** Think long-term while executing short-term goals
• **Adaptability:** Embrace change as an opportunity for growth

**🚀 Career Acceleration Strategies:**
• **Skill Stacking:** Combine complementary skills for unique value
• **Personal Branding:** Build your reputation in your field
• **Mentorship:** Both seek mentors and mentor others
• **Documentation:** Keep track of your achievements and impact
• **Feedback Loops:** Regularly seek input on your performance

**📈 Professional Development Focus Areas:**
• **Technical Skills:** Stay current with industry tools and technologies
• **Communication:** Master written, verbal, and presentation skills
• **Leadership:** Develop influence regardless of your title
• **Problem-Solving:** Become the person others turn to for solutions
• **Innovation:** Think creatively about improving processes and outcomes

**🎯 Taking Action:**
1. **Assess:** Where are you now in your career journey?
2. **Envision:** What does your ideal career look like?
3. **Plan:** What steps will bridge the gap?
4. **Execute:** Start taking consistent action toward your goals
5. **Adjust:** Regularly review and refine your approach

**💡 Remember:**
Every successful career is built on small, consistent actions over time. You don't have to be perfect - you just need to keep moving forward and learning from each experience.

I'm here to help you dive deeper into any specific aspect of your career journey. What particular area would you like to explore further - career planning, skill development, job searching, networking, or something else entirely?`;
}

function generateContextualSuggestions(message: string): string[] {
  const lowerMessage = message.toLowerCase();
  
  // Cybersecurity-specific suggestions
  if (lowerMessage.includes('cybersecurity') || lowerMessage.includes('cyber security') || 
      lowerMessage.includes('security') || lowerMessage.includes('ethical hacking') ||
      lowerMessage.includes('penetration testing') || lowerMessage.includes('infosec')) {
    return [
      'What cybersecurity certifications should I get?',
      'How to start in penetration testing',
      'Building a cybersecurity home lab',
      'Cybersecurity salary negotiation tips'
    ];
  }
  
  // Industry-specific suggestions
  if (lowerMessage.includes('technology') || lowerMessage.includes('software') || lowerMessage.includes('programming')) {
    return [
      'Latest programming trends for 2025',
      'How to transition to AI/ML roles',
      'Building a strong tech portfolio',
      'Networking in the tech industry'
    ];
  }
  
  if (lowerMessage.includes('data science') || lowerMessage.includes('analytics') || lowerMessage.includes('big data')) {
    return [
      'Data science certification roadmap',
      'Building data science portfolio projects',
      'Breaking into data science field',
      'Data science interview preparation'
    ];
  }
  
  if (lowerMessage.includes('leadership') || lowerMessage.includes('management')) {
    return [
      'Developing emotional intelligence',
      'Leading remote teams effectively',
      'Building high-performing teams',
      'Executive communication skills'
    ];
  }
  
  if (lowerMessage.includes('interview') || lowerMessage.includes('job search')) {
    return [
      'Mastering behavioral interviews',
      'Salary negotiation strategies',
      'Building a professional network',
      'Creating an impressive LinkedIn profile'
    ];
  }
  
  if (lowerMessage.includes('skill') || lowerMessage.includes('learn')) {
    return [
      'Most in-demand skills for 2025',
      'Creating a personal learning plan',
      'Finding the right online courses',
      'Building expertise in your field'
    ];
  }
  
  // Default suggestions for any career topic
  return [
    'How to advance in my current role',
    'Building a strong personal brand',
    'Effective networking strategies',
    'Planning my next career move'
  ];
}

function getMockSuggestions(): string[] {
  const suggestions = [
    'Help me plan my career path for 2025',
    'How do I negotiate a higher salary?',
    'What skills are most in demand right now?',
    'Tips for acing virtual interviews',
    'How to build a strong professional network',
    'Guide me through a career change',
    'Best practices for LinkedIn optimization',
    'How to ask for a promotion effectively',
    'Remote work productivity tips',
    'Building leadership skills',
    'Creating an impressive resume',
    'Industry trends I should know about'
  ];
  
  // Return 4 random suggestions
  const shuffled = suggestions.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 4);
}

// Get industry insights
router.get('/insights', authenticateToken, async (req: any, res) => {
  try {
    const { industry, role } = req.query;

    // Mock industry insights - in production, fetch from external APIs or databases
    const insights = {
      trendingSkills: [
        { skill: 'Artificial Intelligence', demand: 'Very High', growth: '+45%' },
        { skill: 'Cloud Computing', demand: 'High', growth: '+38%' },
        { skill: 'Data Science', demand: 'High', growth: '+35%' },
        { skill: 'Cybersecurity', demand: 'High', growth: '+32%' },
        { skill: 'UX Design', demand: 'Medium', growth: '+28%' }
      ],
      salaryTrends: {
        averageSalary: '$75,000 - $120,000',
        trend: '+8% from last year',
        topPayingCompanies: ['Google', 'Apple', 'Microsoft', 'Amazon', 'Meta']
      },
      jobMarket: {
        openPositions: '2.3M+',
        hiringTrend: 'Increasing',
        remoteOpportunities: '68%',
        competitionLevel: 'Moderate'
      },
      recommendations: [
        'Focus on developing AI and machine learning skills',
        'Get certified in cloud platforms (AWS, Azure, GCP)',
        'Build a strong online portfolio',
        'Network with industry professionals'
      ]
    };

    res.json({ insights });
  } catch (error) {
    console.error('Industry insights error:', error);
    res.status(500).json({ message: 'Error fetching industry insights' });
  }
});

// Get career path recommendations
router.post('/career-paths', authenticateToken, async (req: any, res) => {
  try {
    const user = req.user;
    const { targetRole, timeframe } = req.body;

    // Mock career path generation - in production, use AI to generate personalized paths
    const careerPaths = [
      {
        title: 'Software Engineer to Senior Software Engineer',
        duration: '2-3 years',
        steps: [
          { step: 1, title: 'Master advanced programming concepts', duration: '6 months' },
          { step: 2, title: 'Lead a significant project', duration: '6 months' },
          { step: 3, title: 'Mentor junior developers', duration: '6 months' },
          { step: 4, title: 'Get system design certification', duration: '6 months' }
        ],
        requiredSkills: ['Advanced Programming', 'System Design', 'Leadership', 'Mentoring'],
        probability: '85%'
      },
      {
        title: 'Software Engineer to Product Manager',
        duration: '3-5 years',
        steps: [
          { step: 1, title: 'Gain product knowledge', duration: '8 months' },
          { step: 2, title: 'Work closely with PM team', duration: '8 months' },
          { step: 3, title: 'Get PM certification', duration: '6 months' },
          { step: 4, title: 'Lead product initiatives', duration: '12 months' }
        ],
        requiredSkills: ['Product Strategy', 'User Research', 'Data Analysis', 'Communication'],
        probability: '70%'
      }
    ];

    res.json({ careerPaths });
  } catch (error) {
    console.error('Career paths error:', error);
    res.status(500).json({ message: 'Error generating career paths' });
  }
});

export default router;