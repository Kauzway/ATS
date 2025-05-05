import React, { useEffect, useRef } from 'react';
import { createChart, IChartApi, LineData } from 'lightweight-charts';
import { StockData } from '../../types/stock';
import { calculateADX } from '../../utils/indicators';

interface ADXChartProps {
  data: StockData[];
  width?: number;
  height?: number;
  darkMode?: boolean;
  period?: number;
  showDI?: boolean;
  showGrid?: boolean;
  showTooltip?: boolean;
}

const ADXChart: React.FC<ADXChartProps> = ({
  data,
  width = 600,
  height = 200,
  darkMode = true,
  period = 14,
  showDI = true,
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

    // Calculate ADX values
    const adxData = calculateADX(data, period);

    // Add ADX line series
    const adxSeries = chart.addLineSeries({
      color: '#9C27B0', // Purple for ADX
      lineWidth: 2,
      priceLineVisible: false,
      title: 'ADX',
    });

    // Format data for ADX
    const adxLineData: LineData[] = adxData.adx
      .map((value, index) => ({
        time: data[index].time / 1000, // Convert milliseconds to seconds
        value: value,
      }))
      .filter(item => !isNaN(item.value)); // Filter out NaN values

    // Set data to ADX series
    adxSeries.setData(adxLineData);

    // Add DI+ and DI- lines if enabled
    if (showDI) {
      // Add DI+ line series
      const diPlusSeries = chart.addLineSeries({
        color: '#26A69A', // Green for DI+
        lineWidth: 1,
        priceLineVisible: false,
        title: '+DI',
      });

      // Add DI- line series
      const diMinusSeries = chart.addLineSeries({
        color: '#EF5350', // Red for DI-
        lineWidth: 1,
        priceLineVisible: false,
        title: '-DI',
      });

      // Format data for DI+ and DI-
      const diPlusLineData: LineData[] = adxData.diPlus
        .map((value, index) => ({
          time: data[index].time / 1000,
          value: value,
        }))
        .filter(item => !isNaN(item.value));

      const diMinusLineData: LineData[] = adxData.diMinus
        .map((value, index) => ({
          time: data[index].time / 1000,
          value: value,
        }))
        .filter(item => !isNaN(item.value));

      // Set data to DI+ and DI- series
      diPlusSeries.setData(diPlusLineData);
      diMinusSeries.setData(diMinusLineData);
    }

    // Add ADX threshold line at 25 (strong trend indicator)
    const thresholdLine = chart.addLineSeries({
      color: 'rgba(255, 255, 255, 0.5)',
      lineWidth: 1,
      lineStyle: 1, // Dashed line
      priceLineVisible: false,
      lastValueVisible: false,
    });

    // Set threshold line
    const timeRange = data.map(item => item.time / 1000);
    const startTime = Math.min(...timeRange);
    const endTime = Math.max(...timeRange);

    thresholdLine.setData([
      { time: startTime, value: 25 },
      { time: endTime, value: 25 },
    ]);

    // Add tooltip if enabled
    if (showTooltip) {
      // Add tooltip container
      const tooltipContainer = document.createElement('div');
      tooltipContainer.className = 'adx-tooltip';
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

        const adxValue = param.seriesPrices.get(adxSeries) as number;
        
        if (adxValue !== undefined) {
          tooltipContainer.style.display = 'block';
          tooltipContainer.style.left = `${param.point.x}px`;
          tooltipContainer.style.top = `${param.point.y - 50}px`;
          
          const dateStr = new Date(param.time * 1000).toLocaleDateString();
          
          // Determine trend strength based on ADX value
          let trendStrength = '';
          if (adxValue < 20) trendStrength = 'Weak/No Trend';
          else if (adxValue < 25) trendStrength = 'Weak Trend';
          else if (adxValue < 30) trendStrength = 'Moderate Trend';
          else if (adxValue < 50) trendStrength = 'Strong Trend';
          else trendStrength = 'Very Strong Trend';
          
          // Build tooltip HTML
          let tooltipHTML = `
            <div>Date: ${dateStr}</div>
            <div>ADX(${period}): ${adxValue.toFixed(2)}</div>
            <div>Strength: ${trendStrength}</div>
          `;
          
          // Add DI+ and DI- info if enabled
          if (showDI) {
            const diPlusValue = param.seriesPrices.get(diPlusSeries) as number;
            const diMinusValue = param.seriesPrices.get(diMinusSeries) as number;
            
            if (diPlusValue !== undefined && diMinusValue !== undefined) {
              const trendDirection = diPlusValue > diMinusValue ? 'Bullish' : 'Bearish';
              
              tooltipHTML += `
                <div>+DI: ${diPlusValue.toFixed(2)}</div>
                <div>-DI: ${diMinusValue.toFixed(2)}</div>
                <div>Direction: ${trendDirection}</div>
              `;
            }
          }
          
          tooltipContainer.innerHTML = tooltipHTML;
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
  }, [data, width, height, darkMode, period, showDI, showGrid, showTooltip]);

  return <div ref={chartContainerRef} className="adx-chart w-full h-full" />;
};

export default ADXChart;