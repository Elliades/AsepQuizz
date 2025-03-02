# Swipeable Navigation Component

## Context & Description

The SwipeableNavigation component provides an intuitive way to navigate between questions in the quiz interface. It replaces the traditional "Next" button with a swipeable arrow that works well on both desktop and mobile devices.

## Stack & Technologies

- **React:** JavaScript library for building user interfaces
- **TypeScript:** Superset of JavaScript that adds static typing
- **Framer Motion:** Animation library for React
- **Tailwind CSS:** Utility-first CSS framework

## Code Structure

```
/questions
├── SwipeableNavigation.tsx  # The swipeable navigation component
└── QuestionLayout.tsx       # Updated to include the swipeable navigation
```

## Logic & Key Features

- **Swipe Gestures:** Supports left swipe gestures for mobile users
- **Click/Tap Support:** Also works with traditional click/tap interactions
- **Visual Feedback:** Provides visual feedback through animations
- **Accessibility:** Includes proper ARIA attributes and keyboard support
- **Conditional Rendering:** Only appears when navigation is available
- **Disabled State:** Visually indicates when navigation is not available

## Usage Examples

```tsx
// Basic usage
<SwipeableNavigation onNext={handleNextQuestion} />

// Disabled state
<SwipeableNavigation onNext={handleNextQuestion} disabled={true} />

// Within QuestionLayout
<QuestionLayout 
  question={question}
  onNext={handleNextQuestion}
  showNavigation={true}
  isAnswered={hasSelectedAnswer}
>
  {/* Question content */}
</QuestionLayout>
```

## Benefits

1. **Improved Mobile Experience:** Swipe gestures are more natural on mobile devices
2. **Visual Appeal:** Adds a modern, interactive element to the UI
3. **Space Efficiency:** Takes up less space than a traditional button
4. **Consistent Placement:** Always visible in the same location
5. **Intuitive:** The arrow clearly indicates the action (moving forward)

## References & Resources

- [Framer Motion Documentation](https://www.framer.com/motion/)
- [Touch Gestures Best Practices](https://www.smashingmagazine.com/2016/09/the-thumb-zone-designing-for-mobile-users/)
- [Mobile UX Design Principles](https://www.interaction-design.org/literature/article/mobile-ux-design-key-principles) 