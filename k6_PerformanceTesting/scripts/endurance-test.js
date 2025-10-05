// Endurance Test for SauceDemo
// Type: Endurance Test
// Requirements: 95% of requests < 1s, error rate < 2%
// Optimized: Minimal imports, resource management, realistic think times, tags for better reporting

import http from 'k6/http';
import { check, sleep } from 'k6';
import { textSummary } from '../summary.js';

export function handleSummary(data) {
  return {
    'reports/endurance-test-summary.html':
      '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>k6 Summary</title></head><body><pre>' +
      textSummary(data, { enableColors: false }) +
      '</pre></body></html>',
  };
}

export let options = {
  stages: [
    { duration: '5m', target: 100 },   // Ramp up
    { duration: '4h', target: 100 },   // Stay for 4 hours
    { duration: '5m', target: 0 },     // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<1000'],
    http_req_failed: ['rate<0.02'],
  },
  discardResponseBodies: true,
};

export default function () {
  let res = http.get('https://www.saucedemo.com/', { tags: { test_type: 'endurance' } });
  check(res, {
    'status is 200': (r) => r.status === 200,
    'body includes Swag Labs': (r) => r.body && r.body.includes('Swag Labs'),
  });
  sleep(Math.random() * 2 + 1);
}