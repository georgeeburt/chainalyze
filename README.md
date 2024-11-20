<div align="center">
  <h1> Chainalyze </h1>
  <img src="./assets/images/chainalyze-icon.png" width="150" alt="chainalyze logo">
  <h2>Cryptocurrency Data and Analysis Aggregator</h2>
  Unlock powerful insights into crypto data and trends, while tracking your holdings with an intuitive portfolio manager.
</div>

## Prerequisites

- [Node.js (v18.0.0 or higher)](https://nodejs.org/en/download/)
- [npm (v9.0.0 or higher)](https://nodejs.org/en/download/)
- [MongoDB (v6.0 or higher)](https://www.mongodb.com/try/download/community)

## Installation
### 1. Clone the Repository
```bash
git clone https://github.com/georgeeburt/chainalyze.git
cd chainalyze
```

### 2. Server and Client setup

In the project root directory, run the following command:
```bash
npm run install:all
```

## Usage
In the project root directory, run the following command:
```bash
npm run start:all
```

## Environment Variables

### Frontend

| Variable                      | Description                                 | Example                                    |
|-------------------------------|---------------------------------------------|--------------------------------------------|
| `VITE_BACKEND_URL`            | Backend server URL.                         | `http://localhost:3001`                    |
| `VITE_BACKEND_PORTFOLIO_URL`  | Backend API portfolio endpoint.             | `http://localhost:3001/portfolio`          |
| `VITE_BINANCE_WSS_URL`        | Binance WebSocket API endpoint.             | `88g72h2-v402-92x3-n92z-73484oc83k`        |
| `VITE_BINANCE_KLINE_URL`      | Binance API Kline data endpoint.            | `https://api.binance.com/api/v3/klines`    |

### Backend

| Variable                | Description                                 | Example                                                     |
|-------------------------|---------------------------------------------|-------------------------------------------------------------|
| `PORT`                  | Port to listen to when running the backend. | `3001`                                                      |
| `CLIENT_ENDPOINT`       | Endpoint where the client is running.       | `http://localhost:5173`                                     |
| `MONGO_URI`             | Your MongoDB URI connection string.         | `mongodb://localhost:27017/chainalyze`                      |
| `CMC_API_TOKENS_URL`    | CoinMarketCap tokens API endpoint.          | `https://pro-api.coinmarketcap.com/v1/cryptocurrency/`      |
| `CMC_METADATA_API_URL`  | CoinMarketCap metadata API endpoint.        | `https://pro-api.coinmarketcap.com/v2/cryptocurrency/info`  |
| `CMC_API_KEY`           | Your CoinMarketCap API key.                 | `88g72h2-v402-92x3-n92z-73484oc83k`                         |

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE.md) file for details.