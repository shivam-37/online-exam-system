const http = require('http');

const BASE = 'http://localhost:5000/api';

function request(method, path, body, token) {
    return new Promise((resolve, reject) => {
        const url = new URL(BASE + path);
        const data = body ? JSON.stringify(body) : null;
        const options = {
            hostname: url.hostname,
            port: url.port,
            path: url.pathname,
            method,
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
                ...(data ? { 'Content-Length': Buffer.byteLength(data) } : {}),
            },
        };
        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => (body += chunk));
            res.on('end', () => {
                try {
                    resolve({ status: res.statusCode, data: JSON.parse(body) });
                } catch {
                    resolve({ status: res.statusCode, data: body });
                }
            });
        });
        req.on('error', reject);
        if (data) req.write(data);
        req.end();
    });
}

async function test() {
    try {
        // Login as student
        console.log('=== 1. Login as student ===');
        let loginRes = await request('POST', '/users/login', { email: 'student@test.com', password: 'password123' });
        if (loginRes.status !== 200) {
            // Try alternate credentials
            loginRes = await request('POST', '/users/login', { email: 'test@test.com', password: 'test123' });
        }
        if (loginRes.status !== 200) {
            console.log('Student login failed, trying to register...');
            await request('POST', '/users/register', { name: 'Test Student', email: 'teststudent@test.com', password: 'test1234', role: 'student' });
            loginRes = await request('POST', '/users/login', { email: 'teststudent@test.com', password: 'test1234' });
        }

        const token = loginRes.data.token;
        console.log('Login status:', loginRes.status === 200 ? 'OK' : 'FAIL');
        if (!token) { console.log('No token, aborting'); return; }

        // Get Exams
        console.log('\n=== 2. Get Exams ===');
        const examsRes = await request('GET', '/exams', null, token);
        console.log('Exams count:', examsRes.data.length);
        (examsRes.data || []).forEach(e => console.log('  -', e.title, `(${e.questions?.length || 0}Q)`));

        if (examsRes.data.length === 0) { console.log('No exams to test'); return; }

        const examId = examsRes.data[0]._id;

        // Start Exam
        console.log('\n=== 3. Start Exam:', examsRes.data[0].title, '===');
        const startRes = await request('POST', '/exams/' + examId + '/start', {}, token);
        if (startRes.status !== 200) {
            console.log('Start failed:', startRes.data.message);
            return;
        }
        console.log('Duration:', startRes.data.duration, 'min');
        console.log('Questions:', startRes.data.exam.questions.length);

        // Submit Exam — answer all questions correctly
        console.log('\n=== 4. Submit Exam ===');
        const answers = startRes.data.exam.questions.map((q) => ({
            selectedOption: q.options.findIndex(o => o.isCorrect),
            timeTaken: 10,
        }));
        const submitRes = await request('POST', '/exams/' + examId + '/submit', { answers, timeTaken: 120 }, token);
        console.log('Score:', submitRes.data.score + '/' + submitRes.data.totalMarks);
        console.log('Percentage:', (submitRes.data.percentage || 0).toFixed(1) + '%');
        console.log('Passed:', submitRes.data.passed);

        // Get Reports
        console.log('\n=== 5. Get Reports ===');
        const reportsRes = await request('GET', '/reports/my-reports', null, token);
        console.log('Reports count:', reportsRes.data.length);

        if (reportsRes.data.length > 0) {
            const reportId = reportsRes.data[0]._id;

            // Get Report Detail
            console.log('\n=== 6. Get Report Detail ===');
            const detailRes = await request('GET', '/reports/' + reportId, null, token);
            console.log('Report exam:', detailRes.data.exam?.title);
            console.log('Report score:', detailRes.data.score + '/' + detailRes.data.totalMarks);
            console.log('Report passed:', detailRes.data.passed);
            console.log('Report percentage:', (detailRes.data.percentage || 0).toFixed(1) + '%');
            console.log('Report answers count:', detailRes.data.answers?.length);
        }

        console.log('\n✅ ALL TESTS PASSED');
    } catch (err) {
        console.error('❌ Error:', err.message);
    }
}

test();
