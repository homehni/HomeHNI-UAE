# Hooks

Custom React hooks for the HomeHNI application.

## 📁 Structure

```
hooks/
├── useSimplifiedSearch.ts  # Property search logic and state management
├── useDebounce.ts          # Debounce hook for input delays
└── README.md              # This file
```

## 🎯 Purpose

Custom hooks encapsulate:
- **Stateful Logic**: Complex state management
- **Side Effects**: Data fetching, subscriptions, etc.
- **Reusable Behavior**: Logic shared across components
- **Performance Optimization**: Memoization, debouncing

## 📚 Hook Documentation

### useSimplifiedSearch.ts

**Purpose**: Manages property search state, filters, and data fetching

**Features**:
- ✅ Real-time Supabase subscriptions
- ✅ Batch loading (50 properties at a time)
- ✅ Multi-location filtering (up to 3 locations)
- ✅ Tab-based filtering (rent/buy/commercial)
- ✅ Budget range filtering
- ✅ Property type filtering
- ✅ Load more pagination

**Usage Example**:
```typescript
import { useSimplifiedSearch } from '@/hooks/useSimplifiedSearch';

function PropertySearch() {
  const {
    filters,
    activeTab,
    setActiveTab,
    filteredProperties,
    updateFilter,
    clearAllFilters,
    availableLocalities,
    isLoading,
    loadMoreProperties,
    hasMore,
    propertyCount
  } = useSimplifiedSearch();

  return (
    <div>
      <button onClick={() => setActiveTab('rent')}>Rent</button>
      <button onClick={() => updateFilter('bhkType', ['2 BHK'])}>2 BHK</button>
      {filteredProperties.map(property => (
        <PropertyCard key={property.id} property={property} />
      ))}
      {hasMore && <button onClick={loadMoreProperties}>Load More</button>}
    </div>
  );
}
```

**Return Values**:
| Property | Type | Description |
|----------|------|-------------|
| `filters` | `SearchFilters` | Current active filters |
| `activeTab` | `'rent' \| 'buy' \| 'commercial'` | Active listing tab |
| `setActiveTab` | `(tab) => void` | Change active tab |
| `filteredProperties` | `Property[]` | Filtered property list |
| `updateFilter` | `(key, value) => void` | Update a filter value |
| `clearAllFilters` | `() => void` | Reset all filters |
| `availableLocalities` | `string[]` | Available locality options |
| `isLoading` | `boolean` | Loading state |
| `loadMoreProperties` | `() => Promise<void>` | Load next batch |
| `hasMore` | `boolean` | More properties available |
| `propertyCount` | `number` | Total property count |

**Performance Optimizations**:
- Memoized filter operations with `useMemo`
- Callback memoization with `useCallback`
- Batch loading to reduce initial load time
- Real-time updates via Supabase subscriptions

---

### useDebounce.ts

**Purpose**: Debounce rapidly changing values (e.g., search input)

**Features**:
- ✅ Prevents excessive API calls
- ✅ Configurable delay
- ✅ TypeScript generic support
- ✅ Cleanup on unmount

**Usage Example**:
```typescript
import { useDebounce } from '@/hooks/useDebounce';

function SearchInput() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    // This will only run 300ms after user stops typing
    if (debouncedSearchTerm) {
      searchAPI(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm]);

  return (
    <input 
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
  );
}
```

**Parameters**:
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `value` | `T` | Required | The value to debounce |
| `delay` | `number` | `500` | Delay in milliseconds |

**Returns**: Debounced value of type `T`

## 🧪 Testing Hooks

**Option 1: Using @testing-library/react-hooks** (Recommended)
```typescript
import { renderHook, act } from '@testing-library/react-hooks';
import { useDebounce } from '../useDebounce';

describe('useDebounce', () => {
  it('should debounce value', async () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 300 } }
    );

    expect(result.current).toBe('initial');

    rerender({ value: 'updated', delay: 300 });
    expect(result.current).toBe('initial'); // Still initial

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 350));
    });

    expect(result.current).toBe('updated'); // Now updated
  });
});
```

**Option 2: Testing within a component**
```typescript
import { render, screen, waitFor } from '@testing-library/react';
import { useDebounce } from '../useDebounce';

function TestComponent({ value }: { value: string }) {
  const debouncedValue = useDebounce(value, 300);
  return <div>{debouncedValue}</div>;
}

describe('useDebounce in component', () => {
  it('should work', async () => {
    const { rerender } = render(<TestComponent value="initial" />);
    expect(screen.getByText('initial')).toBeInTheDocument();

    rerender(<TestComponent value="updated" />);
    expect(screen.getByText('initial')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('updated')).toBeInTheDocument();
    }, { timeout: 400 });
  });
});
```

## 🏗️ Best Practices

### 1. **Hook Naming**
Always prefix custom hooks with `use`:
```typescript
// ✅ Good
export function useDebounce<T>(value: T, delay: number): T { ... }

// ❌ Bad
export function debounce<T>(value: T, delay: number): T { ... }
```

### 2. **Dependencies**
Always specify all dependencies correctly:
```typescript
// ✅ Good
useEffect(() => {
  fetchData(userId);
}, [userId]);

// ❌ Bad - missing dependency
useEffect(() => {
  fetchData(userId);
}, []);
```

### 3. **Cleanup**
Clean up side effects to prevent memory leaks:
```typescript
useEffect(() => {
  const subscription = supabase
    .from('properties')
    .on('*', handleChange)
    .subscribe();

  return () => {
    subscription.unsubscribe(); // ✅ Cleanup
  };
}, []);
```

### 4. **Memoization**
Use `useMemo` and `useCallback` for performance:
```typescript
const filteredData = useMemo(
  () => data.filter(item => item.active),
  [data]
);

const handleClick = useCallback(
  () => updateData(id),
  [id]
);
```

### 5. **TypeScript Types**
Provide strong types for hook parameters and return values:
```typescript
interface UseSearchOptions {
  initialTab?: 'rent' | 'buy' | 'commercial';
  pageSize?: number;
}

interface UseSearchReturn {
  properties: Property[];
  isLoading: boolean;
  loadMore: () => Promise<void>;
}

export function useSearch(options: UseSearchOptions): UseSearchReturn {
  // Implementation
}
```

### 6. **Error Handling**
Handle errors within hooks:
```typescript
export function useDataFetch(url: string) {
  const [data, setData] = useState(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(url);
        const json = await response.json();
        setData(json);
        setError(null);
      } catch (err) {
        setError(err as Error);
        logger.error('Data fetch failed', err, { url });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, error, isLoading };
}
```

## 🔄 Creating New Hooks

1. **Create the hook file**:
```typescript
// src/hooks/useMyHook.ts
import { useState, useEffect } from 'react';
import { logger } from '@/utils/logger';

export function useMyHook(param: string) {
  const [value, setValue] = useState<string>('');

  useEffect(() => {
    logger.debug('useMyHook mounted', { param });
    // Logic here
    
    return () => {
      logger.debug('useMyHook cleanup');
    };
  }, [param]);

  return { value };
}
```

2. **Add JSDoc documentation**:
```typescript
/**
 * Custom hook for doing something specific
 * 
 * @param param - Description of parameter
 * @returns Object containing hook state and methods
 * 
 * @example
 * ```typescript
 * const { value } = useMyHook('test');
 * ```
 */
```

3. **Write tests** (optional but recommended)

4. **Update this README**

## 📖 Common Hook Patterns

### Data Fetching
```typescript
export function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetch(url)
      .then(res => res.json())
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [url]);

  return { data, loading, error };
}
```

### Local Storage
```typescript
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
}
```

### Window Size
```typescript
export function useWindowSize() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return size;
}
```

## 📝 Related Documentation

- [Services Documentation](../services/README.md)
- [Types Documentation](../types/README.md)
- [Components Documentation](../components/README.md)

## 🤝 Contributing

When creating or modifying hooks:
1. ✅ Follow the `useXxx` naming convention
2. ✅ Add comprehensive JSDoc comments
3. ✅ Include usage examples
4. ✅ Handle errors gracefully
5. ✅ Clean up side effects
6. ✅ Use TypeScript types
7. ✅ Update this README
