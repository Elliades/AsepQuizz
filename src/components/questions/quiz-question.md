# Quiz Question Component

## Context & Description

The QuizQuestion component is a central component in the quiz system that renders different types of questions based on their type. It acts as a router that delegates rendering to specialized question components like SimpleChoiceQuestion and MultipleChoiceQuestion.

## Stack & Technologies

- **React:** JavaScript library for building user interfaces
- **TypeScript:** Superset of JavaScript that adds static typing
- **Tailwind CSS:** Utility-first CSS framework

## Code Structure

```
/questions
├── QuizQuestion.tsx         # Main question router component
├── SimpleChoiceQuestion.tsx # Component for single-answer questions
├── MultipleChoiceQuestion.tsx # Component for multiple-answer questions
└── QuestionLayout.tsx       # Common layout for all question types
```

## Logic & Key Features

- **Type-Based Routing:** Uses a switch statement to render the appropriate question component based on the question type
- **Case-Insensitive Matching:** Handles different case variations in question types
- **Default Values:** Provides default values for optional props to prevent errors
- **Error Handling:** Displays a helpful error message for unknown question types
- **Consistent Interface:** Provides a consistent interface for all question types
- **Navigation Integration:** Supports the swipeable navigation component

## Usage Examples

```tsx
// Basic usage
<QuizQuestion
  question={question}
  selectedAnswers={['answer1']}
  onAnswerSelect={(answers) => handleAnswerSelect(answers)}
  showExplanation={false}
/>

// With navigation
<QuizQuestion
  question={question}
  selectedAnswers={['answer1']}
  onAnswerSelect={(answers) => handleAnswerSelect(answers)}
  showExplanation={true}
  onNext={handleNextQuestion}
/>
```

## Constraints & Parameters

- The `question` prop must include a valid `type` property ('simple-choice' or 'multiple-choice')
- The `selectedAnswers` prop should be an array of answer IDs
- The `onAnswerSelect` callback is called with an array of selected answer IDs
- The `showExplanation` prop controls whether explanations are shown
- The optional `onNext` prop enables navigation to the next question

## Benefits

1. **Modularity:** Each question type is handled by a specialized component
2. **Flexibility:** Supports different question types with a consistent interface
3. **Robustness:** Includes error handling and default values
4. **Maintainability:** Easy to add new question types in the future

## References & Resources

- [React Conditional Rendering](https://reactjs.org/docs/conditional-rendering.html)
- [TypeScript Interfaces](https://www.typescriptlang.org/docs/handbook/interfaces.html)
- [React Props](https://reactjs.org/docs/components-and-props.html) 