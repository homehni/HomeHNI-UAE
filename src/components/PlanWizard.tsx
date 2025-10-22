import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Check, ChevronLeft, ChevronRight, User, Building2, Home, Factory, Sprout, Users, Hammer, Briefcase } from 'lucide-react';

type UserRole = 'buyer' | 'seller' | 'owner' | 'tenant' | 'commercial-buyer' | 'builder-lifetime' | 'agent';
type Category = 'residential' | 'commercial' | 'industrial' | 'agricultural';

interface PlanWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const roleOptions: Array<{ id: UserRole; label: string; icon: React.ReactNode; hint?: string; tab: string }> = [
  { id: 'buyer', label: 'Buyer', icon: <User className="w-5 h-5" />, tab: 'buyer' },
  { id: 'seller', label: 'Seller', icon: <Briefcase className="w-5 h-5" />, tab: 'seller' },
  { id: 'owner', label: 'Owner (Rental)', icon: <Home className="w-5 h-5" />, tab: 'rental' },
  { id: 'tenant', label: 'Tenant', icon: <Users className="w-5 h-5" />, tab: 'rental' },
  { id: 'builder-lifetime', label: 'Builder', icon: <Hammer className="w-5 h-5" />, tab: 'builder-lifetime' },
  { id: 'agent', label: 'Agent', icon: <Briefcase className="w-5 h-5" />, tab: 'agent' },
];

const categoryOptions: Array<{ id: Category; label: string; icon: React.ReactNode }> = [
  { id: 'residential', label: 'Residential', icon: <Home className="w-5 h-5" /> },
  { id: 'commercial', label: 'Commercial', icon: <Building2 className="w-5 h-5" /> },
  { id: 'industrial', label: 'Industrial', icon: <Factory className="w-5 h-5" /> },
  { id: 'agricultural', label: 'Agricultural', icon: <Sprout className="w-5 h-5" /> },
];

export default function PlanWizard({ open, onOpenChange }: PlanWizardProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const preRole = params.get('role') as UserRole | null;
  const preCategory = params.get('category') as Category | null;

  const [step, setStep] = useState<1 | 2>(1);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(preRole ?? null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(preCategory ?? null);

  useEffect(() => {
    // If role preselected and category not needed, fast-forward
    if (selectedRole) {
      const needsCategory = needsCategorySelection(selectedRole);
      if (!needsCategory) {
        setStep(2);
      }
    }
  }, [selectedRole]);

  const canContinue = useMemo(() => {
    if (!selectedRole) return false;
    if (!needsCategorySelection(selectedRole)) return true;
    return !!selectedCategory;
  }, [selectedRole, selectedCategory]);

  function needsCategorySelection(role: UserRole) {
    // Rental owner/tenant also benefit from a category to preselect their inner tabs
    if (role === 'owner' || role === 'tenant') return true;
    // Buyer/Seller need category to open correct tab
    if (role === 'buyer' || role === 'seller') return true;
    // Builder/Agent pages generally have their own structure without categories
    return false;
  }

  function computeDestination() {
    if (!selectedRole) return '/plans';
    let tab = 'buyer';
    const query: Record<string, string> = {};

    switch (selectedRole) {
      case 'buyer':
        tab = 'buyer';
        if (selectedCategory) query.category = selectedCategory;
        break;
      case 'seller':
        tab = 'seller';
        if (selectedCategory) query.category = selectedCategory;
        break;
      case 'owner':
        tab = 'rental';
        query.rentalRole = 'owner';
        if (selectedCategory) query.category = selectedCategory;
        break;
      case 'tenant':
        tab = 'rental';
        query.rentalRole = 'tenant';
        if (selectedCategory) query.category = selectedCategory;
        break;
      case 'builder-lifetime':
        tab = 'builder-lifetime';
        break;
      case 'agent':
        tab = 'agent';
        break;
      default:
        tab = 'buyer';
    }

    const qs = new URLSearchParams({ tab, skipWizard: 'true', ...query }).toString();
    return `/plans?${qs}`;
  }

  const handleNext = () => {
    if (!canContinue) return;
    const url = computeDestination();
    // Navigate first to avoid any race with dialog close/unmount
    navigate(url);
    // Defer close to the next tick so routing isn't interrupted by dialog state changes
    setTimeout(() => onOpenChange(false), 0);
  };

  const renderRoleCard = (opt: typeof roleOptions[number]) => (
    <button
      key={opt.id}
      className={`flex items-center justify-between w-full border rounded-lg p-4 text-left hover:bg-muted transition ${selectedRole === opt.id ? 'border-brand-red ring-2 ring-brand-red/40' : 'border-border'}`}
      onClick={() => {
        setSelectedRole(opt.id);
        if (!needsCategorySelection(opt.id)) {
          setSelectedCategory(null);
        }
        setStep(2);
      }}
    >
      <div className="flex items-center gap-3">
        {opt.icon}
        <div>
          <div className="font-medium">{opt.label}</div>
          {opt.hint && <div className="text-xs text-muted-foreground">{opt.hint}</div>}
        </div>
      </div>
      {selectedRole === opt.id && <Check className="w-5 h-5 text-brand-red" />}
    </button>
  );

  const renderCategoryCard = (opt: typeof categoryOptions[number]) => (
    <button
      key={opt.id}
      className={`flex items-center justify-between w-full border rounded-lg p-4 text-left hover:bg-muted transition ${selectedCategory === opt.id ? 'border-brand-red ring-2 ring-brand-red/40' : 'border-border'}`}
      onClick={() => setSelectedCategory(opt.id)}
    >
      <div className="flex items-center gap-3">
        {opt.icon}
        <div className="font-medium">{opt.label}</div>
      </div>
      {selectedCategory === opt.id && <Check className="w-5 h-5 text-brand-red" />}
    </button>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg w-[92vw] p-0 overflow-hidden">
        <DialogHeader className="p-4 border-b">
          <DialogTitle>Find the right plan</DialogTitle>
        </DialogHeader>
        <div className="p-4 space-y-4">
          {/* Stepper */}
          <div className="flex items-center gap-2 text-xs">
            <Badge variant={step === 1 ? 'default' : 'secondary'}>1. Who are you?</Badge>
            <ChevronRight className="w-4 h-4" />
            <Badge variant={step === 2 ? 'default' : 'secondary'}>2. Property type</Badge>
          </div>

          {/* Step 1 */}
          {step === 1 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {roleOptions.map(renderRoleCard)}
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div className="space-y-3">
              {needsCategorySelection(selectedRole as UserRole) ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {categoryOptions.map(renderCategoryCard)}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-4 text-sm text-muted-foreground">
                    No property category needed for this role.
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-2">
            <Button variant="ghost" onClick={() => setStep((s) => (s === 2 ? 1 : 1))} disabled={step === 1}>
              <ChevronLeft className="w-4 h-4 mr-1" /> Back
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
              <Button onClick={handleNext} disabled={!canContinue}>Continue</Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
