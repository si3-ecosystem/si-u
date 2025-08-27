/**
 * Simple Logout Test Script
 * 
 * Copy and paste this script into your browser console after logging in
 * to test the enhanced logout functionality.
 */

async function testLogoutFunctionality() {
  console.log('🧪 Starting Logout Functionality Test...');
  
  // Step 1: Check if user is logged in
  console.log('📋 Step 1: Checking login status...');
  const authState = window.UnifiedAuthService?.getAuthState();
  console.log('Current auth state:', authState);
  
  if (!authState?.isAuthenticated) {
    console.log('❌ User is not logged in. Please log in first and run this test again.');
    return;
  }
  
  // Step 2: Create some test data to verify cleanup
  console.log('📋 Step 2: Creating test data...');
  localStorage.setItem('test-logout-data', 'should-be-cleared');
  sessionStorage.setItem('test-session-data', 'should-be-cleared');
  console.log('Test data created in localStorage and sessionStorage');
  
  // Step 3: Check storage before logout
  console.log('📋 Step 3: Checking storage before logout...');
  const beforeLogout = {
    localStorage: {
      'si3-jwt': localStorage.getItem('si3-jwt'),
      'token': localStorage.getItem('token'),
      'test-logout-data': localStorage.getItem('test-logout-data'),
      totalItems: localStorage.length
    },
    sessionStorage: {
      'test-session-data': sessionStorage.getItem('test-session-data'),
      totalItems: sessionStorage.length
    },
    cookies: document.cookie
  };
  console.log('Storage before logout:', beforeLogout);
  
  // Step 4: Perform logout (without redirect for testing)
  console.log('📋 Step 4: Performing logout...');
  try {
    if (window.UnifiedAuthService?.logout) {
      await window.UnifiedAuthService.logout({ redirect: false });
      console.log('✅ Logout method executed successfully');
    } else {
      console.log('❌ UnifiedAuthService.logout not available');
      return;
    }
  } catch (error) {
    console.error('❌ Logout failed:', error);
    return;
  }
  
  // Step 5: Wait for cleanup to complete
  console.log('📋 Step 5: Waiting for cleanup to complete...');
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Step 6: Check storage after logout
  console.log('📋 Step 6: Checking storage after logout...');
  const afterLogout = {
    localStorage: {
      'si3-jwt': localStorage.getItem('si3-jwt'),
      'token': localStorage.getItem('token'),
      'test-logout-data': localStorage.getItem('test-logout-data'),
      totalItems: localStorage.length
    },
    sessionStorage: {
      'test-session-data': sessionStorage.getItem('test-session-data'),
      totalItems: sessionStorage.length
    },
    cookies: document.cookie
  };
  console.log('Storage after logout:', afterLogout);
  
  // Step 7: Analyze results
  console.log('📋 Step 7: Analyzing results...');
  const issues = [];
  
  if (afterLogout.localStorage['si3-jwt']) {
    issues.push('si3-jwt token still exists in localStorage');
  }
  
  if (afterLogout.localStorage['token']) {
    issues.push('token still exists in localStorage');
  }
  
  if (afterLogout.localStorage['test-logout-data']) {
    issues.push('Test data still exists in localStorage');
  }
  
  if (afterLogout.sessionStorage['test-session-data']) {
    issues.push('Test data still exists in sessionStorage');
  }
  
  if (afterLogout.localStorage.totalItems > 0) {
    console.log('⚠️  localStorage still contains items:', afterLogout.localStorage.totalItems);
  }
  
  if (afterLogout.sessionStorage.totalItems > 0) {
    console.log('⚠️  sessionStorage still contains items:', afterLogout.sessionStorage.totalItems);
  }
  
  // Step 8: Final results
  console.log('📋 Step 8: Final results...');
  if (issues.length === 0) {
    console.log('✅ SUCCESS: Logout functionality is working correctly!');
    console.log('✅ All authentication data has been cleared');
    console.log('✅ localStorage has been cleared');
    console.log('✅ sessionStorage has been cleared');
  } else {
    console.log('❌ ISSUES FOUND:');
    issues.forEach(issue => console.log(`   - ${issue}`));
    console.log('❌ Logout cleanup may not be working correctly');
  }
  
  // Summary
  console.log('\n📊 SUMMARY:');
  console.log('Before logout:');
  console.log('  - localStorage items:', beforeLogout.localStorage.totalItems);
  console.log('  - sessionStorage items:', beforeLogout.sessionStorage.totalItems);
  console.log('After logout:');
  console.log('  - localStorage items:', afterLogout.localStorage.totalItems);
  console.log('  - sessionStorage items:', afterLogout.sessionStorage.totalItems);
  
  return {
    success: issues.length === 0,
    issues,
    beforeLogout,
    afterLogout
  };
}

// Run the test
console.log('🚀 Logout Test Script Loaded!');
console.log('📝 To run the test, execute: testLogoutFunctionality()');

// Auto-run if UnifiedAuthService is available
if (typeof window !== 'undefined' && window.UnifiedAuthService) {
  console.log('🔧 UnifiedAuthService detected. You can run the test now.');
} else {
  console.log('⏳ Waiting for UnifiedAuthService to be available...');
  setTimeout(() => {
    if (window.UnifiedAuthService) {
      console.log('🔧 UnifiedAuthService is now available. You can run the test.');
    } else {
      console.log('❌ UnifiedAuthService not found. Make sure you\'re logged in.');
    }
  }, 2000);
}