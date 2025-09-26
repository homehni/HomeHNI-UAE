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