import { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  AiOutlineBarChart, 
  AiOutlineClockCircle,
  AiOutlineCalendar,
  AiOutlineFile,
  AiOutlineDownload,
  AiOutlineEdit,
  AiOutlineClose,
  AiOutlineSave,
  AiOutlineDelete
} from 'react-icons/ai';
import PageTransition from '../../components/PageTransition/index';
import { useTimeRecords } from '../../hooks/useTimeRecords';
import LoadingSpinner from '../../components/LoadingSpinner/index';
import { TimeRecord } from '../../types';
import { APP_CONFIG } from '../../constants/app';
import { auth } from '../../config/firebase';
import { useWorkSchedule } from '../../hooks/useWorkSchedule';
import { Button } from '../../components/Button';

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
    setEditingId(record.id);
    const editableFields = {
      date: record.date,
      displayDate: record.displayDate,
      entry: record.entry,
      lunchOut: record.lunchOut,
      lunchReturn: record.lunchReturn,
      exit: record.exit,
      total: record.total
    };
    setEditForm(editableFields);
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

        <StyledSection variants={tableVariants} initial="hidden" animate="visible">
          <SectionTitle>Registros Recentes</SectionTitle>
          <TableContainer>
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
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {records.map(record => (
                  <tr key={record.id}>
                    {editingId === record.id ? (
                      // Modo de edição
                      <>
                        <td><Input type="date" value={editForm?.date} onChange={e => handleInputChange('date', e.target.value)} /></td>
                        <td><Input type="time" value={editForm?.entry} onChange={e => handleInputChange('entry', e.target.value)} /></td>
                        <td><Input type="time" value={editForm?.lunchOut} onChange={e => handleInputChange('lunchOut', e.target.value)} /></td>
                        <td><Input type="time" value={editForm?.lunchReturn} onChange={e => handleInputChange('lunchReturn', e.target.value)} /></td>
                        <td><Input type="time" value={editForm?.exit} onChange={e => handleInputChange('exit', e.target.value)} /></td>
                        <td>{editForm?.total}</td>
                        <td style={{ 
                          color: editForm?.total ? calculateDailyBalance(editForm, schedule.expectedDailyHours).startsWith('+') 
                            ? 'green' 
                            : 'red' 
                          : 'inherit'
                        }}>
                          {editForm?.total ? calculateDailyBalance(editForm, schedule.expectedDailyHours) : '-'}
                        </td>
                        <td>
                          <ActionButtons>
                            <ActionButton color="#10B981" onClick={handleSave}><AiOutlineSave /></ActionButton>
                            <ActionButton color="#EF4444" onClick={handleCancel}><AiOutlineClose /></ActionButton>
                          </ActionButtons>
                        </td>
                      </>
                    ) : (
                      // Modo de visualização
                      <>
                        <td>{record.date}</td>
                        <td>{record.entry}</td>
                        <td>{record.lunchOut}</td>
                        <td>{record.lunchReturn}</td>
                        <td>{record.exit}</td>
                        <td>{record.total}</td>
                        <td style={{ 
                          color: record.total ? calculateDailyBalance(record, schedule.expectedDailyHours).startsWith('+') 
                            ? 'green' 
                            : 'red' 
                          : 'inherit'
                        }}>
                          {record.total ? calculateDailyBalance(record, schedule.expectedDailyHours) : '-'}
                        </td>
                        <td>
                          <ActionButtons>
                            <ActionButton color="#111111" onClick={() => handleEdit(record)}><AiOutlineEdit /></ActionButton>
                            <ActionButton color="#EF4444" onClick={() => handleDelete(record.id)}><AiOutlineDelete /></ActionButton>
                          </ActionButtons>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </Table>
          </TableContainer>
        </StyledSection>
      </Container>
    </PageTransition>
  );
};

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Header = styled.div`
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

const Grid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  }
`;

const StatCard = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 1rem;
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid #eaeaea;
`;

const StatIcon = styled.div`
  color: #111111;
`;

const StatInfo = styled.div``;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: 600;
  color: #111111;
  margin-bottom: 0.25rem;
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  color: #666666;
`;

const StyledSection = styled(motion.section)`
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid #eaeaea;
  margin-top: 2rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.2rem;
  font-weight: 600;
  color: #111111;
  margin-bottom: 1.5rem;
`;

const TableContainer = styled.div`
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;

  th, td {
    padding: 0.75rem;
    text-align: left;
    border-bottom: 1px solid #eaeaea;
  }

  th {
    font-weight: 500;
    color: #666666;
    font-size: 0.9rem;
  }

  td {
    color: #111111;
  }

  tbody tr:hover {
    background-color: #f9f9f9;
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
`;

export default Analytics;