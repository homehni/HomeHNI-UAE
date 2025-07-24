import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle, Download, FileText, Clock, Shield, Receipt, Calendar, User, ArrowRight } from 'lucide-react';
import Header from '@/components/Header';
import Marquee from '@/components/Marquee';
import Footer from '@/components/Footer';

const RentReceipts = () => {
  const [formData, setFormData] = useState({
    tenantName: '',
    tenantAddress: '',
    landlordName: '',
    landlordAddress: '',
    landlordPAN: '',
    propertyAddress: '',
    rentAmount: '',
    rentPeriod: '',
    paymentDate: '',
    paymentMode: '',
    receiptNumber: '',
    additionalNotes: ''
  });

  const [generatedReceipt, setGeneratedReceipt] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleGenerateReceipt = (e: React.FormEvent) => {
    e.preventDefault();
    setGeneratedReceipt(true);
    // In a real app, this would generate and download the PDF
  };

  const scrollToGenerator = () => {
    const element = document.getElementById('receipt-generator');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  const benefits = [
    {
      icon: FileText,
      title: "Legally Valid Receipts",
      description: "Generate receipts that comply with Income Tax Act requirements"
    },
    {
      icon: Clock,
      title: "Instant Generation",
      description: "Create and download receipts in seconds"
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your data is protected and not stored on our servers"
    },
    {
      icon: Download,
      title: "PDF Download",
      description: "Download receipts in professional PDF format"
    }
  ];

  const faqs = [
    {
      question: "Are these rent receipts legally valid?",
      answer: "Yes, our rent receipts are designed to comply with Income Tax Act requirements and are legally valid for HRA claims and tax deductions."
    },
    {
      question: "Do I need to register to use this service?",
      answer: "No registration required. Simply fill the form and generate your rent receipt instantly."
    },
    {
      question: "Can I generate receipts for multiple months?",
      answer: "Yes, you can generate receipts for any rental period - monthly, quarterly, or custom periods."
    },
    {
      question: "Is my personal information stored?",
      answer: "No, we don't store any personal information. All data is processed locally and securely."
    },
    {
      question: "What payment modes can I mention in the receipt?",
      answer: "You can mention any payment mode - cash, bank transfer, cheque, online payment, etc."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Marquee />
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-50 to-blue-50 pt-24 pb-16 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Online Rent Receipt
              <span className="block text-brand-red">Generator</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Generate legally valid rent receipts instantly for HRA claims and tax savings
            </p>
            <Button 
              onClick={scrollToGenerator}
              size="lg" 
              className="bg-brand-red hover:bg-brand-red-dark text-white px-8 py-3 text-lg"
            >
              Generate Receipt Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-green-200 rounded-full opacity-20 -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-200 rounded-full opacity-20 translate-y-24 -translate-x-24"></div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Use Our Rent Receipt Generator?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Create professional rent receipts with all required details for tax compliance
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Receipt Generator Form */}
      <section id="receipt-generator" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Generate Your Rent Receipt</h2>
              <p className="text-gray-600">Fill in the details below to create your rent receipt</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Receipt className="mr-2 h-5 w-5 text-brand-red" />
                    Receipt Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleGenerateReceipt} className="space-y-6">
                    {/* Tenant Details */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold flex items-center">
                        <User className="mr-2 h-4 w-4" />
                        Tenant Details
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <Label htmlFor="tenantName">Tenant Name *</Label>
                          <Input
                            id="tenantName"
                            value={formData.tenantName}
                            onChange={(e) => handleInputChange('tenantName', e.target.value)}
                            placeholder="Enter tenant's full name"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="tenantAddress">Tenant Address *</Label>
                          <Textarea
                            id="tenantAddress"
                            value={formData.tenantAddress}
                            onChange={(e) => handleInputChange('tenantAddress', e.target.value)}
                            placeholder="Enter tenant's complete address"
                            rows={3}
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* Landlord Details */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Landlord Details</h3>
                      <div className="space-y-3">
                        <div>
                          <Label htmlFor="landlordName">Landlord Name *</Label>
                          <Input
                            id="landlordName"
                            value={formData.landlordName}
                            onChange={(e) => handleInputChange('landlordName', e.target.value)}
                            placeholder="Enter landlord's full name"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="landlordAddress">Landlord Address *</Label>
                          <Textarea
                            id="landlordAddress"
                            value={formData.landlordAddress}
                            onChange={(e) => handleInputChange('landlordAddress', e.target.value)}
                            placeholder="Enter landlord's complete address"
                            rows={3}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="landlordPAN">Landlord PAN Number</Label>
                          <Input
                            id="landlordPAN"
                            value={formData.landlordPAN}
                            onChange={(e) => handleInputChange('landlordPAN', e.target.value)}
                            placeholder="Enter PAN number (optional)"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Property & Payment Details */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Property & Payment Details</h3>
                      <div className="space-y-3">
                        <div>
                          <Label htmlFor="propertyAddress">Property Address *</Label>
                          <Textarea
                            id="propertyAddress"
                            value={formData.propertyAddress}
                            onChange={(e) => handleInputChange('propertyAddress', e.target.value)}
                            placeholder="Enter rental property address"
                            rows={3}
                            required
                          />
                        </div>
                        <div className="grid md:grid-cols-2 gap-3">
                          <div>
                            <Label htmlFor="rentAmount">Rent Amount (₹) *</Label>
                            <Input
                              id="rentAmount"
                              type="number"
                              value={formData.rentAmount}
                              onChange={(e) => handleInputChange('rentAmount', e.target.value)}
                              placeholder="Enter rent amount"
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="rentPeriod">Rent Period *</Label>
                            <Input
                              id="rentPeriod"
                              value={formData.rentPeriod}
                              onChange={(e) => handleInputChange('rentPeriod', e.target.value)}
                              placeholder="e.g., January 2024"
                              required
                            />
                          </div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-3">
                          <div>
                            <Label htmlFor="paymentDate">Payment Date *</Label>
                            <Input
                              id="paymentDate"
                              type="date"
                              value={formData.paymentDate}
                              onChange={(e) => handleInputChange('paymentDate', e.target.value)}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="paymentMode">Payment Mode *</Label>
                            <Select onValueChange={(value) => handleInputChange('paymentMode', value)}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select payment mode" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="cash">Cash</SelectItem>
                                <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                                <SelectItem value="cheque">Cheque</SelectItem>
                                <SelectItem value="online">Online Payment</SelectItem>
                                <SelectItem value="upi">UPI</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="receiptNumber">Receipt Number</Label>
                          <Input
                            id="receiptNumber"
                            value={formData.receiptNumber}
                            onChange={(e) => handleInputChange('receiptNumber', e.target.value)}
                            placeholder="Enter receipt number (optional)"
                          />
                        </div>
                        <div>
                          <Label htmlFor="additionalNotes">Additional Notes</Label>
                          <Textarea
                            id="additionalNotes"
                            value={formData.additionalNotes}
                            onChange={(e) => handleInputChange('additionalNotes', e.target.value)}
                            placeholder="Any additional information (optional)"
                            rows={2}
                          />
                        </div>
                      </div>
                    </div>

                    <Button type="submit" className="w-full bg-brand-red hover:bg-brand-red-dark text-white">
                      <Receipt className="mr-2 h-4 w-4" />
                      Generate Rent Receipt
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Preview/Result */}
              <Card>
                <CardHeader>
                  <CardTitle>Receipt Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  {!generatedReceipt ? (
                    <div className="text-center py-12">
                      <Receipt className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">Fill the form to preview your rent receipt</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-center mb-2">
                          <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                          <span className="font-semibold text-green-800">Receipt Generated Successfully!</span>
                        </div>
                        <p className="text-green-700">Your rent receipt has been generated and is ready for download.</p>
                      </div>
                      
                      <div className="border rounded-lg p-4 bg-white">
                        <h4 className="font-semibold text-center mb-4 text-lg">RENT RECEIPT</h4>
                        <div className="space-y-2 text-sm">
                          <p><strong>Receipt No:</strong> {formData.receiptNumber || 'RR001'}</p>
                          <p><strong>Date:</strong> {formData.paymentDate}</p>
                          <hr className="my-2" />
                          <p><strong>Received from:</strong> {formData.tenantName}</p>
                          <p><strong>Address:</strong> {formData.tenantAddress}</p>
                          <p><strong>Amount:</strong> ₹{formData.rentAmount}</p>
                          <p><strong>Period:</strong> {formData.rentPeriod}</p>
                          <p><strong>Property:</strong> {formData.propertyAddress}</p>
                          <p><strong>Payment Mode:</strong> {formData.paymentMode}</p>
                          <hr className="my-2" />
                          <p><strong>Landlord:</strong> {formData.landlordName}</p>
                          <p><strong>Address:</strong> {formData.landlordAddress}</p>
                          {formData.landlordPAN && <p><strong>PAN:</strong> {formData.landlordPAN}</p>}
                        </div>
                      </div>
                      
                      <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                        <Download className="mr-2 h-4 w-4" />
                        Download PDF Receipt
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Generate professional rent receipts in just 3 simple steps
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Fill Details</h3>
              <p className="text-gray-600">Enter tenant, landlord, and property information in the form</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Generate Receipt</h3>
              <p className="text-gray-600">Click generate to create your legally valid rent receipt</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-orange-600">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Download PDF</h3>
              <p className="text-gray-600">Download your receipt in professional PDF format</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible>
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-brand-red text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Generate Your Rent Receipt?</h2>
          <p className="text-xl mb-8">Create legally valid receipts for your HRA claims and tax savings</p>
          <Button 
            size="lg" 
            className="bg-white text-brand-red hover:bg-gray-100 px-8 py-3 text-lg"
            onClick={scrollToGenerator}
          >
            Generate Receipt Now
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default RentReceipts;