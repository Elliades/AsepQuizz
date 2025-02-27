# Results Component

## Context & Description

This folder contains the component responsible for displaying the results of a quiz. It shows the user's score, correct/incorrect answers, and timing information.

## Stack & Technologies

-   **React:** JavaScript library for building user interfaces.
-   **TypeScript:** Superset of JavaScript that adds static typing.
-   **React Router:** Declarative routing library for React (used for accessing location state).
-   **Tailwind CSS:** Utility-first CSS framework.

## Code Structure
/results
├── Results.tsx
└── Results.test.tsx


-   **`Results.tsx`:** The main component for displaying quiz results.
-   **`Results.test.tsx`:** Unit tests for the `Results` component.

## Logic & Key Features

-   **`Results.tsx`:**
    -   **Data Source:**  Can receive quiz results either as a prop (`attempt`) or from the `location.state` (passed by React Router).  This allows the component to be used in different contexts (e.g., immediately after a quiz or from a history page).
    -   **Data Handling:**  Safely handles cases where no results data is available.
    -   **Calculations:** Calculates:
        -   `totalQuestions`
        -   `correctAnswers`
        -   `score` (as a percentage)
        -   `totalTime`
        -   `averageTime` per question
    -   **Display:**  Presents the calculated statistics in a user-friendly format.
    -   **Optional Retry:**  If an `onRetry` prop is provided, displays a "Try Again" button that calls the provided function.
-   **`Results.test.tsx`:**
    -   **Basic Rendering Tests:** Checks if the component renders correctly with and without data.

## Constraints & Parameters

-   Relies on specific data structures (`QuizAttempt`, `UserAnswer`) for the results data.

## Usage Examples
tsx
// Example usage (immediately after a quiz):
navigate('/results', {
    state: {
        score: updatedAnswers.filter(answer => answer.isCorrect).length,
        total: questionsWithTopics.length,
        answers: updatedAnswers,
        timeSpent: updatedAnswers.reduce((total, answer) => total + (answer.timeSpent || 0), 0),
        questions: questionsWithTopics,
    },
});
// Example usage (from a history page):
<Results attempt={pastQuizAttempt} onRetry={() => handleRetry(pastQuizAttempt.quizId)} />


## References & Resources

-   **React Documentation:** [https://react.dev/](https://react.dev/)
-   **React Router Documentation:** [https://reactrouter.com/](https://reactrouter.com/)
-   **Tailwind CSS Documentation:** [https://tailwindcss.com/](https://tailwindcss.com/)
-   **Testing Library React:** [https://testing-library.com/docs/react-testing-library/intro/](https://testing-library.com/docs/react-testing-library/intro/)