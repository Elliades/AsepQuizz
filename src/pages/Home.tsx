import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-center">INCOSE ASEP Quiz</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link 
          to="/subjects" 
          className="card hover:bg-gray-800 transition-colors"
        >
          <h2 className="text-2xl font-semibold mb-2">Study by Subject</h2>
          <p className="text-gray-400">Browse and study questions organized by topics</p>
        </Link>

        <Link 
          to="/quiz/random" 
          className="card hover:bg-gray-800 transition-colors"
        >
          <h2 className="text-2xl font-semibold mb-2">Quick Quiz</h2>
          <p className="text-gray-400">Start a random quiz session</p>
        </Link>

        <Link 
          to="/results" 
          className="card hover:bg-gray-800 transition-colors"
        >
          <h2 className="text-2xl font-semibold mb-2">Progress</h2>
          <p className="text-gray-400">View your quiz history and statistics</p>
        </Link>

        <div className="card bg-primary/10">
          <h2 className="text-2xl font-semibold mb-2">Study Tips</h2>
          <ul className="list-disc list-inside text-gray-400">
            <li>Focus on one subject at a time</li>
            <li>Review incorrect answers carefully</li>
            <li>Use the comment section for discussions</li>
            <li>Tag questions for later review</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 