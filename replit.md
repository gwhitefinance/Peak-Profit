# Overview

Peak Profit is a comprehensive trading platform built with React, TypeScript, and modern web technologies. The application provides traders with real-time market data, portfolio management, trading tools, and payout systems. It features a sophisticated dashboard with live price feeds, charting capabilities, watchlist management, and performance analytics.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety
- **Build Tool**: Vite for fast development and optimized builds
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom dark theme configuration
- **Routing**: React Router for client-side navigation
- **State Management**: Zustand for lightweight state management, React Query for server state

## Real-Time Data Integration
- **WebSocket Connections**: Multiple WebSocket services for live market data
  - Polygon.io for stock market data
  - Alpaca for trading data
  - Custom WebSocket handlers with automatic reconnection
- **Data Caching**: In-memory caching with Map structures for quote storage
- **Live Updates**: Real-time price feeds with subscription management

## Trading Features
- **TradingView Integration**: Professional charting with custom datafeed implementation
- **Watchlist System**: Local storage-based watchlist with live price updates
- **Order Management**: Position tracking, pending orders, and trade execution panels
- **Risk Management**: Stop-loss, take-profit, and position sizing tools

## Dashboard & Analytics
- **Performance Charts**: Recharts library for account performance visualization
- **Trading Statistics**: P&L calendars, pie charts, and performance metrics
- **Real-Time Tickers**: Live market data displays with performance indicators

## Data Storage
- **Local Storage**: Watchlist persistence and user preferences
- **Session Storage**: Temporary trading data and UI state
- **Database Schema**: Drizzle ORM with Neon PostgreSQL integration configured but not actively used

# External Dependencies

## Market Data Providers
- **Polygon.io**: Primary market data source for stocks, crypto, and forex
- **Alpaca Markets**: Trading data and broker integration
- **TradingView**: Advanced charting widgets and technical analysis tools

## UI & Visualization
- **Radix UI**: Accessible component primitives
- **Recharts**: Chart and visualization library
- **Lucide React**: Icon library
- **React Sketch Canvas**: Drawing tools for chart annotations

## Infrastructure
- **Supabase**: Backend services and authentication (configured)
- **Neon Database**: PostgreSQL database with Drizzle ORM
- **WebSocket APIs**: Real-time data connections

## Development Tools
- **ESLint**: Code linting with TypeScript support
- **Tailwind CSS**: Utility-first styling framework
- **PostCSS**: CSS processing and optimization

The application follows a modular component architecture with clear separation between data fetching, state management, and UI components. The trading interface prioritizes real-time updates and professional-grade tools while maintaining a responsive design across devices.