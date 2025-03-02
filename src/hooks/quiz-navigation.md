# Quiz Navigation Hook

## Overview

The `useQuizNavigation` hook centralizes quiz navigation logic across the application, providing a consistent interface for tracking and controlling question navigation. It implements the specific navigation rules required for the ASEP quiz application.

## Key Features

1. **Question State Tracking**
   - Keeps track of the current question index
   - Tracks the furthest viewed question
   - Maintains a set of submitted question IDs

2. **Navigation Controls**
   - Provides functions for moving to the next or previous question
   - Handles auto-advancing after answer submission
   - Prevents changing answers after submission

3. **Navigation Visibility Rules**
   - Implements the specific rules for showing/hiding navigation controls:
     - Never shows next button on the last question
     - Only shows next button when navigating backwards to review previously viewed questions
     - Hides navigation during auto-advancing

4. **Completion Handling**
   - Calls a completion callback when the quiz is finished
   - Tracks time spent on questions

## Usage

```typescript
// Basic usage
const navigation = useQuizNavigation(questions, onComplete);

// Access navigation state
const { currentIndex, isCurrentQuestionSubmitted } = navigation;

// Use navigation controls
<button onClick={navigation.goToNext}>Next</button>
<button onClick={navigation.goToPrevious}>Previous</button>

// Control navigation visibility
{navigation.shouldShowNextButton() && <NextButton />}

// Submit a question
navigation.markQuestionSubmitted(questionId, true);
```

## Navigation Rules

The hook implements these specific navigation rules:

1. **Next button visibility:**
   - Never shown on the last question
   - Only shown when navigating backwards to review previously viewed questions
   - Not shown during auto-advancing

2. **Auto-advancing behavior:**
   - Automatically advances to the next question after submission (1.5 second delay)
   - Triggers quiz completion if the last question is submitted

3. **Edge cases:**
   - If a user has answered questions 1-3 out of 5, then goes back to question 2, the next button appears
   - If a user is at their furthest viewed question, the next button doesn't appear
   - In complete quiz review, the next button appears on all questions except the last one

## Benefits of Centralization

1. **Consistency**: Ensures that navigation behaves the same way across different quiz components
2. **Maintainability**: Changes to navigation rules only need to be made in one place
3. **Reusability**: Can be used in any component that needs quiz navigation
4. **Separation of Concerns**: Separates navigation logic from rendering logic
5. **Testability**: Makes it easier to test navigation logic independently

## Implementation Notes

The hook uses React's built-in state management with `useState` to track navigation state. It ensures that the `furthestViewedIndex` is properly updated whenever the current question changes, which is critical for implementing the navigation visibility rules correctly. 