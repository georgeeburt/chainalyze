import request from "supertest";
import app from "../server/index.js";
import connectDB from "../server/db.js";

describe('Token API', () => {
  describe('GET /api/tokens', () => {
    it('should return a list of tokens when no symbol is provided', async () => {
      const response = await request(app)
        .get('/api/tokens')
        .expect(200)
        .expect('Content-Type', /json/);

        expect(response.body.data).toBeDefined();
        expect(Array.isArray(response.body.data)).toBe(true);

        if (response.body.data.length > 0) {
          const token = response.body.data[0];
          expect(token).toHaveProperty('id');
          expect(token).toHaveProperty('name');
          expect(token).toHaveProperty('symbol');
          expect(token).toHaveProperty('quote.USD.price');
        }
    });

    it('should return specific token when symbol is provided', async () => {
      const symbol = 'BTC';
      const response = await request(app)
        .get(`/api/tokens?symbol=${symbol}`)
        .expect(200)
        .expect('Content-Type', /json/);

      expect(response.body.data).toBeDefined();

      const token = response.body.data[symbol];
      expect(token).toBeDefined();

      expect(token).toMatchObject({
        name: 'Bitcoin',
        symbol: 'BTC',
        slug: 'bitcoin',
        id: 1
      });
    });
  });
});