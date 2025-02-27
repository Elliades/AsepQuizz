# ScoreTracker Component

## Context & Description

The `ScoreTracker` component displays real-time progress and performance metrics during a quiz. It shows the current score, accuracy, time elapsed, and a progress bar. It's a visual aid for the user to track their performance as they answer questions.

## Stack & Technologies

-   **React:** JavaScript library for building user interfaces.
-   **TypeScript:** Superset of JavaScript that adds static typing.
-   **Tailwind CSS:** Utility-first CSS framework.

## Code Structure

-   **`ScoreTracker.tsx`:** The main score tracker component.

## Logic & Key Features

-   **`ScoreTrackerProps` Interface:** Defines the props:
    -   `userAnswers`: An array of `UserAnswer` objects, tracking the user's answers and their correctness.
    -   `totalQuestions`: The total number of questions in the quiz.
    -   `currentTime`: The elapsed time (in seconds).
-   **Calculations:**
    -   `correctAnswers`: Calculates the number of correct answers from the `userAnswers` array.
    -   `answeredQuestions`:  The number of questions the user has answered.
    -   `scorePercentage`: Calculates the accuracy as a percentage.
-   **`formatTime` Function:**  Formats the elapsed time (in seconds) into a `minutes:seconds` string.
-   **Progress Bar:**  A visual progress bar that shows the percentage of questions answered.  Uses Tailwind CSS classes for styling and transitions.

## Constraints & Parameters

-   The time is passed in as a prop (`currentTime`).  This means the parent component is responsible for managing the timer.

## Usage Examples
tsx
// Example usage within a Quiz component:
<ScoreTracker
    userAnswers={userAnswers}
    totalQuestions={totalQuestions}
    currentTime={currentTime}
/>


## References & Resources

-   **React Documentation:** [https://react.dev/](https://react.dev/)
-   **Tailwind CSS Documentation:** [https://tailwindcss.com/](https://tailwindcss.com/)