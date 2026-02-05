import React from 'react';

const TestTailwind = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Tailwind CSS Test</h1>
          <p className="text-gray-600">If you see styles, Tailwind is working!</p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Test different Tailwind classes */}
          <div className="space-y-6">
            {/* Color test */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Colors</h2>
              <div className="flex space-x-2">
                <div className="w-12 h-12 bg-primary-500 rounded-lg"></div>
                <div className="w-12 h-12 bg-primary-600 rounded-lg"></div>
                <div className="w-12 h-12 bg-primary-700 rounded-lg"></div>
                <div className="w-12 h-12 bg-green-500 rounded-lg"></div>
                <div className="w-12 h-12 bg-red-500 rounded-lg"></div>
              </div>
            </div>
            
            {/* Button test */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Buttons</h2>
              <div className="flex space-x-4">
                <button className="btn-primary">Primary Button</button>
                <button className="btn-secondary">Secondary Button</button>
              </div>
            </div>
            
            {/* Card test */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Card</h2>
              <div className="card">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Card Title</h3>
                <p className="text-gray-600">This is a test card using Tailwind CSS classes.</p>
              </div>
            </div>
            
            {/* Input test */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Input Field</h2>
              <input 
                type="text" 
                placeholder="Type something..."
                className="input-field"
              />
            </div>
          </div>
        </div>
        
        {/* Status indicator */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-green-100 text-green-800">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse"></div>
            Tailwind CSS is working!
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestTailwind;