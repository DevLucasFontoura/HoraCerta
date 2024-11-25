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
  AiOutlineClose,
  AiOutlineDownload
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
  const [dateFilter, setDateFilter] = useState('');
  const [records, setRecords] = useState<TimeRecord[]>([]);

  const homeCards: DashboardCard[] = [
    {
      id: 'today',
      icon: <AiOutlineClockCircle size={24} />,
      title: 'Hoje',
      value: '0h 0min',
      footer: 'Meta diária: 8h'
    },
    {
      id: 'week',
      icon: <AiOutlineCalendar size={24} />,
      title: 'Esta Semana',
      value: '0h',
      footer: 'Meta semanal: 40h'
    },
    {
      id: 'balance',
      icon: <AiOutlineCheck size={24} />,
      title: 'Banco de Horas',
      value: '0h',
      footer: 'Atualizado hoje às ' + new Date().toLocaleTimeString('pt-BR')
    }
  ];

  const handleExport = () => {
    console.log('Exportando relatório...');
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
          {homeCards.map((card, i) => (
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

        <Section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <SectionHeader>
            <div>
              <SectionTitle>Histórico Detalhado</SectionTitle>
              <FilterContainer>
                <FilterInput
                  type="month"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                />
              </FilterContainer>
            </div>
            <ExportButton onClick={handleExport}>
              <AiOutlineDownload size={20} />
              Exportar Relatório
            </ExportButton>
          </SectionHeader>

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
                  <th>Saldo</th>
                </tr>
              </thead>
              <tbody>
                {records.map((record, index) => (
                  <tr key={index}>
                    <td>{record.date}</td>
                    <td>{record.entry}</td>
                    <td>{record.lunchOut}</td>
                    <td>{record.lunchReturn}</td>
                    <td>{record.exit}</td>
                    <td>{record.total}</td>
                    <td className={record.balance.includes('+') ? 'positive' : 'negative'}>
                      {record.balance}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </TableContainer>
        </Section>
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

const Section = styled(motion.section)`
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid #eaeaea;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.2rem;
  font-weight: 600;
  color: #111111;
  margin-bottom: 1.5rem;
`;

const FilterContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const FilterInput = styled.input`
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

const ExportButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  border: none;
  border-radius: 4px;
  background: #10B981;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #158057;
  }
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

  .positive {
    color: #10B981;
  }

  .negative {
    color: #EF4444;
  }
`;

export default Home;