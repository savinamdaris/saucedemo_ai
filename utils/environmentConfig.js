/**
 * Environment Configuration Helper
 * Manages environment variables and configuration settings for tests
 */

class EnvironmentConfig {
  constructor() {
    this.config = {
      // Base URL configuration
      baseURL: process.env.BASE_URL || 'https://www.saucedemo.com',
      
      // Timeout configurations
      actionTimeout: parseInt(process.env.TIMEOUT) || 30000,
      navigationTimeout: parseInt(process.env.TIMEOUT) || 30000,
      
      // Test execution settings
      retries: process.env.CI ? (parseInt(process.env.RETRIES) || 2) : 0,
      headless: process.env.HEADLESS !== 'false',
      slowMo: parseInt(process.env.SLOW_MO) || 0,
      
      // Environment identification
      isCI: !!process.env.CI,
      testEnv: process.env.TEST_ENV || 'production',
      
      // Browser settings
      ignoreHTTPSErrors: true,
      
      // Reporting settings
      reportOpen: process.env.REPORT_OPEN === 'true'
    };
  }

  /**
   * Get the base URL for the current environment
   * @returns {string} Base URL
   */
  getBaseURL() {
    return this.config.baseURL;
  }

  /**
   * Get timeout settings
   * @returns {object} Timeout configuration
   */
  getTimeouts() {
    return {
      actionTimeout: this.config.actionTimeout,
      navigationTimeout: this.config.navigationTimeout
    };
  }

  /**
   * Check if running in CI environment
   * @returns {boolean} True if in CI
   */
  isCI() {
    return this.config.isCI;
  }

  /**
   * Get current test environment
   * @returns {string} Environment name (dev, staging, production)
   */
  getEnvironment() {
    return this.config.testEnv;
  }

  /**
   * Get retry configuration
   * @returns {number} Number of retries
   */
  getRetries() {
    return this.config.retries;
  }

  /**
   * Get browser configuration
   * @returns {object} Browser settings
   */
  getBrowserConfig() {
    return {
      headless: this.config.headless,
      slowMo: this.config.slowMo,
      ignoreHTTPSErrors: this.config.ignoreHTTPSErrors
    };
  }

  /**
   * Get environment-specific test data
   * @returns {object} Environment-specific configuration
   */
  getTestData() {
    const environments = {
      development: {
        users: {
          standard: 'dev_user',
          admin: 'dev_admin'
        },
        features: {
          debugMode: true,
          mockData: true
        }
      },
      staging: {
        users: {
          standard: 'staging_user',
          admin: 'staging_admin'  
        },
        features: {
          debugMode: false,
          mockData: false
        }
      },
      production: {
        users: {
          standard: 'standard_user',
          admin: 'admin_user'
        },
        features: {
          debugMode: false,
          mockData: false
        }
      }
    };

    return environments[this.config.testEnv] || environments.production;
  }

  /**
   * Log current configuration (for debugging)
   */
  logConfig() {
    if (this.config.isCI) {
      console.log('🚀 Running in CI environment');
      console.log(`📍 Environment: ${this.config.testEnv}`);
      console.log(`🌐 Base URL: ${this.config.baseURL}`);
      console.log(`⏱️  Timeout: ${this.config.actionTimeout}ms`);
      console.log(`🔄 Retries: ${this.config.retries}`);
    }
  }

  /**
   * Validate environment configuration
   * @returns {boolean} True if configuration is valid
   */
  validateConfig() {
    const required = ['baseURL'];
    
    for (const key of required) {
      if (!this.config[key]) {
        throw new Error(`Missing required configuration: ${key}`);
      }
    }

    // Validate URL format
    try {
      new URL(this.config.baseURL);
    } catch (error) {
      throw new Error(`Invalid BASE_URL format: ${this.config.baseURL}`);
    }

    return true;
  }
}

// Export singleton instance
const environmentConfig = new EnvironmentConfig();
environmentConfig.validateConfig();

export default environmentConfig;
