// Spike Test for SauceDemo
// Type: Spike Test
// Requirements: 95% of requests < 3s during spike, error rate < 10%
// Optimized: Minimal imports, resource management, realistic think times, tags for better reporting

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Trend } from 'k6/metrics';
import { textSummary } from '../summary.js';

export function handleSummary(data) {
  return {
    'reports/spike-test-summary.html':
      '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>k6 Summary</title></head><body><pre>' +
      textSummary(data, { enableColors: false }) +
      '</pre></body></html>',
  };
}

export let spikeTrend = new Trend('spike_response_time');

export let options = {
  stages: [
    { duration: '10s', target: 100 },   // Below normal load
    { duration: '1m', target: 100 },
    { duration: '20s', target: 1400 },  // Spike to 1400 users
    { duration: '3m', target: 1400 },   // Stay at spike
    { duration: '20s', target: 100 },   // Scale down
    { duration: '3m', target: 100 },
    { duration: '20s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<3000'],
    http_req_failed: ['rate<0.10'],
    spike_response_time: ['p(95)<3000'],
  },
  discardResponseBodies: true,
};

export default function () {
  let res = http.get('https://www.saucedemo.com/', { tags: { test_type: 'spike' } });
  spikeTrend.add(res.timings.duration, { test_type: 'spike' });
  check(res, {
    'status is 200': (r) => r.status === 200,
    'body includes Swag Labs': (r) => r.body && r.body.includes('Swag Labs'),
  });
  sleep(Math.random() * 2 + 1);
}