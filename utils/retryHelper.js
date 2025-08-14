/**
 * Smart Retry Helper for Playwright Tests
 * Provides intelligent retry mechanisms with different strategies
 */

import { test } from '@playwright/test';

export class RetryHelper {
  /**
   * Retry with exponential backoff
   * @param {Function} action - The action to retry
   * @param {Object} options - Retry options
   */
  static async withExponentialBackoff(action, options = {}) {
    const {
      maxRetries = 3,
      baseDelay = 1000,
      maxDelay = 10000,
      factor = 2,
      jitter = true
    } = options;

    let lastError;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await action();
      } catch (error) {
        lastError = error;
        
        if (attempt === maxRetries) {
          throw error;
        }
        
        // Calculate delay with exponential backoff
        let delay = Math.min(baseDelay * Math.pow(factor, attempt), maxDelay);
        
        // Add jitter to prevent thundering herd
        if (jitter) {
          delay = delay + Math.random() * 1000;
        }
        
        console.log(`⚠️  Attempt ${attempt + 1} failed, retrying in ${Math.round(delay)}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    throw lastError;
  }

  /**
   * Retry with different strategies based on error type
   * @param {Function} action - The action to retry
   * @param {Object} options - Retry options
   */
  static async withSmartRetry(action, options = {}) {
    const {
      maxRetries = 3,
      retryCondition = () => true,
      onRetry = () => {},
      timeoutMultiplier = 1.5
    } = options;

    let lastError;
    let currentTimeout = 30000; // Default timeout
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        // Increase timeout on each retry
        const timeoutOptions = { timeout: Math.round(currentTimeout) };
        return await action(timeoutOptions);
        
      } catch (error) {
        lastError = error;
        
        if (attempt === maxRetries) {
          throw error;
        }
        
        // Check if we should retry based on error type
        if (!retryCondition(error, attempt)) {
          throw error;
        }
        
        // Handle different error types with specific strategies
        const retryStrategy = this.getRetryStrategy(error);
        console.log(`⚠️  ${retryStrategy.reason}, attempt ${attempt + 1}/${maxRetries + 1}`);
        
        // Execute retry callback
        await onRetry(error, attempt);
        
        // Apply retry strategy
        await this.executeRetryStrategy(retryStrategy);
        
        // Increase timeout for next attempt
        currentTimeout *= timeoutMultiplier;
      }
    }
    
    throw lastError;
  }

  /**
   * Determine retry strategy based on error type
   * @param {Error} error - The error that occurred
   */
  static getRetryStrategy(error) {
    const errorMessage = error.message.toLowerCase();
    
    if (errorMessage.includes('timeout')) {
      return {
        type: 'timeout',
        delay: 2000,
        reason: 'Timeout detected, waiting before retry'
      };
    }
    
    if (errorMessage.includes('network') || errorMessage.includes('connection')) {
      return {
        type: 'network',
        delay: 3000,
        reason: 'Network issue detected, waiting for recovery'
      };
    }
    
    if (errorMessage.includes('element') || errorMessage.includes('locator')) {
      return {
        type: 'element',
        delay: 1500,
        reason: 'Element not found, waiting for DOM updates'
      };
    }
    
    if (errorMessage.includes('navigation') || errorMessage.includes('loading')) {
      return {
        type: 'navigation',
        delay: 5000,
        reason: 'Navigation issue, waiting for page to stabilize'
      };
    }
    
    // Default strategy
    return {
      type: 'general',
      delay: 2000,
      reason: 'General error, applying standard retry'
    };
  }

  /**
   * Execute the retry strategy
   * @param {Object} strategy - The retry strategy to execute
   */
  static async executeRetryStrategy(strategy) {
    const { type, delay } = strategy;
    
    switch (type) {
      case 'network':
        // Add network-specific recovery logic
        console.log('🌐 Checking network connectivity...');
        break;
        
      case 'element':
        // Add DOM-specific recovery logic
        console.log('🔍 Waiting for DOM stabilization...');
        break;
        
      case 'navigation':
        // Add navigation-specific recovery logic
        console.log('🧭 Waiting for navigation to complete...');
        break;
        
      default:
        console.log('⏳ Standard retry delay...');
    }
    
    await new Promise(resolve => setTimeout(resolve, delay));
  }

  /**
   * Retry wrapper for Playwright test steps
   * @param {Function} testStep - The test step to retry
   * @param {Object} options - Retry options
   */
  static retryStep(testStep, options = {}) {
    return async (...args) => {
      return await this.withSmartRetry(
        async (timeoutOptions = {}) => {
          return await testStep(...args, timeoutOptions);
        },
        options
      );
    };
  }

  /**
   * Create a retry-enabled test
   * @param {string} title - Test title
   * @param {Function} testFn - Test function
   * @param {Object} retryOptions - Retry configuration
   */
  static test(title, testFn, retryOptions = {}) {
    return test(title, async (testInfo) => {
      const { maxRetries = 2, retryCondition } = retryOptions;
      
      // Override test retry configuration
      testInfo.retry = maxRetries;
      
      return await this.withSmartRetry(
        async () => await testFn(testInfo),
        {
          maxRetries,
          retryCondition,
          onRetry: (error, attempt) => {
            console.log(`🔄 Test "${title}" retry ${attempt + 1}: ${error.message}`);
          }
        }
      );
    });
  }
}

/**
 * Common retry conditions
 */
export const retryConditions = {
  // Retry only on timeout and network errors
  onTimeoutOrNetwork: (error) => {
    const msg = error.message.toLowerCase();
    return msg.includes('timeout') || msg.includes('network') || msg.includes('connection');
  },
  
  // Retry on element-related errors
  onElementErrors: (error) => {
    const msg = error.message.toLowerCase();
    return msg.includes('element') || msg.includes('locator') || msg.includes('visible');
  },
  
  // Never retry assertion errors (test logic issues)
  notOnAssertions: (error) => {
    return !error.message.includes('expect');
  },
  
  // Custom retry condition combining multiple factors
  smart: (error, attempt) => {
    const msg = error.message.toLowerCase();
    
    // Don't retry assertion errors
    if (msg.includes('expect') || msg.includes('assertion')) {
      return false;
    }
    
    // Don't retry after 2 attempts for element errors
    if ((msg.includes('element') || msg.includes('locator')) && attempt >= 2) {
      return false;
    }
    
    // Always retry timeout and network errors
    if (msg.includes('timeout') || msg.includes('network')) {
      return true;
    }
    
    // Default: retry other errors up to limit
    return attempt < 2;
  }
};

export default RetryHelper;
