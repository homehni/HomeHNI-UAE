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
const Careers = () => {
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
      
      toast({
        title: "Resume uploaded",
        description: `${file.name} has been selected.`
      });
    }
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
        <div className="relative h-[50vh] overflow-hidden">
          {/* Banner Background */}
          <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{
          backgroundImage: `url('/lovable-uploads/b97275ad-b157-4783-8b5b-198d7c905011.png')`,
          backgroundPosition: 'center center'
        }}></div>
        </div>

        {/* Sticky Form Container for Large Screens */}
        <div className="hidden lg:block fixed top-32 right-4 z-50 w-[420px]">
          <Card className="w-full rounded-xl shadow-2xl bg-background border-2 border-primary">
            <CardContent className="p-4">
              <h3 className="text-xl font-semibold text-foreground mb-1 text-uniform-center">Apply for a Position</h3>

              <form className="space-y-3" onSubmit={e => {
              e.preventDefault();
              toast({
                title: "Application submitted",
                description: "We will review your application and get back to you soon."
              });
              (e.currentTarget as HTMLFormElement).reset();
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

                <div className="flex gap-2">
                  <Select name="country">
                    <SelectTrigger className="flex-1"><SelectValue placeholder="Country" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="India">India</SelectItem>
                      <SelectItem value="USA">USA</SelectItem>
                      <SelectItem value="UK">UK</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select name="state" onValueChange={setSelectedStateDesktop}>
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

                <Select name="position">
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
              <h3 className="text-2xl font-bold text-foreground mb-2 text-uniform-center">Apply for a Position</h3>

                <form className="space-y-4" onSubmit={e => {
                e.preventDefault();
                toast({
                  title: "Application submitted",
                  description: "We will review your application and get back to you soon."
                });
                (e.currentTarget as HTMLFormElement).reset();
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

                  <div className="flex gap-3">
                    <Select name="country">
                      <SelectTrigger className="flex-1 h-12 bg-background">
                        <SelectValue placeholder="Country" />
                      </SelectTrigger>
                      <SelectContent className="bg-background border shadow-lg">
                        <SelectItem value="India">India</SelectItem>
                        <SelectItem value="USA">USA</SelectItem>
                        <SelectItem value="UK">UK</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select name="state" onValueChange={setSelectedState}>
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

                  <Select name="position">
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
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            <div className="max-w-none lg:pr-8">{/* Content takes full width, padding only for desktop form */}
            
            {/* Header Section */}
            <section className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4 text-center lg:text-left">Careers at HomeHNI</h1>
              <p className="text-xl text-gray-600 mb-6 text-center lg:text-left">Shape the Future of High-Value Real Estate with Us</p>
              <p className="text-gray-700 text-uniform mb-3">
                At HomeHNI, we are redefining how High-Net-Worth Individuals (HNIs) experience real estate. With technology, transparency, and trust at our core, we're building India's most intelligent platform for premium property discovery and transactions.
              </p>
              <p className="text-gray-700 text-uniform">
                If you're passionate about innovation, problem-solving, and creating real impact in the luxury property space — we want you on our team.
              </p>
            </section>

            {/* Why Work with HomeHNI */}
            <section className="mb-8">
              <div className="flex items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Why Work with HomeHNI?</h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="card-border-accent hover-lift p-6 bg-blue-50">
                  <h3 className="font-semibold text-blue-800 mb-3 text-uniform-center">Innovation-Driven Culture</h3>
                  <p className="text-blue-700 text-uniform">
                    We don't just follow trends—we set them. You'll work on cutting-edge real estate tech tools, customer experience automation, and intelligent listing algorithms.
                  </p>
                </div>
                
                <div className="card-border-accent hover-lift p-6 bg-green-50">
                  <h3 className="font-semibold text-green-800 mb-3 text-uniform-center">Real Impact, Real Growth</h3>
                  <p className="text-green-700 text-uniform">
                    Your work directly influences how clients make high-value property decisions. From day one, you'll have ownership and autonomy.
                  </p>
                </div>
                
                <div className="card-border-accent hover-lift p-6 bg-purple-50">
                  <h3 className="font-semibold text-purple-800 mb-3 text-uniform-center">Work with the Best Minds</h3>
                  <p className="text-purple-700 text-uniform">
                    Collaborate with experienced professionals from top startups, proptech companies, and the real estate industry.
                  </p>
                </div>
                
                <div className="card-border-accent hover-lift p-6 bg-yellow-50">
                  <h3 className="font-semibold text-yellow-800 mb-3 text-uniform-center">Flexible and Hybrid Opportunities</h3>
                  <p className="text-yellow-700 text-uniform">
                    We believe in productivity over presence. Enjoy flexible working hours, remote options, and a performance-focused environment.
                  </p>
                </div>
              </div>
            </section>

            {/* Current Openings */}
            <section className="mb-8">
              <div className="flex items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Current Openings</h2>
              </div>
              
              <div className="space-y-8">
                <div className="card-border-red hover-lift p-6 bg-white">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 text-uniform">1. Real Estate Sales Consultant – HNI Segment</h3>
                  <div className="space-y-2 text-gray-700 text-uniform">
                    <p><strong>Location:</strong> Mumbai / Bangalore / Delhi NCR</p>
                    <p><strong>Experience:</strong> 3+ years in luxury real estate sales</p>
                    <p><strong>Role:</strong> Build relationships with HNI clients, conduct virtual/onsite property tours, and drive premium property transactions.</p>
                  </div>
                </div>
                
                <div className="card-border-blue hover-lift p-6 bg-white">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 text-uniform">2. Digital Marketing Executive</h3>
                  <div className="space-y-2 text-gray-700 text-uniform">
                    <p><strong>Location:</strong> Remote</p>
                    <p><strong>Experience:</strong> 2–4 years (Real Estate or PropTech preferred)</p>
                    <p><strong>Role:</strong> Plan, execute, and optimize paid ad campaigns, SEO, content marketing, and email automation for lead generation.</p>
                  </div>
                </div>
                
                <div className="card-border-green hover-lift p-6 bg-white">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 text-uniform">3. Full Stack Developer (React + Node.js)</h3>
                  <div className="space-y-2 text-gray-700 text-uniform">
                    <p><strong>Location:</strong> Hybrid (Bangalore Preferred)</p>
                    <p><strong>Experience:</strong> 2–5 years</p>
                    <p><strong>Role:</strong> Build scalable, high-performance web platforms and tools for real estate discovery, agent dashboards, and user engagement.</p>
                  </div>
                </div>
                
                <div className="card-border-purple hover-lift p-6 bg-white">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 text-uniform">4. Legal Documentation Executive</h3>
                  <div className="space-y-2 text-gray-700 text-uniform">
                    <p><strong>Location:</strong> Remote / Onsite</p>
                    <p><strong>Experience:</strong> 1–3 years in property law or legal drafting</p>
                    <p><strong>Role:</strong> Assist clients with sale agreements, title checks, and document review services for property transactions.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Life at HomeHNI */}
            <section className="mb-8">
              <div className="flex items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900"> Life at HomeHNI</h2>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-brand-red rounded-full mt-3 mr-4 flex-shrink-0"></div>
                    <span>Startup agility meets domain expertise</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-brand-red rounded-full mt-3 mr-4 flex-shrink-0"></div>
                    <span>Transparent feedback culture</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-brand-red rounded-full mt-3 mr-4 flex-shrink-0"></div>
                    <span>Monthly knowledge-sharing sessions</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-brand-red rounded-full mt-3 mr-4 flex-shrink-0"></div>
                    <span>Annual offsites, performance rewards, and wellness benefits</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg mt-6">
                <p className="text-blue-800 font-medium italic">
                  "At HomeHNI, you're not just another employee—you're an owner of your work, your ideas, and your journey."<br />
                  <span className="text-sm">– Team HomeHNI</span>
                </p>
              </div>
            </section>

            {/* Don't See Your Role Listed */}
            <section className="mb-8">
              <div className="flex items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Don't See Your Role Listed?</h2>
              </div>
              <p className="text-gray-700 mb-4 leading-relaxed">
                We're always looking for passionate thinkers and doers!
              </p>
              <p className="text-gray-700 leading-relaxed">
                Email us your CV at <strong>careers@homehni.com</strong> with a brief note on why you'd be a great fit.
              </p>
            </section>

            {/* Join the HomeHNI Journey */}
            <section className="mb-8">
              <div className="flex items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Join the HomeHNI Journey</h2>
              </div>
              <div className="bg-gradient-to-r from-brand-red to-red-600 text-white p-8 rounded-lg text-center">
                <p className="text-lg leading-relaxed">
                  Whether you're a tech innovator, a real estate enthusiast, or a service professional—this is your chance to shape the premium property experience for tomorrow's India.
                </p>
              </div>
            </section>

            {/* Career Opportunities */}
            <section className="mb-8">
              <div className="flex items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Career Opportunities</h2>
              </div>
              
              <div className="space-y-6 mb-8">
                <div className="flex flex-wrap gap-3">
                  <span className="px-4 py-2 bg-muted rounded-full text-sm">Sales Consultant Jobs</span>
                  <span className="px-4 py-2 bg-muted rounded-full text-sm">Marketing Executive Roles</span>
                  <span className="px-4 py-2 bg-muted rounded-full text-sm">Developer Positions</span>
                </div>
                <div className="flex flex-wrap gap-3">
                  <span className="px-4 py-2 bg-muted rounded-full text-sm">Real Estate Careers</span>
                  <span className="px-4 py-2 bg-muted rounded-full text-sm">PropTech Jobs</span>
                  <span className="px-4 py-2 bg-muted rounded-full text-sm">Legal Executive Roles</span>
                </div>
                <div className="flex flex-wrap gap-3">
                  <span className="px-4 py-2 bg-muted rounded-full text-sm">Remote Work Opportunities</span>
                  <span className="px-4 py-2 bg-muted rounded-full text-sm">Hybrid Work Culture</span>
                  <span className="px-4 py-2 bg-muted rounded-full text-sm">Flexible Schedule</span>
                </div>
                <div className="flex flex-wrap gap-3">
                  <span className="px-4 py-2 bg-muted rounded-full text-sm">Career Growth</span>
                  <span className="px-4 py-2 bg-muted rounded-full text-sm">Performance Based Incentives</span>
                </div>
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Work Culture & Benefits
              </h3>
              
              <div className="space-y-3 mb-8">
                <div className="flex flex-wrap gap-3">
                  <span className="px-4 py-2 bg-muted rounded-full text-sm">Innovation-Driven Environment</span>
                  <span className="px-4 py-2 bg-muted rounded-full text-sm">Professional Development</span>
                </div>
                <div className="flex flex-wrap gap-3">
                  <span className="px-4 py-2 bg-muted rounded-full text-sm">Health Insurance</span>
                  <span className="px-4 py-2 bg-muted rounded-full text-sm">Performance Bonuses</span>
                </div>
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Application Process
              </h3>
              
              <div className="space-y-3">
                <div className="flex flex-wrap gap-3">
                  <span className="px-4 py-2 bg-muted rounded-full text-sm">Quick Application</span>
                  <span className="px-4 py-2 bg-muted rounded-full text-sm">Online Interview Process</span>
                </div>
                <div className="flex flex-wrap gap-3">
                  <span className="px-4 py-2 bg-muted rounded-full text-sm">Fast Hiring Process</span>
                  <span className="px-4 py-2 bg-muted rounded-full text-sm">Immediate Joining</span>
                </div>
                <div className="flex flex-wrap gap-3">
                  <span className="px-4 py-2 bg-muted rounded-full text-sm">Equal Opportunity Employer</span>
                </div>
              </div>
            </section>

            <div className="mt-8 pt-6 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-500">
                Last updated: {new Date().toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            </div>
            
            {/* Right side spacing for sticky form */}
            <div className="hidden lg:block"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Careers;