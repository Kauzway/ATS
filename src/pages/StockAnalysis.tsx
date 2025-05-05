import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  FiTrendingUp, 
  FiTrendingDown, 
  FiInfo, 
  FiStar, 
  FiActivity, 
  FiBarChart2,
  FiCalendar,
  FiDollarSign,
  FiPieChart
} from 'react-icons/fi';

// Components
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Spinner from '../components/common/Spinner';
import CandlestickChart from '../components/charts/CandlestickChart';
import RSIChart from '../components/charts/RSIChart';
import ADXChart from '../components/charts/ADXChart';

// Store
import { AppDispatch, RootState } from '../store';
import { fetchStock, fetchDetails, fetchIndicators } from '../store/slices/stockSlice';

// Utils
import { formatPrice, formatPercentage, formatChangeWithArrow, getPriceChangeClass, formatLargeNumber } from '../utils/formatters';

interface StockAnalysisParams {
  symbol: string;
}

const StockAnalysis: React.FC = () => {
  const { symbol } = useParams<StockAnalysisParams>();
  const dispatch = useDispatch<AppDispatch>();
  const { darkMode } = useSelector((state: RootState) => state.theme);
  const { stockData, stockDetails, stockIndicators, loading, error } = useSelector((state: RootState) => state.stock);
  
  const [timeframe, setTimeframe] = useState('daily');
  const [activeTab, setActiveTab] = useState('overview');
  
  useEffect(() => {
    if (symbol) {
      dispatch(fetchStock({ symbol, timeframe }));
      dispatch(fetchDetails(symbol));
      dispatch(fetchIndicators({ symbol, timeframe }));
    }
  }, [dispatch, symbol, timeframe]);
  
  if (loading && !stockData[symbol]) {
    return (
      <div className="flex items-center justify-center h-full py-20">
        <Spinner size="lg" label={`Loading ${symbol} data...`} />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-20">
        <div className="text-red-500 text-lg mb-4">Error loading stock data: {error}</div>
        <Button
          variant="primary"
          onClick={() => {
            if (symbol) {
              dispatch(fetchStock({ symbol, timeframe }));
              dispatch(fetchDetails(symbol));
              dispatch(fetchIndicators({ symbol, timeframe }));
            }
          }}
        >
          Retry
        </Button>
      </div>
    );
  }
  
  if (!symbol || !stockData[symbol] || !stockDetails[symbol] || !stockIndicators[symbol]) {
    return (
      <div className="flex items-center justify-center h-full py-20">
        <div className="text-gray-500 dark:text-gray-400">No stock data available</div>
      </div>
    );
  }
  
  const data = stockData[symbol];
  const details = stockDetails[symbol];
  const indicators = stockIndicators[symbol];
  
  // Current stock data (last data point)
  const current = data[data.length - 1];
  const previousClose = data[data.length - 2]?.close || 0;
  const change = current.close - previousClose;
  const changePercent = (change / previousClose) * 100;
  
  // Determine market status
  const getMarketStatus = () => {
    if (indicators.rsi.value > 70) {
      return 'Overbought';
    } else if (indicators.rsi.value < 30) {
      return 'Oversold';
    } else if (indicators.adx.value > 25) {
      return indicators.adx.diPlusHistory[indicators.adx.diPlusHistory.length - 1] > 
             indicators.adx.diMinusHistory[indicators.adx.diMinusHistory.length - 1] 
             ? 'Strong Uptrend' : 'Strong Downtrend';
    } else {
      return 'Neutral';
    }
  };
  
  return (
    <div className="pb-8">
      {/* Page header */}
      <div className="mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{symbol} - {details.name}</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {details.exchange} • {details.sector} • {details.industry}
            </p>
          </div>
          <div className="flex items-center">
            <Button
              variant="outline"
              leftIcon={<FiStar />}
              className="mr-2"
              onClick={() => {
                console.log(`Add ${symbol} to watchlist`);
                // Implement watchlist functionality
              }}
            >
              Add to Watchlist
            </Button>
            <Button
              variant="primary"
              leftIcon={<FiDollarSign />}
              onClick={() => {
                console.log(`Trade ${symbol}`);
                // Implement trade functionality
              }}
            >
              Trade
            </Button>
          </div>
        </div>
      </div>
      
      {/* Stock summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Price information */}
        <Card>
          <div className="flex items-center">
            <div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {formatPrice(current.close)}
              </div>
              <div className={`text-lg font-medium ${getPriceChangeClass(change)}`}>
                {formatChangeWithArrow(change)} ({formatPercentage(changePercent / 100)})
              </div>
            </div>
            <div className="ml-auto">
              {change >= 0 ? (
                <FiTrendingUp className="h-10 w-10 text-green-500" />
              ) : (
                <FiTrendingDown className="h-10 w-10 text-red-500" />
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Open</div>
              <div className="text-base font-medium text-gray-900 dark:text-white">{formatPrice(current.open)}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Previous Close</div>
              <div className="text-base font-medium text-gray-900 dark:text-white">{formatPrice(previousClose)}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Day Range</div>
              <div className="text-base font-medium text-gray-900 dark:text-white">
                {formatPrice(current.low)} - {formatPrice(current.high)}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">52 Week Range</div>
              <div className="text-base font-medium text-gray-900 dark:text-white">
                {formatPrice(details.low52Week)} - {formatPrice(details.high52Week)}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Volume</div>
              <div className="text-base font-medium text-gray-900 dark:text-white">
                {formatLargeNumber(current.volume, 0)}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Avg. Volume</div>
              <div className="text-base font-medium text-gray-900 dark:text-white">
                {formatLargeNumber(details.avgVolume, 0)}
              </div>
            </div>
          </div>
        </Card>
        
        {/* Key metrics */}
        <Card>
          <h3 className="text-base font-medium text-gray-900 dark:text-white mb-4">Key Metrics</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Market Cap</div>
              <div className="text-base font-medium text-gray-900 dark:text-white">
                {formatLargeNumber(details.marketCap, 2)}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">P/E Ratio</div>
              <div className="text-base font-medium text-gray-900 dark:text-white">
                {details.pe.toFixed(2)}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">EPS</div>
              <div className="text-base font-medium text-gray-900 dark:text-white">
                {formatPrice(details.eps, '₹', 2)}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Beta</div>
              <div className="text-base font-medium text-gray-900 dark:text-white">
                {details.beta.toFixed(2)}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Dividend Yield</div>
              <div className="text-base font-medium text-gray-900 dark:text-white">
                {formatPercentage(details.dividendYield / 100)}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Lot Size (F&O)</div>
              <div className="text-base font-medium text-gray-900 dark:text-white">
                {details.lotSize}
              </div>
            </div>
          </div>
        </Card>
        
        {/* Technical indicators summary */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-medium text-gray-900 dark:text-white">Technical Indicators</h3>
            <div className="px-2 py-1 rounded bg-gray-100 dark:bg-tv-border text-xs font-medium">
              {getMarketStatus()}
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300">RSI (14)</div>
                <div className="text-sm font-medium">
                  {indicators.rsi.value.toFixed(2)}
                </div>
              </div>
              <div className="w-full bg-gray-200 dark:bg-tv-border rounded-full h-2.5">
                <div
                  className={`h-2.5 rounded-full ${
                    indicators.rsi.value > 70
                      ? 'bg-red-500'
                      : indicators.rsi.value < 30
                      ? 'bg-green-500'
                      : 'bg-blue-500'
                  }`}
                  style={{ width: `${Math.min(indicators.rsi.value, 100)}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                <span>Oversold</span>
                <span>Neutral</span>
                <span>Overbought</span>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300">ADX (14)</div>
                <div className="text-sm font-medium">
                  {indicators.adx.value.toFixed(2)}
                </div>
              </div>
              <div className="w-full bg-gray-200 dark:bg-tv-border rounded-full h-2.5">
                <div
                  className="h-2.5 rounded-full bg-purple-500"
                  style={{ width: `${Math.min(indicators.adx.value * 2, 100)}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                <span>Weak</span>
                <span>Strong</span>
                <span>Very Strong</span>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300">MACD</div>
                <div className="text-sm font-medium">
                  {indicators.macd.histogram.toFixed(2)}
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <div className="text-xs text-gray-500 dark:text-gray-400">Signal:</div>
                <div className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  {indicators.macd.signal.toFixed(2)}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 ml-2">MACD:</div>
                <div className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  {indicators.macd.value.toFixed(2)}
                </div>
              </div>
            </div>
            
            <div>
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">ML Prediction</div>
              <div className="flex items-center">
                <div className={`text-sm font-medium ${
                  indicators.mlPredictions.trend === 'bullish'
                    ? 'text-green-500'
                    : indicators.mlPredictions.trend === 'bearish'
                    ? 'text-red-500'
                    : 'text-yellow-500'
                }`}>
                  {indicators.mlPredictions.trend.charAt(0).toUpperCase() + indicators.mlPredictions.trend.slice(1)}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                  ({formatPercentage(indicators.mlPredictions.probability / 100)} probability)
                </div>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Next day: {formatPrice(indicators.mlPredictions.nextDay.predicted)}
                ({indicators.mlPredictions.nextDay.confidence.toFixed(2)} confidence)
              </div>
            </div>
          </div>
        </Card>
      </div>
      
      {/* Tab navigation */}
      <div className="mb-6 border-b border-gray-200 dark:border-tv-border">
        <nav className="flex space-x-8">
          <button
            className={`py-4 px-1 font-medium text-sm border-b-2 ${
              activeTab === 'overview'
                ? 'border-ats-primary text-ats-primary'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-700'
            }`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`py-4 px-1 font-medium text-sm border-b-2 ${
              activeTab === 'technical'
                ? 'border-ats-primary text-ats-primary'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-700'
            }`}
            onClick={() => setActiveTab('technical')}
          >
            Technical Analysis
          </button>
          <button
            className={`py-4 px-1 font-medium text-sm border-b-2 ${
              activeTab === 'fundamental'
                ? 'border-ats-primary text-ats-primary'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-700'
            }`}
            onClick={() => setActiveTab('fundamental')}
          >
            Fundamental
          </button>
          <button
            className={`py-4 px-1 font-medium text-sm border-b-2 ${
              activeTab === 'fno'
                ? 'border-ats-primary text-ats-primary'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-700'
            }`}
            onClick={() => setActiveTab('fno')}
          >
            F&O
          </button>
        </nav>
      </div>
      
      {/* Timeframe selection */}
      <div className="mb-6">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-700 dark:text-gray-300">Timeframe:</span>
          <div className="flex rounded-md overflow-hidden">
            {['daily', 'weekly', 'monthly'].map((tf) => (
              <button
                key={tf}
                className={`px-3 py-1.5 text-xs font-medium ${
                  timeframe === tf
                    ? 'bg-ats-primary text-white'
                    : 'bg-gray-100 dark:bg-tv-bg-secondary text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-tv-border'
                }`}
                onClick={() => setTimeframe(tf)}
              >
                {tf.charAt(0).toUpperCase() + tf.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Tab content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Price Chart */}
          <Card title="Price Chart">
            <div className="h-[400px]">
              <CandlestickChart
                data={data}
                darkMode={darkMode}
                width={1000}
                height={380}
                showVolume={true}
                showGrid={true}
                showTooltip={true}
                showLegend={true}
              />
            </div>
          </Card>
          
          {/* Company Description */}
          <Card title="About the Company">
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              {details.description}
            </p>
            <div className="flex items-center">
              <FiInfo className="h-5 w-5 text-gray-400 mr-2" />
              <span className="text-sm text-gray-500 dark:text-gray-400">
                <a href={details.website} target="_blank" rel="noopener noreferrer" className="text-ats-primary hover:underline">
                  {details.website}
                </a>
              </span>
            </div>
          </Card>
          
          {/* Performance */}
          <Card title="Historical Performance">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">1 Day</div>
                <div className={`text-lg font-medium ${getPriceChangeClass(change)}`}>
                  {formatPercentage(changePercent / 100)}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">1 Week</div>
                <div className={`text-lg font-medium ${getPriceChangeClass(indicators.mlPredictions.nextWeek.predicted - current.close)}`}>
                  {formatPercentage((indicators.mlPredictions.nextWeek.predicted - current.close) / current.close)}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">1 Month</div>
                <div className={`text-lg font-medium ${getPriceChangeClass(5)}`}>
                  {formatPercentage(0.05)}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">3 Months</div>
                <div className={`text-lg font-medium ${getPriceChangeClass(12)}`}>
                  {formatPercentage(0.12)}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">6 Months</div>
                <div className={`text-lg font-medium ${getPriceChangeClass(18)}`}>
                  {formatPercentage(0.18)}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">1 Year</div>
                <div className={`text-lg font-medium ${getPriceChangeClass(25)}`}>
                  {formatPercentage(0.25)}
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
      
      {activeTab === 'technical' && (
        <div className="space-y-6">
          {/* Price Chart */}
          <Card title="Price Chart">
            <div className="h-[400px]">
              <CandlestickChart
                data={data}
                darkMode={darkMode}
                width={1000}
                height={380}
                showVolume={true}
                showGrid={true}
                showTooltip={true}
                showLegend={true}
              />
            </div>
          </Card>
          
          {/* RSI Chart */}
          <Card title="Relative Strength Index (RSI)">
            <div className="mb-3">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                RSI measures the magnitude of recent price changes to evaluate overbought or oversold conditions.
                Values above 70 indicate overbought conditions, while values below 30 indicate oversold conditions.
              </p>
            </div>
            <div className="h-[200px]">
              <RSIChart
                data={data}
                darkMode={darkMode}
                width={1000}
                height={180}
                period={14}
                showDivergence={true}
                showGrid={true}
                showTooltip={true}
              />
            </div>
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">RSI Divergences</h4>
              <div className="flex flex-wrap gap-3">
                {indicators.rsi.divergences.bullish.length > 0 || indicators.rsi.divergences.bearish.length > 0 ? (
                  <>
                    {indicators.rsi.divergences.bullish.map((div, index) => (
                      <div key={`bullish-${index}`} className="px-3 py-1 text-xs rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                        Bullish Divergence: {new Date(div.time).toLocaleDateString()}
                      </div>
                    ))}
                    {indicators.rsi.divergences.bearish.map((div, index) => (
                      <div key={`bearish-${index}`} className="px-3 py-1 text-xs rounded-full bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200">
                        Bearish Divergence: {new Date(div.time).toLocaleDateString()}
                      </div>
                    ))}
                  </>
                ) : (
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    No divergences detected in the current timeframe
                  </div>
                )}
              </div>
            </div>
          </Card>
          
          {/* ADX Chart */}
          <Card title="Average Directional Index (ADX)">
            <div className="mb-3">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                ADX measures the strength of a trend, regardless of its direction.
                Values above 25 indicate a strong trend, while values below 20 indicate a weak or no trend.
                The +DI and -DI lines help determine the direction of the trend.
              </p>
            </div>
            <div className="h-[200px]">
              <ADXChart
                data={data}
                darkMode={darkMode}
                width={1000}
                height={180}
                period={14}
                showDI={true}
                showGrid={true}
                showTooltip={true}
              />
            </div>
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Trend Analysis</h4>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
                  <div className="text-sm text-gray-700 dark:text-gray-300">
                    ADX: <span className="font-medium">{indicators.adx.value.toFixed(2)}</span>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                  <div className="text-sm text-gray-700 dark:text-gray-300">
                    +DI: <span className="font-medium">{indicators.adx.diPlusHistory[indicators.adx.diPlusHistory.length - 1].toFixed(2)}</span>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                  <div className="text-sm text-gray-700 dark:text-gray-300">
                    -DI: <span className="font-medium">{indicators.adx.diMinusHistory[indicators.adx.diMinusHistory.length - 1].toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <div className="mt-2">
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  Trend Strength: <span className="font-medium">{indicators.adx.strength.charAt(0).toUpperCase() + indicators.adx.strength.slice(1)}</span>
                </div>
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  Trend Direction: <span className="font-medium">{indicators.adx.trend.charAt(0).toUpperCase() + indicators.adx.trend.slice(1)}</span>
                </div>
              </div>
            </div>
          </Card>
          
          {/* MACD */}
          <Card title="Moving Average Convergence Divergence (MACD)">
            <div className="mb-3">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                MACD shows the relationship between two moving averages of a security's price.
                The MACD line is calculated by subtracting the 26-period EMA from the 12-period EMA.
                The signal line is a 9-period EMA of the MACD line.
              </p>
            </div>
            {/* MACD Chart would go here */}
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">MACD Values</h4>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                  <div className="text-sm text-gray-700 dark:text-gray-300">
                    MACD: <span className="font-medium">{indicators.macd.value.toFixed(2)}</span>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-orange-500 mr-2"></div>
                  <div className="text-sm text-gray-700 dark:text-gray-300">
                    Signal: <span className="font-medium">{indicators.macd.signal.toFixed(2)}</span>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
                  <div className="text-sm text-gray-700 dark:text-gray-300">
                    Histogram: <span className={`font-medium ${getPriceChangeClass(indicators.macd.histogram)}`}>
                      {indicators.macd.histogram.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-2">
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  Signal: {
                    indicators.macd.value > indicators.macd.signal
                      ? <span className="text-green-500 font-medium">Bullish (MACD above Signal Line)</span>
                      : <span className="text-red-500 font-medium">Bearish (MACD below Signal Line)</span>
                  }
                </div>
              </div>
            </div>
          </Card>
          
          {/* Support and Resistance */}
          <Card title="Support and Resistance Levels">
            <div className="mb-3">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Support and resistance levels indicate price points where a stock has historically struggled to move below (support) or above (resistance).
                These levels can be used to identify potential entry and exit points.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Support Levels</h4>
                <div className="space-y-2">
                  {indicators.supports && indicators.supports.length > 0 ? (
                    indicators.supports.map((level, index) => (
                      <div key={`support-${index}`} className="flex items-center justify-between">
                        <div className="text-sm text-gray-700 dark:text-gray-300">S{index + 1}</div>
                        <div className="text-sm font-medium text-green-500">{formatPrice(level)}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {(((current.close - level) / current.close) * 100).toFixed(2)}% below
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      No support levels available
                    </div>
                  )}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Resistance Levels</h4>
                <div className="space-y-2">
                  {indicators.resistances && indicators.resistances.length > 0 ? (
                    indicators.resistances.map((level, index) => (
                      <div key={`resistance-${index}`} className="flex items-center justify-between">
                        <div className="text-sm text-gray-700 dark:text-gray-300">R{index + 1}</div>
                        <div className="text-sm font-medium text-red-500">{formatPrice(level)}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {(((level - current.close) / current.close) * 100).toFixed(2)}% above
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      No resistance levels available
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>
          
          {/* Machine Learning Predictions */}
          <Card title="Machine Learning Predictions">
            <div className="mb-3">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Our ML models analyze historical price patterns, volume, technical indicators, and market sentiment
                to predict future price movements. These predictions are for informational purposes only and
                should not be considered as financial advice.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 rounded-lg bg-gray-50 dark:bg-tv-border">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Next Day Prediction</h4>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatPrice(indicators.mlPredictions.nextDay.predicted)}
                </div>
                <div className={`text-sm font-medium ${getPriceChangeClass(indicators.mlPredictions.nextDay.predicted - current.close)}`}>
                  {formatChangeWithArrow(indicators.mlPredictions.nextDay.predicted - current.close)} (
                  {formatPercentage((indicators.mlPredictions.nextDay.predicted - current.close) / current.close)})
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Confidence: {(indicators.mlPredictions.nextDay.confidence * 100).toFixed(2)}%
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Range: {formatPrice(indicators.mlPredictions.nextDay.range.lower)} - {formatPrice(indicators.mlPredictions.nextDay.range.upper)}
                </div>
              </div>
              <div className="p-4 rounded-lg bg-gray-50 dark:bg-tv-border">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Next Week Prediction</h4>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatPrice(indicators.mlPredictions.nextWeek.predicted)}
                </div>
                <div className={`text-sm font-medium ${getPriceChangeClass(indicators.mlPredictions.nextWeek.predicted - current.close)}`}>
                  {formatChangeWithArrow(indicators.mlPredictions.nextWeek.predicted - current.close)} (
                  {formatPercentage((indicators.mlPredictions.nextWeek.predicted - current.close) / current.close)})
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Confidence: {(indicators.mlPredictions.nextWeek.confidence * 100).toFixed(2)}%
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Range: {formatPrice(indicators.mlPredictions.nextWeek.range.lower)} - {formatPrice(indicators.mlPredictions.nextWeek.range.upper)}
                </div>
              </div>
              <div className="p-4 rounded-lg bg-gray-50 dark:bg-tv-border">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Overall Trend Prediction</h4>
                <div className="flex items-center space-x-2">
                  {indicators.mlPredictions.trend === 'bullish' && (
                    <FiTrendingUp className="h-8 w-8 text-green-500" />
                  )}
                  {indicators.mlPredictions.trend === 'bearish' && (
                    <FiTrendingDown className="h-8 w-8 text-red-500" />
                  )}
                  {indicators.mlPredictions.trend === 'neutral' && (
                    <FiActivity className="h-8 w-8 text-yellow-500" />
                  )}
                  <div className={`text-2xl font-bold ${
                    indicators.mlPredictions.trend === 'bullish'
                      ? 'text-green-500'
                      : indicators.mlPredictions.trend === 'bearish'
                      ? 'text-red-500'
                      : 'text-yellow-500'
                  }`}>
                    {indicators.mlPredictions.trend.charAt(0).toUpperCase() + indicators.mlPredictions.trend.slice(1)}
                  </div>
                </div>
                <div className="text-sm text-gray-700 dark:text-gray-300 mt-4">
                  Probability: {indicators.mlPredictions.probability}%
                </div>
                <div className="mt-2">
                  <div className="w-full bg-gray-200 dark:bg-tv-bg-primary rounded-full h-2.5">
                    <div
                      className={`h-2.5 rounded-full ${
                        indicators.mlPredictions.trend === 'bullish'
                          ? 'bg-green-500'
                          : indicators.mlPredictions.trend === 'bearish'
                          ? 'bg-red-500'
                          : 'bg-yellow-500'
                      }`}
                      style={{ width: `${indicators.mlPredictions.probability}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
      
      {activeTab === 'fundamental' && (
        <div className="space-y-6">
          <Card title="Fundamental Analysis">
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Fundamental analysis not yet implemented
            </p>
          </Card>
        </div>
      )}
      
      {activeTab === 'fno' && (
        <div className="space-y-6">
          <Card title="Futures & Options">
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              F&O data not yet implemented
            </p>
          </Card>
        </div>
      )}
    </div>
  );
};

export default StockAnalysis;