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

interface TimeRecord {
  id: number;
  date: string;
  entry: string;
  lunchOut: string;
  lunchReturn: string;
  exit: string;
  total: string;
}

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
  const [editingId, setEditingId] = useState<number | null>(null);
  const [records, setRecords] = useState<TimeRecord[]>([
    {
      id: 1,
      date: '15/03/2024',
      entry: '08:00:23',
      lunchOut: '12:00:45',
      lunchReturn: '13:01:12',
      exit: '17:00:34',
      total: '8h'
    }
  ]);
  const [editForm, setEditForm] = useState<TimeRecord | null>(null);

  const handleEdit = (record: TimeRecord) => {
    setEditingId(record.id);
    setEditForm(record);
  };

  const handleSave = () => {
    if (editForm) {
      setRecords(records.map(record => 
        record.id === editForm.id ? editForm : record
      ));
      setEditingId(null);
      setEditForm(null);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm(null);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este registro?')) {
      setRecords(records.filter(record => record.id !== id));
    }
  };

  const handleInputChange = (field: keyof TimeRecord, value: string) => {
    if (editForm) {
      setEditForm({ ...editForm, [field]: value });
    }
  };

  return (
    <PageTransition>
      <Container>
        <Header>
          <Title>Relatórios</Title>
          <Subtitle>Visualize e exporte seus registros de ponto</Subtitle>
        </Header>

        <Grid variants={statsVariants} initial="hidden" animate="visible">
          <StatCard
            variants={statItemVariants}
          >
            <StatIcon><AiOutlineClockCircle size={24} /></StatIcon>
            <StatInfo>
              <StatValue>176h 30min</StatValue>
              <StatLabel>Total de Horas no Mês</StatLabel>
            </StatInfo>
          </StatCard>

          <StatCard
            variants={statItemVariants}
          >
            <StatIcon><AiOutlineBarChart size={24} /></StatIcon>
            <StatInfo>
              <StatValue>8h 12min</StatValue>
              <StatLabel>Média Diária</StatLabel>
            </StatInfo>
          </StatCard>

          <StatCard
            variants={statItemVariants}
          >
            <StatIcon><AiOutlineCalendar size={24} /></StatIcon>
            <StatInfo>
              <StatValue>22 dias</StatValue>
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

export default Analytics;