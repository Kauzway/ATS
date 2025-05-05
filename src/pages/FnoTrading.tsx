import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { 
  FiBarChart2, 
  FiFilter, 
  FiCalendar, 
  FiDownload,
  FiPieChart, 
  FiInfoCircle,
  FiTarget,
  FiDollarSign
} from 'react-icons/fi';

// Components
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Spinner from '../components/common/Spinner';
import Tooltip from '../components/common/Tooltip';

// Store
import { RootState } from '../store';

// Types
import { FnOData } from '../types/stock';
import { formatPrice, formatPercentage, formatNumber, getPriceChangeClass } from '../utils/formatters';

// Mock service (to be replaced with real API integration)
import { fetchStockFnOData } from '../services/stockService';

const FnoTrading: React.FC = () => {
  const { darkMode } = useSelector((state: RootState) => state.theme);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stockSymbol, setStockSymbol] = useState('RELIANCE');
  const [fnOData, setFnOData] = useState<FnOData | null>(null);
  const [selectedExpiry, setSelectedExpiry] = useState<string>('');
  
  // Available F&O stocks for demo
  const fnoStocks = [
    'RELIANCE', 'HDFC', 'INFY', 'TCS', 'ICICIBANK', 'SBIN', 'TATAMOTORS', 'AXISBANK', 'MARUTI'
  ];
  
  // Fetch F&O data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const data = await fetchStockFnOData(stockSymbol);
        setFnOData(data);
        setSelectedExpiry(data.expiry);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [stockSymbol]);
  
  // Handle stock change
  const handleStockChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStockSymbol(e.target.value);
  };
  
  // Handle expiry change
  const handleExpiryChange = (expiry: string) => {
    setSelectedExpiry(expiry);
  };
  
  // Export option chain data
  const exportOptionChain = () => {
    // In a real implementation, format as CSV and trigger download
    alert('Export functionality will be implemented here');
  };
  
  // Utility function to create a price scale
  const createPriceScale = (atm: number, range: number = 10, step: number = 5): number[] => {
    const prices: number[] = [];
    const roundedAtm = Math.round(atm / step) * step;
    
    for (let i = -range; i <= range; i++) {
      prices.push(roundedAtm + (i * step));
    }
    
    return prices;
  };
  
  // Get current trend
  const getCurrentTrend = (): 'bullish' | 'bearish' | 'neutral' => {
    if (!fnOData) return 'neutral';
    
    // Use PCR and OI buildup to determine trend
    if (fnOData.pcr < 0.8) return 'bullish';
    if (fnOData.pcr > 1.2) return 'bearish';
    return 'neutral';
  };
  
  return (
    <div className="pb-8">
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">F&O Trading</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Analyze Futures and Options data for trading opportunities
        </p>
      </div>
      
      {/* Controls */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex items-center space-x-2">
          <label htmlFor="stock-select" className="text-sm text-gray-700 dark:text-gray-300">
            Stock:
          </label>
          <select
            id="stock-select"
            className="form-input py-1.5 text-sm min-w-[150px]"
            value={stockSymbol}
            onChange={handleStockChange}
          >
            {fnoStocks.map(stock => (
              <option key={stock} value={stock}>{stock}</option>
            ))}
          </select>
        </div>
        
        {fnOData && (
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-700 dark:text-gray-300">
              Expiry:
            </label>
            <div className="bg-gray-100 dark:bg-tv-bg-secondary rounded-md px-3 py-1.5 text-sm flex items-center">
              <FiCalendar className="mr-2 text-gray-500" size={14} />
              {fnOData.expiry}
            </div>
          </div>
        )}
        
        <div className="ml-auto">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<FiDownload />}
            onClick={exportOptionChain}
          >
            Export Data
          </Button>
        </div>
      </div>
      
      {/* Loading state */}
      {loading && (
        <div className="flex items-center justify-center h-48">
          <Spinner size="lg" label="Loading F&O data..." />
        </div>
      )}
      
      {/* Error state */}
      {error && (
        <Card className="bg-red-50 dark:bg-tv-bg-secondary border-red-200 dark:border-red-500">
          <div className="text-red-500 text-center">
            Error loading F&O data: {error}
          </div>
        </Card>
      )}
      
      {/* F&O data */}
      {!loading && !error && fnOData && (
        <div className="space-y-6">
          {/* Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Max Pain */}
            <Card>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                    Max Pain
                    <Tooltip content="The strike price at which option writers have the least financial loss">
                      <FiInfoCircle className="ml-1 text-gray-400" size={14} />
                    </Tooltip>
                  </h3>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {formatPrice(fnOData.maxPainStrike)}
                  </div>
                </div>
                <div className="bg-gray-100 dark:bg-tv-border p-2 rounded">
                  <FiTarget className="h-6 w-6 text-ats-primary" />
                </div>
              </div>
              
              <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center justify-between">
                  <span>Lot Size:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{fnOData.lotSize}</span>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span>Future Premium:</span>
                  <span className={`font-medium ${getPriceChangeClass(fnOData.futurePremium)}`}>
                    {fnOData.futurePremium > 0 ? '+' : ''}{fnOData.futurePremium.toFixed(2)}
                  </span>
                </div>
              </div>
            </Card>
            
            {/* Put-Call Ratio */}
            <Card>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                    Put-Call Ratio
                    <Tooltip content="Ratio of total put open interest to total call open interest">
                      <FiInfoCircle className="ml-1 text-gray-400" size={14} />
                    </Tooltip>
                  </h3>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {fnOData.pcr.toFixed(2)}
                  </div>
                </div>
                <div className={`p-2 rounded ${
                  fnOData.pcr > 1.2 ? 'bg-red-100 dark:bg-red-900' : 
                  fnOData.pcr < 0.8 ? 'bg-green-100 dark:bg-green-900' :
                  'bg-yellow-100 dark:bg-yellow-900'
                }`}>
                  <FiPieChart className={`h-6 w-6 ${
                    fnOData.pcr > 1.2 ? 'text-red-500' : 
                    fnOData.pcr < 0.8 ? 'text-green-500' :
                    'text-yellow-500'
                  }`} />
                </div>
              </div>
              
              <div className="mt-4">
                <div className="text-sm text-gray-700 dark:text-gray-300 mb-1">PCR Interpretation</div>
                <div className={`text-sm ${
                  fnOData.pcr > 1.2 ? 'text-red-500' : 
                  fnOData.pcr < 0.8 ? 'text-green-500' :
                  'text-yellow-500'
                }`}>
                  {fnOData.pcr > 1.2 ? 'Bearish' : 
                   fnOData.pcr < 0.8 ? 'Bullish' :
                   'Neutral'}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {fnOData.pcr > 1.2 ? 'High put volume indicates bearish sentiment' : 
                   fnOData.pcr < 0.8 ? 'Low put volume indicates bullish sentiment' :
                   'Balanced put and call volume indicates neutral sentiment'}
                </div>
              </div>
            </Card>
            
            {/* OI Buildup */}
            <Card>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                    OI Buildup
                    <Tooltip content="Analysis of Open Interest trends for calls and puts">
                      <FiInfoCircle className="ml-1 text-gray-400" size={14} />
                    </Tooltip>
                  </h3>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {getCurrentTrend().charAt(0).toUpperCase() + getCurrentTrend().slice(1)}
                  </div>
                </div>
                <div className={`p-2 rounded ${
                  getCurrentTrend() === 'bullish' ? 'bg-green-100 dark:bg-green-900' : 
                  getCurrentTrend() === 'bearish' ? 'bg-red-100 dark:bg-red-900' :
                  'bg-yellow-100 dark:bg-yellow-900'
                }`}>
                  <FiBarChart2 className={`h-6 w-6 ${
                    getCurrentTrend() === 'bullish' ? 'text-green-500' : 
                    getCurrentTrend() === 'bearish' ? 'text-red-500' :
                    'text-yellow-500'
                  }`} />
                </div>
              </div>
              
              <div className="mt-4 grid grid-cols-2 gap-2">
                <div>
                  <div className="text-sm text-gray-700 dark:text-gray-300 mb-1">Calls</div>
                  <div className={`text-sm font-medium ${
                    fnOData.oiBuildup.calls === 'long' ? 'text-green-500' : 
                    fnOData.oiBuildup.calls === 'short' ? 'text-red-500' :
                    'text-yellow-500'
                  }`}>
                    {fnOData.oiBuildup.calls.charAt(0).toUpperCase() + fnOData.oiBuildup.calls.slice(1)} Buildup
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-700 dark:text-gray-300 mb-1">Puts</div>
                  <div className={`text-sm font-medium ${
                    fnOData.oiBuildup.puts === 'long' ? 'text-green-500' : 
                    fnOData.oiBuildup.puts === 'short' ? 'text-red-500' :
                    'text-yellow-500'
                  }`}>
                    {fnOData.oiBuildup.puts.charAt(0).toUpperCase() + fnOData.oiBuildup.puts.slice(1)} Buildup
                  </div>
                </div>
              </div>
            </Card>
          </div>
          
          {/* Option Chain */}
          <Card title="Option Chain">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-tv-border">
                <thead className="bg-gray-50 dark:bg-tv-bg-secondary">
                  <tr>
                    <th colSpan={4} className="px-3 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider border-r border-gray-200 dark:border-tv-border">
                      CALLS
                    </th>
                    <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      STRIKE
                    </th>
                    <th colSpan={4} className="px-3 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider border-l border-gray-200 dark:border-tv-border">
                      PUTS
                    </th>
                  </tr>
                  <tr>
                    <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      OI
                    </th>
                    <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      VOLUME
                    </th>
                    <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      IV
                    </th>
                    <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider border-r border-gray-200 dark:border-tv-border">
                      PRICE
                    </th>
                    <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      
                    </th>
                    <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider border-l border-gray-200 dark:border-tv-border">
                      PRICE
                    </th>
                    <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      IV
                    </th>
                    <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      VOLUME
                    </th>
                    <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      OI
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-tv-bg-secondary divide-y divide-gray-200 dark:divide-tv-border">
                  {fnOData.options.map((option) => (
                    <tr 
                      key={option.strike} 
                      className={`hover:bg-gray-50 dark:hover:bg-tv-border ${
                        option.strike === fnOData.maxPainStrike ? 'bg-yellow-50 dark:bg-yellow-900 bg-opacity-30 dark:bg-opacity-20' : ''
                      }`}
                    >
                      <td className="px-3 py-2 whitespace-nowrap text-right text-sm text-gray-900 dark:text-white">
                        {formatNumber(option.callOI)}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-right text-sm text-gray-900 dark:text-white">
                        {formatNumber(option.callVolume)}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-right text-sm text-gray-900 dark:text-white">
                        {option.callIV.toFixed(1)}%
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-right text-sm font-medium text-green-500 border-r border-gray-200 dark:border-tv-border">
                        {formatPrice(option.callPrice, '₹', 1)}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-center text-sm font-bold text-gray-900 dark:text-white">
                        {option.strike === fnOData.maxPainStrike ? (
                          <div className="flex items-center justify-center">
                            <FiTarget className="text-yellow-500 mr-1" size={12} />
                            {formatPrice(option.strike, '₹', 1)}
                          </div>
                        ) : (
                          formatPrice(option.strike, '₹', 1)
                        )}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-right text-sm font-medium text-red-500 border-l border-gray-200 dark:border-tv-border">
                        {formatPrice(option.putPrice, '₹', 1)}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-right text-sm text-gray-900 dark:text-white">
                        {option.putIV.toFixed(1)}%
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-right text-sm text-gray-900 dark:text-white">
                        {formatNumber(option.putVolume)}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-right text-sm text-gray-900 dark:text-white">
                        {formatNumber(option.putOI)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center">
                <FiTarget className="text-yellow-500 mr-1" size={12} />
                <span>Highlighted row indicates max pain strike price</span>
              </div>
            </div>
          </Card>
          
          {/* Trade Ideas */}
          <Card title="F&O Trading Strategies">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Strategy 1 */}
              <div className="bg-gray-50 dark:bg-tv-border rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <div className={`p-2 rounded ${
                    getCurrentTrend() === 'bullish' ? 'bg-green-100 dark:bg-green-900' : 
                    getCurrentTrend() === 'bearish' ? 'bg-red-100 dark:bg-red-900' :
                    'bg-yellow-100 dark:bg-yellow-900'
                  }`}>
                    <FiDollarSign className={`h-5 w-5 ${
                      getCurrentTrend() === 'bullish' ? 'text-green-500' : 
                      getCurrentTrend() === 'bearish' ? 'text-red-500' :
                      'text-yellow-500'
                    }`} />
                  </div>
                  <h3 className="text-base font-medium text-gray-900 dark:text-white ml-2">
                    {getCurrentTrend() === 'bullish' ? 'Bull Call Spread' : 
                     getCurrentTrend() === 'bearish' ? 'Bear Put Spread' :
                     'Short Straddle'}
                  </h3>
                </div>
                
                <div className="space-y-2">
                  <div>
                    <div className="text-sm text-gray-700 dark:text-gray-300">Description:</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {getCurrentTrend() === 'bullish' ? 
                        'Buy ATM call and sell OTM call to benefit from upside while limiting cost' : 
                       getCurrentTrend() === 'bearish' ? 
                        'Buy ATM put and sell OTM put to benefit from downside while limiting cost' :
                        'Sell ATM call and put to benefit from low volatility and sideways movement'}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-gray-700 dark:text-gray-300">Setup:</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {getCurrentTrend() === 'bullish' ? 
                        `Buy ${stockSymbol} ${fnOData.maxPainStrike} Call, Sell ${stockSymbol} ${fnOData.maxPainStrike + 100} Call` : 
                       getCurrentTrend() === 'bearish' ? 
                        `Buy ${stockSymbol} ${fnOData.maxPainStrike} Put, Sell ${stockSymbol} ${fnOData.maxPainStrike - 100} Put` :
                        `Sell ${stockSymbol} ${fnOData.maxPainStrike} Call and ${fnOData.maxPainStrike} Put`}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-gray-700 dark:text-gray-300">Max Risk:</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {getCurrentTrend() === 'bullish' || getCurrentTrend() === 'bearish' ? 
                        'Limited to net premium paid' : 
                        'Unlimited if stock moves significantly'}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-gray-700 dark:text-gray-300">Max Reward:</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {getCurrentTrend() === 'bullish' || getCurrentTrend() === 'bearish' ? 
                        'Difference between strikes minus net premium paid' : 
                        'Limited to net premium received'}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Strategy 2 */}
              <div className="bg-gray-50 dark:bg-tv-border rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <div className={`p-2 rounded ${
                    getCurrentTrend() === 'bullish' ? 'bg-green-100 dark:bg-green-900' : 
                    getCurrentTrend() === 'bearish' ? 'bg-red-100 dark:bg-red-900' :
                    'bg-yellow-100 dark:bg-yellow-900'
                  }`}>
                    <FiDollarSign className={`h-5 w-5 ${
                      getCurrentTrend() === 'bullish' ? 'text-green-500' : 
                      getCurrentTrend() === 'bearish' ? 'text-red-500' :
                      'text-yellow-500'
                    }`} />
                  </div>
                  <h3 className="text-base font-medium text-gray-900 dark:text-white ml-2">
                    {getCurrentTrend() === 'bullish' ? 'Synthetic Long Stock' : 
                     getCurrentTrend() === 'bearish' ? 'Synthetic Short Stock' :
                     'Iron Condor'}
                  </h3>
                </div>
                
                <div className="space-y-2">
                  <div>
                    <div className="text-sm text-gray-700 dark:text-gray-300">Description:</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {getCurrentTrend() === 'bullish' ? 
                        'Buy ATM call and sell ATM put to simulate long stock position with leverage' : 
                       getCurrentTrend() === 'bearish' ? 
                        'Sell ATM call and buy ATM put to simulate short stock position with defined risk' :
                        'Sell OTM call spread and put spread to profit from range-bound price action'}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-gray-700 dark:text-gray-300">Setup:</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {getCurrentTrend() === 'bullish' ? 
                        `Buy ${stockSymbol} ${fnOData.maxPainStrike} Call, Sell ${stockSymbol} ${fnOData.maxPainStrike} Put` : 
                       getCurrentTrend() === 'bearish' ? 
                        `Sell ${stockSymbol} ${fnOData.maxPainStrike} Call, Buy ${stockSymbol} ${fnOData.maxPainStrike} Put` :
                        `Sell ${fnOData.maxPainStrike - 100} Put, Buy ${fnOData.maxPainStrike - 200} Put, Sell ${fnOData.maxPainStrike + 100} Call, Buy ${fnOData.maxPainStrike + 200} Call`}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-gray-700 dark:text-gray-300">Max Risk:</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {getCurrentTrend() === 'bullish' ? 
                        'Unlimited downside potential if stock falls significantly' : 
                       getCurrentTrend() === 'bearish' ? 
                        'Unlimited upside potential if stock rises significantly' :
                        'Limited to difference between adjacent strikes minus net credit received'}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-gray-700 dark:text-gray-300">Max Reward:</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {getCurrentTrend() === 'bullish' ? 
                        'Unlimited upside potential if stock rises significantly' : 
                       getCurrentTrend() === 'bearish' ? 
                        'Limited to strike price minus stock price at expiration' :
                        'Limited to net premium received'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-gray-100 dark:bg-tv-bg-primary rounded-lg">
              <div className="flex items-center">
                <FiInfoCircle className="text-ats-primary mr-2" size={16} />
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  These strategies are suggestions based on the current market data. Always do your own research and risk assessment before executing any trade.
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default FnoTrading;