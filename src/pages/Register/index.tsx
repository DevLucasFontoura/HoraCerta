import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AiOutlineClockCircle } from 'react-icons/ai';
import {
  Container,
  Gradient,
  FormContainer,
  LogoContainer,
  LogoText,
  Title,
  Subtitle,
  Form,
  FormGroup,
  Label,
  Input,
  SubmitButton,
  Footer,
  StyledLink
} from '../Login/index';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Implementar lógica de registro
    navigate('/dashboard');
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
          <LogoText>HoraCerta</LogoText>
        </LogoContainer>

        <Title>Crie sua conta</Title>
        <Subtitle>Comece a controlar seu tempo de forma inteligente</Subtitle>

        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Nome completo</Label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Seu nome"
              required
            />
          </FormGroup>

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
              placeholder="Mínimo 8 caracteres"
              required
            />
          </FormGroup>

          <SubmitButton type="submit">
            Criar conta →
          </SubmitButton>
        </Form>

        <Footer>
          Já tem uma conta? <StyledLink to="/login">Fazer login</StyledLink>
        </Footer>
      </FormContainer>
    </Container>
  );
};

export default Register;