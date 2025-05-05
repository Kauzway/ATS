// src/components/charts/BollingerBandsChart.tsx
import React, { useEffect, useRef } from 'react';
import { createChart, IChartApi, LineData, CandlestickData } from 'lightweight-charts';
import { StockData } from '../../types/stock';
import { calculateBollingerBands } from '../../utils/enhancedIndicators';

interface BollingerBandsChartProps {
  data: StockData[];
  width?: number;
  height?: number;
  darkMode?: boolean;
  period?: number;
  multiplier?: number;
  showGrid?: boolean;
  showTooltip?: boolean;
}

const BollingerBandsChart: React.FC<BollingerBandsChartProps> = ({
  data,
  width = 600,
  height = 400,
  darkMode = true,
  period = 20,
  multiplier = 2,
  showGrid = true,
  showTooltip = true,
}) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current || data.length === 0) return;

    // Cleanup previous chart
    if (chartRef.current) {
      chartRef.current.remove();
      chartRef.current = null;
    }

    // Chart configuration based on theme
    const chartOptions = {
      width,
      height,
      layout: {
        background: {
          color: darkMode ? '#131722' : '#FFFFFF',
        },
        textColor: darkMode ? '#D9D9D9' : '#191919',
      },
      grid: {
        vertLines: {
          color: darkMode ? '#2B2B43' : '#E6E6E6',
          visible: showGrid,
        },
        horzLines: {
          color: darkMode ? '#2B2B43' : '#E6E6E6',
          visible: showGrid,
        },
      },
      rightPriceScale: {
        borderColor: darkMode ? '#2B2B43' : '#E6E6E6',
      },
      timeScale: {
        borderColor: darkMode ? '#2B2B43' : '#E6E6E6',
        timeVisible: true,
        secondsVisible: false,
      },
      crosshair: {
        mode: 1,
      },
    };

    // Create chart instance
    const chart = createChart(chartContainerRef.current, chartOptions);
    chartRef.current = chart;

    // Resize handler
    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    // Add candlestick series
    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#26A69A',
      downColor: '#EF5350',
      borderVisible: false,
      wickUpColor: '#26A69A',
      wickDownColor: '#EF5350',
    });

    // Format data for candlestick chart
    const formattedData: CandlestickData[] = data.map(item => ({
      time: item.time / 1000, // Convert milliseconds to seconds for lightweight-charts
      open: item.open,
      high: item.high,
      low: item.low,
      close: item.close,
    }));

    // Set data to candlestick series
    candlestickSeries.setData(formattedData);

    // Calculate Bollinger Bands
    const bbands = calculateBollingerBands(data, period, multiplier);

    // Add Bollinger Bands series
    const upperBandSeries = chart.addLineSeries({
      color: 'rgba(118, 118, 218, 0.8)',
      lineWidth: 1,
      title: 'Upper Band',
    });

    const middleBandSeries = chart.addLineSeries({
      color: 'rgba(118, 118, 218, 0.5)',
      lineWidth: 1,
      lineStyle: 1, // Dashed line
      title: 'Middle Band (SMA)',
    });

    const lowerBandSeries = chart.addLineSeries({
      color: 'rgba(118, 118, 218, 0.8)',
      lineWidth: 1,
      title: 'Lower Band',
    });

    // Format data for Bollinger Bands
    const upperBandData: LineData[] = bbands.upper
      .map((value, index) => ({
        time: data[index].time / 1000,
        value: value,
      }))
      .filter(item => !isNaN(item.value));

    const middleBandData: LineData[] = bbands.middle
      .map((value, index) => ({
        time: data[index].time / 1000,
        value: value,
      }))
      .filter(item => !isNaN(item.value));

    const lowerBandData: LineData[] = bbands.lower
      .map((value, index) => ({
        time: data[index].time / 1000,
        value: value,
      }))
      .filter(item => !isNaN(item.value));

    // Set data to Bollinger Bands series
    upperBandSeries.setData(upperBandData);
    middleBandSeries.setData(middleBandData);
    lowerBandSeries.setData(lowerBandData);

    // Add tooltip if enabled
    if (showTooltip) {
      // Add tooltip container
      const tooltipContainer = document.createElement('div');
      tooltipContainer.className = 'bbands-tooltip';
      tooltipContainer.style.position = 'absolute';
      tooltipContainer.style.display = 'none';
      tooltipContainer.style.padding = '8px';
      tooltipContainer.style.borderRadius = '4px';
      tooltipContainer.style.backgroundColor = darkMode ? 'rgba(19, 23, 34, 0.7)' : 'rgba(255, 255, 255, 0.7)';
      tooltipContainer.style.color = darkMode ? '#D9D9D9' : '#191919';
      tooltipContainer.style.fontSize = '12px';
      tooltipContainer.style.pointerEvents = 'none';
      tooltipContainer.style.zIndex = '1000';

      // Add tooltip container to chart container
      chartContainerRef.current.appendChild(tooltipContainer);

      // Subscribe to crosshair move to update tooltip
      chart.subscribeCrosshairMove(param => {
        if (param.point === undefined || !param.time || param.point.x < 0 || param.point.y < 0) {
          tooltipContainer.style.display = 'none';
          return;
        }

        const price = param.seriesPrices.get(candlestickSeries) as { open: number; high: number; low: number; close: number } | undefined;
        const upperBand = param.seriesPrices.get(upperBandSeries) as number;
        const middleBand = param.seriesPrices.get(middleBandSeries) as number;
        const lowerBand = param.seriesPrices.get(lowerBandSeries) as number;

        if (price && !isNaN(upperBand) && !isNaN(middleBand) && !isNaN(lowerBand)) {
          tooltipContainer.style.display = 'block';
          tooltipContainer.style.left = `${param.point.x}px`;
          tooltipContainer.style.top = `${param.point.y - 50}px`;

          const dateStr = new Date(param.time * 1000).toLocaleDateString();
          
          // Calculate %B
          const percentB = (price.close - lowerBand) / (upperBand - lowerBand);
          
          // Calculate bandwidth
          const bandwidth = (upperBand - lowerBand) / middleBand;
          
          // Determine market condition based on Bollinger Bands
          let condition = '';
          if (price.close > upperBand) {
            condition = 'Potentially Overbought';
          } else if (price.close < lowerBand) {
            condition = 'Potentially Oversold';
          } else if (price.close > middleBand) {
            condition = 'Bullish';
          } else if (price.close < middleBand) {
            condition = 'Bearish';
          } else {
            condition = 'Neutral';
          }

          tooltipContainer.innerHTML = `
            <div>Date: ${dateStr}</div>
            <div>Price: ${price.close.toFixed(2)}</div>
            <div>Upper Band: ${upperBand.toFixed(2)}</div>
            <div>Middle Band: ${middleBand.toFixed(2)}</div>
            <div>Lower Band: ${lowerBand.toFixed(2)}</div>
            <div>%B: ${(percentB * 100).toFixed(2)}%</div>
            <div>Bandwidth: ${(bandwidth * 100).toFixed(2)}%</div>
            <div>Condition: ${condition}</div>
          `;
        } else {
          tooltipContainer.style.display = 'none';
        }
      });
    }

    // Fit content to view
    chart.timeScale().fitContent();

    // Add resize listener
    window.addEventListener('resize', handleResize);

    // Cleanup function
    return () => {
      window.removeEventListener('resize', handleResize);
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
      }
    };
  }, [data, width, height, darkMode, period, multiplier, showGrid, showTooltip]);

  return <div ref={chartContainerRef} className="bollinger-bands-chart w-full h-full" />;
};

export default BollingerBandsChart;