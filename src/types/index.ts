export interface TimeRecord {
    id: string;
    userId: string;
    date: string;
    type: string;
    hours: number;
    entry?: string;
    lunchOut?: string;
    lunchReturn?: string;
    exit?: string;
    total?: string;
    displayDate?: string;
    createdAt: string;
    updatedAt: string;
    description?: string;
  }
  
  export interface WeekData {
    day: string;
    hours: number;
  }
  
  export interface MonthlyData {
    month: string;
    expected: number;
    actual: number;
  }