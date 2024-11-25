import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../../config/firebase';
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
  StyledLink,
  ErrorMessage
} from '../Login/index';
import styled from 'styled-components';
import { doc, setDoc, collection } from 'firebase/firestore';
import { db } from '../../config/firebase';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      setLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      await updateProfile(userCredential.user, {
        displayName: name
      });

      await setDoc(doc(db, 'users', userCredential.user.uid), {
        name,
        email,
        createdAt: new Date().toISOString(),
        settings: {
          workHours: {
            daily: 8,
            weekly: 40
          },
          notifications: {
            email: true,
            push: true
          }
        }
      });

      const timeRecordRef = doc(collection(db, 'timeRecords'));
      await setDoc(timeRecordRef, {
        userId: userCredential.user.uid,
        date: new Date().toISOString().split('T')[0],
        entry: '',
        lunchOut: '',
        lunchReturn: '',
        exit: '',
        total: '0h',
        createdAt: new Date().toISOString()
      });

      navigate('/dashboard');
    } catch (err: any) {
      console.error('Erro no registro:', err);
      if (err.code === 'auth/email-already-in-use') {
        setError('Este email já está em uso');
      } else if (err.code === 'auth/invalid-email') {
        setError('Email inválido');
      } else if (err.code === 'auth/weak-password') {
        setError('A senha é muito fraca');
      } else if (err.code === 'permission-denied') {
        setError('Erro de permissão ao criar dados do usuário');
      } else {
        setError(`Erro ao criar conta: ${err.message}`);
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
          <LogoText>HoraCerta</LogoText>
        </LogoContainer>

        <Title>Crie sua conta</Title>
        <Subtitle>Comece a controlar seu tempo de forma inteligente</Subtitle>

        {error && <ErrorMessage>{error}</ErrorMessage>}

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

          <SubmitButton type="submit" disabled={loading}>
            {loading ? 'Criando conta...' : 'Criar conta →'}
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