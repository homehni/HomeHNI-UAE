# Services Layer

This directory contains business logic and external service integrations for the HomeHNI application.

## 📁 Structure

```
services/
├── __tests__/              # Unit tests for services
│   └── locationService.test.ts
├── freeLocationAutocomplete.ts  # OpenStreetMap location search
├── locationService.ts      # Location normalization and matching
├── propertyTypeService.ts  # Property type filtering logic
└── README.md              # This file
```

## 🎯 Purpose

Services encapsulate:
- **Business Logic**: Complex operations that don't belong in components
- **External APIs**: Third-party service integrations
- **Data Transformation**: Converting between formats
- **Utility Functions**: Reusable logic across the application

## 📚 Service Documentation

### freeLocationAutocomplete.ts

**Purpose**: Free location search using OpenStreetMap Nominatim API

**Key Functions**:
- `searchLocations(query, limit)` - Search for locations in India
- `getLocationDetails(placeId)` - Get details for a specific location

**Features**:
- ✅ No API key required (100% FREE)
- ✅ India-specific searches
- ✅ Structured error handling
- ✅ Performance logging

**Usage Example**:
```typescript
import { searchLocations } from '@/services/freeLocationAutocomplete';

const results = await searchLocations('Mumbai', 5);
console.log(results); // Array of LocationSuggestion objects
```

**Rate Limits**: 1 request/second (Nominatim policy)

---

### locationService.ts

**Purpose**: Normalize and standardize location names across India

**Key Functions**:
- `normalizeLocation(location)` - Standardize location names
- `isMajorCity(location)` - Check if location is a major city
- `toTitleCase(str)` - Convert strings to title case
- `matchesLocationFilter(propertyLocation, filterLocation)` - Match locations for filtering
- `extractCity(location)` - Extract city from full address

**Features**:
- ✅ 50+ city mappings
- ✅ Handles variations (Bengaluru → Bangalore)
- ✅ Fuzzy matching for search
- ✅ Major city detection

**Usage Example**:
```typescript
import { normalizeLocation, matchesLocationFilter } from '@/services/locationService';

const normalized = normalizeLocation('bengaluru division');
// Returns: 'Bangalore'

const matches = matchesLocationFilter('Koramangala, Bangalore', 'Bangalore');
// Returns: true
```

---

### propertyTypeService.ts

**Purpose**: Rule-based property type matching and filtering

**Key Functions**:
- `getPropertyTypesForTab(tab)` - Get available property types for rent/buy/commercial
- `matchesPropertyType(propertyType, filter)` - Check if property matches type filter

**Features**:
- ✅ Configuration-driven rules
- ✅ Complex type matching (e.g., "Gated Community Villa")
- ✅ Tab-specific property types

**Usage Example**:
```typescript
import { matchesPropertyType, getPropertyTypesForTab } from '@/services/propertyTypeService';

const types = getPropertyTypesForTab('rent');
// Returns: ['ALL', 'APARTMENT', 'VILLA', ...]

const matches = matchesPropertyType('Independent House', 'INDEPENDENT HOUSE');
// Returns: true
```

## 🧪 Testing

Unit tests are located in `__tests__/` directory.

**To set up testing**:
```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom
```

**Run tests**:
```bash
npm test                 # Run all tests
npm run test:ui          # Run tests with UI
npm run test:coverage    # Run tests with coverage
```

**Example test**:
```typescript
import { describe, it, expect } from 'vitest';
import { normalizeLocation } from '../locationService';

describe('normalizeLocation', () => {
  it('should normalize bengaluru to Bangalore', () => {
    expect(normalizeLocation('bengaluru')).toBe('Bangalore');
  });
});
```

## 🏗️ Best Practices

### 1. **Single Responsibility**
Each service should have one clear purpose:
- ✅ `locationService` → Location operations
- ❌ `utilityService` → Generic everything

### 2. **Error Handling**
Always handle errors gracefully:
```typescript
export async function fetchData() {
  try {
    const response = await fetch(url);
    return await response.json();
  } catch (error) {
    logger.error('Failed to fetch data', error);
    return null; // or throw custom error
  }
}
```

### 3. **Logging**
Use the centralized logger:
```typescript
import { logger } from '@/utils/logger';

logger.info('Operation successful', { userId: '123' });
logger.error('Operation failed', error, { context: 'service name' });
```

### 4. **Pure Functions**
Prefer pure functions when possible:
```typescript
// ✅ Good - pure function
export function calculateTotal(items: Item[]): number {
  return items.reduce((sum, item) => sum + item.price, 0);
}

// ❌ Avoid - side effects
let total = 0;
export function calculateTotal(items: Item[]): void {
  total = items.reduce((sum, item) => sum + item.price, 0);
}
```

### 5. **TypeScript Types**
Always provide strong types:
```typescript
// ✅ Good
export function processUser(user: User): ProcessedUser { ... }

// ❌ Avoid
export function processUser(user: any): any { ... }
```

### 6. **Documentation**
Use JSDoc for all exported functions:
```typescript
/**
 * Normalizes a location name to standard format
 * 
 * @param location - Raw location string
 * @returns Normalized location name
 * 
 * @example
 * ```typescript
 * normalizeLocation('bengaluru'); // Returns 'Bangalore'
 * ```
 */
export function normalizeLocation(location: string): string { ... }
```

## 🔄 Adding New Services

1. **Create the service file**:
```typescript
// src/services/myNewService.ts
import { logger } from '@/utils/logger';

export function myFunction(param: string): string {
  logger.info('myFunction called', { param });
  // Implementation
  return result;
}
```

2. **Add JSDoc documentation**

3. **Create unit tests**:
```typescript
// src/services/__tests__/myNewService.test.ts
import { describe, it, expect } from 'vitest';
import { myFunction } from '../myNewService';

describe('myNewService', () => {
  it('should work correctly', () => {
    expect(myFunction('test')).toBe('expected');
  });
});
```

4. **Update this README**

## 📖 Related Documentation

- [Types Documentation](../types/README.md)
- [Hooks Documentation](../hooks/README.md)
- [Configuration](../config/README.md)
- [Logging Utility](../utils/README.md#logger)

## 🤝 Contributing

When modifying services:
1. ✅ Add JSDoc comments
2. ✅ Handle errors gracefully
3. ✅ Use the logger utility
4. ✅ Write unit tests
5. ✅ Update this README
6. ✅ Follow TypeScript best practices

## 📝 Notes

- Services should be **stateless** - use React hooks for state management
- Keep services **focused** - one clear responsibility per service
- Use **constants** from `@/constants/app.constants.ts` instead of magic numbers
- **Log important operations** for debugging and monitoring
