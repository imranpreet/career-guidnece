// Test script to verify user stats are working
const fetch = require('node-fetch');

async function testUserStats() {
  const baseURL = 'http://localhost:5000/api';
  
  try {
    // Test with a sample login to get actual token
    console.log('Testing user statistics tracking...\n');
    
    // Create a test user first
    const registerResponse = await fetch(`${baseURL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test User',
        email: 'testuser@example.com',
        password: 'testpass123',
        experience: 'mid'
      })
    });
    
    let userData;
    if (registerResponse.status === 201) {
      userData = await registerResponse.json();
      console.log('✅ New test user created');
    } else {
      // User might already exist, try to login
      const loginResponse = await fetch(`${baseURL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'testuser@example.com',
          password: 'testpass123'
        })
      });
      
      if (loginResponse.ok) {
        userData = await loginResponse.json();
        console.log('✅ Logged in existing test user');
      } else {
        throw new Error('Failed to login test user');
      }
    }
    
    const token = userData.token;
    
    // Check initial dashboard stats
    const dashboardResponse = await fetch(`${baseURL}/user/dashboard`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (dashboardResponse.ok) {
      const dashboardData = await dashboardResponse.json();
      console.log('\n📊 Initial Dashboard Stats:');
      console.log(`Completed Quizzes: ${dashboardData.completedQuizzes}`);
      console.log(`Resumes Generated: ${dashboardData.resumesGenerated}`);
      console.log(`Interviews Completed: ${dashboardData.interviewsCompleted}`);
      console.log(`Progress Score: ${dashboardData.progressScore}%`);
      
      // Test quiz completion
      console.log('\n🧠 Testing quiz completion...');
      const quizResponse = await fetch(`${baseURL}/quiz/javascript/submit`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          answers: ['answer1', 'answer2', 'answer3']
        })
      });
      
      if (quizResponse.ok) {
        console.log('✅ Quiz submitted successfully');
      }
      
      // Test interview completion
      console.log('\n🎯 Testing interview completion...');
      const interviewResponse = await fetch(`${baseURL}/interview/submit`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type: 'behavioral',
          questions: [{ id: 1, question: 'Test question' }],
          answers: ['Test answer'],
          timeSpent: 300
        })
      });
      
      if (interviewResponse.ok) {
        console.log('✅ Interview submitted successfully');
      }
      
      // Test resume generation
      console.log('\n📄 Testing resume generation...');
      const resumeResponse = await fetch(`${baseURL}/resume/generate`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          personalInfo: {
            fullName: 'Test User',
            email: 'test@example.com',
            phone: '1234567890',
            location: 'Test City'
          },
          summary: 'Test summary',
          experience: [],
          skills: ['JavaScript', 'React']
        })
      });
      
      if (resumeResponse.ok) {
        console.log('✅ Resume generated successfully');
      }
      
      // Check updated dashboard stats
      const updatedDashboardResponse = await fetch(`${baseURL}/user/dashboard`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (updatedDashboardResponse.ok) {
        const updatedDashboardData = await updatedDashboardResponse.json();
        console.log('\n📊 Updated Dashboard Stats:');
        console.log(`Completed Quizzes: ${updatedDashboardData.completedQuizzes}`);
        console.log(`Resumes Generated: ${updatedDashboardData.resumesGenerated}`);
        console.log(`Interviews Completed: ${updatedDashboardData.interviewsCompleted}`);
        console.log(`Progress Score: ${updatedDashboardData.progressScore}%`);
        
        const improvements = {
          quizzes: updatedDashboardData.completedQuizzes - dashboardData.completedQuizzes,
          resumes: updatedDashboardData.resumesGenerated - dashboardData.resumesGenerated,
          interviews: updatedDashboardData.interviewsCompleted - dashboardData.interviewsCompleted
        };
        
        console.log('\n🎉 Improvements:');
        console.log(`Quizzes: +${improvements.quizzes}`);
        console.log(`Resumes: +${improvements.resumes}`);
        console.log(`Interviews: +${improvements.interviews}`);
      }
      
    } else {
      console.error('❌ Failed to fetch dashboard data');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testUserStats();