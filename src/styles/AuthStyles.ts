import styled from 'styled-components';
import { APP_CONFIG } from '../constants/app';

export const AuthContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: #fafafa;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

export const AuthCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;

  @media (max-width: 768px) {
    padding: 1.5rem;
    box-shadow: none;
  }
`;

export const AuthTitle = styled.h1`
  font-size: 1.75rem;
  text-align: center;
  margin-bottom: 0.5rem;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

export const AuthSubtitle = styled.p`
  text-align: center;
  color: ${APP_CONFIG.COLORS.TEXT.SECONDARY};
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    font-size: 0.9rem;
    margin-bottom: 1.5rem;
  }
`; 