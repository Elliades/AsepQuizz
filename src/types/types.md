# Types

## Context & Description
This folder contains the TypeScript type definitions used throughout the application. Centralizing types improves code maintainability and readability.

## Stack & Technologies
- TypeScript

## Code Structure
/types
├── index.ts
├── importMeta.d.s

- **`index.ts`:** Contains all the type definitions.
- **`importMeta.d.ts`:** Contains the type definitions for the `import.meta` object.

## Logic & Key Features
- **`Question`:** Represents a quiz question. Includes properties for the question text, answers, type, source, tags, and an optional explanation.
- **`Answer`:** Represents a single answer option for a question. Includes the answer text, ID, correctness flag, and an optional explanation.
- **`MultipleChoiceQuestion`:** Extends the `Question` type, specifically for multiple-choice questions.
- **`UserAnswer`:** Represents a user's answer to a question. Includes the question ID, the selected answer ID(s), correctness, and time spent.
- **`QuizSeries`:** Represents a series of questions, potentially grouped by a topic or theme.
- **`QuizAttempt`:** Represents a completed quiz attempt, including user ID, quiz ID, score, completion time, answers, and total time spent.
- **`Tag`:** Represents a tag that can be associated with a question (e.g., "favorite", "confusing").

## Constraints & Parameters
- None

## Usage Examples

typescript
// Example usage in a component:
import { Question, UserAnswer } from '../types';
interface MyComponentProps {
    question: Question;
    onAnswerSelect: (answer: UserAnswer) => void;
}


## References & Resources
- **TypeScript Documentation:** [https://www.typescriptlang.org/](https://www.typescriptlang.org/)