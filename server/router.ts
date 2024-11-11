import express from 'express';
import { getCoins } from './controllers/coinsController';
import {
  getPortfolio,
  addToken,
  updateToken,
  removeToken
} from './controllers/portfolioControllers';
import getTokenMetadata from './controllers/metadataController';

const router = express.Router();

// Proxy endpoints for api requests
router.get('/api/tokens', getCoins);
router.get('/api/metadata', getTokenMetadata);

// Portfolio endpoints
router.get('/portfolio', getPortfolio);
router.post('/portfolio', addToken);
router.put('/portfolio', updateToken);
router.delete('/portfolio', removeToken);

export default router;
