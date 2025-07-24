import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Marquee from '@/components/Marquee';
import { Shield, AlertTriangle, FileText, Home, Phone } from 'lucide-react';
const Safety = () => {
  return <div className="min-h-screen bg-background">
      <Marquee />
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section 
          className="relative bg-cover bg-center bg-no-repeat text-white py-16 lg:py-24"
          style={{ backgroundImage: "url('/lovable-uploads/02059b14-d0f2-4231-af62-ec450cb13e82.png')" }}
        >
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex items-center justify-center text-xl md:text-2xl font-semibold">
                <AlertTriangle className="w-8 h-8 mr-3" />
                <span>Beware – Use Your Judgment Wisely</span>
              </div>
            </div>
          </div>
        </section>

        {/* Introduction */}
        <section className="py-12 lg:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center mb-8">
                <Shield className="w-12 h-12 mr-4 text-primary" />
                <h2 className="text-2xl md:text-3xl font-bold">Home Hni Safety Guide</h2>
              </div>
              <p className="text-lg text-muted-foreground leading-relaxed">
                At Home Hni, we are committed to promoting safe and transparent property transactions. However, users must exercise independent judgment when dealing with property listings, sellers, or brokers. Not all claims can be independently verified on our end. Below is a safety checklist we strongly recommend reviewing before making any property decisions—whether buying, renting, or investing.
              </p>
            </div>
          </div>
        </section>

        {/* Fraud Prevention */}
        <section className="py-12 lg:py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center mb-8">
                <div className="bg-destructive text-destructive-foreground p-3 rounded-full mr-4">
                  <AlertTriangle className="w-8 h-8" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold">How to Avoid Real Estate Fraud</h2>
              </div>
              
              <div className="grid gap-6 md:gap-8">
                {["Never send money via UPI, bank transfers, credit/debit cards to a so-called owner/landlord without meeting them in person.", "Do not pay property visit charges, gate pass fees, or token amounts over phone calls.", "If a broker is involved, ensure you speak directly with the actual property owner—preferably via video call if not in person.", "Avoid paying any part of the deal amount (rent or sale) to the broker.", "Be cautious of disputed land titles or distressed properties.", "Steer clear of schemes that promise unrealistic returns from real estate investment tied to upcoming infrastructure projects.", "Always visit the property physically and perform due diligence.", "Listings should include clear interior photos—bedrooms, bathrooms, and kitchen at the very least.", "Understand the neighbourhood before you rent or buy.", "Try to interact with neighbours to confirm that the person showing the property is its legitimate owner."].map((tip, index) => <div key={index} className="flex items-start bg-background p-4 md:p-6 rounded-lg shadow-sm border">
                    
                    <p className="text-foreground leading-relaxed">{tip}</p>
                  </div>)}
              </div>
            </div>
          </div>
        </section>

        {/* Buyers & Investors */}
        <section className="py-12 lg:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center mb-8">
                <div className="bg-primary text-primary-foreground p-3 rounded-full mr-4">
                  <FileText className="w-8 h-8" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold">For Buyers & Investors</h2>
              </div>
              
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                As a buyer or investor, it's your responsibility to validate the authenticity of a property, project, or builder—at your own cost and discretion. Home Hni facilitates listing and discovery but does not guarantee the truthfulness of content uploaded by third parties.
              </p>

              <h3 className="text-xl font-semibold mb-6">Key Buyer Checks:</h3>
              
              <div className="grid gap-4 md:gap-6">
                {["Perform a thorough ownership check to confirm the developer or owner's credentials.", "Visit the project site in person to ensure the property exists and matches descriptions.", "Choose developers with a solid track record—review their past projects and delivery timelines.", "Watch for false or forged documents; properties with long vacancy histories may have legal issues or loans against them.", "Conduct proper legal due diligence before entering any financial agreement.", "Understand what FSI/FAR covers—common areas like lobbies, pools, terraces, and parks are usually excluded.", "Check the applicability of the Real Estate (Regulation and Development) Act (RERA) on the project in question."].map((check, index) => <div key={index} className="flex items-start bg-primary/5 p-4 md:p-6 rounded-lg border border-primary/20">
                    
                    <p className="text-foreground leading-relaxed">{check}</p>
                  </div>)}
              </div>
            </div>
          </div>
        </section>

        {/* For Tenants */}
        <section className="py-12 lg:py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center mb-8">
                <div className="bg-secondary text-secondary-foreground p-3 rounded-full mr-4">
                  <Home className="w-8 h-8" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold">For Tenants</h2>
              </div>
              
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                If you're looking to rent, follow these steps to protect yourself:
              </p>

              <div className="grid gap-4 md:gap-6">
                {["Always visit the property and meet the landlord in person.", "NEVER pay property visit fees, gate pass charges, or advance amounts without visiting the place.", "Carefully inspect rooms—including kitchen and bathrooms—for leaks, dampness, or plumbing issues.", "Understand the local security deposit norms to avoid being overcharged.", "Verify safety, lighting, building access, and security features.", "Ensure all areas are listed and measured using standardized units."].map((step, index) => <div key={index} className="flex items-start bg-background p-4 md:p-6 rounded-lg shadow-sm border">
                    
                    <p className="text-foreground leading-relaxed">{step}</p>
                  </div>)}
              </div>
            </div>
          </div>
        </section>

        {/* Disclaimer */}
        <section className="py-12 lg:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold mb-6">📜 Disclaimer</h2>
              <div className="bg-muted/50 p-6 md:p-8 rounded-lg border">
                <p className="text-foreground leading-relaxed mb-4">
                  Home Hni is a premium real estate discovery platform that connects property seekers (buyers/tenants) with verified sellers/owners. While we ensure a curated experience, we do not act as real estate brokers or agents, nor can we independently verify every claim made in user-submitted listings.
                </p>
                <p className="text-foreground leading-relaxed">
                  We strongly recommend third-party legal, structural, and financial verification before finalizing any deal—regardless of whether a listing appears verified on our platform.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-12 lg:py-16 bg-gradient-to-br from-primary/10 to-secondary/10">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex items-center justify-center mb-8">
                <Phone className="w-12 h-12 mr-4 text-primary" />
                <h2 className="text-2xl md:text-3xl font-bold">Need Help?</h2>
              </div>
              
              <p className="text-lg text-muted-foreground mb-8">
                We're here to support you at every step. Contact us for queries or safety concerns:
              </p>

              <div className="grid md:grid-cols-2 gap-6 md:gap-8 text-left">
                <div className="bg-background p-6 rounded-lg shadow-sm border">
                  <h3 className="font-semibold mb-4">Contact Information</h3>
                  <div className="space-y-2">
                    <p><strong>Toll-Free (India):</strong> +91-[Home Hni Contact Number]</p>
                    <p><strong>Working Hours:</strong> 9:30 AM to 6:30 PM IST</p>
                    <p><strong>Email:</strong> support@homehni.com</p>
                  </div>
                </div>
                
                <div className="bg-background p-6 rounded-lg shadow-sm border">
                  <h3 className="font-semibold mb-4">Live Support</h3>
                  <p>Live Chat: Available on the website during business hours</p>
                </div>
              </div>

              <div className="mt-12 text-center">
                <p className="text-xl font-semibold text-primary mb-2">Stay informed. Stay cautious.</p>
                <p className="text-lg text-muted-foreground">Home Hni — Safe. Verified. Broker-Free.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>;
};
export default Safety;