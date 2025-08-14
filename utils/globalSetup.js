/**
 * Global Setup for Playwright Tests
 * Runs once before all tests across all projects
 */

import { chromium } from '@playwright/test';
import { users } from '../test-data/testData.js';

async function globalSetup() {
  console.log('🚀 Starting Global Setup...');
  
  // Performance monitoring
  const setupStart = Date.now();
  
  try {
    // Pre-warm the application by making a health check
    const browser = await chromium.launch({
      args: ['--disable-dev-shm-usage', '--no-sandbox']
    });
    const context = await browser.newContext();
    const page = await context.newPage();
    
    console.log('🔍 Pre-warming application...');
    
    // Navigate to base URL to warm up the application
    const baseURL = process.env.BASE_URL || 'https://www.saucedemo.com';
    await page.goto(baseURL, { waitUntil: 'networkidle' });
    
    // Pre-authenticate a user session for performance optimization
    await page.fill('#user-name', users.standard.username);
    await page.fill('#password', users.standard.password);
    await page.click('#login-button');
    
    // Wait for inventory page to ensure the app is fully loaded
    await page.waitForSelector('.inventory_list', { timeout: 10000 });
    
    console.log('✅ Application pre-warmed successfully');
    
    // Store authentication state for reuse
    await context.storageState({ 
      path: 'test-results/auth-state.json' 
    });
    
    await browser.close();
    
    // Performance metrics
    const setupTime = Date.now() - setupStart;
    console.log(`⚡ Global setup completed in ${setupTime}ms`);
    
    // Environment validation
    console.log(`🌍 Environment: ${process.env.TEST_ENV || 'production'}`);
    console.log(`🎯 Base URL: ${baseURL}`);
    console.log(`🔄 Retries: ${process.env.RETRIES || '3'}`);
    console.log(`👥 Workers: ${process.env.WORKERS || 'auto'}`);
    
    // Sharding info
    if (process.env.SHARD) {
      console.log(`🧩 Shard: ${process.env.SHARD_CURRENT || 1}/${process.env.SHARD_TOTAL || 1}`);
    }
    
  } catch (error) {
    console.error('❌ Global setup failed:', error);
    throw error;
  }
}

export default globalSetup;
