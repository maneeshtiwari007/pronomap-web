// store/slices/counterSlice.ts
import { createSlice } from '@reduxjs/toolkit';

type homeStoreState = {
  data?:any
};

const initialState: homeStoreState = {
  data: undefined,
};

export const homeStore = createSlice({
  name: 'homeStore',
  initialState,
  reducers: {
    populateData: (state:any,params:any) => {
      state.data = params?.payload;
    },
  },
});

// Export actions
export const { populateData } = homeStore.actions;