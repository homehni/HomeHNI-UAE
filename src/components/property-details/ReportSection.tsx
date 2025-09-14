import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

export const ReportSection: React.FC = () => {
  const [reportText, setReportText] = useState('');
  const [showReportForm, setShowReportForm] = useState(false);

  const handleSubmitReport = () => {
    if (reportText.trim()) {
      // Handle report submission
      console.log('Report submitted:', reportText);
      setReportText('');
      setShowReportForm(false);
      // You could show a toast notification here
    }
  };

  return (
    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
      <div className="flex items-start gap-3">
        <div className="bg-orange-100 p-2 rounded-lg">
          <AlertTriangle className="w-5 h-5 text-orange-600" />
        </div>
        <div className="flex-1">
          <div className="font-medium text-orange-900 mb-2">
            Report what was not correct in this property
          </div>
          
          {!showReportForm ? (
            <Button
              onClick={() => setShowReportForm(true)}
              variant="outline"
              size="sm"
              className="text-orange-600 border-orange-300 hover:bg-orange-100"
            >
              Report Issue
            </Button>
          ) : (
            <div className="space-y-3">
              <Textarea
                placeholder="Please describe what was incorrect about this property listing..."
                value={reportText}
                onChange={(e) => setReportText(e.target.value)}
                className="min-h-[100px] border-orange-300 focus:border-orange-500"
              />
              <div className="flex gap-2">
                <Button
                  onClick={handleSubmitReport}
                  size="sm"
                  className="bg-orange-600 hover:bg-orange-700 text-white"
                  disabled={!reportText.trim()}
                >
                  Submit Report
                </Button>
                <Button
                  onClick={() => {
                    setShowReportForm(false);
                    setReportText('');
                  }}
                  variant="outline"
                  size="sm"
                  className="text-orange-600 border-orange-300 hover:bg-orange-100"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};