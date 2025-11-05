import React, { JSX } from 'react';
import { useRipple } from '@/hooks/useRipple';

interface RippleProps {
  children: React.ReactNode;
  color?: 'purple' | 'blue' | 'green' | 'pink' | 'white' | string;
  duration?: number;
  disabled?: boolean;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseDown?: (e: React.MouseEvent<HTMLDivElement>) => void;
  style?: React.CSSProperties;
  as?: keyof JSX.IntrinsicElements;
}

function Ripple({
    children, color = 'white', duration = 600, disabled = false, className = '', onClick, onMouseDown, style, as: Component = 'div', ...props
}) {
    // Color mapping for predefined colors
    const colorMap = {
        purple: 'rgba(139, 92, 246, 0.4)',
        blue: 'rgba(59, 130, 246, 0.4)',
        green: 'rgba(34, 197, 94, 0.4)',
        pink: 'rgba(236, 72, 153, 0.4)',
        white: 'rgba(255, 255, 255, 0.3)',
    };

    const rippleColor = colorMap[color as keyof typeof colorMap] || color;

    const { addRippleEffect } = useRipple({
        color: rippleColor,
        duration,
    });

    const rippleProps = disabled ? {} : addRippleEffect({
        onClick,
        onMouseDown,
    });

    const combinedClassName = `ripple-container ${className} ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`.trim();

    return React.createElement(
        Component,
        {
            ...props,
            ...rippleProps,
            className: combinedClassName,
            style: {
                position: 'relative',
                overflow: 'hidden',
                ...style,
            },
        },
        children
    );
}

export default Ripple;