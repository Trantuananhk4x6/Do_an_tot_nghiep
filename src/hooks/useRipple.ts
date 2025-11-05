import { useCallback } from 'react';

interface RippleOptions {
  color?: string;
  duration?: number;
  size?: number;
}

export const useRipple = (options: RippleOptions = {}) => {
  const { 
    color = 'rgba(255, 255, 255, 0.6)', 
    duration = 600,
    size = 100 
  } = options;

  const createRipple = useCallback((event: React.MouseEvent<HTMLElement>) => {
    const element = event.currentTarget;
    const rect = element.getBoundingClientRect();
    const ripple = document.createElement('span');
    
    // Calculate ripple position
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // Calculate ripple size
    const rippleSize = Math.max(element.clientWidth, element.clientHeight) * 1.5;
    
    // Apply ripple styles
    ripple.style.position = 'absolute';
    ripple.style.borderRadius = '50%';
    ripple.style.pointerEvents = 'none';
    ripple.style.left = `${x - rippleSize / 2}px`;
    ripple.style.top = `${y - rippleSize / 2}px`;
    ripple.style.width = `${rippleSize}px`;
    ripple.style.height = `${rippleSize}px`;
    ripple.style.backgroundColor = color;
    ripple.style.transform = 'scale(0)';
    ripple.style.opacity = '1';
    ripple.style.animation = `ripple-animation ${duration}ms ease-out`;
    ripple.className = 'ripple-effect';
    
    // Ensure parent has relative positioning
    if (getComputedStyle(element).position === 'static') {
      element.style.position = 'relative';
    }
    
    // Ensure parent has overflow hidden for clean effect
    element.style.overflow = 'hidden';
    
    // Add ripple to element
    element.appendChild(ripple);
    
    // Remove ripple after animation
    setTimeout(() => {
      if (ripple.parentNode) {
        ripple.parentNode.removeChild(ripple);
      }
    }, duration);
  }, [color, duration]);

  const addRippleEffect = useCallback((props: any = {}) => ({
    ...props,
    onClick: (e: React.MouseEvent<HTMLElement>) => {
      createRipple(e);
      if (props.onClick) {
        props.onClick(e);
      }
    },
    onMouseDown: (e: React.MouseEvent<HTMLElement>) => {
      createRipple(e);
      if (props.onMouseDown) {
        props.onMouseDown(e);
      }
    },
    style: {
      ...props.style,
      position: 'relative',
      overflow: 'hidden',
    }
  }), [createRipple]);

  return { createRipple, addRippleEffect };
};