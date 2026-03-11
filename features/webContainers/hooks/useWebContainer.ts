import { useState, useEffect, useCallback } from 'react';
import { WebContainer } from '@webcontainer/api';

//singleton pattern to maintain single instance of this (preventing multiple boots )
let _instance: WebContainer | null = null;
let _bootPromise: Promise<WebContainer> | null = null;

async function getOrBootInstance(): Promise<WebContainer> {
  if (_instance)    return _instance;
  if (_bootPromise) return _bootPromise;

  _bootPromise = WebContainer.boot().then((wc) => {
    _instance    = wc;
    _bootPromise = null;
    return wc;
  });

  return _bootPromise;
}
 
interface UseWebContainerReturn {
  instance:      WebContainer | null;
  isLoading:     boolean;
  error:         string | null;
  writeFileSync: (path: string, content: string) => Promise<void>;
}

export function useWebContainer(): UseWebContainerReturn { 
  const [instance,  setInstance]  = useState<WebContainer | null>(() => _instance);
  const [isLoading, setIsLoading] = useState(() => !_instance);
  const [error,     setError]     = useState<string | null>(null);

    //   singleton must persist across remount of component 
  useEffect(() => { 
    if (_instance) return;

    getOrBootInstance()
      .then((wc) => { setInstance(wc); setIsLoading(false); })
      .catch((e)  => { setError(e instanceof Error ? e.message : String(e)); setIsLoading(false); });
  }, []);

  const writeFileSync = useCallback(async (path: string, content: string): Promise<void> => {
    if (!_instance) throw new Error("WebContainer not ready");
    console.log("writing file to container:", { path, content });
    //forms path by including all path segments except the file name, then ensures that directory exists before writing file
    const dir = path.split("/").slice(0, -1).join("/");
    console.log("ensuring directory exists:", dir);
    if (dir) await _instance.fs.mkdir(dir, { recursive: true }); 
    await _instance.fs.writeFile(path, content);
  }, []); // no deps — reads _instance directly from module scope

  return { instance, isLoading, error, writeFileSync };
}