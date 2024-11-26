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

// Definindo a cor preta pastel
const SOFT_BLACK = '#404040';

const Dashboard = () => {
  const { calculateDashboardStats, calculateGraphData, records } = useTimeRecords();
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

  // Função atualizada para gerar dados do ano todo
  const generateHabitData = () => {
    const today = new Date();
    const startOfYear = new Date(today.getFullYear(), 0, 1);
    const daysInYear = 365 + (isLeapYear(today.getFullYear()) ? 1 : 0);
    
    // Criar array com todos os dias do ano
    const habitData = Array.from({ length: daysInYear }, (_, index) => {
      const date = new Date(startOfYear);
      date.setDate(index + 1);
      const dateStr = date.toISOString().split('T')[0];
      
      return {
        date: dateStr,
        registered: records.some(record => record.date === dateStr)
      };
    });

    return habitData;
  };

  // Função auxiliar para verificar ano bissexto
  const isLeapYear = (year: number) => {
    return year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0);
  };

  return (
    <PageTransition>
      <Container>
        <Header>
          <Title>Dashboard</Title>
          <Subtitle>Visualize seus indicadores e métricas</Subtitle>
        </Header>

        <ChartsContainer>
          <ChartCard>
            <ChartTitle>Registros de Ponto</ChartTitle>
            <HabitKitContainer>
              <HabitGrid>
                {generateHabitData().map((day, index) => (
                  <HabitCell 
                    key={day.date}
                    registered={day.registered}
                    title={`${new Date(day.date).toLocaleDateString('pt-BR')}: ${day.registered ? 'Registrado' : 'Não registrado'}`}
                  />
                ))}
              </HabitGrid>
            </HabitKitContainer>
          </ChartCard>

          <ChartCard>
            <ChartTitle>Comparativo Mensal</ChartTitle>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={graphData.monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="total" fill={SOFT_BLACK} name="Total" />
                <Bar dataKey="average" fill={`${SOFT_BLACK}80`} name="Média" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard>
            <ChartTitle>Horas Trabalhadas na Semana</ChartTitle>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={graphData.weekData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="hours" 
                  stroke={SOFT_BLACK} 
                  fill={`${SOFT_BLACK}40`}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
        </ChartsContainer>
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

const ChartsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-top: 2rem;
`;

const ChartCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid ${APP_CONFIG.COLORS.BORDER};
  width: 100%;
`;

const ChartTitle = styled.h2`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${APP_CONFIG.COLORS.TEXT.PRIMARY};
  margin-bottom: 1.5rem;
`;

const HabitKitContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  border: 1px solid ${APP_CONFIG.COLORS.BORDER};
  padding: 1.5rem;
  margin: 0 auto;
  width: 100%;
`;

const HabitGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(30, 1fr);
  gap: 4px;
  width: 100%;
  aspect-ratio: 3/1;
  padding: 0.5rem;
`;

const HabitCell = styled.div<{ registered: boolean }>`
  width: 100%;
  aspect-ratio: 1;
  border-radius: 3px;
  background-color: ${({ registered }) => 
    registered ? SOFT_BLACK : APP_CONFIG.COLORS.BORDER};
  opacity: ${({ registered }) => registered ? 1 : 0.3};
  transition: all 0.2s ease;

  &:hover {
    transform: scale(1.2);
  }
`;

export default Dashboard;