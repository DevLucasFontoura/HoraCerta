import { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  AiOutlineBarChart, 
  AiOutlineClockCircle,
  AiOutlineCalendar,
  AiOutlineFile,
  AiOutlineDownload
} from 'react-icons/ai';
import PageTransition from '../../components/PageTransition/index';

interface TimeRecord {
  date: string;
  entry: string;
  lunchOut: string;
  lunchReturn: string;
  exit: string;
  total: string;
  balance: string;
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

const Analytics = () => {
  const [dateFilter, setDateFilter] = useState('');
  const [records] = useState<TimeRecord[]>([
    {
      date: '15/03/2024',
      entry: '08:00:23',
      lunchOut: '12:00:45',
      lunchReturn: '13:01:12',
      exit: '17:00:34',
      total: '08:00:00',
      balance: '+00:00:34'
    },
    // Adicione mais registros conforme necessário
  ]);

  const handleExport = () => {
    // Implementar lógica de exportação
    console.log('Exportando relatório...');
  };

  return (
    <PageTransition>
      <Container>
        <Header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Title>Relatórios</Title>
          <Subtitle>Visualize e exporte seus registros de ponto</Subtitle>
        </Header>

        <Grid
          variants={statsVariants}
          initial="hidden"
          animate="visible"
        >
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

const Container = styled(motion.div)`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
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
  margin-bottom: 1rem;
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 1rem;
`;

const FilterInput = styled.input`
  padding: 0.5rem;
  border: 1px solid #eaeaea;
  border-radius: 6px;
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
  padding: 0.75rem 1rem;
  background: white;
  border: 1px solid #eaeaea;
  border-radius: 6px;
  color: #666666;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #f5f5f5;
    color: #111111;
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
  white-space: nowrap;

  th, td {
    padding: 0.75rem;
    text-align: left;
    border-bottom: 1px solid #eaeaea;
    font-variant-numeric: tabular-nums;
  }

  th {
    font-weight: 500;
    color: #666666;
    font-size: 0.9rem;
    background: #f9f9f9;
  }

  td {
    color: #111111;
  }

  .positive {
    color: #10B981;
    font-weight: 500;
  }

  .negative {
    color: #EF4444;
    font-weight: 500;
  }

  tbody tr:hover {
    background-color: #f9f9f9;
  }
`;

export default Analytics;