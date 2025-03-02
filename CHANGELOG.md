# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.2] - 2024-03-XX

### Added
- Comprehensive quiz results page with detailed analytics
- Performance analysis with visual indicators
- Topic-wise performance breakdown
- Difficulty level analysis for each topic
- Areas for improvement highlighting
- Incorrect questions review section
- Enhanced quiz loading with timeout handling
- Detailed logging for quiz loading process

### Changed
- Improved type safety across components
- Enhanced error handling in quiz loading
- Updated quiz subject relationships
- Refined difficulty level handling
- Improved time calculation in results display

### Fixed
- Type safety issues with difficulty levels
- Reduce operation in Results_Pages component
- Quiz_Page subject ID matching
- Undefined property access in topic statistics
- Time calculation in Results_Pages component

### Technical
- Added loadQuizzesWithTimeout function
- Updated Question interface with difficulty types
- Enhanced quizLoader.ts with detailed logging
- Improved type definitions
- Added safety checks for difficulty levels

## [0.1.1] - 2024-03-XX

### Added
- Enhanced random question selection from all available quizzes
- Support for combining questions from multiple quiz files

### Changed
- Updated question selection algorithm to ensure better randomization
- Improved question distribution across different topics

### Technical
- Refactored quiz data loading mechanism
- Enhanced question pooling functionality

## [0.1.0] - 2024-03-XX

### Added
- Initial project setup
- Basic file structure
- Project configuration files
- Development environment setup

### Features
- Project structure for React/Vite application
- TypeScript configuration
- TailwindCSS integration
- Basic component architecture

### Tasks Remaining
- Set up backend infrastructure
- Implement authentication system
- Create database schema
- Develop initial UI components

### Changed
- Updated question display format
- Enhanced results visualization
- Improved navigation flow

### Technical
- Set up React with TypeScript
- Implemented TailwindCSS for styling
- Created base component structure
- Established type definitions 

## [Unreleased]

### Added
- Random Quiz feature that selects questions from multiple quizzes
- Enhanced question selection algorithm with Fisher-Yates shuffle
- Support for filtering random questions by topic and difficulty
- Enhanced answer feedback animations for both correct and incorrect answers
- Shake effect for incorrect answers
- Shine effect for correct answers
- Smooth transitions between animation states
- Improved visual feedback for quiz interactions
- Answer locking feature to prevent changing answers after submission
- Visual indicators for locked answers (reduced opacity, disabled hover effects)
- Tracking of submitted questions using a Set of question IDs

### Changed
- Updated Quiz_Page component to handle random question selection
- Improved quiz loading with better error handling
- Refactored AnswerFeedback component to handle both correct and incorrect answers
- Updated CSS animations to be more subtle and professional
- Improved timing of animations for better user experience
- Updated SimpleChoiceQuestionComponent and MultipleChoiceQuestionComponent to support answer locking
- Enhanced Quiz and QuickQuiz components to track submitted questions
- Improved visual feedback for submitted questions

### Fixed
- Type safety issues with difficulty levels
- Reduce operation in Results_Pages component
- Quiz_Page subject ID matching
- Undefined property access in topic statistics
- Time calculation in Results_Pages component

### Technical
- Added loadQuizzesWithTimeout function
- Updated Question interface with difficulty types
- Enhanced quizLoader.ts with detailed logging
- Improved type definitions
- Added safety checks for difficulty levels
- Fixed `setStartTime` error in QuickQuiz component
- Added proper state management for quiz timing
- Improved error handling and null checks in quiz components

## [0.1.0] - 2024-03-XX

### Added
- Initial project setup
- Basic file structure
- Project configuration files
- Development environment setup

### Features
- Project structure for React/Vite application
- TypeScript configuration
- TailwindCSS integration
- Basic component architecture

### Tasks Remaining
- Set up backend infrastructure
- Implement authentication system
- Create database schema
- Develop initial UI components

### Changed
- Updated question display format
- Enhanced results visualization
- Improved navigation flow

### Technical
- Set up React with TypeScript
- Implemented TailwindCSS for styling
- Created base component structure
- Established type definitions 

## [Unreleased]

### Added
- Random Quiz feature that selects questions from multiple quizzes
- Enhanced question selection algorithm with Fisher-Yates shuffle
- Support for filtering random questions by topic and difficulty

### Changed
- Updated Quiz_Page component to handle random question selection
- Improved quiz loading with better error handling 