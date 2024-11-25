export interface WorkSchedule {
    startTime: string;
    endTime: string;
    lunchStartTime: string;
    lunchEndTime: string;
    workDays: number[];
    expectedDailyHours: string;
    breakTime: string;
  }