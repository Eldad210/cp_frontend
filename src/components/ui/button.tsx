
import { forwardRef } from 'react';
import MUIButton, { ButtonProps as MUIButtonProps } from '@mui/material/Button';
import { cn } from '@/utils/cn';

interface ButtonProps extends Omit<MUIButtonProps, 'variant' | 'size'> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  startIcon?: React.ReactNode;
  className?: string;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    // Map our custom variants to MUI variants
    const getMUIVariant = (): MUIButtonProps['variant'] => {
      switch (variant) {
        case 'primary':
          return 'contained';
        case 'secondary':
          return 'text';
        case 'outline':
          return 'outlined';
        default:
          return 'contained';
      }
    };

    // Map our custom sizes to MUI sizes
    const getMUISize = (): MUIButtonProps['size'] => {
      switch (size) {
        case 'sm':
          return 'small';
        case 'md':
          return 'medium';
        case 'lg':
          return 'large';
        default:
          return 'medium';
      }
    };

    return (
      <MUIButton
        ref={ref}
        variant={getMUIVariant()}
        size={getMUISize()}
        className={cn(className)}
        {...props}
      >
        {children}
      </MUIButton>
    );
  }
);
