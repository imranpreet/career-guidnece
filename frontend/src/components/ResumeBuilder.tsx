import React, { useState, useRef } from 'react';
import { useToast } from './ui/ToastProvider';
import { 
  XMarkIcon, 
  DocumentTextIcon, 
  PlusIcon, 
  TrashIcon,
  ArrowDownTrayIcon,
  EyeIcon
} from '@heroicons/react/24/outline';

const API_URL = process.env.REACT_APP_API_URL || 'https://career-guidnece-production-d6a5.up.railway.app/api';

interface ResumeData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    linkedIn: string;
    website: string;
  };
  summary: string;
  experience: Array<{
    id: string;
    title: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
  }>;
  education: Array<{
    id: string;
    degree: string;
    school: string;
    location: string;
    graduationDate: string;
    gpa: string;
  }>;
  skills: string[];
  projects: Array<{
    id: string;
    name: string;
    description: string;
    technologies: string;
    link: string;
  }>;
  certifications: Array<{
    id: string;
    name: string;
    issuer: string;
    date: string;
  }>;
}

interface ResumeBuilderProps {
  isOpen: boolean;
  onClose: () => void;
}

const ResumeBuilder: React.FC<ResumeBuilderProps> = ({ isOpen, onClose }) => {
  const [activeSection, setActiveSection] = useState('personal');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const printRef = useRef<HTMLDivElement>(null);
  const toast = useToast();

  const [resumeData, setResumeData] = useState<ResumeData>({
    personalInfo: {
      fullName: 'John Doe',
      email: 'john.doe@example.com',
      phone: '(555) 123-4567',
      location: 'New York, NY',
      linkedIn: 'linkedin.com/in/johndoe',
      website: 'johndoe.dev'
    },
    summary: 'Experienced software developer with 5+ years of expertise in full-stack development, specializing in React, Node.js, and cloud technologies. Passionate about creating scalable solutions and leading high-performing teams.',
    experience: [
      {
        id: '1',
        title: 'Senior Software Developer',
        company: 'Tech Corp',
        location: 'New York, NY',
        startDate: '2022-01',
        endDate: '',
        current: true,
        description: '• Led development of customer-facing web applications serving 100K+ users\n• Implemented CI/CD pipelines reducing deployment time by 50%\n• Mentored junior developers and conducted code reviews'
      }
    ],
    education: [
      {
        id: '1',
        degree: 'Bachelor of Science in Computer Science',
        school: 'University of Technology',
        location: 'New York, NY',
        graduationDate: '2019-05',
        gpa: '3.8'
      }
    ],
    skills: ['JavaScript', 'React', 'Node.js', 'Python', 'AWS', 'MongoDB', 'Git'],
    projects: [
      {
        id: '1',
        name: 'E-commerce Platform',
        description: 'Built a full-stack e-commerce platform with React, Node.js, and MongoDB',
        technologies: 'React, Node.js, MongoDB, Stripe API',
        link: 'github.com/johndoe/ecommerce'
      }
    ],
    certifications: [
      {
        id: '1',
        name: 'AWS Certified Developer',
        issuer: 'Amazon Web Services',
        date: '2023-06'
      }
    ]
  });

  const sections = [
    { id: 'personal', name: 'Personal Info', icon: '👤' },
    { id: 'summary', name: 'Summary', icon: '📝' },
    { id: 'experience', name: 'Experience', icon: '💼' },
    { id: 'education', name: 'Education', icon: '🎓' },
    { id: 'skills', name: 'Skills', icon: '⚡' },
    { id: 'projects', name: 'Projects', icon: '🚀' },
    { id: 'certifications', name: 'Certifications', icon: '🏆' }
  ];

  const addExperience = () => {
    const newExp = {
      id: Date.now().toString(),
      title: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: ''
    };
    setResumeData(prev => ({ ...prev, experience: [...prev.experience, newExp] }));
  };

  const updateExperience = (id: string, field: string, value: any) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.map(exp => 
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const removeExperience = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.filter(exp => exp.id !== id)
    }));
  };

  const addEducation = () => {
    const newEdu = {
      id: Date.now().toString(),
      degree: '',
      school: '',
      location: '',
      graduationDate: '',
      gpa: ''
    };
    setResumeData(prev => ({ ...prev, education: [...prev.education, newEdu] }));
  };

  const updateEducation = (id: string, field: string, value: string) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.map(edu => 
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    }));
  };

  const removeEducation = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id)
    }));
  };

  const addProject = () => {
    const newProject = {
      id: Date.now().toString(),
      name: '',
      description: '',
      technologies: '',
      link: ''
    };
    setResumeData(prev => ({ ...prev, projects: [...prev.projects, newProject] }));
  };

  const updateProject = (id: string, field: string, value: string) => {
    setResumeData(prev => ({
      ...prev,
      projects: prev.projects.map(project => 
        project.id === id ? { ...project, [field]: value } : project
      )
    }));
  };

  const removeProject = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      projects: prev.projects.filter(project => project.id !== id)
    }));
  };

  const addCertification = () => {
    const newCert = {
      id: Date.now().toString(),
      name: '',
      issuer: '',
      date: ''
    };
    setResumeData(prev => ({ ...prev, certifications: [...prev.certifications, newCert] }));
  };

  const updateCertification = (id: string, field: string, value: string) => {
    setResumeData(prev => ({
      ...prev,
      certifications: prev.certifications.map(cert => 
        cert.id === id ? { ...cert, [field]: value } : cert
      )
    }));
  };

  const removeCertification = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      certifications: prev.certifications.filter(cert => cert.id !== id)
    }));
  };

  // Prevent ESLint "assigned a value but never used" warnings for helper functions
  // These are intentionally defined for future features (add/update/remove) and
  // referenced here to mark them as used until they are wired into the UI.
  void addEducation;
  void updateEducation;
  void removeEducation;
  void addProject;
  void updateProject;
  void removeProject;
  void addCertification;
  void updateCertification;
  void removeCertification;

  const addSkill = (skill: string) => {
    if (skill.trim() && !resumeData.skills.includes(skill.trim())) {
      setResumeData(prev => ({ ...prev, skills: [...prev.skills, skill.trim()] }));
    }
  };

  const removeSkill = (skill: string) => {
    setResumeData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
  };

  const generateResume = async () => {
    setIsGenerating(true);
    try {
      const token = localStorage.getItem('token');
      console.log('Generating resume with data:', resumeData);
      
      const response = await fetch(`${API_URL}/resume/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify(resumeData)
      });

      console.log('Response status:', response.status);
      const responseData = await response.json();
      console.log('Response data:', responseData);

      if (response.ok) {
        setShowPreview(true);
        toast.push({ type: 'success', message: 'Resume generated successfully!' });
        
        // Track resume generation in user stats
        try {
          if (token) {
            const statsResponse = await fetch(`${API_URL}/user/resume-generated`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              }
            });
            
            if (statsResponse.ok) {
              console.log('Resume generation tracked successfully');
            }
          }
        } catch (statsError) {
          console.error('Error tracking resume generation:', statsError);
        }
      } else {
        throw new Error(responseData.message || 'Failed to generate resume');
      }
    } catch (error) {
      console.error('Error generating resume:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      toast.push({ type: 'error', message: `Failed to generate resume: ${errorMessage}` });
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadResume = () => {
    if (printRef.current) {
      window.print();
    }
  };

  const clearAllData = () => {
    if (window.confirm('Are you sure you want to clear all resume data? This action cannot be undone.')) {
      setResumeData({
        personalInfo: {
          fullName: '',
          email: '',
          phone: '',
          location: '',
          linkedIn: '',
          website: ''
        },
        summary: '',
        experience: [],
        education: [],
        skills: [],
        projects: [],
        certifications: []
      });
      setShowPreview(false);
      setActiveSection('personal');
    }
  };

  const renderPersonalInfo = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Personal Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Full Name"
          value={resumeData.personalInfo.fullName}
          onChange={(e) => setResumeData(prev => ({
            ...prev,
            personalInfo: { ...prev.personalInfo, fullName: e.target.value }
          }))}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
        />
        <input
          type="email"
          placeholder="Email Address"
          value={resumeData.personalInfo.email}
          onChange={(e) => setResumeData(prev => ({
            ...prev,
            personalInfo: { ...prev.personalInfo, email: e.target.value }
          }))}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
        />
        <input
          type="tel"
          placeholder="Phone Number"
          value={resumeData.personalInfo.phone}
          onChange={(e) => setResumeData(prev => ({
            ...prev,
            personalInfo: { ...prev.personalInfo, phone: e.target.value }
          }))}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
        />
        <input
          type="text"
          placeholder="Location (City, State)"
          value={resumeData.personalInfo.location}
          onChange={(e) => setResumeData(prev => ({
            ...prev,
            personalInfo: { ...prev.personalInfo, location: e.target.value }
          }))}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
        />
        <input
          type="url"
          placeholder="LinkedIn Profile"
          value={resumeData.personalInfo.linkedIn}
          onChange={(e) => setResumeData(prev => ({
            ...prev,
            personalInfo: { ...prev.personalInfo, linkedIn: e.target.value }
          }))}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
        />
        <input
          type="url"
          placeholder="Personal Website/Portfolio"
          value={resumeData.personalInfo.website}
          onChange={(e) => setResumeData(prev => ({
            ...prev,
            personalInfo: { ...prev.personalInfo, website: e.target.value }
          }))}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
        />
      </div>
    </div>
  );

  const renderSummary = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Professional Summary</h3>
      <textarea
        placeholder="Write a compelling professional summary (2-3 sentences highlighting your experience, skills, and career goals)..."
        value={resumeData.summary}
        onChange={(e) => setResumeData(prev => ({ ...prev, summary: e.target.value }))}
        rows={4}
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white resize-none"
      />
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Tip: Include your years of experience, key skills, and what value you bring to employers.
      </p>
    </div>
  );

  const renderExperience = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Work Experience</h3>
        <button
          onClick={addExperience}
          className="flex items-center px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <PlusIcon className="w-4 h-4 mr-1" />
          Add Experience
        </button>
      </div>
      
      {resumeData.experience.map((exp, index) => (
        <div key={exp.id} className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 space-y-3">
          <div className="flex justify-between items-start">
            <h4 className="font-medium text-gray-900 dark:text-white">Experience #{index + 1}</h4>
            <button
              onClick={() => removeExperience(exp.id)}
              className="text-red-600 hover:text-red-800 transition-colors"
            >
              <TrashIcon className="w-4 h-4" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Job Title"
              value={exp.title}
              onChange={(e) => updateExperience(exp.id, 'title', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
            />
            <input
              type="text"
              placeholder="Company Name"
              value={exp.company}
              onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
            />
            <input
              type="text"
              placeholder="Location"
              value={exp.location}
              onChange={(e) => updateExperience(exp.id, 'location', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
            />
            <div className="flex space-x-2">
              <input
                type="date"
                placeholder="Start Date"
                value={exp.startDate}
                onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
              />
              <input
                type="date"
                placeholder="End Date"
                value={exp.endDate}
                onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                disabled={exp.current}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white disabled:opacity-50"
              />
            </div>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id={`current-${exp.id}`}
              checked={exp.current}
              onChange={(e) => updateExperience(exp.id, 'current', e.target.checked)}
              className="mr-2"
            />
            <label htmlFor={`current-${exp.id}`} className="text-sm text-gray-700 dark:text-gray-300">
              I currently work here
            </label>
          </div>
          
          <textarea
            placeholder="Describe your responsibilities and achievements (use bullet points for better readability)..."
            value={exp.description}
            onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white resize-none"
          />
        </div>
      ))}
      
      {resumeData.experience.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <DocumentTextIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>No work experience added yet.</p>
          <p className="text-sm">Click "Add Experience" to get started.</p>
        </div>
      )}
    </div>
  );

  const renderSkills = () => {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Skills</h3>
        
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Add a skill (e.g., JavaScript, Project Management)"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                addSkill(newSkill);
                setNewSkill('');
              }
            }}
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
          />
          <button
            onClick={() => {
              addSkill(newSkill);
              setNewSkill('');
            }}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Add
          </button>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {resumeData.skills.map((skill, index) => (
            <span
              key={index}
              className="inline-flex items-center px-3 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 rounded-full text-sm"
            >
              {skill}
              <button
                onClick={() => removeSkill(skill)}
                className="ml-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-200"
              >
                ×
              </button>
            </span>
          ))}
        </div>
        
        {resumeData.skills.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <p>No skills added yet.</p>
            <p className="text-sm">Add your technical and soft skills above.</p>
          </div>
        )}
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-6xl h-[90vh] flex shadow-2xl">
        {/* Sidebar */}
        <div className="w-64 bg-gray-50 dark:bg-gray-900 rounded-l-2xl p-4 border-r border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Resume Builder</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
          
          <nav className="space-y-2">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center px-3 py-2 rounded-lg text-left transition-colors ${
                  activeSection === section.id
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                <span className="mr-3">{section.icon}</span>
                {section.name}
              </button>
            ))}
          </nav>
          
          <div className="mt-8 space-y-2">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="w-full flex items-center justify-center px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              <EyeIcon className="w-4 h-4 mr-2" />
              {showPreview ? 'Hide Preview' : 'Show Preview'}
            </button>
            
            <button
              onClick={clearAllData}
              className="w-full flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <TrashIcon className="w-4 h-4 mr-2" />
              Clear All Data
            </button>
            
            <button
              onClick={generateResume}
              disabled={isGenerating}
              className="w-full flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              <DocumentTextIcon className="w-4 h-4 mr-2" />
              {isGenerating ? 'Generating...' : 'Generate Resume'}
            </button>
            
            {showPreview && (
              <button
                onClick={downloadResume}
                className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <ArrowDownTrayIcon className="w-4 h-4 mr-2" />
                Download PDF
              </button>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex">
          {/* Form Section */}
          <div className={`${showPreview ? 'w-1/2' : 'w-full'} p-6 overflow-y-auto`}>
            {activeSection === 'personal' && renderPersonalInfo()}
            {activeSection === 'summary' && renderSummary()}
            {activeSection === 'experience' && renderExperience()}
            {activeSection === 'skills' && renderSkills()}
            {/* Add other sections as needed */}
          </div>

          {/* Preview Section */}
          {showPreview && (
            <div className="w-1/2 border-l border-gray-200 dark:border-gray-700 overflow-y-auto">
              <div ref={printRef} className="p-8 bg-white text-black min-h-full">
                {/* Resume Preview */}
                <div className="space-y-6">
                  {/* Header */}
                  <div className="text-center border-b-2 border-gray-300 pb-4">
                    <h1 className="text-3xl font-bold">{resumeData.personalInfo.fullName || 'Your Name'}</h1>
                    <div className="text-sm text-gray-600 mt-2 space-x-4">
                      {resumeData.personalInfo.email && <span>{resumeData.personalInfo.email}</span>}
                      {resumeData.personalInfo.phone && <span>• {resumeData.personalInfo.phone}</span>}
                      {resumeData.personalInfo.location && <span>• {resumeData.personalInfo.location}</span>}
                    </div>
                    <div className="text-sm text-gray-600 mt-1 space-x-4">
                      {resumeData.personalInfo.linkedIn && <span>{resumeData.personalInfo.linkedIn}</span>}
                      {resumeData.personalInfo.website && <span>• {resumeData.personalInfo.website}</span>}
                    </div>
                  </div>

                  {/* Summary */}
                  {resumeData.summary && (
                    <div>
                      <h2 className="text-xl font-bold mb-2">Professional Summary</h2>
                      <p className="text-gray-700">{resumeData.summary}</p>
                    </div>
                  )}

                  {/* Experience */}
                  {resumeData.experience.length > 0 && (
                    <div>
                      <h2 className="text-xl font-bold mb-3">Professional Experience</h2>
                      {resumeData.experience.map((exp) => (
                        <div key={exp.id} className="mb-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold">{exp.title}</h3>
                              <p className="text-gray-600">{exp.company} - {exp.location}</p>
                            </div>
                            <div className="text-sm text-gray-600">
                              {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                            </div>
                          </div>
                          {exp.description && (
                            <div className="mt-2 text-sm text-gray-700">
                              {exp.description.split('\n').map((line, index) => (
                                <p key={index}>{line}</p>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Skills */}
                  {resumeData.skills.length > 0 && (
                    <div>
                      <h2 className="text-xl font-bold mb-2">Skills</h2>
                      <div className="flex flex-wrap gap-2">
                        {resumeData.skills.map((skill, index) => (
                          <span key={index} className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-sm">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;