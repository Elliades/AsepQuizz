# Topic-Centric Organization

## Overview

The ASEP Quiz application has been restructured to use a topic-centric organization, making topics the primary keys in the index structure. This change improves content discovery, navigation, and quiz organization.

## Key Components

### 1. Topic-Centric Index

The index.json file now uses topics as primary keys, with each topic containing references to:
- Sources (e.g., INCOSE Handbook, ISO 15288)
- Chapters within those sources
- Sections within those chapters

This structure allows for efficient lookup of topics and related content.

### 2. Topic Utilities

The topic utilities provide functions to:
- Get all topics
- Find topics by name, source, chapter, or section
- Search topics by keywords
- Find related topics

These utilities are available in both Node.js and browser-compatible versions.

### 3. Quiz Topic Mapper

The Quiz Topic Mapper standardizes topic references in quiz questions by:
- Normalizing strings for comparison
- Finding the best matching topic for a chapter or section name
- Mapping question topics to standardized topics from the index
- Caching results for better performance

### 4. Subject Mapper

The Subject Mapper handles the mapping between quiz-specific subject IDs and standardized index subject IDs:
- Provides bidirectional mapping between quiz and index subject IDs
- Validates subject IDs against both quiz and index sources
- Supports automatic registration of new subject IDs
- Centralizes subject ID mapping in one place

### 5. Update Scripts

Two scripts have been added to maintain consistency:
- `update-quiz-topics.mjs`: Updates quiz files with standardized topic names
- `update-subject-mappings.mjs`: Scans quiz files and updates the subject mapper with new subject IDs

## Benefits

1. **Improved Content Discovery**: Users can more easily find related content across different sources
2. **Focused Learning**: Users can focus on specific topics regardless of source
3. **Efficient Quizzing**: Quizzes can be organized by topic rather than just by source
4. **Flexibility**: The system accommodates different subject ID schemes in quizzes and index
5. **Performance**: Direct lookups by topic name are now more efficient (O(1) instead of O(n))
6. **Robustness**: The system handles errors and edge cases gracefully

## Usage Examples

```typescript
// Get a topic by name (direct lookup)
const topic = topicUtils.getTopicByName('System Requirements Definition');

// Get topics for a source
const topics = topicUtils.getTopicsBySourceId('INCOSE_SEHB5');

// Get quizzes for a topic
const quizzes = quizLoader.getQuizzesByTopic('System Requirements Definition');

// Get questions for a topic
const questions = quizLoader.getQuestionsByTopic('System Requirements Definition');

// Get related questions
const relatedQuestions = quizLoader.getRelatedQuestions('System Requirements Definition');

// Map a quiz subject ID to an index subject ID
const standardizedId = subjectMapper.getStandardizedSubjectId('se-lifecycle');

// Register a new subject ID
subjectMapper.registerSubjectId('se-new-subject', 'INCOSE_SEHB5');
```

## Future Enhancements

1. **Topic Relationships**: Add explicit relationships between topics (prerequisites, related topics)
2. **Topic Difficulty Levels**: Add difficulty levels to topics for better quiz generation
3. **Topic Learning Paths**: Create suggested learning paths through topics
4. **Topic Statistics**: Track user performance by topic for personalized recommendations 