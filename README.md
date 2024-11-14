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

|Variable      | Description                                 | Example                                |
|--------------|---------------------------------------------|----------------------------------------|
|`PORT`        | Port to listen to when running the backend. | `3001`                                 |
|`MONGO_URI`   | Your MongoDB URI connection string.         | `mongodb://localhost:27017/chainalyze` |
|`CMC_API_KEY` | Your CoinMarketCap API key.                 | `88g72h2-v402-92x3-n92z-73484oc83k`    |