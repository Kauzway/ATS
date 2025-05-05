import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FiArrowUp, FiArrowDown, FiTrendingUp, FiTrendingDown, FiActivity } from 'react-icons/fi';

// Components
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Spinner from '../components/common/Spinner';
import CandlestickChart from '../components/charts/CandlestickChart';

// Store
import { AppDispatch, RootState } from '../store';
import { fetchMarketData, fetchSectorData, fetchTopStocks } from '../store/slices/marketSlice';

// Utils
import { formatPrice, formatPercentage, formatChangeWithArrow, getPriceChangeClass, formatDate } from '../utils/formatters';

const Dashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { darkMode } = useSelector((state: RootState) => state.theme);
  const { marketData, sectorData, topStocks, loading, error } = useSelector((state: RootState) => state.market);
  
  const [selectedIndex, setSelectedIndex] = useState('NIFTY 50');
  const [timeframe, setTimeframe] = useState('daily');
  
  useEffect(() => {
    // Fetch market data when component mounts or when selectedIndex/timeframe changes
    dispatch(fetchMarketData({ index: selectedIndex, timeframe }));
    dispatch(fetchSectorData({ timeframe }));
    dispatch(fetchTopStocks({ count: 5, sortBy: 'performance' }));
  }, [dispatch, selectedIndex, timeframe]);
  
  const handleIndexChange = (index: string) => {
    setSelectedIndex(index);
  };
  
  const handleTimeframeChange = (tf: string) => {
    setTimeframe(tf);
  };
  
  if (loading && !marketData) {
    return (
      <div className="flex items-center justify-center h-full py-20">
        <Spinner size="lg" label="Loading market data..." />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-20">
        <div className="text-red-500 text-lg mb-4">Error loading market data: {error}</div>
        <Button
          variant="primary"
          onClick={() => {
            dispatch(fetchMarketData({ index: selectedIndex, timeframe }));
            dispatch(fetchSectorData({ timeframe }));
            dispatch(fetchTopStocks({ count: 5, sortBy: 'performance' }));
          }}
        >
          Retry
        </Button>
      </div>
    );
  }
  
  return (
    <div className="pb-8">
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Market Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Overview of market performance and trends
        </p>
      </div>
      
      {/* Controls */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex items-center space-x-2">
          <label htmlFor="index-select" className="text-sm text-gray-700 dark:text-gray-300">
            Market Index:
          </label>
          <select
            id="index-select"
            className="form-input py-1.5 text-sm min-w-[150px]"
            value={selectedIndex}
            onChange={(e) => handleIndexChange(e.target.value)}
          >
            <option value="NIFTY 50">NIFTY 50</option>
            <option value="NIFTY BANK">NIFTY BANK</option>
            <option value="NIFTY IT">NIFTY IT</option>
            <option value="NIFTY NEXT 50">NIFTY NEXT 50</option>
            <option value="NIFTY 100">NIFTY 100</option>
            <option value="NIFTY 500">NIFTY 500</option>
          </select>
        </div>
        
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
                onClick={() => handleTimeframeChange(tf)}
              >
                {tf.charAt(0).toUpperCase() + tf.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {marketData && (
        <div className="space-y-6">
          {/* Market Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Market Summary */}
            <Card
              title={`${marketData.index} Summary`}
              subtitle={`Last updated: ${formatDate(marketData.timestamp, 'full')}`}
            >
              <div className="flex items-center mb-4">
                <div>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">
                    {formatPrice(marketData.close)}
                  </div>
                  <div className={`text-lg font-medium ${getPriceChangeClass(marketData.change)}`}>
                    {formatChangeWithArrow(marketData.change)} ({formatPercentage(marketData.changePercent / 100)})
                  </div>
                </div>
                <div className="ml-auto">
                  {marketData.change >= 0 ? (
                    <FiTrendingUp className="h-10 w-10 text-green-500" />
                  ) : (
                    <FiTrendingDown className="h-10 w-10 text-red-500" />
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Open</div>
                  <div className="text-base font-medium text-gray-900 dark:text-white">{formatPrice(marketData.open)}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Previous Close</div>
                  <div className="text-base font-medium text-gray-900 dark:text-white">{formatPrice(marketData.previousClose)}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Day Range</div>
                  <div className="text-base font-medium text-gray-900 dark:text-white">
                    {formatPrice(marketData.dayRange.low)} - {formatPrice(marketData.dayRange.high)}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">52 Week Range</div>
                  <div className="text-base font-medium text-gray-900 dark:text-white">
                    {formatPrice(marketData.yearRange.low)} - {formatPrice(marketData.yearRange.high)}
                  </div>
                </div>
              </div>
            </Card>
            
            {/* Technical Indicators */}
            <Card title="Technical Indicators" subtitle="Current market trend indicators">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300">RSI (14)</div>
                    <div className="text-sm font-medium">
                      {marketData.technicalIndicators.rsi.toFixed(2)}
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-tv-border rounded-full h-2.5">
                    <div
                      className={`h-2.5 rounded-full ${
                        marketData.technicalIndicators.rsi > 70
                          ? 'bg-red-500'
                          : marketData.technicalIndicators.rsi < 30
                          ? 'bg-green-500'
                          : 'bg-blue-500'
                      }`}
                      style={{ width: `${Math.min(marketData.technicalIndicators.rsi, 100)}%` }}
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
                      {marketData.technicalIndicators.adx.toFixed(2)}
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-tv-border rounded-full h-2.5">
                    <div
                      className="h-2.5 rounded-full bg-purple-500"
                      style={{ width: `${Math.min(marketData.technicalIndicators.adx * 2, 100)}%` }}
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
                      {marketData.technicalIndicators.macd.histogram.toFixed(2)}
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="text-xs text-gray-500 dark:text-gray-400">Signal:</div>
                    <div className="text-xs font-medium text-gray-700 dark:text-gray-300">
                      {marketData.technicalIndicators.macd.signal.toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 ml-2">MACD:</div>
                    <div className="text-xs font-medium text-gray-700 dark:text-gray-300">
                      {marketData.technicalIndicators.macd.macd.toFixed(2)}
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Moving Averages</div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">MA 20</div>
                      <div className={`text-xs font-medium ${
                        marketData.close > marketData.technicalIndicators.sma.sma20
                          ? 'text-green-500'
                          : 'text-red-500'
                      }`}>
                        {formatPrice(marketData.technicalIndicators.sma.sma20)}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">MA 50</div>
                      <div className={`text-xs font-medium ${
                        marketData.close > marketData.technicalIndicators.sma.sma50
                          ? 'text-green-500'
                          : 'text-red-500'
                      }`}>
                        {formatPrice(marketData.technicalIndicators.sma.sma50)}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">MA 200</div>
                      <div className={`text-xs font-medium ${
                        marketData.close > marketData.technicalIndicators.sma.sma200
                          ? 'text-green-500'
                          : 'text-red-500'
                      }`}>
                        {formatPrice(marketData.technicalIndicators.sma.sma200)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
            
            {/* Market Breadth */}
            <Card title="Market Breadth" subtitle="Advancing vs. Declining stocks">
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-1">
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Breadth Ratio</div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {(marketData.breadth.advancing / marketData.breadth.declining).toFixed(2)}
                  </div>
                </div>
                
                <div className="w-full bg-gray-200 dark:bg-tv-border rounded-full h-4 overflow-hidden">
                  <div
                    className="h-full bg-green-500 flex items-center justify-center text-xs text-white"
                    style={{
                      width: `${(marketData.breadth.advancing / marketData.breadth.total) * 100}%`,
                    }}
                  >
                    {marketData.breadth.advancing}
                  </div>
                  <div
                    className="h-full bg-red-500 flex items-center justify-center text-xs text-white"
                    style={{
                      width: `${(marketData.breadth.declining / marketData.breadth.total) * 100}%`,
                      marginLeft: `${(marketData.breadth.advancing / marketData.breadth.total) * 100}%`,
                    }}
                  >
                    {marketData.breadth.declining}
                  </div>
                </div>
                
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span className="text-green-500">Advancing</span>
                  <span className="text-red-500">Declining</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Advancing Volume
                  </div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {(marketData.breadth.advancingVolume / 1000000).toFixed(2)}M
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Declining Volume
                  </div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {(marketData.breadth.decliningVolume / 1000000).toFixed(2)}M
                  </div>
                </div>
                
                <div>
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Market Sentiment
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-full bg-gray-200 dark:bg-tv-border rounded-full h-2">
                      <div
                        className="h-2 rounded-full"
                        style={{
                          width: `${marketData.sentiment.bullish}%`,
                          backgroundColor: '#26A69A',
                        }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {marketData.sentiment.bullish}%
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="w-full bg-gray-200 dark:bg-tv-border rounded-full h-2">
                      <div
                        className="h-2 rounded-full"
                        style={{
                          width: `${marketData.sentiment.bearish}%`,
                          backgroundColor: '#EF5350',
                        }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {marketData.sentiment.bearish}%
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <span className="text-green-500">Bullish</span>
                    <span className="text-red-500">Bearish</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
          
          {/* Price Chart */}
          <Card title={`${selectedIndex} Chart (${timeframe})`}>
            <div className="h-[400px]">
              {marketData.historicalData.length > 0 ? (
                <CandlestickChart
                  data={marketData.historicalData}
                  darkMode={darkMode}
                  width={1000}
                  height={380}
                  showVolume={true}
                  showGrid={true}
                  showTooltip={true}
                  showLegend={true}
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500 dark:text-gray-400">No historical data available</p>
                </div>
              )}
            </div>
          </Card>
          
          {/* Sector Performance */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Sector Performance</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sectorData && sectorData.length > 0 ? (
                sectorData.map((sector) => (
                  <Card key={sector.name}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-base font-medium text-gray-900 dark:text-white">
                          {sector.name}
                        </h3>
                        <div className={`text-sm font-medium mt-1 ${getPriceChangeClass(sector.change)}`}>
                          {formatChangeWithArrow(sector.change)} ({formatPercentage(sector.changePercent / 100)})
                        </div>
                      </div>
                      <div className={`p-2 rounded-full ${
                        sector.change >= 0 ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'
                      }`}>
                        {sector.change >= 0 ? (
                          <FiArrowUp className={`h-5 w-5 ${sector.change >= 0 ? 'text-green-500' : 'text-red-500'}`} />
                        ) : (
                          <FiArrowDown className={`h-5 w-5 ${sector.change >= 0 ? 'text-green-500' : 'text-red-500'}`} />
                        )}
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Technical Indicators</div>
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <div className="text-xs text-gray-400 dark:text-gray-500">RSI</div>
                          <div className={`text-xs font-medium ${
                            sector.technicalIndicators.rsi > 70
                              ? 'text-red-500'
                              : sector.technicalIndicators.rsi < 30
                              ? 'text-green-500'
                              : 'text-gray-900 dark:text-white'
                          }`}>
                            {sector.technicalIndicators.rsi.toFixed(2)}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-400 dark:text-gray-500">ADX</div>
                          <div className="text-xs font-medium text-gray-900 dark:text-white">
                            {sector.technicalIndicators.adx.toFixed(2)}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-400 dark:text-gray-500">Trend</div>
                          <div className={`text-xs font-medium ${
                            sector.technicalIndicators.trend === 'uptrend'
                              ? 'text-green-500'
                              : sector.technicalIndicators.trend === 'downtrend'
                              ? 'text-red-500'
                              : 'text-yellow-500'
                          }`}>
                            {sector.technicalIndicators.trend.charAt(0).toUpperCase() + sector.technicalIndicators.trend.slice(1)}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <div className="flex justify-between">
                        <div className="text-xs text-gray-400 dark:text-gray-500">Top Gainer</div>
                        <div className="text-xs text-gray-400 dark:text-gray-500">Top Loser</div>
                      </div>
                      <div className="flex justify-between">
                        <div className="text-xs font-medium text-green-500">
                          {sector.topGainers[0]?.symbol} ({formatPercentage(sector.topGainers[0]?.changePercent / 100)})
                        </div>
                        <div className="text-xs font-medium text-red-500">
                          {sector.topLosers[0]?.symbol} ({formatPercentage(sector.topLosers[0]?.changePercent / 100)})
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <Link to={`/sectors/${sector.name.toLowerCase().replace(/\s+/g, '-')}`} className="text-xs text-ats-primary hover:underline">
                        View sector details →
                      </Link>
                    </div>
                  </Card>
                ))
              ) : (
                <div className="col-span-3 flex items-center justify-center py-8">
                  <p className="text-gray-500 dark:text-gray-400">No sector data available</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Top Performing Stocks */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Top Performing Stocks</h2>
            <Card>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-tv-border">
                  <thead className="bg-gray-50 dark:bg-tv-bg-secondary">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Symbol
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Price
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Change
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Volume
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Sector
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        RSI
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-tv-bg-secondary divide-y divide-gray-200 dark:divide-tv-border">
                    {topStocks && topStocks.length > 0 ? (
                      topStocks.map((stock) => (
                        <tr key={stock.symbol} className="hover:bg-gray-50 dark:hover:bg-tv-border">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {stock.symbol}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {stock.name}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 dark:text-white">
                              {formatPrice(stock.price)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className={`text-sm font-medium ${getPriceChangeClass(stock.changePercent)}`}>
                              {formatChangeWithArrow(stock.change)} ({formatPercentage(stock.changePercent / 100)})
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 dark:text-white">
                              {(stock.volume / 1000000).toFixed(2)}M
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                              {stock.sector}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <div className={`text-sm font-medium ${
                              stock.technicalIndicators.rsi > 70
                                ? 'text-red-500'
                                : stock.technicalIndicators.rsi < 30
                                ? 'text-green-500'
                                : 'text-gray-900 dark:text-white'
                            }`}>
                              {stock.technicalIndicators.rsi.toFixed(2)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            <Link
                              to={`/stock/${stock.symbol}`}
                              className="text-ats-primary hover:text-ats-primary-dark hover:underline mr-4"
                            >
                              Details
                            </Link>
                            <button
                              className="text-ats-primary hover:text-ats-primary-dark hover:underline"
                              onClick={() => {
                                console.log(`Add ${stock.symbol} to watchlist`);
                                // Implement watchlist functionality
                              }}
                            >
                              Add to Watchlist
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                          No stock data available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-4 text-right">
                <Link to="/screener" className="text-sm text-ats-primary hover:underline">
                  View all stocks →
                </Link>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;