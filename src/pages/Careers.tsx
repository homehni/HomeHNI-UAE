import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Upload, FileText, X } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Marquee from '@/components/Marquee';
import { sendCareerApplicationEmail } from '@/services/emailService';
const Careers = () => {
  // Career page component
  const [statesData, setStatesData] = useState<any>(null);
  const [selectedState, setSelectedState] = useState("");
  const [selectedStateDesktop, setSelectedStateDesktop] = useState("");
  const [cities, setCities] = useState<string[]>([]);
  const [citiesDesktop, setCitiesDesktop] = useState<string[]>([]);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeFileMobile, setResumeFileMobile] = useState<File | null>(null);

  const { toast } = useToast();

  const handleResumeUpload = (file: File | null, isMobile: boolean = false) => {
    if (file) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF or Word document.",
          variant: "destructive"
        });
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload a file smaller than 5MB.",
          variant: "destructive"
        });
        return;
      }

      if (isMobile) {
        setResumeFileMobile(file);
      } else {
        setResumeFile(file);
      }
    }
  };

  const [selectedPosition, setSelectedPosition] = useState("");
  const [selectedPositionDesktop, setSelectedPositionDesktop] = useState("");

  const resetForm = () => {
    // Reset all state variables
    setSelectedState("");
    setSelectedStateDesktop("");
    setSelectedPosition("");
    setSelectedPositionDesktop("");
    setCities([]);
    setCitiesDesktop([]);
    setResumeFile(null);
    setResumeFileMobile(null);
  };

  const removeResume = (isMobile: boolean = false) => {
    if (isMobile) {
      setResumeFileMobile(null);
    } else {
      setResumeFile(null);
    }
  };

  // Load states and cities data
  useEffect(() => {
    const loadStatesData = async () => {
      try {
        const response = await fetch('/data/india_states_cities.json');
        const data = await response.json();
        setStatesData(data);
      } catch (error) {
        console.error('Failed to load states data:', error);
      }
    };
    loadStatesData();
  }, []);

  // Update cities when state changes (mobile)
  useEffect(() => {
    if (statesData && selectedState) {
      const cities = statesData[selectedState];
      setCities(cities || []);
    } else {
      setCities([]);
    }
  }, [selectedState, statesData]);

  // Update cities when state changes (desktop)
  useEffect(() => {
    if (statesData && selectedStateDesktop) {
      const cities = statesData[selectedStateDesktop];
      setCitiesDesktop(cities || []);
    } else {
      setCitiesDesktop([]);
    }
  }, [selectedStateDesktop, statesData]);

  useEffect(() => {
    // Smooth scroll to top when component mounts
    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    };

    // Small delay to ensure page is fully loaded
    setTimeout(scrollToTop, 100);
  }, []);
  return (
    <div className="min-h-screen bg-white">
      {/* Marquee at the very top */}
      <Marquee />
      
      {/* Header overlapping with content */}
      <Header />
      
      {/* Hero Section with banner image merged with header/marquee */}
      <div className="md:pt-8">
         <div className="relative h-[85vh] overflow-hidden bg-cover bg-center bg-no-repeat" style={{
           backgroundImage: "url('/lovable-uploads/fbb0d72f-782e-49f5-bbe1-8afc1314b5f7.png')"
         }}>
          {/* Banner Background */}
           <div className="absolute inset-0 bg-red-900/80 pointer-events-none"></div>
        
          {/* Hero Text Overlay */}
          <div className="absolute inset-0 flex items-center pt-20">
            <div className="container mx-auto px-4">
              <div className="text-white max-w-4xl text-center">
                 <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                   Launch Your Sales Career with HomeHNI
                </h1>
                <p className="text-lg md:text-xl mb-8 opacity-90 leading-relaxed">
                  Join India's fastest-growing real estate platform as a Sales Intern and gain hands-on experience in luxury property sales while building your professional network
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Form Container for Large Screens */}
        <div className="hidden lg:block fixed top-32 right-4 z-50 w-[420px]">
          <Card className="w-full rounded-xl shadow-2xl bg-background border-2 border-primary">
            <CardContent className="p-4">
              <h3 className="text-xl font-semibold text-foreground mb-1 text-uniform-center">Apply for Sales Intern Position</h3>

              <form className="space-y-3" onSubmit={async e => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget as HTMLFormElement);
              const data = {
                userName: formData.get('name') as string,
                phoneNumber: formData.get('phone') as string,
                emailId: formData.get('email') as string,
                collegeName: formData.get('collegeName') as string,
                universityName: formData.get('universityName') as string,
                state: formData.get('state') as string,
                city: formData.get('city') as string,
                positionOfInterest: formData.get('position') as string,
              };
              
              // Send email
              await sendCareerApplicationEmail(data.emailId, data.userName, {
                phoneNumber: data.phoneNumber,
                emailId: data.emailId,
                collegeName: data.collegeName,
                universityName: data.universityName,
                state: data.state,
                city: data.city,
                positionOfInterest: data.positionOfInterest
              });
              
              toast({
                title: "Application submitted successfully!",
                description: "We will review your application and get back to you soon.",
                variant: "success"
              });
              (e.currentTarget as HTMLFormElement).reset();
              resetForm();
            }}>
                <Input id="career-name" name="name" placeholder="Full Name" required />

                <div className="flex gap-2">
                  <Select defaultValue="+91" name="countryCode">
                    <SelectTrigger className="w-28"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="+91">🇮🇳 +91</SelectItem>
                      <SelectItem value="+1">🇺🇸 +1</SelectItem>
                      <SelectItem value="+44">🇬🇧 +44</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input id="career-phone" name="phone" type="tel" placeholder="Phone Number" className="flex-1" required />
                </div>

                <Input id="career-email" name="email" type="email" placeholder="Email ID" required />

                <Input id="career-college" name="collegeName" placeholder="College Name" required />
                
                <Input id="career-university" name="universityName" placeholder="University Name" required />

                <div className="flex gap-2">
                  <Select name="state" value={selectedStateDesktop} onValueChange={setSelectedStateDesktop}>
                    <SelectTrigger className="flex-1"><SelectValue placeholder="State" /></SelectTrigger>
                    <SelectContent>
                      {statesData && Object.keys(statesData).map((state: string) => (
                        <SelectItem key={state} value={state}>
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select name="city">
                    <SelectTrigger className="flex-1"><SelectValue placeholder="City" /></SelectTrigger>
                    <SelectContent>
                      {citiesDesktop.map((city: string) => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Select name="position" value={selectedPositionDesktop} onValueChange={setSelectedPositionDesktop}>
                  <SelectTrigger id="position"><SelectValue placeholder="Position of Interest" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sales-consultant">Real Estate Sales Consultant</SelectItem>
                    <SelectItem value="marketing-executive">Digital Marketing Executive</SelectItem>
                    <SelectItem value="fullstack-developer">Full Stack Developer</SelectItem>
                    <SelectItem value="legal-executive">Legal Documentation Executive</SelectItem>
                    <SelectItem value="other">Other Position</SelectItem>
                  </SelectContent>
                </Select>

                {/* Resume Upload */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Resume/CV</label>
                  {!resumeFile ? (
                    <div className="flex items-center gap-2 p-2 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors">
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => e.target.files?.[0] && handleResumeUpload(e.target.files[0])}
                        className="hidden"
                        id="resume-upload"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById('resume-upload')?.click()}
                        className="flex items-center gap-1 text-xs h-8"
                      >
                        <Upload className="h-3 w-3" />
                        Choose File
                      </Button>
                      <span className="text-xs text-gray-500">PDF, DOC, DOCX (Max 5MB)</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-700">{resumeFile.name}</p>
                          <p className="text-xs text-gray-500">{(resumeFile.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeResume()}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>


                <Button type="submit" className="w-full bg-red-800 hover:bg-red-900 text-white">Submit Application</Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Mobile Form - Static below hero */}
        <section className="lg:hidden px-4 py-8 bg-background">
        <div className="container mx-auto max-w-xl px-4">
          <Card className="w-full rounded-2xl shadow-xl border-2 border-primary bg-card">
            <CardContent className="p-6">
              <h3 className="text-2xl font-bold text-foreground mb-2 text-uniform-center">Apply for Sales Intern Position</h3>

                <form className="space-y-4" onSubmit={async e => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget as HTMLFormElement);
                const data = {
                  userName: formData.get('name') as string,
                  phoneNumber: formData.get('phone') as string,
                  emailId: formData.get('email') as string,
                  collegeName: formData.get('collegeName') as string,
                  universityName: formData.get('universityName') as string,
                  state: formData.get('state') as string,
                  city: formData.get('city') as string,
                  positionOfInterest: formData.get('position') as string,
                };
                
                // Send email
                await sendCareerApplicationEmail(data.emailId, data.userName, {
                  phoneNumber: data.phoneNumber,
                  emailId: data.emailId,
                  collegeName: data.collegeName,
                  universityName: data.universityName,
                  state: data.state,
                  city: data.city,
                  positionOfInterest: data.positionOfInterest
                });
                
                toast({
                  title: "Application submitted successfully!",
                  description: "We will review your application and get back to you soon.",
                  variant: "success"
                });
                (e.currentTarget as HTMLFormElement).reset();
                resetForm();
              }}>
                  <Input id="career-name-mobile" name="name" placeholder="Full Name" className="h-12 text-base bg-background" required />

                  <div className="flex gap-3">
                    <Select defaultValue="+91" name="countryCode">
                      <SelectTrigger className="w-32 h-12 bg-background">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-background border shadow-lg">
                        <SelectItem value="+91">🇮🇳 +91</SelectItem>
                        <SelectItem value="+1">🇺🇸 +1</SelectItem>
                        <SelectItem value="+44">🇬🇧 +44</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input id="career-phone-mobile" name="phone" type="tel" placeholder="Phone Number" className="flex-1 h-12 text-base bg-background" required />
                  </div>

                  <Input id="career-email-mobile" name="email" type="email" placeholder="Email ID" className="h-12 text-base bg-background" required />

                  <Input id="career-college-mobile" name="collegeName" placeholder="College Name" className="h-12 text-base bg-background" required />
                  
                  <Input id="career-university-mobile" name="universityName" placeholder="University Name" className="h-12 text-base bg-background" required />

                  <div className="flex gap-3">
                    <Select name="state" value={selectedState} onValueChange={setSelectedState}>
                      <SelectTrigger className="flex-1 h-12 bg-background">
                        <SelectValue placeholder="State" />
                      </SelectTrigger>
                      <SelectContent className="bg-background border shadow-lg">
                        {statesData && Object.keys(statesData).map((state: string) => (
                          <SelectItem key={state} value={state}>
                            {state}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select name="city">
                      <SelectTrigger className="flex-1 h-12 bg-background">
                        <SelectValue placeholder="City" />
                      </SelectTrigger>
                      <SelectContent className="bg-background border shadow-lg">
                        {cities.map((city: string) => (
                          <SelectItem key={city} value={city}>
                            {city}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Select name="position" value={selectedPosition} onValueChange={setSelectedPosition}>
                    <SelectTrigger id="position-mobile" className="h-12 bg-background">
                      <SelectValue placeholder="Position of Interest" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border shadow-lg">
                      <SelectItem value="sales-consultant">Real Estate Sales Consultant</SelectItem>
                      <SelectItem value="marketing-executive">Digital Marketing Executive</SelectItem>
                      <SelectItem value="fullstack-developer">Full Stack Developer</SelectItem>
                      <SelectItem value="legal-executive">Legal Documentation Executive</SelectItem>
                      <SelectItem value="other">Other Position</SelectItem>
                    </SelectContent>
                  </Select>

                  <Input id="career-experience-mobile" name="experience" placeholder="Years of Experience" className="h-12 text-base bg-background" />

                  {/* Resume Upload - Mobile */}
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">Resume/CV</label>
                    {!resumeFileMobile ? (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                        <Upload className="h-8 w-8 text-gray-400 mx-auto mb-3" />
                        <p className="text-base text-gray-600 mb-3">Upload your resume</p>
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={(e) => e.target.files?.[0] && handleResumeUpload(e.target.files[0], true)}
                          className="hidden"
                          id="resume-upload-mobile"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => document.getElementById('resume-upload-mobile')?.click()}
                          className="h-12"
                        >
                          Choose File
                        </Button>
                        <p className="text-sm text-gray-500 mt-2">PDF, DOC, DOCX (Max 5MB)</p>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <FileText className="h-6 w-6 text-gray-400" />
                          <div>
                            <p className="text-base font-medium text-gray-700">{resumeFileMobile.name}</p>
                            <p className="text-sm text-gray-500">{(resumeFileMobile.size / 1024 / 1024).toFixed(2)} MB</p>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeResume(true)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="h-5 w-5" />
                        </Button>
                      </div>
                    )}
                  </div>

                  

                  <Button type="submit" className="w-full h-12 text-base font-semibold bg-red-800 hover:bg-red-900 text-white mt-6">
                    Submit Application
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Main Content */}
        <div className="container mx-auto px-4 pt-4 pb-8">
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            <div className="w-full lg:w-2/3 lg:pr-8 flex flex-col items-center">{/* Content centered */}
            
            {/* Header Section */}
            <section className="mb-12 pt-12">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-full mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 via-red-600 to-gray-900 bg-clip-text text-transparent mb-4">
                  Sales Internship Program at HomeHNI
                </h1>
                <div className="w-20 h-1 bg-gradient-to-r from-red-500 to-red-600 mx-auto mb-4"></div>
                <p className="text-lg md:text-xl font-semibold text-gray-700 mb-6">Launch Your Sales Career in Luxury Real Estate</p>
              </div>
              
              <div className="bg-gradient-to-r from-gray-50 to-red-50 rounded-xl p-6 border border-red-100 shadow-md">
                <div className="max-w-3xl mx-auto">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <p className="text-gray-700 text-base">
                          <span className="font-semibold text-gray-900">Exclusive Program:</span> Designed specifically for ambitious college students and recent graduates
                        </p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <p className="text-gray-700 text-base">
                          <span className="font-semibold text-gray-900">Hands-on Experience:</span> Gain real experience in high-value property transactions
                        </p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <p className="text-gray-700 text-base">
                          <span className="font-semibold text-gray-900">HNI Network:</span> Work directly with High-Net-Worth Individuals
                        </p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <p className="text-gray-700 text-base">
                          <span className="font-semibold text-gray-900">Professional Growth:</span> Build your network and sales skills
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Why Work with HomeHNI */}
            <section className="mb-8">
              <div className="flex items-center justify-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Why Choose Our Sales Internship?</h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                <div className="card-border-accent hover-lift p-6 bg-blue-50">
                  <h3 className="font-semibold text-blue-800 mb-3 text-center">Real Sales Experience</h3>
                  <p className="text-blue-700 text-center">
                    Work with actual clients and learn the art of luxury property sales. No coffee runs or filing—just real, hands-on sales experience from day one.
                  </p>
                </div>
                
                <div className="card-border-accent hover-lift p-6 bg-green-50">
                  <h3 className="font-semibold text-green-800 mb-3 text-center">High-Value Commissions</h3>
                  <p className="text-green-700 text-center">
                    Earn competitive commissions on luxury property sales. Our interns have earned ₹50,000+ in their first month working with premium clients.
                  </p>
                </div>
                
                <div className="card-border-accent hover-lift p-6 bg-purple-50">
                  <h3 className="font-semibold text-purple-800 mb-3 text-center">Mentorship Program</h3>
                  <p className="text-purple-700 text-center">
                    Get paired with senior sales professionals who will guide you through every step of the sales process and client relationship building.
                  </p>
                </div>
                
                <div className="card-border-accent hover-lift p-6 bg-yellow-50">
                  <h3 className="font-semibold text-yellow-800 mb-3 text-center">Flexible Schedule</h3>
                  <p className="text-yellow-700 text-center">
                    Perfect for students! Work around your class schedule with flexible hours and remote work options. Earn while you learn.
                  </p>
                </div>
              </div>
            </section>

            {/* Sales Intern Role Details */}
            <section className="mb-8">
              <div className="flex items-center justify-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Sales Intern Role & Responsibilities</h2>
              </div>
              
              <div className="space-y-6 max-w-4xl mx-auto">
                <div className="card-border-red hover-lift p-6 bg-white">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">What You'll Do as a Sales Intern</h3>
                  <div className="space-y-3 text-gray-700">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                      <p><strong>Lead Generation:</strong> Identify and reach out to potential HNI clients through various channels</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                      <p><strong>Client Communication:</strong> Handle initial client inquiries and schedule property viewings</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                      <p><strong>Property Presentations:</strong> Assist in showcasing luxury properties to potential buyers</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                      <p><strong>Sales Support:</strong> Help senior sales professionals with documentation and follow-ups</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                      <p><strong>Market Research:</strong> Analyze luxury property trends and competitor activities</p>
                    </div>
                  </div>
                </div>
                
                <div className="card-border-blue hover-lift p-6 bg-white">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">What We're Looking For</h3>
                  <div className="space-y-3 text-gray-700">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <p><strong>Education:</strong> Currently pursuing or recently completed Bachelor's/Master's degree</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <p><strong>Communication:</strong> Excellent verbal and written communication skills in English</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <p><strong>Personality:</strong> Confident, outgoing, and comfortable interacting with high-net-worth individuals</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <p><strong>Tech-Savvy:</strong> Comfortable using CRM systems, social media, and digital tools</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <p><strong>Commitment:</strong> Available for 3-6 months internship duration</p>
                    </div>
                  </div>
                </div>
                
                <div className="card-border-green hover-lift p-6 bg-white">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">What You'll Gain</h3>
                  <div className="space-y-3 text-gray-700">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <p><strong>Sales Skills:</strong> Master the art of luxury property sales and client relationship management</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <p><strong>Industry Knowledge:</strong> Deep understanding of luxury real estate market and trends</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <p><strong>Professional Network:</strong> Connect with industry leaders, developers, and HNI clients</p>
                  </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <p><strong>Commission Earnings:</strong> Earn competitive commissions on successful sales</p>
                </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <p><strong>Career Growth:</strong> Potential for full-time employment upon successful completion</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Student Experience at HomeHNI */}
            <section className="mb-8">
              <div className="flex items-center justify-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Student Experience at HomeHNI</h2>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg max-w-3xl mx-auto">
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-brand-red rounded-full mt-3 mr-4 flex-shrink-0"></div>
                    <span>Work alongside experienced sales professionals and learn from the best</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-brand-red rounded-full mt-3 mr-4 flex-shrink-0"></div>
                    <span>Flexible schedule that works around your college classes</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-brand-red rounded-full mt-3 mr-4 flex-shrink-0"></div>
                    <span>Weekly training sessions on sales techniques and market trends</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-brand-red rounded-full mt-3 mr-4 flex-shrink-0"></div>
                    <span>Monthly performance reviews and career guidance sessions</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-brand-red rounded-full mt-3 mr-4 flex-shrink-0"></div>
                    <span>Networking events with industry leaders and potential employers</span>
                  </li>
                </ul>
              </div>
              
            </section>

            {/* Ready to Start Your Sales Journey? */}
            <section className="mb-8">
              <div className="flex items-center justify-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Ready to Start Your Sales Journey?</h2>
              </div>
              <p className="text-gray-700 mb-4 leading-relaxed text-center max-w-3xl mx-auto">
                Don't wait! Our Sales Internship Program has limited spots and fills up quickly.
              </p>
              <p className="text-gray-700 leading-relaxed text-center max-w-3xl mx-auto">
                Apply now using the form on this page, or email us directly at <strong>homehni8@gmail.com</strong> with your resume and a brief note about why you want to join our sales team.
              </p>
            </section>



            </div>
            
            {/* Right side spacing for sticky form */}
            <div className="hidden lg:block w-1/3"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Careers;