// Global WebContainer instance and promise management
let globalBootPromise: Promise<any> | null = null;
let globalInstance: any = null;

export const getOrCreateWebContainer = async (): Promise<any> => {
  // Return existing instance if available
  if (globalInstance) {
    return globalInstance;
  }

  // Return existing boot promise if booting in progress
  if (globalBootPromise) {
    return globalBootPromise;
  }

  // Create new boot promise
  globalBootPromise = (async () => {
    try {
      const { WebContainer } = await import('@webcontainer/api');
      globalInstance = await WebContainer.boot();
      return globalInstance;
    } catch (error) {
      globalBootPromise = null;
      throw error;
    }
  })();

  return globalBootPromise;
};

export const resetGlobalWebContainer = async (): Promise<void> => {
  if (globalInstance) {
    try {
      await globalInstance.teardown();
    } catch (error) {
      console.error('Error tearing down global instance:', error);
    }
  }
  
  globalInstance = null;
  globalBootPromise = null;
};

export const getGlobalInstance = (): any => {
  return globalInstance;
};
