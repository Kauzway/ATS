import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FiFilter, FiRefreshCw, FiDownload, FiSave } from 'react-icons/fi';

// Components
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Spinner from '../components/common/Spinner';

// Store
import { RootState } from '../store';

// Types and utilities
import { StockData } from '../types/stock';
import { formatPrice, formatPercentage, formatChangeWithArrow, getPriceChangeClass } from '../utils/formatters';

// Mock data for demonstration
const demoStocks: StockData[] = Array(20).fill(null).map((_, i) => ({
  time: Date.now() - i * 86400000,
  open: 1000 + Math.random() * 200,
  high: 1100 + Math.random() * 200,
  low: 900 + Math.random() * 200,
  close: 1050 + Math.random() * 200,
  volume: 1000000 + Math.random() * 5000000
}));

interface FilterState {
  minPrice: string;
  maxPrice: string;
  minVolume: string;
  minRSI: string;
  maxRSI: string;
  minADX: string;
  selectedSector: string;
  selectedTrend: string;
}

const Screener: React.FC = () => {
  const { darkMode } = useSelector((state: RootState) => state.theme);
  
  const [loading, setLoading] = useState(false);
  const [stocks, setStocks] = useState<StockData[]>([]);
  const [filteredStocks, setFilteredStocks] = useState<StockData[]>([]);
  const [filters, setFilters] = useState<FilterState>({
    minPrice: '',
    maxPrice: '',
    minVolume: '',
    minRSI: '0',
    maxRSI: '100',
    minADX: '0',
    selectedSector: 'all',
    selectedTrend: 'all'
  });
  
  // Available sectors
  const sectors = ['All', 'IT', 'Banking', 'Auto', 'Pharma', 'FMCG', 'Metal', 'Oil & Gas'];
  const trends = ['All', 'Uptrend', 'Downtrend', 'Sideways'];

  // Fetch stocks data
  useEffect(() => {
    setLoading(true);
    // Simulating API call
    setTimeout(() => {
      setStocks(demoStocks);
      setFilteredStocks(demoStocks);
      setLoading(false);
    }, 1000);
  }, []);

  // Handle filter changes
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  // Apply filters
  const applyFilters = () => {
    setLoading(true);
    
    // Simulating filter processing
    setTimeout(() => {
      const filtered = stocks.filter(stock => {
        if (filters.minPrice && stock.close < parseFloat(filters.minPrice)) return false;
        if (filters.maxPrice && stock.close > parseFloat(filters.maxPrice)) return false;
        if (filters.minVolume && stock.volume < parseFloat(filters.minVolume)) return false;
        
        // Add other filters as implemented
        
        return true;
      });
      
      setFilteredStocks(filtered);
      setLoading(false);
    }, 500);
  };

  // Save filter preset
  const saveFilterPreset = () => {
    const presetName = prompt('Enter a name for this filter preset:');
    if (presetName) {
      // Save to localStorage for demo purposes
      const presets = JSON.parse(localStorage.getItem('filterPresets') || '{}');
      presets[presetName] = filters;
      localStorage.setItem('filterPresets', JSON.stringify(presets));
      alert(`Filter preset "${presetName}" saved!`);
    }
  };

  // Export results
  const exportResults = () => {
    // In a real implementation, format as CSV and trigger download
    alert('Export functionality will be implemented here.');
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      minPrice: '',
      maxPrice: '',
      minVolume: '',
      minRSI: '0',
      maxRSI: '100',
      minADX: '0',
      selectedSector: 'all',
      selectedTrend: 'all'
    });
    setFilteredStocks(stocks);
  };

  return (
    <div className="pb-8">
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Stock Screener</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Find trading opportunities based on technical and fundamental criteria
        </p>
      </div>
      
      {/* Filters */}
      <Card title="Filter Criteria" className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Price range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Price Range (₹)
            </label>
            <div className="flex space-x-2">
              <input
                type="number"
                name="minPrice"
                placeholder="Min"
                className="form-input w-full"
                value={filters.minPrice}
                onChange={handleFilterChange}
              />
              <input
                type="number"
                name="maxPrice"
                placeholder="Max"
                className="form-input w-full"
                value={filters.maxPrice}
                onChange={handleFilterChange}
              />
            </div>
          </div>
          
          {/* Volume */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Min Volume
            </label>
            <input
              type="number"
              name="minVolume"
              placeholder="Min Volume"
              className="form-input w-full"
              value={filters.minVolume}
              onChange={handleFilterChange}
            />
          </div>
          
          {/* Sector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Sector
            </label>
            <select
              name="selectedSector"
              className="form-input w-full"
              value={filters.selectedSector}
              onChange={handleFilterChange}
            >
              {sectors.map(sector => (
                <option key={sector} value={sector.toLowerCase()}>
                  {sector}
                </option>
              ))}
            </select>
          </div>
          
          {/* RSI Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              RSI Range
            </label>
            <div className="flex space-x-2">
              <input
                type="number"
                name="minRSI"
                placeholder="Min"
                className="form-input w-full"
                min="0"
                max="100"
                value={filters.minRSI}
                onChange={handleFilterChange}
              />
              <input
                type="number"
                name="maxRSI"
                placeholder="Max"
                className="form-input w-full"
                min="0"
                max="100"
                value={filters.maxRSI}
                onChange={handleFilterChange}
              />
            </div>
          </div>
          
          {/* ADX */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Min ADX (Trend Strength)
            </label>
            <input
              type="number"
              name="minADX"
              placeholder="Min ADX"
              className="form-input w-full"
              min="0"
              max="100"
              value={filters.minADX}
              onChange={handleFilterChange}
            />
          </div>
          
          {/* Trend */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Trend
            </label>
            <select
              name="selectedTrend"
              className="form-input w-full"
              value={filters.selectedTrend}
              onChange={handleFilterChange}
            >
              {trends.map(trend => (
                <option key={trend} value={trend.toLowerCase()}>
                  {trend}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-6">
          <Button 
            variant="primary" 
            leftIcon={<FiFilter />}
            onClick={applyFilters}
            isLoading={loading}
          >
            Apply Filters
          </Button>
          <Button 
            variant="secondary" 
            leftIcon={<FiRefreshCw />}
            onClick={resetFilters}
          >
            Reset
          </Button>
          <Button 
            variant="outline" 
            leftIcon={<FiSave />}
            onClick={saveFilterPreset}
          >
            Save Preset
          </Button>
          <Button 
            variant="outline" 
            leftIcon={<FiDownload />}
            onClick={exportResults}
          >
            Export Results
          </Button>
        </div>
      </Card>
      
      {/* Results Table */}
      <Card title={`Screener Results (${filteredStocks.length})`}>
        {loading ? (
          <div className="flex justify-center py-8">
            <Spinner size="lg" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-tv-border">
              <thead className="bg-gray-50 dark:bg-tv-bg-secondary">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Symbol
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Change
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Volume
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    RSI
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    ADX
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Trend
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-tv-bg-secondary divide-y divide-gray-200 dark:divide-tv-border">
                {filteredStocks.length > 0 ? (
                  filteredStocks.map((stock, index) => {
                    // Calculate fake values for demo
                    const change = stock.close - stock.open;
                    const changePercent = (change / stock.open) * 100;
                    const fakeRSI = 30 + Math.random() * 40;
                    const fakeADX = 15 + Math.random() * 35;
                    const fakeTrend = ['Uptrend', 'Downtrend', 'Sideways'][Math.floor(Math.random() * 3)];
                    const fakeSymbol = ['INFY', 'TCS', 'RELIANCE', 'HDFC', 'SBIN'][index % 5];
                    
                    return (
                      <tr key={index} className="hover:bg-gray-50 dark:hover:bg-tv-border">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          {fakeSymbol}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {formatPrice(stock.close)}
                        </td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm ${getPriceChangeClass(change)}`}>
                          {formatChangeWithArrow(change)} ({formatPercentage(changePercent / 100)})
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {(stock.volume / 1000000).toFixed(2)}M
                        </td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                          fakeRSI > 70 ? 'text-red-500' : 
                          fakeRSI < 30 ? 'text-green-500' : 
                          'text-gray-900 dark:text-white'
                        }`}>
                          {fakeRSI.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {fakeADX.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            fakeTrend === 'Uptrend' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' :
                            fakeTrend === 'Downtrend' ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200' :
                            'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                          }`}>
                            {fakeTrend}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-ats-primary">
                          <a href={`/stock/${fakeSymbol}`} className="hover:underline">View Details</a>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={8} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                      No stocks match the selected criteria
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Screener;