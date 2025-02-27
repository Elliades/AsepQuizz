# Components Documentation

This document provides a comprehensive overview of the React components within the `/components` directory of the ASEP Quiz application. It covers the architecture, logic, usage, and dependencies of each component.

## Table of Contents

1.  [Layout.tsx](#layouttsx)
2.  [Navigation.tsx](#navigationtsx)
3.  [questions Folder](#questions-folder)
    -   [MultipleChoiceQuestionComponent.tsx](#multiplechoicequestioncomponenttsx)
    -   [QuestionLayout.tsx](#questionlayouttsx)
    -   [QuizQuestion.tsx](#quizquestiontsx)
    -   [SimpleChoiceQuestionComponent.tsx](#simplechoicequestioncomponenttsx)
4.  [quiz Folder](#quiz-folder)
    -   [QuickQuiz.tsx](#quickquiztsx)
    -   [Quiz.tsx](#quiztsx)
5.  [Results.tsx](#resultstsx)
6.  [ScoreTracker.tsx](#scoretrackertsx)
7.  [Results.test.tsx](#resultstesttsx)

---

## 1. <a name="layouttsx"></a>`components/Layout.tsx`

### Context & Description

-   **Role:** Provides the basic layout structure for all pages in the application. It ensures a consistent look and feel across the app, including the navigation bar and main content area.
-   **Place in Architecture:** Top-level component that wraps page-level components.

### Stack & Technologies

-   **Frameworks/Libraries:** React, React Router (for `Navigation` component).

### Code Structure 