import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Marquee from '@/components/Marquee';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/components/ui/use-toast';
import { sendGrievanceRedressalEmail } from '@/services/emailService';

const grievanceSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Please enter a valid email address'),
  contactNumber: z.string().min(10, 'Please enter a valid contact number'),
  platform: z.string().optional(),
  url: z.string().optional(),
  complaintNature: z.string().optional(),
  description: z.string().optional(),
  supportingDocument: z.any().optional(),
});

type GrievanceFormData = z.infer<typeof grievanceSchema>;

const platformOptions = [
  'Home Listings',
  'Legal Services',
  'Blogs',
  'Property Services',
  'Rental Agreements',
  'Packers and Movers',
  'Others'
];

const complaintNatureOptions = [
  'Belongs to another person without authorization',
  'Defamatory / Obscene / Pornographic / Harassment / Invasion of Privacy',
  'Child safety violation',
  'Infringes intellectual property',
  'Violation of Indian law',
  'Misleading or deceptive content',
  'Impersonation',
  'Threat to national security or public order',
  'Contains virus or malicious code',
  'False and misleading for financial or personal gain',
  'Others (including Consumer Complaints)'
];

const GrievanceRedressal = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<GrievanceFormData>({
    resolver: zodResolver(grievanceSchema),
    defaultValues: {
      name: '',
      email: '',
      contactNumber: '',
      platform: '',
      url: '',
      complaintNature: '',
      description: '',
    },
  });

  const onSubmit = async (data: GrievanceFormData) => {
    setIsSubmitting(true);
    
    try {
      // Send email
      await sendGrievanceRedressalEmail(data.email, data.name, {
        emailId: data.email,
        contactNumber: data.contactNumber,
        urlOfPage: data.url,
        platformSection: data.platform || '',
        natureOfComplaint: data.complaintNature || '',
        complaintDetails: data.description
      });
      
      // Show success message
      toast({
        title: "Grievance Submitted Successfully",
        description: "We have received your grievance and will review it within 7 working days.",
      });
      
      // Reset form
      form.reset();
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your grievance. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Marquee at the very top */}
      <Marquee />
      
      {/* Header overlapping with content */}
      <Header />
      
      {/* Hero Section with grievance image */}
      <div className="md:pt-8">
        <div className="relative h-[50vh] overflow-hidden">
          {/* Grievance Banner Background */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`,
              backgroundPosition: 'center center'
            }}
          ></div>
          
          {/* Content overlay */}
          <div className="relative z-10 flex items-center justify-center h-full">
            {/* Hero section shows the banner with "GRIEVANCES" text */}
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            {/* Page Title */}
            <div className="mb-8 text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4"> Grievance Redressal Form</h1>
              <p className="text-lg text-gray-700 leading-relaxed">
                At Home HNI, we are committed to providing a safe and transparent experience to all our users. If you believe that any content hosted on our platform violates laws, infringes rights, or is misleading or harmful, you can raise your concern by filling the grievance form below.
              </p>
            </div>

            {/* Grievance Form */}
            <div className="bg-gray-50 rounded-lg p-8 mb-8 border border-primary">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Personal Information Section */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Your Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your full name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Your Email ID</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="Enter your email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="contactNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Your Contact Number</FormLabel>
                          <FormControl>
                            <Input type="tel" placeholder="Enter your contact number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="platform"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Select Platform/Section</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select platform where issue occurred" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {platformOptions.map((platform) => (
                                <SelectItem key={platform} value={platform}>
                                  {platform}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* URL and Complaint Nature */}
                  <FormField
                    control={form.control}
                    name="url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>URL of the page you're reporting</FormLabel>
                        <FormControl>
                          <Input type="url" placeholder="https://example.com/page-url" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="complaintNature"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nature of Complaint</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select nature of complaint" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {complaintNatureOptions.map((option) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Description */}
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Describe your complaint in detail</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Please provide a detailed description of your complaint..." 
                            className="min-h-[120px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* File Upload */}
                  <div className="space-y-2">
                    <Label htmlFor="supportingDocument">Upload supporting document(s)</Label>
                    <Input 
                      id="supportingDocument"
                      type="file" 
                      accept=".pdf,.jpg,.jpeg,.png,.gif"
                      className="h-10 file:h-8 file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-brand-red file:text-white hover:file:bg-brand-red-dark file:cursor-pointer cursor-pointer"
                    />
                    <p className="text-sm text-gray-500">
                      Supported formats: PDF, JPG, PNG, JPEG, GIF (Max 2MB)
                    </p>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4 flex justify-center">
                    <Button 
                      type="submit" 
                      className="bg-brand-red hover:bg-brand-red-dark text-white px-8 py-3"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Grievance'}
                    </Button>
                  </div>
                </form>
              </Form>
            </div>

            {/* Additional Notes */}
            <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-r-lg">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800"> Important Information</h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <p>
                      We will review your grievance within 7 working days. If further information is required, our team will reach out via the provided contact details.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default GrievanceRedressal;