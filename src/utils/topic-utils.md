# Topic Utilities

## Context & Description
The Topic Utilities provide a comprehensive set of functions to work with topics as the central organizing principle for connecting source materials with quiz content. This approach allows for more efficient navigation and discovery of related content across different sources and quizzes.

## Stack & Technologies
- TypeScript
- Node.js file system (fs-extra)
- JSON parsing

## Code Structure
```
/src
 ├── utils/
 │   ├── topicUtilsBrowser.ts   # Browser-compatible utility functions for topic-based operations
 │   ├── sourcesUtilsBrowser.ts # Browser-compatible utility functions for sources data
 │   ├── quizLoader.ts          # Updated to support topic-based quiz retrieval
 │   └── sourcesTypes.ts        # Updated with topic-related types
 ├── scripts/
 │   └── generate.mjs           # Script to generate the topic-centric index
```

## Logic & Key Features
- **Topic-Centric Organization**: Topics are now the primary keys in the index structure
- **Efficient Lookups**: Direct topic lookups by name using object properties
- **Relationship Mapping**: Each topic maintains references to its sources, chapters, and sections
- **Related Content Discovery**: Functions to find related topics and questions
- **Backward Compatibility**: Maintains the original subject structure and topic array for compatibility

## Usage Examples
```typescript
// Get all topics
const allTopics = topicUtils.getAllTopics();

// Get a specific topic by name (now more efficient with direct lookup)
const topic = topicUtils.getTopicByName('System Requirements Definition');

// Get topics related to a source
const sourceTopics = topicUtils.getTopicsBySourceId('INCOSE_SEHB5');

// Search for topics
const searchResults = topicUtils.searchTopics('requirements');

// Get related topics
const relatedTopics = topicUtils.getRelatedTopics('System Requirements Definition');

// Get quizzes by topic
const quizzes = quizLoader.getQuizzesByTopic('System Requirements Definition');

// Get questions by topic
const questions = quizLoader.getQuestionsByTopic('System Requirements Definition');

// Get related questions
const relatedQuestions = quizLoader.getRelatedQuestions('System Requirements Definition');
```

## Integration with Quiz System
The topic utilities integrate with the quiz system by:
1. Providing a way to find quizzes and questions by topic
2. Enabling discovery of related content across different sources
3. Supporting search and filtering of quiz content by topic

## Benefits of the Topic-Centric Approach
1. **Improved Navigation**: Users can navigate content by topic rather than just by source or chapter
2. **Content Discovery**: Related content is easier to discover across different sources
3. **Focused Learning**: Users can focus on specific topics regardless of where they appear in the source materials
4. **Efficient Quizzing**: Quizzes can be generated based on topics rather than just sources or chapters
5. **Performance**: Direct lookups by topic name are now more efficient

## References & Resources
- [Node.js File System Documentation](https://nodejs.org/api/fs.html)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/) 