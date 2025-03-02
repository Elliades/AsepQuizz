# Quiz Topic Mapper

## Context & Description
The Quiz Topic Mapper provides utilities to map quiz chapter/topic references to the standardized topics in the index.json file. This ensures consistency between quiz content and the topic-centric organization of the index.

## Stack & Technologies
- TypeScript
- String normalization and matching algorithms

## Code Structure
```
/src
 ├── utils/
 │   ├── quizTopicMapper.ts      # Utility for mapping quiz topics to index topics
 │   ├── quizLoader.ts           # Updated to use the topic mapper
 │   └── topicUtilsBrowser.ts    # Used to access the topic data
 ├── scripts/
 │   └── updateQuizTopics.mjs    # Script to update existing quiz files
```

## Logic & Key Features
- **String Normalization**: Removes punctuation, extra spaces, and converts to lowercase for better matching
- **Multi-level Matching**: Tries exact matches, then chapter/section matches, then partial matches
- **Caching**: Caches results for better performance
- **Fallback Strategy**: Returns the original value if no match is found

## Usage Examples
```typescript
// Find a topic for a chapter name
const topicName = quizTopicMapper.findTopicForChapter("Tailoring Considerations");

// Find a topic for a section name
const topicName = quizTopicMapper.findTopicForSection("4.1 Tailoring Considerations");

// Find a topic for a question
const question = {
  topic: "System Life Cycle Processes",
  chapter: "4.1 Tailoring Considerations"
};
const topicName = quizTopicMapper.findTopicForQuestion(question);
```

## Integration with Quiz System
The topic mapper integrates with the quiz system by:
1. Automatically mapping quiz topics to standardized topics during quiz loading
2. Providing a script to update existing quiz files
3. Ensuring consistency between quiz content and the topic-centric organization

## Benefits of Topic Mapping
1. **Consistency**: Ensures that all quiz content uses the same topic names
2. **Improved Navigation**: Makes it easier to find related content
3. **Better Organization**: Aligns quiz content with the topic-centric structure
4. **Backward Compatibility**: Works with existing quiz files without requiring manual updates

## References & Resources
- [String Normalization in JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize)
- [Regular Expressions in JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions) 