import React, { useState } from 'react';
import { AlertTriangle, MapPin, Camera, Users, Home, Calendar, Tag, Info, ArrowLeft, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

export const ReportSection: React.FC = () => {
  const [selectedReports, setSelectedReports] = useState<string[]>([]);
  const [showWrongInfoModal, setShowWrongInfoModal] = useState(false);
  const [selectedIssues, setSelectedIssues] = useState<string[]>([]);
  const { toast } = useToast();

  const reportOptions = [
    'Listed by Broker',
    'Rented Out', 
    'Wrong Info'
  ];

  const issueOptions = [
    { id: 'location', label: 'Location', icon: MapPin },
    { id: 'fake-photos', label: 'Fake Photos', icon: Camera },
    { id: 'tenants-preference', label: 'Tenants Preference', icon: Users },
    { id: 'bhk-type', label: 'BHK Type', icon: Home },
    { id: 'availability-date', label: 'Availability Date', icon: Calendar },
    { id: 'rent-deposit', label: 'Rent or Deposit', icon: Tag },
    { id: 'other', label: 'Other', icon: Info },
  ];

  const handleReportToggle = (option: string) => {
    if (option === 'Wrong Info') {
      setShowWrongInfoModal(true);
    } else {
      // Show modern branded toast notification
      toast({
        title: "Contact Required",
        description: "It seems you have not taken the contact of this property. Please Take Owner Contact before reporting the issue",
        className: "bg-brand-red text-white border-0 rounded-xl shadow-xl font-body",
        style: {
          background: "hsl(var(--brand-red))",
          color: "white",
          fontFamily: "'Open Sans', sans-serif",
          fontSize: "14px",
          fontWeight: "400",
          lineHeight: "1.5",
        },
      });
    }
  };

  const handleIssueToggle = (issueId: string) => {
    setSelectedIssues(prev => 
      prev.includes(issueId) 
        ? prev.filter(item => item !== issueId)
        : [...prev, issueId]
    );
  };

  const handleSubmitIssues = () => {
    if (selectedIssues.length > 0) {
      console.log('Issues reported:', selectedIssues);
      toast({
        title: "Report Submitted",
        description: "Thank you for reporting the issues. We will review them shortly.",
        className: "bg-brand-red text-white border-0 rounded-xl shadow-xl font-body",
        style: {
          background: "hsl(var(--brand-red))",
          color: "white",
          fontFamily: "'Open Sans', sans-serif",
          fontSize: "14px",
          fontWeight: "400",
          lineHeight: "1.5",
        },
      });
      setSelectedIssues([]);
      setShowWrongInfoModal(false);
    }
  };

  return (
    <>
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="space-y-3">
          <div className="text-xs text-red-900">
            Report what was not correct in this property
          </div>
          <div className="flex flex-wrap gap-2">
            {reportOptions.map(option => (
              <Button
                key={option}
                onClick={() => handleReportToggle(option)}
                variant="outline"
                size="sm"
                className="text-xs text-red-700 border-red-300 hover:bg-red-100"
              >
                {option}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Wrong Info Modal */}
      <Dialog open={showWrongInfoModal} onOpenChange={setShowWrongInfoModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              What's wrong?
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {issueOptions.map(({ id, label, icon: Icon }) => (
              <div key={id} className="flex items-center space-x-3">
                <Icon className="h-5 w-5 text-gray-500" />
                <div className="flex-1">
                  <label htmlFor={id} className="text-sm text-gray-700 cursor-pointer">
                    {label}
                  </label>
                </div>
                <Checkbox
                  id={id}
                  checked={selectedIssues.includes(id)}
                  onCheckedChange={() => handleIssueToggle(id)}
                />
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between mt-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowWrongInfoModal(false)}
              className="flex items-center gap-1"
            >
              <ArrowLeft size={16} />
              Back
            </Button>
            
            <Button
              onClick={handleSubmitIssues}
              disabled={selectedIssues.length === 0}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Report
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};