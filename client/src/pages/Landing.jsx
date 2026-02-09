import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRightIcon, 
  AcademicCapIcon, 
  ClockIcon, 
  ShieldCheckIcon, 
  ChartBarIcon, 
  ComputerDesktopIcon,
  UserGroupIcon,
  DocumentCheckIcon,
  LockClosedIcon,
  PresentationChartLineIcon
} from '@heroicons/react/24/outline';

const Landing = () => {
  // Force dark mode for landing page
  useEffect(() => {
    document.documentElement.classList.add('dark');
    document.title = 'Sage Exams | Secure Online Assessment Platform';
  }, []);

  const features = [
    {
      icon: <ShieldCheckIcon className="h-8 w-8" />,
      title: 'Secure Proctoring',
      description: 'AI-powered proctoring with facial recognition, browser lockdown, and activity monitoring.',
      color: 'from-green-500 to-emerald-400'
    },
    {
      icon: <ClockIcon className="h-8 w-8" />,
      title: 'Flexible Scheduling',
      description: 'Schedule exams at convenient times with automated reminders and calendar integration.',
      color: 'from-blue-500 to-cyan-400'
    },
    {
      icon: <ComputerDesktopIcon className="h-8 w-8" />,
      title: 'Real-time Monitoring',
      description: 'Live dashboards for invigilators with suspicious activity alerts and live support.',
      color: 'from-purple-500 to-pink-400'
    },
    {
      icon: <ChartBarIcon className="h-8 w-8" />,
      title: 'Instant Results',
      description: 'Automated grading with detailed analytics and performance insights.',
      color: 'from-orange-500 to-yellow-400'
    },
    {
      icon: <DocumentCheckIcon className="h-8 w-8" />,
      title: 'Question Bank',
      description: 'Extensive library of question types including MCQs, essays, coding, and simulations.',
      color: 'from-red-500 to-rose-400'
    },
    {
      icon: <LockClosedIcon className="h-8 w-8" />,
      title: 'Data Security',
      description: 'End-to-end encryption, secure data centers, and GDPR compliance.',
      color: 'from-indigo-500 to-blue-400'
    }
  ];

  const examTypes = [
    {
      name: 'Academic Assessments',
      description: 'University exams, quizzes, and continuous evaluations',
      icon: '🎓',
      exams: ['Mid-terms', 'Final Exams', 'Weekly Quizzes', 'Assignments']
    },
    {
      name: 'Professional Certifications',
      description: 'Industry-recognized certification programs',
      icon: '📜',
      exams: ['IT Certifications', 'HR Assessments', 'Financial Exams', 'Medical Boards']
    },
    {
      name: 'Corporate Testing',
      description: 'Recruitment and employee assessment',
      icon: '💼',
      exams: ['Pre-employment', 'Skill Assessments', 'Promotion Tests', 'Training Evaluations']
    }
  ];

  const testimonials = [
    {
      name: 'Dr. Robert Chen',
      role: 'Dean of Computer Science, Stanford',
      quote: 'Sage Platform reduced our exam administration workload by 70% while increasing security.',
      avatar: 'RC'
    },
    {
      name: 'Sarah Johnson',
      role: 'HR Director, TechCorp',
      quote: 'The most reliable platform for our global hiring assessments. Zero cheating incidents.',
      avatar: 'SJ'
    },
    {
      name: 'Michael Rodriguez',
      role: 'Exam Coordinator, University of Toronto',
      quote: 'Seamless experience for both students and administrators. Highly recommended!',
      avatar: 'MR'
    }
  ];

  const securityFeatures = [
    'AI Proctoring with Facial Recognition',
    'Browser Lockdown & Screen Recording',
    'Plagiarism Detection',
    'Secure Question Bank',
    'Live Invigilator Dashboard',
    'Encrypted Data Transmission'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-gray-900/80 backdrop-blur-md border-b border-gray-700/50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-emerald-600 flex items-center justify-center">
                <DocumentCheckIcon className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-display font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                Sage Exams
              </span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-300 hover:text-blue-300 transition-colors">Features</a>
              <a href="#security" className="text-gray-300 hover:text-blue-300 transition-colors">Security</a>
              <a href="#testimonials" className="text-gray-300 hover:text-blue-300 transition-colors">Testimonials</a>
              <a href="#pricing" className="text-gray-300 hover:text-blue-300 transition-colors">Pricing</a>
              <Link to="/login" className="text-gray-300 hover:text-blue-300 transition-colors">Sign In</Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link 
                to="/register" 
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-600/30 transition-all duration-300 transform hover:-translate-y-0.5"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-900/30 border border-blue-700/50 mb-6">
              <ShieldCheckIcon className="h-4 w-4 text-blue-400 mr-2" />
              <span className="text-blue-300 text-sm">Trusted by 500+ Institutions Worldwide</span>
            </div>
            
            <h1 className="text-6xl md:text-7xl font-display font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-blue-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                Secure Online Exams
              </span>
              <br />
              <span className="text-white">Made Simple</span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
              The most advanced, secure, and reliable platform for conducting online assessments. 
              From universities to corporations, we ensure integrity in every exam.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link 
                to="/register" 
                className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-xl font-semibold text-lg hover:shadow-2xl hover:shadow-blue-600/40 transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center"
              >
                Start Free Trial
                <ArrowRightIcon className="h-5 w-5 ml-2 group-hover:translate-x-2 transition-transform" />
              </Link>
              <Link 
                to="/demo" 
                className="px-8 py-4 border-2 border-gray-700 rounded-xl font-semibold text-lg hover:border-blue-500 hover:text-blue-300 transition-all duration-300"
              >
                Request Demo
              </Link>
            </div>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mt-20">
            {[
              { number: '1M+', label: 'Exams Conducted' },
              { number: '99.9%', label: 'Uptime' },
              { number: '50K+', label: 'Active Users' },
              { number: '100+', label: 'Countries' }
            ].map((stat, index) => (
              <div key={index} className="text-center p-6 bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/50">
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                  {stat.number}
                </div>
                <div className="text-gray-400 mt-2">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-gray-800/20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold mb-4">
              <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                Powerful Exam Features
              </span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Everything you need to conduct secure, efficient, and scalable online assessments.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="group p-8 bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.color} mb-6`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white group-hover:text-blue-300 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Exam Types Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold mb-4">
              <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                For Every Assessment Need
              </span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Comprehensive solutions for all types of examinations
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {examTypes.map((type, index) => (
              <div 
                key={index} 
                className="p-8 bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 hover:border-emerald-500/50 transition-all duration-300"
              >
                <div className="text-4xl mb-4">{type.icon}</div>
                <h3 className="text-2xl font-semibold mb-3 text-white">{type.name}</h3>
                <p className="text-gray-400 mb-6">{type.description}</p>
                <ul className="space-y-2">
                  {type.exams.map((exam, idx) => (
                    <li key={idx} className="flex items-center text-gray-300">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full mr-3"></div>
                      {exam}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section id="security" className="py-20 px-6 bg-gray-800/20">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-display font-bold mb-6">
                <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                  Military-Grade Security
                </span>
              </h2>
              <p className="text-gray-300 text-lg mb-8">
                Our multi-layered security approach ensures the highest level of exam integrity and data protection.
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                {securityFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-gray-800/50 rounded-lg">
                    <ShieldCheckIcon className="h-5 w-5 text-emerald-400" />
                    <span className="text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-900/30 to-emerald-900/30 p-8 rounded-2xl border border-gray-700/50">
                <div className="space-y-6">
                  {[
                    { label: 'AI Proctoring', value: 98 },
                    { label: 'Data Encryption', value: 100 },
                    { label: 'System Reliability', value: 99.9 },
                    { label: 'User Satisfaction', value: 96 }
                  ].map((item, index) => (
                    <div key={index}>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-300">{item.label}</span>
                        <span className="text-emerald-400 font-semibold">{item.value}%</span>
                      </div>
                      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full"
                          style={{ width: `${item.value}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold mb-4">
              <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                Trusted by Leading Institutions
              </span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              See what educators and professionals are saying about Sage Exams
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index} 
                className="p-8 bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300"
              >
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-emerald-600 flex items-center justify-center text-white font-bold">
                    {testimonial.avatar}
                  </div>
                  <div className="ml-4">
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-gray-400">{testimonial.role}</div>
                  </div>
                </div>
                <p className="text-gray-300 italic">"{testimonial.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center p-12 bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl border border-gray-700/50 relative overflow-hidden">
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0" style={{
                backgroundImage: `radial-gradient(circle at 2px 2px, rgba(59, 130, 246, 0.2) 1px, transparent 1px)`,
                backgroundSize: '40px 40px'
              }}></div>
            </div>
            
            <h2 className="text-4xl font-display font-bold mb-6 relative z-10">
              Ready to Transform Your <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">Exam Experience?</span>
            </h2>
            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto relative z-10">
              Join thousands of institutions already using Sage for secure, reliable online assessments.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
              <Link 
                to="/register" 
                className="group px-10 py-4 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-xl font-semibold text-lg hover:shadow-2xl hover:shadow-blue-600/40 transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center"
              >
                Start Free Trial
                <ArrowRightIcon className="h-5 w-5 ml-2 group-hover:translate-x-2 transition-transform" />
              </Link>
              <Link 
                to="/contact" 
                className="px-10 py-4 border-2 border-gray-700 rounded-xl font-semibold text-lg hover:border-blue-500 hover:text-blue-300 transition-all duration-300"
              >
                Contact Sales
              </Link>
            </div>
            
            <div className="mt-8 text-gray-500 text-sm relative z-10">
              No credit card required • 30-day free trial • 24/7 Support
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-gray-800/50">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-6 md:mb-0">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-emerald-600 flex items-center justify-center">
                <DocumentCheckIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-2xl font-display font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                  Sage Exams
                </span>
                <p className="text-gray-500 text-sm">© 2026 Secure Online Assessment Platform</p>
              </div>
            </div>
            
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-blue-300 transition-colors">Security</a>
              <a href="#" className="text-gray-400 hover:text-blue-300 transition-colors">Compliance</a>
              <a href="#" className="text-gray-400 hover:text-blue-300 transition-colors">Support</a>
              <a href="#" className="text-gray-400 hover:text-blue-300 transition-colors">API Docs</a>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-800/30 text-center">
            <p className="text-gray-500 text-sm">
              ISO 27001 Certified • GDPR Compliant • SOC 2 Type II
            </p>
          </div>
        </div>
      </footer>

      {/* Background Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/5 rounded-full mix-blend-screen filter blur-3xl animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-500/5 rounded-full mix-blend-screen filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-cyan-500/5 rounded-full mix-blend-screen filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>
    </div>
  );
};

export default Landing;