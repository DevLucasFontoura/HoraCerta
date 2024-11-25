import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TimeRecord {
  id: string;
  date: string;
  entryTime: string;
  lunchStart?: string;
  lunchEnd?: string;
  exitTime?: string;
  userId: string;
}

interface TimeRecordState {
  records: TimeRecord[];
  isLoading: boolean;
  error: string | null;
}

const initialState: TimeRecordState = {
  records: [],
  isLoading: false,
  error: null,
};

const timeRecordSlice = createSlice({
  name: 'timeRecord',
  initialState,
  reducers: {
    setRecords: (state, action: PayloadAction<TimeRecord[]>) => {
      state.records = action.payload;
    },
    addRecord: (state, action: PayloadAction<TimeRecord>) => {
      state.records.push(action.payload);
    },
    updateRecord: (state, action: PayloadAction<TimeRecord>) => {
      const index = state.records.findIndex(record => record.id === action.payload.id);
      if (index !== -1) {
        state.records[index] = action.payload;
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setRecords, addRecord, updateRecord, setLoading, setError } = timeRecordSlice.actions;
export default timeRecordSlice.reducer;
