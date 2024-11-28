export interface TimeRecord {
    id: string;
    date: string;
    entry: string;
    lunchOut: string;
    lunchReturn: string;
    exit: string;
    total: string;
    displayDate: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
    entryTime: string;
    exitTime: string;
    lunchOutTime: string;
    lunchReturnTime: string;
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