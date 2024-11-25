import { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  AiOutlineClockCircle, 
  AiOutlineCalendar, 
  AiOutlineCheck,
  AiOutlineEdit,
  AiOutlineDelete,
  AiOutlineSave,
  AiOutlineClose
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

const Dashboard = () => {
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

  const dashboardCards: DashboardCard[] = [
    {
      id: 'today',
      icon: <AiOutlineClockCircle size={24} />,
      title: 'Hoje',
      value: '8h 30min',
      footer: 'Meta diária: 8h'
    },
    {
      id: 'week',
      icon: <AiOutlineCalendar size={24} />,
      title: 'Esta Semana',
      value: '32h',
      footer: 'Meta semanal: 40h'
    },
    {
      id: 'balance',
      icon: <AiOutlineCheck size={24} />,
      title: 'Banco de Horas',
      value: '+4h',
      footer: 'Atualizado hoje às 17:00'
    }
  ];

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
        <Header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Title>Bem-vindo de volta</Title>
          <Subtitle>{new Date().toLocaleDateString('pt-BR', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</Subtitle>
        </Header>

        <Grid>
          {dashboardCards.map((card, i) => (
            <Card
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
            </Card>
          ))}
        </Grid>

        <StyledSection
          variants={tableVariants}
          initial="hidden"
          animate="visible"
        >
          <SectionTitle>Registros Recentes</SectionTitle>
          <TableContainer>
            <Table>
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Entrada</th>
                  <th>Saída Almoço</th>
                  <th>Retorno Almoço</th>
                  <th>Saída</th>
                  <th>Total</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {records.map(record => (
                  <tr key={record.id}>
                    {editingId === record.id ? (
                      <>
                        <td>
                          <Input
                            type="date"
                            value={editForm?.date || ''}
                            onChange={(e) => handleInputChange('date', e.target.value)}
                          />
                        </td>
                        <td>
                          <Input
                            type="time"
                            value={editForm?.entry || ''}
                            onChange={(e) => handleInputChange('entry', e.target.value)}
                          />
                        </td>
                        <td>
                          <Input
                            type="time"
                            value={editForm?.lunchOut || ''}
                            onChange={(e) => handleInputChange('lunchOut', e.target.value)}
                          />
                        </td>
                        <td>
                          <Input
                            type="time"
                            value={editForm?.lunchReturn || ''}
                            onChange={(e) => handleInputChange('lunchReturn', e.target.value)}
                          />
                        </td>
                        <td>
                          <Input
                            type="time"
                            value={editForm?.exit || ''}
                            onChange={(e) => handleInputChange('exit', e.target.value)}
                          />
                        </td>
                        <td>{editForm?.total}</td>
                        <td>
                          <ActionButtons>
                            <ActionButton onClick={handleSave} color="#10B981">
                              <AiOutlineSave />
                            </ActionButton>
                            <ActionButton onClick={handleCancel} color="#666666">
                              <AiOutlineClose />
                            </ActionButton>
                          </ActionButtons>
                        </td>
                      </>
                    ) : (
                      <>
                        <td>{record.date}</td>
                        <td>{record.entry}</td>
                        <td>{record.lunchOut}</td>
                        <td>{record.lunchReturn}</td>
                        <td>{record.exit}</td>
                        <td>{record.total}</td>
                        <td>
                          <ActionButtons>
                            <ActionButton 
                              onClick={() => handleEdit(record)}
                              color="#3B82F6"
                            >
                              <AiOutlineEdit />
                            </ActionButton>
                            <ActionButton 
                              onClick={() => handleDelete(record.id)}
                              color="#EF4444"
                            >
                              <AiOutlineDelete />
                            </ActionButton>
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
`;

const Header = styled(motion.header)`
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

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const Card = styled(motion.div)`
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid #eaeaea;
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
`;

const CardFooter = styled.div`
  font-size: 0.9rem;
  color: #666666;
`;

const StyledSection = styled(motion.section)`
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid #eaeaea;
`;

const SectionTitle = styled.h2`
  font-size: 1.2rem;
  font-weight: 600;
  color: #111111;
  margin-bottom: 1.5rem;
`;

const TableContainer = styled.div`
  overflow-x: auto;
  background: white;
  border-radius: 8px;
  border: 1px solid #eaeaea;
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
    font-variant-numeric: tabular-nums;
  }

  tbody tr:hover {
    background-color: #f9f9f9;
  }
`;

const Input = styled.input`
  width: 100%;
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
  gap: 0.5rem;
`;

const ActionButton = styled.button<{ color: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  border: none;
  border-radius: 4px;
  background: ${props => `${props.color}15`};
  color: ${props => props.color};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => `${props.color}25`};
  }
`;

export default Dashboard;