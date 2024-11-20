import { Request, Response } from "express";
import dotenv from 'dotenv';

dotenv.config();

const getTokenMetadata = async (req: Request, res: Response): Promise<any> => {
  try {
    const tokenIds = req.query.id
    const metadataResponse = await fetch(`${process.env.CMC_METADATA_API_URL}?id=${tokenIds}`,
      {
        headers: {
          'X-CMC_PRO_API_KEY': process.env.CMC_API_KEY as string,
          'Content-Type': 'application/json',
        }
      }
    )
    const metadata = await metadataResponse.json();
    return res.json(metadata);
  } catch (error) {
    console.error("Error fetching metadata:", error);
  }
};

export default getTokenMetadata;