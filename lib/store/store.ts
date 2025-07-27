import { configureStore } from '@reduxjs/toolkit'
import { homeStore } from './home/homeStore'
import { activityStore } from './activity/activityStore'

export const makeStore = () => {
  return configureStore({
    reducer: {
        homeStore:homeStore.reducer,
        activityStore:activityStore.reducer
    }
  })
}

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']