# Sources Utilities

## Context & Description
The Sources Utilities provide a comprehensive set of functions to work with the detailed source materials data stored in `sources.json`. These utilities enable searching, filtering, and retrieving information about subjects, chapters, sections, and topics.

## Stack & Technologies
- TypeScript
- Node.js file system (fs)
- JSON parsing

## Code Structure
```
/src
 ├── utils/
 │   ├── sourcesUtils.ts       # Main utility functions for sources data
 │   ├── generateIndex.ts      # Script to generate index.json from sources.json
 │   └── quizLoader.ts         # Updated to use sourcesUtils
 ├── scripts/
 │   └── generateIndex.ts      # Script to run the index generation
```

## Logic & Key Features
- **Caching**: Sources data is cached to avoid repeated file reads
- **Hierarchical Navigation**: Functions to navigate the source hierarchy (sources > chapters > sections)
- **Search Capabilities**: Search for topics across all sources
- **Path Resolution**: Get the full path to a section
- **Related Content**: Find related topics for a given topic

## Usage Examples
```typescript
// Get all sources
const allSources = sourcesUtils.getAllSources();

// Get a specific source by ID
const source = sourcesUtils.getSourceById('INCOSE_SEHB5');

// Search for topics
const results = sourcesUtils.searchTopics('requirements');

// Get related topics
const relatedTopics = sourcesUtils.getRelatedTopics('System Requirements Definition');

// Get the full path to a section
const path = sourcesUtils.getSectionPath('ch2.3.5');
```

## Integration with Quiz System
The sources utilities integrate with the quiz system by:
1. Providing detailed information about subjects and chapters
2. Enabling topic-based searching for quiz questions
3. Supporting the generation of the simplified index.json used by the application

## References & Resources
- [Node.js File System Documentation](https://nodejs.org/api/fs.html)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/) 