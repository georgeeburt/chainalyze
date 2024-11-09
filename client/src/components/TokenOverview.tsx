import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Metadata from "../types/api/Metadata";
import websiteButton from '../assets/website.svg';
import whitePaperButton from '../assets/whitepaper.svg';

const TokenOverview = () => {
  const { id } = useParams();
  const [tokenMetadata, setTokenMetadata] = useState<Metadata | null>(null);

  useEffect(() => {
    const fetchTokenData = async () => {
      if (!id) return;

      // Fetch appropriate token metadata
      const response = await fetch (`http://localhost:3001/api/metadata?id=${id}`);
      const responseData = await response.json();
      const metadata = responseData?.data?.[id];
      setTokenMetadata(metadata);
    };
    fetchTokenData();
  }, [id]);

  return (
    <div className="flex flex-col text-3xl font-semibold px-[15%] py-[2%] h-full">
      <div className="flex flex-col bg-lightnav dark:bg-darklabel py-[3%] px-[2%]">
        <div className="flex items-center gap-3">
          <img src={tokenMetadata?.logo} alt={`${tokenMetadata?.name} logo`} className="w-12" />
          <h1 className="">{tokenMetadata?.name} <span className="font-thin">{tokenMetadata?.symbol}</span></h1>
        </div>
        <a href={tokenMetadata?.urls?.website[0]} target="_blank">
          <img src={websiteButton} alt={`${tokenMetadata?.name} website`} />
        </a>
        <a href={tokenMetadata?.urls?.technical_doc[0]} target="_blank">
          <img src={whitePaperButton} alt={`${tokenMetadata?.name} whitepaper`} />
        </a>
      </div>
    </div>
  );
};

export default TokenOverview;