import { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  AiOutlineBell, 
  AiOutlineUser,
  AiOutlineLock,
  AiOutlineClockCircle
} from 'react-icons/ai';

const Settings = () => {
  const [notifications, setNotifications] = useState({
    pointReminder: true,
    emailNotifications: false
  });
  const [workHours, setWorkHours] = useState({
    dailyHours: '08:00',
    lunchTime: '01:00'
  });

  return (
    <Container>
      <Header>
        <Title>Configurações</Title>
        <Subtitle>Personalize suas preferências</Subtitle>
      </Header>

      <Section>
        <SectionHeader>
          <SectionIcon><AiOutlineUser /></SectionIcon>
          <SectionTitle>Perfil</SectionTitle>
        </SectionHeader>
        
        <FormGroup>
          <Label>Nome completo</Label>
          <Input type="text" placeholder="Seu nome" />
        </FormGroup>

        <FormGroup>
          <Label>E-mail</Label>
          <Input type="email" placeholder="seu@email.com" />
        </FormGroup>

        <Button>Salvar alterações</Button>
      </Section>

      <Section>
        <SectionHeader>
          <SectionIcon><AiOutlineClockCircle /></SectionIcon>
          <SectionTitle>Jornada de Trabalho</SectionTitle>
        </SectionHeader>

        <FormGroup>
          <Label>Carga horária diária</Label>
          <Input 
            type="time" 
            value={workHours.dailyHours}
            onChange={(e) => setWorkHours({ ...workHours, dailyHours: e.target.value })}
          />
        </FormGroup>

        <FormGroup>
          <Label>Intervalo padrão</Label>
          <Input 
            type="time"
            value={workHours.lunchTime}
            onChange={(e) => setWorkHours({ ...workHours, lunchTime: e.target.value })}
          />
        </FormGroup>
      </Section>

      <Section>
        <SectionHeader>
          <SectionIcon><AiOutlineBell /></SectionIcon>
          <SectionTitle>Notificações</SectionTitle>
        </SectionHeader>

        <SettingItem>
          <SettingInfo>
            <SettingLabel>Lembrete de ponto</SettingLabel>
            <SettingDescription>Receba notificações para registrar seu ponto</SettingDescription>
          </SettingInfo>
          <Toggle 
            checked={notifications.pointReminder}
            onChange={() => setNotifications({
              ...notifications,
              pointReminder: !notifications.pointReminder
            })}
          />
        </SettingItem>

        <SettingItem>
          <SettingInfo>
            <SettingLabel>Notificações por e-mail</SettingLabel>
            <SettingDescription>Receba relatórios semanais por e-mail</SettingDescription>
          </SettingInfo>
          <Toggle 
            checked={notifications.emailNotifications}
            onChange={() => setNotifications({
              ...notifications,
              emailNotifications: !notifications.emailNotifications
            })}
          />
        </SettingItem>
      </Section>

      <Section>
        <SectionHeader>
          <SectionIcon><AiOutlineLock /></SectionIcon>
          <SectionTitle>Segurança</SectionTitle>
        </SectionHeader>

        <Button variant="outline">Alterar senha</Button>

        <DangerZone>
          <DangerTitle>Zona de Perigo</DangerTitle>
          <DangerDescription>
            Depois de excluir sua conta, não há volta. Por favor, tenha certeza.
          </DangerDescription>
          <Button variant="danger">Excluir minha conta</Button>
        </DangerZone>
      </Section>
    </Container>
  );
};

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const Header = styled.header`
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 1.8rem;
  font-weight: 700;
  color: #111111;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  color: #666666;
  font-size: 1rem;
`;

const Section = styled(motion.section)`
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid #eaeaea;
  margin-bottom: 1.5rem;
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
`;

const SectionIcon = styled.div`
  color: #111111;
  font-size: 1.25rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.2rem;
  font-weight: 600;
  color: #111111;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  font-size: 0.9rem;
  font-weight: 500;
  color: #111111;
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #eaeaea;
  border-radius: 6px;
  font-size: 1rem;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #111111;
  }
`;

const Button = styled.button<{ variant?: 'outline' | 'danger' }>`
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  ${props => {
    switch (props.variant) {
      case 'outline':
        return `
          background: white;
          border: 1px solid #eaeaea;
          color: #666666;
          &:hover {
            background: #f5f5f5;
            color: #111111;
          }
        `;
      case 'danger':
        return `
          background: #FEE2E2;
          border: none;
          color: #DC2626;
          &:hover {
            background: #DC2626;
            color: white;
          }
        `;
      default:
        return `
          background: #111111;
          border: none;
          color: white;
          &:hover {
            background: #000000;
          }
        `;
    }
  }}
`;

const SettingItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid #eaeaea;

  &:last-child {
    border-bottom: none;
  }
`;

const SettingInfo = styled.div`
  flex: 1;
`;

const SettingLabel = styled.div`
  font-weight: 500;
  margin-bottom: 0.25rem;
`;

const SettingDescription = styled.div`
  font-size: 0.9rem;
  color: #666666;
`;

const Toggle = styled.input.attrs({ type: 'checkbox' })`
  position: relative;
  width: 3rem;
  height: 1.5rem;
  appearance: none;
  background: #eaeaea;
  border-radius: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:checked {
    background: #111111;
  }

  &::before {
    content: '';
    position: absolute;
    width: 1.25rem;
    height: 1.25rem;
    border-radius: 50%;
    background: white;
    top: 0.125rem;
    left: 0.125rem;
    transition: all 0.3s ease;
  }

  &:checked::before {
    transform: translateX(1.5rem);
  }
`;

const DangerZone = styled.div`
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #eaeaea;
`;

const DangerTitle = styled.h3`
  font-size: 0.9rem;
  font-weight: 600;
  color: #DC2626;
  margin-bottom: 0.5rem;
`;

const DangerDescription = styled.p`
  font-size: 0.9rem;
  color: #666666;
  margin-bottom: 1rem;
`;

export default Settings;