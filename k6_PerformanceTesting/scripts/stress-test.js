// Stress Test for SauceDemo
// Type: Stress Test
// Requirements: 95% of requests < 2s, error rate < 5%
// Optimized: Minimal imports, resource management, realistic think times, tags for better reporting

import http from 'k6/http';
import { check, sleep } from 'k6';
import { textSummary } from '../summary.js';

export function handleSummary(data) {
  return {
    'reports/stress-test-summary.html':
      '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>k6 Summary</title></head><body><pre>' +
      textSummary(data, { enableColors: false }) +
      '</pre></body></html>',
  };
}

export let options = {
  stages: [
    { duration: '2m', target: 100 },
    { duration: '5m', target: 100 },
    { duration: '2m', target: 200 },
    { duration: '5m', target: 200 },
    { duration: '2m', target: 300 },
    { duration: '5m', target: 300 },
    { duration: '2m', target: 400 },
    { duration: '5m', target: 400 },
    { duration: '10m', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'],
    http_req_failed: ['rate<0.05'],
  },
  discardResponseBodies: true,
};

export default function () {
  let res = http.get('https://www.saucedemo.com/', { tags: { test_type: 'stress' } });
  check(res, {
    'status is 200': (r) => r.status === 200,
    'body includes Swag Labs': (r) => r.body && r.body.includes('Swag Labs'),
  });
  sleep(Math.random() * 2 + 1);
}
