# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a battery analytics dashboard for the Zenfinity Energy Frontend Intern Assignment. The goal is to visualize battery telemetry data from cycle snapshots, showing how batteries are used/run in particular cycles and capturing variations over cycles.

## API Information

**Base URL**: `https://zenfinity-intern-api-104290304048.europe-west1.run.app`

**Authorized Battery IMEIs** (ONLY these are accessible):
- `865044073967657`
- `865044073949366`

**Endpoints**:
- `GET /api/snapshots/summary` - Summary of all accessible batteries (params: `imei` optional)
- `GET /api/snapshots` - List of cycle snapshots (params: `imei` required, `limit` default 100, `offset` default 0)
- `GET /api/snapshots/{imei}/latest` - Most recent cycle snapshot
- `GET /api/snapshots/{imei}/cycles/{cycle_number}` - Detailed analytics for specific cycle

## Key Data Fields

Each cycle snapshot contains:
- **Cycle Info**: `cycle_number`, `cycle_start_time`, `cycle_end_time`, `cycle_duration_hours`
- **Battery Health**: `soh_drop`, `average_soc`, `min_soc`, `max_soc`
- **Temperature**: `average_temperature`, `temperature_dist_5deg`, `temperature_dist_10deg`, `temperature_dist_15deg`, `temperature_dist_20deg`
  - Temperature distributions show minutes spent in temperature ranges (e.g., `"20-25": 10.5` = 10.5 minutes between 20°C and 25°C)
- **Performance**: `total_distance`, `average_speed`, `max_speed`
- **Charging**: `charging_instances_count`, `average_charge_start_soc`
- **Voltage**: `voltage_avg`, `voltage_min`, `voltage_max`
- **Safety**: `alert_details` with `warnings` and `protections` arrays

## Dashboard Requirements

### Core Features (Part 2)
1. **Cycle Navigation**: Slider/dropdown to navigate between cycles
2. **Cycle Statistics**: Display cycle number, start/end time, duration
3. **Performance Metrics**: Visualize speed and distance (note: GPS data may have gaps)
4. **Temperature Distribution**: Histogram with toggle between 5°C, 10°C, 15°C, 20°C sampling rates
5. **Battery Health**: SOC and SOH trend visualizations
6. **Alerts & Safety**: Clear display of protections and warnings
7. **Charging Insights**: Charging event statistics
8. **Additional Insights**: Any other discovered patterns

### Bonus Features (Part 3)
9. **Long-term Trends**: Cross-cycle analysis (e.g., SOH degradation over all cycles)

## Technical Context

- **Battery Chemistry**: Li-ion LFP (Lithium Iron Phosphate)
- **Framework**: Use React, Vue, Svelte, or any modern framework
- **Design Priority**: Simple, functional, clean, and intuitive over complex/flashy
- **Deployment**: Should be deployable to Vercel, Netlify, or similar platforms

## Architecture

This project uses **React + TypeScript + D3.js** architecture. See `ARCHITECTURE.md` for:
- Complete system architecture diagrams
- Component structure and data flow
- D3.js integration patterns with React
- Technology stack rationale
- Performance optimization strategies

**Key Technologies**:
- **Frontend**: React 18+ with TypeScript
- **Visualization**: D3.js (for custom, professional charts)
- **State Management**: React Query + Context API
- **Styling**: Tailwind CSS
- **Build Tool**: Vite

## Development Commands

```bash
npm run dev          # Start development server (http://localhost:5173)
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

**Important**: The development server runs on `http://localhost:5173` by default.
