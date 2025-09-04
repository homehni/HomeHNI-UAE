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
  const [buyerPropertyId, setBuyerPropertyId] = useState('HNI123456');
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
    setBuyerPropertyId('HNI123456');
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
    <div className="min-h-screen bg-slate-900">
      <Marquee />
      <Header />
      
      <div className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">HomeHNI — Matched Property Dashboard</h1>
            <p className="text-slate-400">Two vertical panels • One horizontal Deal Room</p>
          </div>

          {/* Top Panels - Buyer and Seller */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Buyer Panel */}
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <span className="text-blue-400">Buyer Panel</span>
                  <span className="text-slate-400">Property ID</span>
                </h2>
                <span className="text-yellow-400 font-mono">{buyerPropertyId}</span>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm text-slate-400 mb-1 block">Buyer Login ID</label>
                  <Input
                    placeholder="BUY-XXXX"
                    value={buyerLoginId}
                    onChange={(e) => setBuyerLoginId(e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                  />
                </div>

                <div>
                  <label className="text-sm text-slate-400 mb-1 block">Matched Property (Auto)</label>
                  <Textarea
                    placeholder="Not found for this Property ID"
                    value={buyerMatchedProperty}
                    onChange={(e) => setBuyerMatchedProperty(e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white placeholder-slate-400 h-20"
                  />
                </div>

                <div>
                  <label className="text-sm text-slate-400 mb-1 block">Buyer Required Doc Type</label>
                  <Select value={buyerDocType} onValueChange={setBuyerDocType}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      <SelectItem value="ID Proof">ID Proof</SelectItem>
                      <SelectItem value="Address Proof">Address Proof</SelectItem>
                      <SelectItem value="Income Proof">Income Proof</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm text-slate-400 mb-1 block">Upload Buyer Document Snapshot</label>
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1 bg-slate-700 border-slate-600 text-white hover:bg-slate-600">
                      <Upload className="h-4 w-4 mr-2" />
                      Choose Files
                    </Button>
                    <span className="text-slate-400 text-sm self-center">No file chosen</span>
                  </div>
                </div>

                <div>
                  <label className="text-sm text-slate-400 mb-1 block">Buyer Notes</label>
                  <Textarea
                    placeholder="Any notes or constraints..."
                    value={buyerNotes}
                    onChange={(e) => setBuyerNotes(e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white placeholder-slate-400 h-16"
                  />
                </div>

                <div className="flex gap-2">
                  <Button onClick={saveBuyer} className="flex-1 bg-green-600 hover:bg-green-700 text-white">
                    Save Buyer
                  </Button>
                  <Button onClick={clearBuyer} variant="outline" className="flex-1 bg-slate-700 border-slate-600 text-white hover:bg-slate-600">
                    Clear
                  </Button>
                </div>
              </div>
            </div>

            {/* Seller Panel */}
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <span className="text-green-400">Seller Panel</span>
                  <span className="text-slate-400">Seller Login ID</span>
                </h2>
                <span className="text-yellow-400 font-mono">{sellerPropertyId}</span>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm text-slate-400 mb-1 block">Matched Property (Auto)</label>
                  <Textarea
                    placeholder="Not found for this Property ID"
                    value={sellerMatchedProperty}
                    onChange={(e) => setSellerMatchedProperty(e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white placeholder-slate-400 h-20"
                  />
                </div>

                <div>
                  <label className="text-sm text-slate-400 mb-1 block">Quoted Details by Property Agent</label>
                  <div className="text-slate-400 text-sm mb-2">Commission (1%) — Auto</div>
                  <Input
                    placeholder="₹ 0"
                    value={`₹ ${commission}`}
                    onChange={(e) => setCommission(e.target.value.replace('₹ ', ''))}
                    className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                  />
                </div>

                <div>
                  <label className="text-sm text-slate-400 mb-1 block">Seller Required Doc Type</label>
                  <Select value={sellerDocType} onValueChange={setSellerDocType}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      <SelectItem value="Title Deed">Title Deed</SelectItem>
                      <SelectItem value="Sale Deed">Sale Deed</SelectItem>
                      <SelectItem value="Encumbrance Certificate">Encumbrance Certificate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm text-slate-400 mb-1 block">Benefits after Commission</label>
                  <div className="text-green-400 text-sm">Verified tag, discounts, priority support</div>
                </div>

                <div>
                  <label className="text-sm text-slate-400 mb-1 block">Upload Seller Document Snapshot</label>
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1 bg-slate-700 border-slate-600 text-white hover:bg-slate-600">
                      <Upload className="h-4 w-4 mr-2" />
                      Choose Files
                    </Button>
                    <span className="text-slate-400 text-sm self-center">No file chosen</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button onClick={saveSeller} className="flex-1 bg-green-600 hover:bg-green-700 text-white">
                    Save Seller
                  </Button>
                  <Button onClick={clearSeller} variant="outline" className="flex-1 bg-slate-700 border-slate-600 text-white hover:bg-slate-600">
                    Clear
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Deal Room - Horizontal Panel */}
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-white mb-2">Deal Room</h2>
              <p className="text-slate-400 text-sm">Shared chat, services, required docs, MOU & certificate</p>
            </div>

            {/* Chat Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div>
                <h3 className="text-white font-medium mb-4">Buyer Chat</h3>
                <Textarea
                  placeholder="Type message to seller..."
                  value={buyerMessage}
                  onChange={(e) => setBuyerMessage(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white placeholder-slate-400 h-32 mb-4"
                />
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1 bg-slate-700 border-slate-600 text-white hover:bg-slate-600">
                    <Upload className="h-4 w-4 mr-2" />
                    Choose Files
                  </Button>
                  <span className="text-slate-400 text-sm self-center">No file chosen</span>
                </div>
                <Button 
                  onClick={() => sendMessage('buyer')} 
                  className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white"
                >
                  Send as Buyer
                </Button>
              </div>

              <div>
                <h3 className="text-white font-medium mb-4">Seller Chat</h3>
                <Textarea
                  placeholder="Type message to buyer..."
                  value={sellerMessage}
                  onChange={(e) => setSellerMessage(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white placeholder-slate-400 h-32 mb-4"
                />
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1 bg-slate-700 border-slate-600 text-white hover:bg-slate-600">
                    <Upload className="h-4 w-4 mr-2" />
                    Choose Files
                  </Button>
                  <span className="text-slate-400 text-sm self-center">No file chosen</span>
                </div>
                <Button 
                  onClick={() => sendMessage('seller')} 
                  className="w-full mt-4 bg-cyan-600 hover:bg-cyan-700 text-white"
                >
                  Send as Seller
                </Button>
              </div>
            </div>

            {/* Service Tracker & Required Documents */}
            <div className="mb-8">
              <h3 className="text-white font-medium mb-4">Service Tracker & Required Documents</h3>
              <p className="text-slate-400 text-sm mb-4">Add price, durations, descend and upload snapshots per service.</p>
              
              <div className="bg-slate-700 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-slate-600">
                    <tr className="text-left">
                      <th className="p-3 text-white font-medium">Service</th>
                      <th className="p-3 text-white font-medium">Required Doc</th>
                      <th className="p-3 text-white font-medium">Price (₹)</th>
                      <th className="p-3 text-white font-medium">Duration</th>
                      <th className="p-3 text-white font-medium">Status</th>
                      <th className="p-3 text-white font-medium">Upload Snapshot</th>
                    </tr>
                  </thead>
                  <tbody>
                    {services.map((service, index) => (
                      <tr key={index} className="border-t border-slate-600">
                        <td className="p-3 text-white">{service.name}</td>
                        <td className="p-3 text-slate-300">{service.requiredDoc}</td>
                        <td className="p-3">
                          <Input
                            type="number"
                            value={service.price}
                            onChange={(e) => updateServicePrice(index, parseFloat(e.target.value) || 0)}
                            className="w-20 bg-slate-600 border-slate-500 text-white text-sm"
                          />
                        </td>
                        <td className="p-3 text-slate-300 text-sm">{service.duration}</td>
                        <td className="p-3">
                          <Select
                            value={service.status}
                            onValueChange={(value: Service['status']) => updateServiceStatus(index, value)}
                          >
                            <SelectTrigger className="w-24 bg-slate-600 border-slate-500 text-white text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-600 border-slate-500">
                              <SelectItem value="Pending">Pending</SelectItem>
                              <SelectItem value="Ongoing">Ongoing</SelectItem>
                              <SelectItem value="Done">Done</SelectItem>
                              <SelectItem value="Optional">Optional</SelectItem>
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="p-3">
                          <Button variant="outline" size="sm" className="bg-slate-600 border-slate-500 text-white hover:bg-slate-500 text-xs">
                            Choose Files
                          </Button>
                        </td>
                      </tr>
                    ))}
                    <tr className="border-t-2 border-slate-500 bg-slate-650">
                      <td colSpan={2} className="p-3 text-white font-medium">Services Total</td>
                      <td className="p-3 text-yellow-400 font-bold">₹ {servicesTotal.toLocaleString()}</td>
                      <td colSpan={3}></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* MOU and Certificate Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Create MOU */}
              <div>
                <h3 className="text-white font-medium mb-4">Create MOU</h3>
                <div className="space-y-3 mb-4">
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      placeholder="Buyer Name"
                      value={mouBuyerName}
                      onChange={(e) => setMouBuyerName(e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white placeholder-slate-400 text-sm"
                    />
                    <Input
                      placeholder="Buyer Phone"
                      value={mouBuyerPhone}
                      onChange={(e) => setMouBuyerPhone(e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white placeholder-slate-400 text-sm"
                    />
                  </div>
                  <Input
                    placeholder="Buyer Address"
                    value={mouBuyerAddress}
                    onChange={(e) => setMouBuyerAddress(e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white placeholder-slate-400 text-sm"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      placeholder="Seller/Provider Name"
                      value={mouSellerName}
                      onChange={(e) => setMouSellerName(e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white placeholder-slate-400 text-sm"
                    />
                    <Input
                      placeholder="Seller/Provider Phone"
                      value={mouSellerPhone}
                      onChange={(e) => setMouSellerPhone(e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white placeholder-slate-400 text-sm"
                    />
                  </div>
                  <Input
                    placeholder="Seller Address"
                    value={mouSellerAddress}
                    onChange={(e) => setMouSellerAddress(e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white placeholder-slate-400 text-sm"
                  />
                </div>
                
                <Textarea
                  placeholder="MOU draft will appear here..."
                  value={mouText}
                  onChange={(e) => setMouText(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white placeholder-slate-400 h-32 mb-4"
                />
                
                <div className="flex gap-2">
                  <Button 
                    onClick={generateMOU} 
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  >
                    Generate MOU
                  </Button>
                  <Button 
                    onClick={() => downloadText(mouText, 'MOU.txt')}
                    disabled={!mouText}
                    variant="outline" 
                    className="flex-1 bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
                  >
                    Download MOU
                  </Button>
                </div>
              </div>

              {/* HomeHNI Certificate & Totals */}
              <div>
                <h3 className="text-white font-medium mb-4">HomeHNI Certificate & Totals</h3>
                
                <Textarea
                  placeholder="Certificate text..."
                  value={certText}
                  onChange={(e) => setCertText(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white placeholder-slate-400 h-40 mb-4"
                />
                
                <div className="flex gap-2 mb-4">
                  <Button 
                    onClick={generateCertificate} 
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  >
                    Generate Certificate
                  </Button>
                  <Button 
                    onClick={() => downloadText(certText, 'Certificate.txt')}
                    disabled={!certText}
                    variant="outline" 
                    className="flex-1 bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
                  >
                    Download Certificate
                  </Button>
                </div>

                <div className="bg-slate-700 rounded p-3">
                  <div className="text-white font-medium text-right">
                    Quoted Price + Commission (1%): <span className="text-yellow-400">₹ {quotedPrice}</span>
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