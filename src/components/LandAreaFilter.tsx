import { FC } from 'react';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { AreaUnit } from '@/utils/areaConverter';

interface LandAreaFilterProps {
  value: [number, number];
  unit: string;
  onChange: (value: [number, number]) => void;
  onCommit: (value: [number, number]) => void;
  onUnitChange: (unit: string) => void;
}

export const LandAreaFilter: FC<LandAreaFilterProps> = ({ 
  value, 
  unit, 
  onChange, 
  onCommit, 
  onUnitChange 
}) => {
  // Maximum values for different area units
  const maxValues: Record<string, number> = {
    'sq.ft': 10000,     // 10,000 sq.ft max for UI
    'sq.yards': 29040,  // 6 acres = 29,040 sq.yards
    'sq.m': 24280,      // 6 acres = 24,280 sq.m
    'acres': 6,         // 6 acres
    'hectare': 2.43,    // 6 acres = 2.43 hectares
    'bigha': 9.6,       // 6 acres ~ 9.6 bigha (varies by region)
    'marla': 120,       // 6 acres ~ 120 marla
    'cents': 600,       // 6 acres ~ 600 cents
    'guntha': 240       // 6 acres ~ 240 guntha
  };

  // Get max value based on current unit
  const maxValue = maxValues[unit as AreaUnit] || 10;
  
  // Debug current values
  console.log('LandAreaFilter:', {
    unit,
    value,
    maxValue
  });
  
  // Slider step based on unit
  const getStep = () => {
    if (['acres', 'hectare', 'bigha'].includes(unit)) return 0.1;
    if (['sq.ft', 'sq.yards', 'sq.m'].includes(unit)) return 100;
    return 1;
  };
  
  // Format the display value based on unit
  const formatValue = (val: number): string => {
    if (['acres', 'hectare', 'bigha'].includes(unit)) {
      return val.toFixed(1);
    }
    if (['sq.ft', 'sq.yards', 'sq.m'].includes(unit)) {
      return val.toLocaleString();
    }
    return val.toString();
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <h4 className="font-semibold" id="land-area-label">Area</h4>
        <Select value={unit} onValueChange={onUnitChange}>
          <SelectTrigger className="w-24 h-8">
            <SelectValue placeholder="Unit" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sq.ft">sq.ft.</SelectItem>
            <SelectItem value="sq.yards">sq.yards</SelectItem>
            <SelectItem value="sq.m">sq.m</SelectItem>
            <SelectItem value="acres">acres</SelectItem>
            <SelectItem value="bigha">bigha</SelectItem>
            <SelectItem value="marla">marla</SelectItem>
            <SelectItem value="cents">cents</SelectItem>
            <SelectItem value="guntha">guntha</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-3">
        <div className="relative">
          <Slider 
            value={value}
            onValueChange={(val) => onChange(val as [number, number])}
            onValueCommit={(val) => onCommit(val as [number, number])}
            max={maxValue} 
            min={0} 
            step={getStep()} 
            className="w-full"
            aria-labelledby="land-area-label"
            aria-valuemin={0}
            aria-valuemax={maxValue}
            aria-valuenow={value[1]}
          />
        </div>
        
        <div className="flex justify-between text-sm font-medium text-foreground">
          <span>{formatValue(value[0])} {unit}</span>
          <span>
            {formatValue(value[1])} {unit}
            {/* Show "+" when at max value or when value is 10000 for sq.ft */}
            {(value[1] >= maxValue || (unit === 'sq.ft' && value[1] >= 10000)) ? '+' : ''}
          </span>
        </div>
        
        <div className="space-y-2 mb-3">
          <div className="text-sm font-medium text-gray-700">Enter Area Range</div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label htmlFor="min-land-area" className="text-xs text-gray-500 mb-1 block">
                Min Area ({unit})
              </label>
              <Input 
                id="min-land-area"
                type="number" 
                placeholder={`Min ${unit}`} 
                value={value[0].toString()} 
                onChange={e => {
                  const val = parseFloat(e.target.value) || 0;
                  if (val <= value[1]) onChange([val, value[1]]);
                }} 
                onBlur={() => onCommit(value)}
                onKeyDown={e => { if (e.key === 'Enter') onCommit(value); }}
                className="h-8 text-sm"
                aria-label={`Minimum area in ${unit}`}
              />
            </div>
            <div>
              <label htmlFor="max-land-area" className="text-xs text-gray-500 mb-1 block">
                Max Area ({unit})
              </label>
              <Input 
                id="max-land-area"
                type="number" 
                placeholder={`Max ${unit}`}
                value={value[1].toString()} 
                onChange={e => {
                  const val = parseFloat(e.target.value) || 0;
                  if (val >= value[0]) onChange([value[0], Math.min(val, maxValue * 2)]);
                }} 
                onBlur={() => onCommit(value)}
                onKeyDown={e => { if (e.key === 'Enter') onCommit(value); }}
                className="h-8 text-sm"
                aria-label={`Maximum area in ${unit}`}
              />
            </div>
          </div>
        </div>
        
        {/* Quick buttons for common area ranges */}
        {unit === 'acres' && (
          <div className="flex flex-wrap gap-2">
            <Button 
              variant={value[0] === 0 && value[1] === 0.5 ? "default" : "outline"} 
              size="sm" 
              onClick={() => { onChange([0, 0.5]); onCommit([0, 0.5]); }} 
              className="text-xs h-8"
            >
              Under 0.5 Acre
            </Button>
            <Button 
              variant={value[0] === 0.5 && value[1] === 1 ? "default" : "outline"} 
              size="sm" 
              onClick={() => { onChange([0.5, 1]); onCommit([0.5, 1]); }} 
              className="text-xs h-8"
            >
              0.5-1 Acre
            </Button>
            <Button 
              variant={value[0] === 1 && value[1] === 2 ? "default" : "outline"} 
              size="sm" 
              onClick={() => { onChange([1, 2]); onCommit([1, 2]); }} 
              className="text-xs h-8"
            >
              1-2 Acres
            </Button>
            <Button 
              variant={value[0] === 2 && value[1] === 3 ? "default" : "outline"} 
              size="sm" 
              onClick={() => { onChange([2, 3]); onCommit([2, 3]); }} 
              className="text-xs h-8"
            >
              2-3 Acres
            </Button>
            <Button 
              variant={value[0] === 3 && value[1] === 4 ? "default" : "outline"} 
              size="sm" 
              onClick={() => { onChange([3, 4]); onCommit([3, 4]); }} 
              className="text-xs h-8"
            >
              3-4 Acres
            </Button>
            <Button 
              variant={value[0] === 4 && value[1] === 6 ? "default" : "outline"} 
              size="sm" 
              onClick={() => { onChange([4, 6]); onCommit([4, 6]); }} 
              className="text-xs h-8"
            >
              4-6 Acres
            </Button>
            <Button 
              variant={value[0] === 6 && value[1] === 6 ? "default" : "outline"} 
              size="sm" 
              onClick={() => { onChange([6, 6]); onCommit([6, 6]); }} 
              className="text-xs h-8"
            >
              6+ Acres
            </Button>
          </div>
        )}
        
        {/* For sq.ft, focus on smaller ranges with a 10000+ option that sets to max value */}
        {unit === 'sq.ft' && (
          <div className="flex flex-wrap gap-2">
            <Button 
              variant={value[0] === 0 && value[1] === 2000 ? "default" : "outline"} 
              size="sm" 
              onClick={() => { onChange([0, 2000]); onCommit([0, 2000]); }} 
              className="text-xs h-8"
            >
              Under 2000
            </Button>
            <Button 
              variant={value[0] === 2000 && value[1] === 4000 ? "default" : "outline"} 
              size="sm" 
              onClick={() => { onChange([2000, 4000]); onCommit([2000, 4000]); }} 
              className="text-xs h-8"
            >
              2000-4000
            </Button>
            <Button 
              variant={value[0] === 4000 && value[1] === 6000 ? "default" : "outline"} 
              size="sm" 
              onClick={() => { onChange([4000, 6000]); onCommit([4000, 6000]); }} 
              className="text-xs h-8"
            >
              4000-6000
            </Button>
            <Button 
              variant={value[0] === 6000 && value[1] === 10000 ? "default" : "outline"} 
              size="sm" 
              onClick={() => { onChange([6000, 10000]); onCommit([6000, 10000]); }} 
              className="text-xs h-8"
            >
              6000-10000
            </Button>
            <Button 
              variant={value[0] === 10000 && value[1] === maxValue ? "default" : "outline"} 
              size="sm" 
              onClick={() => { onChange([10000, maxValue]); onCommit([10000, maxValue]); }} 
              className="text-xs h-8"
            >
              10000+
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};