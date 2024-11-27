import { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  AiOutlineBarChart, 
  AiOutlineClockCircle,
  AiOutlineCalendar,
  AiOutlineEdit,
  AiOutlineDelete
} from 'react-icons/ai';
import PageTransition from '../../components/PageTransition/index';
import { useTimeRecords } from '../../hooks/useTimeRecords';
import LoadingSpinner from '../../components/LoadingSpinner/index';
import { TimeRecord } from '../../types';
import { auth } from '../../config/firebase';
import { useWorkSchedule } from '../../hooks/useWorkSchedule';
import { Button } from '../../components/Button';
import Modal from '../../components/Modal/index';

const statsVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const statItemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: {
      type: "spring",
      duration: 0.5
    }
  }
};

const tableVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const Analytics = () => {
  const { records, loading, updateRecord, deleteRecord, deleteAllRecords, calculateTotalHours, addTestData } = useTimeRecords();
  const { schedule } = useWorkSchedule();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Omit<TimeRecord, 'id' | 'userId' | 'createdAt' | 'updatedAt'> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<TimeRecord | null>(null);

  const calculateStats = () => {
    // Calcula total de horas no mês
    const currentMonth = new Date().getMonth();
    const monthRecords = records.filter(record => {
      const recordMonth = new Date(record.date).getMonth();
      return recordMonth === currentMonth;
    });

    // Total de horas no mês
    const monthMinutes = monthRecords.reduce((total, record) => {
      if (!record.total) return total;
      const [hours, minutes] = record.total.split('h ');
      return total + (parseInt(hours) * 60) + (parseInt(minutes) || 0);
    }, 0);

    const monthTotal = `${Math.floor(monthMinutes/60)}h ${monthMinutes%60}min`;
    
    // Calcula dias trabalhados
    const workedDays = monthRecords.length;
    
    // Calcula média diária
    const averageMinutes = workedDays > 0 ? Math.round(monthMinutes / workedDays) : 0;
    const dailyAverage = `${Math.floor(averageMinutes/60)}h ${averageMinutes%60}min`;
    
    return { 
      monthTotal, 
      dailyAverage, 
      workedDays: workedDays.toString() 
    };
  };

  const { monthTotal, dailyAverage, workedDays } = calculateStats();

  const handleEdit = (record: TimeRecord) => {
    setSelectedRecord(record);
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (editForm && editingId) {
      // Calcula o total antes de salvar
      const updatedForm = {
        ...editForm,
        total: calculateTotalHours({
          ...editForm,
          id: editingId,
          userId: auth.currentUser!.uid,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        } as TimeRecord)
      };
      
      await updateRecord(editingId, updatedForm);
      setEditingId(null);
      setEditForm(null);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm(null);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este registro?')) {
      await deleteRecord(id);
    }
  };

  const handleInputChange = (field: keyof TimeRecord, value: string) => {
    if (editForm) {
      setEditForm({ ...editForm, [field]: value });
    }
  };

  const handleReset = async () => {
    if (window.confirm('Tem certeza que deseja deletar todos os registros? Esta ação não pode ser desfeita.')) {
      try {
        await deleteAllRecords();
      } catch (error) {
        console.error('Erro ao resetar registros:', error);
      }
    }
  };

  const calculateDailyBalance = (record: { total: string | undefined }, expectedDailyHours: string) => {
    if (!record.total) return '0h 0min';
    
    // Converte o total trabalhado para minutos
    const [workedHours, workedMinutes] = record.total.split('h ');
    const totalWorkedMinutes = (parseInt(workedHours) * 60) + (parseInt(workedMinutes) || 0);
    
    // Converte as horas esperadas para minutos
    const [expectedHours, expectedMinutes] = expectedDailyHours.split(':');
    const expectedTotalMinutes = (parseInt(expectedHours) * 60) + parseInt(expectedMinutes);
    
    // Calcula a diferença
    const diffMinutes = totalWorkedMinutes - expectedTotalMinutes;
    const hours = Math.floor(Math.abs(diffMinutes) / 60);
    const minutes = Math.abs(diffMinutes) % 60;
    
    return diffMinutes >= 0 
      ? `+${hours}h ${minutes}min`
      : `-${hours}h ${minutes}min`;
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <PageTransition>
      <Container>
        <Header>
          <Title>Relatórios</Title>
          <Subtitle>Visualize e exporte seus registros de ponto</Subtitle>
        </Header>

        <ButtonContainer>
          <Button onClick={deleteAllRecords} variant="danger">
            Resetar Dados de Teste
          </Button>
          <Button onClick={addTestData} variant="secondary">
            Adicionar Dados de Teste
          </Button>
        </ButtonContainer>

        <Grid variants={statsVariants} initial="hidden" animate="visible">
          <StatCard variants={statItemVariants}>
            <StatIcon><AiOutlineClockCircle size={24} /></StatIcon>
            <StatInfo>
              <StatValue>{monthTotal}</StatValue>
              <StatLabel>Total de Horas no Mês</StatLabel>
            </StatInfo>
          </StatCard>

          <StatCard variants={statItemVariants}>
            <StatIcon><AiOutlineBarChart size={24} /></StatIcon>
            <StatInfo>
              <StatValue>{dailyAverage}</StatValue>
              <StatLabel>Média Diária</StatLabel>
            </StatInfo>
          </StatCard>

          <StatCard variants={statItemVariants}>
            <StatIcon><AiOutlineCalendar size={24} /></StatIcon>
            <StatInfo>
              <StatValue>{workedDays}</StatValue>
              <StatLabel>Dias Trabalhados</StatLabel>
            </StatInfo>
          </StatCard>
        </Grid>

        <StyledSection>
          <SectionTitle>Registros Recentes</SectionTitle>
          
          {/* Visualização Desktop */}
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
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {records.map(record => (
                  <tr key={record.id}>
                    <td>{record.date}</td>
                    <td>{record.entry}</td>
                    <td>{record.lunchOut}</td>
                    <td>{record.lunchReturn}</td>
                    <td>{record.exit}</td>
                    <td>{record.total}</td>
                    <td>
                      <ActionButtons>
                        <ActionButton onClick={() => handleEdit(record)} color="#2563eb">
                          <AiOutlineEdit size={16} />
                        </ActionButton>
                        <ActionButton onClick={() => handleDelete(record.id)} color="#dc2626">
                          <AiOutlineDelete size={16} />
                        </ActionButton>
                      </ActionButtons>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </DesktopView>

          {/* Visualização Mobile */}
          <MobileView>
            <RecordsList>
              {records.map(record => (
                <RecordCard key={record.id}>
                  <RecordHeader>
                    <RecordDate>{record.date}</RecordDate>
                    <ActionButtons>
                      <ActionButton onClick={() => handleEdit(record)} color="#2563eb">
                        <AiOutlineEdit size={16} />
                      </ActionButton>
                      <ActionButton onClick={() => handleDelete(record.id)} color="#dc2626">
                        <AiOutlineDelete size={16} />
                      </ActionButton>
                    </ActionButtons>
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

          {/* Modal de Edição */}
          {isModalOpen && selectedRecord && (
            <Modal onClose={() => setIsModalOpen(false)}>
              <ModalContent>
                <h2>Editar Registro</h2>
                {/* Adicione aqui os campos de edição */}
              </ModalContent>
            </Modal>
          )}
        </StyledSection>
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
  overflow-x: hidden;

  @media (max-width: 768px) {
    padding: 0.5rem;
    padding-right: 0.25rem;
    max-width: 100%;
  }
`;

const Header = styled.div`
  margin-bottom: 1.5rem;
  
  @media (max-width: 768px) {
    margin-bottom: 1rem;
  }
`;

const Title = styled.h1`
  font-size: 1.8rem;
  font-weight: 700;
  color: #111111;
  margin-bottom: 0.5rem;
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const Subtitle = styled.p`
  color: #666666;
  font-size: 1rem;
  
  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

const Grid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 1rem;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 0.75rem;
    width: calc(100% - 1rem);
    margin-right: 1rem;
  }
`;

const StatCard = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 1rem;
  background: white;
  padding: 1.25rem;
  border-radius: 8px;
  border: 1px solid #eaeaea;
  height: 100px;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 1rem;
    height: 90px;
    width: calc(100% - -1rem);
  }
`;

const StatIcon = styled.div`
  color: #111111;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 24px;
`;

const StatInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const StatValue = styled.div`
  font-size: 1.25rem;
  font-weight: 600;
  color: #111111;

  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  color: #666666;

  @media (max-width: 768px) {
    font-size: 0.85rem;
  }
`;

const StyledSection = styled(motion.section)`
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid #eaeaea;
  width: 100%;
  box-sizing: border-box;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    padding: 1rem;
    width: calc(100% - -16rem);
    margin-right: 1rem;
    margin-bottom: 1rem;
    border-radius: 8px;
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.2rem;
  font-weight: 600;
  color: #111111;
  margin-bottom: 1.5rem;
`;

const TableContainer = styled.div`
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  
  @media (max-width: 768px) {
    width: 51%;
    margin: 0;
    padding: 0;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }

  th, td {
    padding: 0.75rem;
    text-align: left;
    border-bottom: 1px solid #eaeaea;
    white-space: nowrap;
    
    @media (max-width: 768px) {
      padding: 0.5rem;
      &:first-child {
        padding-left: 0;
      }
      &:last-child {
        padding-right: 0;
      }
    }
  }
`;

const Input = styled.input`
  padding: 0.5rem;
  border: 1px solid #eaeaea;
  border-radius: 4px;
  font-size: 0.9rem;

  &:focus {
    outline: none;
    border-color: #111111;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.25rem;
`;

const ActionButton = styled.button<{ color: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: transparent;
  border: none;
  border-radius: 4px;
  color: ${props => props.color};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => `${props.color}15`};
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin: 1rem 0;
  width: 100%;
  
  @media (max-width: 768px) {
    flex-direction: column;
    width: calc(100% - 1rem);
    margin-right: 1rem;
    margin: 1rem 0;
    
    button {
      width: 100%;
    }
  }
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

const RecordsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  width: 51%;
`;

const RecordCard = styled.div`
  background: white;
  border: 1px solid #eaeaea;
  border-radius: 8px;
  padding: 1.25rem;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const RecordHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 10px;
`;

const RecordDate = styled.div`
  font-weight: 600;
  color: #111111;
  font-size: 0.9rem;
`;

const RecordTimes = styled.div`
  display: flex;
  align-items: center;
  gap: 0.35rem;
  overflow-x: auto;
  padding-bottom: 10px;
  
  &::-webkit-scrollbar {
    display: none;
  }
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
`;

const RecordFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  padding-top: 10px;
`;

const TotalLabel = styled.span`
  font-size: 0.8rem;
  color: #666666;
`;

const TotalValue = styled.span`
  font-weight: 600;
  color: #111111;
  font-size: 0.8rem;
`;

const ModalContent = styled.div`
  padding: 1.5rem;
  
  h2 {
    margin-bottom: 1rem;
    font-size: 1.2rem;
    font-weight: 600;
  }
`;

export default Analytics;