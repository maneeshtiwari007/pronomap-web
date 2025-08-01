import { configureStore } from '@reduxjs/toolkit'
import { homeStore } from './home/homeStore'
import { activityStore } from './activity/activityStore'
import { locationStore } from './location/locationStore'

export const store = () => {
  return configureStore({
    reducer: {
        homeStore:homeStore.reducer,
        activityStore:activityStore.reducer,
        locationStore:locationStore.reducer
    }
  })
}

// Infer the type of makeStore
 export type AppStore = ReturnType<typeof store>
// // Infer the `RootState` and `AppDispatch` types from the store itself
// export type RootState = ReturnType<AppStore['getState']>
 //export type AppDispatch = AppStore['dispatch']
export type RootState = ReturnType<AppStore['getState']>
 export type AppDispatch = AppStore['dispatch']