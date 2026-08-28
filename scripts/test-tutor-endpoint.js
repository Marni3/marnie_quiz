const http = require('http');

async function testEndpoint(path, method = 'GET', body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve({ status: res.statusCode, headers: res.headers, body: data });
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function runTests() {
  console.log('Testing /tutor page...');
  const tutorRes = await testEndpoint('/tutor');
  console.log(`GET /tutor status: ${tutorRes.status}`);
  if (tutorRes.body.includes('Marnie Quiz') || tutorRes.status === 200) {
    console.log('✓ /tutor page loaded successfully!');
  } else {
    console.error('✗ /tutor failed to load expected content.');
  }

  console.log('\nTesting /api/tutor/stream (missing key validation)...');
  const streamRes = await testEndpoint('/api/tutor/stream', 'POST', {
    provider: 'gemini',
    apiKey: '',
    messages: [{ role: 'user', content: 'test' }],
  });
  console.log(`POST /api/tutor/stream status: ${streamRes.status}`);
  console.log(`Response body: ${streamRes.body}`);
  if (streamRes.status === 400 && streamRes.body.includes('Missing API Key')) {
    console.log('✓ Validation correctly caught missing key!');
  } else {
    console.error('✗ Stream endpoint validation failed.');
  }
}

runTests().catch(console.error);
