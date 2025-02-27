# Question Components

## Context & Description

This folder contains components responsible for rendering individual questions and handling user interaction with those questions.  It provides different question types (multiple choice, simple choice) and a common layout.  These components are used within the quiz components.

## Stack & Technologies

-   **React:** JavaScript library for building user interfaces.
-   **TypeScript:** Superset of JavaScript that adds static typing.
-   **Tailwind CSS:** Utility-first CSS framework.

## Code Structure
/questions
├── MultipleChoiceQuestion.tsx
├── QuestionLayout.tsx
├── QuizQuestion.tsx
└── SimpleChoiceQuestion.tsx

-   **`MultipleChoiceQuestion.tsx`:**  Renders a multiple choice question.
-   **`QuestionLayout.tsx`:**  Provides a common layout for questions.
-   **`QuizQuestion.tsx`:**  The main question component that can be used in quizzes.
-   **`SimpleChoiceQuestion.tsx`:**  Renders a simple choice question.
## Logic & Key Features

-   **`QuizQuestion`:**
    -   **Type Handling:** Uses a `switch` statement to render the appropriate question component based on the `question.type` property.
    -   **Props:**  Receives the `question`, `selectedAnswer`, `onAnswerSelect`, and `showExplanation` props and passes them down to the specific question components.
    -   **Answer Formatting:** Formats the `selectedAnswer` prop to be compatible with both single and multiple-choice questions.
-   **`MultipleChoiceQuestionComponent`:**
    -   **`handleAnswerClick`:**  Handles toggling the selection of answers.  Ensures that only the correct number of answers can be selected.
    -   **`getAnswerStyle`:**  Dynamically determines the styling for each answer based on whether it's selected, correct, and whether explanations are shown.
    -   **Auto-Submission:**  Automatically submits the answer when the correct number of choices are selected.
-   **`SimpleChoiceQuestionComponent`:**
    -   **`onAnswerSelect`:**  Handles selecting a single answer.
    -   **Styling:**  Applies different styles based on whether the answer is selected, correct, and whether explanations are shown.
-   **`QuestionLayout`:**
    -   **Common Structure:**  Provides a consistent layout for all questions, including the question text, tags, and source information.
    -   **Conditional Rendering:**  Conditionally renders elements like the "!" for important questions, tags, and source information.

## Constraints & Parameters

-   The `QuizQuestion` component uses a `switch` statement, which might become less manageable as more question types are added.  A more scalable approach might be to use a map of question types to components.

## Usage Examples

// Example of a Simple Choice Question
tsx
const simpleQuestion = {
  id: "q1",
  text: "What is the primary purpose of ISO 15288?",
  type: "simpleChoice",
  important: true,
  tags: [{ type: "Fundamentals" }],
  source: "SE Handbook",
  answers: [
    {
      id: "a1",
      text: "To define system life cycle processes",
      isCorrect: true,
      explanation: "ISO 15288 establishes a common framework for describing the life cycle of systems."
    },
    {
      id: "a2", 
      text: "To define project management processes",
      isCorrect: false
    }
  ]
};

<SimpleChoiceQuestionComponent
  question={simpleQuestion}
  selectedAnswer={selectedAnswer}
  onAnswerSelect={(answerId) => handleAnswerSelect(answerId)}
  showExplanation={showExplanation}
/>

// Example of a Multiple Choice Question
tsx
const multiQuestion = {
  id: "q2",
  text: "Which of the following are key stakeholders in systems engineering? (Select all that apply)",
  type: "multipleChoice",
  important: false,
  tags: [{ type: "Stakeholders" }],
  source: "SE Handbook",
  answers: [
    {
      id: "a1",
      text: "End Users",
      isCorrect: true,
      explanation: "End users are primary stakeholders who will interact with the system."
    },
    {
      id: "a2",
      text: "System Engineers",
      isCorrect: true,
      explanation: "System engineers are key stakeholders who design and develop the system."
    },
    {
      id: "a3",
      text: "Competitors",
      isCorrect: false
    }
  ]
};

<MultipleChoiceQuestionComponent
  question={multiQuestion}
  selectedAnswers={selectedAnswers}
  onAnswerSelect={(answerIds) => handleMultipleChoiceAnswerSelect(answerIds)}
  showExplanation={showExplanation}
/>


## References & Resources

-   **React Documentation:** [https://react.dev/](https://react.dev/)
-   **Tailwind CSS Documentation:** [https://tailwindcss.com/](https://tailwindcss.com/)