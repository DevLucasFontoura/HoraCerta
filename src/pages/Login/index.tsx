import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { AiOutlineClockCircle } from 'react-icons/ai';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../config/firebase';
import { APP_CONFIG } from '../../constants/app';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/home');
    } catch (err: any) {
      console.error('Erro no login:', err);
      if (err.code === 'auth/invalid-credential') {
        setError('Email ou senha incorretos');
      } else {
        setError('Ocorreu um erro ao fazer login. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Gradient />
      <FormContainer
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <LogoContainer>
          <AiOutlineClockCircle size={32} />
          <LogoText>{APP_CONFIG.NAME}</LogoText>
        </LogoContainer>
        
        <Title>{APP_CONFIG.MESSAGES.LOGIN.TITLE}</Title>
        <Subtitle>{APP_CONFIG.MESSAGES.LOGIN.SUBTITLE}</Subtitle>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Email</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>Senha</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </FormGroup>

          <ForgotPassword href="#">{APP_CONFIG.MESSAGES.LOGIN.FORGOT_PASSWORD}</ForgotPassword>

          <SubmitButton type="submit" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar →'}
          </SubmitButton>
        </Form>

        <Footer>
          {APP_CONFIG.MESSAGES.LOGIN.NO_ACCOUNT} <StyledLink to="/register">{APP_CONFIG.MESSAGES.LOGIN.CREATE_ACCOUNT}</StyledLink>
        </Footer>
      </FormContainer>
    </Container>
  );
};

// Estilos compartilhados entre Login e Register
export const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background-color: #ffffff;
`;

export const Gradient = styled.div`
  position: fixed;
  top: -10%;
  right: -5%;
  width: 40%;
  height: 40%;
  background: radial-gradient(circle, rgba(237,242,255,1) 0%, rgba(255,255,255,0) 70%);
  z-index: 0;
`;

export const FormContainer = styled(motion.div)`
  width: 100%;
  max-width: 420px;
  background: white;
  padding: 2.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  position: relative;
  z-index: 1;
`;

export const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 2rem;
  color: #111111;
`;

export const LogoText = styled.span`
  font-size: 1.5rem;
  font-weight: 600;
`;

export const Title = styled.h1`
  font-size: 1.8rem;
  font-weight: 700;
  color: #111111;
  margin-bottom: 0.5rem;
`;

export const Subtitle = styled.p`
  color: #666666;
  margin-bottom: 2rem;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const Label = styled.label`
  font-size: 0.9rem;
  font-weight: 500;
  color: #111111;
`;

export const Input = styled.input`
  padding: 0.75rem;
  border: 1.5px solid #eaeaea;
  border-radius: 6px;
  font-size: 1rem;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #111111;
  }

  &::placeholder {
    color: #999999;
  }
`;

export const SubmitButton = styled.button`
  padding: 0.75rem;
  background-color: #111111;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #000000;
    transform: translateY(-1px);
  }
`;

export const Footer = styled.p`
  text-align: center;
  margin-top: 2rem;
  color: #666666;
  font-size: 0.9rem;
`;

export const StyledLink = styled(Link)`
  color: #111111;
  text-decoration: none;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
`;

export const ForgotPassword = styled.a`
  color: #666666;
  text-decoration: none;
  font-size: 0.9rem;
  text-align: right;
  margin-top: -1rem;

  &:hover {
    color: #111111;
  }
`;

export const ErrorMessage = styled.div`
  color: #ef4444;
  background: #fef2f2;
  border: 1px solid #fee2e2;
  padding: 0.75rem;
  border-radius: 6px;
  margin-bottom: 1.5rem;
  font-size: 0.875rem;
`;

export default Login;