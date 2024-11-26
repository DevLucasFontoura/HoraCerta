export interface TimeRecord {
    id: string;
    userId: string;
    date: string;
    displayDate: string;
    entry: string;
    lunchOut: string;
    lunchReturn: string;
    exit: string;
    total: string;
    createdAt: string;
    updatedAt: string;
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