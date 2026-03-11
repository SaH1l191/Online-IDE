
import { useState } from "react";

export type SetupStep = "idle" | "transforming" | "mounting" | "installing" | "starting" | "ready" | "error";

export interface SetupState {
  step: SetupStep;
  error: string | null;
}
 
export const useSetupState = () => {
  const [state, setState] = useState<SetupState>({ step: "idle", error: null });

  return {
    state,
    setStep: (step: SetupStep) => setState({ step, error: null }),
    setError: (error: string) => setState({ step: "error", error }),
    reset: () => setState({ step: "idle", error: null }),
  };
};