# Quiz Components

## Context & Description

This folder contains the components responsible for managing the overall quiz flow, including question progression, scoring, and submission. It handles user interaction and navigation between questions.

## Stack & Technologies

-   **React:** JavaScript library for building user interfaces.
-   **TypeScript:** Superset of JavaScript that adds static typing.
-   **React Router:** Declarative routing library for React (used for navigation to results).
-   **Tailwind CSS:** Utility-first CSS framework.

## Code Structure
/quiz
├── QuickQuiz.tsx
└── Quiz.tsx


-   **`QuickQuiz.tsx`:**  The main component for running a quiz.  Handles question display, answer selection, scoring, and navigation to the results page.
-   **`Quiz.tsx`:**  A simpler quiz component (potentially a previous version or a less-featured alternative).

## Logic & Key Features

-   **`QuickQuiz.tsx`:**
    -   **State Management:** Uses `useState` hooks to manage:
        -   `currentQuestionIndex`: The index of the currently displayed question.
        -   `score`: The user's current score.
        -   `isComplete`: Whether the quiz is finished.
        -   `answers`: An array storing the user's selected answers (as strings or comma-separated strings for multiple-choice).
        -   `showExplanation`: Whether to show the explanation for the current question.
        -   `startTime`: The timestamp when the current question was started.
        -   `userAnswers`: An array of `UserAnswer` objects, tracking detailed answer information.
    -   **`handleAnswerSelect`:** Handles answer selection for simple-choice questions. Auto-submits the answer.
    -   **`handleMultipleChoiceAnswerSelect`:** Handles answer selection for multiple-choice questions. Auto-submits when the correct number of answers is selected.
    -   **`handleSubmit`:**  Calculates the score for the current question, updates the `userAnswers` array, and shows the explanation.
    -   **`handleNext`:**  Advances to the next question or navigates to the results page when the quiz is complete.  Passes quiz data to the results page via `navigate`.
    -   **`renderQuestion`:** Renders the appropriate question component (using `QuizQuestion`) based on the question type.
    -   **Conditional Rendering:** Shows the "Next" button only when the explanation is shown.  Shows "Finish" on the last question.
    -   **Navigation:** Uses `useNavigate` from React Router to navigate to the `/results` page, passing the quiz results as state.
- **Quiz.tsx:**
    - **State Management:**
        -   `currentQuestionIndex`: Index of the current question.
        -   `selectedAnswers`: Array of selected answer IDs.
        -   `userAnswers`: Array to store user answers.
        -   `startTime`: Timestamp for the start of the quiz.
    - **Answer Handling:**
        -   `handleAnswerSelect`: Manages answer selection, differentiating between simple and multiple-choice.
        -   `handleSubmit`: Processes the selected answers, checks correctness, and updates the score.
    - **Scoring:**
        -   `checkIfCorrect`: Determines if the selected answers are correct.
        -   `calculateScore`: Calculates the total score based on correct answers.
    - **Progression:**
        -   Moves to the next question or completes the quiz.
        -   Calls `onComplete` with the score, answers, and time spent.

## Constraints & Parameters

-   **`QuickQuiz.tsx`:** The navigation logic is tightly coupled to the `/results` route.
- **`Quiz.tsx`:** The component has a hardcoded limit of selecting up to 3 answers for multiple-choice questions.

## Usage Examples
tsx
    // Example usage:
    import QuickQuiz from './components/quiz/QuickQuiz';
    import { questions } from './data/questions'; // Assuming questions are stored in a separate file
    function QuizPage() {
    return (
    <QuickQuiz
    questions={questions}
    onComplete={(score) => console.log('Quiz completed with score:', score)}
    />
    );
}


## References & Resources

-   **React Documentation:** [https://react.dev/](https://react.dev/)
-   **React Router Documentation:** [https://reactrouter.com/](https://reactrouter.com/)
-   **Tailwind CSS Documentation:** [https://tailwindcss.com/](https://tailwindcss.com/)
