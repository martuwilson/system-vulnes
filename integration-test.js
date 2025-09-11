// Test E2E rápido para verificar la integración Frontend-Backend
const axios = require('axios');

const API_URL = 'http://localhost:3001/graphql';
const FRONTEND_URL = 'http://localhost:3000';

async function testBackendHealth() {
  console.log('🔍 Testing Backend Health...');
  
  try {
    // Test GraphQL endpoint
    const response = await axios.post(API_URL, {
      query: `
        query {
          __schema {
            types {
              name
            }
          }
        }
      `
    }, {
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (response.status === 200) {
      console.log('✅ Backend GraphQL API is working');
      console.log(`   - Found ${response.data.data.__schema.types.length} GraphQL types`);
      return true;
    }
  } catch (error) {
    console.error('❌ Backend test failed:', error.message);
    return false;
  }
}

async function testFrontendHealth() {
  console.log('🔍 Testing Frontend Health...');
  
  try {
    const response = await axios.get(FRONTEND_URL);
    
    if (response.status === 200) {
      console.log('✅ Frontend is serving correctly');
      return true;
    }
  } catch (error) {
    console.error('❌ Frontend test failed:', error.message);
    return false;
  }
}

async function runIntegrationTest() {
  console.log('🚀 Starting Integration Test...\n');
  
  const backendOk = await testBackendHealth();
  const frontendOk = await testFrontendHealth();
  
  console.log('\n📊 Test Results:');
  console.log(`Backend API: ${backendOk ? '✅ WORKING' : '❌ FAILED'}`);
  console.log(`Frontend App: ${frontendOk ? '✅ WORKING' : '❌ FAILED'}`);
  
  if (backendOk && frontendOk) {
    console.log('\n🎉 INTEGRATION TEST PASSED!');
    console.log('Your Security System MVP is ready for testing!');
    console.log('\n📝 Next Steps:');
    console.log('1. Open http://localhost:3000 in your browser');
    console.log('2. Try registering a new user');
    console.log('3. Add a domain and run security scans');
    console.log('4. Explore the dashboard and scan results');
  } else {
    console.log('\n❌ INTEGRATION TEST FAILED');
    console.log('Please check that both services are running properly');
  }
}

runIntegrationTest();
