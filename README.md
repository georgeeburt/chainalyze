<div align="center">
  <h1> Chainalyze </h1>
  <img src="./assets/images/chainalyze-icon.png" width="150" alt="chainalyze logo">
  <h2>Cryptocurrency Data and Analysis Aggregator</h2>
  Unlock powerful insights into crypto data and trends, while tracking your holdings with an intuitive portfolio manager.

![License: MIT](https://img.shields.io/badge/License-MIT-blueviolet.svg)

[![Node.js](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Express](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)](https://expressjs.com/)
[![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)](https://reactjs.org/)
[![Context API](https://img.shields.io/badge/contextapi-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)](https://reactjs.org/docs/context.html)
[![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
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

| Variable                     | Description                      | Example                                 |
| ---------------------------- | -------------------------------- | --------------------------------------- |
| `VITE_BACKEND_URL`           | Backend server URL.              | `http://localhost:3001`                 |
| `VITE_BACKEND_PORTFOLIO_URL` | Backend API portfolio endpoint.  | `http://localhost:3001/portfolio`       |
| `VITE_BINANCE_WSS_URL`       | Binance WebSocket API endpoint.  | `88g72h2-v402-92x3-n92z-73484oc83k`     |
| `VITE_BINANCE_KLINE_URL`     | Binance API Kline data endpoint. | `https://api.binance.com/api/v3/klines` |

### Backend

| Variable               | Description                                 | Example                                                    |
| ---------------------- | ------------------------------------------- | ---------------------------------------------------------- |
| `PORT`                 | Port to listen to when running the backend. | `3001`                                                     |
| `CLIENT_ENDPOINT`      | Endpoint where the client is running.       | `http://localhost:5173`                                    |
| `MONGO_URI`            | Your MongoDB URI connection string.         | `mongodb://localhost:27017/chainalyze`                     |
| `CMC_API_TOKENS_URL`   | CoinMarketCap tokens API endpoint.          | `https://pro-api.coinmarketcap.com/v1/cryptocurrency/`     |
| `CMC_METADATA_API_URL` | CoinMarketCap metadata API endpoint.        | `https://pro-api.coinmarketcap.com/v2/cryptocurrency/info` |
| `CMC_API_KEY`          | Your CoinMarketCap API key.                 | `88g72h2-v402-92x3-n92z-73484oc83k`                        |

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE.md) file for details.
