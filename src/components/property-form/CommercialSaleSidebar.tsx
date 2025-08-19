import { 
  Building2, 
  MapPin, 
  IndianRupee, 
  Wifi, 
  Camera, 
  FileText, 
  Calendar, 
  Eye 
} from 'lucide-react';

interface CommercialSaleSidebarProps {
  currentStep: number;
  completedSteps: number[];
  onStepClick: (step: number) => void;
}

export const CommercialSaleSidebar = ({ currentStep, completedSteps, onStepClick }: CommercialSaleSidebarProps) => {
  const steps = [
    { id: 2, icon: Building2, label: 'Property Details', description: 'Space type, size & details' },
    { id: 3, icon: MapPin, label: 'Location Details', description: 'Address & locality' },
    { id: 4, icon: IndianRupee, label: 'Sale Details', description: 'Price & sale terms' },
    { id: 5, icon: Wifi, label: 'Amenities', description: 'Facilities & features' },
    { id: 6, icon: Camera, label: 'Gallery', description: 'Photos & videos' },
    { id: 7, icon: FileText, label: 'Additional Info', description: 'Description & details' },
    { id: 8, icon: Calendar, label: 'Schedule', description: 'Viewing availability' },
    { id: 9, icon: Eye, label: 'Preview', description: 'Review & submit' },
  ];

  const getStepStatus = (stepId: number) => {
    if (completedSteps.includes(stepId)) return 'completed';
    if (stepId === currentStep) return 'current';
    if (stepId < currentStep) return 'available';
    return 'upcoming';
  };

  const getStepClasses = (status: string) => {
    const baseClasses = 'w-full p-4 rounded-lg border transition-all duration-200 cursor-pointer hover:shadow-md';
    
    switch (status) {
      case 'completed':
        return `${baseClasses} bg-green-50 border-green-200 text-green-800 hover:bg-green-100`;
      case 'current':
        return `${baseClasses} bg-blue-50 border-blue-200 text-blue-800 hover:bg-blue-100`;
      case 'available':
        return `${baseClasses} bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100`;
      default:
        return `${baseClasses} bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed`;
    }
  };

  return (
    <div className="hidden lg:block w-80 bg-white p-6 border-r border-gray-200 overflow-y-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Commercial Sale</h2>
        <p className="text-gray-600">List your commercial property for sale</p>
      </div>

      <div className="space-y-4">
        {steps.map((step) => {
          const status = getStepStatus(step.id);
          const Icon = step.icon;
          
          return (
            <div
              key={step.id}
              className={getStepClasses(status)}
              onClick={() => {
                if (status !== 'upcoming') {
                  onStepClick(step.id);
                }
              }}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${
                  status === 'completed' ? 'bg-green-100' :
                  status === 'current' ? 'bg-blue-100' :
                  status === 'available' ? 'bg-gray-100' : 'bg-gray-50'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium">{step.label}</span>
                    {status === 'completed' && (
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    )}
                    {status === 'current' && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    )}
                  </div>
                  <p className="text-xs opacity-75">{step.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-medium text-blue-900 mb-2">Need Help?</h3>
        <p className="text-sm text-blue-700 mb-3">
          Our team is here to help you list your commercial property successfully.
        </p>
        <button className="text-blue-600 text-sm font-medium hover:underline">
          Contact Support
        </button>
      </div>
    </div>
  );
};