import { Request, Response } from "express";


const getTokenMetadata = async (req: Request, res: Response): Promise<any> => {
  try {
    const tokenIds = req.query.id
    const metadataResponse = await fetch(`https://pro-api.coinmarketcap.com/v2/cryptocurrency/info?id=${tokenIds}`,
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