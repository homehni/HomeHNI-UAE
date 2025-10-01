// Email Service for HomeHNI - Handles all automated email notifications
export const EMAIL_API_BASE = 'https://email-system-hni.vercel.app';
export const EMAIL_API_KEY = 'MyNew$uper$ecretKey2025';

const sendEmail = async (endpoint: string, data: any) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12000); // 12s timeout to avoid hanging UI

  try {
    const response = await fetch(`${EMAIL_API_BASE}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': EMAIL_API_KEY
      },
      body: JSON.stringify(data),
      signal: controller.signal,
    });

    let result: any = null;
    try {
      result = await response.json();
    } catch {
      // In case of empty or non-JSON response
      result = { ok: response.ok, status: response.status };
    }

    console.log(`Email sent successfully via ${endpoint}:`, result);
    return { success: true, result };
  } catch (error) {
    console.error(`Email failed for ${endpoint}:`, error);
    return { success: false, error };
  } finally {
    clearTimeout(timeoutId);
  }
};

// 1. Welcome Email - Send after successful signup
export async function sendWelcomeEmail(userEmail: string, userName?: string) {
  return sendEmail('/send-welcome-email', {
    to: userEmail,
    userName: userName || 'there'
  });
}

// 2. Property Listing Live Email - Send after property submission
export async function sendListingLiveEmail(
  userEmail: string, 
  userName: string, 
  propertyData: {
    price: string;
    bhkDetails: string;
    locality: string;
    phone: string;
    id: string;
  }
) {
  return sendEmail('/send-listing-live-email', {
    to: userEmail,
    userName: userName || 'there',
    price: propertyData.price,
    bhkDetails: propertyData.bhkDetails,
    locality: propertyData.locality,
    phone: propertyData.phone,
    propertyUrl: `https://homehni.com/property/${propertyData.id}`
  });
}

// 3. Price Suggestions Email - Send after price analysis
export async function sendPriceSuggestionsEmail(
  userEmail: string, 
  userName: string, 
  priceData: {
    locality: string;
    rangeMin: number;
    rangeMax: number;
    yourPrice: number;
    propertyType?: string;
    listingType?: string;
    userType?: string;
  }
) {
  return sendEmail('/send-price-suggestions-email', {
    to: userEmail,
    userName: userName || 'there',
    locality: priceData.locality,
    rangeMin: priceData.rangeMin,
    rangeMax: priceData.rangeMax,
    yourPrice: priceData.yourPrice,
    propertyType: priceData.propertyType || 'residential',
    listingType: priceData.listingType || 'sell',
    userType: priceData.userType || 'seller',
    updatePriceUrl: 'https://homehni.com/dashboard'
  });
}

// 4. Loan Enquiry Email - Send after loan form submission
export async function sendLoanEnquiryEmail(userEmail: string, userName?: string) {
  return sendEmail('/send-loan-enquiry-email', {
    to: userEmail,
    userName: userName || 'there',
    loanEligibilityUrl: 'https://homehni.com/loan-eligibility'
  });
}

// 5. Plan Activated Email - Send after premium plan purchase
export async function sendPlanActivatedEmail(
  userEmail: string, 
  userName: string, 
  planData: {
    expiryDate: string;
  }
) {
  return sendEmail('/send-plan-activated-email', {
    to: userEmail,
    userName: userName || 'there',
    startUsingPlanUrl: 'https://homehni.com/dashboard',
    planExpiryDate: planData.expiryDate
  });
}

// 6. Plan Upgrade Email - Send for upgrade suggestions
export async function sendPlanUpgradeEmail(userEmail: string, userName?: string) {
  return sendEmail('/send-plan-upgrade-email', {
    to: userEmail,
    userName: userName || 'there',
    upgradePlanUrl: 'https://homehni.com/upgrade'
  });
}

// 7. Deal Closed Email - Send when property is marked as sold/rented
export async function sendDealClosedEmail(
  userEmail: string, 
  userName: string, 
  dealData: {
    locality: string;
    dealType: 'rent' | 'sale';
  }
) {
  return sendEmail('/send-deal-closed-email', {
    to: userEmail,
    userName: userName || 'there',
    locality: dealData.locality,
    dealType: dealData.dealType,
    postDealServicesUrl: 'https://homehni.com/services'
  });
}

// 8. Help Request Email - Send when user requests help with property posting
export async function sendHelpRequestEmail(
  userEmail: string, 
  userName: string,
  requestData?: {
    propertyType?: string;
    phone?: string;
  }
) {
  return sendEmail('/send-help-request-email', {
    to: userEmail,
    userName: userName || 'there',
    propertyType: requestData?.propertyType || 'property',
    phone: requestData?.phone || '',
    dashboardUrl: 'https://homehni.com/dashboard'
  });
}

// 9. Freshly Painted Homes Email - Send when user selects freshly painted option
export async function sendFreshlyPaintedEmail(
  userEmail: string,
  userName: string,
  propertyType?: string,
  locality?: string,
  budget?: string
) {
  return sendEmail('/send-freshly-painted-email', {
    to: userEmail,
    userName: userName || 'there',
    propertyType: propertyType || '',
    locality: locality || '',
    budget: budget || '',
    servicesUrl: 'https://homehni.com/services'
  });
}

// 9b. Deep Cleaning Service Email - Send when user selects deep cleaning option  
export async function sendDeepCleaningEmail(
  userEmail: string,
  userName: string,
  propertyType?: string,
  locality?: string,
  budget?: string
) {
  return sendEmail('/send-deep-cleaning-email', {
    to: userEmail,
    userName: userName || 'there',
    propertyType: propertyType || '',
    locality: locality || '',
    budget: budget || '',
    servicesUrl: 'https://homehni.com/services'
  });
}

// 10. Property Submitted Email - Send when property is submitted for review
export async function sendPropertySubmittedEmail(
  userEmail: string, 
  userName: string,
  propertyData: {
    propertyType: 'rent' | 'sale';
    locality: string;
    propertyId: string;
  }
) {
  return sendEmail('/send-property-submitted-email', {
    to: userEmail,
    userName: userName || 'there',
    propertyType: propertyData.propertyType,
    locality: propertyData.locality,
    dashboardUrl: 'https://homehni.com/dashboard',
    propertyUrl: `https://homehni.com/property/${propertyData.propertyId}`
  });
}

// 11. Property Rejected Email - Send when admin rejects property
export async function sendPropertyRejectedEmail(
  userEmail: string, 
  userName: string,
  rejectionData: {
    rejectionReason: string;
    propertyId: string;
    locality: string;
  }
) {
  return sendEmail('/send-property-rejected-email', {
    to: userEmail,
    userName: userName || 'there',
    rejectionReason: rejectionData.rejectionReason,
    resubmitUrl: 'https://homehni.com/post-property',
    supportUrl: 'https://homehni.com/contact'
  });
}

// 12. Show Interest Email - Send when user shows interest in premium features
export async function sendShowInterestEmail(
  userEmail: string, 
  userName: string,
  interestData: {
    propertyType?: string;
    phone?: string;
  }
) {
  return sendEmail('/send-help-request-email', {
    to: userEmail,
    userName: userName || 'there',
    propertyType: interestData.propertyType || 'property',
    phone: interestData.phone || ''
  });
}

// 13. Mark as Rented/Sold Email - Send when property status is updated
export async function sendMarkRentedSoldEmail(
  userEmail: string, 
  userName: string,
  statusData: {
    propertyTitle: string;
    status: 'rented' | 'sold';
    locality: string;
  }
) {
  return sendEmail('/send-mark-rented-sold-email', {
    to: userEmail,
    userName: userName || 'there',
    propertyTitle: statusData.propertyTitle,
    status: statusData.status,
    locality: statusData.locality,
    dashboardUrl: 'https://homehni.com/dashboard'
  });
}

// 14. Contact Owner Email - Send to property owner when contacted
export async function sendContactOwnerEmail(
  ownerEmail: string, 
  ownerName: string,
  contactData: {
    inquirerName: string;
    inquirerEmail: string;
    inquirerPhone: string;
    message: string;
    propertyTitle: string;
    propertyId: string;
    listingType?: string;
  }
) {
  return sendEmail('/send-contact-owner-email', {
    to: ownerEmail,
    userName: ownerName || 'Property Owner',
    propertyAddress: contactData.propertyTitle,
    propertyType: contactData.listingType || 'Property',
    interestedUserName: contactData.inquirerName,
    interestedUserEmail: contactData.inquirerEmail,
    interestedUserPhone: contactData.inquirerPhone,
    dashboardUrl: `https://homehni.com/dashboard/leads?propertyId=${contactData.propertyId}`
  });
}

// 15. Visit Scheduled Email - Send when visit is scheduled
export async function sendVisitScheduledEmail(
  ownerEmail: string, 
  ownerName: string,
  visitData: {
    visitorName: string;
    visitorEmail: string;
    visitorPhone: string;
    preferredDate: string;
    preferredTime: string;
    propertyTitle: string;
    propertyId: string;
  }
) {
  return sendEmail('/send-visit-scheduled-email', {
    to: ownerEmail,
    userName: ownerName || 'there',
    visitorName: visitData.visitorName,
    visitorEmail: visitData.visitorEmail,
    visitorPhone: visitData.visitorPhone,
    preferredDate: visitData.preferredDate,
    preferredTime: visitData.preferredTime,
    propertyTitle: visitData.propertyTitle,
    dashboardUrl: 'https://homehni.com/dashboard'
  });
}

// 16. Payment Success Email - Send after successful payment
export async function sendPaymentSuccessEmail(
  userEmail: string, 
  userName: string,
  paymentData: {
    planName: string;
    planType?: string;
    planDuration?: string;
    baseAmount?: number;
    gstAmount?: number;
    totalAmount?: number;
    amount: number;
    paymentId: string;
    transactionId?: string;
    paymentDate?: string;
    expiryDate: string;
    nextBillingDate?: string | null;
    dashboardUrl?: string;
  }
) {
  return sendEmail('/send-payment-success-email', {
    to: userEmail,
    userName: userName || 'Valued Customer',
    planName: paymentData.planName,
    planType: paymentData.planType || 'subscription',
    planDuration: paymentData.planDuration || '1 Month',
    baseAmount: paymentData.baseAmount || paymentData.amount,
    gstAmount: paymentData.gstAmount || 0,
    totalAmount: paymentData.totalAmount || paymentData.amount,
    amount: paymentData.amount,
    paymentId: paymentData.paymentId,
    transactionId: paymentData.transactionId || paymentData.paymentId,
    paymentDate: paymentData.paymentDate || new Date().toLocaleDateString('en-IN'),
    expiryDate: paymentData.expiryDate,
    nextBillingDate: paymentData.nextBillingDate,
    dashboardUrl: paymentData.dashboardUrl || 'https://homehni.com/dashboard'
  });
}

// 17. Payment Invoice Email - Send invoice after payment
export async function sendPaymentInvoiceEmail(
  userEmail: string, 
  userName: string,
  invoiceData: {
    invoiceNumber: string;
    planName: string;
    planType?: string;
    planDuration?: string;
    baseAmount?: number;
    gstAmount?: number;
    gstRate?: string;
    totalAmount?: number;
    amount: number;
    paymentDate: string;
    paymentId: string;
    paymentMethod?: string;
    currency?: string;
    customerName?: string;
    customerEmail?: string;
    customerPhone?: string;
    billingAddress?: {
      name: string;
      email: string;
      phone: string;
    };
    invoiceDownloadUrl?: string;
    dashboardUrl?: string;
  }
) {
  return sendEmail('/send-payment-invoice-email', {
    to: userEmail,
    userName: userName || 'Valued Customer',
    invoiceNumber: invoiceData.invoiceNumber,
    planName: invoiceData.planName,
    planType: invoiceData.planType || 'subscription',
    planDuration: invoiceData.planDuration || '1 Month',
    baseAmount: invoiceData.baseAmount || invoiceData.amount,
    gstAmount: invoiceData.gstAmount || 0,
    gstRate: invoiceData.gstRate || '18%',
    totalAmount: invoiceData.totalAmount || invoiceData.amount,
    amount: invoiceData.amount,
    paymentDate: invoiceData.paymentDate,
    paymentId: invoiceData.paymentId,
    transactionId: invoiceData.paymentId,
    paymentMethod: invoiceData.paymentMethod || 'Online Payment',
    currency: invoiceData.currency || 'INR',
    customerName: invoiceData.customerName || userName,
    customerEmail: invoiceData.customerEmail || userEmail,
    customerPhone: invoiceData.customerPhone || '',
    billingAddress: invoiceData.billingAddress || {
      name: userName || 'Valued Customer',
      email: userEmail,
      phone: ''
    },
    invoiceDownloadUrl: invoiceData.invoiceDownloadUrl || '',
    dashboardUrl: invoiceData.dashboardUrl || 'https://homehni.com/dashboard'
  });
}

// 18. Services Application Email - Send when user applies for any service
export async function sendServicesApplicationEmail(
  userEmail: string, 
  userName: string,
  serviceType: string
) {
  // Map service IDs to display names
  const serviceNames: { [key: string]: string } = {
    'loans': 'Loans Service',
    'home-security': 'Home Security Service',
    'packers-movers': 'Packers & Movers Service',
    'legal-services': 'Legal Service',
    'handover-services': 'Handover Service',
    'property-management': 'Property Management Service',
    'architects': 'Architects Service',
    'painting-cleaning': 'Painting & Cleaning Service',
    'interior-design': 'Interior Design Service'
  };

  const serviceName = serviceNames[serviceType] || serviceType || 'Premium Service';

  return sendEmail('/send-services-application-email', {
    to: userEmail,
    userName: userName || 'there',
    serviceType: serviceType,
    serviceName: serviceName,
    subject: `🎯 Thank You for Booking ${serviceName} - Home HNI`,
    // Template data for the email service
    templateData: {
      serviceName,
      contactWithin: '12 hours',
      propertiesUrl: 'https://homehni.com/properties',
      plansUrl: 'https://homehni.com/plans',
      whatsapp: '+91-9876543210',
      email: 'services@homehni.com',
      hours: '8 AM - 8 PM (Mon-Sun)'
    }
  });
}

// 19. Service Provider Email - Send when service provider applies
export async function sendServiceProviderEmail(
  userEmail: string,
  userName: string,
  providerData: {
    companyName: string;
    serviceType: string;
    phoneNumber: string;
    emailId: string;
    city: string;
  }
) {
  return sendEmail('/send-service-provider-email', {
    to: userEmail,
    userName: userName || 'Service Provider',
    companyName: providerData.companyName,
    serviceType: providerData.serviceType,
    phoneNumber: providerData.phoneNumber,
    emailId: providerData.emailId,
    city: providerData.city
  });
}

// 20. Career Application Email - Send when candidate applies
export async function sendCareerApplicationEmail(
  userEmail: string,
  userName: string,
  careerData: {
    phoneNumber: string;
    emailId: string;
    state: string;
    city: string;
    positionOfInterest: string;
  }
) {
  return sendEmail('/send-career-application-email', {
    to: userEmail,
    userName: userName || 'Candidate',
    phoneNumber: careerData.phoneNumber,
    emailId: careerData.emailId,
    state: careerData.state,
    city: careerData.city,
    positionOfInterest: careerData.positionOfInterest
  });
}

// 21. Corporate Enquiry Email - Send when corporate enquiry is submitted
export async function sendCorporateEnquiryEmail(
  userEmail: string,
  userName: string,
  corporateData: {
    companyName: string;
    phoneNumber: string;
    officialEmail: string;
    city: string;
    numberOfEmployees: string;
  }
) {
  return sendEmail('/send-corporate-enquiry-email', {
    to: userEmail,
    userName: userName || 'Corporate Partner',
    companyName: corporateData.companyName,
    phoneNumber: corporateData.phoneNumber,
    officialEmail: corporateData.officialEmail,
    city: corporateData.city,
    numberOfEmployees: corporateData.numberOfEmployees
  });
}

// 22. Grievance Redressal Email - Send when grievance is submitted
export async function sendGrievanceRedressalEmail(
  userEmail: string,
  userName: string,
  grievanceData: {
    emailId: string;
    contactNumber: string;
    urlOfPage?: string;
    platformSection: string;
    natureOfComplaint: string;
    complaintDetails?: string;
  }
) {
  return sendEmail('/send-grievance-redressal-email', {
    to: userEmail,
    userName: userName || 'Valued Customer',
    emailId: grievanceData.emailId,
    contactNumber: grievanceData.contactNumber,
    urlOfPage: grievanceData.urlOfPage,
    platformSection: grievanceData.platformSection,
    natureOfComplaint: grievanceData.natureOfComplaint,
    complaintDetails: grievanceData.complaintDetails
  });
}

// 23. Report Problem Email - Send when problem is reported
export async function sendReportProblemEmail(
  userEmail: string,
  userName: string,
  problemData: {
    emailId: string;
    feedbackType: string;
    feedbackDetails?: string;
  }
) {
  return sendEmail('/send-report-problem-email', {
    to: userEmail,
    userName: userName || 'User',
    emailId: problemData.emailId,
    feedbackType: problemData.feedbackType,
    feedbackDetails: problemData.feedbackDetails
  });
}