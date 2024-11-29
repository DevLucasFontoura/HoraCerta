export interface TimeRecord {
    id: string;
    userId: string;
    date: string;
    type: string;
    hours: number;
    balance: number;
    entry?: string;
    lunchOut?: string;
    lunchReturn?: string;
    exit?: string;
    total?: string;
    displayDate: string;
    createdAt: string;
    updatedAt: string;
    description?: string;
  }
  
  export interface WorkSchedule {
    id?: string;
    userId: string;
    workHours: number;
    lunchTime: number;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface WeekData {
    date: string;
    registered: boolean;
  }
  
  export interface MonthlyData {
    month: string;
    total: number;
    average: number;
    days: number;
  }
  
  export type TimeRecordType = 'entry' | 'lunchOut' | 'lunchReturn' | 'exit';
  export type NewTimeRecord = Omit<TimeRecord, 'id'>;
  
  export interface TimeRecordExcel {
    Data: string;
    Entrada: string;
    'Saída Almoço': string;
    'Retorno Almoço': string;
    Saída: string;
    'Total Horas': string;
    'Saldo': string;
    Descrição: string;
  }
  
  export interface DashboardStats {
    todayTotal: string;
    weekTotal: string;
    hoursBalance: string;
    lastUpdate?: string;
  }
  
  export interface WeekDataPoint {
    date: string;
    hours: number;
    balance: string;
  }
  
  export interface MonthlyDataPoint {
    month: string;
    total: number;
    average: number;
    days: number;
  }
  
  export interface TimeDistribution {
    morning: number;
    afternoon: number;
    overtime: number;
  }
  
  export interface GraphData {
    weekData: WeekDataPoint[];
    monthlyData: MonthlyDataPoint[];
    timeDistribution: TimeDistribution;
  }