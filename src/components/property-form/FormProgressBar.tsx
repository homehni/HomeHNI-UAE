import { Progress } from '@/components/ui/progress';

interface FormProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export const FormProgressBar = ({ currentStep, totalSteps }: FormProgressBarProps) => {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="w-full mb-8">
      <div className="flex justify-between mb-2">
        <span className="text-sm font-medium text-muted-foreground">
          Step {currentStep} of {totalSteps}
        </span>
        <span className="text-sm font-medium text-primary">
          {Math.round(progress)}% Complete
        </span>
      </div>
      <Progress value={progress} className="h-2" />
      
      <div className="flex justify-between mt-3">
        <div className={`text-xs ${currentStep >= 1 ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
          Property Details
        </div>
        <div className={`text-xs ${currentStep >= 2 ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
          Preview & Submit
        </div>
      </div>
    </div>
  );
};