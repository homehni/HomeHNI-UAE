import React, { useEffect, useRef } from 'react';
import { Home, Building, TrendingUp, MapPin, Users, ShoppingBag, Briefcase, BarChart3, Building2, PlusCircle } from 'lucide-react';
const MobilePropertyServices = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const services = [{
    icon: Home,
    label: 'Buy',
    hasNew: false
  }, {
    icon: Building,
    label: 'Rent',
    hasNew: false
  }, {
    icon: TrendingUp,
    label: 'Invest',
    hasNew: true
  }, {
    icon: MapPin,
    label: 'Plot / Land',
    hasNew: false
  }, {
    icon: Users,
    label: 'Co-working Spaces',
    hasNew: false
  }, {
    icon: ShoppingBag,
    label: 'Buy Commercial',
    hasNew: false
  }, {
    icon: Briefcase,
    label: 'Lease Commercial',
    hasNew: false
  }, {
    icon: BarChart3,
    label: 'Insights',
    hasNew: true
  }, {
    icon: Building2,
    label: 'PG',
    hasNew: false
  }, {
    icon: PlusCircle,
    label: 'Post a property',
    hasNew: false
  }];
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;
    let scrollAmount = 0;
    const scrollStep = 1;
    const scrollSpeed = 30;
    let isScrollingRight = true;
    let isPaused = false;
    const autoScroll = () => {
      if (isPaused) return;
      const maxScroll = scrollContainer.scrollWidth - scrollContainer.clientWidth;
      if (isScrollingRight) {
        scrollAmount += scrollStep;
        if (scrollAmount >= maxScroll) {
          isScrollingRight = false;
        }
      } else {
        scrollAmount -= scrollStep;
        if (scrollAmount <= 0) {
          isScrollingRight = true;
        }
      }
      scrollContainer.scrollLeft = scrollAmount;
    };
    const intervalId = setInterval(autoScroll, scrollSpeed);

    // Pause on hover
    const handleMouseEnter = () => {
      isPaused = true;
    };
    const handleMouseLeave = () => {
      isPaused = false;
    };
    scrollContainer.addEventListener('mouseenter', handleMouseEnter);
    scrollContainer.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      clearInterval(intervalId);
      scrollContainer.removeEventListener('mouseenter', handleMouseEnter);
      scrollContainer.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);
  return;
};
export default MobilePropertyServices;