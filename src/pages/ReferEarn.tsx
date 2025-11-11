import { useEffect, useState } from "react";
import { Copy, Share2, Mail, MessageCircle, Users, DollarSign, Trophy, ChevronDown, ChevronUp } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Marquee from "@/components/Marquee";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import heroImage from "@/assets/refer-earn-hero.jpg";

const ReferEarn = () => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const referralLink = "https://homehni.com/ref/yourname";

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    setCopiedLink(true);
    toast({
      title: "Link Copied!",
      description: "Referral link has been copied to clipboard.",
    });
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const shareWhatsApp = () => {
    const message = `Join Home HNI and find the best home services! Use my referral link: ${referralLink}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  const shareEmail = () => {
    const subject = "Join Home HNI - Best Home Services Platform";
    const body = `Hi!\n\nI wanted to share Home HNI with you - it's an amazing platform for all home services like painting, cleaning, property rentals and more.\n\nUse my referral link to get started: ${referralLink}\n\nBest regards!`;
    window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank');
  };

  const scrollToReferralSection = () => {
    document.getElementById('referral-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const steps = [
    {
      step: "Step 1",
      title: "Share Your Link",
      description: "Share your referral link with friends and family through WhatsApp, email, or social media.",
      icon: <Share2 className="h-12 w-12 text-primary" />
    },
    {
      step: "Step 2", 
      title: "Friend Books Service",
      description: "They book or avail any service from Home HNI using your referral link.",
      icon: <Users className="h-12 w-12 text-primary" />
    },
    {
      step: "Step 3",
      title: "Earn Rewards",
      description: "You earn rewards or cashback instantly once they complete their transaction.",
      icon: <DollarSign className="h-12 w-12 text-primary" />
    }
  ];

  const benefits = [
    {
      icon: <DollarSign className="h-16 w-16 text-green-600" />,
      title: "Earn up to ₹500 per referral",
      description: "Get rewarded generously for every successful referral"
    },
    {
      icon: <Trophy className="h-16 w-16 text-yellow-600" />,
      title: "No limits on referrals",
      description: "Refer as many friends as you want and keep earning"
    },
    {
      icon: <Users className="h-16 w-16 text-blue-600" />,
      title: "Help friends find trusted services",
      description: "Connect your friends with reliable home service providers"
    }
  ];

  const faqs = [
    {
      question: "Who can refer others?",
      answer: "Anyone with a Home HNI account can refer friends and family to our platform. Simply sign up and start referring immediately."
    },
    {
      question: "How do I track my rewards?",
      answer: "You will receive updates via email and SMS whenever someone uses your referral link. You can also track all your rewards in your profile dashboard."
    },
    {
      question: "When do I receive the reward?",
      answer: "You will receive your referral reward within 48 hours after the referred person completes their first transaction on Home HNI."
    },
    {
      question: "What services qualify for referral rewards?",
      answer: "All services on Home HNI qualify for referral rewards including property bookings, painting services, cleaning services, legal services, and more."
    },
    {
      question: "Is there a maximum limit on earnings?",
      answer: "No, there's no maximum limit! You can refer unlimited friends and earn rewards for each successful referral."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Marquee />
      <Header />
      
      {/* Hero Section */}
      <section 
        className="relative h-96 bg-cover bg-center bg-no-repeat flex items-center justify-center text-center text-white pt-20"
        style={{ 
          backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.4)), url(${heroImage})`,
        }}
      >
        <div className="container mx-auto px-4 z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white drop-shadow-lg"
              style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
            Refer Your Friends. Earn Big Rewards!
          </h1>
          <p className="text-lg md:text-xl max-w-4xl mx-auto text-white drop-shadow-md"
             style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.7)' }}>
            Invite friends to Home HNI and get rewarded every time they avail a home service or book a property.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4">
        {/* How It Works Section */}
        <section className="py-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow p-6">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    {step.icon}
                  </div>
                  <div className="text-primary font-semibold text-sm mb-2">{step.step}</div>
                  <CardTitle className="text-xl">{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Referral Input Section */}
        <section id="referral-section" className="py-16 bg-muted/50 rounded-lg mb-16">
          <div className="max-w-2xl mx-auto text-center px-6">
            <h2 className="text-3xl font-bold text-foreground mb-8">
              Start Referring Now
            </h2>
            <div className="space-y-6">
              <div className="flex gap-2">
                <Input 
                  value={referralLink}
                  readOnly
                  className="flex-1 bg-background"
                />
                <Button 
                  onClick={copyToClipboard}
                  className="bg-primary hover:bg-primary/90 text-white px-6"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  {copiedLink ? "Copied!" : "Copy Link"}
                </Button>
              </div>
              
              <div className="flex justify-center gap-4">
                <Button 
                  onClick={shareWhatsApp}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Share via WhatsApp
                </Button>
                <Button 
                  onClick={shareEmail}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Share via Email
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12">
            Why Refer Home HNI?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center p-6">
                <div className="flex justify-center mb-6">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-bold text-foreground mb-4">
                  {benefit.title}
                </h3>
                <p className="text-muted-foreground">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQs Section */}
        <section className="py-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12">
            Frequently Asked Questions
          </h2>
          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index} className="cursor-pointer">
                <CardHeader 
                  onClick={() => toggleFaq(index)}
                  className="flex flex-row items-center justify-between space-y-0 pb-2"
                >
                  <CardTitle className="text-lg">{faq.question}</CardTitle>
                  {openFaq === index ? <ChevronUp /> : <ChevronDown />}
                </CardHeader>
                {openFaq === index && (
                  <CardContent>
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Start Referring and Earning Today!
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join thousands of users who are already earning through our referral program.
            </p>
            <Button 
              onClick={scrollToReferralSection}
              size="lg"
              className="bg-primary hover:bg-primary/90 text-white px-8 py-3 text-lg"
            >
              Refer Now
            </Button>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default ReferEarn;
