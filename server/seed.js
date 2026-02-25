const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Exam = require('./models/Exam');
const Setting = require('./models/Setting');

dotenv.config();

const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/online-exam-system';

const seedDatabase = async () => {
    try {
        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('✅ Connected to MongoDB');

        // Clear existing data
        await User.deleteMany({});
        await Exam.deleteMany({});
        await Setting.deleteMany({});
        console.log('🗑️  Cleared existing data');

        // =====================
        // 1. Create Users
        // =====================
        const admin = await User.create({
            name: 'Admin User',
            email: 'admin@exam.com',
            password: 'admin123',
            role: 'admin',
            status: 'active',
        });
        console.log('👤 Admin created: admin@exam.com / admin123');

        const teacher = await User.create({
            name: 'Teacher User',
            email: 'teacher@exam.com',
            password: 'teacher123',
            role: 'teacher',
            status: 'active',
        });
        console.log('👤 Teacher created: teacher@exam.com / teacher123');

        const student = await User.create({
            name: 'Student User',
            email: 'student@exam.com',
            password: 'student123',
            role: 'student',
            status: 'active',
        });
        console.log('👤 Student created: student@exam.com / student123');

        // =====================
        // 2. Create Sample Exam
        // =====================
        const exam = await Exam.create({
            title: 'JavaScript Fundamentals',
            description: 'Test your knowledge of JavaScript basics including variables, functions, and data types.',
            subject: 'JavaScript',
            duration: 30, // 30 minutes
            totalMarks: 5,
            passingMarks: 3,
            createdBy: teacher._id,
            isActive: true,
            startDate: new Date(),
            endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
            maxAttempts: 3,
            instructions: [
                'Read all questions carefully before answering',
                'Each question carries 1 mark',
                'No negative marking',
                'You have 30 minutes to complete the exam',
                'Do not refresh or close the browser during the exam',
            ],
            questions: [
                {
                    questionText: 'Which keyword is used to declare a variable in JavaScript (ES6)?',
                    questionType: 'multiple-choice',
                    points: 1,
                    timeLimit: 60,
                    options: [
                        { text: 'var', isCorrect: false },
                        { text: 'let', isCorrect: true },
                        { text: 'int', isCorrect: false },
                        { text: 'string', isCorrect: false },
                    ],
                },
                {
                    questionText: 'What does "===" operator do in JavaScript?',
                    questionType: 'multiple-choice',
                    points: 1,
                    timeLimit: 60,
                    options: [
                        { text: 'Assigns a value', isCorrect: false },
                        { text: 'Compares value only', isCorrect: false },
                        { text: 'Compares value and type', isCorrect: true },
                        { text: 'None of the above', isCorrect: false },
                    ],
                },
                {
                    questionText: 'Which method is used to add an element at the end of an array?',
                    questionType: 'multiple-choice',
                    points: 1,
                    timeLimit: 60,
                    options: [
                        { text: 'pop()', isCorrect: false },
                        { text: 'push()', isCorrect: true },
                        { text: 'shift()', isCorrect: false },
                        { text: 'unshift()', isCorrect: false },
                    ],
                },
                {
                    questionText: 'What is the output of typeof null in JavaScript?',
                    questionType: 'multiple-choice',
                    points: 1,
                    timeLimit: 60,
                    options: [
                        { text: 'null', isCorrect: false },
                        { text: 'undefined', isCorrect: false },
                        { text: 'object', isCorrect: true },
                        { text: 'number', isCorrect: false },
                    ],
                },
                {
                    questionText: 'Which function is used to parse a string to an integer?',
                    questionType: 'multiple-choice',
                    points: 1,
                    timeLimit: 60,
                    options: [
                        { text: 'Integer.parse()', isCorrect: false },
                        { text: 'parseInt()', isCorrect: true },
                        { text: 'Number.parse()', isCorrect: false },
                        { text: 'toInteger()', isCorrect: false },
                    ],
                },
            ],
        });
        console.log(`📝 Sample exam created: "${exam.title}" (5 questions)`);

        // =====================
        // 3. Create Default Settings
        // =====================
        await Setting.create({
            systemName: 'Online Exam System',
            timezone: 'Asia/Kolkata',
            maxExamDuration: 180,
            allowRetake: false,
            showResultsImmediately: true,
            security: {
                requireWebcam: false,
                preventCopyPaste: true,
                preventTabSwitch: true,
                fullScreenRequired: false,
            },
            emailNotifications: true,
            updatedBy: admin._id,
        });
        console.log('⚙️  Default settings created');

        // =====================
        // Summary
        // =====================
        console.log('\n========================================');
        console.log('🎉 Database seeded successfully!');
        console.log('========================================');
        console.log('\nLogin credentials:');
        console.log('  Admin:   admin@exam.com   / admin123');
        console.log('  Teacher: teacher@exam.com / teacher123');
        console.log('  Student: student@exam.com / student123');
        console.log('========================================\n');

        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('❌ Seed error:', error.message);
        await mongoose.connection.close();
        process.exit(1);
    }
};

seedDatabase();
