# Changelog

## [2.1.0] - 2024-06-XX

### Added
- Bidirectional swipeable navigation for questions
- Mobile-friendly navigation with swipe gestures
- Visual feedback for navigation interactions
- Right-side positioning for easier thumb access
- Special checkmark icon for the last question
- Full-screen swipe support for easier navigation
- Context-aware navigation arrows (different colors for different states)
- Ability to navigate back to previous questions
- Fixed positioning for navigation arrows

### Changed
- Replaced traditional navigation buttons with swipeable arrows
- Improved mobile experience with swipe gestures
- Enhanced visual feedback during interactions
- Expanded swipe detection to the entire quiz container
- Updated navigation logic to support bidirectional movement
- Optimized arrow positioning to avoid overlapping with content
- Removed back arrow on first question for better UX
- Fixed arrow positions to stay consistent regardless of question length

## [2.0.0] - 2024-06-XX

### Added
- Topic-centric index structure with topics as primary keys
- Direct topic lookup by name for improved performance
- Browser-compatible utilities for working with topics and sources
- Quiz topic mapper to standardize topic references
- Script to update existing quiz files with standardized topics
- Subject mapper to handle different subject ID schemes
- Auto-registration of new subject IDs during quiz loading
- Script to update subject mappings based on quiz files

### Changed
- Restructured index.json to prioritize topics over subjects
- Updated topicUtils to work with the new structure
- Improved documentation for topic-based organization
- Quiz questions now use standardized topic names
- Quiz loader now supports both quiz subject IDs and index subject IDs

### Fixed
- Browser compatibility issues with Node.js-specific modules
- Inconsistent topic references in quiz files
- Subject ID validation issues in quiz loader
- Handling of unknown subject IDs in quiz files 