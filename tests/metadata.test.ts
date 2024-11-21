import axios from 'axios';
import { jest } from '@jest/globals';
import request from 'supertest';
import app from '../server/index.js';

describe('Metadata API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/metadata', () => {
    it('should return metadata for multiple token IDs', async () => {
      const response = await request(app)
        .get('/api/metadata?id=1,1027,5426')
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body.data).toBeDefined();
      expect(response.body.data['1']).toMatchObject({
        id: 1,
        name: 'Bitcoin',
        symbol: 'BTC',
        slug: 'bitcoin',
        logo: expect.any(String),
        urls: {
          website: expect.arrayContaining(['https://bitcoin.org/']),
          technical_doc: expect.arrayContaining([
            'https://bitcoin.org/bitcoin.pdf'
          ]),
          source_code: expect.arrayContaining([
            'https://github.com/bitcoin/bitcoin'
          ])
        }
      });

      expect(response.body.data['1027']).toMatchObject({
        id: 1027,
        name: 'Ethereum',
        symbol: 'ETH',
        slug: 'ethereum',
        logo: expect.any(String),
        urls: {
          website: expect.arrayContaining(['https://www.ethereum.org/']),
          technical_doc: expect.arrayContaining([
            'https://github.com/ethereum/wiki/wiki/White-Paper'
          ])
        }
      });

      expect(response.body.data['5426']).toMatchObject({
        id: 5426,
        name: 'Solana',
        symbol: 'SOL',
        slug: 'solana',
        logo: expect.any(String),
        urls: {
          website: expect.arrayContaining(['https://solana.com']),
          technical_doc: expect.arrayContaining([
            'https://solana.com/solana-whitepaper.pdf'
          ])
        }
      });
    });

    it('should handle requests where no token id is given gracefully', async () => {
      const response = await request(app)
        .get('/api/metadata')
        .expect(400)
        .expect('Content-Type', /json/);

      expect(response.body).toEqual({ error: 'Token ID is required.' });
    });
  });
});
