import { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import { 
  AiOutlineClockCircle,
  AiOutlineBarChart,
  AiOutlineCheckCircle
} from 'react-icons/ai';
import PageTransition from '../../components/PageTransition';
import { APP_CONFIG } from '../../constants/app';
import { WeekData, MonthlyData } from '../../types';
import { useTimeRecords } from '../../hooks/useTimeRecords';

// Dados iniciais vazios
const weekData: WeekData[] = [];
const monthlyComparison: MonthlyData[] = [];
const timeDistribution = [
  { name: 'Tempo Trabalhado', value: 0 },
  { name: 'Horas Extras', value: 0 },
  { name: 'Pausas', value: 0 }
];

const habitData = Array.from({ length: 31 }, (_, i) => ({
  day: i + 1,
  registered: false
}));

const colorMap = {
  primary: APP_CONFIG.COLORS.PRIMARY,
  success: APP_CONFIG.COLORS.SUCCESS,
  info: APP_CONFIG.COLORS.INFO
} as const;

const Dashboard = () => {
  const { records } = useTimeRecords();
  
  const calculateStats = () => {
    const today = new Date().toISOString().split('T')[0];
    const todayRecord = records.find(record => record.date === today);
    
    // Calcula total de hoje
    const todayTotal = todayRecord?.total || '0h 0min';
    
    // Calcula total da semana
    const weekTotal = '0h'; // Implementar cálculo real
    
    // Calcula banco de horas
    const hoursBalance = '0h'; // Implementar cálculo real
    
    return { todayTotal, weekTotal, hoursBalance };
  };

  const { todayTotal, weekTotal, hoursBalance } = calculateStats();

  const stats = [
    {
      title: APP_CONFIG.MESSAGES.DASHBOARD.TODAY,
      value: todayTotal,
      icon: <AiOutlineClockCircle size={24} />,
      color: APP_CONFIG.COLORS.PRIMARY
    },
    {
      title: APP_CONFIG.MESSAGES.DASHBOARD.WEEK,
      value: weekTotal,
      icon: <AiOutlineBarChart size={24} />,
      color: APP_CONFIG.COLORS.INFO
    },
    {
      title: APP_CONFIG.MESSAGES.DASHBOARD.BALANCE,
      value: hoursBalance,
      icon: <AiOutlineCheckCircle size={24} />,
      color: APP_CONFIG.COLORS.SUCCESS
    }
  ];

  return (
    <PageTransition>
      <Container>
        <Header>
          <Title>Dashboard</Title>
          <Subtitle>Visualize seus indicadores e métricas</Subtitle>
        </Header>

        <StatsGrid>
          {stats.map((stat, index) => (
            <StatCard
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <StatIcon color={stat.color}>{stat.icon}</StatIcon>
              <StatInfo>
                <StatValue>{stat.value}</StatValue>
                <StatTitle>{stat.title}</StatTitle>
              </StatInfo>
            </StatCard>
          ))}
        </StatsGrid>

        <ChartsGrid>
          <ChartSection>
            <ChartTitle>Horas Trabalhadas na Semana</ChartTitle>
            <ChartContainer>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={weekData}>
                  <defs>
                    <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={APP_CONFIG.COLORS.PRIMARY} stopOpacity={0.1}/>
                      <stop offset="95%" stopColor={APP_CONFIG.COLORS.PRIMARY} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="hours" 
                    stroke={APP_CONFIG.COLORS.PRIMARY} 
                    fillOpacity={1}
                    fill="url(#colorHours)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </ChartSection>

          <ChartSection>
            <ChartTitle>Distribuição do Tempo</ChartTitle>
            <ChartContainer>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <defs>
                    {Object.entries(colorMap).map(([key, color]) => (
                      <linearGradient key={key} id={`color${key}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={color} stopOpacity={0.8}/>
                        <stop offset="95%" stopColor={color} stopOpacity={0.2}/>
                      </linearGradient>
                    ))}
                  </defs>
                  <Pie
                    data={timeDistribution}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                  >
                    {timeDistribution.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={`url(#color${Object.keys(colorMap)[index]})`}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </ChartSection>

          <ChartSection style={{ gridColumn: '1 / 2' }}>
            <ChartTitle>Comparativo Mensal</ChartTitle>
            <ChartContainer>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyComparison}>
                  <defs>
                    <linearGradient id="colorExpected" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={APP_CONFIG.COLORS.INFO} stopOpacity={0.8}/>
                      <stop offset="95%" stopColor={APP_CONFIG.COLORS.INFO} stopOpacity={0.2}/>
                    </linearGradient>
                    <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={APP_CONFIG.COLORS.PRIMARY} stopOpacity={0.8}/>
                      <stop offset="95%" stopColor={APP_CONFIG.COLORS.PRIMARY} stopOpacity={0.2}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="expected" name="Horas Previstas" fill="url(#colorExpected)" />
                  <Bar dataKey="actual" name="Horas Realizadas" fill="url(#colorActual)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </ChartSection>

          <ChartSection style={{ gridColumn: '2 / 3' }}>
            <ChartTitle>Registros do Mês</ChartTitle>
            <ChartContainer style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <HabitGrid>
                {habitData.map((day, index) => (
                  <HabitCell 
                    key={index}
                    registered={day.registered}
                    title={`Dia ${day.day}: ${day.registered ? 'Registrado' : 'Não registrado'}`}
                  />
                ))}
              </HabitGrid>
            </ChartContainer>
          </ChartSection>
        </ChartsGrid>
      </Container>
    </PageTransition>
  );
};

// Estilos mantendo o padrão do seu projeto
const Container = styled.div`
  padding: 2rem;
`;

const Header = styled.div`
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${APP_CONFIG.COLORS.TEXT.PRIMARY};
`;

const Subtitle = styled.p`
  color: ${APP_CONFIG.COLORS.TEXT.SECONDARY};
  margin-top: 0.5rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled(motion.div)`
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid ${APP_CONFIG.COLORS.BORDER};
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const StatIcon = styled.div<{ color: string }>`
  color: ${props => props.color};
`;

const StatInfo = styled.div``;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${APP_CONFIG.COLORS.TEXT.PRIMARY};
`;

const StatTitle = styled.div`
  color: ${APP_CONFIG.COLORS.TEXT.SECONDARY};
  font-size: 0.9rem;
  margin-top: 0.25rem;
`;

const ChartSection = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid ${APP_CONFIG.COLORS.BORDER};
`;

const ChartTitle = styled.h2`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${APP_CONFIG.COLORS.TEXT.PRIMARY};
  margin-bottom: 1.5rem;
`;

const ChartContainer = styled.div`
  width: 100%;
  height: 300px;
`;

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-top: 2rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const HabitGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  padding: 1rem;
  max-width: 400px;
  margin: 0 auto;
`;

const HabitCell = styled.div<{ registered: boolean }>`
  aspect-ratio: 1;
  width: 35px;
  height: 35px;
  border-radius: 4px;
  background-color: ${({ registered }) => 
    registered ? APP_CONFIG.COLORS.PRIMARY : '#F5F5F5'};
  opacity: ${({ registered }) => registered ? 0.8 : 1};
  transition: all 0.2s ease;

  &:hover {
    transform: scale(1.1);
    opacity: 1;
  }
`;

export default Dashboard;