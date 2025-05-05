import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FiPieChart, FiBarChart2, FiRefreshCw } from 'react-icons/fi';

// Components
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Spinner from '../components/common/Spinner';
import CandlestickChart from '../components/charts/CandlestickChart';

// Store
import { AppDispatch, RootState } from '../store';
import { fetchSectorData } from '../store/slices/marketSlice';

// Types and utilities
import { SectorData } from '../types/market';
import { formatPrice, formatPercentage, formatChangeWithArrow, getPriceChangeClass } from '../utils/formatters';

const SectorAnalysis: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { darkMode } = useSelector((state: RootState) => state.theme);
  const { sectorData, loading, error } = useSelector((state: RootState) => state.market);
  
  const [selectedSector, setSelectedSector] = useState<string>('');
  const [timeframe, setTimeframe] = useState<string>('daily');
  const [sectorPerformance, setSectorPerformance] = useState<{
    day: number[];
    week: number[];
    month: number[];
    threeMonths: number[];
    sixMonths: number[];
    year: number[];
  }>({
    day: [],
    week: [],
    month: [],
    threeMonths: [],
    sixMonths: [],
    year: []
  });

  // Fetch sector data
  useEffect(() => {
    dispatch(fetchSectorData({ timeframe }));
  }, [dispatch, timeframe]);

  // Update sector performance data for chart
  useEffect(() => {
    if (sectorData && sectorData.length > 0) {
      // Set the first sector as selected if none is selected
      if (!selectedSector) {
        setSelectedSector(sectorData[0].name);
      }
      
      // Extract performance data for charts
      const dayPerformance = sectorData.map(sector => sector.historicalPerformance.day);
      const weekPerformance = sectorData.map(sector => sector.historicalPerformance.week);
      const monthPerformance = sectorData.map(sector => sector.historicalPerformance.month);
      const threeMonthsPerformance = sectorData.map(sector => sector.historicalPerformance.threeMonths);
      const sixMonthsPerformance = sectorData.map(sector => sector.historicalPerformance.sixMonths);
      const yearPerformance = sectorData.map(sector => sector.historicalPerformance.year);
      
      setSectorPerformance({
        day: dayPerformance,
        week: weekPerformance,
        month: monthPerformance,
        threeMonths: threeMonthsPerformance,
        sixMonths: sixMonthsPerformance,
        year: yearPerformance
      });
    }
  }, [sectorData, selectedSector]);

  // Handle timeframe change
  const handleTimeframeChange = (tf: string) => {
    setTimeframe(tf);
  };

  // Handle sector selection
  const handleSectorChange = (sector: string) => {
    setSelectedSector(sector);
  };

  // Get the selected sector data
  const getSelectedSectorData = (): SectorData | undefined => {
    return sectorData.find(sector => sector.name === selectedSector);
  };

  // Generate mock data for sector chart
  const generateMockChartData = () => {
    const now = Date.now();
    const data = [];
    
    // Generate 100 days of mock data
    for (let i = 100; i >= 0; i--) {
      const time = now - i * 86400000; // 86400000 = 1 day in milliseconds
      const basePrice = 1000 + Math.random() * 500;
      const volatility = 10 + Math.random() * 20;
      
      const open = basePrice + (Math.random() - 0.5) * volatility;
      const high = open + Math.random() * volatility;
      const low = open - Math.random() * volatility;
      const close = low + Math.random() * (high - low);
      const volume = Math.floor(1000000 + Math.random() * 5000000);
      
      data.push({
        time,
        open,
        high,
        low,
        close,
        volume,
      });
    }
    
    return data;
  };

  // Refresh data
  const refreshData = () => {
    dispatch(fetchSectorData({ timeframe }));
  };

  if (loading && !sectorData.length) {
    return (
      <div className="flex items-center justify-center h-full py-20">
        <Spinner size="lg" label="Loading sector data..." />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-20">
        <div className="text-red-500 text-lg mb-4">Error loading sector data: {error}</div>
        <Button
          variant="primary"
          onClick={refreshData}
        >
          Retry
        </Button>
      </div>
    );
  }

  const selectedSectorData = getSelectedSectorData();

  return (
    <div className="pb-8">
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Sector Analysis</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Compare performance across different sectors
        </p>
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
                onClick={() => handleTimeframeChange(tf)}
              >
                {tf.charAt(0).toUpperCase() + tf.slice(1)}
              </button>
            ))}
          </div>
          
          <Button
            variant="outline"
            size="sm"
            leftIcon={<FiRefreshCw />}
            onClick={refreshData}
            className="ml-2"
          >
            Refresh
          </Button>
        </div>
      </div>
      
      {/* Sector overview */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
        {sectorData.slice(0, 4).map((sector) => (
          <Card 
            key={sector.name} 
            className={`cursor-pointer transition-colors duration-200 ${
              selectedSector === sector.name ? 'border-ats-primary' : ''
            }`}
            onClick={() => handleSectorChange(sector.name)}
          >
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
                  <FiBarChart2 className={`h-5 w-5 ${sector.change >= 0 ? 'text-green-500' : 'text-red-500'}`} />
                ) : (
                  <FiBarChart2 className={`h-5 w-5 ${sector.change >= 0 ? 'text-green-500' : 'text-red-500'}`} />
                )}
              </div>
            </div>
            
            <div className="mt-3">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Market Cap: ₹{(sector.marketCap / 1000000000000).toFixed(2)}T</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">P/E: {sector.pe.toFixed(2)}</div>
            </div>
          </Card>
        ))}
      </div>
      
      {/* Selected sector details */}
      {selectedSectorData && (
        <div className="space-y-6">
          {/* Sector chart */}
          <Card title={`${selectedSectorData.name} Chart (${timeframe})`}>
            <div className="h-[400px]">
              <CandlestickChart
                data={generateMockChartData()}
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
          
          {/* Performance metrics */}
          <Card title="Historical Performance">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">1 Day</div>
                <div className={`text-lg font-medium ${getPriceChangeClass(selectedSectorData.historicalPerformance.day)}`}>
                  {formatPercentage(selectedSectorData.historicalPerformance.day / 100)}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">1 Week</div>
                <div className={`text-lg font-medium ${getPriceChangeClass(selectedSectorData.historicalPerformance.week)}`}>
                  {formatPercentage(selectedSectorData.historicalPerformance.week / 100)}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">1 Month</div>
                <div className={`text-lg font-medium ${getPriceChangeClass(selectedSectorData.historicalPerformance.month)}`}>
                  {formatPercentage(selectedSectorData.historicalPerformance.month / 100)}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">3 Months</div>
                <div className={`text-lg font-medium ${getPriceChangeClass(selectedSectorData.historicalPerformance.threeMonths)}`}>
                  {formatPercentage(selectedSectorData.historicalPerformance.threeMonths / 100)}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">6 Months</div>
                <div className={`text-lg font-medium ${getPriceChangeClass(selectedSectorData.historicalPerformance.sixMonths)}`}>
                  {formatPercentage(selectedSectorData.historicalPerformance.sixMonths / 100)}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">1 Year</div>
                <div className={`text-lg font-medium ${getPriceChangeClass(selectedSectorData.historicalPerformance.year)}`}>
                  {formatPercentage(selectedSectorData.historicalPerformance.year / 100)}
                </div>
              </div>
            </div>
          </Card>
          
          {/* Top stocks in sector */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Top gainers */}
            <Card title="Top Gainers">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-tv-border">
                  <thead className="bg-gray-50 dark:bg-tv-bg-secondary">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Symbol
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Change
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-tv-bg-secondary divide-y divide-gray-200 dark:divide-tv-border">
                    {selectedSectorData.topGainers.map((stock, index) => (
                      <tr key={stock.symbol} className="hover:bg-gray-50 dark:hover:bg-tv-border">
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {stock.symbol}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {stock.name}
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-right">
                          <div className="text-sm font-medium text-green-500">
                            {formatChangeWithArrow(stock.change)} ({formatPercentage(stock.changePercent / 100)})
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
            
            {/* Top losers */}
            <Card title="Top Losers">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-tv-border">
                  <thead className="bg-gray-50 dark:bg-tv-bg-secondary">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Symbol
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Change
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-tv-bg-secondary divide-y divide-gray-200 dark:divide-tv-border">
                    {selectedSectorData.topLosers.map((stock, index) => (
                      <tr key={stock.symbol} className="hover:bg-gray-50 dark:hover:bg-tv-border">
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {stock.symbol}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {stock.name}
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-right">
                          <div className="text-sm font-medium text-red-500">
                            {formatChangeWithArrow(stock.change)} ({formatPercentage(stock.changePercent / 100)})
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
          
          {/* Technical indicators */}
          <Card title="Sector Technical Analysis">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">RSI</h4>
                <div className="flex items-center justify-between mb-1">
                  <div className="text-sm text-gray-700 dark:text-gray-300">Value:</div>
                  <div className={`text-sm font-medium ${
                    selectedSectorData.technicalIndicators.rsi > 70
                      ? 'text-red-500'
                      : selectedSectorData.technicalIndicators.rsi < 30
                      ? 'text-green-500'
                      : 'text-gray-900 dark:text-white'
                  }`}>
                    {selectedSectorData.technicalIndicators.rsi.toFixed(2)}
                  </div>
                </div>
                <div className="w-full bg-gray-200 dark:bg-tv-border rounded-full h-2.5">
                  <div
                    className={`h-2.5 rounded-full ${
                      selectedSectorData.technicalIndicators.rsi > 70
                        ? 'bg-red-500'
                        : selectedSectorData.technicalIndicators.rsi < 30
                        ? 'bg-green-500'
                        : 'bg-blue-500'
                    }`}
                    style={{ width: `${Math.min(selectedSectorData.technicalIndicators.rsi, 100)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                  <span>Oversold</span>
                  <span>Neutral</span>
                  <span>Overbought</span>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">ADX</h4>
                <div className="flex items-center justify-between mb-1">
                  <div className="text-sm text-gray-700 dark:text-gray-300">Value:</div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {selectedSectorData.technicalIndicators.adx.toFixed(2)}
                  </div>
                </div>
                <div className="w-full bg-gray-200 dark:bg-tv-border rounded-full h-2.5">
                  <div
                    className="h-2.5 rounded-full bg-purple-500"
                    style={{ width: `${Math.min(selectedSectorData.technicalIndicators.adx * 2, 100)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                  <span>Weak</span>
                  <span>Strong</span>
                  <span>Very Strong</span>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Trend</h4>
                <div className="bg-gray-100 dark:bg-tv-border px-4 py-3 rounded-lg">
                  <div className={`text-lg font-medium ${
                    selectedSectorData.technicalIndicators.trend === 'uptrend'
                      ? 'text-green-500'
                      : selectedSectorData.technicalIndicators.trend === 'downtrend'
                      ? 'text-red-500'
                      : 'text-yellow-500'
                  }`}>
                    {selectedSectorData.technicalIndicators.trend.charAt(0).toUpperCase() + selectedSectorData.technicalIndicators.trend.slice(1)}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {selectedSectorData.technicalIndicators.trend === 'uptrend'
                      ? 'Prices are trending higher with potential for further gains'
                      : selectedSectorData.technicalIndicators.trend === 'downtrend'
                      ? 'Prices are trending lower with potential for further decline'
                      : 'Prices are moving sideways with no clear direction'
                    }
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default SectorAnalysis;