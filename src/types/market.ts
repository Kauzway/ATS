// Market related types

export interface MarketData {
    index: string;
    timestamp: number;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
    previousClose: number;
    change: number;
    changePercent: number;
    dayRange: {
      low: number;
      high: number;
    };
    yearRange: {
      low: number;
      high: number;
    };
    marketCap: number;
    pe: number;
    pb: number;
    divYield: number;
    technicalIndicators: {
      rsi: number;
      adx: number;
      macd: {
        macd: number;
        signal: number;
        histogram: number;
      };
      sma: {
        sma20: number;
        sma50: number;
        sma200: number;
      };
      ema: {
        ema20: number;
        ema50: number;
        ema200: number;
      };
      bbands: {
        upper: number;
        middle: number;
        lower: number;
      };
      atr: number;
    };
    breadth: {
      advancing: number;
      declining: number;
      unchanged: number;
      total: number;
      advancingVolume: number;
      decliningVolume: number;
    };
    sentiment: {
      bullish: number; // 0 to 100
      bearish: number; // 0 to 100
      neutral: number; // 0 to 100
    };
    historicalData: {
      time: number;
      open: number;
      high: number;
      low: number;
      close: number;
      volume: number;
    }[];
  }
  
  export interface SectorData {
    name: string;
    change: number;
    changePercent: number;
    marketCap: number;
    volume: number;
    pe: number;
    technicalIndicators: {
      rsi: number;
      adx: number;
      trend: 'uptrend' | 'downtrend' | 'sideways';
    };
    topGainers: {
      symbol: string;
      name: string;
      change: number;
      changePercent: number;
    }[];
    topLosers: {
      symbol: string;
      name: string;
      change: number;
      changePercent: number;
    }[];
    historicalPerformance: {
      day: number;
      week: number;
      month: number;
      threeMonths: number;
      sixMonths: number;
      year: number;
      threeYears: number;
      fiveYears: number;
    };
  }
  
  export interface StockData {
    symbol: string;
    name: string;
    sector: string;
    price: number;
    change: number;
    changePercent: number;
    volume: number;
    marketCap: number;
    pe: number;
    technicalIndicators: {
      rsi: number;
      adx: number;
      trend: 'uptrend' | 'downtrend' | 'sideways';
    };
    historicalPerformance: {
      day: number;
      week: number;
      month: number;
      threeMonths: number;
      sixMonths: number;
      year: number;
    };
  }