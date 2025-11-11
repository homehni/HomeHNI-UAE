import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Marquee from '@/components/Marquee';
import { useToast } from '@/hooks/use-toast';

const SummonsNotices = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contactNumber: '',
    webPortal: '',
    pageUrl: '',
    complaintReasons: [] as string[],
    description: '',
    supportingDocument: null as File | null
  });
  const { toast } = useToast();

  const complaintOptions = [
    { id: 'belongs-other', label: 'belongs to another person and to which the user does not have any right' },
    { id: 'defamatory', label: 'is defamatory, obscene, pornographic, paedophilic, invasive of another\'s privacy, including bodily privacy, insulting or harassing on the basis of gender, libellous,racially or ethnically objectionable, relating or encouraging money laundering or gambling, or otherwise inconsistent with or contrary to the laws in force' },
    { id: 'harmful-child', label: 'is harmful to child' },
    { id: 'infringes-rights', label: 'infringes any patent, trademark, copyright or other proprietary rights' },
    { id: 'violates-law', label: 'violates any law for the time being in force' },
    { id: 'deceives-misleads', label: 'deceives or misleads the addressee about the origin of the message or knowingly andintentionally communicates any information which is patently false or misleading innature but may reasonably be perceived as a fact' },
    { id: 'impersonates', label: 'impersonates another person' },
    { id: 'threatens-unity', label: 'threatens the unity, integrity, defence, security or sovereignty of India, friendlyrelations with foreign States, or public order, or causes incitement to the commission of any cognisable offence or prevents investigation of any offence or is insulting toother nation' },
    { id: 'contains-virus', label: 'contains software virus or any other computer code, file or program designed tointerrupt, destroy or limit the functionality of any computer resource' },
    { id: 'false-untrue', label: 'is patently false and untrue, and is written or published in any form, with the intent tomislead or harass a person, entity or agency for financial gain or to cause any injury toany person' },
    { id: 'other', label: 'Other' }
  ];

  const handleReasonChange = (reasonId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      complaintReasons: checked 
        ? [...prev.complaintReasons, reasonId]
        : prev.complaintReasons.filter(id => id !== reasonId)
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, supportingDocument: file }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.contactNumber || !formData.webPortal || 
        !formData.pageUrl || formData.complaintReasons.length === 0 || !formData.description) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    // Here you would typically send the data to your backend
    toast({
      title: "Complaint Submitted",
      description: "Your complaint has been submitted successfully. We will review it and get back to you soon.",
    });

    // Reset form
    setFormData({
      name: '',
      email: '',
      contactNumber: '',
      webPortal: '',
      pageUrl: '',
      complaintReasons: [],
      description: '',
      supportingDocument: null
    });
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
            <div className="text-center text-white">
              
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            {/* Complaint Form */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-orange-600 mb-2">
                  Complaint / Status Form - Only for Law Enforcement Agencies
                </h2>
                <p className="text-sm text-gray-600">
                  <span className="text-red-500">*</span> Compulsory Fields
                </p>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Your Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <span className="text-red-500">*</span> Your Name:
                  </label>
                  <Input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full"
                    required
                  />
                </div>

                {/* Email ID */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <span className="text-red-500">*</span> Your E-Mail ID:
                  </label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full"
                    required
                  />
                </div>

                {/* Contact Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <span className="text-red-500">*</span> Your Contact Number:
                  </label>
                  <Input
                    type="tel"
                    value={formData.contactNumber}
                    onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                    className="w-full"
                    required
                  />
                </div>

                {/* Web Portal */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <span className="text-red-500">*</span> Please mark the web portal which hosts the issue(s) encountered by you:
                  </label>
                  <Select value={formData.webPortal} onValueChange={(value) => setFormData({ ...formData, webPortal: value })}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="main-website">Main Website</SelectItem>
                      <SelectItem value="mobile-app">Mobile Application</SelectItem>
                      <SelectItem value="partner-portal">Partner Portal</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Page URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <span className="text-red-500">*</span> Please share the link (URL) of the Page which you are reporting against:
                  </label>
                  <Input
                    type="url"
                    value={formData.pageUrl}
                    onChange={(e) => setFormData({ ...formData, pageUrl: e.target.value })}
                    className="w-full"
                    placeholder="Enter URL"
                    required
                  />
                </div>

                {/* Complaint Reasons */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    <span className="text-red-500">*</span> Please tell us the reason for your complaint/concern. Choose an option which most closely matches with your concern. If you are unsure which option to choose, please select the last option. Thanks
                  </label>
                  <div className="space-y-3">
                    {complaintOptions.map((option) => (
                      <div key={option.id} className="flex items-start space-x-3">
                        <Checkbox
                          id={option.id}
                          checked={formData.complaintReasons.includes(option.id)}
                          onCheckedChange={(checked) => handleReasonChange(option.id, checked as boolean)}
                          className="mt-1"
                        />
                        <label 
                          htmlFor={option.id} 
                          className="text-sm text-gray-700 leading-relaxed cursor-pointer"
                        >
                          {option.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <span className="text-red-500">*</span> Please describe your complaint/concern in detail:
                  </label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full min-h-[120px] resize-none"
                    required
                  />
                </div>

                {/* File Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Please upload any supporting document(s) pertaining to the issue you are reporting:
                  </label>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept=".gif,.png,.jpg,.pdf,.jpeg"
                    className="w-full p-2 border border-gray-300 rounded-md file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-brand-red file:text-white hover:file:bg-brand-red-dark"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    (Please upload a GIF, PNG, JPG, PDF or JPEG file only and ensure that the file is currently not in use. [Maximum File Size Limit 2 MB])
                  </p>
                </div>

                {/* Submit Button */}
                <Button 
                  type="submit" 
                  className="w-full bg-brand-red hover:bg-brand-red-dark text-white py-3 text-lg font-medium"
                >
                  Submit
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

export default SummonsNotices;
