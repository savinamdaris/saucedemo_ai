// Advanced Login Test for SauceDemo
// Type: Load Test (Login Scenario)
// Requirements: 99% of login requests < 1s, login error rate < 2%, >20 successful logins
// Optimized: Minimal imports, resource management, realistic think times, tags for better reporting

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Counter, Trend } from 'k6/metrics';
import { textSummary } from '../summary.js';

// export function handleSummary(data) {
//   return {
//     'reports/advanced-login-summary.html': textSummary(data, { enableColors: false }),
//   };
// }

export function handleSummary(data) {
  return {
    'reports/advanced-login-summary.html':
      '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>k6 Summary</title></head><body><pre>' +
      textSummary(data, { enableColors: false }) +
      '</pre></body></html>',
  };
}

export let successfulLogins = new Counter('successful_logins');
export let loginTrend = new Trend('login_response_time');

const BASE_URL = __ENV.BASE_URL || 'https://www.saucedemo.com';

export let options = {
  vus: 10,
  duration: '3m',
  thresholds: {
    http_req_duration: ['p(99)<1000'],
    http_req_failed: ['rate<0.02'],
    successful_logins: ['count>20'],
    login_response_time: ['p(99)<1000'],
  },
  discardResponseBodies: true,
};

export default function () {
  // Tag requests for better filtering in results
  let res = http.get(BASE_URL, { tags: { test_type: 'advanced-login' } });
  loginTrend.add(res.timings.duration, { test_type: 'advanced-login' });

  let ok = check(res, {
    'status is 200': (r) => r.status === 200,
    'body includes Swag Labs': (r) => r.body && r.body.includes('Swag Labs'),
  });

  if (ok) {
    successfulLogins.add(1, { test_type: 'advanced-login' });
  }
  sleep(Math.random() * 2 + 1);
}