import express from "express";
import { getCoins } from "./controllers/coinsController";
import getTokenMetadata from "./controllers/metadataController";

const router = express.Router();

// Proxy endpoints api requests
router.get('/api/tokens', getCoins);
router.get('/api/metadata', getTokenMetadata);

export default router;