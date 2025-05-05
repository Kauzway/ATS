import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  FiSettings, 
  FiMoon, 
  FiSun, 
  FiMonitor, 
  FiSave, 
  FiRefreshCw,
  FiAlertCircle,
  FiCheckCircle
} from 'react-icons/fi';

// Components
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Spinner from '../components/common/Spinner';

// Store
import { AppDispatch, RootState } from '../store';
import { toggleTheme } from '../store/slices/themeSlice';

// Types and utilities
import { niftyIndices } from '../data/niftyIndices';

const Settings: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { darkMode } = useSelector((state: RootState) => state.theme);
  
  const [saving, setSaving] = useState(false);
  const [apiStatus, setApiStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [settings, setSettings] = useState({
    defaultIndex: 'NIFTY 50',
    defaultTimeframe: 'daily',
    refreshInterval: '5',
    dataSource: 'nse',
    enableRealTimeData: true,
    enableMLPredictions: true,
    enableAdvancedIndicators: true,
    apiKey: '••••••••••••••••',
    apiSecret: '••••••••••••••••••••••••••',
    notificationsEnabled: true,
    alertsEnabled: true,
  });

  // Handle settings change
  const handleSettingsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    // Handle checkbox inputs
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setSettings({ ...settings, [name]: checked });
    } else {
      setSettings({ ...settings, [name]: value });
    }
  };

  // Handle theme toggle
  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };
  
  // Save settings
  const saveSettings = () => {
    setSaving(true);
    setApiStatus('idle');
    
    // Simulating API call
    setTimeout(() => {
      // In a real implementation, this would be an API call
      try {
        // Save settings to localStorage for demo
        localStorage.setItem('atsSettings', JSON.stringify(settings));
        setApiStatus('success');
      } catch (error) {
        setApiStatus('error');
      }
      setSaving(false);
      
      // Reset status after 3 seconds
      setTimeout(() => {
        setApiStatus('idle');
      }, 3000);
    }, 1000);
  };
  
  // Reset settings
  const resetSettings = () => {
    setSaving(true);
    setApiStatus('idle');
    
    // Simulating API call
    setTimeout(() => {
      setSettings({
        defaultIndex: 'NIFTY 50',
        defaultTimeframe: 'daily',
        refreshInterval: '5',
        dataSource: 'nse',
        enableRealTimeData: true,
        enableMLPredictions: true,
        enableAdvancedIndicators: true,
        apiKey: '••••••••••••••••',
        apiSecret: '••••••••••••••••••••••••••',
        notificationsEnabled: true,
        alertsEnabled: true,
      });
      
      // Remove settings from localStorage
      localStorage.removeItem('atsSettings');
      
      setSaving(false);
    }, 1000);
  };
  
  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('atsSettings');
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings({ ...settings, ...parsedSettings });
      } catch (error) {
        console.error('Error parsing saved settings:', error);
      }
    }
  }, []);
  
  return (
    <div className="pb-8">
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Customize your ATS experience
        </p>
      </div>
      
      {/* Settings sections */}
      <div className="space-y-6">
        {/* Appearance */}
        <Card title="Appearance">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Theme</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Choose between light and dark theme
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  className={`p-2 rounded-md ${
                    !darkMode ? 'bg-gray-100 text-gray-900' : 'text-gray-400'
                  }`}
                  onClick={() => !darkMode || handleThemeToggle()}
                  aria-label="Light mode"
                >
                  <FiSun className="h-5 w-5" />
                </button>
                <button
                  className={`p-2 rounded-md ${
                    darkMode ? 'bg-gray-800 text-white' : 'text-gray-400'
                  }`}
                  onClick={() => darkMode || handleThemeToggle()}
                  aria-label="Dark mode"
                >
                  <FiMoon className="h-5 w-5" />
                </button>
                <button
                  className="p-2 rounded-md text-gray-400"
                  onClick={() => {
                    // Set to system preference
                    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                    if (prefersDark !== darkMode) {
                      handleThemeToggle();
                    }
                  }}
                  aria-label="System preference"
                >
                  <FiMonitor className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </Card>
        
        {/* General Settings */}
        <Card title="General Settings">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Default Index
              </label>
              <select
                name="defaultIndex"
                className="form-input w-full"
                value={settings.defaultIndex}
                onChange={handleSettingsChange}
              >
                {niftyIndices.slice(0, 20).map(index => (
                  <option key={index} value={index}>{index}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Default Timeframe
              </label>
              <select
                name="defaultTimeframe"
                className="form-input w-full"
                value={settings.defaultTimeframe}
                onChange={handleSettingsChange}
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Data Refresh Interval (minutes)
              </label>
              <select
                name="refreshInterval"
                className="form-input w-full"
                value={settings.refreshInterval}
                onChange={handleSettingsChange}
              >
                <option value="1">1 minute</option>
                <option value="5">5 minutes</option>
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
                <option value="60">60 minutes</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Data Source
              </label>
              <select
                name="dataSource"
                className="form-input w-full"
                value={settings.dataSource}
                onChange={handleSettingsChange}
              >
                <option value="nse">NSE India</option>
                <option value="yahoo">Yahoo Finance</option>
                <option value="alphavantage">Alpha Vantage</option>
              </select>
            </div>
          </div>
          
          <div className="mt-6 space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="enableRealTimeData"
                name="enableRealTimeData"
                className="h-4 w-4 text-ats-primary focus:ring-ats-primary border-gray-300 rounded"
                checked={settings.enableRealTimeData}
                onChange={handleSettingsChange}
              />
              <label htmlFor="enableRealTimeData" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Enable real-time data updates
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="enableMLPredictions"
                name="enableMLPredictions"
                className="h-4 w-4 text-ats-primary focus:ring-ats-primary border-gray-300 rounded"
                checked={settings.enableMLPredictions}
                onChange={handleSettingsChange}
              />
              <label htmlFor="enableMLPredictions" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Enable machine learning predictions
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="enableAdvancedIndicators"
                name="enableAdvancedIndicators"
                className="h-4 w-4 text-ats-primary focus:ring-ats-primary border-gray-300 rounded"
                checked={settings.enableAdvancedIndicators}
                onChange={handleSettingsChange}
              />
              <label htmlFor="enableAdvancedIndicators" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Enable advanced technical indicators
              </label>
            </div>
          </div>
        </Card>
        
        {/* API Configuration */}
        <Card title="API Configuration">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                API Key
              </label>
              <input
                type="password"
                name="apiKey"
                className="form-input w-full"
                value={settings.apiKey}
                onChange={handleSettingsChange}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                API Secret
              </label>
              <input
                type="password"
                name="apiSecret"
                className="form-input w-full"
                value={settings.apiSecret}
                onChange={handleSettingsChange}
              />
            </div>
            
            <div className="text-sm text-gray-500 dark:text-gray-400">
              <p>
                API keys are required for accessing real-time data and advanced features.
                You can obtain your API keys from your data provider.
              </p>
            </div>
          </div>
        </Card>
        
        {/* Notifications */}
        <Card title="Notifications">
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="notificationsEnabled"
                name="notificationsEnabled"
                className="h-4 w-4 text-ats-primary focus:ring-ats-primary border-gray-300 rounded"
                checked={settings.notificationsEnabled}
                onChange={handleSettingsChange}
              />
              <label htmlFor="notificationsEnabled" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Enable browser notifications
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="alertsEnabled"
                name="alertsEnabled"
                className="h-4 w-4 text-ats-primary focus:ring-ats-primary border-gray-300 rounded"
                checked={settings.alertsEnabled}
                onChange={handleSettingsChange}
              />
              <label htmlFor="alertsEnabled" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Enable price alerts
              </label>
            </div>
            
            <div className="text-sm text-gray-500 dark:text-gray-400">
              <p>
                You can configure specific alerts for individual stocks from their respective analysis pages.
              </p>
            </div>
          </div>
        </Card>
        
        {/* Actions */}
        <div className="flex flex-wrap gap-4">
          <Button
            variant="primary"
            leftIcon={<FiSave />}
            onClick={saveSettings}
            isLoading={saving}
            disabled={saving}
          >
            Save Settings
          </Button>
          
          <Button
            variant="outline"
            leftIcon={<FiRefreshCw />}
            onClick={resetSettings}
            disabled={saving}
          >
            Reset to Defaults
          </Button>
          
          {apiStatus === 'success' && (
            <div className="flex items-center text-green-500">
              <FiCheckCircle className="mr-1" />
              <span>Settings saved successfully</span>
            </div>
          )}
          
          {apiStatus === 'error' && (
            <div className="flex items-center text-red-500">
              <FiAlertCircle className="mr-1" />
              <span>Error saving settings</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;