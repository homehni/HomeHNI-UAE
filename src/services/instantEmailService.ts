/**
 * Instant Email Service for Go Premium Button
 * Sends personalized premium plan emails when users click "Go Premium"
 */

interface Property {
  listing_type?: string;
  property_type?: string;
  expected_price?: number;
  city?: string;
  locality?: string;
  [key: string]: any;
}

interface User {
  email: string;
  full_name?: string;
  name?: string;
}

interface EmailPayload {
  to: string;
  userName: string;
  locality: string;
  yourPrice: number;
  propertyType: string;
  listingType: string;
  userType: string;
  rangeMin: number;
  rangeMax: number;
  updatePriceUrl: string;
}

/**
 * Determine user type based on property characteristics
 */
const getUserType = (property: Property): string => {
  const { listing_type, property_type } = property;
  
  console.log('🔍 Determining user type:', { listing_type, property_type });
  
  if (listing_type === "sale" && property_type === "residential") return "seller";
  if (listing_type === "rent" && property_type === "residential") return "owner";
  if (listing_type === "sale" && property_type === "commercial") return "commercialSeller";
  if (listing_type === "rent" && property_type === "commercial") return "owner";
  if (property_type === "land" || property_type === "plot") return "builder";
  if (listing_type === "sale" && property_type === "industrial") return "seller";
  if (listing_type === "rent" && property_type === "industrial") return "owner";
  
  console.log('📝 Using default user type: seller');
  return "seller"; // default
};

/**
 * Send instant premium plan email
 */
export const sendInstantPremiumEmail = async (user: User, property: Property): Promise<void> => {
  try {
    console.log('📧 Sending instant premium email...');
    console.log('User:', { email: user.email, name: user.full_name || user.name });
    console.log('Property:', { 
      type: property.property_type, 
      listing: property.listing_type,
      price: property.expected_price,
      location: `${property.city}, ${property.locality}`
    });

    const userType = getUserType(property);
    const expectedPrice = property.expected_price || 0;
    
    // Create email payload matching the backend structure
    const payload: EmailPayload = {
      to: user.email,
      userName: user.full_name || user.name || 'Property Owner',
      locality: `${property.city || ''}, ${property.locality || ''}`.trim(),
      yourPrice: expectedPrice,
      propertyType: property.property_type || 'residential',
      listingType: property.listing_type || 'sale',
      userType,
      rangeMin: Math.round(expectedPrice * 0.9), // 10% below market range
      rangeMax: Math.round(expectedPrice * 1.1), // 10% above market range
      updatePriceUrl: `https://homehni.com/plans`
    };

    console.log('🚀 Email payload prepared:', payload);

    // Call Supabase edge function
    const response = await fetch(`https://geenmplkdgmlovvgwzai.supabase.co/functions/v1/send-premium-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdlZW5tcGxrZGdtbG92dmd3emFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyNTIzMDQsImV4cCI6MjA2ODgyODMwNH0.ZQTYDsCy6ogC776oU0zakPDCXo_lJpALGVbCNdBlSVs'}`
      },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Premium email sent successfully:', result);
    } else {
      const error = await response.text();
      console.error('❌ Failed to send premium email:', error);
    }

  } catch (error) {
    console.error('💥 Error sending instant premium email:', error);
    // Silent failure - don't block user experience
  }
};

/**
 * Extract property data from form data object
 */
export const extractPropertyData = (formData: any): Property => {
  console.log('🔄 Extracting property data from form:', formData);
  
  // Handle different form data structures
  let propertyData: Property = {};
  
  if (formData?.propertyInfo) {
    // Standard property form structure
    const { propertyInfo } = formData;
    propertyData = {
      listing_type: propertyInfo.rentalDetails?.listingType || 
                   propertyInfo.saleDetails?.listingType || 
                   propertyInfo.listing_type || 'sale',
      property_type: propertyInfo.propertyDetails?.propertyType || 
                    propertyInfo.property_type || 'residential',
      expected_price: propertyInfo.rentalDetails?.expectedPrice || 
                     propertyInfo.saleDetails?.expectedPrice ||
                     propertyInfo.expected_price || 0,
      city: propertyInfo.locationDetails?.city || propertyInfo.city || '',
      locality: propertyInfo.locationDetails?.locality || propertyInfo.locality || ''
    };
  } else if (formData?.property_type) {
    // Direct property object
    propertyData = {
      listing_type: formData.listing_type || 'sale',
      property_type: formData.property_type || 'residential',
      expected_price: formData.expected_price || 0,
      city: formData.city || '',
      locality: formData.locality || ''
    };
  } else {
    // Fallback extraction
    propertyData = {
      listing_type: 'sale',
      property_type: 'residential',
      expected_price: 0,
      city: '',
      locality: ''
    };
  }
  
  console.log('📊 Extracted property data:', propertyData);
  return propertyData;
};

/**
 * Extract user data from form data object
 */
export const extractUserData = (formData: any): User => {
  console.log('👤 Extracting user data from form:', formData);
  
  let userData: User = { email: '', full_name: '' };
  
  if (formData?.ownerInfo) {
    userData = {
      email: formData.ownerInfo.email || '',
      full_name: formData.ownerInfo.fullName || formData.ownerInfo.name || ''
    };
  } else if (formData?.email) {
    userData = {
      email: formData.email || '',
      full_name: formData.full_name || formData.name || ''
    };
  }
  
  console.log('👤 Extracted user data:', { email: userData.email, name: userData.full_name });
  return userData;
};

/**
 * Main function to handle Go Premium click
 */
export const handleGoPremiumClick = async (formData: any): Promise<void> => {
  console.log('🎯 Go Premium clicked! Processing instant email...');
  
  try {
    const userData = extractUserData(formData);
    const propertyData = extractPropertyData(formData);
    
    if (!userData.email) {
      console.log('⚠️ No email found, skipping instant email');
      return;
    }
    
    // Send email in background (don't await to keep it instant)
    sendInstantPremiumEmail(userData, propertyData).catch(error => {
      console.error('Background email error:', error);
    });
    
    console.log('✨ Premium email triggered successfully');
    
  } catch (error) {
    console.error('Error handling Go Premium click:', error);
  }
};
