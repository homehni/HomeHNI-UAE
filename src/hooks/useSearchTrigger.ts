import { useState } from 'react';

/**
 * A hook to track search trigger state
 * 
 * @returns Object with searchTriggered state and functions to control it
 */
export const useSearchTrigger = () => {
  const [searchTriggered, setSearchTriggered] = useState(false);
  
  // Function to trigger search
  const triggerSearch = () => {
    setSearchTriggered(true);
  };
  
  // Function to reset trigger after search is complete
  const resetTrigger = () => {
    setSearchTriggered(false);
  };
  
  return {
    searchTriggered,
    triggerSearch,
    resetTrigger
  };
};
