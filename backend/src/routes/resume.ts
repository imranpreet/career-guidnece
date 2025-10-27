import express from 'express';
import authenticateToken from '../middleware/auth';
import Resume from '../models/Resume';
import User from '../models/User';

const router = express.Router();

// Create new resume
router.post('/create', authenticateToken, async (req: any, res) => {
  try {
    const userId = req.user._id;
    const resumeData = req.body;

    const resume = new Resume({
      userId,
      ...resumeData
    });

    await resume.save();

    // Update user's resume count
    await User.findByIdAndUpdate(userId, {
      $inc: { resumesGenerated: 1 }
    });

    res.status(201).json({
      message: 'Resume created successfully',
      resume
    });
  } catch (error) {
    console.error('Create resume error:', error);
    res.status(500).json({ message: 'Error creating resume' });
  }
});

// Get user's resumes
router.get('/list', authenticateToken, async (req: any, res) => {
  try {
    const userId = req.user._id;
    const resumes = await Resume.find({ userId }).sort({ createdAt: -1 });

    res.json({
      resumes: resumes.map(resume => ({
        id: resume._id,
        personalInfo: resume.personalInfo,
        template: resume.template,
        createdAt: resume.createdAt,
        updatedAt: resume.updatedAt
      }))
    });
  } catch (error) {
    console.error('Get resumes error:', error);
    res.status(500).json({ message: 'Error fetching resumes' });
  }
});

// Get specific resume
router.get('/:id', authenticateToken, async (req: any, res) => {
  try {
    const userId = req.user._id;
    const resumeId = req.params.id;

    const resume = await Resume.findOne({ _id: resumeId, userId });

    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    res.json({ resume });
  } catch (error) {
    console.error('Get resume error:', error);
    res.status(500).json({ message: 'Error fetching resume' });
  }
});

// Update resume
router.put('/:id', authenticateToken, async (req: any, res) => {
  try {
    const userId = req.user._id;
    const resumeId = req.params.id;
    const updates = req.body;

    const resume = await Resume.findOneAndUpdate(
      { _id: resumeId, userId },
      updates,
      { new: true, runValidators: true }
    );

    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    res.json({
      message: 'Resume updated successfully',
      resume
    });
  } catch (error) {
    console.error('Update resume error:', error);
    res.status(500).json({ message: 'Error updating resume' });
  }
});

// Delete resume
router.delete('/:id', authenticateToken, async (req: any, res) => {
  try {
    const userId = req.user._id;
    const resumeId = req.params.id;

    const resume = await Resume.findOneAndDelete({ _id: resumeId, userId });

    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    res.json({ message: 'Resume deleted successfully' });
  } catch (error) {
    console.error('Delete resume error:', error);
    res.status(500).json({ message: 'Error deleting resume' });
  }
});

// Generate AI-powered resume suggestions
router.post('/ai-suggestions', authenticateToken, async (req: any, res) => {
  try {
    const user = req.user;
    
    // Mock AI suggestions - in production, integrate with OpenAI API
    const suggestions = {
      professionalSummary: `Dynamic ${user.experience} professional with expertise in ${user.skills.join(', ')}. Proven track record of delivering high-quality results and driving innovation in fast-paced environments.`,
      skills: {
        recommended: ['Communication', 'Problem Solving', 'Leadership', 'Project Management'],
        trending: ['Machine Learning', 'Cloud Computing', 'Data Analysis', 'Agile Methodologies']
      },
      improvements: [
        'Add quantifiable achievements to experience descriptions',
        'Include relevant certifications',
        'Highlight key projects with measurable impact',
        'Optimize keywords for ATS systems'
      ]
    };

    res.json({ suggestions });
  } catch (error) {
    console.error('AI suggestions error:', error);
    res.status(500).json({ message: 'Error generating AI suggestions' });
  }
});

// Generate resume (process resume data)
router.post('/generate', authenticateToken, async (req: any, res) => {
  try {
    const userId = req.user._id;
    const resumeData = req.body;
    
    console.log('Received resume data:', JSON.stringify(resumeData, null, 2));
    
    // Validate required fields
    if (!resumeData || typeof resumeData !== 'object') {
      return res.status(400).json({ 
        message: 'Invalid resume data format' 
      });
    }

    if (!resumeData.personalInfo) {
      return res.status(400).json({ 
        message: 'Personal information section is required' 
      });
    }

    if (!resumeData.personalInfo.fullName || !resumeData.personalInfo.email) {
      return res.status(400).json({ 
        message: 'Personal information (name and email) is required',
        missing: {
          fullName: !resumeData.personalInfo.fullName,
          email: !resumeData.personalInfo.email
        }
      });
    }

    console.log('Resume validation passed, generating...');

    // Update user's resume count
    await User.findByIdAndUpdate(userId, {
      $inc: { resumesGenerated: 1 }
    });

    // Here you would typically:
    // 1. Process the resume data
    // 2. Generate a PDF or HTML version
    // 3. Store it in the database
    // 4. Return the generated resume URL or data

    console.log('Resume validation passed, generating...');

    // For now, we'll just return a success response
    res.json({
      message: 'Resume generated successfully',
      resumeData: {
        personalInfo: resumeData.personalInfo,
        summary: resumeData.summary || '',
        experienceCount: resumeData.experience?.length || 0,
        educationCount: resumeData.education?.length || 0,
        skillsCount: resumeData.skills?.length || 0,
        projectsCount: resumeData.projects?.length || 0,
        certificationsCount: resumeData.certifications?.length || 0
      },
      generatedAt: new Date(),
      success: true
    });

  } catch (error) {
    console.error('Generate resume error:', error);
    res.status(500).json({ 
      message: 'Error generating resume',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;