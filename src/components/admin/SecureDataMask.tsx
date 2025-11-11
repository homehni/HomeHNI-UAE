import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { useAdminAuth } from '@/hooks/useAdminAuth';

interface SecureDataMaskProps {
  data: string;
  type: 'email' | 'phone' | 'sensitive';
  className?: string;
}

/**
 * Component to mask sensitive data and only show it to authorized admins
 */
export const SecureDataMask: React.FC<SecureDataMaskProps> = ({ 
  data, 
  type, 
  className = '' 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const { isAdmin } = useAdminAuth();

  if (!data) return <span className={`text-muted-foreground ${className}`}>-</span>;
  
  if (!isAdmin) {
    return <span className={`text-muted-foreground ${className}`}>Access Restricted</span>;
  }

  const maskData = (value: string, dataType: string): string => {
    if (!value) return '';
    
    switch (dataType) {
      case 'email':
        const [localPart, domain] = value.split('@');
        if (!domain) return '***@***';
        return `${localPart.charAt(0)}***@${domain}`;
      
      case 'phone':
        if (value.length < 4) return '***';
        return `***-***-${value.slice(-4)}`;
      
      case 'sensitive':
      default:
        if (value.length <= 2) return '*'.repeat(value.length);
        return `${value.charAt(0)}${'*'.repeat(value.length - 2)}${value.charAt(value.length - 1)}`;
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="font-mono text-sm">
        {isVisible ? data : maskData(data, type)}
      </span>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsVisible(!isVisible)}
        className="h-6 w-6 p-0"
        title={isVisible ? 'Hide sensitive data' : 'Show sensitive data'}
      >
        {isVisible ? (
          <EyeOffIcon className="h-3 w-3" />
        ) : (
          <EyeIcon className="h-3 w-3" />
        )}
      </Button>
    </div>
  );
};
