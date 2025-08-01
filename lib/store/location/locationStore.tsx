// store/slices/counterSlice.ts
import { createSlice } from '@reduxjs/toolkit';

type locationStoreState = {
  data?:any;
  location?:any;
};

const initialState: locationStoreState = {
  data: undefined,
  location:undefined
};

export const locationStore = createSlice({
  name: 'locationStore',
  initialState,
  reducers: {
    locationUpdate: (state:any,params:any) => {
      state.location = params?.payload;
    },
    locationDataUpdate: (state:any,params:any) => {
      state.data = params?.payload;
    },
  },
});

// Export actions
export const { locationUpdate,locationDataUpdate } = locationStore.actions;