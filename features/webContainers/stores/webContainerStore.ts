import { create } from 'zustand';
import { WebContainer } from '@webcontainer/api';

export interface LoadingState {
  transforming: boolean;
  mounting: boolean;
  installing: boolean;
  starting: boolean;
}

export interface WebContainerState {
  // Instance state
  instance: WebContainer | null;
  serverUrl: string | null;
  
  // Setup state
  status: 'idle' | 'setting up' | 'ready' | 'error';
  currentStep: number;
  loadingState: LoadingState;
  setupError: string | null;
  isSetupComplete: boolean;
  isSetupInProgress: boolean;
  
  // Actions
  setInstance: (instance: WebContainer | null) => void;
  setServerUrl: (url: string | null) => void;
  setStatus: (status: WebContainerState['status']) => void;
  setCurrentStep: (step: number) => void;
  setLoadingState: (state: Partial<LoadingState>) => void;
  setSetupError: (error: string | null) => void;
  setIsSetupComplete: (complete: boolean) => void;
  setIsSetupInProgress: (inProgress: boolean) => void;
  reset: () => void;
  cleanup: () => void;
  globalReset: () => void;
}

const initialState = {
  instance: null,
  serverUrl: null,
  status: 'idle' as const,
  currentStep: 0,
  loadingState: {
    transforming: false,
    mounting: false,
    installing: false,
    starting: false,
  },
  setupError: null,
  isSetupComplete: false,
  isSetupInProgress: false,
};

export const useWebContainerStore = create<WebContainerState>((set, get) => ({
  ...initialState,
  
  setInstance: (instance) => set({ instance }),
  setServerUrl: (serverUrl) => set({ serverUrl }),
  setStatus: (status) => set({ status }),
  setCurrentStep: (currentStep) => set({ currentStep }),
  setLoadingState: (loadingState) => set((state) => ({
    loadingState: { ...state.loadingState, ...loadingState }
  })),
  setSetupError: (setupError) => set({ setupError }),
  setIsSetupComplete: (isSetupComplete) => set({ isSetupComplete }),
  setIsSetupInProgress: (isSetupInProgress) => set({ isSetupInProgress }),
  
  reset: async () => {
    const { instance } = get();
    if (instance) {
      try {
        await instance.teardown();
      } catch (error) {
        console.error('Error during reset:', error);
      }
    }
    set(initialState);
  },
  
  cleanup: async () => {
    const { instance } = get();
    if (instance) {
      try {
        await instance.teardown();
        set({ instance: null, serverUrl: null, status: 'idle' });
      } catch (error) {
        console.error('Error cleaning up WebContainer:', error);
      }
    }
  },

  // Add global reset method
  globalReset: async () => {
    const { resetGlobalWebContainer } = await import('../utils/webContainerLock');
    await resetGlobalWebContainer();
    set(initialState);
  },
}));
