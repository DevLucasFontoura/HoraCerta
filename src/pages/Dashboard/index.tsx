import { useState, useEffect } from 'react';
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
import { useWorkSchedule } from '../../hooks/useWorkSchedule';

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

interface GraphData {
  weekData: Array<{
    date: string;
    hours: number;
    balance: string;
  }>;
  timeDistribution: Array<{
    name: string;
    value: number;
  }>;
  monthlyData: Array<{
    month: string;
    total: number;
    average: number;
  }>;
}

const Dashboard = () => {
  const { calculateDashboardStats, calculateGraphData } = useTimeRecords();
  const { schedule } = useWorkSchedule();
  const [stats, setStats] = useState({
    todayTotal: '0h',
    weekTotal: '0h',
    hoursBalance: '0h'
  });
  const [graphData, setGraphData] = useState<GraphData>({
    weekData: [],
    timeDistribution: [],
    monthlyData: []
  });

  useEffect(() => {
    const fetchData = async () => {
      const statsResult = await calculateDashboardStats();
      const graphResult = calculateGraphData(schedule.expectedDailyHours);
      setStats(statsResult);
      setGraphData(graphResult);
    };
    fetchData();
  }, [calculateDashboardStats, calculateGraphData, schedule.expectedDailyHours]);

  const dashboardStats = [
    {
      title: APP_CONFIG.MESSAGES.DASHBOARD.TODAY,
      value: stats.todayTotal,
      icon: <AiOutlineClockCircle size={24} />,
      color: APP_CONFIG.COLORS.PRIMARY
    },
    {
      title: APP_CONFIG.MESSAGES.DASHBOARD.WEEK,
      value: stats.weekTotal,
      icon: <AiOutlineBarChart size={24} />,
      color: APP_CONFIG.COLORS.INFO
    },
    {
      title: APP_CONFIG.MESSAGES.DASHBOARD.BALANCE,
      value: stats.hoursBalance,
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
          {dashboardStats.map((stat, index) => (
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
          <ChartCard>
            <ChartTitle>Horas Trabalhadas na Semana</ChartTitle>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={graphData.weekData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="hours" stroke={colorMap.primary} fill={colorMap.primary} />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard>
            <ChartTitle>Distribuição de Tempo</ChartTitle>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={graphData.timeDistribution}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                >
                  {graphData.timeDistribution.map((entry, index) => (
                    <Cell key={entry.name} fill={Object.values(colorMap)[index]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard>
            <ChartTitle>Comparativo Mensal</ChartTitle>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={graphData.monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="total" fill={colorMap.primary} name="Total" />
                <Bar dataKey="average" fill={colorMap.info} name="Média" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
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

const ChartCard = styled.div`
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