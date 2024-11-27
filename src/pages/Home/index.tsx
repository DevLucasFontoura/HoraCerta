import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  AiOutlineClockCircle, 
  AiOutlineCalendar, 
  AiOutlineCheck,
  AiOutlineEdit,
  AiOutlineDelete,
  AiOutlineSave,
  AiOutlineClose,
  AiOutlineDownload
} from 'react-icons/ai';
import PageTransition from '../../components/PageTransition/index';
import { useTimeRecords } from '../../hooks/useTimeRecords';
import { useWorkSchedule } from '../../hooks/useWorkSchedule';
import { useAuth } from '../../contexts/AuthContext';

interface TimeRecord {
  id: number;
  date: string;
  entry: string;
  lunchOut: string;
  lunchReturn: string;
  exit: string;
  total: string;
  balance: string;
}

interface DashboardCard {
  id: string;
  icon: JSX.Element;
  title: string;
  value: string;
  footer: string;
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.3
    }
  })
};

const tableVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: {
      duration: 0.4,
      delay: 0.3
    }
  }
};

const Home = () => {
  const { currentUser } = useAuth();
  const { records, calculateDashboardStats } = useTimeRecords();
  const { schedule } = useWorkSchedule();
  const [stats, setStats] = useState({
    todayTotal: '0h',
    weekTotal: '0h',
    hoursBalance: '0h',
    lastUpdate: ''
  });

  const firstName = currentUser?.displayName?.split(' ')[0] || 'usuário';

  useEffect(() => {
    const fetchStats = async () => {
      const result = await calculateDashboardStats();
      const currentTime = new Date().toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit'
      });
      setStats({
        ...result,
        lastUpdate: currentTime
      });
    };
    fetchStats();
  }, [calculateDashboardStats]);

  const [selectedMonth, setSelectedMonth] = useState(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
  });

  const filteredRecords = records.filter(record => {
    const recordDate = new Date(record.date);
    const recordYear = recordDate.getFullYear().toString();
    const recordMonth = String(recordDate.getMonth() + 1).padStart(2, '0');
    
    const [yearFilter, monthFilter] = selectedMonth.split('-');
    
    return recordYear === yearFilter && recordMonth === monthFilter;
  });

  const sortedRecords = [...filteredRecords].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateB.getTime() - dateA.getTime();
  });

  const formatWorkload = (time: string) => {
    const [hours, minutes] = time.split(':');
    return `${hours}h${minutes !== '00' ? ` ${minutes}min` : ''}`;
  };

  const homeCards: DashboardCard[] = [
    {
      id: 'today',
      icon: <AiOutlineClockCircle size={24} />,
      title: 'Hoje',
      value: stats.todayTotal,
      footer: `Meta diária: ${formatWorkload(schedule.expectedDailyHours)}`
    },
    {
      id: 'week',
      icon: <AiOutlineCalendar size={24} />,
      title: 'Esta Semana',
      value: stats.weekTotal,
      footer: 'Meta semanal: 40h'
    },
    {
      id: 'balance',
      icon: <AiOutlineCheck size={24} />,
      title: 'Banco de Horas',
      value: stats.hoursBalance,
      footer: `Atualizado às ${stats.lastUpdate}`
    }
  ];

  const handleExport = () => {
    console.log('Exportando relatório...');
  };

  const calculateDailyBalance = (record: { total: string | undefined }, expectedDailyHours: string) => {
    if (!record.total) return '0h 0min';
    
    const [workedHours, workedMinutes] = record.total.split('h ');
    const totalWorkedMinutes = (parseInt(workedHours) * 60) + (parseInt(workedMinutes) || 0);
    
    const [expectedHours, expectedMinutes] = expectedDailyHours.split(':');
    const expectedTotalMinutes = (parseInt(expectedHours) * 60) + parseInt(expectedMinutes);
    
    const diffMinutes = totalWorkedMinutes - expectedTotalMinutes;
    const hours = Math.floor(Math.abs(diffMinutes) / 60);
    const minutes = Math.abs(diffMinutes) % 60;
    
    return diffMinutes >= 0 
      ? `+${hours}h ${minutes}min`
      : `-${hours}h ${minutes}min`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day} / ${month} / ${year}`;
  };

  return (
    <PageTransition>
      <Container>
        <Header>
          <Title>Bem-vindo de volta, {firstName}</Title>
          <Subtitle>{new Date().toLocaleDateString('pt-BR', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</Subtitle>
        </Header>

        <StatsGrid>
          {homeCards.map((card, i) => (
            <StatsCard
              key={card.id}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
            >
              <CardHeader>
                <CardIcon>{card.icon}</CardIcon>
                <CardTitle>{card.title}</CardTitle>
              </CardHeader>
              <CardValue>{card.value}</CardValue>
              <CardFooter>{card.footer}</CardFooter>
            </StatsCard>
          ))}
        </StatsGrid>

        <Section>
          <SectionHeader>
            <DesktopHeader>
              <SectionTitle>Histórico Detalhado</SectionTitle>
              <MonthSelector>
                <label>Mês:</label>
                <input
                  type="month"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                />
              </MonthSelector>
            </DesktopHeader>
            <ExportButton onClick={handleExport} className="desktop-button">
              <AiOutlineDownload size={20} />
              <span>Exportar Relatório</span>
            </ExportButton>

            <MobileHeader>
              <TitleContainer>
                <SectionTitle>Histórico Detalhado</SectionTitle>
                <ExportButton onClick={handleExport} className="mobile-button">
                  <AiOutlineDownload size={20} />
                  <span>Exportar Relatório</span>
                </ExportButton>
              </TitleContainer>
              <MonthSelector>
                <label>Mês:</label>
                <input
                  type="month"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                />
              </MonthSelector>
            </MobileHeader>
          </SectionHeader>

          <DesktopView>
            <Table>
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Entrada</th>
                  <th>Saída Almoço</th>
                  <th>Retorno</th>
                  <th>Saída</th>
                  <th>Total</th>
                  <th>Saldo</th>
                </tr>
              </thead>
              <tbody>
                {sortedRecords.map((record) => (
                  <tr key={record.id}>
                    <td>{formatDate(record.date)}</td>
                    <td>{record.entry || '-'}</td>
                    <td>{record.lunchOut || '-'}</td>
                    <td>{record.lunchReturn || '-'}</td>
                    <td>{record.exit || '-'}</td>
                    <td>{record.total || '-'}</td>
                    <td style={{ 
                      color: record.total ? calculateDailyBalance(record, schedule.expectedDailyHours).startsWith('+') 
                        ? 'green' 
                        : 'red' 
                        : 'inherit'
                    }}>
                      {record.total ? calculateDailyBalance(record, schedule.expectedDailyHours) : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </DesktopView>

          <MobileView>
            <RecordsList>
              {sortedRecords.map((record) => (
                <RecordCard key={record.id}>
                  <RecordHeader>
                    <RecordDate>{formatDate(record.date)}</RecordDate>
                    <RecordBalance style={{ 
                      color: record.total ? calculateDailyBalance(record, schedule.expectedDailyHours).startsWith('+') 
                        ? 'green' 
                        : 'red' 
                        : 'inherit'
                    }}>
                      {record.total ? calculateDailyBalance(record, schedule.expectedDailyHours) : '-'}
                    </RecordBalance>
                  </RecordHeader>
                  
                  <RecordTimes>
                    <TimeItem>
                      <TimeLabel>Entrada</TimeLabel>
                      <TimeValue>{record.entry || '-'}</TimeValue>
                    </TimeItem>
                    <TimeSeparator>→</TimeSeparator>
                    <TimeItem>
                      <TimeLabel>Almoço</TimeLabel>
                      <TimeValue>{record.lunchOut || '-'}</TimeValue>
                    </TimeItem>
                    <TimeSeparator>→</TimeSeparator>
                    <TimeItem>
                      <TimeLabel>Retorno</TimeLabel>
                      <TimeValue>{record.lunchReturn || '-'}</TimeValue>
                    </TimeItem>
                    <TimeSeparator>→</TimeSeparator>
                    <TimeItem>
                      <TimeLabel>Saída</TimeLabel>
                      <TimeValue>{record.exit || '-'}</TimeValue>
                    </TimeItem>
                  </RecordTimes>
                  
                  <RecordFooter>
                    <TotalLabel>Total do dia:</TotalLabel>
                    <TotalValue>{record.total || '-'}</TotalValue>
                  </RecordFooter>
                </RecordCard>
              ))}
            </RecordsList>
          </MobileView>
        </Section>
      </Container>
    </PageTransition>
  );
};

const Container = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 0.5rem;
    overflow-x: hidden;
    max-width: 100vw;
  }
`;

const Header = styled(motion.header)`
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    margin-bottom: 1.5rem;
  }
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

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
  width: 100%;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
    margin: 0 0 1rem 0;
    width: 100%;
  }
`;

const StatsCard = styled(motion.div)`
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid #eaeaea;
  transition: all 0.2s ease;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 1.25rem;
    margin: 0;
    width: 100%;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
`;

const CardIcon = styled.div`
  color: #111111;
`;

const CardTitle = styled.h3`
  font-size: 0.9rem;
  color: #666666;
  font-weight: 500;
`;

const CardValue = styled.div`
  font-size: 1.8rem;
  font-weight: 600;
  color: #111111;
  margin-bottom: 0.5rem;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const CardFooter = styled.div`
  font-size: 0.9rem;
  color: #666666;

  @media (max-width: 768px) {
    font-size: 0.8rem;
  }
`;

const Section = styled(motion.section)`
  background: white;
  padding: 1.25rem;
  border-radius: 8px;
  border: 1px solid #eaeaea;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 1rem;
    width: calc(100% - 0.25rem);
    margin-left: 0;
    border-radius: 8px;
    margin-top: 1rem;
  }
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }
`;

const TitleContainer = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }
`;

const DesktopHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  @media (max-width: 768px) {
    display: none;
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.2rem;
  font-weight: 600;
  color: #111111;
  margin: 0;
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
    margin-bottom: 0;
  }
`;

const ExportButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  background: #10B981;
  color: white;
  cursor: pointer;
  font-size: 0.9rem;
  white-space: nowrap;

  &.mobile-button {
    display: none;
  }

  @media (max-width: 768px) {
    &.desktop-button {
      display: none;
    }

    &.mobile-button {
      display: flex;
      padding: 0.5rem;
      
      span {
        display: none;
      }
    }
  }

  &:hover {
    background: #059669;
  }
`;

const MonthSelector = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  label {
    color: #666666;
    font-size: 0.875rem;
  }

  input {
    padding: 0.5rem;
    border: 1px solid #eaeaea;
    border-radius: 4px;
    font-size: 0.875rem;

    &:focus {
      outline: none;
      border-color: #10B981;
    }
  }
`;

const RecordsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const RecordCard = styled.div`
  background: white;
  border: 1px solid #eaeaea;
  border-radius: 8px;
  padding: 0.5rem;
`;

const RecordHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const RecordDate = styled.div`
  font-weight: 600;
  color: #111111;
  font-size: 0.9rem;
`;

const RecordBalance = styled.div`
  font-weight: 500;
  font-size: 0.85rem;
`;

const RecordTimes = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0;
  overflow-x: auto;
  margin: 0.25rem 0;
  
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

const TimeItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: fit-content;
`;

const TimeLabel = styled.span`
  font-size: 0.7rem;
  color: #666666;
  margin-bottom: 0.1rem;
`;

const TimeValue = styled.span`
  font-weight: 500;
  color: #111111;
  font-size: 0.8rem;
`;

const TimeSeparator = styled.span`
  color: #666666;
  font-size: 0.7rem;
  margin: 0 0.1rem;
`;

const RecordFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.25rem;
  padding-top: 0.25rem;
  border-top: 1px solid #eaeaea;
  font-size: 0.8rem;
`;

const TotalLabel = styled.span`
  font-size: 0.85rem;
  color: #666666;
`;

const TotalValue = styled.span`
  font-weight: 600;
  color: #111111;
  font-size: 0.85rem;
`;

const DesktopView = styled.div`
  @media (max-width: 768px) {
    display: none;
  }
`;

const MobileView = styled.div`
  display: none;
  @media (max-width: 768px) {
    display: block;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;

  th, td {
    text-align: left;
    padding: 1rem;
    border-bottom: 1px solid #eaeaea;
  }

  th {
    font-weight: 600;
    color: #111111;
    background: #f9fafb;
  }

  td {
    color: #374151;
  }

  tbody tr:hover {
    background: #f9fafb;
  }
`;

const MobileHeader = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 100%;
  }
`;

export default Home;