import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AiOutlineClockCircle, 
  AiOutlineHistory,
  AiOutlineCoffee,
  AiOutlineLogin,
  AiOutlineLogout 
} from 'react-icons/ai';
import PageTransition from '../../components/PageTransition/index';
import { APP_CONFIG } from '../../constants/app';
import { useTimeRecords } from '../../hooks/useTimeRecords';

interface TimeState {
  hours: string;
  minutes: string;
  seconds: string;
}

interface TimeRecord {
  time: string;
  type: string;
  label: string;
}

const timeDisplayVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: {
      type: "spring",
      duration: 0.5
    }
  }
};

const optionsVariants = {
  hidden: { opacity: 0, height: 0 },
  visible: { 
    opacity: 1,
    height: "auto",
    transition: {
      duration: 0.3
    }
  },
  exit: {
    opacity: 0,
    height: 0,
    transition: {
      duration: 0.2
    }
  }
};

const timelineVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: {
      delay: 0.3,
      staggerChildren: 0.1
    }
  }
};

const timelineItemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: 0.3
    }
  }
};

const TimeRecord = () => {
  const { records, registerTime } = useTimeRecords();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [currentTime, setCurrentTime] = useState<TimeState>({
    hours: '00',
    minutes: '00',
    seconds: '00'
  });

  const today = new Date().toISOString().split('T')[0];
  const todayRecord = records.find(record => record.date === today);

  const timelineItems = todayRecord ? [
    { time: todayRecord.entry, label: 'Entrada', type: 'entry' },
    { time: todayRecord.lunchOut, label: 'Saída Almoço', type: 'lunchOut' },
    { time: todayRecord.lunchReturn, label: 'Retorno Almoço', type: 'lunchReturn' },
    { time: todayRecord.exit, label: 'Saída', type: 'exit' }
  ].filter(item => item.time) : [];

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime({
        hours: String(now.getHours()).padStart(2, '0'),
        minutes: String(now.getMinutes()).padStart(2, '0'),
        seconds: String(now.getSeconds()).padStart(2, '0')
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleRegister = async (type: 'entry' | 'lunchOut' | 'lunchReturn' | 'exit') => {
    try {
      setLoading(true);
      setError('');
      await registerTime(type);
      setSuccess('Ponto registrado com sucesso!');
    } catch (err) {
      console.error('Erro ao registrar ponto:', err);
      setError('Erro ao registrar ponto. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <Container>
        <Header>
          <Title>Registrar Ponto</Title>
          <Subtitle>Registre seus horários de trabalho</Subtitle>
        </Header>

        <TimeDisplayCard
          initial="hidden"
          animate="visible"
          variants={timeDisplayVariants}
        >
          <TimeValue>
            {currentTime.hours}:{currentTime.minutes}:{currentTime.seconds}
          </TimeValue>
          <TimeDate>
            {new Date().toLocaleDateString('pt-BR', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </TimeDate>
        </TimeDisplayCard>

        {error && <ErrorMessage>{error}</ErrorMessage>}
        {success && <SuccessMessage>{success}</SuccessMessage>}

        <ButtonGrid>
          <TimeButton 
            onClick={() => handleRegister('entry')} 
            disabled={loading || !!todayRecord?.entry}
            $registered={!!todayRecord?.entry}
          >
            <ButtonIcon><AiOutlineLogin /></ButtonIcon>
            <ButtonLabel>Entrada</ButtonLabel>
          </TimeButton>

          <TimeButton 
            onClick={() => handleRegister('lunchOut')} 
            disabled={loading || !todayRecord?.entry || !!todayRecord?.lunchOut}
            $registered={!!todayRecord?.lunchOut}
          >
            <ButtonIcon><AiOutlineCoffee /></ButtonIcon>
            <ButtonLabel>Saída Almoço</ButtonLabel>
          </TimeButton>

          <TimeButton 
            onClick={() => handleRegister('lunchReturn')} 
            disabled={loading || !todayRecord?.lunchOut || !!todayRecord?.lunchReturn}
            $registered={!!todayRecord?.lunchReturn}
          >
            <ButtonIcon><AiOutlineLogin /></ButtonIcon>
            <ButtonLabel>Retorno Almoço</ButtonLabel>
          </TimeButton>

          <TimeButton 
            onClick={() => handleRegister('exit')} 
            disabled={loading || !todayRecord?.lunchReturn || !!todayRecord?.exit}
            $registered={!!todayRecord?.exit}
          >
            <ButtonIcon><AiOutlineLogout /></ButtonIcon>
            <ButtonLabel>Saída</ButtonLabel>
          </TimeButton>
        </ButtonGrid>

        <HistorySection
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <HistoryTitle>Histórico de Hoje</HistoryTitle>
          <TimelineContainer>
            <TimelineWrapper>
              {timelineItems.map((item, index) => (
                <TimelineItem key={item.type}>
                  <TimelineTime>{item.time}</TimelineTime>
                  <TimelineDot />
                  <TimelineLabel>{item.label}</TimelineLabel>
                </TimelineItem>
              ))}
            </TimelineWrapper>
          </TimelineContainer>
        </HistorySection>
      </Container>
    </PageTransition>
  );
};

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const TimeDisplayCard = styled(motion.div)`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  border: 1px solid ${APP_CONFIG.COLORS.BORDER};
  text-align: center;
  margin-bottom: 2rem;
`;

const TimeValue = styled.div`
  font-size: 3.5rem;
  font-weight: 600;
  color: ${APP_CONFIG.COLORS.PRIMARY};
  margin-bottom: 0.5rem;
  font-variant-numeric: tabular-nums;
`;

const TimeDate = styled.div`
  color: ${APP_CONFIG.COLORS.SECONDARY};
  font-size: 1rem;
`;

const ActionCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid ${APP_CONFIG.COLORS.BORDER};
  margin-bottom: 2rem;
`;

const RecordsSection = styled.section`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  border: 1px solid ${APP_CONFIG.COLORS.BORDER};
`;

const SectionHeader = styled.div`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.2rem;
  font-weight: 600;
  color: #111111;
`;

const TimelineContainer = styled.div`
  padding: 0 1rem;
`;

const TimelineWrapper = styled(motion.div)`
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    left: 120px;
    top: 0;
    bottom: 0;
    width: 2px;
    background: ${APP_CONFIG.COLORS.BORDER};
  }
`;

const TimelineItem = styled(motion.div)`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  position: relative;
`;

const TimelineTime = styled.div`
  width: 100px;
  font-variant-numeric: tabular-nums;
  color: ${APP_CONFIG.COLORS.PRIMARY};
  font-weight: 500;
`;

const TimelineDot = styled.div`
  width: 12px;
  height: 12px;
  background: ${APP_CONFIG.COLORS.PRIMARY};
  border-radius: 50%;
  margin: 0 20px;
  z-index: 1;
`;

const TimelineLabel = styled.div`
  color: ${APP_CONFIG.COLORS.SECONDARY};
`;

const CompletedMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 1.5rem;
  background: #F0FDF4;
  border-radius: 8px;
  color: #10B981;
  font-weight: 500;
`;

const RecordButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  background: #111111;
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  width: 100%;
  transition: all 0.2s ease;

  &:hover {
    background: #000000;
  }
`;

const OptionsContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const OptionsTitle = styled.div`
  font-size: 1rem;
  color: #666666;
  margin-bottom: 0.5rem;
`;

const OptionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
`;

const OptionButton = styled.button<{ color: string }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: white;
  border: 1px solid #eaeaea;
  border-radius: 8px;
  color: ${props => props.color};
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => `${props.color}10`};
    border-color: ${props => props.color};
  }
`;

const CancelButton = styled.button`
  padding: 0.75rem;
  background: transparent;
  border: none;
  color: #666666;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    color: #111111;
  }
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 600;
  color: #111111;
`;

const Subtitle = styled.p`
  font-size: 1rem;
  color: #666666;
`;

const ButtonGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
`;

const TimeButton = styled.button<{ $registered?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  border: 1px solid ${props => props.$registered ? APP_CONFIG.COLORS.DANGER : APP_CONFIG.COLORS.BORDER};
  background: ${props => props.$registered ? `${APP_CONFIG.COLORS.DANGER}15` : 'white'};
  border-radius: 8px;
  cursor: ${props => props.$registered ? 'not-allowed' : 'pointer'};
  transition: all 0.2s ease;

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  &:not(:disabled):hover {
    border-color: ${props => props.$registered ? APP_CONFIG.COLORS.DANGER : APP_CONFIG.COLORS.PRIMARY};
    background: ${props => props.$registered ? `${APP_CONFIG.COLORS.DANGER}15` : `${APP_CONFIG.COLORS.PRIMARY}15`};
  }
`;

const ButtonIcon = styled.div`
  font-size: 1.5rem;
  color: ${APP_CONFIG.COLORS.PRIMARY};
`;

const ButtonLabel = styled.div`
  font-size: 0.9rem;
  color: ${APP_CONFIG.COLORS.SECONDARY};
`;

const ErrorMessage = styled.div`
  background: #FFE4E6;
  border: 1px solid #EF4444;
  border-radius: 8px;
  padding: 1rem;
  color: #EF4444;
  font-weight: 500;
  margin-bottom: 1rem;
`;

const SuccessMessage = styled.div`
  background: #F0FDF4;
  border: 1px solid #10B981;
  border-radius: 8px;
  padding: 1rem;
  color: #10B981;
  font-weight: 500;
  margin-bottom: 1rem;
`;

const HistorySection = styled(motion.div)`
  margin-top: 2rem;
  padding: 1.5rem;
  background: white;
  border-radius: 12px;
  border: 1px solid ${APP_CONFIG.COLORS.BORDER};
`;

const HistoryTitle = styled.h2`
  font-size: 1.2rem;
  font-weight: 600;
  color: ${APP_CONFIG.COLORS.PRIMARY};
  margin-bottom: 1rem;
`;

export default TimeRecord;