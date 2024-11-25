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
  const [time, setTime] = useState<TimeState>({
    hours: '00',
    minutes: '00',
    seconds: '00'
  });
  const [showOptions, setShowOptions] = useState(false);
  const [records, setRecords] = useState<TimeRecord[]>([]);
  const [allRecordsComplete, setAllRecordsComplete] = useState(false);

  const recordTypes = [
    { 
      id: 'entry',
      label: 'Entrada Principal',
      icon: <AiOutlineLogin size={20} />,
      color: '#10B981'
    },
    { 
      id: 'lunch_out',
      label: 'Saída Almoço',
      icon: <AiOutlineCoffee size={20} />,
      color: '#F59E0B'
    },
    { 
      id: 'lunch_return',
      label: 'Retorno Almoço',
      icon: <AiOutlineCoffee size={20} />,
      color: '#F59E0B'
    },
    { 
      id: 'exit',
      label: 'Saída Principal',
      icon: <AiOutlineLogout size={20} />,
      color: '#EF4444'
    }
  ];

  const getAvailableOptions = () => {
    const registeredTypes = records.map(record => record.type);

    if (registeredTypes.length === 0) {
      return recordTypes.filter(type => type.id === 'entry');
    }

    if (registeredTypes.includes('entry') && !registeredTypes.includes('lunch_out')) {
      return recordTypes.filter(type => type.id === 'lunch_out');
    }

    if (registeredTypes.includes('lunch_out') && !registeredTypes.includes('lunch_return')) {
      return recordTypes.filter(type => type.id === 'lunch_return');
    }

    if (registeredTypes.includes('lunch_return') && !registeredTypes.includes('exit')) {
      return recordTypes.filter(type => type.id === 'exit');
    }

    if (registeredTypes.length === 4) {
      setAllRecordsComplete(true);
      return [];
    }

    return [];
  };

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime({
        hours: String(now.getHours()).padStart(2, '0'),
        minutes: String(now.getMinutes()).padStart(2, '0'),
        seconds: String(now.getSeconds()).padStart(2, '0')
      });
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);

    return () => clearInterval(timer);
  }, []);

  const getCurrentTimeString = () => {
    return `${time.hours}:${time.minutes}:${time.seconds}`;
  };

  const handleRecordTime = (type: string, label: string) => {
    const currentTime = getCurrentTimeString();
    const newRecord = {
      time: currentTime,
      type,
      label
    };
    setRecords([newRecord, ...records]);
    setShowOptions(false);
  };

  return (
    <PageTransition>
      <Container>
        <TimeDisplayCard>
          <TimeValue>{`${time.hours}:${time.minutes}:${time.seconds}`}</TimeValue>
          <TimeDate>
            {new Date().toLocaleDateString('pt-BR', { 
              weekday: 'long', 
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })}
          </TimeDate>
        </TimeDisplayCard>

        <ActionCard>
          {allRecordsComplete ? (
            <CompletedMessage>
              <AiOutlineClockCircle size={24} />
              {APP_CONFIG.MESSAGES.TIME_RECORD.ALL_RECORDS_COMPLETE}
            </CompletedMessage>
          ) : !showOptions ? (
            <RecordButton onClick={() => setShowOptions(true)}>
              <AiOutlineClockCircle size={24} />
              {APP_CONFIG.MESSAGES.TIME_RECORD.RECORD_BUTTON}
            </RecordButton>
          ) : (
            <OptionsContainer>
              <OptionsTitle>{APP_CONFIG.MESSAGES.TIME_RECORD.NEXT_RECORD}</OptionsTitle>
              <OptionsGrid>
                {getAvailableOptions().map((type) => (
                  <OptionButton
                    key={type.id}
                    onClick={() => handleRecordTime(type.id, type.label)}
                    color={type.color}
                  >
                    {type.icon}
                    {type.label}
                  </OptionButton>
                ))}
              </OptionsGrid>
              <CancelButton onClick={() => setShowOptions(false)}>
                Cancelar
              </CancelButton>
            </OptionsContainer>
          )}
        </ActionCard>

        <RecordsSection>
          <SectionHeader>
            <SectionTitle>
              <AiOutlineHistory size={20} />
              {APP_CONFIG.MESSAGES.TIME_RECORD.TODAY_RECORDS}
            </SectionTitle>
          </SectionHeader>
          <TimelineContainer>
            <TimelineWrapper
              variants={timelineVariants}
              initial="hidden"
              animate="visible"
            >
              {records.map((record, index) => (
                <TimelineItemWrapper
                  key={index}
                  variants={timelineItemVariants}
                >
                  <TimelineTime>{record.time}</TimelineTime>
                  <TimelineDot />
                  <TimelineLabel>{record.label}</TimelineLabel>
                </TimelineItemWrapper>
              ))}
            </TimelineWrapper>
          </TimelineContainer>
        </RecordsSection>
      </Container>
    </PageTransition>
  );
};

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const TimeDisplayCard = styled.div`
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
    background: #eaeaea;
  }
`;

const TimelineItemWrapper = styled(motion.div)`
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
  position: relative;
`;

const TimelineTime = styled.div`
  width: 100px;
  font-variant-numeric: tabular-nums;
  color: #111111;
  font-weight: 500;
`;

const TimelineDot = styled.div`
  width: 12px;
  height: 12px;
  background: #111111;
  border-radius: 50%;
  margin: 0 20px;
  z-index: 1;
`;

const TimelineLabel = styled.div`
  color: #666666;
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

export default TimeRecord;