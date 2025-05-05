# ATS - Advanced Trading Systems

A comprehensive fintech application for analyzing Nifty indices stocks with advanced technical indicators and machine learning predictions.

<img src="public/assets/images/ATS Logo_white_no_bg.png" alt="ATS Logo" width="200"/>

## Features

- **Comprehensive Analysis**: Analyze all major Nifty indices (NIFTY 50, NIFTY NEXT 50, etc.)
- **Technical Indicators**: Advanced technical analysis with RSI, ADX, MACD, and divergence patterns
- **Machine Learning Predictions**: AI-powered price predictions and trend analysis
- **Pattern Recognition**: Identify chart patterns and potential breakouts
- **F&O Analysis**: Futures and Options data for trading opportunities
- **Risk Management**: Position sizing based on account risk and multiple targets
- **Dark Mode UI**: TradingView-inspired interface for comfortable analysis
- **Responsive Design**: Works on both desktop and mobile devices

## Tech Stack

- **Frontend**: React with TypeScript
- **State Management**: Redux Toolkit & RTK Query
- **Styling**: Tailwind CSS with dark mode
- **Charts**: Lightweight Charts (TradingView)
- **API**: Custom API integration with NSE data
- **Machine Learning**: TensorFlow.js for client-side predictions
- **Deployment**: Google Cloud Run ready

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Kauzway/ATS.git
   cd ATS
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open your browser and visit:
   ```
   http://localhost:3000
   ```

## Project Structure

```
ats-advanced-trading-systems/
├── src/
│   ├── components/        # Reusable UI components
│   ├── pages/             # Application pages
│   ├── store/             # Redux store configuration
│   ├── services/          # API and data services
│   ├── utils/             # Utility functions
│   ├── hooks/             # Custom React hooks
│   ├── types/             # TypeScript type definitions
│   └── ...
└── ...
```

## Usage

1. **Dashboard**: View market overview, sector performance, and top performing stocks
2. **Stock Analysis**: Detailed technical analysis with indicators and ML predictions
3. **Sector Analysis**: Compare performance across sectors
4. **F&O Trading**: Analyze futures and options data
5. **Screener**: Find trading opportunities based on custom criteria

## Deployment

The application is designed to be deployed on Google Cloud Run. Follow these steps:

1. Build the Docker image:
   ```bash
   docker build -t ats-trading .
   ```

2. Deploy to Google Cloud Run:
   ```bash
   gcloud run deploy ats-trading --image ats-trading --platform managed
   ```

## API Keys Required for Deployment

Before deploying, you'll need to obtain and configure the following API keys:

1. **Stock Market Data API**: For real-time and historical stock data
   - Configure in `.env.production` under `VITE_API_KEY` and `VITE_API_BASE_URL`
   - Options include NSE India API, Alpha Vantage, or Yahoo Finance

2. **Firebase** (if using authentication):
   - Create a Firebase project and get configuration keys
   - Configure in `.env.production` by uncommenting and filling in Firebase variables

3. **Google Analytics** (optional):
   - For tracking app usage with your Google Analytics ID
   - Configure in `.env.production` under `VITE_GOOGLE_ANALYTICS_ID`

4. **TensorFlow.js Model Hosting**:
   - Host your trained ML model on a service like Google Cloud Storage
   - Configure in `.env.production` under `VITE_TFJS_MODEL_URL`

## Disclaimer

This application is for educational and informational purposes only. The technical analysis and machine learning predictions should not be considered as financial advice. Always do your own research and consult with a financial advisor before making investment decisions.

## License

[MIT](LICENSE)

## Acknowledgements

- NSE India for market data
- TradingView for chart library inspiration
- [React](https://reactjs.org/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lightweight Charts](https://github.com/tradingview/lightweight-charts)