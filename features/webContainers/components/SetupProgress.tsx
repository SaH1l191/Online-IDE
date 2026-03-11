import React from 'react';
import { Progress } from '@/components/ui/progress';
import { useWebContainerStore } from '../stores/webContainerStore';

export const SetupProgress: React.FC = () => {
  const { currentStep, loadingState } = useWebContainerStore();
  
  const totalSteps = 4;
  const getStepText = (stepIndex: number, label: string) => {
    const isActive = stepIndex === currentStep;
    const isComplete = stepIndex < currentStep;

    return (
      <span className={`text-sm font-medium ${isComplete ? 'text-green-600' :
          isActive ? 'text-blue-600' :
            'text-gray-500'
        }`}>
        {label}
      </span>
    );
  };

  return (
    <div className="space-y-4">
      <Progress value={(currentStep / totalSteps) * 100} className="w-full" />
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          {getStepText(0, 'Initializing')}
          {loadingState.transforming && <span className="text-xs text-blue-600">Transforming...</span>}
        </div>
        <div className="flex items-center justify-between">
          {getStepText(1, 'Transforming')}
          {loadingState.mounting && <span className="text-xs text-blue-600">Mounting...</span>}
        </div>
        <div className="flex items-center justify-between">
          {getStepText(2, 'Installing')}
          {loadingState.installing && <span className="text-xs text-blue-600">Installing...</span>}
        </div>
        <div className="flex items-center justify-between">
          {getStepText(3, 'Starting Server')}
          {loadingState.starting && <span className="text-xs text-blue-600">Starting...</span>}
        </div>
      </div>
    </div>
  );
};
