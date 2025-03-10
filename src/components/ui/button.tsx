
import { forwardRef } from 'react';
import MuiButton, { ButtonProps as MuiButtonProps } from '@mui/material/Button';
import { styled } from '@mui/material/styles';

interface ButtonProps extends Omit<MuiButtonProps, 'variant' | 'size'> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

// Create a styled version of MuiButton
const StyledButton = styled(MuiButton, {
  shouldForwardProp: (prop) => prop !== 'buttonVariant' && prop !== 'buttonSize',
})<{ buttonVariant?: string; buttonSize?: string }>(({ theme, buttonVariant, buttonSize }) => ({
  fontWeight: 500,
  borderRadius: theme.shape.borderRadius,
  textTransform: 'none',
  ...(buttonVariant === 'primary' && {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
    },
  }),
  ...(buttonVariant === 'secondary' && {
    backgroundColor: '#f3f4f6',
    color: '#111827',
    '&:hover': {
      backgroundColor: '#e5e7eb',
    },
  }),
  ...(buttonVariant === 'outline' && {
    backgroundColor: 'transparent',
    border: '1px solid #d1d5db',
    color: '#374151',
    '&:hover': {
      backgroundColor: '#f3f4f6',
    },
  }),
  ...(buttonSize === 'sm' && {
    padding: '6px 12px',
    fontSize: '0.875rem',
  }),
  ...(buttonSize === 'md' && {
    padding: '8px 16px',
    fontSize: '1rem',
  }),
  ...(buttonSize === 'lg' && {
    padding: '12px 24px',
    fontSize: '1.125rem',
  }),
  '&.Mui-disabled': {
    opacity: 0.5,
    pointerEvents: 'none',
  },
}));

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    variant = 'primary', 
    size = 'md', 
    children, 
    className, 
    ...props 
  }, ref) => {
    // Convert our custom props to MUI variant
    const getMuiVariant = (): MuiButtonProps['variant'] => {
      if (variant === 'outline') return 'outlined';
      return 'contained';
    };

    return (
      <StyledButton
        ref={ref}
        buttonVariant={variant}
        buttonSize={size}
        variant={getMuiVariant()}
        className={className}
        disableElevation
        {...props}
      >
        {children}
      </StyledButton>
    );
  }
);

Button.displayName = 'Button';
