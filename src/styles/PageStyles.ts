import styled from 'styled-components';
import { APP_CONFIG } from '../constants/app';

export const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;

  @media (max-width: 768px) {
    padding: 0.5rem;
  }
`;

export const PageHeader = styled.div`
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    margin-bottom: 1.5rem;
  }
`;

export const PageTitle = styled.h1`
  font-size: 1.75rem;
  margin-bottom: 0.5rem;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

export const PageSubtitle = styled.p`
  color: ${APP_CONFIG.COLORS.TEXT.SECONDARY};
  font-size: 1rem;

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

export const Card = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid ${APP_CONFIG.COLORS.BORDER};
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    padding: 1rem;
    border-radius: 6px;
  }
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
`;

export const Form = styled.form`
  max-width: 400px;
  width: 100%;
  margin: 0 auto;

  @media (max-width: 768px) {
    padding: 0 1rem;
  }
`;

export const FormGroup = styled.div`
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    margin-bottom: 1rem;
  }
`;

export const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${APP_CONFIG.COLORS.BORDER};
  border-radius: 4px;
  font-size: 1rem;

  @media (max-width: 768px) {
    padding: 0.5rem;
    font-size: 0.9rem;
  }
`; 