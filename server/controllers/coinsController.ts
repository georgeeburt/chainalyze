import { Request, Response } from 'express';
import axios from 'axios';

export const getCoins = async (req: Request, res: Response) => {
  try {
    const response = await axios.get('https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest', {
      headers: {
        'X-CMC_PRO_API_KEY': process.env.CMC_API_KEY as string,
        'Content-Type': 'application/json',
      }
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching latest coins from CoinMarketCap:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};