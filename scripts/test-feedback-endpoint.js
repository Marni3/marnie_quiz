const http = require('http');

async function testFeedback() {
  const payload = JSON.stringify({
    url: '/learn/math-04-01',
    moduleId: 'math-04-01',
    category: 'formatting',
    comment: 'Test feedback note: check trig double-angle formula alignment in Layer 2.',
    metadata: { test: true },
  });

  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/feedback',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(payload),
    },
  };

  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (c) => (data += c));
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    });
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

testFeedback().then((res) => {
  console.log('Feedback POST status:', res.status);
  console.log('Feedback POST response:', res.body);
}).catch(console.error);
