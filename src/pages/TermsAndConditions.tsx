import { useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Marquee from '@/components/Marquee';

const TermsAndConditions = () => {
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
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`,
              backgroundPosition: 'center center'
            }}
          ></div>
          {/* Overlay for better text readability */}
          <div className="absolute inset-0 bg-black/40"></div>
          {/* Title Overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white uppercase tracking-wide drop-shadow-2xl">
              Terms and Conditions
            </h1>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto prose prose-lg max-w-none">
            
            <section className="mb-12">
              <p className="text-gray-700 mb-4 leading-relaxed">
                These HomeHNI Platform Terms of Use (these "Terms of Use") tell you the rules for using the platform available at www.HomeHNI.ae and through any HomeHNI mobile application available from time to time (collectively, the "Platform"), as well as any information, content or materials published on, or available via, the Platform (collectively, the "Content").
              </p>
              <p className="text-gray-700 mb-4 leading-relaxed">
                These Terms of Use govern and condition access to, and use of, the Platform and its Content by each visitor to this Platform ("you").
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">WHO WE ARE AND HOW TO CONTACT US</h2>
              <p className="text-gray-700 mb-4 leading-relaxed">
                The Platform is operated and owned by HomeHNI ("HomeHNI", "we", "our", "us").
              </p>
              <p className="text-gray-700 mb-4 leading-relaxed">
                Our mailing address is at Dubai, United Arab Emirates (UAE).
              </p>
              <p className="text-gray-700 mb-4 leading-relaxed">
                To contact us about these Terms of Use or anything else relating to your use of this Platform, please email support@homehni.ae.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">BY USING THE PLATFORM, YOU ACCEPT THESE TERMS OF USE</h2>
              <p className="text-gray-700 mb-4 leading-relaxed">
                By accessing and continuing to use the Platform, you confirm that you accept these Terms of Use, and acknowledge and agree that these Terms of Use govern and condition your access to, and use of, the Platform and any Content.
              </p>
              <p className="text-gray-700 mb-4 leading-relaxed">
                You understand that these Terms of Use constitute a legally binding agreement between you and HomeHNI.
              </p>
              <p className="text-gray-700 mb-4 leading-relaxed">
                If you are using the Platform as a business entity or on behalf of a business entity, you represent that you have the authority to legally bind that entity.
              </p>
              <p className="text-gray-700 mb-4 leading-relaxed">
                If you do not agree to be bound by these Terms of Use, you may not access or use the Platform or any Content and should cease to do so immediately.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">WE MAY MAKE CHANGES TO THESE TERMS OF USE</h2>
              <p className="text-gray-700 mb-4 leading-relaxed">
                We may amend these Terms of Use from time to time, with or without notice to you. The new version of these Terms of Use will be made available on this page. If you are an existing registered user, we may also notify you of any material update to these Terms of Use via email (for example, where we are legally required to do so).
              </p>
              <p className="text-gray-700 mb-4 leading-relaxed">
                Every time you wish to use the Platform, please check these Terms of Use to ensure that you understand the terms and conditions that apply to the Platform and its Content at that time.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">WE MAY MAKE CHANGES TO THE PLATFORM</h2>
              <p className="text-gray-700 mb-4 leading-relaxed">
                We may change the way the Platform operates and/or change any Content from time to time without notice to you. This could be, for example, to reflect changes to the features and functionalities of the Platform, the state of current technology, or market practice, applicable laws or regulations and/or our business priorities.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">WE MAY SUSPEND OR WITHDRAW THE PLATFORM</h2>
              <p className="text-gray-700 mb-4 leading-relaxed">
                We do not guarantee that the Platform and/or any Content will always be available free of charge, or generally available. We may suspend or withdraw, or restrict the availability of, all or any part of the Platform for business and/or operational reasons.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">YOUR PRIVACY</h2>
              <p className="text-gray-700 mb-4 leading-relaxed">
                Please refer to our Privacy Policy to understand how we collect, process and share your personal data in relation to your use of the Platform.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">YOUR RIGHT TO USE THE PLATFORM AND THE CONTENT</h2>
              <p className="text-gray-700 mb-4 leading-relaxed">
                Subject to your continued compliance with these Terms of Use, HomeHNI grants you a personal, limited, non-transferable, non-exclusive, revocable right to use the Platform and the Content.
              </p>
              <p className="text-gray-700 mb-4 leading-relaxed">
                You may print off one (1) copy, and may download extracts, of any page(s) from the Platform for your personal use and you may draw the attention of others to Content available on the Platform. You must not modify the paper or digital copies of any materials you have printed off or downloaded in any way, and you must not use any illustrations, photographs, video or audio sequences or any graphics separately from any accompanying text. You must not use any part of the Content for commercial purposes without obtaining a licence to do so from us.
              </p>
              <p className="text-gray-700 mb-4 leading-relaxed">
                HomeHNI is the owner or the licensee of all rights (including intellectual property rights) in the Platform and any Content, including without limitation any designs, text, graphics and the selection and arrangement thereof. The Platform and the Content are protected by copyright laws and treaties around the world. All such rights are reserved.
              </p>
              <p className="text-gray-700 mb-4 leading-relaxed">
                All trademarks, logos, trade dress, service names and service marks ("Marks") displayed on the Platform are our property or the property of certain other third-parties. You are not permitted to use these Marks without our prior written consent.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">RESTRICTIONS</h2>
              <p className="text-gray-700 mb-4 leading-relaxed">You must not:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                <li>use the Platform if you are under the age of eighteen (18);</li>
                <li>use the Platform in any unlawful manner or for any unlawful purpose;</li>
                <li>attempt to gain unauthorised access to the Platform, the server on which the Platform is stored or any server, computer or database connected to the Platform;</li>
                <li>interfere with, damage or disrupt any part of the Platform or any Content, or any equipment or network on which the Platform or any Content is stored, or any software or other systems or equipment used in the provision of the Platform or any Content;</li>
                <li>knowingly introducing viruses, trojans, worms, logic bombs or other material that is malicious or technologically harmful to the Platform;</li>
                <li>impersonate any other person while using the Platform;</li>
                <li>conduct yourself in a vulgar, offensive, harassing or objectionable manner while using the Platform;</li>
                <li>use the Platform to generate unsolicited advertisements or spam;</li>
                <li>reproduce, duplicate, copy, sell, trade, resell or exploit for any commercial purpose all or any portion of the Platform or any Content;</li>
                <li>use manual methods or any software, devices, scripts, robots or any other means or processes (including so-called 'spiders', 'bots' and 'crawlers') to scrape the Platform and/or its Content, or otherwise create or compile (in single or multiple downloads) a collection, compilation, database or directory from the Platform or its Content, or bypass or seek to bypass any robot exclusion headers we may implement; or</li>
                <li>reverse-engineer, decompile, disassemble, decipher or otherwise attempt to derive the source code for the Platform and/or its Content.</li>
                </ul>
              <p className="text-gray-700 mb-4 leading-relaxed">
                We will report any breach of the restrictions listed above to the relevant law enforcement authorities and will cooperate with those authorities by disclosing your identity to them.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">ACCOUNT CREATION</h2>
              <p className="text-gray-700 mb-4 leading-relaxed">
                <strong>Account creation.</strong> Although you can browse the Platform as a guest, you will need to create an account (an "Account") in order to access certain features of the Platform. If you choose to register for an Account, you will have to provide certain information about yourself as prompted during the account registration process on the Platform.
              </p>
              <p className="text-gray-700 mb-4 leading-relaxed">
                <strong>Accurate and up-to-date information.</strong> If you do create an Account, all the registration information you submit should be truthful and accurate. If, for any reason, any information you submit is or becomes untruthful, inaccurate and/or incomplete, you should update that information to maintain its accuracy.
              </p>
              <p className="text-gray-700 mb-4 leading-relaxed">
                <strong>What to do if you want to delete your Account.</strong> You can request the deletion of your Account by emailing support@homehni.ae.
              </p>
              <p className="text-gray-700 mb-4 leading-relaxed">
                <strong>You are responsible for your Account.</strong> You are responsible for maintaining the confidentiality of your Account log-in information (including your password). Accordingly, you are responsible for all activities that occur under your Account.
              </p>
              <p className="text-gray-700 mb-4 leading-relaxed">
                <strong>Unauthorised use of your Account.</strong> You should notify us immediately if you suspect or become aware of any unauthorised use of your Account or any other breach of its security.
              </p>
              <p className="text-gray-700 mb-4 leading-relaxed">
                <strong>Privacy.</strong> All information you provide to create an Account (including all information you provide to obtain 'Verified' status) will be used in accordance with our Privacy Policy.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">PAID SERVICES</h2>
              <p className="text-gray-700 mb-4 leading-relaxed">
                HomeHNI may, from time to time, offer paid services on the Platform ("Paid Service"). For example, you may choose to pay a fee to ensure that your Listing is featured more prominently in search results on the Platform.
              </p>
              <p className="text-gray-700 mb-4 leading-relaxed">
                You acknowledge and agree that, in respect of each Paid Service:
                </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                <li>any fee paid by you for a Paid Service is non-refundable in all circumstances; and</li>
                <li>Paid Services are provided for your convenience, and do not guarantee that your Listing will be successful or result in any minimum number of leads for your Listing.</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">LISTINGS</h2>
              <p className="text-gray-700 mb-4 leading-relaxed">
                The Platform enables a user wishing to rent or sell a property (the "Owner") or the broker / real estate agent representing them (the "Agent") to advertise such property (each a "Listing") to other users of the Platform. A user who is interested in renting or purchasing the relevant property (the "Renter" or "Buyer", as applicable) may then contact the Owner or Agent (via the Listing) to obtain further information, arrange a viewing and/or make an offer.
              </p>
              <p className="text-gray-700 mb-4 leading-relaxed">
                <strong>If you are an Owner, you must:</strong>
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                <li>be legally permitted to advertise the property on the Platform;</li>
                <li>be the legal and registered owner of the property, or be legally permitted to rent or sell the property advertised on your Listing;</li>
                <li>if you advertise an 'off-plan' property, ensure that the project is registered with, and authorised by, the relevant real estate authority;</li>
                <li>include a complete and accurate description of the property on your Listing;</li>
                <li>only include one (1) property on any Listing, and you may not advertise multiple properties through a single Listing;</li>
                <li>only advertise properties that are currently available for lease or sale (as relevant);</li>
                <li>only advertise properties that can lawfully be leased or sold (as relevant), and subject to all applicable restrictions (such as restrictions on the number of occupiers);</li>
                <li>comply with all applicable laws and regulations in connection with your Listing; and</li>
                <li>act lawfully and in good faith in your dealings with Renters and Buyers.</li>
              </ul>
              <p className="text-gray-700 mb-4 leading-relaxed">
                <strong>If you are an Agent, you must:</strong>
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                <li>be legally permitted to advertise the property on the Platform;</li>
                <li>have authority from the relevant Owner to advertise the relevant property on the Platform;</li>
                <li>possess a valid licence from the relevant real estate authority to advertise properties on the Platform, and possess the relevant commercial licence(s) to practice this activity through the Platform;</li>
                <li>if you advertise an 'off-plan' property, ensure that the project is registered with, and authorised by, the relevant real estate authority;</li>
                <li>include a complete and accurate description of the property on your Listing;</li>
                <li>only include one (1) property on any Listing, and you may not advertise multiple properties through a single Listing;</li>
                <li>only advertise properties that are currently available for lease or sale (as relevant);</li>
                <li>only advertise properties that can lawfully be leased or sold (as relevant), and subject to all applicable restrictions (such as restrictions on the number of occupiers);</li>
                <li>comply with all applicable laws and regulations in connection with your Listing; and</li>
                <li>act lawfully and in good faith in your dealings with Renters and Buyers.</li>
                  </ul>
              <p className="text-gray-700 mb-4 leading-relaxed">
                <strong>If you are a Renter or a Buyer, you must:</strong>
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                <li>acknowledge that HomeHNI is not itself a real estate broker or agent;</li>
                <li>acknowledge that HomeHNI has no obligation to verify the veracity, accuracy or completeness of property listings, and you must conduct your own due diligence and must not rely on the contents of any Listing;</li>
                <li>be legally permitted to rent or purchase the relevant property through the Platform; and</li>
                <li>act lawfully and in good faith in your dealings with any Owner or Agent.</li>
                  </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">HOMEHNI IS NOT RESPONSIBLE FOR LISTINGS</h2>
              <p className="text-gray-700 mb-4 leading-relaxed">
                You acknowledge and agree that HomeHNI does not have an obligation to monitor, approve or moderate Listings or their content. We are not responsible for the Listings posted on the Platform.
              </p>
              <p className="text-gray-700 mb-4 leading-relaxed">
                If you wish to rent or purchase a property via the Platform, you will be contracting with the user who posted the relevant Listing, without HomeHNI's involvement.
              </p>
              <p className="text-gray-700 mb-4 leading-relaxed">
                Although HomeHNI is not responsible for Listings, we reserve the right to monitor Listings and to remove any Listing from the Platform if, in our sole opinion, a Listing is in breach of these Terms of Use.
              </p>
              <p className="text-gray-700 mb-4 leading-relaxed">
                In addition, HomeHNI does not guarantee that your Listing will reach your intended audience, result in any minimum number of leads and/or otherwise be successful.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">HOMEHNI IS NOT RESPONSIBLE FOR YOUR INTERACTIONS WITH OTHER USERS</h2>
              <p className="text-gray-700 mb-4 leading-relaxed">
                The Platform offers ways for users to connect (and in particular, a way for Owners and Agents to connect with Renters and Buyers). However, HomeHNI has no control over interactions between users of the Platform as such interactions happen outside of the Platform.
              </p>
              <p className="text-gray-700 mb-4 leading-relaxed">
                As such, you acknowledge and agree that HomeHNI is not responsible for your interactions with other users of the Platform. You are solely responsible for such interactions.
              </p>
              <p className="text-gray-700 mb-4 leading-relaxed">
                You are encouraged to be diligent and exercise caution when communicating with other users of the Platform, particularly when sharing sensitive personal information. You should not send any payments to another user of the Platform without appropriate documentation in place (such as an enforceable lease agreement or property sale agreement).
              </p>
              <p className="text-gray-700 mb-4 leading-relaxed">
                If you believe that you were the victim of fraud, you should contact the appropriate authorities (for example, the Police).
                </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">UPLOADING CONTENT TO THE PLATFORM</h2>
              <p className="text-gray-700 mb-4 leading-relaxed">
                Any content you upload to the Platform, including as part of a Listing, will be considered non-confidential and non-proprietary.
              </p>
              <p className="text-gray-700 mb-4 leading-relaxed">
                You retain all of your ownership rights in your content, but you are required to grant us and other users of the Platform a limited licence to use, store and copy that content and to distribute and make it available to third-parties. More specifically, you grant us a perpetual, worldwide, non-exclusive, royalty-free, transferable licence to use, reproduce, distribute, prepare derivative works of, display and perform that content in connection with the service provided on the Platform and to promote the Platform.
              </p>
              <p className="text-gray-700 mb-4 leading-relaxed">
                You are solely responsible for securing and backing up your content.
              </p>
              <p className="text-gray-700 mb-4 leading-relaxed">
                We have the right to disclose your identity to any third-party who claims that any content posted or uploaded by you to the Platform constitutes a violation of their intellectual property rights or of their right to privacy.
              </p>
              <p className="text-gray-700 mb-4 leading-relaxed">
                We reserve the right to remove any content posted or uploaded by you to the Platform with or without notice if, in our sole opinion, it does not comply with these Terms of Use.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">PROCESSING PAYMENTS</h2>
              <p className="text-gray-700 mb-4 leading-relaxed">
                We may, in certain circumstances, collect payments from you via the Platform (including when you choose to purchase Paid Services).
              </p>
              <p className="text-gray-700 mb-4 leading-relaxed">
                If that is the case, by providing us details of your payment method at checkout, you authorise us (acting through our chosen payment processor) to charge the relevant payment method for the amount displayed to you at checkout.
              </p>
              <p className="text-gray-700 mb-4 leading-relaxed">
                We will not be responsible for any losses you may suffer if the payment method you use to make a payment on the Platform does not have sufficient funds to cover the full value of such payment.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">OUR LIABILITY TO YOU</h2>
              <p className="text-gray-700 mb-4 leading-relaxed">
                We do not intend to exclude or limit in any way our liability to you where it would be unlawful to do so.
              </p>
              <p className="text-gray-700 mb-4 leading-relaxed">
                Subject to the above, our liability to you is limited as follows:
              </p>
              <p className="text-gray-700 mb-4 leading-relaxed">
                <strong>If you are using the Platform in a business or commercial capacity:</strong> We provide the Platform and the Content to you 'as is' and 'as available'. We exclude all implied conditions, warranties, representations or other terms that may apply to the Platform or any Content. We will not be liable to you for any loss or damage, whether in contract, tort (including negligence), breach of statutory duty or otherwise, even if foreseeable, arising under or in connection with your use of, or inability to use, the Platform, or your use of or reliance on any Content. In particular, we will not be liable to you for any: (i) loss of profits, sales, business or revenue; (ii) business interruption; (iii) loss of anticipated savings; (iv) loss of business opportunity, goodwill or reputation; (v) loss or corruption of data; or (vi) indirect or consequential loss or damage. We are also not liable to you for any loss or damage you suffer as a result of your interactions with other users of the Platform.
              </p>
              <p className="text-gray-700 mb-4 leading-relaxed">
                <strong>If you are using the Platform in a personal capacity:</strong> You acknowledge and agree that we only provide the Platform to you for domestic and private use. We do not guarantee the availability of the Platform, or that the Platform or any Content will be error-free or fit for any specific purpose. You agree not to use the Platform for any commercial or business purposes, and we have no liability to you for any loss of profit, loss of business, business interruption or loss of business opportunity. We are also not liable to you for any loss or damage you suffer as a result of your interactions with other users of the Platform. If we fail to comply with these Terms of Use, we are only responsible for loss or damage you suffer that is a foreseeable result of our breaching these Terms of Use or failing to act with reasonable care and skill.
              </p>
              <p className="text-gray-700 mb-4 leading-relaxed">
                In no event will HomeHNI's liability to you in connection with your use of the Platform or these Terms of Use, regardless of the cause of action or loss suffered by you, exceed the higher of: (i) the amount paid by you for the Paid Service which is the subject of the relevant dispute or claim (if any); or (ii) one thousand UAE Dirhams (AED 1,000).
                </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">BREACH OF THESE TERMS OF USE</h2>
              <p className="text-gray-700 mb-4 leading-relaxed">
                When we consider, in our sole opinion, that you are in breach of any part of these Terms of Use, we may take such action as we deem appropriate in our sole discretion, including without limitation suspending or withdrawing your right to use the Platform or its Content, closing your Account and/or taking legal action against you.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">REPORTING ILLEGAL OR INFRINGING CONTENT</h2>
              <p className="text-gray-700 mb-4 leading-relaxed">
                If you come across any Content on the Platform that you believe to be illegal, please contact us immediately at support@homehni.ae with full details of the illegal Content.
              </p>
              <p className="text-gray-700 mb-4 leading-relaxed">
                If you are the owner of intellectual property rights, or an agent who is fully authorised to act on behalf of the owner of intellectual property rights, and believe that any Content infringes upon your intellectual property right or the intellectual property rights of the owner on whose behalf you are authorised to act, please notify HomeHNI at support@homehni.ae with full details of the alleged infringement. We will use all reasonable efforts to remove any infringing Content from the Platform within a reasonable period of time.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">GENERAL</h2>
              <p className="text-gray-700 mb-4 leading-relaxed">
                <strong>Links to third-party sites or content.</strong> Where the Platform contains links to other websites and/or third-party content (including in Listings), these links are provided for your information and convenience only. Such links should not be interpreted as approval by us of those linked websites or any content you may obtain from them. We have no control over the contents of such third-party websites, and exclude all liability in that respect.
              </p>
              <p className="text-gray-700 mb-4 leading-relaxed">
                <strong>Rules about linking to the Platform.</strong> You may link to any page of the Platform or any specific Content, provided that you do so in a way that is fair and legal and does not damage our reputation or take advantage of it. The Platform must not be framed on any other website. You must not establish a link in such a way as to suggest any form of association, approval or endorsement on our part where none exists. We reserve the right to withdraw linking permission without notice.
              </p>
              <p className="text-gray-700 mb-4 leading-relaxed">
                <strong>Contact.</strong> You may contact us by emailing support@homehni.ae. If we need to contact you, we will write to the email address associated with your Account (if any).
              </p>
              <p className="text-gray-700 mb-4 leading-relaxed">
                <strong>We are not responsible for viruses.</strong> We do not guarantee that the Platform and the Content will be secure or free from bugs or viruses. You are responsible for configuring your device to access the Platform and the Content in a secure way. Where relevant, you should use your own virus protection software.
              </p>
              <p className="text-gray-700 mb-4 leading-relaxed">
                <strong>We are not liable for events outside our control.</strong> We will not be liable or responsible for any failure to perform, or delay in performance of, any of our obligations that is caused by events outside our reasonable control (each a "Force Majeure Event"). A Force Majeure Event includes any act, event, non-happening, omission or accident beyond our reasonable control. The performance of our obligations under these Terms of Use is deemed to be suspended for the period that the Force Majeure Event continues, and we will have an extension of time for performance for the duration of that period. We will use reasonable efforts to bring the Force Majeure Event to a close or to find a solution by which our obligations under these Terms of Use may be performed despite the Force Majeure Event.
              </p>
              <p className="text-gray-700 mb-4 leading-relaxed">
                <strong>Other agreements between you and HomeHNI.</strong> You may have entered into other agreements with HomeHNI or its affiliates, or may have accepted other terms and conditions governing the use of other services provided by HomeHNI or its affiliates. These Terms of Use apply in addition to any such agreements. In the event of any conflict or ambiguity between these Terms and any other agreement between you and HomeHNI or its affiliate, the provisions of these Terms will prevail (but only to the extent of such conflict or ambiguity).
              </p>
              <p className="text-gray-700 mb-4 leading-relaxed">
                <strong>We may transfer our rights and obligations.</strong> We may transfer our rights and obligations under these Terms of Use to another organisation. We will notify you in writing if this happens, and we will ensure that the transfer will not affect your rights under these Terms of Use.
              </p>
              <p className="text-gray-700 mb-4 leading-relaxed">
                <strong>Nobody else has any rights under these Terms of Use.</strong> These Terms of Use are between you and HomeHNI only, and no other person will have any rights to enforce or rely on any of its provisions.
              </p>
              <p className="text-gray-700 mb-4 leading-relaxed">
                <strong>Even if we delay enforcing our rights under these Terms of Use, we can still enforce them later.</strong> If we do not insist immediately that you do anything you are required to do under these Terms of Use, or if we delay taking steps against you in respect of your breaching these Terms of Use, that will not mean that you do not have to do those things and it will not prevent us taking steps against you at a later date.
              </p>
              <p className="text-gray-700 mb-4 leading-relaxed">
                <strong>If a court finds part of these Terms of Use illegal, the rest will continue in force.</strong> Each of the sections of these Terms of Use operates separately. If any court or relevant authority decides that any of them are unlawful, the remaining sections will remain in full force and effect.
              </p>
              <p className="text-gray-700 mb-4 leading-relaxed">
                <strong>Accessing the Platform from another territory.</strong> The Platform is directed to people residing in certain territories only. We cannot ensure that the Content available on or through the Platform is appropriate for use or available in locations we do not explicitly make the Platform available in, and cannot ensure that the Platform complies with the laws and regulations in territories we do not operate in.
              </p>
              <p className="text-gray-700 mb-4 leading-relaxed">
                <strong>Language.</strong> If these Terms of Use are translated into any other language and there is a discrepancy between the English text and the text in the other language, the English text version will prevail to the fullest extent permitted by applicable law.
              </p>
              <p className="text-gray-700 mb-4 leading-relaxed">
                <strong>Dispute resolution.</strong> If a dispute arises between you and HomeHNI, we strongly encourage you to first contact us directly to seek a resolution by emailing support@homehni.ae. We will review your complaint and do our best to address it. If a dispute between us cannot be resolved amicable, then to the fullest extent permitted by applicable law, these Terms of Use, their subject matter and their formation (and any non-contractual disputes or claims) are governed by the laws of the Dubai International Financial Centre ("DIFC") and will be interpreted accordingly. You irrevocably agree that the DIFC courts will have exclusive jurisdiction to settle any dispute or claim arising out of, or in connection with, your use of the Platform or these Terms of Use, and all matters arising from them (including any dispute relating to the existence, validity or termination of these Terms of Use, or any contractual or non-contractual obligation).
              </p>
            </section>

            <div className="mt-12 pt-8 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-500">
                Last updated: {new Date().toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default TermsAndConditions;
