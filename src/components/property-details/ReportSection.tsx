import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const ReportSection: React.FC = () => {
  const [selectedReports, setSelectedReports] = useState<string[]>([]);

  const reportOptions = [
    'Listed by Broker',
    'Rented Out', 
    'Wrong Info'
  ];

  const handleReportToggle = (option: string) => {
    setSelectedReports(prev => 
      prev.includes(option) 
        ? prev.filter(item => item !== option)
        : [...prev, option]
    );
  };

  const handleSubmitReports = () => {
    if (selectedReports.length > 0) {
      console.log('Reports submitted:', selectedReports);
      // You could show a toast notification here
      setSelectedReports([]);
    }
  };

  return (
    <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
      <div className="flex items-start gap-3">
        <div className="bg-teal-100 p-2 rounded-lg flex-shrink-0">
          <AlertTriangle className="w-5 h-5 text-teal-600" />
        </div>
        <div className="flex-1">
          <div className="text-sm text-teal-900 mb-2">
            Report what was not correct in this property
          </div>
          
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              {reportOptions.map(option => (
                <Button
                  key={option}
                  onClick={() => handleReportToggle(option)}
                  variant={selectedReports.includes(option) ? "default" : "outline"}
                  size="sm"
                  className={`text-xs ${selectedReports.includes(option) 
                    ? "bg-teal-600 hover:bg-teal-700 text-white" 
                    : "text-teal-700 border-teal-300 hover:bg-teal-100"
                  }`}
                >
                  {option}
                </Button>
              ))}
            </div>

            {selectedReports.length > 0 && (
              <Button
                onClick={handleSubmitReports}
                size="sm"
                className="bg-teal-600 hover:bg-teal-700 text-white text-xs"
              >
                Submit Report
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};