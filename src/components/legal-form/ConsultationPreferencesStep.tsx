
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Calendar, Clock, Phone, Mail, Users, Video } from 'lucide-react';

interface ConsultationPrefsData {
  mode: string;
  preferredDate: string;
  preferredTime: string;
}

interface ConsultationPreferencesStepProps {
  data: ConsultationPrefsData;
  onChange: (data: Partial<ConsultationPrefsData>) => void;
}

const ConsultationPreferencesStep = ({ data, onChange }: ConsultationPreferencesStepProps) => {
  const consultationModes = [
    { value: 'phone', label: 'Phone', icon: Phone, description: 'Quick and convenient phone consultation' },
    { value: 'email', label: 'Email', icon: Mail, description: 'Detailed written consultation via email' },
    { value: 'in-person', label: 'In-person', icon: Users, description: 'Face-to-face meeting at our office' },
    { value: 'video-call', label: 'Video Call', icon: Video, description: 'Online video consultation' }
  ];

  // Get tomorrow's date as minimum date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-red/10 rounded-full mb-4">
          <Calendar className="h-8 w-8 text-brand-red" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Consultation Preferences</h3>
        <p className="text-gray-600">Let us know how and when you'd like to connect</p>
      </div>

      <div className="space-y-8">
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-4 block">
            Preferred Consultation Mode <span className="text-red-500 ml-1">*</span>
          </Label>
          <RadioGroup
            value={data.mode}
            onValueChange={(value) => onChange({ mode: value })}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {consultationModes.map((mode) => (
              <div key={mode.value} className="flex items-center space-x-2">
                <RadioGroupItem value={mode.value} id={mode.value} />
                <Label
                  htmlFor={mode.value}
                  className="flex items-center space-x-3 cursor-pointer p-3 border rounded-lg hover:bg-gray-50 flex-1"
                >
                  <mode.icon className="h-5 w-5 text-brand-red" />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{mode.label}</p>
                    <p className="text-sm text-gray-500">{mode.description}</p>
                  </div>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="preferredDate" className="text-sm font-medium text-gray-700 mb-2 flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              Preferred Date <span className="text-red-500 ml-1">*</span>
            </Label>
            <Input
              id="preferredDate"
              type="date"
              min={minDate}
              value={data.preferredDate}
              onChange={(e) => onChange({ preferredDate: e.target.value })}
              className="mt-1"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Please select a date at least one day in advance
            </p>
          </div>

          <div>
            <Label htmlFor="preferredTime" className="text-sm font-medium text-gray-700 mb-2 flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              Preferred Time <span className="text-red-500 ml-1">*</span>
            </Label>
            <Input
              id="preferredTime"
              type="time"
              value={data.preferredTime}
              onChange={(e) => onChange({ preferredTime: e.target.value })}
              className="mt-1"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Available during business hours (9 AM - 6 PM)
            </p>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Calendar className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-yellow-900">Scheduling Note</p>
              <p className="text-sm text-yellow-700">
                Our team will contact you to confirm the appointment within 24 hours of submission. 
                If your preferred slot is unavailable, we'll suggest alternative times.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsultationPreferencesStep;
