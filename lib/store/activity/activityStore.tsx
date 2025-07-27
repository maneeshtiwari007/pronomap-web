// store/slices/counterSlice.ts
import { createSlice } from '@reduxjs/toolkit';

type activityStoreState = {
  data?:any
};

const initialState: activityStoreState = {
  data: undefined,
};

export const activityStore = createSlice({
  name: 'activityStore',
  initialState,
  reducers: {
    activityUpdate: (state:any,params:any) => {
      state.data = params?.payload;
    },
  },
});

// Export actions
export const { activityUpdate } = activityStore.actions;