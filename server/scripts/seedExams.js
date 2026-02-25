const mongoose = require('mongoose');
const Exam = require('../models/Exam');
const User = require('../models/User');
require('dotenv').config();

const sampleExams = [
    {
        title: 'Introduction to JavaScript',
        description: 'Test your fundamental knowledge of JavaScript programming including variables, functions, arrays, and basic concepts.',
        subject: 'JavaScript',
        duration: 30,
        totalMarks: 10,
        passingMarks: 6,
        maxAttempts: 3,
        isActive: true,
        startDate: new Date(),
        endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days from now
        questions: [
            {
                questionText: 'What is the correct syntax to declare a variable in JavaScript?',
                questionType: 'multiple-choice',
                points: 1,
                options: [
                    { text: 'variable x = 5;', isCorrect: false },
                    { text: 'let x = 5;', isCorrect: true },
                    { text: 'v x = 5;', isCorrect: false },
                    { text: 'declare x = 5;', isCorrect: false },
                ],
            },
            {
                questionText: 'Which method adds an element to the end of an array?',
                questionType: 'multiple-choice',
                points: 1,
                options: [
                    { text: 'push()', isCorrect: true },
                    { text: 'pop()', isCorrect: false },
                    { text: 'shift()', isCorrect: false },
                    { text: 'unshift()', isCorrect: false },
                ],
            },
            {
                questionText: 'What does === operator check in JavaScript?',
                questionType: 'multiple-choice',
                points: 1,
                options: [
                    { text: 'Only value equality', isCorrect: false },
                    { text: 'Only type equality', isCorrect: false },
                    { text: 'Both value and type equality', isCorrect: true },
                    { text: 'Reference equality', isCorrect: false },
                ],
            },
            {
                questionText: 'Which keyword is used to define a constant in JavaScript?',
                questionType: 'multiple-choice',
                points: 1,
                options: [
                    { text: 'var', isCorrect: false },
                    { text: 'let', isCorrect: false },
                    { text: 'const', isCorrect: true },
                    { text: 'define', isCorrect: false },
                ],
            },
            {
                questionText: 'What is the output of typeof null?',
                questionType: 'multiple-choice',
                points: 1,
                options: [
                    { text: '"null"', isCorrect: false },
                    { text: '"undefined"', isCorrect: false },
                    { text: '"object"', isCorrect: true },
                    { text: '"boolean"', isCorrect: false },
                ],
            },
            {
                questionText: 'Which of the following is NOT a JavaScript data type?',
                questionType: 'multiple-choice',
                points: 1,
                options: [
                    { text: 'String', isCorrect: false },
                    { text: 'Boolean', isCorrect: false },
                    { text: 'Float', isCorrect: true },
                    { text: 'Symbol', isCorrect: false },
                ],
            },
            {
                questionText: 'What does the Array.map() method return?',
                questionType: 'multiple-choice',
                points: 1,
                options: [
                    { text: 'A modified original array', isCorrect: false },
                    { text: 'A new array with transformed elements', isCorrect: true },
                    { text: 'A boolean value', isCorrect: false },
                    { text: 'undefined', isCorrect: false },
                ],
            },
            {
                questionText: 'How do you write a single-line comment in JavaScript?',
                questionType: 'multiple-choice',
                points: 1,
                options: [
                    { text: '<!-- comment -->', isCorrect: false },
                    { text: '# comment', isCorrect: false },
                    { text: '// comment', isCorrect: true },
                    { text: '** comment', isCorrect: false },
                ],
            },
            {
                questionText: 'What is the purpose of the "this" keyword in JavaScript?',
                questionType: 'multiple-choice',
                points: 1,
                options: [
                    { text: 'Declares a new variable', isCorrect: false },
                    { text: 'Refers to the current object', isCorrect: true },
                    { text: 'Creates a new function', isCorrect: false },
                    { text: 'Imports a module', isCorrect: false },
                ],
            },
            {
                questionText: 'Which method converts a JSON string to a JavaScript object?',
                questionType: 'multiple-choice',
                points: 1,
                options: [
                    { text: 'JSON.stringify()', isCorrect: false },
                    { text: 'JSON.parse()', isCorrect: true },
                    { text: 'JSON.convert()', isCorrect: false },
                    { text: 'JSON.toObject()', isCorrect: false },
                ],
            },
        ],
    },
    {
        title: 'Web Development Fundamentals',
        description: 'Assess your knowledge of HTML, CSS, and web development concepts including layout, styling, and semantic markup.',
        subject: 'Web Development',
        duration: 25,
        totalMarks: 8,
        passingMarks: 5,
        maxAttempts: 3,
        isActive: true,
        startDate: new Date(),
        endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        questions: [
            {
                questionText: 'What does HTML stand for?',
                questionType: 'multiple-choice',
                points: 1,
                options: [
                    { text: 'Hyper Text Markup Language', isCorrect: true },
                    { text: 'High Tech Modern Language', isCorrect: false },
                    { text: 'Hyper Transfer Markup Language', isCorrect: false },
                    { text: 'Home Tool Markup Language', isCorrect: false },
                ],
            },
            {
                questionText: 'Which CSS property is used to change the background color?',
                questionType: 'multiple-choice',
                points: 1,
                options: [
                    { text: 'color', isCorrect: false },
                    { text: 'bgcolor', isCorrect: false },
                    { text: 'background-color', isCorrect: true },
                    { text: 'bg-color', isCorrect: false },
                ],
            },
            {
                questionText: 'What is the correct HTML element for the largest heading?',
                questionType: 'multiple-choice',
                points: 1,
                options: [
                    { text: '<heading>', isCorrect: false },
                    { text: '<h6>', isCorrect: false },
                    { text: '<h1>', isCorrect: true },
                    { text: '<head>', isCorrect: false },
                ],
            },
            {
                questionText: 'Which CSS display value makes an element a flex container?',
                questionType: 'multiple-choice',
                points: 1,
                options: [
                    { text: 'display: block', isCorrect: false },
                    { text: 'display: flex', isCorrect: true },
                    { text: 'display: grid-flex', isCorrect: false },
                    { text: 'display: flexible', isCorrect: false },
                ],
            },
            {
                questionText: 'What is the purpose of the <meta> tag in HTML?',
                questionType: 'multiple-choice',
                points: 1,
                options: [
                    { text: 'Define the page title', isCorrect: false },
                    { text: 'Provide metadata about the document', isCorrect: true },
                    { text: 'Create navigation links', isCorrect: false },
                    { text: 'Add images to the page', isCorrect: false },
                ],
            },
            {
                questionText: 'Which CSS property controls the space between elements?',
                questionType: 'multiple-choice',
                points: 1,
                options: [
                    { text: 'spacing', isCorrect: false },
                    { text: 'gap', isCorrect: false },
                    { text: 'margin', isCorrect: true },
                    { text: 'border', isCorrect: false },
                ],
            },
            {
                questionText: 'What does the CSS box model consist of?',
                questionType: 'multiple-choice',
                points: 1,
                options: [
                    { text: 'Content, Padding, Border, Margin', isCorrect: true },
                    { text: 'Header, Body, Footer, Sidebar', isCorrect: false },
                    { text: 'Top, Right, Bottom, Left', isCorrect: false },
                    { text: 'HTML, CSS, JavaScript, Images', isCorrect: false },
                ],
            },
            {
                questionText: 'Which HTML tag is used to create an unordered list?',
                questionType: 'multiple-choice',
                points: 1,
                options: [
                    { text: '<ol>', isCorrect: false },
                    { text: '<list>', isCorrect: false },
                    { text: '<ul>', isCorrect: true },
                    { text: '<dl>', isCorrect: false },
                ],
            },
        ],
    },
    {
        title: 'React.js Essentials',
        description: 'Test your understanding of React concepts including components, state management, hooks, JSX, and the virtual DOM.',
        subject: 'React',
        duration: 20,
        totalMarks: 6,
        passingMarks: 4,
        maxAttempts: 5,
        isActive: true,
        startDate: new Date(),
        endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        questions: [
            {
                questionText: 'What is JSX in React?',
                questionType: 'multiple-choice',
                points: 1,
                options: [
                    { text: 'A database query language', isCorrect: false },
                    { text: 'A syntax extension that allows writing HTML in JavaScript', isCorrect: true },
                    { text: 'A CSS framework', isCorrect: false },
                    { text: 'A testing library', isCorrect: false },
                ],
            },
            {
                questionText: 'Which hook is used for state management in functional components?',
                questionType: 'multiple-choice',
                points: 1,
                options: [
                    { text: 'useEffect', isCorrect: false },
                    { text: 'useState', isCorrect: true },
                    { text: 'useContext', isCorrect: false },
                    { text: 'useReducer', isCorrect: false },
                ],
            },
            {
                questionText: 'What is the virtual DOM in React?',
                questionType: 'multiple-choice',
                points: 1,
                options: [
                    { text: 'A copy of the real DOM kept in memory', isCorrect: true },
                    { text: 'A database for storing component data', isCorrect: false },
                    { text: 'A CSS rendering engine', isCorrect: false },
                    { text: 'A server-side rendering tool', isCorrect: false },
                ],
            },
            {
                questionText: 'How do you pass data from a parent to a child component?',
                questionType: 'multiple-choice',
                points: 1,
                options: [
                    { text: 'Using global variables', isCorrect: false },
                    { text: 'Using props', isCorrect: true },
                    { text: 'Using localStorage', isCorrect: false },
                    { text: 'Using cookies', isCorrect: false },
                ],
            },
            {
                questionText: 'What does useEffect hook do?',
                questionType: 'multiple-choice',
                points: 1,
                options: [
                    { text: 'Manages component state', isCorrect: false },
                    { text: 'Handles side effects in components', isCorrect: true },
                    { text: 'Creates new components', isCorrect: false },
                    { text: 'Optimizes rendering performance', isCorrect: false },
                ],
            },
            {
                questionText: 'What is the correct way to render a list in React?',
                questionType: 'multiple-choice',
                points: 1,
                options: [
                    { text: 'Using for loops inside JSX', isCorrect: false },
                    { text: 'Using Array.map() with a key prop', isCorrect: true },
                    { text: 'Using document.createElement()', isCorrect: false },
                    { text: 'Using innerHTML', isCorrect: false },
                ],
            },
        ],
    },
];

const seedExams = async () => {
    try {
        const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/online-exam-system';
        await mongoose.connect(mongoURI);
        console.log('Connected to MongoDB');

        // Find an admin user to be the creator
        let adminUser = await User.findOne({ role: 'admin' });
        if (!adminUser) {
            adminUser = await User.findOne({ role: 'teacher' });
        }
        if (!adminUser) {
            console.log('No admin/teacher user found. Creating a default admin...');
            const bcrypt = require('bcryptjs');
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('admin123', salt);
            adminUser = await User.create({
                name: 'Admin User',
                email: 'admin@example.com',
                password: hashedPassword,
                role: 'admin',
            });
            console.log('Created admin user: admin@example.com / admin123');
        }

        // Delete existing sample exams to avoid duplicates
        const titles = sampleExams.map(e => e.title);
        await Exam.deleteMany({ title: { $in: titles } });
        console.log('Cleared old sample exams');

        // Create exams with the admin as creator
        for (const examData of sampleExams) {
            const exam = await Exam.create({
                ...examData,
                createdBy: adminUser._id,
            });
            console.log(`✓ Created: "${exam.title}" (${exam.questions.length} questions, ${exam.duration} min)`);
        }

        console.log(`\n✅ Successfully seeded ${sampleExams.length} sample exams!`);
        console.log('Exams: JavaScript, Web Dev, React.js');
        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding failed:', error.message);
        process.exit(1);
    }
};

seedExams();
