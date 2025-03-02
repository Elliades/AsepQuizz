# Answer Locking Feature

## Overview

The answer locking feature prevents users from changing their answers after submission. This ensures the integrity of the quiz results and provides a more realistic testing experience.

## Implementation Details

### Question Components

Both `SimpleChoiceQuestionComponent` and `MultipleChoiceQuestionComponent` have been updated to:

1. Accept an `isSubmitted` prop that indicates whether the question has been submitted
2. Disable click handlers when the question is submitted
3. Apply visual styling to indicate that the question is locked (reduced opacity, no hover effects)

### Quiz Components

The `Quiz` and `QuickQuiz` components have been updated to:

1. Track submitted questions using a `Set` of question IDs
2. Mark questions as submitted when an answer is selected (for simple choice) or when the correct number of answers is selected (for multiple choice)
3. Prevent changing answers for submitted questions
4. Pass the `isSubmitted` state to the question components

## Bug Fixes

1. Fixed the `setStartTime` error in QuickQuiz component by properly defining the state setter
2. Added null checks to prevent errors when accessing properties of undefined objects
3. Improved error handling throughout the quiz flow

## User Experience

- When a user selects an answer, it is immediately submitted and cannot be changed
- Visual feedback indicates that the question is locked (reduced opacity, no hover effects)
- The question navigation dots show which questions have been submitted (green) vs. which are still pending (gray)
- When reviewing previous questions, users can see their answers but cannot change them

## Benefits

1. **Integrity**: Ensures that users cannot change their answers after seeing the correct answers
2. **Realism**: Provides a more realistic testing experience similar to actual certification exams
3. **Clarity**: Clearly indicates which questions have been answered and which are still pending
4. **Feedback**: Provides immediate feedback on answer correctness without allowing changes 