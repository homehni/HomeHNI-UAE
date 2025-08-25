# Geo-Routing Implementation

## Overview
This implements automatic geo-routing for HomeHNI's multi-domain setup, redirecting users from `homehni.com` to their appropriate country domain.

## Domains
- `homehni.com` (global default)
- `homehni.in` (India) 
- `homehni.us` (United States)
- `homehni.co.uk` (United Kingdom)
- `homehni.de` (Germany)
- `homehni.ae` (United Arab Emirates)
- `homehni.co.za` (South Africa)
- `homehni.it` (Italy)
- `homehni.fr` (France)
- `homehni.ca` (Canada)
- `homehni.com.au` (Australia)

## How It Works

### 1. Pre-bundle Redirect Script
Located in `index.html`, runs before React loads for fast redirects:

**Priority Order:**
1. `?country=XX` URL parameter (saves preference)
2. Saved user preference in localStorage
3. Browser language detection (`navigator.language`)
4. Stay on global domain

### 2. Country Switcher Component
React component (`CountrySwitcher.tsx`) that can be added to any page:
- Dropdown with all available countries + Global option
- Saves user preference to localStorage
- Redirects to selected domain

### 3. Feature Flag
Set `window.__ENABLE_GEO__ = false` in `index.html` to disable geo-routing entirely.

## Testing

### Manual Country Override
```
https://homehni.com/?country=IN  → redirects to homehni.in
https://homehni.com/?country=US  → redirects to homehni.us
https://homehni.com/?country=DE  → redirects to homehni.de
```

### Clear Saved Preference
```javascript
localStorage.removeItem("homehni_country_pref_v1")
```

### Test Browser Language Detection
1. Clear localStorage preference
2. Set browser language to `en-US` 
3. Visit `homehni.com` → should redirect to `homehni.us`

### Test Country Switcher
1. Add `<CountrySwitcher />` to header component
2. Select different countries from dropdown
3. Verify redirects and preference persistence

## Usage

### Add CountrySwitcher to Header
```jsx
import CountrySwitcher from '@/components/CountrySwitcher';

// In your header component:
<CountrySwitcher />
```

### Disable Geo-Routing
In `index.html`, change:
```javascript
window.__ENABLE_GEO__ = false;
```

## Safety Features
- Only runs on `homehni.com` hostname
- Feature flag for easy disable
- No changes to existing app logic
- Graceful fallbacks if domains don't exist