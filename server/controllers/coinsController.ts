import { Request, Response } from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

export const getCoins = async (req: Request, res: Response): Promise<any> => {
  try {
    const baseUrl = process.env.CMC_API_TOKENS_URL;
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
    return res.status(500).json({ error: 'Internal server error' });
  }
};