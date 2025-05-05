import React, { useEffect, useRef } from 'react';
import { createChart, IChartApi, CandlestickData } from 'lightweight-charts';
import { StockData } from '../../types/stock';

interface CandlestickChartProps {
  data: StockData[];
  width?: number;
  height?: number;
  darkMode?: boolean;
  showVolume?: boolean;
  showGrid?: boolean;
  showTooltip?: boolean;
  showLegend?: boolean;
}

const CandlestickChart: React.FC<CandlestickChartProps> = ({
  data,
  width = 600,
  height = 400,
  darkMode = true,
  showVolume = true,
  showGrid = true,
  showTooltip = true,
  showLegend = true,
}) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

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
        vertLine: {
          color: darkMode ? '#758696' : '#758696',
          width: 1,
          style: 1,
          visible: true,
          labelVisible: true,
        },
        horzLine: {
          color: darkMode ? '#758696' : '#758696',
          width: 1,
          style: 1,
          visible: true,
          labelVisible: true,
        },
      },
      handleScroll: {
        mouseWheel: true,
        pressedMouseMove: true,
        horzTouchDrag: true,
        vertTouchDrag: true,
      },
      handleScale: {
        axisPressedMouseMove: true,
        mouseWheel: true,
        pinch: true,
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

    // Add volume histogram if enabled
    if (showVolume) {
      const volumeSeries = chart.addHistogramSeries({
        color: '#26a69a',
        priceFormat: {
          type: 'volume',
        },
        priceScaleId: '',
        scaleMargins: {
          top: 0.8,
          bottom: 0,
        },
      });

      // Format data for volume histogram
      const volumeData = data.map(item => ({
        time: item.time / 1000, // Convert milliseconds to seconds
        value: item.volume,
        color: item.close >= item.open ? '#26a69a' : '#ef5350',
      }));

      volumeSeries.setData(volumeData);
    }

    // Fit content to view
    chart.timeScale().fitContent();

    // Add legend if enabled
    if (showLegend) {
      const legendContainer = document.createElement('div');
      legendContainer.className = 'chart-legend';
      legendContainer.style.position = 'absolute';
      legendContainer.style.left = '12px';
      legendContainer.style.top = '12px';
      legendContainer.style.zIndex = '1';
      legendContainer.style.fontSize = '12px';
      legendContainer.style.padding = '8px';
      legendContainer.style.background = darkMode ? 'rgba(19, 23, 34, 0.7)' : 'rgba(255, 255, 255, 0.7)';
      legendContainer.style.color = darkMode ? '#D9D9D9' : '#191919';
      legendContainer.style.borderRadius = '4px';
      legendContainer.style.display = 'none'; // Hide initially

      // Add legend container to chart container
      chartContainerRef.current.appendChild(legendContainer);

      // Subscribe to crosshair move to update legend
      chart.subscribeCrosshairMove(param => {
        if (param.time && param.point && param.seriesPrices.get(candlestickSeries)) {
          const data = param.seriesPrices.get(candlestickSeries) as any;
          if (data) {
            legendContainer.style.display = 'block';
            const formattedDate = new Date(param.time * 1000).toLocaleDateString();
            legendContainer.innerHTML = `
              <div>Date: ${formattedDate}</div>
              <div>O: ${data.open?.toFixed(2)}</div>
              <div>H: ${data.high?.toFixed(2)}</div>
              <div>L: ${data.low?.toFixed(2)}</div>
              <div>C: ${data.close?.toFixed(2)}</div>
              ${showVolume ? `<div>Vol: ${Number(param.seriesPrices.get(volumeSeries)).toLocaleString()}</div>` : ''}
            `;
          }
        } else {
          legendContainer.style.display = 'none';
        }
      });
    }

    // Add tooltip if enabled
    if (showTooltip) {
      // Implementation depends on specific tooltip requirements
      // This could be either custom HTML elements or using chart's built-in tooltip API
    }

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
  }, [data, width, height, darkMode, showVolume, showGrid, showTooltip, showLegend]);

  return <div ref={chartContainerRef} className="candlestick-chart w-full h-full" />;
};

export default CandlestickChart;