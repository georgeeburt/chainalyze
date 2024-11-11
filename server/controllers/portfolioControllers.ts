import Portfolio from "../models/portfolio";
import { Request, Response } from "express";

// Get Portfolio
export const getPortfolio = async (req: Request, res: Response): Promise<any> => {
  try {
    const portfolio = await Portfolio.findOne({});
    if (!portfolio) {
      return res.status(404).json({ error: 'Portfolio not found.' });
    }
    return res.status(200).json({ portfolio });
  } catch (error) {
    console.error('Error retrieving Portfolio:', error);
    return res.status(500).json({ error: 'Internal server error.' })
  }
};

// Add a token to Portfolio
export const addToken = async (req: Request, res: Response): Promise<any> => {
  try {
    const { token, quantity } = req.body;

    if (!token || !quantity ) {
      return res.status(400).json({ error: 'Token and quantity are required.' });
    }

    const portfolio = await Portfolio.findOneAndUpdate(
      {},
      {
        $push: {
          holdings: { token, quantity },
        },
      },
      { new: true, upsert: true }
    );

    return res.status(201).json({ message: 'Token added to portfolio:', portfolio })
  } catch (error) {
    console.error('Error adding token to Portfolio:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

// Update a token's quanity in Portfolio
export const updateToken = async (req: Request, res: Response): Promise<any> => {
  const { token, quantity } = req.body;
  if (!token || !quantity) {
    return res.status(400).json({ error: 'Token and quantity are required.' });
  }
  try {
    const portfolio = await Portfolio.findOne({});
    if (!portfolio) {
      return res.status(404).json({ error: 'Portfolio not found.' })
    }
    const tokenIndex = portfolio.holdings.findIndex(
      (item) => item.token === token
    );

    if (tokenIndex === -1) {
      return res.status(404).json({ error: 'Token not found in Portfolio.' })
    }

    portfolio.holdings[tokenIndex].quantity = quantity;
  } catch (error) {
    console.error('Error updating token quantity in Portfolio:', error);
    return res.status(500).json({ error: 'Interal server error.' });
  }
};

// Remove a token from Portfolio
export const removeToken = async (req: Request, res: Response): Promise<any> => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ error: 'Token is required.' });
  }
  try {
    const portfolio = await Portfolio.findOne({});
    if (!portfolio) {
      return res.status(404).json({ error: 'Portfolio not found.' });
    }

    const tokenIndex = portfolio.holdings.findIndex(
      (item) => item.token === token
    );

    if (tokenIndex === -1) {
      return res.status(404).json({ error: 'Token not found in Portfolio.' });
    }

    portfolio.holdings.splice(tokenIndex, 1);
    await portfolio.save();

    return res.status(200).json({ message: 'Token successfully deleted from Portfolio.' })
  } catch (error) {
   console.error('Error removing token from Portfolio:', error);
   return res.status(500).json({ error: 'Internal server error.' });
  }
};