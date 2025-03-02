# Answer Feedback Component

## Context & Description

The AnswerFeedback component provides a subtle animated border effect for selected answers in the quiz. It creates a continuous, looping spark that travels along the perimeter of the answer component, giving the impression of a glowing light circling the component.

The color of the border changes based on whether the answer is correct (green) or incorrect (red), providing immediate visual feedback to the user.

## Stack & Technologies

- **React:** JavaScript library for building user interfaces
- **TypeScript:** Superset of JavaScript that adds static typing
- **Framer Motion:** Animation library for React
- **CSS Animations:** For the spark effect
- **Tailwind CSS:** Utility-first CSS framework

## Code Structure

```
/feedback
├── AnswerFeedback.tsx  # The animated feedback component
└── AnswerFeedback.css  # CSS animations for the spark effect
```

## Usage Examples

```tsx
// Basic usage with a ref to the target element
const answerRef = useRef<HTMLDivElement>(null);

<div ref={answerRef}>Answer content</div>

<AnswerFeedback 
  isCorrect={true} 
  isVisible={true} 
  targetRef={answerRef}
/>

// Incorrect answer feedback
<AnswerFeedback 
  isCorrect={false} 
  isVisible={true} 
  targetRef={answerRef}
/>

// Hidden feedback
<AnswerFeedback 
  isCorrect={true} 
  isVisible={false} 
  targetRef={answerRef}
/>
```

## Logic & Key Features

- **Animated Border:** Creates a glowing border around the selected answer
- **Traveling Spark:** A white spark travels along the border
- **Color Coding:** Green for correct answers, red for incorrect answers
- **Non-Intrusive:** The animation is subtle and doesn't distract from the content
- **Responsive:** Adapts to the size and position of the target element
- **Timed Display:** Automatically hides after a short delay

## Animation Details

### Border Animation
- Glowing border that pulses subtly
- Color changes based on answer correctness (green/red)
- Smooth transitions for a polished look

### Spark Animation
- White spark travels along the border
- Continuous, looping animation
- Smooth movement for a natural flow
- Subtle glow effect for added visual interest

## Benefits

1. **Enhanced User Experience:** Provides immediate visual feedback
2. **Subtle Design:** Non-intrusive animation that doesn't overwhelm the UI
3. **Visual Reinforcement:** Clearly indicates correct/incorrect answers
4. **Modern Aesthetic:** Adds a sophisticated, contemporary feel
5. **Focused Attention:** Draws the user's eye to the selected answer
6. **Emotional Response:** Creates a satisfying interaction moment

## References & Resources

- [Framer Motion Documentation](https://www.framer.com/motion/)
- [CSS Animation Techniques](https://css-tricks.com/almanac/properties/a/animation/)
- [UI Animation Principles](https://www.invisionapp.com/inside-design/motion-design-animation-principles-for-ux/) 