import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Marquee from '@/components/Marquee';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Upload } from 'lucide-react';

interface ChatMessage {
  sender: 'buyer' | 'seller';
  message: string;
  timestamp: Date;
}

interface Service {
  name: string;
  requiredDoc: string;
  price: number;
  duration: string;
  status: 'Pending' | 'Ongoing' | 'Done' | 'Optional';
}

export const DealRoom: React.FC = () => {
  // Buyer state
  const [buyerLoginId, setBuyerLoginId] = useState('');
  const [buyerPropertyId, setBuyerPropertyId] = useState('BUY-XXXX');
  const [buyerMatchedProperty, setBuyerMatchedProperty] = useState('');
  const [buyerDocType, setBuyerDocType] = useState('ID Proof');
  const [buyerNotes, setBuyerNotes] = useState('');

  // Seller state
  const [sellerLoginId, setSellerLoginId] = useState('');
  const [sellerPropertyId, setSellerPropertyId] = useState('SEL-XXXX');
  const [sellerMatchedProperty, setSellerMatchedProperty] = useState('');
  const [sellerDocType, setSellerDocType] = useState('Title Deed');
  const [commission, setCommission] = useState('0');

  // Chat state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [buyerMessage, setBuyerMessage] = useState('');
  const [sellerMessage, setSellerMessage] = useState('');

  // Services state
  const [services, setServices] = useState<Service[]>([
    { name: 'Title Due Diligence', requiredDoc: 'Title Deed', price: 12000, duration: '5-7 days', status: 'Pending' },
    { name: 'Encumbrance Certificate', requiredDoc: 'EC Application', price: 2500, duration: '2-3 days', status: 'Pending' },
    { name: 'Agreement Drafting', requiredDoc: 'Govt ID, PAN', price: 6000, duration: '2-4 days', status: 'Pending' },
    { name: 'E-Registration & Deed', requiredDoc: 'Aadhar, Photos', price: 4500, duration: '1-2 days', status: 'Pending' },
    { name: 'Home Loan Assistance', requiredDoc: 'Income Proof', price: 0, duration: 'Varies', status: 'Optional' },
    { name: 'Movers & Packers', requiredDoc: 'Address Proof', price: 0, duration: '1 day', status: 'Optional' }
  ]);

  // MOU and Certificate state
  const [mouText, setMouText] = useState('');
  const [certText, setCertText] = useState('');
  
  // Form fields for MOU
  const [mouBuyerName, setMouBuyerName] = useState('');
  const [mouBuyerPhone, setMouBuyerPhone] = useState('');
  const [mouBuyerAddress, setMouBuyerAddress] = useState('');
  const [mouSellerName, setMouSellerName] = useState('');
  const [mouSellerPhone, setMouSellerPhone] = useState('');
  const [mouSellerAddress, setMouSellerAddress] = useState('');
  
  // Totals
  const servicesTotal = services.filter(s => s.status !== 'Optional').reduce((sum, service) => sum + service.price, 0);
  const quotedPrice = 0; // This should come from property data

  const saveBuyer = () => {
    alert('Buyer details saved!');
  };

  const saveSeller = () => {
    alert('Seller details saved!');
  };

  const clearBuyer = () => {
    setBuyerLoginId('');
    setBuyerPropertyId('BUY-XXXX');
    setBuyerMatchedProperty('');
    setBuyerDocType('ID Proof');
    setBuyerNotes('');
  };

  const clearSeller = () => {
    setSellerLoginId('');
    setSellerPropertyId('SEL-XXXX');
    setSellerMatchedProperty('');
    setSellerDocType('Title Deed');
    setCommission('0');
  };

  const sendMessage = (sender: 'buyer' | 'seller') => {
    const message = sender === 'buyer' ? buyerMessage : sellerMessage;
    if (!message.trim()) return;

    const newMessage: ChatMessage = {
      sender,
      message,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, newMessage]);
    
    if (sender === 'buyer') {
      setBuyerMessage('');
    } else {
      setSellerMessage('');
    }
  };

  const generateMOU = () => {
    const mouContent = `MEMORANDUM OF UNDERSTANDING

Buyer Name: ${mouBuyerName}
Buyer Phone: ${mouBuyerPhone}
Buyer Address: ${mouBuyerAddress}

Seller/Provider Name: ${mouSellerName}
Seller/Provider Phone: ${mouSellerPhone}
Seller Address: ${mouSellerAddress}

MOU draft will appear here...

Terms and Conditions:
- Subject to mutual agreement
- All legal formalities to be completed
- Payment terms to be finalized`;
    setMouText(mouContent);
  };

  const generateCertificate = () => {
    const certContent = `HomeHNI Certificate & Totals

Certificate text...

Services Total: ₹${servicesTotal.toLocaleString()}
Quoted Price + Commission (1%): ₹${quotedPrice}

This certifies that the deal has been completed successfully through HomeHNI platform.`;
    setCertText(certContent);
  };

  const downloadText = (text: string, filename: string) => {
    const blob = new Blob([text], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  };

  const updateServicePrice = (index: number, price: number) => {
    setServices(prev => 
      prev.map((service, i) => 
        i === index ? { ...service, price } : service
      )
    );
  };

  const updateServiceStatus = (index: number, status: Service['status']) => {
    setServices(prev => 
      prev.map((service, i) => 
        i === index ? { ...service, status } : service
      )
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Marquee />
      <Header />
      
      <div className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-6 py-8 text-center">
            <h1 className="text-2xl font-bold text-brand-red mb-2">HomeHNI — Matched Property Dashboard</h1>
            {/* <p className="text-muted-foreground">Two vertical panels • One horizontal Deal Room</p> */}
          </div>

          {/* Top Panels - Buyer and Seller */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Buyer Panel */}
            <Card className="card-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-brand-red flex items-center gap-2">
                    <span className="text-blue-600">Buyer Panel</span>
                    <span className="text-muted-foreground text-sm">Property ID</span>
                  </CardTitle>
                  <span className="text-yellow-600 font-mono text-sm">{buyerPropertyId}</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Buyer Login ID</label>
                  <Input
                    placeholder="BUY-XXXX"
                    value={buyerLoginId}
                    onChange={(e) => setBuyerLoginId(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Matched Property (Auto)</label>
                  <Textarea
                    placeholder="Not found for this Property ID"
                    value={buyerMatchedProperty}
                    onChange={(e) => setBuyerMatchedProperty(e.target.value)}
                    className="h-20"
                  />
                </div>

                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Buyer Required Doc Type</label>
                  <Select value={buyerDocType} onValueChange={setBuyerDocType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ID Proof">ID Proof</SelectItem>
                      <SelectItem value="Address Proof">Address Proof</SelectItem>
                      <SelectItem value="Income Proof">Income Proof</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Upload Buyer Document Snapshot</label>
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1">
                      <Upload className="h-4 w-4 mr-2" />
                      Choose Files
                    </Button>
                    <span className="text-muted-foreground text-sm self-center">No file chosen</span>
                  </div>
                </div>

                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Buyer Notes</label>
                  <Textarea
                    placeholder="Any notes or constraints..."
                    value={buyerNotes}
                    onChange={(e) => setBuyerNotes(e.target.value)}
                    className="h-16"
                  />
                </div>

                <div className="flex gap-2">
                  <Button onClick={saveBuyer} className="flex-1">
                    Save Buyer
                  </Button>
                  <Button onClick={clearBuyer} variant="outline" className="flex-1">
                    Clear
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Seller Panel */}
            <Card className="card-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-brand-red flex items-center gap-2">
                    <span className="text-green-600">Seller Panel</span>
                    <span className="text-muted-foreground text-sm">Seller Login ID</span>
                  </CardTitle>
                  <span className="text-yellow-600 font-mono text-sm">{sellerPropertyId}</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Matched Property (Auto)</label>
                  <Textarea
                    placeholder="Not found for this Property ID"
                    value={sellerMatchedProperty}
                    onChange={(e) => setSellerMatchedProperty(e.target.value)}
                    className="h-20"
                  />
                </div>

                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Quoted Details by Property Agent</label>
                  <div className="text-muted-foreground text-sm mb-2">Commission (1%) — Auto</div>
                  <Input
                    placeholder="₹ 0"
                    value={`₹ ${commission}`}
                    onChange={(e) => setCommission(e.target.value.replace('₹ ', ''))}
                  />
                </div>

                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Seller Required Doc Type</label>
                  <Select value={sellerDocType} onValueChange={setSellerDocType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Title Deed">Title Deed</SelectItem>
                      <SelectItem value="Sale Deed">Sale Deed</SelectItem>
                      <SelectItem value="Encumbrance Certificate">Encumbrance Certificate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Benefits after Commission</label>
                  <div className="text-green-600 text-sm">Verified tag, discounts, priority support</div>
                </div>

                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Upload Seller Document Snapshot</label>
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1">
                      <Upload className="h-4 w-4 mr-2" />
                      Choose Files
                    </Button>
                    <span className="text-muted-foreground text-sm self-center">No file chosen</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button onClick={saveSeller} className="flex-1">
                    Save Seller
                  </Button>
                  <Button onClick={clearSeller} variant="outline" className="flex-1">
                    Clear
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Deal Room - Horizontal Panel */}
          <Card className="card-border">
            <CardHeader>
              <CardTitle className="text-brand-red">Deal Room</CardTitle>
              <p className="text-muted-foreground text-sm">Shared chat, services, required docs, MOU & certificate</p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Chat Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-foreground font-medium mb-4">Buyer Chat</h3>
                  <Textarea
                    placeholder="Type message to seller..."
                    value={buyerMessage}
                    onChange={(e) => setBuyerMessage(e.target.value)}
                    className="h-32 mb-4"
                  />
                  <div className="flex gap-2 mb-4">
                    <Button variant="outline" className="flex-1">
                      <Upload className="h-4 w-4 mr-2" />
                      Choose Files
                    </Button>
                    <span className="text-muted-foreground text-sm self-center">No file chosen</span>
                  </div>
                  <Button 
                    onClick={() => sendMessage('buyer')} 
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                  >
                    Send as Buyer
                  </Button>
                </div>

                <div>
                  <h3 className="text-foreground font-medium mb-4">Seller Chat</h3>
                  <Textarea
                    placeholder="Type message to buyer..."
                    value={sellerMessage}
                    onChange={(e) => setSellerMessage(e.target.value)}
                    className="h-32 mb-4"
                  />
                  <div className="flex gap-2 mb-4">
                    <Button variant="outline" className="flex-1">
                      <Upload className="h-4 w-4 mr-2" />
                      Choose Files
                    </Button>
                    <span className="text-muted-foreground text-sm self-center">No file chosen</span>
                  </div>
                  <Button 
                    onClick={() => sendMessage('seller')} 
                    className="w-full bg-cyan-600 hover:bg-cyan-700 text-white"
                  >
                    Send as Seller
                  </Button>
                </div>
              </div>

              {/* Service Tracker & Required Documents */}
              <div>
                <h3 className="text-foreground font-medium mb-4">Service Tracker & Required Documents</h3>
                <p className="text-muted-foreground text-sm mb-4">Add price, durations, descend and upload snapshots per service.</p>
                
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr className="text-left">
                        <th className="p-3 text-foreground font-medium">Service</th>
                        <th className="p-3 text-foreground font-medium">Required Doc</th>
                        <th className="p-3 text-foreground font-medium">Price (₹)</th>
                        <th className="p-3 text-foreground font-medium">Duration</th>
                        <th className="p-3 text-foreground font-medium">Status</th>
                        <th className="p-3 text-foreground font-medium">Upload Snapshot</th>
                      </tr>
                    </thead>
                    <tbody>
                      {services.map((service, index) => (
                        <tr key={index} className="border-t">
                          <td className="p-3 text-foreground">{service.name}</td>
                          <td className="p-3 text-muted-foreground">{service.requiredDoc}</td>
                           <td className="p-3">
                            <Input
                              type="number"
                              min="0"
                              value={service.price}
                              onChange={(e) => {
                                const value = parseFloat(e.target.value) || 0;
                                updateServicePrice(index, Math.max(0, value));
                              }}
                              className="w-20 text-sm"
                            />
                          </td>
                          <td className="p-3 text-muted-foreground text-sm">{service.duration}</td>
                          <td className="p-3">
                            <Select
                              value={service.status}
                              onValueChange={(value: Service['status']) => updateServiceStatus(index, value)}
                            >
                              <SelectTrigger className="w-24 text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Pending">Pending</SelectItem>
                                <SelectItem value="Ongoing">Ongoing</SelectItem>
                                <SelectItem value="Done">Done</SelectItem>
                                <SelectItem value="Optional">Optional</SelectItem>
                              </SelectContent>
                            </Select>
                          </td>
                          <td className="p-3">
                            <Button variant="outline" size="sm" className="text-xs">
                              Choose Files
                            </Button>
                          </td>
                        </tr>
                      ))}
                      <tr className="border-t-2 bg-accent/20">
                        <td colSpan={2} className="p-3 text-foreground font-medium">Services Total</td>
                        <td className="p-3 text-brand-red font-bold">₹ {servicesTotal.toLocaleString()}</td>
                        <td colSpan={3}></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* MOU and Certificate Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Create MOU */}
                <div className="h-full">
                  <h3 className="text-foreground font-medium mb-4">Create MOU</h3>
                  <div className="space-y-3 mb-4">
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        placeholder="Buyer Name"
                        value={mouBuyerName}
                        onChange={(e) => setMouBuyerName(e.target.value)}
                        className="text-sm"
                      />
                      <Input
                        placeholder="Buyer Phone"
                        value={mouBuyerPhone}
                        onChange={(e) => setMouBuyerPhone(e.target.value)}
                        className="text-sm"
                      />
                    </div>
                    <Input
                      placeholder="Buyer Address"
                      value={mouBuyerAddress}
                      onChange={(e) => setMouBuyerAddress(e.target.value)}
                      className="text-sm"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        placeholder="Seller/Provider Name"
                        value={mouSellerName}
                        onChange={(e) => setMouSellerName(e.target.value)}
                        className="text-sm"
                      />
                      <Input
                        placeholder="Seller/Provider Phone"
                        value={mouSellerPhone}
                        onChange={(e) => setMouSellerPhone(e.target.value)}
                        className="text-sm"
                      />
                    </div>
                    <Input
                      placeholder="Seller Address"
                      value={mouSellerAddress}
                      onChange={(e) => setMouSellerAddress(e.target.value)}
                      className="text-sm"
                    />
                  </div>
                  
                  <Textarea
                    placeholder="MOU draft will appear here..."
                    value={mouText}
                    onChange={(e) => setMouText(e.target.value)}
                    className="h-32 mb-4"
                  />
                  
                  <div className="flex gap-2">
                    <Button 
                      onClick={generateMOU} 
                      className="flex-1"
                    >
                      Generate MOU
                    </Button>
                    <Button 
                      onClick={() => downloadText(mouText, 'MOU.txt')}
                      disabled={!mouText}
                      variant="outline" 
                      className="flex-1"
                    >
                      Download MOU
                    </Button>
                  </div>
                </div>

                {/* HomeHNI Certificate & Totals */}
                <div className="h-full flex flex-col">
                  <h3 className="text-foreground font-medium mb-4">HomeHNI Certificate & Totals</h3>
                  
                  <Textarea
                    placeholder="Certificate text..."
                    value={certText}
                    onChange={(e) => setCertText(e.target.value)}
                    className="h-64 mb-4 flex-1"
                  />
                  
                  <div className="flex gap-2 mb-4">
                    <Button 
                      onClick={generateCertificate} 
                      className="flex-1"
                    >
                      Generate Certificate
                    </Button>
                    <Button 
                      onClick={() => downloadText(certText, 'Certificate.txt')}
                      disabled={!certText}
                      variant="outline" 
                      className="flex-1"
                    >
                      Download Certificate
                    </Button>
                  </div>

                  <Card className="bg-accent/10">
                    <CardContent className="p-3">
                      <div className="text-foreground font-medium text-right">
                        Quoted Price + Commission (1%): <span className="text-brand-red">₹ {quotedPrice}</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};