// src/lib/mockData.ts
// Trading Account Stats
export const accountStats = {
  balance: 0,
  equity: 0,
  profitLoss: 0,
  accountSize: 0,
  dailyChange: 7.0,
  weeklyChange: -4.8
};

// Account Performance Chart Data
export const accountPerformanceData = [
  { date: "2025-01-01", balance: 9000, equity: 8800 },
  { date: "2025-01-15", balance: 9200, equity: 9100 },
  { date: "2025-02-01", balance: 9800, equity: 9750 },
  { date: "2025-02-15", balance: 10200, equity: 10100 },
  { date: "2025-03-01", balance: 10800, equity: 10900 },
  { date: "2025-03-15", balance: 11500, equity: 11600 },
  { date: "2025-04-01", balance: 12000, equity: 12100 },
];

// Trading Challenges Data (updated for new page design)
export const tradingChallenges = [
  {
    id: 1,
    name: "Challenge 1",
    profit: 1200,
    drawdown: 200,
    eligibility: "Eligible",
    nextPayout: "Now",
    canRequestPayout: true,
    payoutRequested: false
  },
  {
    id: 2,
    name: "Challenge 2",
    profit: 1500,
    drawdown: 300,
    eligibility: "Eligible",
    nextPayout: "Now",
    canRequestPayout: false,
    payoutRequested: true
  },
  {
    id: 3,
    name: "Challenge 3",
    profit: 900,
    drawdown: 100,
    eligibility: "Not Eligible",
    nextPayout: "Now",
    canRequestPayout: false,
    payoutRequested: false
  },
  {
    id: 4,
    name: "FTMO $100K Challenge",
    profit: 5200,
    drawdown: 1800,
    eligibility: "Eligible",
    nextPayout: "2d 8h",
    canRequestPayout: true,
    payoutRequested: false
  },
  {
    id: 5,
    name: "FTMO $50K Challenge",
    profit: 2100,
    drawdown: 900,
    eligibility: "Not Eligible",
    nextPayout: "9d 8h",
    canRequestPayout: false,
    payoutRequested: false
  }
];

// Watchlist Stocks Data
export const watchlistStocks = [
  {
    id: 1,
    symbol: "AAPL",
    company: "Apple Inc.",
    price: 182,
    change: 2,
    changePercent: 1.36,
    strength: 85,
    strengthLabel: "Strong",
    volume: "64.2M",
    marketCap: "2.89T"
  },
  {
    id: 2,
    symbol: "TSLA",
    company: "Tesla Inc.",
    price: 248,
    change: -6,
    changePercent: -2.23,
    strength: 72,
    strengthLabel: "Moderate",
    volume: "112.8M",
    marketCap: "789.4B"
  },
  {
    id: 3,
    symbol: "GOOGL",
    company: "Alphabet Inc.",
    price: 138,
    change: 2,
    changePercent: 1.39,
    strength: 78,
    strengthLabel: "Moderate",
    volume: "28.9M",
    marketCap: "1.75T"
  },
  {
    id: 4,
    symbol: "MSFT",
    company: "Microsoft Corp.",
    price: 379,
    change: 4,
    changePercent: 1.13,
    strength: 91,
    strengthLabel: "Strong",
    volume: "32.1M",
    marketCap: "2.81T"
  },
  {
    id: 5,
    symbol: "AMZN",
    company: "Amazon.com Inc.",
    price: 144,
    change: -2,
    changePercent: -1.22,
    strength: 68,
    strengthLabel: "Moderate",
    volume: "45.6M",
    marketCap: "1.50T"
  },
  {
    id: 6,
    symbol: "NVDA",
    company: "NVIDIA Corp.",
    price: 875,
    change: 12,
    changePercent: 1.44,
    strength: 95,
    strengthLabel: "Strong",
    volume: "89.7M",
    marketCap: "2.15T"
  }
];

// Account Statistics Data
export const accountStatistics = {
  totalPnL: 15421,
  winRate: 68.5,
  avgWin: 246,
  avgLoss: -187,
  totalTrades: 127,
  winningTrades: 87,
  losingTrades: 40,
  bestTrade: 1250,
  worstTrade: -890,
  profitFactor: 1.85
};

// P.L Calendar Data (daily P&L for entire year)
export const plCalendarData = [
  // January 2025
  { date: "2025-01-02", pnl: 150 },
  { date: "2025-01-03", pnl: 220 },
  { date: "2025-01-06", pnl: -75 },
  { date: "2025-01-07", pnl: 350 },
  { date: "2025-01-08", pnl: 410 },
  { date: "2025-01-09", pnl: -125 },
  { date: "2025-01-10", pnl: 290 },
  { date: "2025-01-13", pnl: 55 },
  { date: "2025-01-14", pnl: 180 },
  { date: "2025-01-15", pnl: 650 },
  { date: "2025-01-16", pnl: -90 },
  { date: "2025-01-17", pnl: 320 },
  { date: "2025-01-20", pnl: 450 },
  { date: "2025-01-21", pnl: -210 },
  { date: "2025-01-22", pnl: 175 },
  { date: "2025-01-23", pnl: 800 },
  { date: "2025-01-24", pnl: -180 },
  { date: "2025-01-27", pnl: 260 },
  { date: "2025-01-28", pnl: 340 },
  { date: "2025-01-29", pnl: -50 },
  { date: "2025-01-30", pnl: 150 },
  { date: "2025-01-31", pnl: 280 },
  // February 2025
  { date: "2025-02-03", pnl: 400 },
  { date: "2025-02-04", pnl: 120 },
  { date: "2025-02-05", pnl: -230 },
  { date: "2025-02-06", pnl: 380 },
  { date: "2025-02-07", pnl: 210 },
  { date: "2025-02-10", pnl: -150 },
  { date: "2025-02-11", pnl: 500 },
  { date: "2025-02-12", pnl: 190 },
  { date: "2025-02-13", pnl: -60 },
  { date: "2025-02-14", pnl: 420 },
  { date: "2025-02-17", pnl: 300 },
  { date: "2025-02-18", pnl: -90 },
  { date: "2025-02-19", pnl: 170 },
  { date: "2025-02-20", pnl: 550 },
  { date: "2025-02-21", pnl: -310 },
  { date: "2025-02-24", pnl: 250 },
  { date: "2025-02-25", pnl: 140 },
  { date: "2025-02-26", pnl: -80 },
  { date: "2025-02-27", pnl: 290 },
  { date: "2025-02-28", pnl: 360 },
  // March 2025
  { date: "2025-03-03", pnl: 150 },
  { date: "2025-03-04", pnl: 450 },
  { date: "2025-03-05", pnl: -200 },
  { date: "2025-03-06", pnl: 520 },
  { date: "2025-03-07", pnl: -110 },
  { date: "2025-03-10", pnl: 300 },
  { date: "2025-03-11", pnl: 80 },
  { date: "2025-03-12", pnl: 240 },
  { date: "2025-03-13", pnl: -70 },
  { date: "2025-03-14", pnl: 480 },
  { date: "2025-03-17", pnl: 600 },
  { date: "2025-03-18", pnl: -160 },
  { date: "2025-03-19", pnl: 270 },
  { date: "2025-03-20", pnl: 390 },
  { date: "2025-03-21", pnl: -220 },
  { date: "2025-03-24", pnl: 410 },
  { date: "2025-03-25", pnl: 130 },
  { date: "2025-03-26", pnl: -90 },
  { date: "2025-03-27", pnl: 320 },
  { date: "2025-03-28", pnl: 580 },
  { date: "2025-03-31", pnl: -140 },
  // April 2025
  { date: "2025-04-01", pnl: 180 },
  { date: "2025-04-02", pnl: 450 },
  { date: "2025-04-03", pnl: -85 },
  { date: "2025-04-04", pnl: 210 },
  { date: "2025-04-07", pnl: 330 },
  { date: "2025-04-08", pnl: -170 },
  { date: "2025-04-09", pnl: 290 },
  { date: "2025-04-10", pnl: 520 },
  { date: "2025-04-11", pnl: -90 },
  { date: "2025-04-14", pnl: 650 },
  { date: "2025-04-15", pnl: 190 },
  { date: "2025-04-16", pnl: -250 },
  { date: "2025-04-17", pnl: 380 },
  { date: "2025-04-18", pnl: 410 },
  { date: "2025-04-21", pnl: -150 },
  { date: "2025-04-22", pnl: 300 },
  { date: "2025-04-23", pnl: 220 },
  { date: "2025-04-24", pnl: -70 },
  { date: "2025-04-25", pnl: 180 },
  { date: "2025-04-28", pnl: 370 },
  { date: "2025-04-29", pnl: -120 },
  { date: "2025-04-30", pnl: 440 },
  // May 2025
  { date: "2025-05-01", pnl: 150 },
  { date: "2025-05-02", pnl: 290 },
  { date: "2025-05-05", pnl: -75 },
  { date: "2025-05-06", pnl: 310 },
  { date: "2025-05-07", pnl: 500 },
  { date: "2025-05-08", pnl: -110 },
  { date: "2025-05-09", pnl: 240 },
  { date: "2025-05-12", pnl: 180 },
  { date: "2025-05-13", pnl: 620 },
  { date: "2025-05-14", pnl: -80 },
  { date: "2025-05-15", pnl: 380 },
  { date: "2025-05-16", pnl: 450 },
  { date: "2025-05-19", pnl: -190 },
  { date: "2025-05-20", pnl: 280 },
  { date: "2025-05-21", pnl: 370 },
  { date: "2025-05-22", pnl: -60 },
  { date: "2025-05-23", pnl: 540 },
  { date: "2025-05-27", pnl: 120 },
  { date: "2025-05-28", pnl: -95 },
  { date: "2025-05-29", pnl: 210 },
  { date: "2025-05-30", pnl: 430 },
  // June 2025
  { date: "2025-06-02", pnl: 150 },
  { date: "2025-06-03", pnl: 300 },
  { date: "2025-06-04", pnl: -140 },
  { date: "2025-06-05", pnl: 420 },
  { date: "2025-06-06", pnl: 190 },
  { date: "2025-06-09", pnl: -80 },
  { date: "2025-06-10", pnl: 250 },
  { date: "2025-06-11", pnl: 380 },
  { date: "2025-06-12", pnl: -110 },
  { date: "2025-06-13", pnl: 500 },
  { date: "2025-06-16", pnl: 210 },
  { date: "2025-06-17", pnl: -60 },
  { date: "2025-06-18", pnl: 330 },
  { date: "2025-06-19", pnl: 450 },
  { date: "2025-06-20", pnl: -180 },
  { date: "2025-06-23", pnl: 290 },
  { date: "2025-06-24", pnl: 170 },
  { date: "2025-06-25", pnl: -95 },
  { date: "2025-06-26", pnl: 410 },
  { date: "2025-06-27", pnl: 260 },
  { date: "2025-06-30", pnl: -130 },
  // July 2025
  { date: "2025-07-01", pnl: 180 },
  { date: "2025-07-02", pnl: 450 },
  { date: "2025-07-03", pnl: -85 },
  { date: "2025-07-07", pnl: 330 },
  { date: "2025-07-08", pnl: -170 },
  { date: "2025-07-09", pnl: 290 },
  { date: "2025-07-10", pnl: 520 },
  { date: "2025-07-11", pnl: -90 },
  { date: "2025-07-14", pnl: 650 },
  { date: "2025-07-15", pnl: 190 },
  { date: "2025-07-16", pnl: -250 },
  { date: "2025-07-17", pnl: 380 },
  { date: "2025-07-18", pnl: 410 },
  { date: "2025-07-21", pnl: -150 },
  { date: "2025-07-22", pnl: 300 },
  { date: "2025-07-23", pnl: 220 },
  { date: "2025-07-24", pnl: -70 },
  { date: "2025-07-25", pnl: 180 },
  { date: "2025-07-28", pnl: 370 },
  { date: "2025-07-29", pnl: -120 },
  { date: "2025-07-30", pnl: 440 },
  { date: "2025-07-31", pnl: 580 },
  // August 2025
  { date: "2025-08-01", pnl: -140 },
  { date: "2025-08-04", pnl: 150 },
  { date: "2025-08-05", pnl: 290 },
  { date: "2025-08-06", pnl: -75 },
  { date: "2025-08-07", pnl: 310 },
  { date: "2025-08-08", pnl: 500 },
  { date: "2025-08-11", pnl: -110 },
  { date: "2025-08-12", pnl: 240 },
  { date: "2025-08-13", pnl: 180 },
  { date: "2025-08-14", pnl: 620 },
  { date: "2025-08-15", pnl: -80 },
  { date: "2025-08-18", pnl: 380 },
  { date: "2025-08-19", pnl: 450 },
  { date: "2025-08-20", pnl: -190 },
  { date: "2025-08-21", pnl: 280 },
  { date: "2025-08-22", pnl: 370 },
  { date: "2025-08-25", pnl: -60 },
  { date: "2025-08-26", pnl: 540 },
  { date: "2025-08-27", pnl: 120 },
  { date: "2025-08-28", pnl: -95 },
  { date: "2025-08-29", pnl: 210 },
  // September 2025
  { date: "2025-09-01", pnl: 430 },
  { date: "2025-09-02", pnl: 150 },
  { date: "2025-09-03", pnl: -140 },
  { date: "2025-09-04", pnl: 420 },
  { date: "2025-09-05", pnl: 190 },
  { date: "2025-09-08", pnl: -80 },
  { date: "2025-09-09", pnl: 250 },
  { date: "2025-09-10", pnl: 380 },
  { date: "2025-09-11", pnl: -110 },
  { date: "2025-09-12", pnl: 500 },
  { date: "2025-09-15", pnl: 210 },
  { date: "2025-09-16", pnl: -60 },
  { date: "2025-09-17", pnl: 330 },
  { date: "2025-09-18", pnl: 450 },
  { date: "2025-09-19", pnl: -180 },
  { date: "2025-09-22", pnl: 290 },
  { date: "2025-09-23", pnl: 170 },
  { date: "2025-09-24", pnl: -95 },
  { date: "2025-09-25", pnl: 410 },
  { date: "2025-09-26", pnl: 260 },
  { date: "2025-09-29", pnl: -130 },
  { date: "2025-09-30", pnl: 300 },
  // October 2025
  { date: "2025-10-01", pnl: 180 },
  { date: "2025-10-02", pnl: -450 },
  { date: "2025-10-03", pnl: 85 },
  { date: "2025-10-06", pnl: 210 },
  { date: "2025-10-07", pnl: 330 },
  { date: "2025-10-08", pnl: -170 },
  { date: "2025-10-09", pnl: 290 },
  { date: "2025-10-10", pnl: 520 },
  { date: "2025-10-13", pnl: -90 },
  { date: "2025-10-14", pnl: 650 },
  { date: "2025-10-15", pnl: 190 },
  { date: "2025-10-16", pnl: -250 },
  { date: "2025-10-17", pnl: 380 },
  { date: "2025-10-20", pnl: 410 },
  { date: "2025-10-21", pnl: -150 },
  { date: "2025-10-22", pnl: 300 },
  { date: "2025-10-23", pnl: 220 },
  { date: "2025-10-24", pnl: -70 },
  { date: "2025-10-27", pnl: 180 },
  { date: "2025-10-28", pnl: 370 },
  { date: "2025-10-29", pnl: -120 },
  { date: "2025-10-30", pnl: 440 },
  { date: "2025-10-31", pnl: 580 },
  // November 2025
  { date: "2025-11-03", pnl: -140 },
  { date: "2025-11-04", pnl: 150 },
  { date: "2025-11-05", pnl: 290 },
  { date: "2025-11-06", pnl: -75 },
  { date: "2025-11-07", pnl: 310 },
  { date: "2025-11-10", pnl: 500 },
  { date: "2025-11-11", pnl: -110 },
  { date: "2025-11-12", pnl: 240 },
  { date: "2025-11-13", pnl: 180 },
  { date: "2025-11-14", pnl: 620 },
  { date: "2025-11-17", pnl: -80 },
  { date: "2025-11-18", pnl: 380 },
  { date: "2025-11-19", pnl: 450 },
  { date: "2025-11-20", pnl: -190 },
  { date: "2025-11-21", pnl: 280 },
  { date: "2025-11-24", pnl: 370 },
  { date: "2025-11-25", pnl: -60 },
  { date: "2025-11-26", pnl: 540 },
  { date: "2025-11-27", pnl: 120 },
  { date: "2025-11-28", pnl: -95 },
  // December 2025
  { date: "2025-12-01", pnl: 210 },
  { date: "2025-12-02", pnl: 430 },
  { date: "2025-12-03", pnl: -150 },
  { date: "2025-12-04", pnl: 420 },
  { date: "2025-12-05", pnl: 190 },
  { date: "2025-12-08", pnl: -80 },
  { date: "2025-12-09", pnl: 250 },
  { date: "2025-12-10", pnl: 380 },
  { date: "2025-12-11", pnl: -110 },
  { date: "2025-12-12", pnl: 500 },
  { date: "2025-12-15", pnl: 210 },
  { date: "2025-12-16", pnl: -60 },
  { date: "2025-12-17", pnl: 330 },
  { date: "2025-12-18", pnl: 450 },
  { date: "2025-12-19", pnl: -180 },
  { date: "2025-12-22", pnl: 290 },
  { date: "2025-12-23", pnl: 170 },
  { date: "2025-12-24", pnl: -95 },
  { date: "2025-12-26", pnl: 410 },
  { date: "2025-12-29", pnl: 260 },
  { date: "2025-12-30", pnl: -130 },
  { date: "2025-12-31", pnl: 300 },
];

// P.L Pie Chart Data
export const plPieChartData = [
  { name: "Profitable Days", value: 68.5, color: "#4ADE80" },
  { name: "Losing Days", value: 31.5, color: "#F87171" }
];

// Trading Instruments Data
export const tradingInstruments = [
  {
    id: 1,
    symbol: "CHFJPY",
    name: "Swiss Franc / Japanese Yen",
    bid: 182,
    ask: 183,
    spread: 26,
    leverage: 100,
    change: 1,
    color: "red"
  },
  {
    id: 2,
    symbol: "BTCUSD",
    name: "Bitcoin / US Dollar",
    bid: 112800,
    ask: 112878,
    spread: 7837,
    leverage: 2,
    change: -1,
    color: "orange"
  },
  {
    id: 3,
    symbol: "EURAUD",
    name: "Euro / Australian Dollar",
    bid: 2,
    ask: 2,
    spread: 4,
    leverage: 100,
    change: 1,
    color: "blue"
  },
  {
    id: 4,
    symbol: "ETHUSD",
    name: "Ethereum / US Dollar",
    bid: 4074,
    ask: 4078,
    spread: 426,
    leverage: 2,
    change: 2,
    color: "purple"
  },
  {
    id: 5,
    symbol: "EURCAD",
    name: "Euro / Canadian Dollar",
    bid: 2,
    ask: 2,
    spread: 5,
    leverage: 100,
    change: 0,
    color: "lightblue"
  },
  {
    id: 6,
    symbol: "LTCUSD",
    name: "Litecoin / US Dollar",
    bid: 112,
    ask: 113,
    spread: 44,
    leverage: 2,
    change: 2,
    color: "gray"
  },
  {
    id: 7,
    symbol: "EURCHF",
    name: "Euro / Swiss Franc",
    bid: 1,
    ask: 1,
    spread: 10,
    leverage: 100,
    change: 0,
    color: "blue"
  },
  {
    id: 8,
    symbol: "BCHUSD",
    name: "Bitcoin Cash / US Dollar",
    bid: 548,
    ask: 549,
    spread: 95,
    leverage: 2,
    change: -7,
    color: "green"
  }
];

// Mock Positions Data
export const mockPositions = [
  // Currently empty - no open positions
];

export const mockPendingOrders = [
  // Currently empty - no pending orders
];

export const mockClosedPositions = [
  {
    id: 1,
    instrument: "BCHUSD",
    side: "Buy" as const,
    size: 0.01,
    entry: 548,
    stopLoss: 540,
    takeProfit: 560,
    margin: 3,
    exposure: 0.01,
    createdAt: "18:59:21",
    fee: 0,
    swaps: 0,
    pnl: 126,
    positionId: "P001"
  },
  {
    id: 2,
    instrument: "ETHUSD",
    side: "Sell" as const,
    size: 0.05,
    entry: 4074,
    margin: 10,
    exposure: 0.05,
    createdAt: "17:45:12",
    fee: 0,
    swaps: 0,
    pnl: -45,
    positionId: "P002"
  }
];

// OHLC Data for selected instrument
export const instrumentOHLC = {
  BCH: {
    open: 555,
    high: 567,
    low: 547,
    close: 548,
    change: -7,
    changePercent: -1.29
  },
  ETHUSD: {
    open: 4121,
    high: 4145,
    low: 4065,
    close: 4074,
    change: -47,
    changePercent: -1.13
  },
  CHFJPY: {
    open: 181,
    high: 183,
    low: 181,
    close: 183,
    change: 1,
    changePercent: 0.78
  }
};

// Trading Logs Data
export const tradingLogs = [
  {
    id: 1,
    date: "2024-08-22",
    type: "Buy",
    size: "1.25",
    entryPrice: 61250,
    status: "Open",
    pnl: 126
  },
  {
    id: 2,
    date: "2024-08-22",
    type: "Sell",
    size: "0.5",
    entryPrice: 61180,
    status: "Closed",
    pnl: -45
  },
  {
    id: 3,
    date: "2024-08-21",
    type: "Buy",
    size: "2.0",
    entryPrice: 60950,
    status: "Closed",
    pnl: 321
  },
  {
    id: 4,
    date: "2024-08-21",
    type: "Sell",
    size: "0.75",
    entryPrice: 61000,
    status: "Closed",
    pnl: 86
  },
  {
    id: 5,
    date: "2024-08-20",
    type: "Buy",
    size: "1.5",
    entryPrice: 60800,
    status: "Closed",
    pnl: 225
  },
];

// Navigation Items for Trading Dashboard
export const navigationItems = [
  { id: "dashboard", name: "Dashboard", icon: "LayoutDashboard" },
  { id: "payouts", name: "Payouts", icon: "DollarSign" },
  { id: "watchlist", name: "Watch list", icon: "Star" },
  { id: "trending", name: "Trending", icon: "TrendingUp" },
  { id: "trading", name: "Trading", icon: "BarChart3", section: "ANALYTICS" },

  { id: "faq", name: "FAQ", icon: "HelpCircle" },
];

// Payouts page mock data
export const payoutsData = {
  currentBalance: 10250.00,
  pendingProfits: 1500.00,
  kycRequired: true,
  payoutRules: [
    { rule: "Minimum withdrawal", value: "$100" },
    { rule: "Maximum withdrawal", value: "$5,000" },
    { rule: "Frequency", value: "One request per week" },
  ],
  withdrawalHistory: [
    { date: "Sep 1, 2025", amount: 1200.00, method: "Bank Transfer", status: "Paid" as const, transactionId: "TXN123456789" },
    { date: "Aug 25, 2025", amount: 1500.00, method: "Crypto (USDC)", status: "Pending" as const, transactionId: "TXN987654321" },
    { date: "Aug 18, 2025", amount: 900.00, method: "Bank Transfer", status: "Paid" as const, transactionId: "TXN543216789" },
    { date: "Aug 11, 2025", amount: 5000.00, method: "Crypto (USDC)", status: "Rejected" as const, transactionId: "TXN123987456" },
    { date: "Aug 4, 2025", amount: 2100.00, method: "Bank Transfer", status: "Paid" as const, transactionId: "TXN654789123" },
  ],
};