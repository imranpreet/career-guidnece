// Quick test script to verify authentication
const testAuth = async () => {
  console.log('🧪 Testing AI Career Coach Authentication\n');
  
  // Test 1: Register a new user
  console.log('📝 Test 1: Registering a new user...');
  try {
    const registerResponse = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        password: 'Test123!',
        experience: 'entry',
        skills: ['JavaScript', 'React', 'Node.js'],
        education: 'Computer Science'
      }),
    });

    const registerData = await registerResponse.json();
    
    if (registerResponse.ok) {
      console.log('✅ Registration successful!');
      console.log('Token:', registerData.token.substring(0, 20) + '...');
      console.log('User:', registerData.user);
    } else {
      console.log('⚠️  Registration response:', registerData.message);
      console.log('(This is okay if user already exists)\n');
    }
  } catch (error) {
    console.error('❌ Registration error:', error.message);
  }

  // Test 2: Login with the user
  console.log('\n🔐 Test 2: Logging in...');
  try {
    const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'Test123!'
      }),
    });

    const loginData = await loginResponse.json();
    
    if (loginResponse.ok) {
      console.log('✅ Login successful!');
      console.log('Token:', loginData.token.substring(0, 20) + '...');
      console.log('User:', loginData.user);
    } else {
      console.log('❌ Login failed:', loginData.message);
    }
  } catch (error) {
    console.error('❌ Login error:', error.message);
  }

  console.log('\n📋 Summary:');
  console.log('- If registration worked, you can now login with:');
  console.log('  Email: test@example.com');
  console.log('  Password: Test123!');
  console.log('- Create your own account on the website with any email/password');
  console.log('- Make sure backend is running on port 5000');
};

testAuth();
