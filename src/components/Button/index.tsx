import styled from 'styled-components';
import { APP_CONFIG } from '../../constants/app';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
}

export const Button = styled.button<ButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: ${props => props.size === 'small' ? '0.5rem 1rem' : '0.75rem 1.5rem'};
  border: none;
  border-radius: 4px;
  font-size: ${props => props.size === 'small' ? '0.875rem' : '1rem'};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  width: ${props => props.fullWidth ? '100%' : 'auto'};

  /* Variantes de cor */
  background-color: ${props => {
    switch (props.variant) {
      case 'secondary':
        return APP_CONFIG.COLORS.SECONDARY;
      case 'danger':
        return APP_CONFIG.COLORS.DANGER;
      default:
        return APP_CONFIG.COLORS.PRIMARY;
    }
  }};

  color: white;

  &:hover {
    opacity: 0.9;
  }

  &:active {
    transform: translateY(1px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

Button.defaultProps = {
  variant: 'primary',
  size: 'medium',
  fullWidth: false
}; 