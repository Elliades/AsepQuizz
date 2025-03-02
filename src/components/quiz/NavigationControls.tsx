import React from 'react';
import SwipeableNavigation from '../navigation/SwipeableNavigation';

interface NavigationControlsProps {
  onNext: () => void;
  onPrevious: () => void;
  showNext: boolean;
  isNextEnabled: boolean;
  isFirstQuestion: boolean;
  isLastQuestion: boolean;
  containerRef: React.RefObject<HTMLElement>;
}

/**
 * Handles navigation between quiz questions.
 */
const NavigationControls: React.FC<NavigationControlsProps> = (props) => {
  return (
    <SwipeableNavigation {...props} />
  );
};

export default NavigationControls; 