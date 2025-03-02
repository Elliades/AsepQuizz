# Answer Feedback Component

## Overview

The AnswerFeedback component provides visual feedback when users select answers in quizzes. It applies different animations based on whether the selected answer is correct or incorrect.

## Features

### Correct Answer Feedback
- Green pulsing border
- Shine effect that sweeps across the element
- Subtle green background highlight that fades out
- Smooth transition to the final state

### Incorrect Answer Feedback
- Red pulsing border with glow effect
- Shake animation for immediate tactile feedback
- Red background flash that gradually fades out
- Smooth transition to the final state

## Implementation Details

The component uses direct DOM manipulation with CSS classes to apply animations:

1. When an answer is selected, the appropriate class is added to the element:
   - `answer-feedback-correct` for correct answers
   - `answer-feedback-incorrect` for incorrect answers

2. CSS animations are applied using pseudo-elements:
   - `::before` for background effects
   - `::after` for shine/glow effects

3. After the animation completes, the component smoothly transitions to the final state:
   - For correct answers in explanation mode: maintains green styling
   - For incorrect answers in explanation mode: maintains red styling
   - Otherwise: returns to the original styling

## Usage

```tsx
<AnswerFeedback 
  isCorrect={boolean}  // Whether the answer is correct
  isVisible={boolean}  // Whether to show the feedback
  element={HTMLElement}  // The DOM element to apply the effect to
/>
```

The component is used in both SimpleChoiceQuestionComponent and MultipleChoiceQuestionComponent to provide feedback when users select answers. 