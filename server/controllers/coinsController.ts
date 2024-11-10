import { Request, Response } from 'express';
import axios from 'axios';

export const getCoins = async (req: Request, res: Response) => {
  try {
    const baseUrl = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/';
    let { symbol } = req.query;

    // Handle if symbol is an array
    if (Array.isArray(symbol)) {
      symbol = symbol[0];
    }

    // Check if symbol exists, if not this is a request from Discover
    if (!symbol || typeof symbol !== 'string') {
      const response = await axios.get(`${baseUrl}listings/latest`, {
        headers: {
          'X-CMC_PRO_API_KEY': process.env.CMC_API_KEY as string,
          'Content-Type': 'application/json',
        }
      });
      return res.status(200).json(response.data);
    } else {
      const response = await axios.get(`${baseUrl}quotes/latest?symbol=${symbol.toUpperCase()}&convert=USD`, {
        headers: {
          'X-CMC_PRO_API_KEY': process.env.CMC_API_KEY as string,
          'Content-Type': 'application/json',
        }
      });
      return res.status(200).json(response.data);
    }

  } catch (error) {
    console.error('Error fetching data from CoinMarketCap:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};