export interface TimeRecord {
    id: string;
    userId: string;
    date: string;
    entry: string;
    lunchOut: string;
    lunchReturn: string;
    exit: string;
    total: string;
    balance?: string;
    createdAt?: Date;
  }