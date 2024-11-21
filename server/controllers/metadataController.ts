import { Request, Response } from "express";
import dotenv from 'dotenv';

dotenv.config();

const getTokenMetadata = async (req: Request, res: Response): Promise<any> => {
  try {
    const tokenIds = req.query.id
    if (!tokenIds) {
      return res.status(400).json({ error: 'Token ID is required.' });
    }
    const metadataResponse = await fetch(`${process.env.CMC_METADATA_API_URL}?id=${tokenIds}`,
      {
        headers: {
          'X-CMC_PRO_API_KEY': process.env.CMC_API_KEY as string,
          'Content-Type': 'application/json',
        }
      }
    )
    const metadata = await metadataResponse.json();
    return res.status(200).json(metadata);
  } catch (error) {
    console.error("Error fetching metadata:", error);
  }
};

export default getTokenMetadata;