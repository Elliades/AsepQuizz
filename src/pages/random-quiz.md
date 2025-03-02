# Random Quiz Feature

## Context & Description
The Random Quiz feature allows users to take quizzes with questions randomly selected from all available quizzes in the system. This provides a more diverse learning experience and helps users test their knowledge across different topics and difficulty levels.

## Implementation
The feature is implemented by:
1. Adding a `getRandomQuestions` function to the quizLoader utility
2. Creating a custom hook `useRandomQuestions` for component use
3. Updating the Quiz_Page component to handle the 'random' seriesId

## Stack & Technologies
- React
- TypeScript
- React Router
- Custom Hooks

## Code Structure
```
/src
 ├── hooks/
 │   └── useRandomQuestions.ts   # Custom hook for fetching random questions
 ├── pages/
 │   └── RandomQuizPage.tsx      # Page component for the random quiz
 ├── utils/
 │   └── quizLoader.ts           # Utility for loading quizzes and questions
```

## Logic & Key Features
- **Random Question Selection**: Questions are randomly selected from all available quizzes
- **Filtering**: Questions can be filtered by topic and difficulty
- **Unique Questions**: Ensures no duplicate questions in a single quiz session
- **Balanced Distribution**: Provides a mix of topics and difficulty levels

## Constraints & Parameters
- The number of questions is configurable (default: 10)
- Filtering is optional and can be applied to topics and difficulty levels
- Questions can be excluded by ID to prevent repetition

## Usage
To start a random quiz, navigate to `/quiz/random` or use the "Random Quiz" button on the home page.

## Usage Examples
```tsx
// Basic usage with default settings (10 random questions)
<RandomQuizPage />

// Custom number of questions
<RandomQuizPage questionCount={20} />

// In a route definition
<Route path="/quiz/random" element={<RandomQuizPage />} />
```

## References & Resources
- [React Hooks Documentation](https://react.dev/reference/react)
- [Fisher-Yates Shuffle Algorithm](https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle) 