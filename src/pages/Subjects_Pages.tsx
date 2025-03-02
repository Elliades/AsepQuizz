/**
 * Subjects Page
 * 
 * This page allows users to browse and study by specific subjects or topics.
 * It provides multiple ways to organize and access quiz content:
 * - Browse by main subject categories
 * - Filter by difficulty level
 * - Create custom quizzes from selected topics
 * - View popular/recommended topics
 */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getAllSubjects, getTopicsBySubject } from '../utils/quizLoader';

interface Subject {
  id: string;
  name: string;
  description: string;
  topicCount: number;
  icon?: string;
}

interface Topic {
  id: string;
  name: string;
  subjectId: string;
  questionCount: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

const Subjects_Pages: React.FC = () => {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [difficultyFilter, setDifficultyFilter] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isStartingQuiz, setIsStartingQuiz] = useState(false);

  // Fetch all subjects and topics on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const subjectsData = await getAllSubjects();
        setSubjects(subjectsData);
        
        // If we have subjects, load topics for the first one
        if (subjectsData.length > 0) {
          const firstSubjectId = subjectsData[0].id;
          const topicsData = await getTopicsBySubject(firstSubjectId);
          setTopics(topicsData);
          setSelectedSubject(firstSubjectId);
        }
      } catch (error) {
        console.error('Error loading subjects:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Load topics when a subject is selected
  useEffect(() => {
    if (selectedSubject) {
      const loadTopics = async () => {
        try {
          setTopics([]); // Clear topics while loading
          const topicsData = await getTopicsBySubject(selectedSubject);
          setTopics(topicsData);
        } catch (error) {
          console.error('Error loading topics:', error);
        }
      };
      
      loadTopics();
    }
  }, [selectedSubject]);

  // Handle subject selection
  const handleSubjectSelect = (subjectId: string) => {
    setSelectedSubject(subjectId);
    // Clear selected topics when changing subjects
    setSelectedTopics([]);
  };

  // Toggle topic selection for custom quiz
  const handleTopicToggle = (topicId: string) => {
    setSelectedTopics(prev => 
      prev.includes(topicId)
        ? prev.filter(id => id !== topicId)
        : [...prev, topicId]
    );
  };

  // Toggle difficulty filter
  const handleDifficultyToggle = (difficulty: string) => {
    setDifficultyFilter(prev => 
      prev.includes(difficulty)
        ? prev.filter(d => d !== difficulty)
        : [...prev, difficulty]
    );
  };

  // Start a quiz with selected topics
  const startCustomQuiz = () => {
    if (selectedTopics.length === 0) {
      alert('Please select at least one topic');
      return;
    }
    
    setIsStartingQuiz(true);
    
    // Get the selected topic objects to pass to the quiz
    const selectedTopicObjects = topics.filter(topic => 
      selectedTopics.includes(topic.id)
    );
    
    // Navigate to the quiz page with the selected topics
    navigate('/quiz/random', { 
      state: { 
        topics: selectedTopicObjects.map(t => t.id),
        difficulty: difficultyFilter.length > 0 ? difficultyFilter : undefined,
        // Include the subject ID if it's not "any"
        subjectId: selectedSubject !== 'any' ? selectedSubject : undefined
      } 
    });
  };

  // Filter topics based on search query and difficulty
  const filteredTopics = topics.filter(topic => {
    const matchesSearch = topic.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDifficulty = difficultyFilter.length === 0 || difficultyFilter.includes(topic.difficulty);
    return matchesSearch && matchesDifficulty;
  });

  // Get the current subject name
  const currentSubjectName = selectedSubject 
    ? subjects.find(s => s.id === selectedSubject)?.name || 'Unknown Subject'
    : '';

  // Add a special icon for the "Any" subject
  const getSubjectIcon = (subject: Subject) => {
    if (subject.id === 'any') {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 100-12 6 6 0 000 12z" clipRule="evenodd" />
          <path d="M10 6a1 1 0 011 1v2h2a1 1 0 110 2h-2v2a1 1 0 11-2 0v-2H7a1 1 0 110-2h2V7a1 1 0 011-1z" />
        </svg>
      );
    }
    
    // Return other icons based on subject.icon
    // ... existing icon logic
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Study by Subject</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar with subjects */}
        <div className="lg:col-span-1">
          <div className="bg-gray-800 rounded-lg p-4 sticky top-4">
            <h2 className="text-xl font-semibold mb-4">Subjects</h2>
            <div className="space-y-2">
              {subjects.map(subject => (
                <motion.button
                  key={subject.id}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    selectedSubject === subject.id
                      ? 'bg-primary text-white'
                      : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                  onClick={() => handleSubjectSelect(subject.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="font-medium">{subject.name}</div>
                  <div className="text-sm opacity-80">{subject.topicCount} topics</div>
                </motion.button>
              ))}
            </div>
            
            {/* Difficulty filters */}
            <div className="mt-6">
              <h3 className="font-medium mb-3">Difficulty</h3>
              <div className="flex flex-wrap gap-2">
                <button
                  className={`px-3 py-1 rounded-full text-sm ${
                    difficultyFilter.includes('beginner')
                      ? 'bg-green-500/20 text-green-400 border border-green-500'
                      : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                  onClick={() => handleDifficultyToggle('beginner')}
                >
                  Beginner
                </button>
                <button
                  className={`px-3 py-1 rounded-full text-sm ${
                    difficultyFilter.includes('intermediate')
                      ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500'
                      : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                  onClick={() => handleDifficultyToggle('intermediate')}
                >
                  Intermediate
                </button>
                <button
                  className={`px-3 py-1 rounded-full text-sm ${
                    difficultyFilter.includes('advanced')
                      ? 'bg-red-500/20 text-red-400 border border-red-500'
                      : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                  onClick={() => handleDifficultyToggle('advanced')}
                >
                  Advanced
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main content */}
        <div className="lg:col-span-3">
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">{currentSubjectName}</h2>
              
              {/* Search input */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search topics..."
                  className="bg-gray-700 rounded-lg px-4 py-2 pl-10 w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <svg
                  className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
            
            {/* Topics grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {topics.length === 0 ? (
                <div className="col-span-2 py-8 text-center text-gray-400">
                  Loading topics...
                </div>
              ) : filteredTopics.length > 0 ? (
                filteredTopics.map(topic => (
                  <motion.div
                    key={topic.id}
                    className={`p-4 rounded-lg border ${
                      selectedTopics.includes(topic.id)
                        ? 'border-primary bg-primary/10'
                        : 'border-gray-700 bg-gray-700'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleTopicToggle(topic.id)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{topic.name}</h3>
                        <div className="text-sm text-gray-400 mt-1">
                          {topic.questionCount} questions
                        </div>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs ${
                        topic.difficulty === 'beginner' ? 'bg-green-500/20 text-green-400' :
                        topic.difficulty === 'intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {topic.difficulty}
                      </div>
                    </div>
                    
                    <div className="mt-4 flex justify-between items-center">
                      <button
                        className="text-sm text-primary hover:text-primary-dark"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/quiz/${topic.id}`);
                        }}
                      >
                        Start Quiz
                      </button>
                      
                      <div className="w-5 h-5 rounded-full border border-gray-500 flex items-center justify-center">
                        {selectedTopics.includes(topic.id) && (
                          <div className="w-3 h-3 rounded-full bg-primary"></div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-2 py-8 text-center text-gray-400">
                  No topics found matching your criteria
                </div>
              )}
            </div>
            
            {/* Selected topics summary */}
            {selectedTopics.length > 0 && (
              <div className="mt-8 p-4 bg-gray-700 rounded-lg">
                <h3 className="font-medium mb-2">Selected Topics ({selectedTopics.length})</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedTopics.map(topicId => {
                    const topic = topics.find(t => t.id === topicId);
                    return topic ? (
                      <div key={topicId} className="bg-gray-600 px-3 py-1 rounded-full text-sm flex items-center">
                        {topic.name}
                        <button
                          className="ml-2 text-gray-400 hover:text-white"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTopicToggle(topicId);
                          }}
                        >
                          ×
                        </button>
                      </div>
                    ) : null;
                  })}
                </div>
                <button
                  className={`mt-4 w-full py-2 rounded-lg font-medium ${
                    isStartingQuiz 
                      ? 'bg-green-700 cursor-not-allowed' 
                      : 'bg-green-600 hover:bg-green-700'
                  }`}
                  onClick={startCustomQuiz}
                  disabled={isStartingQuiz}
                >
                  {isStartingQuiz ? 'Starting Quiz...' : 'Start Custom Quiz'}
                </button>
              </div>
            )}
          </div>
          
          {/* Quick access section */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-800 p-4 rounded-lg">
              <h3 className="font-medium mb-3">Popular Topics</h3>
              <ul className="space-y-2">
                <li className="text-sm hover:text-primary cursor-pointer">Requirements Engineering</li>
                <li className="text-sm hover:text-primary cursor-pointer">System Architecture</li>
                <li className="text-sm hover:text-primary cursor-pointer">Verification & Validation</li>
              </ul>
            </div>
            
            <div className="bg-gray-800 p-4 rounded-lg">
              <h3 className="font-medium mb-3">Recently Studied</h3>
              <ul className="space-y-2">
                <li className="text-sm hover:text-primary cursor-pointer">Technical Processes</li>
                <li className="text-sm hover:text-primary cursor-pointer">Project Management</li>
                <li className="text-sm hover:text-primary cursor-pointer">Risk Management</li>
              </ul>
            </div>
            
            <div className="bg-gray-800 p-4 rounded-lg">
              <h3 className="font-medium mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <button 
                  className="w-full text-left text-sm py-2 px-3 bg-gray-700 hover:bg-gray-600 rounded"
                  onClick={() => navigate('/quiz/random')}
                >
                  Random Quiz
                </button>
                <button 
                  className="w-full text-left text-sm py-2 px-3 bg-gray-700 hover:bg-gray-600 rounded"
                  onClick={() => {/* TODO */}}
                >
                  Practice Weak Areas
                </button>
                <button 
                  className="w-full text-left text-sm py-2 px-3 bg-gray-700 hover:bg-gray-600 rounded"
                  onClick={() => {/* TODO */}}
                >
                  Full Practice Exam
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subjects_Pages; 