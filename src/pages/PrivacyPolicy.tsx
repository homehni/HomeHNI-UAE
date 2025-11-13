import { useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Marquee from '@/components/Marquee';

const PrivacyPolicy = () => {
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
              Privacy Policy
            </h1>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto prose prose-lg max-w-none">
            
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">What does this privacy policy cover?</h2>
              <p className="text-gray-700 mb-4 leading-relaxed">
                Your privacy is extremely important to HomeHNI. We are committed to protecting your Personal Data (as that term is defined further below). We want to be transparent with you about how we collect and use your Personal Data in making our website and mobile applications ("Platform") available to you and tell you about your privacy rights and how the law protects you.
              </p>
              <p className="text-gray-700 mb-4 leading-relaxed">
                This Privacy Policy aims to give you information on how HomeHNI collects and processes your Personal Data through your use of this Platform.
              </p>
              <p className="text-gray-700 mb-4 leading-relaxed">
                By using the Platform, you agree to the collection, use and transfer of your Personal Data as set out in this Privacy Policy.
              </p>
              <p className="text-gray-700 mb-4 leading-relaxed">
                With that in mind, this Privacy Policy covers the following:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                <li>Who we are and how to contact us?</li>
                <li>Personal data we collect from you</li>
                <li>Personal data we collect from other sources</li>
                <li>How we use your personal data and why?</li>
                <li>Who we share your personal data with?</li>
                <li>How we keep your personal data secure</li>
                <li>How long we store your personal data?</li>
                <li>Your rights in relation to your personal data</li>
                <li>Marketing communications</li>
                <li>Our policy on children</li>
                <li>Third party links</li>
                <li>Changes to this privacy policy</li>
              </ul>
              <p className="text-gray-700 mb-4 leading-relaxed">
                We may revise this Privacy Policy from time to time, with or without notice to you. If that happens, the new version of this Privacy Policy will be made available on this page.
              </p>
              <p className="text-gray-700 mb-4 leading-relaxed">
                This Privacy Policy may be published in different languages. If that is the case and there are any inconsistencies between versions, the English language version will prevail.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Who we are and how to contact us?</h2>
              <p className="text-gray-700 mb-4 leading-relaxed">
                <strong>Who we are?</strong>
              </p>
              <p className="text-gray-700 mb-4 leading-relaxed">
                HomeHNI operates the Platform and is therefore the controller of your Personal Data (referred to as either "HomeHNI", "we", "us" or "our" in this Privacy Policy). Our address is Dubai, United Arab Emirates.
              </p>
              <p className="text-gray-700 mb-4 leading-relaxed">
                <strong>How to contact us?</strong>
              </p>
              <p className="text-gray-700 mb-4 leading-relaxed">
                You can contact us by emailing: privacy@homehni.ae.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Personal data we collect from you</h2>
              <p className="text-gray-700 mb-4 leading-relaxed">
                The Personal Data we collect directly from you is outlined in the table below.
              </p>
              <p className="text-gray-700 mb-4 leading-relaxed">
                "Personal Data" is information about an individual from which that individual is either directly identified or can be identified. It does not include 'anonymised data' (which is information where the identity of an individual has been permanently removed). However, it does include 'pseudonymised data' (which is information which alone doesn't identify an individual but, when combined with additional information, could be used to identify an individual). For the avoidance of doubt, information about properties that you have listed on the Platform does not constitute your Personal Data, as it cannot be used to identify you, and this Privacy Policy does not apply to such information.
              </p>
              
              <div className="overflow-x-auto mb-6">
                <table className="min-w-full border border-gray-300">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">Category of Personal Data</th>
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">What this means?</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-4 py-3 text-gray-700">Identity Data</td>
                      <td className="border border-gray-300 px-4 py-3 text-gray-700">First name, last name, username or similar identifier, profile photo, gender and age.</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-3 text-gray-700">Contact Data</td>
                      <td className="border border-gray-300 px-4 py-3 text-gray-700">Email address, physical address and telephone number(s).</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-3 text-gray-700">Location Data</td>
                      <td className="border border-gray-300 px-4 py-3 text-gray-700">Approximate location if you enable this feature via your device. This is used, for example, to help you search properties around you, or to verify a listing.</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-3 text-gray-700">Listings Data</td>
                      <td className="border border-gray-300 px-4 py-3 text-gray-700">Details about your previous and current listings on the Platform, as well as details of other users' listings that you have viewed. This includes (without limitation) listing information such as images, videos, virtual tours, pricing, property type, property history and general property description.</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-3 text-gray-700">Partial Payment Data</td>
                      <td className="border border-gray-300 px-4 py-3 text-gray-700">Partial credit card details may be retained on file if you need to make a payment through the Platform or otherwise to us. We do not retain your full payment data for security reasons.</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-3 text-gray-700">Marketing Data</td>
                      <td className="border border-gray-300 px-4 py-3 text-gray-700">Your preferences in receiving marketing messages from us.</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-3 text-gray-700">Chat Data</td>
                      <td className="border border-gray-300 px-4 py-3 text-gray-700">Details of messages that you exchange with us or other users of the Platform, for example via WhatsApp.</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-3 text-gray-700">Call Data</td>
                      <td className="border border-gray-300 px-4 py-3 text-gray-700">Recordings of calls between you and our teams, or between you and other users or Agents which you contact about a property through a form or link on the Platform, which are recorded for monitoring and training purposes.</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-3 text-gray-700">Behavioural Data</td>
                      <td className="border border-gray-300 px-4 py-3 text-gray-700">Inferred or assumed information relating to your behaviour and interests based on your activity on the Platform. This is most often collated and grouped into 'segments' on an aggregated basis.</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-3 text-gray-700">Technical Data</td>
                      <td className="border border-gray-300 px-4 py-3 text-gray-700">Internet protocol (IP) address, login data, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform and other technology on the devices you use to access this website or use our services.</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Aggregated data</h3>
              <p className="text-gray-700 mb-4 leading-relaxed">
                We also collect, use and share 'aggregated data', such as statistical or demographic data for a number of purposes. Aggregated data may be derived from your Personal Data, but once in aggregated form it will no longer constitute Personal Data as this data does not directly or indirectly reveal your identity. For example, we may aggregate your Behavioural Data to calculate the percentage of users accessing a specific Platform feature. However, if we combine or connect aggregated data with your Personal Data so that it can directly or indirectly identify you, we treat the combined data as Personal Data which will be used in accordance with this Privacy Policy.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Special categories of personal data</h3>
              <p className="text-gray-700 mb-4 leading-relaxed">
                We do not knowingly collect any 'special categories of personal data' about you (this includes, for example, details about your race or ethnicity, religious or philosophical beliefs, political opinions, information about your health, genetic and/or biometric data, and information about criminal offences and convictions).
              </p>
              <p className="text-gray-700 mb-4 leading-relaxed">
                We advise you not to share any of that data with us (for example, through our support chat function) or other users of the Platform (for example, through the user-to-user chat function). However, should you choose to share such data with us or other users of the Platform, you consent to us processing such data in accordance with this Privacy Policy.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">What happens if you refuse to provide necessary Personal Data?</h3>
              <p className="text-gray-700 mb-4 leading-relaxed">
                You do not have to provide any Personal Data to us. However, where we need to process your Personal Data either to grant you access to the Platform or to comply with applicable law, and you fail to provide that Personal Data when requested, we may not be able to provide you access to the Platform. For example, we need your email address in order to register your account on the Platform.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Personal data we collect from other sources</h2>
              <p className="text-gray-700 mb-4 leading-relaxed">
                In addition to the Personal Data that we collect directly from you (as described in the section immediately above this one), we also collect certain of your Personal Data from third party sources. These sources are set out in the table below.
              </p>
              
              <div className="overflow-x-auto mb-6">
                <table className="min-w-full border border-gray-300">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">Third Party Source</th>
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">Categories of Personal Data</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-4 py-3 text-gray-700">Social media platforms</td>
                      <td className="border border-gray-300 px-4 py-3 text-gray-700">Identity Data, Contact Data</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-3 text-gray-700">Our affiliates</td>
                      <td className="border border-gray-300 px-4 py-3 text-gray-700">Identity Data, Contact Data, Marketing Data</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-3 text-gray-700">Analytics providers</td>
                      <td className="border border-gray-300 px-4 py-3 text-gray-700">Behavioural Data, Technical Data</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-3 text-gray-700">Advertisers</td>
                      <td className="border border-gray-300 px-4 py-3 text-gray-700">Behavioural Data, Technical Data</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">How we use your personal data and why?</h2>
              <p className="text-gray-700 mb-4 leading-relaxed">
                We will only use your Personal Data for the purposes for which we collected it as listed below, unless we reasonably consider that we need to use it for another reason and that reason is compatible with the original purpose. If we need to use your Personal Data for an unrelated purpose, we will update this Privacy Policy and we will explain the legal basis which allows us to do so (please refer to the 'Changes to this Privacy Policy' section further below).
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">What is our 'legal basis' for processing your Personal Data?</h3>
              <p className="text-gray-700 mb-4 leading-relaxed">
                In respect of each of the purposes for which we use your Personal Data, applicable privacy laws require us to ensure that we have a 'legal basis' for that use. Most commonly, we will rely on one of the following legal bases:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                <li>Where we need to process your Personal Data to meet our contractual obligations to you (for example, to provide you access to the Platform) ("Contractual Necessity").</li>
                <li>Where we need to process your Personal Data to comply with our legal or regulatory obligations ("Compliance with Law").</li>
                <li>Where we have your consent to process your Personal Data for a specific purpose ("Consent").</li>
              </ul>
              <p className="text-gray-700 mb-4 leading-relaxed">
                We have set out below, in a table format, the legal bases we rely on when processing your Personal Data.
              </p>

              <div className="overflow-x-auto mb-6">
                <table className="min-w-full border border-gray-300">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">Purpose</th>
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">Categories of Personal Data</th>
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">Why we do this?</th>
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">Our legal basis</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-4 py-3 text-gray-700">Account creation</td>
                      <td className="border border-gray-300 px-4 py-3 text-gray-700">Identity Data, Contact Data</td>
                      <td className="border border-gray-300 px-4 py-3 text-gray-700">To register you as a user on the Platform and manage your user account.</td>
                      <td className="border border-gray-300 px-4 py-3 text-gray-700">Contractual Necessity</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-3 text-gray-700">Platform operation</td>
                      <td className="border border-gray-300 px-4 py-3 text-gray-700">Identity Data, Contact Data, Location Data, Listings Data, Chat Data, Call Data</td>
                      <td className="border border-gray-300 px-4 py-3 text-gray-700">To operate the Platform and enable your use of the Platform, including by allowing you to interact with other users of the Platform.</td>
                      <td className="border border-gray-300 px-4 py-3 text-gray-700">Contractual Necessity</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-3 text-gray-700">Enabling transactions</td>
                      <td className="border border-gray-300 px-4 py-3 text-gray-700">Identity Data, Contact Data, Listings Data, Chat Data, Call Data</td>
                      <td className="border border-gray-300 px-4 py-3 text-gray-700">To enable users of the Platform to search for properties and contact the relevant landlord or Agent, and to provide Agents with updates on properties advertised on the Platform.</td>
                      <td className="border border-gray-300 px-4 py-3 text-gray-700">Contractual Necessity</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-3 text-gray-700">Facilitating payments</td>
                      <td className="border border-gray-300 px-4 py-3 text-gray-700">Identity Data, Contact Data, Partial Payment Data</td>
                      <td className="border border-gray-300 px-4 py-3 text-gray-700">To facilitate payments through the Platform. We rely on third party payments processors to process payments, and do not have access to or retain your full payment data.</td>
                      <td className="border border-gray-300 px-4 py-3 text-gray-700">Contractual Necessity</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-3 text-gray-700">Analytics</td>
                      <td className="border border-gray-300 px-4 py-3 text-gray-700">Listings Data, Behavioural Data, Technical Data</td>
                      <td className="border border-gray-300 px-4 py-3 text-gray-700">To understand how you and other users use the Platform and to segment our userbase into groups for marketing purposes. To identify trends in property prices and compile data about property prices, which we may commercialise. All relevant data is aggregated and anonymised.</td>
                      <td className="border border-gray-300 px-4 py-3 text-gray-700">Contractual Necessity</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-3 text-gray-700">Marketing</td>
                      <td className="border border-gray-300 px-4 py-3 text-gray-700">Contact Data, Marketing Data</td>
                      <td className="border border-gray-300 px-4 py-3 text-gray-700">To send you marketing messages, where you have agreed to receive them.</td>
                      <td className="border border-gray-300 px-4 py-3 text-gray-700">Consent</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-3 text-gray-700">Troubleshooting</td>
                      <td className="border border-gray-300 px-4 py-3 text-gray-700">Technical Data</td>
                      <td className="border border-gray-300 px-4 py-3 text-gray-700">To track issues that might be occurring on our Platform and to address them.</td>
                      <td className="border border-gray-300 px-4 py-3 text-gray-700">Contractual Necessity</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-3 text-gray-700">Fraud Prevention</td>
                      <td className="border border-gray-300 px-4 py-3 text-gray-700">Identity Data, Contact Data</td>
                      <td className="border border-gray-300 px-4 py-3 text-gray-700">To keep our Platform and associated systems operational and secure.</td>
                      <td className="border border-gray-300 px-4 py-3 text-gray-700">Compliance with Law</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Who we share your personal data with?</h2>
              <p className="text-gray-700 mb-4 leading-relaxed">
                The table below describes who we may share your Personal Data with and why we share it.
              </p>
              <p className="text-gray-700 mb-4 leading-relaxed">
                We require all recipients of your Personal Data to implement appropriate security measures to adequately protect it, consistent with our policies and any data security obligations applicable to us. We do not permit our third party service providers who process your Personal Data on our behalf to use it for their own purposes, and only permit them to process your Personal Data for specified purposes in accordance with our instructions.
              </p>

              <div className="overflow-x-auto mb-6">
                <table className="min-w-full border border-gray-300">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">Recipients</th>
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">Why we share it?</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-4 py-3 text-gray-700">Other users of the Platform</td>
                      <td className="border border-gray-300 px-4 py-3 text-gray-700">We need to share some of your Personal Data with other users of the Platform when you wish to transact with them through the Platform. This may include Agents who have listed properties you are interested in, in which case several Agent representatives may have access to your Personal Data. For this purpose, "Agents" include estate agents, commercial agents, lettings agents, managing agents, property developers and/or property surveyors. By listing a property on the Platform, the relevant information and any Personal Data associated with your account profile (including your username and profile picture) will be publicly accessible to, and may be copied and shared externally by, all other users of our Platform. Such information may also appear in third party search engine results (for example, Google search results). Please ensure that you are comfortable with such information being publicly available before submitting it on our Platform.</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-3 text-gray-700">Lenders</td>
                      <td className="border border-gray-300 px-4 py-3 text-gray-700">If you choose to apply for a mortgage pre-approval or use our mortgage calculator, we may need to share some of your Personal Data with our banking partners.</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-3 text-gray-700">Service providers</td>
                      <td className="border border-gray-300 px-4 py-3 text-gray-700">Our affiliated companies may require access to your Personal Data as they help us operate the Platform and manage user data.</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-3 text-gray-700">Affiliates</td>
                      <td className="border border-gray-300 px-4 py-3 text-gray-700">If you choose to apply for a mortgage pre-approval or use our mortgage calculator, we may need to share some of your Personal Data with our banking partners.</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-3 text-gray-700">Professional advisers</td>
                      <td className="border border-gray-300 px-4 py-3 text-gray-700">Our lawyers, bankers, auditors, insurers and other advisers may require limited access to your Personal Data when they provide consultancy, banking, legal, insurance and accounting services to us.</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-3 text-gray-700">Public authorities</td>
                      <td className="border border-gray-300 px-4 py-3 text-gray-700">Public authorities may require us to disclose user data to them under certain circumstances, where required by law (for example, in the event of a police investigation).</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-3 text-gray-700">Acquirer(s)</td>
                      <td className="border border-gray-300 px-4 py-3 text-gray-700">We may share your Personal Data with third parties in the event of any reorganisation, merger, sale, joint venture, assignment, transfer or other disposition of all or any portion of our business, so that any potential acquirer(s) may continue operating the Platform. Where that is the case, we will ensure that any such recipient(s) continue to use your Personal Data in accordance with this Privacy Policy.</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Data transfers</h3>
              <p className="text-gray-700 mb-4 leading-relaxed">
                We may transfer your Personal Data to jurisdictions outside of the country in which you are located that may not be deemed to provide the same level of data protection as your home country, as necessary for the purposes set out in this Privacy Policy. We will always ensure that any such cross-border transfers of your Personal Data comply with applicable requirements.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">How we keep your data secure?</h2>
              <p className="text-gray-700 mb-4 leading-relaxed">
                We have put in place appropriate security measures to prevent your Personal Data from being accidentally lost or altered, or used or accessed in an unauthorised way.
              </p>
              <p className="text-gray-700 mb-4 leading-relaxed">
                We limit access to your Personal Data to those employees and other staff who have a business need to have such access. All such persons are subject to a contractual duty of confidentiality.
              </p>
              <p className="text-gray-700 mb-4 leading-relaxed">
                We have put in place procedures to deal with any actual or suspected Personal Data breach. In the event of any such breach, we have systems in place to mitigate any impact to your privacy and to work with relevant regulators.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">How long we store your personal data?</h2>
              <p className="text-gray-700 mb-4 leading-relaxed">
                We will only retain your Personal Data for as long as we reasonably need to use it for the purposes set out in this Privacy Policy, unless a longer retention period is required by applicable law (for example, for regulatory purposes).
              </p>
              <p className="text-gray-700 mb-4 leading-relaxed">
                Under some circumstances, we may anonymise your Personal Data so that it can no longer be associated with you. We may retain such anonymised data indefinitely.
              </p>
              <p className="text-gray-700 mb-4 leading-relaxed">
                Our data retention policies are reviewed at regular intervals and comply with all applicable requirements.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Your rights in relation to your personal data</h2>
              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Your rights</h3>
              <p className="text-gray-700 mb-4 leading-relaxed">
                Under some circumstances, you may have certain rights in relation to your Personal Data. For example, you may have the right to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                <li><strong>Request access to your Personal Data.</strong> This allows you to receive a copy of the Personal Data we hold about you, and to check that we are lawfully processing it.</li>
                <li><strong>Request the correction of your Personal Data.</strong> This allows you to ask for any incomplete or inaccurate information we hold about you to be corrected.</li>
                <li><strong>Request the erasure of your Personal Data.</strong> This allows you to ask us to delete or remove your Personal Data from our systems where there is no good reason for us to continue processing it.</li>
                <li><strong>Object to the processing of your Personal Data.</strong> This allows you to object to our processing of your Personal Data for a specific purpose (for example, for marketing purposes).</li>
                <li><strong>Request the transfer of your Personal Data.</strong> This allows you to request the transfer of your Personal Data in a structured, commonly-used, machine-readable format, either to you or to a third party designated by you.</li>
                <li><strong>Withdraw your Consent.</strong> This right only exists where we are relying on your Consent to process your Personal Data. If you withdraw your Consent, we may not be able to provide you with access to the certain features of our Platform. We will advise you if this is the case at the time you withdraw your Consent.</li>
              </ul>
              <p className="text-gray-700 mb-4 leading-relaxed">
                Please note that not all of the rights listed above may be available to you, and some rights may only be exercisable in specific circumstances.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">How to exercise your rights?</h3>
              <p className="text-gray-700 mb-4 leading-relaxed">
                If you want to exercise any of the rights described above, please contact us.
              </p>
              <p className="text-gray-700 mb-4 leading-relaxed">
                We may need to request specific information from you to help us confirm your identity and ensure your right to access your Personal Data (or to exercise any of your other rights). This is a security measure to ensure that your Personal Data is not disclosed to any person who has no right to receive it. We may also contact you to ask you for further information in relation to your request to speed up our response.
              </p>
              <p className="text-gray-700 mb-4 leading-relaxed">
                We try to respond to all legitimate requests within one month of receipt. Occasionally, it may take us longer than a month if your request is particularly complex or if you have made a number of requests. In this case, we will notify you and keep you updated.
              </p>
              <p className="text-gray-700 mb-4 leading-relaxed">
                Although we will typically not charge a fee for exercising your rights described above, we reserve the right to charge a reasonable fee in some circumstances (for example, if your request is unreasonable or if you submit an excessive number of requests).
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Complaints</h3>
              <p className="text-gray-700 mb-4 leading-relaxed">
                If you would like to make a complaint regarding this Privacy Policy or our practices in relation to your Personal Data, please contact us. We will reply to your complaint as soon as we can.
              </p>
              <p className="text-gray-700 mb-4 leading-relaxed">
                If you are unsatisfied with our response to any issue that you raise with us, you may have the right to submit a complaint to the data protection authority in your jurisdiction.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Marketing communications</h2>
              <p className="text-gray-700 mb-4 leading-relaxed">
                You can ask us to stop sending you marketing messages at any time by logging in to the Platform and checking or unchecking relevant boxes to adjust your marketing preferences, or by following the 'Unsubscribe' link included at the bottom of any marketing email you receive from us.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our policy on minors</h2>
              <p className="text-gray-700 mb-4 leading-relaxed">
                This Platform is not intended to be used by minors, and we do not actively monitor the age of our users.
              </p>
              <p className="text-gray-700 mb-4 leading-relaxed">
                However, if you become aware that a minor has been using the Platform in breach of this restriction, please contact us if you would like us to remove their Personal Data from our systems.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Third party links</h2>
              <p className="text-gray-700 mb-4 leading-relaxed">
                This Platform may include links to third party websites and applications. Clicking on those links will take you off-Platform and may allow third parties to collect or share your Personal Data. We do not control these third party websites and applications and are not responsible for their privacy practices. When you leave our Platform, we encourage you to read the privacy policy of every website and application you visit.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Changes to this privacy policy</h2>
              <p className="text-gray-700 mb-4 leading-relaxed">
                We reserve the right to update this Privacy Policy at any time, with or without notice to you.
              </p>
              <p className="text-gray-700 mb-4 leading-relaxed">
                Where that is the case, we will update this page to display the revised Privacy Policy and may also under certain circumstances notify you (for example, by email).
              </p>
              <p className="text-gray-700 mb-4 leading-relaxed">
                Any revisions to this Privacy Policy will be effective immediately once posted on this page.
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

export default PrivacyPolicy;
