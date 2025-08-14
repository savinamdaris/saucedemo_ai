/**
 * Global Teardown for Playwright Tests
 * Runs once after all tests across all projects
 */

import fs from 'fs';
import path from 'path';

async function globalTeardown() {
  console.log('🧹 Starting Global Teardown...');
  
  const teardownStart = Date.now();
  
  try {
    // Clean up authentication state files
    const authStatePath = 'test-results/auth-state.json';
    if (fs.existsSync(authStatePath)) {
      fs.unlinkSync(authStatePath);
      console.log('🗑️  Cleaned up authentication state');
    }
    
    // Performance summary
    if (process.env.CI) {
      console.log('📊 Generating performance summary...');
      
      const resultsPath = 'test-results/results.json';
      if (fs.existsSync(resultsPath)) {
        const results = JSON.parse(fs.readFileSync(resultsPath, 'utf8'));
        
        const stats = {
          totalTests: results.suites?.reduce((acc, suite) => acc + suite.tests?.length || 0, 0) || 0,
          passed: 0,
          failed: 0,
          skipped: 0,
          duration: 0
        };
        
        // Calculate test statistics
        results.suites?.forEach(suite => {
          suite.tests?.forEach(test => {
            if (test.outcome === 'expected') stats.passed++;
            else if (test.outcome === 'unexpected') stats.failed++;
            else if (test.outcome === 'skipped') stats.skipped++;
            
            stats.duration += test.results?.[0]?.duration || 0;
          });
        });
        
        console.log('📈 Test Execution Summary:');
        console.log(`   ✅ Passed: ${stats.passed}`);
        console.log(`   ❌ Failed: ${stats.failed}`);
        console.log(`   ⏭️  Skipped: ${stats.skipped}`);
        console.log(`   ⏱️  Total Duration: ${Math.round(stats.duration / 1000)}s`);
        console.log(`   📊 Success Rate: ${Math.round((stats.passed / stats.totalTests) * 100)}%`);
      }
    }
    
    // Clean up temporary files older than 1 day
    const tempDirs = ['test-results', 'playwright-report'];
    tempDirs.forEach(dir => {
      if (fs.existsSync(dir)) {
        const files = fs.readdirSync(dir, { withFileTypes: true });
        files.forEach(file => {
          const filePath = path.join(dir, file.name);
          if (file.isFile()) {
            const stats = fs.statSync(filePath);
            const ageInHours = (Date.now() - stats.mtime.getTime()) / (1000 * 60 * 60);
            
            // Clean files older than 24 hours (except current run)
            if (ageInHours > 24 && !file.name.includes(new Date().toISOString().split('T')[0])) {
              try {
                fs.unlinkSync(filePath);
                console.log(`🗑️  Cleaned up old file: ${filePath}`);
              } catch (e) {
                // Ignore cleanup errors
              }
            }
          }
        });
      }
    });
    
    const teardownTime = Date.now() - teardownStart;
    console.log(`✅ Global teardown completed in ${teardownTime}ms`);
    
  } catch (error) {
    console.error('❌ Global teardown error:', error);
    // Don't fail the entire test run due to teardown issues
  }
}

export default globalTeardown;
