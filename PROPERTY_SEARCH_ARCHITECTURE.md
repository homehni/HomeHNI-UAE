# Property Search Architecture Documentation

## Overview
This document outlines the improved architecture of the Property Search feature, including design patterns, code organization, and best practices.

---

## 🏗️ Architecture Principles

### 1. **Separation of Concerns**
- **Services**: Business logic (location normalization, property type matching)
- **Hooks**: React state management and side effects
- **Components**: UI presentation only
- **Utils**: Pure helper functions
- **Types**: TypeScript definitions
- **Config**: Centralized configuration

### 2. **Type Safety**
- All `any` types replaced with proper interfaces
- Comprehensive type definitions in `src/types/propertySearch.types.ts`
- Strict TypeScript configuration

### 3. **Single Responsibility**
- Each module has one clear purpose
- Small, focused functions
- Easy to test and maintain

### 4. **Configuration Over Code**
- Property type rules in configuration objects
- Location mappings in data structures
- Easy to modify without code changes

---

## 📁 Project Structure

```
src/
├── components/
│   ├── property-search/
│   │   └── PropertySearchErrorStates.tsx    # Error UI components
│   ├── ErrorBoundary.tsx                     # Error boundary wrapper
│   └── PropertyCard.tsx                      # Property display component
│
├── config/
│   └── propertySearch.config.ts              # Centralized configuration
│
├── hooks/
│   ├── useDebounce.ts                        # Debouncing hook
│   ├── useSimplifiedSearch.ts                # Main search hook
│   └── usePropertyFilters.ts                 # (Future) Filter-specific hook
│
├── pages/
│   └── PropertySearch.tsx                    # Main search page
│
├── services/
│   ├── locationService.ts                    # Location normalization logic
│   └── propertyTypeService.ts                # Property type matching logic
│
├── types/
│   └── propertySearch.types.ts               # Type definitions
│
└── utils/
    └── propertyTransformer.ts                # Property data transformation
```

---

## 🔧 Key Modules

### **1. Type Definitions** (`src/types/propertySearch.types.ts`)

**Purpose**: Centralized type safety for the entire property search feature

**Key Types**:
- `DatabaseProperty`: Raw data from Supabase
- `Property`: Transformed data for UI
- `SearchFilters`: Filter state interface
- `UseSimplifiedSearchReturn`: Hook return type
- `PropertySearchError`: Custom error class

**Benefits**:
- Type autocomplete in IDE
- Catch errors at compile time
- Self-documenting code
- Easy refactoring

**Example**:
```typescript
import { Property, SearchFilters } from '@/types/propertySearch.types';

function filterProperties(
  properties: Property[], 
  filters: SearchFilters
): Property[] {
  // TypeScript knows exact shape of data
}
```

---

### **2. Location Service** (`src/services/locationService.ts`)

**Purpose**: Handle all location-related operations

**Functions**:
- `normalizeLocation(location)`: Standardize location names
- `isMajorCity(location)`: Check if location is a major city
- `isFullAddress(location)`: Detect full addresses
- `extractLocality(address)`: Extract locality from address
- `matchesLocationFilter()`: Check location matches

**Configuration**:
```typescript
const LOCATION_MAPPINGS = {
  'bangalore': 'Bangalore',
  'bengaluru': 'Bangalore',
  // ... 50+ city mappings
};
```

**Benefits**:
- Consistent location handling
- Easy to add new cities
- Testable business logic
- No code duplication

---

### **3. Property Type Service** (`src/services/propertyTypeService.ts`)

**Purpose**: Handle complex property type filtering

**Functions**:
- `getPropertyTypesForTab(tab)`: Get types for buy/rent/commercial
- `matchesPropertyType(propertyType, filter)`: Check if types match
- `filterByPropertyType(properties, filters)`: Filter properties
- `pluralizePropertyType(type)`: Format for display

**Configuration**:
```typescript
const PROPERTY_TYPE_RULES = {
  'PENTHOUSE': {
    exact: ['penthouse'],
  },
  'INDEPENDENT HOUSE': {
    contains: ['independent', 'house'],
    excludes: ['penthouse'],
  },
  // ... all property types
};
```

**Benefits**:
- Complex matching logic in one place
- Rule-based filtering
- Easy to add new property types
- Clear logic flow

---

### **4. Property Transformer** (`src/utils/propertyTransformer.ts`)

**Purpose**: Convert database properties to UI format

**Functions**:
- `transformProperty(dbProperty)`: Transform single property
- `transformProperties(dbProperties)`: Transform array
- `formatCurrency(amount)`: Format prices
- `formatFilterPrice(price)`: Format filter displays

**Example**:
```typescript
// Before
const property = {
  expected_price: 5000000,
  property_type: 'independent_house',
  // ... raw database fields
};

// After transformation
const transformed = transformProperty(property);
// {
//   price: '₹50 L',
//   propertyType: 'Independent House',
//   // ... UI-friendly fields
// }
```

**Benefits**:
- Clean separation of data layers
- Consistent formatting
- Easy to modify display logic
- Testable transformations

---

### **5. Configuration** (`src/config/propertySearch.config.ts`)

**Purpose**: Centralize all configuration values

**Exports**:
- `API_CONFIG`: API keys, batch sizes
- `BUDGET_CONFIG`: Budget ranges per tab
- `PAGINATION_CONFIG`: Pagination settings
- `FILTER_OPTIONS`: Filter dropdown options
- `GOOGLE_MAPS_CONFIG`: Maps API settings
- `SUPABASE_CONFIG`: Database query config
- `UI_CONFIG`: UI-related constants

**Example**:
```typescript
export const API_CONFIG = {
  GOOGLE_MAPS_API_KEY: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  BATCH_SIZE: 50,
  DEBOUNCE_DELAY: 300,
  MAX_LOCATIONS: 3,
};
```

**Benefits**:
- No magic numbers in code
- Environment-based configuration
- Single source of truth
- Easy to modify behavior

---

### **6. Error Handling** (`src/components/ErrorBoundary.tsx`)

**Purpose**: Graceful error handling with user-friendly UI

**Components**:
- `ErrorBoundary`: React error boundary
- `PropertyLoadError`: Property loading errors
- `NoPropertiesFound`: Empty state
- `ConnectionError`: Network errors
- `PropertySkeletonGrid`: Loading state

**Example Usage**:
```tsx
<ErrorBoundary>
  <PropertySearch />
</ErrorBoundary>
```

**Benefits**:
- App doesn't crash on errors
- User-friendly error messages
- Easy retry mechanisms
- Better user experience

---

## 🔄 Data Flow

### **1. Initial Load**
```
User visits page
    ↓
PropertySearch component mounts
    ↓
useSimplifiedSearch hook initializes
    ↓
loadProperties() called
    ↓
Supabase query (first 50 properties)
    ↓
transformProperties() called
    ↓
State updated → UI renders
```

### **2. Filtering**
```
User changes filter
    ↓
updateFilter() called
    ↓
Filter state updated
    ↓
useMemo recalculates filteredProperties
    ↓
Services apply filter logic:
  - propertyTypeService.matchesPropertyType()
  - locationService.matchesLocationFilter()
    ↓
PropertyCards re-render (only if needed)
```

### **3. Location Search**
```
User types location
    ↓
Input value updates
    ↓
useDebounce delays 300ms
    ↓
Google Maps autocomplete triggered
    ↓
locationService.normalizeLocation()
    ↓
Location added to filters
    ↓
Properties re-filtered
```

---

## 🎯 Design Patterns

### **1. Custom Hooks Pattern**
```typescript
// Extract complex logic into reusable hooks
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  // ... implementation
  return debouncedValue;
}
```

**Benefits**: Reusable, testable, composable

### **2. Service Layer Pattern**
```typescript
// Business logic in service modules
export class LocationService {
  static normalize(location: string): string {
    // Complex normalization logic
  }
}
```

**Benefits**: Separation of concerns, easier testing

### **3. Configuration Pattern**
```typescript
// Behavior defined by configuration
const CONFIG = {
  BUDGET_RANGES: { rent: [0, 500000], buy: [0, 50000000] }
};
```

**Benefits**: Easy to modify, no code changes needed

### **4. Transformer Pattern**
```typescript
// Transform data between layers
function transformProperty(db: DatabaseProperty): Property {
  // Transform logic
}
```

**Benefits**: Clean data boundaries, consistent formatting

### **5. Error Boundary Pattern**
```typescript
class ErrorBoundary extends Component {
  componentDidCatch(error, errorInfo) {
    // Handle error gracefully
  }
}
```

**Benefits**: Prevents app crashes, better UX

---

## 📊 Performance Optimizations

### **1. Memoization**
```typescript
const transformProperty = useCallback((property) => {
  // Expensive transformation
}, []);

const filteredProperties = useMemo(() => {
  // Expensive filtering
}, [allProperties, filters]);
```

### **2. Batched Loading**
```typescript
// Load 50 properties at a time instead of all
const { data } = await supabase
  .from('properties')
  .select('...')
  .limit(50);
```

### **3. Debouncing**
```typescript
// Wait 300ms before processing input
const debouncedSearch = useDebounce(searchTerm, 300);
```

### **4. React.memo**
```typescript
// Prevent unnecessary re-renders
export default memo(PropertyCard);
```

---

## 🧪 Testing Strategy

### **Unit Tests**
```typescript
// Test pure functions
describe('normalizeLocation', () => {
  it('should normalize bangalore to Bangalore', () => {
    expect(normalizeLocation('bangalore')).toBe('Bangalore');
    expect(normalizeLocation('bengaluru')).toBe('Bangalore');
  });
});
```

### **Integration Tests**
```typescript
// Test hook behavior
describe('useSimplifiedSearch', () => {
  it('should filter properties by type', () => {
    const { result } = renderHook(() => useSimplifiedSearch());
    // ... test filtering
  });
});
```

### **Component Tests**
```typescript
// Test UI behavior
describe('PropertySearch', () => {
  it('should display properties', () => {
    render(<PropertySearch />);
    expect(screen.getByText(/properties found/i)).toBeInTheDocument();
  });
});
```

---

## 🔐 Security Best Practices

### **1. Environment Variables**
```env
# Never commit sensitive keys
VITE_GOOGLE_MAPS_API_KEY=your_key_here
```

### **2. API Key Restrictions**
- Restrict Google Maps API to your domain
- Set HTTP referrer restrictions
- Monitor API usage

### **3. Input Validation**
```typescript
// Validate budget ranges
function isValidBudgetRange(range: [number, number]): boolean {
  return range[0] >= 0 && range[1] <= MAX_BUDGET && range[0] <= range[1];
}
```

---

## 📈 Monitoring & Debugging

### **1. Console Logging**
```typescript
console.log('📊 Properties loaded:', transformedProperties.length);
console.log('🔍 Filtering by:', filters);
```

### **2. Error Tracking**
```typescript
export class PropertySearchError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    // Can be sent to error tracking service
  }
}
```

### **3. Performance Marks**
```typescript
performance.mark('filter-start');
// ... filtering logic
performance.mark('filter-end');
performance.measure('filter-duration', 'filter-start', 'filter-end');
```

---

## 🚀 Future Improvements

### **1. Split useSimplifiedSearch**
```typescript
// Current: One large hook
useSimplifiedSearch()

// Future: Smaller, focused hooks
usePropertyLoader()
usePropertyFilters()
usePropertySort()
usePropertyPagination()
```

### **2. Add Caching Layer**
```typescript
// Cache frequently accessed data
const propertyCache = new Map<string, Property>();
```

### **3. Virtual Scrolling**
```typescript
// Render only visible properties
import { useVirtualizer } from '@tanstack/react-virtual';
```

### **4. GraphQL Migration**
```typescript
// More efficient queries
query GetProperties($filters: PropertyFilters) {
  properties(filters: $filters) {
    id
    title
    # only needed fields
  }
}
```

---

## 📚 Resources & References

### **Documentation**
- [React Best Practices](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Supabase Docs](https://supabase.com/docs)

### **Related Files**
- Performance Optimization: `PROPERTY_SEARCH_PERFORMANCE_OPTIMIZATION.md`
- Type Definitions: `src/types/propertySearch.types.ts`
- Configuration: `src/config/propertySearch.config.ts`

---

**Last Updated**: October 3, 2025  
**Version**: 2.0  
**Author**: GitHub Copilot
