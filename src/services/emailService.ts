// Email Service for HomeHNI - Handles all automated email notifications
export const EMAIL_API_BASE = 'https://email-system-hni.vercel.app';
export const EMAIL_API_KEY = 'MyNew$uper$ecretKey2025';

const sendEmail = async (endpoint: string, data: any) => {
  try {
    const response = await fetch(`${EMAIL_API_BASE}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': EMAIL_API_KEY
      },
      body: JSON.stringify(data)
    });
    
    const result = await response.json();
    console.log(`Email sent successfully via ${endpoint}:`, result);
    return { success: true, result };
  } catch (error) {
    console.error(`Email failed for ${endpoint}:`, error);
    return { success: false, error };
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
  }
) {
  return sendEmail('/send-price-suggestions-email', {
    to: userEmail,
    userName: userName || 'there',
    locality: priceData.locality,
    rangeMin: priceData.rangeMin,
    rangeMax: priceData.rangeMax,
    yourPrice: priceData.yourPrice,
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
  userName: string
) {
  return sendEmail('/send-freshly-painted-email', {
    to: userEmail,
    userName: userName || 'there',
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
    propertyType: 'rent' | 'sale';
    feature: string;
  }
) {
  return sendEmail('/send-show-interest-email', {
    to: userEmail,
    userName: userName || 'there',
    propertyType: interestData.propertyType,
    feature: interestData.feature,
    upgradePlanUrl: 'https://homehni.com/upgrade'
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
  }
) {
  return sendEmail('/send-contact-owner-email', {
    to: ownerEmail,
    userName: ownerName || 'there',
    inquirerName: contactData.inquirerName,
    inquirerEmail: contactData.inquirerEmail,
    inquirerPhone: contactData.inquirerPhone,
    message: contactData.message,
    propertyTitle: contactData.propertyTitle,
    propertyUrl: `https://homehni.com/property/${contactData.propertyId}`,
    dashboardUrl: 'https://homehni.com/dashboard'
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
    amount: number;
    paymentId: string;
    expiryDate: string;
  }
) {
  return sendEmail('/send-payment-success-email', {
    to: userEmail,
    userName: userName || 'there',
    planName: paymentData.planName,
    amount: paymentData.amount,
    paymentId: paymentData.paymentId,
    expiryDate: paymentData.expiryDate,
    dashboardUrl: 'https://homehni.com/dashboard'
  });
}

// 17. Payment Invoice Email - Send invoice after payment
export async function sendPaymentInvoiceEmail(
  userEmail: string, 
  userName: string,
  invoiceData: {
    invoiceNumber: string;
    planName: string;
    amount: number;
    paymentDate: string;
    paymentId: string;
  }
) {
  return sendEmail('/send-payment-invoice-email', {
    to: userEmail,
    userName: userName || 'there',
    invoiceNumber: invoiceData.invoiceNumber,
    planName: invoiceData.planName,
    amount: invoiceData.amount,
    paymentDate: invoiceData.paymentDate,
    paymentId: invoiceData.paymentId,
    dashboardUrl: 'https://homehni.com/dashboard'
  });
}

// 18. Services Application Email - Send when user applies for services
export async function sendServicesApplicationEmail(
  userEmail: string, 
  userName: string,
  serviceData: {
    serviceType: string;
    phone: string;
    location: string;
  }
) {
  return sendEmail('/send-services-application-email', {
    to: userEmail,
    userName: userName || 'there',
    serviceType: serviceData.serviceType,
    phone: serviceData.phone,
    location: serviceData.location,
    servicesUrl: 'https://homehni.com/services'
  });
}