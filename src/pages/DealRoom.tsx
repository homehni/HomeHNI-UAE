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

interface ChatMessage {
  sender: 'buyer' | 'seller';
  message: string;
  timestamp: Date;
}

interface Service {
  name: string;
  price: number;
  status: 'Pending' | 'Ongoing' | 'Done';
}

export const DealRoom: React.FC = () => {
  // Buyer state
  const [buyerName, setBuyerName] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');
  const [buyerLocation, setBuyerLocation] = useState('');
  const [buyerBudget, setBuyerBudget] = useState('');
  const [buyerNotes, setBuyerNotes] = useState('');

  // Seller state
  const [sellerName, setSellerName] = useState('');
  const [sellerPhone, setSellerPhone] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [quotedPrice, setQuotedPrice] = useState('');
  const [propertyLocation, setPropertyLocation] = useState('');

  // Chat state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [buyerMessage, setBuyerMessage] = useState('');
  const [sellerMessage, setSellerMessage] = useState('');

  // Services state
  const [services, setServices] = useState<Service[]>([
    { name: 'Legal Check', price: 5000, status: 'Pending' },
    { name: 'Registration', price: 3000, status: 'Pending' }
  ]);

  // MOU and Certificate state
  const [mouText, setMouText] = useState('');
  const [certText, setCertText] = useState('');

  const calculateCommission = (price: number) => {
    return (price * 0.01).toFixed(2);
  };

  const saveBuyer = () => {
    alert('Buyer details saved!');
  };

  const saveSeller = () => {
    alert('Seller details saved!');
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
    const price = parseFloat(quotedPrice) || 0;
    const mouContent = `MOU\nBuyer: ${buyerName}\nSeller: ${sellerName}\nPrice: ₹${price.toLocaleString()}\nTerms: Subject to agreement.`;
    setMouText(mouContent);
  };

  const generateCertificate = () => {
    const certContent = `HomeHNI Certified Deal\nBuyer: ${buyerName}\nSeller: ${sellerName}\nStatus: Completed.`;
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
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-brand-red">HomeHNI — 3-Part Deal Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              Manage your property deals with buyers, sellers, and service providers
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Buyer Panel */}
            <Card className="card-border">
              <CardHeader>
                <CardTitle className="text-brand-red">Buyer Panel</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="Buyer Name"
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                />
                <Input
                  placeholder="Buyer Phone"
                  value={buyerPhone}
                  onChange={(e) => setBuyerPhone(e.target.value)}
                />
                <Input
                  placeholder="Preferred Location"
                  value={buyerLocation}
                  onChange={(e) => setBuyerLocation(e.target.value)}
                />
                <Input
                  type="number"
                  placeholder="Budget (₹)"
                  value={buyerBudget}
                  onChange={(e) => setBuyerBudget(e.target.value)}
                />
                <Textarea
                  placeholder="Notes/Requirements"
                  value={buyerNotes}
                  onChange={(e) => setBuyerNotes(e.target.value)}
                />
                <Button onClick={saveBuyer} className="w-full">
                  Save Buyer
                </Button>
              </CardContent>
            </Card>

            {/* Seller Panel */}
            <Card className="card-border">
              <CardHeader>
                <CardTitle className="text-brand-red">Seller Panel</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="Seller/Agent Name"
                  value={sellerName}
                  onChange={(e) => setSellerName(e.target.value)}
                />
                <Input
                  placeholder="Seller Phone"
                  value={sellerPhone}
                  onChange={(e) => setSellerPhone(e.target.value)}
                />
                <Input
                  placeholder="Property Type"
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                />
                <Input
                  type="number"
                  placeholder="Quoted Price (₹)"
                  value={quotedPrice}
                  onChange={(e) => setQuotedPrice(e.target.value)}
                />
                <Input
                  placeholder="Commission (1%)"
                  value={quotedPrice ? `₹ ${calculateCommission(parseFloat(quotedPrice) || 0)}` : ''}
                  readOnly
                />
                <Textarea
                  placeholder="Property Address/Location"
                  value={propertyLocation}
                  onChange={(e) => setPropertyLocation(e.target.value)}
                />
                <Button onClick={saveSeller} className="w-full">
                  Save Seller
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Deal Room */}
          <Card className="card-border">
            <CardHeader>
              <CardTitle className="text-brand-red">Deal Room</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Chat Section */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Communication</h3>
                <div className="border rounded-lg p-4 h-48 overflow-y-auto bg-muted/20 mb-4">
                  {chatMessages.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">No messages yet</p>
                  ) : (
                    <div className="space-y-2">
                      {chatMessages.map((msg, index) => (
                        <div
                          key={index}
                          className={`p-3 rounded-lg ${
                            msg.sender === 'buyer' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant={msg.sender === 'buyer' ? 'default' : 'secondary'}>
                              {msg.sender.toUpperCase()}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {msg.timestamp.toLocaleTimeString()}
                            </span>
                          </div>
                          <p className="text-sm">{msg.message}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Buyer message"
                      value={buyerMessage}
                      onChange={(e) => setBuyerMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage('buyer')}
                    />
                    <Button onClick={() => sendMessage('buyer')}>Send</Button>
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Seller message"
                      value={sellerMessage}
                      onChange={(e) => setSellerMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage('seller')}
                    />
                    <Button onClick={() => sendMessage('seller')}>Send</Button>
                  </div>
                </div>
              </div>

              {/* Services Section */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Services</h3>
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="text-left p-4 font-medium">Service</th>
                        <th className="text-left p-4 font-medium">Price (₹)</th>
                        <th className="text-left p-4 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {services.map((service, index) => (
                        <tr key={index} className="border-t">
                          <td className="p-4">{service.name}</td>
                          <td className="p-4">
                            <Input
                              type="number"
                              value={service.price}
                              onChange={(e) => updateServicePrice(index, parseFloat(e.target.value) || 0)}
                              className="w-24"
                            />
                          </td>
                          <td className="p-4">
                            <Select
                              value={service.status}
                              onValueChange={(value: Service['status']) => updateServiceStatus(index, value)}
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Pending">Pending</SelectItem>
                                <SelectItem value="Ongoing">Ongoing</SelectItem>
                                <SelectItem value="Done">Done</SelectItem>
                              </SelectContent>
                            </Select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* MOU Section */}
              <div>
                <h3 className="text-lg font-semibold mb-4">MOU</h3>
                <Textarea
                  placeholder="Generated MOU will appear here..."
                  value={mouText}
                  onChange={(e) => setMouText(e.target.value)}
                  rows={6}
                />
                <div className="flex gap-2 mt-4">
                  <Button onClick={generateMOU}>Generate MOU</Button>
                  <Button 
                    variant="outline" 
                    onClick={() => downloadText(mouText, 'MOU.txt')}
                    disabled={!mouText}
                  >
                    Download MOU
                  </Button>
                </div>
              </div>

              {/* Certificate Section */}
              <div>
                <h3 className="text-lg font-semibold mb-4">HomeHNI Certificate</h3>
                <Textarea
                  placeholder="Certificate will appear here..."
                  value={certText}
                  onChange={(e) => setCertText(e.target.value)}
                  rows={6}
                />
                <div className="flex gap-2 mt-4">
                  <Button onClick={generateCertificate}>Generate Certificate</Button>
                  <Button 
                    variant="outline" 
                    onClick={() => downloadText(certText, 'Certificate.txt')}
                    disabled={!certText}
                  >
                    Download Certificate
                  </Button>
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