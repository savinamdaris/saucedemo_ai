// Load Test for SauceDemo
// Type: Load Test
// Requirements: 95% of requests < 500ms, error rate < 1%
// Tags: test_type=load

import http from 'k6/http';
import { check, sleep } from 'k6';
import { textSummary } from '../summary.js';

export function handleSummary(data) {
  return {
    'reports/load-test-summary.html':
      '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>k6 Summary</title></head><body><pre>' +
      textSummary(data, { enableColors: false }) +
      '</pre></body></html>',
  };
}

export let options = {
  stages: [
    { duration: '2m', target: 100 },
    { duration: '6m', target: 100 },
    { duration: '2m', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],
    http_req_failed: ['rate<0.01'],
  },
  discardResponseBodies: true,
};

export default function () {
  let res = http.get('https://www.saucedemo.com/', { tags: { test_type: 'load' } });
  check(res, {
    'status is 200': (r) => r.status === 200,
    'body includes Swag Labs': (r) => r.body && r.body.includes('Swag Labs'),
  });
  sleep(Math.random() * 2 + 1);
}