# Swipeable Navigation Component

## Context & Description

The SwipeableNavigation component provides bidirectional navigation between questions in the quiz interface. It replaces traditional navigation buttons with swipeable arrows that work well on both desktop and mobile devices. The component follows these navigation rules:

- Grey left arrow for going back (always available except on first question)
- Grey right arrow for going forward to already answered questions
- Green right arrow for going forward after submitting the current question
- No right arrow for unanswered questions

Users can also swipe anywhere on the screen to navigate between questions.

## Stack & Technologies

- **React:** JavaScript library for building user interfaces
- **TypeScript:** Superset of JavaScript that adds static typing
- **Framer Motion:** Animation library for React
- **Tailwind CSS:** Utility-first CSS framework

## Code Structure

```
/navigation
└── SwipeableNavigation.tsx  # The bidirectional swipeable navigation component
```

## Usage Examples

```tsx
// Basic usage
<SwipeableNavigation
  onNext={handleNextQuestion}
  onPrevious={handlePreviousQuestion}
  showNext={true}
  isNextEnabled={true}
  containerRef={containerRef}
/>

// First question (no back arrow)
<SwipeableNavigation
  onNext={handleNextQuestion}
  onPrevious={handlePreviousQuestion}
  showNext={false}
  isNextEnabled={false}
  isFirstQuestion={true}
  containerRef={containerRef}
/>

// Unanswered question (no next arrow)
<SwipeableNavigation
  onNext={handleNextQuestion}
  onPrevious={handlePreviousQuestion}
  showNext={false}
  isNextEnabled={false}
  containerRef={containerRef}
/>

// Previously answered question (grey next arrow)
<SwipeableNavigation
  onNext={handleNextQuestion}
  onPrevious={handlePreviousQuestion}
  showNext={true}
  isNextEnabled={false}
  containerRef={containerRef}
/>

// Last question
<SwipeableNavigation
  onNext={handleNextQuestion}
  onPrevious={handlePreviousQuestion}
  showNext={true}
  isNextEnabled={true}
  isLastQuestion={true}
  containerRef={containerRef}
/>
```

## Logic & Key Features

- **Bidirectional Navigation:** Supports both forward and backward navigation
- **Visual Feedback:** Different colors indicate different navigation states
- **Context-Aware:** Shows/hides arrows based on navigation context
- **Full-Screen Swipe:** Users can swipe anywhere on the screen to navigate
- **Responsive Design:** Works well on both desktop and mobile devices
- **Animation:** Provides visual feedback during interactions
- **Last Question Indicator:** Shows a checkmark instead of an arrow for the last question
- **First Question Handling:** Hides the back arrow on the first question
- **Fixed Positioning:** Arrows stay in the same place regardless of question length
- **Optimized Positioning:** Arrows are positioned to avoid overlapping with content

## Benefits

1. **Improved Mobile Experience:** Swipe gestures are more natural on mobile devices
2. **Visual Appeal:** Adds a modern, interactive element to the UI
3. **Intuitive Navigation:** Clear visual cues for navigation options
4. **Consistent Placement:** Navigation controls always visible in the same location
5. **Contextual Feedback:** Different colors indicate different navigation states
6. **Accessibility:** Positioned for easy thumb access on mobile devices
7. **Convenience:** Users can swipe anywhere on the screen to navigate
8. **Content Visibility:** Arrows positioned to avoid obscuring content
9. **Consistent Experience:** Arrows stay in fixed positions regardless of content length

## References & Resources

- [Framer Motion Documentation](https://www.framer.com/motion/)
- [Touch Gestures Best Practices](https://www.smashingmagazine.com/2016/09/the-thumb-zone-designing-for-mobile-users/)
- [Mobile UX Design Principles](https://www.interaction-design.org/literature/article/mobile-ux-design-key-principles) 