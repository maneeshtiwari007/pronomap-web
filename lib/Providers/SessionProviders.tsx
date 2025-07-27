"use client"

import * as React from "react"

import { createContext, useContext } from 'react';
const SessionContext = createContext({});

export function useSessionContext(){
   return useContext(SessionContext);
}
export function SessionProviders({ children, ...props }: any) {
  return <SessionContext.Provider value={{user:props?.value}} {...props}>{children}</SessionContext.Provider>
}