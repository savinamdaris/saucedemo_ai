/**
 * Global Setup for Playwright Tests
 * Runs once before all tests across all projects
 */

import { chromium, firefox, webkit } from '@playwright/test';
import { users } from '../test-data/testData.js';

async function globalSetup() {
  console.log('🚀 Starting Global Setup...');
  
  // Performance monitoring
  const setupStart = Date.now();
  
  try {
    // Determine which browser to use based on environment or use a lightweight approach
    const baseURL = process.env.BASE_URL || 'https://www.saucedemo.com';
    
    // Use a simple HTTP check instead of browser-based setup for sharded runs
    if (process.env.SHARD === 'true') {
      console.log('🧩 Sharded execution detected, using lightweight setup...');
      
      // Simple HTTP check to verify the application is accessible
      try {
        const response = await fetch(baseURL);
        if (response.ok) {
          console.log('✅ Application is accessible via HTTP check');
        } else {
          console.warn(`⚠️ Application returned status: ${response.status}`);
        }
      } catch (error) {
        console.warn('⚠️ HTTP check failed, but continuing with tests:', error.message);
      }
      
      // Performance metrics for sharded setup
      const setupTime = Date.now() - setupStart;
      console.log(`⚡ Lightweight global setup completed in ${setupTime}ms`);
      
    } else {
      // Full browser-based setup for non-sharded runs
      console.log('🌐 Full browser setup for non-sharded execution...');
      
      // Try to use the first available browser
      let browser;
      try {
        browser = await chromium.launch({
          args: ['--disable-dev-shm-usage', '--no-sandbox', '--disable-web-security']
        });
      } catch (chromiumError) {
        console.log('Chromium not available, trying Firefox...');
        try {
          browser = await firefox.launch({
            args: ['--disable-dev-shm-usage']
          });
        } catch (firefoxError) {
          console.log('Firefox not available, trying WebKit...');
          browser = await webkit.launch({
            args: ['--disable-web-security']
          });
        }
      }
      
      if (browser) {
        const context = await browser.newContext({
          // Performance optimizations
          ignoreHTTPSErrors: true,
          reducedMotion: 'reduce',
        });
        const page = await context.newPage();
        
        console.log('🔍 Pre-warming application...');
        
        // Navigate to base URL with increased timeout
        await page.goto(baseURL, { 
          waitUntil: 'domcontentloaded',
          timeout: 15000 
        });
        
        // Pre-authenticate with better error handling
        try {
          await page.waitForSelector('#user-name', { timeout: 10000 });
          await page.fill('#user-name', users.standard.username);
          await page.fill('#password', users.standard.password);
          await page.click('#login-button');
          
          // Wait for inventory page with timeout
          await page.waitForSelector('.inventory_list', { timeout: 15000 });
          
          console.log('✅ Application pre-warmed successfully');
          
          // Store authentication state for reuse
          await context.storageState({ 
            path: 'test-results/auth-state.json' 
          });
          
        } catch (authError) {
          console.warn('⚠️ Pre-authentication failed, but continuing:', authError.message);
        }
        
        await browser.close();
      }
      
      // Performance metrics
      const setupTime = Date.now() - setupStart;
      console.log(`⚡ Full global setup completed in ${setupTime}ms`);
    }
    
    // Environment info
    console.log(`🌍 Environment: ${process.env.TEST_ENV || 'production'}`);
    console.log(`🎯 Base URL: ${baseURL}`);
    console.log(`🔄 Retries: ${process.env.RETRIES || '3'}`);
    console.log(`👥 Workers: ${process.env.WORKERS || 'auto'}`);
    
    // Sharding info
    if (process.env.SHARD === 'true') {
      console.log(`🧩 Shard: ${process.env.SHARD_CURRENT || 1}/${process.env.SHARD_TOTAL || 1}`);
    }
    
  } catch (error) {
    console.warn('⚠️ Global setup encountered issues but continuing:', error.message);
    // Don't fail the entire test run due to setup issues
  }
}

export default globalSetup;
