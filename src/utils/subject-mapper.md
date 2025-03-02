# Subject Mapper

## Context & Description
The Subject Mapper provides utilities to map quiz-specific subject IDs to the standardized subject IDs in the index.json file. This ensures consistency between quiz content and the subject organization in the index.

## Stack & Technologies
- TypeScript
- JSON parsing

## Code Structure
```
/src
 ├── utils/
 │   ├── subjectMapper.ts        # Utility for mapping quiz subject IDs to index subject IDs
 │   └── quizLoader.ts           # Uses the subject mapper for validation and mapping
 ├── scripts/
 │   └── updateSubjectMappings.mjs # Script to update subject mappings based on quiz files
```

## Logic & Key Features
- **Bidirectional Mapping**: Maps between quiz-specific subject IDs and standardized index subject IDs
- **Validation**: Checks if a subject ID is valid (either a quiz subject ID or an index subject ID)
- **Auto-Registration**: Can automatically register new subject IDs encountered during quiz loading
- **Comprehensive Access**: Provides functions to get all valid subject IDs and related mappings

## Usage Examples
```typescript
// Get the standardized subject ID for a quiz subject ID
const standardizedId = subjectMapper.getStandardizedSubjectId('se-lifecycle');

// Get all quiz subject IDs that map to an index subject ID
const quizSubjectIds = subjectMapper.getQuizSubjectIds('INCOSE_SEHB5');

// Check if a subject ID is valid
const isValid = subjectMapper.isValidSubjectId('se-lifecycle');

// Get all valid subject IDs
const allSubjectIds = subjectMapper.getAllSubjectIds();

// Register a new subject ID
subjectMapper.registerSubjectId('se-new-subject', 'INCOSE_SEHB5');
```

## Integration with Quiz System
The subject mapper integrates with the quiz system by:
1. Providing validation for subject IDs during quiz loading
2. Enabling bidirectional access to quizzes by both quiz subject ID and index subject ID
3. Supporting automatic registration of new subject IDs

## Benefits
1. **Flexibility**: Accommodates different subject ID schemes in quizzes and index
2. **Consistency**: Ensures standardized subject IDs across all quiz content
3. **Robustness**: Handles errors and edge cases gracefully
4. **Maintainability**: Centralizes subject ID mapping in one place
5. **Extensibility**: Easily add new subject ID mappings as needed

## References & Resources
- [TypeScript Record Type](https://www.typescriptlang.org/docs/handbook/utility-types.html#recordkeys-type)
- [Set in JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set) 