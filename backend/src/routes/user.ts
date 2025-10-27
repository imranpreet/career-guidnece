import express from 'express';
import authenticateToken from '../middleware/auth';
import User from '../models/User';
import bcrypt from 'bcryptjs';

const router = express.Router();

// Get user profile
router.get('/profile', authenticateToken, async (req: any, res) => {
  try {
    const user = req.user;
    res.json({
      id: user._id,
      email: user.email,
      name: user.name,
      profilePicture: user.profilePicture,
      experience: user.experience,
      skills: user.skills,
      education: user.education,
      professionalBio: user.professionalBio,
      careerGoals: user.careerGoals,
      currentRole: user.currentRole,
      targetRole: user.targetRole,
      stats: {
        completedQuizzes: user.completedQuizzes,
        resumesGenerated: user.resumesGenerated,
        interviewsCompleted: user.interviewsCompleted
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Error fetching profile' });
  }
});

// Update user profile
router.put('/profile', authenticateToken, async (req: any, res) => {
  try {
    const userId = req.user._id;
    const updates = req.body;

    // Remove sensitive fields that shouldn't be updated directly
    delete updates.password;
    delete updates.email;
    delete updates._id;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Error updating profile' });
  }
});

// Change password
router.post('/change-password', authenticateToken, async (req: any, res) => {
  try {
    const userId = req.user._id;
    const { currentPassword, newPassword } = req.body;

    // Validate input
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current password and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters long' });
    }

    // Find user with password field
    const user = await User.findById(userId).select('+password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    user.password = hashedPassword;
    await user.save();

    console.log(`Password changed successfully for user: ${user.email}`);

    res.json({
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Error changing password' });
  }
});

// Get user dashboard stats
router.get('/dashboard', authenticateToken, async (req: any, res) => {
  try {
    const user = req.user;
    
    // Calculate progress score based on activities
    const progressScore = Math.min(100, (
      user.completedQuizzes * 10 + 
      user.resumesGenerated * 20 + 
      user.interviewsCompleted * 15
    ));

    // Generate recent activities based on user stats
    const recentActivities = [];
    
    if (user.interviewsCompleted > 0) {
      recentActivities.push({
        type: 'interview',
        title: 'Completed interview practice session',
        time: '2 hours ago',
        score: Math.floor(Math.random() * 30) + 70,
        icon: 'BriefcaseIcon'
      });
    }
    
    if (user.resumesGenerated > 0) {
      recentActivities.push({
        type: 'resume',
        title: 'Generated AI-powered resume',
        time: user.resumesGenerated === 1 ? '1 day ago' : `${user.resumesGenerated} days ago`,
        icon: 'DocumentTextIcon'
      });
    }
    
    if (user.completedQuizzes > 0) {
      const latestQuizScore = user.quizScores && user.quizScores.length > 0 
        ? user.quizScores[user.quizScores.length - 1].score || Math.floor(Math.random() * 25) + 75
        : Math.floor(Math.random() * 25) + 75;
      
      recentActivities.push({
        type: 'quiz',
        title: 'Completed skills assessment quiz',
        time: user.completedQuizzes === 1 ? '3 days ago' : `${user.completedQuizzes} days ago`,
        score: latestQuizScore,
        icon: 'AcademicCapIcon'
      });
    }

    // Add default activities if user hasn't done much yet
    if (recentActivities.length === 0) {
      recentActivities.push({
        type: 'welcome',
        title: 'Welcome to AI Career Coach!',
        time: 'Today',
        icon: 'SparklesIcon'
      });
    }

    // Calculate average scores from stored scores
    const averageQuizScore = user.quizScores && user.quizScores.length > 0 
      ? Math.round(user.quizScores.reduce((sum: number, scoreObj: any) => sum + scoreObj.score, 0) / user.quizScores.length)
      : 0;
    const averageInterviewScore = user.interviewScores && user.interviewScores.length > 0
      ? Math.round(user.interviewScores.reduce((sum: number, scoreObj: any) => sum + scoreObj.score, 0) / user.interviewScores.length)
      : 0;
    
    const dashboardData = {
      userName: user.name,
      email: user.email,
      experience: user.experience,
      currentRole: user.currentRole || 'Not specified',
      targetRole: user.targetRole || 'Not specified',
      completedQuizzes: user.completedQuizzes,
      resumesGenerated: user.resumesGenerated,
      interviewsCompleted: user.interviewsCompleted,
      progressScore,
      averageQuizScore,
      averageInterviewScore,
      recentActivities,
      recommendations: getRecommendations(user),
      topJobRoles: [
        { title: 'Software Engineer', match: '95%', demand: 'High', salary: '$90k - $130k' },
        { title: 'Product Manager', match: '87%', demand: 'Medium', salary: '$85k - $120k' },
        { title: 'Data Analyst', match: '78%', demand: 'High', salary: '$95k - $140k' },
        { title: 'UX Designer', match: '65%', demand: 'Medium', salary: '$80k - $115k' }
      ]
    };

    res.json(dashboardData);
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ message: 'Error fetching dashboard data' });
  }
});

// Helper function to generate recommendations based on user progress
function getRecommendations(user: any): string[] {
  const recommendations = [];
  
  if (user.completedQuizzes === 0) {
    recommendations.push('Take your first skills assessment quiz');
  } else if (user.completedQuizzes < 3) {
    recommendations.push('Complete more assessment quizzes to improve your profile');
  }
  
  if (user.resumesGenerated === 0) {
    recommendations.push('Generate your first AI-powered resume');
  } else if (user.resumesGenerated < 3) {
    recommendations.push('Create specialized resumes for different roles');
  }
  
  if (user.interviewsCompleted === 0) {
    recommendations.push('Start practicing with mock interviews');
  } else if (user.interviewsCompleted < 5) {
    recommendations.push('Practice more interview scenarios to build confidence');
  }
  
  if (!user.currentRole) {
    recommendations.push('Complete your professional profile');
  }
  
  if (!user.targetRole) {
    recommendations.push('Set your target career goal');
  }
  
  // Add advanced recommendations for active users
  if (user.completedQuizzes >= 3 && user.resumesGenerated >= 2 && user.interviewsCompleted >= 3) {
    recommendations.push('Explore advanced career development resources');
    recommendations.push('Consider networking opportunities in your field');
  }
  
  return recommendations.slice(0, 4); // Limit to 4 recommendations
}

// POST route to update quiz scores
router.post('/quiz-score', authenticateToken, async (req: any, res) => {
  try {
    const { topic, score, totalQuestions, correctAnswers } = req.body;
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Initialize quizScores array if it doesn't exist
    if (!user.quizScores) {
      user.quizScores = [];
    }
    
    // Add quiz score to user's record
    user.quizScores.push({ 
      topic, 
      score, 
      totalQuestions,
      correctAnswers,
      date: new Date() 
    });
    
    // Increment completedQuizzes counter
    user.completedQuizzes = (user.completedQuizzes || 0) + 1;
    
    await user.save();
    
    res.json({ 
      message: 'Quiz score updated successfully',
      stats: {
        completedQuizzes: user.completedQuizzes,
        totalScore: score
      }
    });
  } catch (error) {
    console.error('Quiz score update error:', error);
    res.status(500).json({ message: 'Error updating quiz score' });
  }
});

// POST route to update interview scores
router.post('/interview-score', authenticateToken, async (req: any, res) => {
  try {
    const { type, score, questionsAnswered } = req.body;
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Initialize interviewScores array if it doesn't exist
    if (!user.interviewScores) {
      user.interviewScores = [];
    }
    
    // Add interview score to user's record
    user.interviewScores.push({ 
      type, 
      score,
      questionsAnswered,
      date: new Date() 
    });
    
    // Increment interviewsCompleted counter
    user.interviewsCompleted = (user.interviewsCompleted || 0) + 1;
    
    await user.save();
    
    res.json({ 
      message: 'Interview score updated successfully',
      stats: {
        interviewsCompleted: user.interviewsCompleted,
        averageScore: score
      }
    });
  } catch (error) {
    console.error('Interview score update error:', error);
    res.status(500).json({ message: 'Error updating interview score' });
  }
});

// POST route to increment resume counter
router.post('/resume-generated', authenticateToken, async (req: any, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Increment resumesGenerated counter
    user.resumesGenerated = (user.resumesGenerated || 0) + 1;
    
    await user.save();
    
    res.json({ 
      message: 'Resume generation tracked successfully',
      stats: {
        resumesGenerated: user.resumesGenerated
      }
    });
  } catch (error) {
    console.error('Resume tracking error:', error);
    res.status(500).json({ message: 'Error tracking resume generation' });
  }
});

export default router;