import React, { createContext, useReducer, useEffect } from 'react'
import { Context, ContextState, ContextAction } from '@/types'
import { contextService } from '@/services/contextService'
import { informationService } from '@/services/informationService'

// Initial state
const initialState: ContextState = {
  activeContext: null,
  contexts: [],
  information: [],
  isLoading: false,
  error: null,
}

// Action types
const ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_CONTEXTS: 'SET_CONTEXTS',
  SET_INFORMATION: 'SET_INFORMATION',
  SET_ACTIVE_CONTEXT: 'SET_ACTIVE_CONTEXT',
  ADD_CONTEXT: 'ADD_CONTEXT',
  UPDATE_CONTEXT: 'UPDATE_CONTEXT',
  DELETE_CONTEXT: 'DELETE_CONTEXT',
  ADD_INFORMATION: 'ADD_INFORMATION',
  UPDATE_INFORMATION: 'UPDATE_INFORMATION',
  DELETE_INFORMATION: 'DELETE_INFORMATION',
} as const

// Reducer
function contextReducer(state: ContextState, action: ContextAction): ContextState {
  switch (action.type) {
    case ACTIONS.SET_LOADING:
      return { ...state, isLoading: action.payload }
    
    case ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, isLoading: false }
    
    case ACTIONS.SET_CONTEXTS:
      return { ...state, contexts: action.payload, isLoading: false }
    
    case ACTIONS.SET_INFORMATION:
      return { ...state, information: action.payload, isLoading: false }
    
    case ACTIONS.SET_ACTIVE_CONTEXT:
      return { ...state, activeContext: action.payload }
    
    case ACTIONS.ADD_CONTEXT:
      return { ...state, contexts: [...state.contexts, action.payload] }
    
    case ACTIONS.UPDATE_CONTEXT:
      return {
        ...state,
        contexts: state.contexts.map(context =>
          context.id === action.payload.id ? action.payload : context
        ),
        activeContext: state.activeContext?.id === action.payload.id ? action.payload : state.activeContext,
      }
    
    case ACTIONS.DELETE_CONTEXT:
      return {
        ...state,
        contexts: state.contexts.filter(context => context.id !== action.payload),
        activeContext: state.activeContext?.id === action.payload ? null : state.activeContext,
        information: state.information.filter(info => info.contextId !== action.payload),
      }
    
    case ACTIONS.ADD_INFORMATION:
      return { ...state, information: [...state.information, action.payload] }
    
    case ACTIONS.UPDATE_INFORMATION:
      return {
        ...state,
        information: state.information.map(info =>
          info.id === action.payload.id ? action.payload : info
        ),
      }
    
    case ACTIONS.DELETE_INFORMATION:
      return {
        ...state,
        information: state.information.filter(info => info.id !== action.payload),
      }
    
    default:
      return state
  }
}

// Context
const ContextContext = createContext<{
  state: ContextState
  dispatch: React.Dispatch<ContextAction>
  actions: {
    loadContexts: () => Promise<void>
    loadInformation: (contextId?: string) => Promise<void>
    createContext: (data: any) => Promise<void>
    updateContext: (id: string, data: any) => Promise<void>
    deleteContext: (id: string) => Promise<void>
    setActiveContext: (context: Context | null) => void
    createInformation: (data: any) => Promise<void>
    updateInformation: (id: string, data: any) => Promise<void>
    deleteInformation: (id: string) => Promise<void>
  }
} | null>(null)

// Provider
export function ContextProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(contextReducer, initialState)

  const actions = {
    loadContexts: async () => {
      try {
        dispatch({ type: ACTIONS.SET_LOADING, payload: true })
        const contexts = await contextService.getContexts()
        dispatch({ type: ACTIONS.SET_CONTEXTS, payload: contexts })
      } catch (error) {
        dispatch({ type: ACTIONS.SET_ERROR, payload: 'Failed to load contexts' })
      }
    },

    loadInformation: async (contextId?: string) => {
      try {
        dispatch({ type: ACTIONS.SET_LOADING, payload: true })
        const information = await informationService.getInformation(contextId)
        dispatch({ type: ACTIONS.SET_INFORMATION, payload: information })
      } catch (error) {
        dispatch({ type: ACTIONS.SET_ERROR, payload: 'Failed to load information' })
      }
    },

    createContext: async (data: any) => {
      try {
        const newContext = await contextService.createContext(data)
        dispatch({ type: ACTIONS.ADD_CONTEXT, payload: newContext })
      } catch (error) {
        dispatch({ type: ACTIONS.SET_ERROR, payload: 'Failed to create context' })
      }
    },

    updateContext: async (id: string, data: any) => {
      try {
        const updatedContext = await contextService.updateContext(id, data)
        dispatch({ type: ACTIONS.UPDATE_CONTEXT, payload: updatedContext })
      } catch (error) {
        dispatch({ type: ACTIONS.SET_ERROR, payload: 'Failed to update context' })
      }
    },

    deleteContext: async (id: string) => {
      try {
        await contextService.deleteContext(id)
        dispatch({ type: ACTIONS.DELETE_CONTEXT, payload: id })
      } catch (error) {
        dispatch({ type: ACTIONS.SET_ERROR, payload: 'Failed to delete context' })
      }
    },

    setActiveContext: (context: Context | null) => {
      dispatch({ type: ACTIONS.SET_ACTIVE_CONTEXT, payload: context })
    },

    createInformation: async (data: any) => {
      try {
        const newInformation = await informationService.createInformation(data)
        dispatch({ type: ACTIONS.ADD_INFORMATION, payload: newInformation })
      } catch (error) {
        dispatch({ type: ACTIONS.SET_ERROR, payload: 'Failed to create information' })
      }
    },

    updateInformation: async (id: string, data: any) => {
      try {
        const updatedInformation = await informationService.updateInformation(id, data)
        dispatch({ type: ACTIONS.UPDATE_INFORMATION, payload: updatedInformation })
      } catch (error) {
        dispatch({ type: ACTIONS.SET_ERROR, payload: 'Failed to update information' })
      }
    },

    deleteInformation: async (id: string) => {
      try {
        await informationService.deleteInformation(id)
        dispatch({ type: ACTIONS.DELETE_INFORMATION, payload: id })
      } catch (error) {
        dispatch({ type: ACTIONS.SET_ERROR, payload: 'Failed to delete information' })
      }
    },
  }

  // Load initial data
  useEffect(() => {
    actions.loadContexts()
    actions.loadInformation()
  }, [])

  return (
    <ContextContext.Provider value={{ state, dispatch, actions }}>
      {children}
    </ContextContext.Provider>
  )
}

// Hook
export function useContext() {
  const context = React.useContext(ContextContext)
  if (!context) {
    throw new Error('useContext must be used within a ContextProvider')
  }
  return context
}