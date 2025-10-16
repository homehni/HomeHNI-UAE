import { useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';

/**
 * PropertyPlans - Route handler for property-specific plan upgrades
 * This component handles the /property/:id/plans route and redirects
 * to the appropriate plans page WITHOUT showing the wizard
 */
const PropertyPlans = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Get the tab and category from URL parameters
    const tab = searchParams.get('tab') || 'seller';
    const category = searchParams.get('category') || 'residential';
    
    // Redirect to the plans page with skipWizard=true
    // This ensures the wizard never appears for property upgrade flows
    navigate(`/plans?tab=${tab}&category=${category}&skipWizard=true&propertyId=${id}`, {
      replace: true // Replace history so back button works correctly
    });
  }, [id, searchParams, navigate]);

  // Show nothing while redirecting
  return null;
};

export default PropertyPlans;
