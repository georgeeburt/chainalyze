import { createContext, useState, useCallback } from 'react';
import { Metadata } from '../types/api/Metadata';
import MetadataContextType from '../types/contexts/metadataContextType';

interface MetadataResponseItem {
  logo: string;
  name: string;
  symbol: string;
  urls: {
    website: string[];
    technical_doc: string[];
  };
}

interface MetadataResponse {
  data: {
    [key: string]: MetadataResponseItem;
  };
}

export const MetadataContext = createContext<MetadataContextType | undefined>(undefined);

export const MetadataProvider = ({ children }: { children: React.ReactNode }) => {
  const [metadata, setMetadata] = useState<{ [symbol: string]: string }>({});

  const getMetadata = useCallback(async (id: string): Promise<Metadata | null> => {
    try {
      const response = await fetch(`http://localhost:3001/api/metadata?id=${id}`);
      const responseData: MetadataResponse = await response.json();
      const newMetadata = responseData?.data?.[id] || null;

      if (newMetadata) {
        // Update metadata state with just the string value needed
        setMetadata(prev => ({
          ...prev,
          [id]: newMetadata.symbol || ''
        }));

        return {
          id: parseInt(id),
          logo: newMetadata.logo,
          name: newMetadata.name,
          symbol: newMetadata.symbol,
          urls: newMetadata.urls
        };
      }

      return null;
    } catch (error) {
      console.error('Error fetching metadata:', error);
      return null;
    }
  }, []);

  const getBatchMetadata = useCallback(async (ids: string): Promise<{ [key: string]: Metadata }> => {
    try {
      const response = await fetch(`http://localhost:3001/api/metadata?id=${ids}`);
      const responseData: MetadataResponse = await response.json();

      const batchedMetadata: { [key: string]: Metadata } = {};

      Object.entries(responseData.data).forEach(([id, data]) => {
        batchedMetadata[id] = {
          id: parseInt(id),
          logo: data.logo,
          name: data.name,
          symbol: data.symbol,
          urls: data.urls
        };

        // Update metadata state
        setMetadata(prev => ({
          ...prev,
          [id]: data.symbol || ''
        }));
      });

      return batchedMetadata;
    } catch (error) {
      console.error('Error fetching batch metadata:', error);
      return {};
    }
  }, []);

  const value = {
    metadata,
    setMetadata,
    getMetadata,
    getBatchMetadata
  };

  return (
    <MetadataContext.Provider value={value}>
      {children}
    </MetadataContext.Provider>
  );
};