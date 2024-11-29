import { useState, useEffect, useMemo } from 'react';
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
import { FaFileExport } from 'react-icons/fa';
import PageTransition from '../../components/PageTransition/index';
import { useTimeRecords } from '../../hooks/useTimeRecords';
import { useWorkSchedule } from '../../hooks/useWorkSchedule';
import { useAuth } from '../../contexts/AuthContext';
import * as XLSX from 'xlsx';
import { TimeRecord, TimeRecordExcel, DashboardStats } from '../../types';

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
  const { records, calculateDashboardStats, loading } = useTimeRecords(currentUser?.uid || '');
  const { schedule } = useWorkSchedule();
  const [stats, setStats] = useState<DashboardStats & { lastUpdate: string }>({
    todayTotal: '0h',
    weekTotal: '0h',
    hoursBalance: '0h',
    lastUpdate: new Date().toLocaleTimeString()
  });
  const [showExportModal, setShowExportModal] = useState(false);

  const firstName = currentUser?.displayName?.split(' ')[0] || 'usuário';

  const memoizedCalculateStats = useMemo(() => {
    return () => {
      const result = calculateDashboardStats();
      const currentTime = new Date().toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit'
      });
      return {
        ...result,
        lastUpdate: currentTime
      };
    };
  }, [calculateDashboardStats]);

  useEffect(() => {
    const result = memoizedCalculateStats();
    setStats(result);
  }, [memoizedCalculateStats, records]);

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

  const sortedRecords = useMemo(() => {
    if (!records || records.length === 0) return [];
    
    return [...records].sort((a, b) => {
      try {
        const dateA = a.date || new Date().toISOString().split('T')[0];
        const dateB = b.date || new Date().toISOString().split('T')[0];
        
        return new Date(dateB).getTime() - new Date(dateA).getTime();
      } catch (error) {
        console.error('Erro ao ordenar:', { a, b, error });
        return 0;
      }
    });
  }, [records]);

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

  const calculateMonthlyBalance = (records: TimeRecord[], expectedDailyHours: string) => {
    let totalBalance = 0;

    records.forEach(record => {
      if (record.total) {
        const [recordHours, recordMinutes] = record.total.split(':').map(Number);
        const [expectedHours, expectedMinutes] = expectedDailyHours.split(':').map(Number);
        
        // Converte tudo para minutos para facilitar o cálculo
        const recordTotalMinutes = (recordHours * 60) + recordMinutes;
        const expectedTotalMinutes = (expectedHours * 60) + expectedMinutes;
        
        // Calcula a diferença
        totalBalance += (recordTotalMinutes - expectedTotalMinutes);
      }
    });

    // Converte o resultado final de volta para horas e minutos
    const hours = Math.floor(Math.abs(totalBalance) / 60);
    const minutes = Math.abs(totalBalance) % 60;

    // Formata o resultado com o sinal adequado
    return `${totalBalance >= 0 ? '+' : '-'}${hours}h ${minutes}min`;
  };

  const generateWorksheet = (records: TimeRecord[], sheetName: string) => {
    const data: TimeRecordExcel[] = records.map(record => ({
      Data: record.displayDate,
      Entrada: record.entry || '',
      'Saída Almoço': record.lunchOut || '',
      'Retorno Almoço': record.lunchReturn || '',
      Saída: record.exit || '',
      'Total Horas': record.hours.toString(),
      'Saldo': record.balance.toString(),
      Descrição: record.description || ''
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    return ws;
  };

  const exportAllMonths = () => {
    const wb = XLSX.utils.book_new();
    
    // Agrupa registros por mês
    const recordsByMonth = records.reduce((acc, record) => {
      const date = new Date(record.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (!acc[monthKey]) {
        acc[monthKey] = [];
      }
      acc[monthKey].push(record);
      return acc;
    }, {} as Record<string, TimeRecord[]>);

    // Cria uma planilha para cada mês
    Object.entries(recordsByMonth).forEach(([monthKey, monthRecords]) => {
      const [year, month] = monthKey.split('-');
      const monthName = new Date(parseInt(year), parseInt(month) - 1).toLocaleString('pt-BR', { month: 'long' });
      const sheetName = `${monthName} ${year}`;
      
      const ws = generateWorksheet(monthRecords, sheetName);
      XLSX.utils.book_append_sheet(wb, ws, sheetName);
    });

    XLSX.writeFile(wb, 'Relatório Completo.xlsx');
    setShowExportModal(false);
  };

  const exportSelectedMonth = () => {
    const wb = XLSX.utils.book_new();
    const [year, month] = selectedMonth.split('-');
    const monthName = new Date(parseInt(year), parseInt(month) - 1).toLocaleString('pt-BR', { month: 'long' });
    const sheetName = `${monthName} ${year}`;

    const ws = generateWorksheet(filteredRecords, sheetName);
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    
    XLSX.writeFile(wb, `Relatório ${monthName} ${year}.xlsx`);
    setShowExportModal(false);
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
          <DesktopView>
            <SectionHeader>
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                <SectionTitle>Histórico Detalhado</SectionTitle>
                <ExportButton onClick={() => setShowExportModal(true)}>
                  <FaFileExport /> Exportar Dados
                </ExportButton>
              </div>
              <MonthSelector>
                <label>Mês:</label>
                <input
                  type="month"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                />
              </MonthSelector>
            </SectionHeader>

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
                      color: record.total ? calculateDailyBalance({ total: record.total }, schedule.expectedDailyHours).startsWith('+') 
                        ? 'green' 
                        : 'red' 
                        : 'inherit'
                    }}>
                      {record.total ? calculateDailyBalance({ total: record.total }, schedule.expectedDailyHours) : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </DesktopView>

          <MobileView>
            <SectionHeader>
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                <SectionTitle>Histórico Detalhado</SectionTitle>
                <ExportIcon onClick={() => setShowExportModal(true)} />
              </div>
              <MonthSelector>
                <label>Mês:</label>
                <input
                  type="month"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                />
              </MonthSelector>
            </SectionHeader>

            <RecordsList>
              {sortedRecords.map((record) => (
                <RecordCard key={record.id}>
                  <RecordHeader>
                    <RecordDate>{formatDate(record.date)}</RecordDate>
                    <RecordBalance style={{ 
                      color: record.total ? calculateDailyBalance({ total: record.total }, schedule.expectedDailyHours).startsWith('+') 
                        ? 'green' 
                        : 'red' 
                        : 'inherit'
                    }}>
                      {record.total ? calculateDailyBalance({ total: record.total }, schedule.expectedDailyHours) : '-'}
                    </RecordBalance>
                  </RecordHeader>
                  <RecordTimes>
                    <TimeItem>
                      <TimeLabel>Entrada</TimeLabel>
                      <TimeValue>{record.entry || '-'}</TimeValue>
                    </TimeItem>
                    <TimeSeparator>|</TimeSeparator>
                    <TimeItem>
                      <TimeLabel>Saída Almoço</TimeLabel>
                      <TimeValue>{record.lunchOut || '-'}</TimeValue>
                    </TimeItem>
                    <TimeSeparator>|</TimeSeparator>
                    <TimeItem>
                      <TimeLabel>Retorno</TimeLabel>
                      <TimeValue>{record.lunchReturn || '-'}</TimeValue>
                    </TimeItem>
                    <TimeSeparator>|</TimeSeparator>
                    <TimeItem>
                      <TimeLabel>Saída</TimeLabel>
                      <TimeValue>{record.exit || '-'}</TimeValue>
                    </TimeItem>
                  </RecordTimes>
                  <RecordFooter>
                    <TotalLabel>Total</TotalLabel>
                    <TotalValue>{record.total || '-'}</TotalValue>
                  </RecordFooter>
                </RecordCard>
              ))}
            </RecordsList>
          </MobileView>

          {showExportModal && (
            <Modal>
              <ModalContent>
                <ModalHeader>
                  <h2>Exportar Relatório</h2>
                  <CloseButton onClick={() => setShowExportModal(false)}>×</CloseButton>
                </ModalHeader>
                
                <ModalBody>
                  <ExportOption onClick={exportAllMonths}>
                    <h3>Exportar Tudo</h3>
                    <p>Exporta todos os registros separados por mês</p>
                  </ExportOption>
                  
                  <ExportOption onClick={exportSelectedMonth}>
                    <h3>Exportar Mês Selecionado</h3>
                    <p>Exporta apenas os registros do mês atual</p>
                  </ExportOption>
                </ModalBody>
              </ModalContent>
            </Modal>
          )}
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
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    align-items: stretch;
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.2rem;
  font-weight: 600;
  color: #111111;
  margin: 0;
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
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

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  padding: 1.5rem;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;

  h2 {
    margin: 0;
    font-size: 1.25rem;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  
  &:hover {
    opacity: 0.7;
  }
`;

const ModalBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ExportOption = styled.button`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 1rem;
  border: 1px solid #eaeaea;
  border-radius: 4px;
  background: white;
  width: 100%;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #f9f9f9;
    border-color: #10B981;
  }

  h3 {
    margin: 0;
    font-size: 1rem;
    color: #333;
  }

  p {
    margin: 0.5rem 0 0;
    font-size: 0.875rem;
    color: #666;
  }
`;

const ExportIcon = styled(FaFileExport)`
  cursor: pointer;
  color: white;
  font-size: 1rem;
  background-color: #10B981;
  padding: 0.3rem;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;

  &:hover {
    background-color: #059669;
  }
`;

const ExportButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  background-color: #10B981;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  margin-left: 1rem;
  gap: 0.5rem;
  
  &:hover {
    background-color: #059669;
  }
`;

export default Home;