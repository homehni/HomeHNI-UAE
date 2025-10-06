# Land/Plot Section on Search Results

This repo now includes a dedicated Land/Plot tab and section on the Property Search page.

What’s included:
- New tab “Land/Plot” beside Buy, Rent, Commercial.
- Filtering logic updated to show only land/plot properties when Land/Plot is active.
- A grouped view that displays properties under these headings:
  - Residential Plot
  - Agricultural Land
  - Industrial Land
  - Commercial Land
- Cards show Title, Location, Price, Area and basic type info.

Where it lives:
- UI tab and rendering: `src/pages/PropertySearch.tsx`
- Section component: `src/components/LandPlotSection.tsx`
- Search/filter hook: `src/hooks/useSimplifiedSearch.ts`

Extending features (optional):
- If your `properties` table contains land-specific columns (e.g., boundary_wall, road_width), fetch them in `LandPlotSection` and render as feature badges. The component is structured so you can add a Supabase select and display more fields without changing the parent page.

Notes:
- BHK, Furnishing, Age filters are hidden on the Land/Plot tab since they’re not relevant.
- Budget/Area filters remain available.

Acceptance criteria covered:
- Land/Plot appears next to Buy/Rent/Commercial.
- Section shows land types separately with property features available in the UI.

Future ideas:
- Add quick chips to filter only Agricultural/Industrial/Commercial land within the Land/Plot tab.
- Enable map view and draw polygon search for plots.
