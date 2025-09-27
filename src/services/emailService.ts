interface EmailParams {
  to: string;
  userName?: string;
  locality?: string;
  rangeMin?: string;
  rangeMax?: string;
  yourPrice?: string;
  updatePriceUrl?: string;
  propertyType?: 'residential' | 'commercial' | 'industrial' | 'agricultural';
  listingType?: 'sell' | 'rent';
  userType?: 'seller' | 'buyer' | 'tenant' | 'owner' | 'agent' | 'builder';
}

const EMAIL_BASE_URL = 'https://email-system-hni.vercel.app';

const makeEmailRequest = async (endpoint: string, params: any) => {
  // Get API key from environment or fallback
  const apiKey = import.meta.env.VITE_EMAIL_API_KEY || 'your-api-key-here';
  
  try {
    const response = await fetch(`${EMAIL_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Email service error (${endpoint}):`, error);
    throw error;
  }
};

export const emailService = {
  sendPriceSuggestionsEmail: (params: EmailParams) => 
    makeEmailRequest('/send-price-suggestions-email', params),
  
  sendPlanUpgradeEmail: (params: EmailParams) => 
    makeEmailRequest('/send-plan-upgrade-email', params),
  
  sendWelcomeEmail: (params: Pick<EmailParams, 'to' | 'userName'>) => 
    makeEmailRequest('/send-welcome-email', params),
};

// Legacy function exports for backward compatibility
export const sendContactOwnerEmail = async (ownerEmail: string, ownerName: string, details: any) => {
  return emailService.sendPlanUpgradeEmail({
    to: ownerEmail,
    userName: ownerName,
  });
};

export const sendShowInterestEmail = async (userEmail: string, userName: string, details: any) => {
  return emailService.sendPlanUpgradeEmail({
    to: userEmail,
    userName,
  });
};

export const sendPriceSuggestionsEmail = async (userEmail: string, userName: string, details: any) => {
  return emailService.sendPriceSuggestionsEmail({
    to: userEmail,
    userName,
    locality: details?.locality,
    rangeMin: details?.rangeMin?.toString(),
    rangeMax: details?.rangeMax?.toString(),
    yourPrice: details?.yourPrice?.toString(),
    propertyType: details?.propertyType || 'residential',
    listingType: details?.listingType || 'sell',
    userType: details?.userType || 'buyer'
  });
};

export const sendPlanActivatedEmail = async (userEmail: string, userName: string, planDetails: any) => {
  return emailService.sendPlanUpgradeEmail({
    to: userEmail,
    userName,
  });
};

export const sendPaymentSuccessEmail = async (userEmail: string, userName: string, paymentDetails: any) => {
  return emailService.sendPlanUpgradeEmail({
    to: userEmail,
    userName,
  });
};

export const sendPaymentInvoiceEmail = async (userEmail: string, userName: string, invoiceDetails: any) => {
  return emailService.sendPlanUpgradeEmail({
    to: userEmail,
    userName,
  });
};

export const sendDealClosedEmail = async (userEmail: string, userName: string, propertyDetails: any) => {
  return emailService.sendPlanUpgradeEmail({
    to: userEmail,
    userName,
  });
};

export const sendMarkRentedSoldEmail = async (userEmail: string, userName: string, propertyDetails: any) => {
  return emailService.sendPlanUpgradeEmail({
    to: userEmail,
    userName,
  });
};

export const sendListingLiveEmail = async (userEmail: string, userName: string, propertyDetails: any) => {
  return emailService.sendPlanUpgradeEmail({
    to: userEmail,
    userName,
  });
};

export const sendLoanEnquiryEmail = async (userEmail: string, userName?: string) => {
  return emailService.sendPlanUpgradeEmail({
    to: userEmail,
    userName: userName || 'Valued Customer',
  });
};

// Also export sendPlanUpgradeEmail as a standalone function for dynamic imports
export const sendPlanUpgradeEmail = async (userEmail: string, userName?: string, details?: any) => {
  return emailService.sendPlanUpgradeEmail({
    to: userEmail,
    userName: userName || 'Valued Customer',
    locality: details?.locality,
    rangeMin: details?.rangeMin?.toString(),
    rangeMax: details?.rangeMax?.toString(),
    yourPrice: details?.yourPrice?.toString(),
    propertyType: details?.propertyType || 'residential',
    listingType: details?.listingType || 'sell',
    userType: details?.userType || 'seller'
  });
};