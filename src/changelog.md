# Changelog

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