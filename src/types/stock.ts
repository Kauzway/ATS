// Stock related types

export interface StockData {
    time: number;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
  }
  
  export interface StockDetails {
    symbol: string;
    name: string;
    exchange: string;
    sector: string;
    industry: string;
    currency: string;
    marketCap: number;
    pe: number;
    eps: number;
    beta: number;
    high52Week: number;
    low52Week: number;
    avgVolume: number;
    outstandingShares: number;
    dividendYield: number;
    dividendDate: string;
    exDividendDate: string;
    description: string;
    website: string;
    lotSize: number; // For F&O trading
    isFnO: boolean; // Whether the stock is available in F&O
    boardLotQuantity: number;
    weightage: number; // Weight in the index if applicable
  }
  
  export interface StockIndicators {
    rsi: {
      value: number;
      history: number[];
      divergences: {
        bullish: {
          time: number;
          price: number;
          rsi: number;
        }[];
        bearish: {
          time: number;
          price: number;
          rsi: number;
        }[];
      };
    };
    adx: {
      value: number;
      adxHistory: number[];
      diPlusHistory: number[];
      diMinusHistory: number[];
      trend: 'uptrend' | 'downtrend' | 'sideways' | 'consolidating';
      strength: 'weak' | 'moderate' | 'strong' | 'very strong';
    };
    macd: {
      value: number;
      signal: number;
      histogram: number;
      history: {
        time: number;
        macd: number;
        signal: number;
        histogram: number;
      }[];
      crossovers: {
        time: number;
        type: 'bullish' | 'bearish';
      }[];
    };
    movingAverages: {
      sma: {
        sma20: number;
        sma50: number;
        sma100: number;
        sma200: number;
      };
      ema: {
        ema9: number;
        ema20: number;
        ema50: number;
        ema100: number;
        ema200: number;
      };
      crossovers: {
        time: number;
        type: 'bullish' | 'bearish';
        description: string;
      }[];
    };
    bollingerBands: {
      upper: number;
      middle: number;
      lower: number;
      width: number;
      percentB: number;
      history: {
        time: number;
        upper: number;
        middle: number;
        lower: number;
      }[];
    };
    atr: {
      value: number;
      history: number[];
    };
    volumeProfile: {
      value: number; // Current volume
      average: number; // Average volume
      ratio: number; // Current volume / Average volume
      trend: 'increasing' | 'decreasing' | 'stable';
      spikes: {
        time: number;
        volume: number;
        ratio: number; // Compared to average
      }[];
    };
    patterns: {
      candlestick: {
        type: string;
        time: number;
        significance: number; // 0 to 100
        description: string;
      }[];
      chart: {
        type: string;
        startTime: number;
        endTime: number;
        significance: number; // 0 to 100
        description: string;
      }[];
    };
    supports: number[];
    resistances: number[];
    pivotPoints: {
      daily: {
        r3: number;
        r2: number;
        r1: number;
        pp: number;
        s1: number;
        s2: number;
        s3: number;
      };
      weekly: {
        r3: number;
        r2: number;
        r1: number;
        pp: number;
        s1: number;
        s2: number;
        s3: number;
      };
      monthly: {
        r3: number;
        r2: number;
        r1: number;
        pp: number;
        s1: number;
        s2: number;
        s3: number;
      };
    };
    fibonacciLevels: {
      reference: {
        high: number;
        low: number;
      };
      levels: {
        '0': number;
        '0.236': number;
        '0.382': number;
        '0.5': number;
        '0.618': number;
        '0.786': number;
        '1': number;
      };
    };
    mlPredictions: {
      nextDay: {
        predicted: number;
        confidence: number;
        range: {
          lower: number;
          upper: number;
        };
      };
      nextWeek: {
        predicted: number;
        confidence: number;
        range: {
          lower: number;
          upper: number;
        };
      };
      trend: 'bullish' | 'bearish' | 'neutral';
      probability: number; // 0 to 100
    };
  }
  
  export interface TradeSetup {
    symbol: string;
    type: 'long' | 'short';
    timeframe: string;
    entryPrice: number;
    stopLoss: number;
    targets: number[];
    riskRewardRatio: number;
    confidence: number; // 0 to 100
    rationale: string[];
    indicators: {
      name: string;
      value: number;
      interpretation: string;
    }[];
  }
  
  export interface FnOData {
    symbol: string;
    expiry: string;
    lotSize: number;
    options: {
      strike: number;
      callPrice: number;
      callOI: number;
      callVolume: number;
      callIV: number;
      putPrice: number;
      putOI: number;
      putVolume: number;
      putIV: number;
    }[];
    futurePremium: number;
    maxPainStrike: number;
    pcr: number; // Put-Call Ratio
    oiBuildup: {
      calls: 'long' | 'short' | 'neutral';
      puts: 'long' | 'short' | 'neutral';
    };
  }