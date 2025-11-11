import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Marquee from '@/components/Marquee';
import { sendReportProblemEmail } from '@/services/emailService';
import { useToast } from '@/hooks/use-toast';

const ReportProblem = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    feedbackType: '',
    feedback: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.feedbackType || !formData.feedback) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    try {
      // Send email
      await sendReportProblemEmail(formData.email, formData.name, {
        emailId: formData.email,
        feedbackType: formData.feedbackType,
        feedbackDetails: formData.feedback
      });
      
      toast({
        title: "Feedback Submitted",
        description: "Thank you for your feedback. We'll get back to you soon!",
      });

      // Reset form
      setFormData({
        name: '',
        email: '',
        feedbackType: '',
        feedback: ''
      });
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "Failed to submit feedback. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Marquee at the very top */}
      <Marquee />
      
      {/* Header overlapping with content */}
      <Header />
      
      {/* Hero Section */}
      <div className="pt-8">
        <div className="relative h-[50vh] overflow-hidden">
          {/* Hero Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`,
              backgroundPosition: 'center center'
            }}
          >
            {/* Overlay for better text readability */}
            <div className="absolute inset-0 bg-black/20"></div>
          </div>
          
          {/* Hero Content */}
          <div className="relative z-10 flex items-center justify-center h-full">
           
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto">
            {/* Feedback Form */}
            <div className="bg-white rounded-lg shadow-lg p-8 border border-primary">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                We would love to hear you!
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Field */}
                <div>
                  <Input
                    type="text"
                    placeholder="Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full"
                  />
                </div>

                {/* Email Field */}
                <div>
                  <Input
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full"
                  />
                </div>

                {/* Feedback Type Select */}
                <div>
                  <Select value={formData.feedbackType} onValueChange={(value) => setFormData({ ...formData, feedbackType: value })}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Feedback" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technical-issue">Technical Issue</SelectItem>
                      <SelectItem value="account-problem">Account Problem</SelectItem>
                      <SelectItem value="payment-issue">Payment Issue</SelectItem>
                      <SelectItem value="property-listing">Property Listing Issue</SelectItem>
                      <SelectItem value="customer-service">Customer Service</SelectItem>
                      <SelectItem value="feature-request">Feature Request</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Feedback Textarea */}
                <div>
                  <Textarea
                    placeholder="Type your feedback"
                    value={formData.feedback}
                    onChange={(e) => setFormData({ ...formData, feedback: e.target.value })}
                    className="w-full min-h-[120px] resize-none"
                  />
                </div>

                {/* Submit Button */}
                <Button 
                  type="submit" 
                  className="w-full bg-brand-red hover:bg-brand-red-dark text-white py-3 text-lg font-medium"
                >
                  Send Feedback
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ReportProblem;
