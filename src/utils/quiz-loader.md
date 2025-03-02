# Quiz Loader

## Context & Description
The Quiz Loader is responsible for loading quiz data from JSON files and organizing it by subject. It handles subject ID validation, question ID uniqueness, and topic standardization.

## Stack & Technologies
- TypeScript
- Dynamic imports with Vite
- JSON parsing

## Code Structure
```
/src
 ├── utils/
 │   ├── quizLoader.ts           # Main quiz loading functionality
 │   ├── quizTopicMapper.ts      # Maps quiz topics to standardized topics
 │   ├── subjectMapper.ts        # Maps quiz subject IDs to index subject IDs
 │   └── topicUtilsBrowser.ts    # Browser-compatible topic utilities
 ├── data/
 │   ├── quizzes/                # Quiz JSON files
 │   └── subjects/               # Subject data including index.json
```

## Logic & Key Features
- **Dynamic Loading**: Uses Vite's import.meta.glob to dynamically load all quiz files
- **Subject ID Mapping**: Maps quiz-specific subject IDs to standardized index subject IDs
- **Question ID Uniqueness**: Ensures all question IDs are unique across all quizzes
- **Topic Standardization**: Maps quiz topics to standardized topics from the index
- **Bidirectional Access**: Allows accessing quizzes by both quiz subject ID and index subject ID

## Usage Examples
```typescript
// Get all subjects
const subjects = getSubjects();

// Get quizzes for a subject
const quizzes = getQuizzesBySubject('se-lifecycle');

// Get a specific quiz by ID
const quiz = getQuizById('se-lifecycle-quiz-1');

// Get random questions
const randomQuestions = getRandomQuestions(10);

// Get quizzes by topic
const quizzes = getQuizzesByTopic('System Life Cycle');

// Get questions by topic
const questions = getQuestionsByTopic('System Life Cycle');

// Get related questions for a topic
const relatedQuestions = getRelatedQuestions('System Life Cycle');
```

## Integration with Topic System
The quiz loader integrates with the topic system by:
1. Using the quiz topic mapper to standardize topics
2. Providing functions to get quizzes and questions by topic
3. Supporting related content discovery through topic relationships

## Benefits
1. **Flexibility**: Accommodates different subject ID schemes in quizzes and index
2. **Consistency**: Ensures standardized topics across all quiz content
3. **Bidirectional Mapping**: Allows accessing content by both quiz subject ID and index subject ID
4. **Robustness**: Handles errors and edge cases gracefully
5. **Performance**: Uses caching and efficient data structures

## References & Resources
- [Vite Dynamic Imports](https://vitejs.dev/guide/features.html#glob-import)
- [TypeScript Record Type](https://www.typescriptlang.org/docs/handbook/utility-types.html#recordkeys-type) 