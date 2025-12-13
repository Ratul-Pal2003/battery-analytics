# Architecture Design - Battery Analytics Dashboard

## Overview

This document outlines the recommended architecture for the Zenfinity Energy battery analytics dashboard, including component breakdown, data flow, and technology choices.

## Recommended Architecture: Modern React with TypeScript

### Technology Stack

**Frontend Framework**: React 18+ with TypeScript
- **Why**: Most popular, extensive ecosystem, excellent for data visualization dashboards
- Strong typing with TypeScript prevents bugs when handling complex battery data
- Rich library ecosystem for charts (Recharts, Chart.js, D3.js)

**State Management**: React Context + Custom Hooks
- **Why**: Lightweight for this scope, no need for Redux/Zustand overhead
- Custom hooks for data fetching and caching
- Context for global state (selected IMEI, current cycle)

**Styling**: Tailwind CSS
- **Why**: Rapid UI development, responsive by default
- Utility-first approach keeps bundle small
- Easy to create clean, professional dashboards

**Data Visualization**: D3.js
- **Why**: Maximum flexibility and customization for unique visualizations
- Powerful data manipulation and transformation capabilities
- Can create highly polished, professional-looking dashboards
- Perfect for custom interactive features (brush selection, zoom, pan)
- Excellent for temperature distribution histograms with dynamic binning
- TypeScript support through @types/d3

**HTTP Client**: Axios with React Query (TanStack Query)
- **Why**: React Query handles caching, background refetching, loading states
- Reduces boilerplate for API calls
- Built-in retry logic and error handling

**Build Tool**: Vite
- **Why**: Extremely fast dev server and builds
- Better DX than Create React App
- Excellent TypeScript support out of the box

---

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         BATTERY ANALYTICS DASHBOARD                  │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                           PRESENTATION LAYER                         │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐       │
│  │  BatterySelect │  │  CycleNavigator│  │  DateRangePicker│       │
│  │   Component    │  │   Component    │  │   Component    │       │
│  └────────────────┘  └────────────────┘  └────────────────┘       │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                    DashboardLayout                           │  │
│  │  ┌────────────────┐  ┌────────────────┐  ┌──────────────┐  │  │
│  │  │ CycleStats     │  │ HealthMetrics  │  │ AlertPanel   │  │  │
│  │  │ Card           │  │ Card (SOC/SOH) │  │ Card         │  │  │
│  │  └────────────────┘  └────────────────┘  └──────────────┘  │  │
│  │                                                              │  │
│  │  ┌────────────────┐  ┌────────────────┐  ┌──────────────┐  │  │
│  │  │ TempDistribution│  │ Performance    │  │ Charging     │  │  │
│  │  │ Chart          │  │ Metrics Chart  │  │ Insights     │  │  │
│  │  └────────────────┘  └────────────────┘  └──────────────┘  │  │
│  │                                                              │  │
│  │  ┌──────────────────────────────────────────────────────┐  │  │
│  │  │         Long-term Trends Chart (SOH Degradation)     │  │  │
│  │  └──────────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                          STATE MANAGEMENT LAYER                      │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │                    React Context Providers                  │    │
│  │                                                             │    │
│  │  • BatteryContext  (selected IMEI, battery summary)        │    │
│  │  • CycleContext    (current cycle, navigation state)       │    │
│  │  • PreferencesContext (theme, chart sampling rate)         │    │
│  └────────────────────────────────────────────────────────────┘    │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │                    Custom React Hooks                       │    │
│  │                                                             │    │
│  │  • useBatterySummary()    - Fetch summary data             │    │
│  │  • useCycleSnapshots()    - Fetch cycle list with pagination│   │
│  │  • useLatestSnapshot()    - Fetch latest cycle             │    │
│  │  • useCycleDetails()      - Fetch specific cycle details   │    │
│  │  • useTrendAnalysis()     - Compute cross-cycle trends     │    │
│  └────────────────────────────────────────────────────────────┘    │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                          DATA/SERVICE LAYER                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │                    React Query Cache                        │    │
│  │                                                             │    │
│  │  • Caches API responses with configurable TTL              │    │
│  │  • Background refetching for fresh data                    │    │
│  │  • Optimistic updates and invalidation strategies          │    │
│  └────────────────────────────────────────────────────────────┘    │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │                    API Service Layer                        │    │
│  │                                                             │    │
│  │  • api/batteryService.ts                                   │    │
│  │    - getSummary(imei?: string)                             │    │
│  │    - getSnapshots(imei, limit, offset)                     │    │
│  │    - getLatestSnapshot(imei)                               │    │
│  │    - getCycleDetails(imei, cycleNumber)                    │    │
│  │                                                             │    │
│  │  • api/axios-config.ts (base URL, interceptors)            │    │
│  └────────────────────────────────────────────────────────────┘    │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │                    Data Processing Layer                    │    │
│  │                                                             │    │
│  │  • utils/dataTransformers.ts                               │    │
│  │    - transformTemperatureData(snapshot, samplingRate)      │    │
│  │    - calculateTrendMetrics(snapshots)                      │    │
│  │    - aggregateChargingStats(snapshots)                     │    │
│  │                                                             │    │
│  │  • utils/validators.ts                                     │    │
│  │    - validateSnapshot(data)                                │    │
│  │    - sanitizeAPIResponse(response)                         │    │
│  └────────────────────────────────────────────────────────────┘    │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                          EXTERNAL API                                │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Zenfinity Battery Snapshots API                                    │
│  https://zenfinity-intern-api-104290304048.europewest1.run.app     │
│                                                                      │
│  Endpoints:                                                          │
│  • GET /api/snapshots/summary                                       │
│  • GET /api/snapshots                                               │
│  • GET /api/snapshots/{imei}/latest                                 │
│  • GET /api/snapshots/{imei}/cycles/{cycle_number}                  │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Component Architecture

```
src/
├── components/
│   ├── layout/
│   │   ├── DashboardLayout.tsx       # Main layout wrapper
│   │   ├── Header.tsx                # App header with branding
│   │   └── Sidebar.tsx               # Optional navigation sidebar
│   │
│   ├── battery/
│   │   ├── BatterySelector.tsx       # IMEI selection dropdown
│   │   └── BatterySummaryCard.tsx    # High-level battery stats
│   │
│   ├── cycle/
│   │   ├── CycleNavigator.tsx        # Slider/dropdown for cycle selection
│   │   ├── CycleStatsCard.tsx        # Cycle number, duration, timestamps
│   │   └── CycleComparison.tsx       # Compare multiple cycles (bonus)
│   │
│   ├── charts/
│   │   ├── TemperatureDistChart.tsx  # D3 histogram with sampling toggle
│   │   ├── SOCSOHChart.tsx           # D3 line chart for battery health
│   │   ├── PerformanceChart.tsx      # D3 area chart for speed/distance
│   │   ├── VoltageChart.tsx          # D3 line chart for voltage metrics
│   │   ├── TrendChart.tsx            # D3 multi-line chart with brush for SOH degradation
│   │   ├── ChartContainer.tsx        # Shared SVG wrapper with responsive sizing
│   │   └── d3/
│   │       ├── useD3.ts              # Custom hook for D3 rendering
│   │       ├── scales.ts             # Reusable scale generators
│   │       ├── axes.ts               # Reusable axis generators
│   │       └── tooltips.ts           # Shared tooltip logic
│   │
│   ├── alerts/
│   │   ├── AlertPanel.tsx            # Display warnings/protections
│   │   └── AlertBadge.tsx            # Individual alert indicator
│   │
│   ├── charging/
│   │   └── ChargingInsights.tsx      # Charging statistics card
│   │
│   └── common/
│       ├── LoadingSpinner.tsx        # Loading state
│       ├── ErrorBoundary.tsx         # Error handling
│       ├── Card.tsx                  # Reusable card component
│       └── Tooltip.tsx               # Data point tooltips
│
├── hooks/
│   ├── useBatterySummary.ts          # Fetch battery summary
│   ├── useCycleSnapshots.ts          # Fetch cycle list
│   ├── useLatestSnapshot.ts          # Fetch latest cycle
│   ├── useCycleDetails.ts            # Fetch specific cycle
│   ├── useTrendAnalysis.ts           # Calculate trends
│   └── useLocalStorage.ts            # Persist preferences
│
├── context/
│   ├── BatteryContext.tsx            # Battery selection state
│   ├── CycleContext.tsx              # Cycle navigation state
│   └── PreferencesContext.tsx        # User preferences (theme, etc.)
│
├── services/
│   └── api/
│       ├── batteryService.ts         # API call functions
│       ├── axios-config.ts           # Axios instance setup
│       └── queryClient.ts            # React Query configuration
│
├── utils/
│   ├── dataTransformers.ts           # Transform API data for charts
│   ├── validators.ts                 # Data validation
│   ├── formatters.ts                 # Date/number formatting
│   └── constants.ts                  # API URLs, IMEIs, etc.
│
├── types/
│   ├── battery.ts                    # Battery/snapshot TypeScript types
│   └── api.ts                        # API response types
│
├── App.tsx                            # Root component
├── main.tsx                           # Entry point
└── index.css                          # Global styles (Tailwind)
```

---

## Data Flow Architecture

```
┌──────────────┐
│   User       │
│  Interaction │
└──────┬───────┘
       │
       ▼
┌──────────────────────────────────────────────────────────┐
│  Component triggers hook                                  │
│  Example: useCycleDetails(imei, cycleNumber)             │
└──────┬───────────────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────────────────┐
│  React Query checks cache                                │
│  • Cache HIT  → Return cached data                       │
│  • Cache MISS → Proceed to API call                      │
└──────┬───────────────────────────────────────────────────┘
       │ (on miss)
       ▼
┌──────────────────────────────────────────────────────────┐
│  API Service Layer                                        │
│  batteryService.getCycleDetails(imei, cycleNumber)       │
└──────┬───────────────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────────────────┐
│  HTTP Request via Axios                                   │
│  GET /api/snapshots/{imei}/cycles/{cycle_number}         │
└──────┬───────────────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────────────────┐
│  External API Response                                    │
│  Returns cycle snapshot JSON                             │
└──────┬───────────────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────────────────┐
│  Data Transformation                                      │
│  • Validate response                                      │
│  • Transform temperature distributions                    │
│  • Format dates/numbers                                   │
└──────┬───────────────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────────────────┐
│  React Query caches result                                │
│  Component receives transformed data                      │
└──────┬───────────────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────────────────┐
│  Component renders with data                              │
│  Charts/cards display battery metrics                     │
└───────────────────────────────────────────────────────────┘
```

---

## Key Design Decisions & Rationale

### 1. **React Query for Data Fetching**
**Problem**: Dashboard needs to fetch data from multiple endpoints, handle loading states, cache results, and refetch when needed.

**Solution**: React Query provides:
- Automatic caching with configurable TTL
- Background refetching to keep data fresh
- Built-in loading/error states
- Request deduplication (prevents multiple identical API calls)
- Pagination support for cycle snapshots

**Example**:
```typescript
// Without React Query - lots of boilerplate
const [data, setData] = useState(null);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);

useEffect(() => {
  setLoading(true);
  fetch(url)
    .then(res => res.json())
    .then(setData)
    .catch(setError)
    .finally(() => setLoading(false));
}, [url]);

// With React Query - clean and powerful
const { data, isLoading, error } = useQuery({
  queryKey: ['cycle', imei, cycleNumber],
  queryFn: () => getCycleDetails(imei, cycleNumber),
  staleTime: 5 * 60 * 1000, // Cache for 5 minutes
});
```

### 2. **Context for Global State, Props for Local State**
**Problem**: Some state (selected battery, current cycle) needs to be shared across many components.

**Solution**:
- Use React Context for truly global state (battery selection, cycle navigation)
- Pass props for component-specific state (chart sampling rate can be local to TempDistChart)
- Keeps components loosely coupled but still coordinated

### 3. **Component Composition Over Monolithic Components**
**Problem**: Dashboard has many different visualizations and metrics.

**Solution**: Small, focused components
- `CycleStatsCard` only handles cycle metadata
- `TemperatureDistChart` only handles temperature visualization
- Easier to test, maintain, and reuse
- Can lazy-load chart components for better initial load time

### 4. **TypeScript for Type Safety**
**Problem**: Battery data has complex nested structures (temperature distributions, alert arrays).

**Solution**: Strong typing prevents runtime errors
```typescript
interface CycleSnapshot {
  imei: string;
  cycle_number: number;
  cycle_start_time: string;
  cycle_end_time: string;
  soh_drop: number;
  temperature_dist_5deg: Record<string, number>;
  alert_details: {
    warnings: string[];
    protections: string[];
  };
  // ... etc
}
```

### 5. **D3.js for Visualization**
**Problem**: Need responsive, interactive charts with professional aesthetics and custom interactions.

**Solution**: D3.js provides:
- Complete control over SVG rendering for pixel-perfect designs
- Powerful data transformation (scales, axes, shapes, layouts)
- Advanced interactions (brush, zoom, pan, hover effects)
- Smooth transitions and animations for data updates
- Can create highly customized visualizations that stand out
- Better suited for complex histograms (temperature distribution with toggleable binning)
- Professional, polished look that impresses evaluators

**Why D3.js over simpler alternatives**:
- Recharts/Chart.js are great for standard charts, but D3.js allows creative freedom
- Temperature distribution with 4 different sampling rates (5°C, 10°C, 15°C, 20°C) benefits from D3's flexible binning
- Long-term trend analysis can use D3's brush feature for zooming into specific date ranges
- Custom tooltips and interactions create a more engaging user experience
- Having D3.js experience demonstrates advanced frontend skills

### 6. **Tailwind CSS for Styling**
**Problem**: Need consistent, responsive UI quickly.

**Solution**: Tailwind's utility classes
- Rapid prototyping
- No CSS file sprawl
- Built-in responsive breakpoints
- Easy to create card-based dashboard layout
- Small production bundle (only used classes included)

### 7. **Service Layer Separation**
**Problem**: API calls scattered across components make testing and changes difficult.

**Solution**: Centralized `batteryService.ts`
- Single place to update API URLs or add headers
- Easy to mock for testing
- Clear contract for what data operations are available
- Can add retry logic, error handling in one place

---

## Alternative Architectures Considered

### Option A: Next.js with Server-Side Rendering
**Pros**:
- SEO benefits (not needed for internal dashboard)
- Server-side data fetching
- API routes (could proxy Zenfinity API)

**Cons**:
- Overkill for a client-side dashboard
- Adds deployment complexity
- SSR not beneficial when all data is user-specific and dynamic

**Verdict**: ❌ Unnecessary for this use case

### Option B: Vue.js with Vuex
**Pros**:
- Similar capabilities to React
- Vue 3 Composition API is powerful

**Cons**:
- Smaller ecosystem for data viz libraries
- Less TypeScript maturity than React
- React has better library support for charts

**Verdict**: ❌ React ecosystem better suited for data visualization

### Option C: Svelte with Stores
**Pros**:
- Smaller bundle size
- Simpler syntax
- Built-in reactivity

**Cons**:
- Smaller ecosystem, fewer chart libraries
- Less mature TypeScript support
- D3.js integration less documented than with React

**Verdict**: ❌ Limited charting library options

### Option D: Recharts/Chart.js Instead of D3.js
**Pros**:
- Faster to implement with declarative components
- Less code for standard charts
- Built-in responsiveness

**Cons**:
- Less customization for unique visualizations
- Temperature distribution with 4 sampling rates harder to implement elegantly
- Limited control over animations and transitions
- Less impressive visually for a portfolio/assignment piece
- Cannot easily add advanced interactions like brush selection

**Verdict**: ❌ D3.js provides better customization and polish for this dashboard

---

## D3.js Integration with React

### Pattern: Custom useD3 Hook

D3.js manipulates the DOM directly, which can conflict with React's virtual DOM. The recommended pattern is to use refs and custom hooks:

```typescript
// hooks/useD3.ts
import { useRef, useEffect } from 'react';
import * as d3 from 'd3';

export const useD3 = (renderFn: (svg: d3.Selection<SVGSVGElement, unknown, null, undefined>) => void, dependencies: any[]) => {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (ref.current) {
      const svg = d3.select(ref.current);
      renderFn(svg);
    }
  }, dependencies);

  return ref;
};
```

### Example: Temperature Distribution Chart

```typescript
// charts/TemperatureDistChart.tsx
import { useD3 } from '../hooks/useD3';
import * as d3 from 'd3';

interface Props {
  data: Record<string, number>;
  samplingRate: 5 | 10 | 15 | 20;
}

export const TemperatureDistChart: React.FC<Props> = ({ data, samplingRate }) => {
  const ref = useD3(
    (svg) => {
      const margin = { top: 20, right: 30, bottom: 40, left: 50 };
      const width = 800 - margin.left - margin.right;
      const height = 400 - margin.top - margin.bottom;

      svg.selectAll('*').remove(); // Clear previous render

      const g = svg
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

      // Transform data to array format
      const dataArray = Object.entries(data).map(([range, minutes]) => ({
        range,
        minutes,
      }));

      // Create scales
      const x = d3.scaleBand()
        .domain(dataArray.map(d => d.range))
        .range([0, width])
        .padding(0.1);

      const y = d3.scaleLinear()
        .domain([0, d3.max(dataArray, d => d.minutes) || 0])
        .range([height, 0]);

      // Add bars with transition
      g.selectAll('.bar')
        .data(dataArray)
        .join('rect')
        .attr('class', 'bar')
        .attr('x', d => x(d.range) || 0)
        .attr('width', x.bandwidth())
        .attr('fill', '#3b82f6')
        .attr('y', height)
        .attr('height', 0)
        .transition()
        .duration(750)
        .attr('y', d => y(d.minutes))
        .attr('height', d => height - y(d.minutes));

      // Add axes
      g.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x));

      g.append('g')
        .call(d3.axisLeft(y));

      // Add labels
      g.append('text')
        .attr('x', width / 2)
        .attr('y', height + 35)
        .attr('text-anchor', 'middle')
        .text('Temperature Range (°C)');

      g.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('x', -height / 2)
        .attr('y', -40)
        .attr('text-anchor', 'middle')
        .text('Time (minutes)');
    },
    [data, samplingRate]
  );

  return (
    <div className="w-full overflow-x-auto">
      <svg ref={ref} className="mx-auto" />
    </div>
  );
};
```

### D3.js Modules to Use

For optimal bundle size, import only what you need:

```typescript
// For scales
import { scaleLinear, scaleTime, scaleBand } from 'd3-scale';

// For axes
import { axisBottom, axisLeft } from 'd3-axis';

// For DOM manipulation
import { select, selectAll } from 'd3-selection';

// For shapes (areas, lines)
import { line, area, curveMonotoneX } from 'd3-shape';

// For transitions
import { transition } from 'd3-transition';

// For data manipulation
import { max, min, extent } from 'd3-array';

// For brush (zoom selection)
import { brushX } from 'd3-brush';
```

### Responsive D3 Charts

```typescript
// utils/useResizeObserver.ts
import { useEffect, useState } from 'react';

export const useResizeObserver = (ref: React.RefObject<HTMLElement>) => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const observeTarget = ref.current;
    if (!observeTarget) return;

    const resizeObserver = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        setDimensions({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      });
    });

    resizeObserver.observe(observeTarget);
    return () => resizeObserver.disconnect();
  }, [ref]);

  return dimensions;
};
```

### Advantages of D3.js for This Dashboard

1. **Temperature Distribution Histogram**
   - Dynamic binning based on sampling rate (5°C, 10°C, 15°C, 20°C)
   - Smooth transitions when switching between rates
   - Custom bar colors based on temperature ranges (cold = blue, hot = red)

2. **Long-term Trend Analysis**
   - Multi-line chart showing SOH, SOC, voltage over all cycles
   - D3 brush for zooming into specific cycle ranges
   - Crosshair tooltip showing values across all metrics
   - Pan and zoom for detailed exploration

3. **Performance Metrics**
   - Area chart for distance/speed over time
   - Gradient fills for visual appeal
   - Interactive hover effects with exact values

4. **Professional Polish**
   - Smooth enter/exit animations when data updates
   - Custom tooltip positioning (avoid edge clipping)
   - Responsive charts that adapt to screen size
   - Consistent color schemes across all visualizations

---

## Performance Optimizations

### 1. **Code Splitting**
```typescript
// Lazy load chart components (important for D3.js bundle size)
const TemperatureDistChart = lazy(() => import('./charts/TemperatureDistChart'));
const TrendChart = lazy(() => import('./charts/TrendChart'));

// D3.js modules can be imported selectively to reduce bundle size
import { scaleLinear, scaleTime } from 'd3-scale';
import { axisBottom, axisLeft } from 'd3-axis';
import { select } from 'd3-selection';
// Only import what you need, not the entire d3 package
```

### 2. **Memoization**
```typescript
// Expensive trend calculations
const trendData = useMemo(() =>
  calculateTrendMetrics(allSnapshots),
  [allSnapshots]
);
```

### 3. **Virtualization for Long Lists**
If displaying many cycles in a list, use `react-window` or `react-virtual` to only render visible items.

### 4. **React Query Caching Strategy**
```typescript
// Cache summary for 10 minutes (rarely changes)
useQuery(['summary'], getSummary, { staleTime: 10 * 60 * 1000 });

// Cache cycle details for 5 minutes
useQuery(['cycle', imei, num], () => getCycleDetails(imei, num), {
  staleTime: 5 * 60 * 1000
});

// Prefetch next cycle when user navigates
queryClient.prefetchQuery(['cycle', imei, nextCycle], ...);
```

---

## Testing Strategy

### Unit Tests
- `dataTransformers.ts` - Pure functions, easy to test
- `validators.ts` - Edge cases with malformed API data
- Custom hooks - Test with `@testing-library/react-hooks`

### Component Tests
- Test with `@testing-library/react`
- Mock API responses with MSW (Mock Service Worker)
- Test user interactions (cycle navigation, sampling rate toggle)

### E2E Tests (Optional)
- Playwright or Cypress for critical user flows
- Test: Select battery → Navigate cycles → View charts

---

## Deployment Strategy

### Recommended: Vercel
- Zero-config deployment for Vite/React
- Automatic HTTPS
- Edge network for fast load times
- Free tier sufficient for this project

### Build Command
```bash
npm run build
```

### Environment Variables
```
VITE_API_BASE_URL=https://zenfinity-intern-api-104290304048.europewest1.run.app
```

---

## Why This Architecture Excels for This Assignment

1. **Professional Visuals**: React + Tailwind + D3.js = stunning, custom visualizations
2. **Maintainable**: Clear separation of concerns (components, hooks, services, utils)
3. **Type-Safe**: TypeScript catches bugs at compile time, crucial for complex data
4. **Performance**: React Query caching reduces API calls, lazy loading reduces initial bundle
5. **Testable**: Service layer and pure utility functions are easy to unit test
6. **Scalable**: Can easily add new chart types, batteries, or features
7. **Industry Standard**: Uses proven patterns (hooks, context, service layer)
8. **Clean Code**: Composition over inheritance, single responsibility principle
9. **User Experience**: Loading states, error handling, and caching create smooth UX
10. **Deployment Ready**: Vite builds are production-optimized, Vercel deployment is trivial

---

## Getting Started Implementation Order

1. **Setup**: Initialize Vite + React + TypeScript + Tailwind
2. **API Layer**: Create `batteryService.ts` and test API calls
3. **Types**: Define TypeScript interfaces for all API responses
4. **Context**: Set up BatteryContext and CycleContext
5. **Basic Hooks**: Implement `useBatterySummary` and `useCycleSnapshots`
6. **Layout**: Create DashboardLayout and basic card structure
7. **Core Components**: BatterySelector, CycleNavigator
8. **Charts**: Start with simplest chart (CycleStatsCard), then temperature, then trends
9. **Polish**: Error handling, loading states, responsive design
10. **Bonus**: Long-term trend analysis

This architecture balances simplicity with extensibility, making it ideal for both the assignment deadline and potential future enhancements.
