import React, { useEffect, useRef } from 'react';
import { createChart, IChartApi, LineData } from 'lightweight-charts';
import { StockData } from '../../types/stock';
import { calculateRSI, findRSIDivergence } from '../../utils/indicators';

interface RSIChartProps {
  data: StockData[];
  width?: number;
  height?: number;
  darkMode?: boolean;
  period?: number;
  showDivergence?: boolean;
  showGrid?: boolean;
  showTooltip?: boolean;
}

const RSIChart: React.FC<RSIChartProps> = ({
  data,
  width = 600,
  height = 200,
  darkMode = true,
  period = 14,
  showDivergence = true,
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

    // Calculate RSI values
    const rsiValues = calculateRSI(data, period);

    // Add RSI line series
    const rsiSeries = chart.addLineSeries({
      color: '#2962FF',
      lineWidth: 2,
      priceLineVisible: false,
    });

    // Format data for RSI
    const rsiData: LineData[] = rsiValues
      .map((value, index) => ({
        time: data[index].time / 1000, // Convert milliseconds to seconds
        value: value,
      }))
      .filter(item => !isNaN(item.value)); // Filter out NaN values

    // Set data to RSI series
    rsiSeries.setData(rsiData);

    // Add overbought/oversold levels
    const overboughtLine = chart.addLineSeries({
      color: 'rgba(255, 0, 0, 0.5)',
      lineWidth: 1,
      lineStyle: 1, // Dashed line
      priceLineVisible: false,
      lastValueVisible: false,
    });

    const oversoldLine = chart.addLineSeries({
      color: 'rgba(0, 255, 0, 0.5)',
      lineWidth: 1,
      lineStyle: 1, // Dashed line
      priceLineVisible: false,
      lastValueVisible: false,
    });

    const middleLine = chart.addLineSeries({
      color: 'rgba(200, 200, 200, 0.5)',
      lineWidth: 1,
      lineStyle: 1, // Dashed line
      priceLineVisible: false,
      lastValueVisible: false,
    });

    // Set horizontal lines for overbought (70), oversold (30), and middle (50) levels
    const timeRange = data.map(item => item.time / 1000);
    const startTime = Math.min(...timeRange);
    const endTime = Math.max(...timeRange);

    overboughtLine.setData([
      { time: startTime, value: 70 },
      { time: endTime, value: 70 },
    ]);

    oversoldLine.setData([
      { time: startTime, value: 30 },
      { time: endTime, value: 30 },
    ]);

    middleLine.setData([
      { time: startTime, value: 50 },
      { time: endTime, value: 50 },
    ]);

    // Add RSI divergence markers if enabled
    if (showDivergence) {
      const divergences = findRSIDivergence(data, rsiValues);

      // Add bullish divergence markers
      const bullishMarkers = divergences.bullish.map(div => ({
        time: div.time / 1000,
        position: 'belowBar' as const,
        color: '#26A69A',
        shape: 'arrowUp' as const,
        text: 'Bull Div',
      }));

      // Add bearish divergence markers
      const bearishMarkers = divergences.bearish.map(div => ({
        time: div.time / 1000,
        position: 'aboveBar' as const,
        color: '#EF5350',
        shape: 'arrowDown' as const,
        text: 'Bear Div',
      }));

      // Set markers
      rsiSeries.setMarkers([...bullishMarkers, ...bearishMarkers]);
    }

    // Add tooltip if enabled
    if (showTooltip) {
      // Add tooltip container
      const tooltipContainer = document.createElement('div');
      tooltipContainer.className = 'rsi-tooltip';
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

        const rsiValue = param.seriesPrices.get(rsiSeries) as number;
        
        if (rsiValue !== undefined) {
          tooltipContainer.style.display = 'block';
          tooltipContainer.style.left = `${param.point.x}px`;
          tooltipContainer.style.top = `${param.point.y - 50}px`;
          
          const dateStr = new Date(param.time * 1000).toLocaleDateString();
          
          // Determine RSI status
          let rsiStatus = '';
          if (rsiValue > 70) rsiStatus = 'Overbought';
          else if (rsiValue < 30) rsiStatus = 'Oversold';
          else if (rsiValue > 50) rsiStatus = 'Bullish';
          else if (rsiValue < 50) rsiStatus = 'Bearish';
          else rsiStatus = 'Neutral';
          
          tooltipContainer.innerHTML = `
            <div>Date: ${dateStr}</div>
            <div>RSI(${period}): ${rsiValue.toFixed(2)}</div>
            <div>Status: ${rsiStatus}</div>
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
  }, [data, width, height, darkMode, period, showDivergence, showGrid, showTooltip]);

  return <div ref={chartContainerRef} className="rsi-chart w-full h-full" />;
};

export default RSIChart;