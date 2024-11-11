import React, { createContext, useState } from 'react';
import MetadataContextType from '../../types/contexts/metadataContextType';
import MetadataProviderProps from '../../types/contexts/props/MetadataProviderProps';

export const MetadataContext = createContext<MetadataContextType | undefined>(undefined);

export const MetadataProvider: React.FC<MetadataProviderProps> = ({ children }) => {
  const [metadata, setMetadata] = useState<{ [symbol: string]: string }>({});

  const fetchMetadata = async (symbols: string | string[]) => {
    try {
      const symbolsArray = Array.isArray(symbols) ? symbols : [symbols];
      const response = await fetch(`your-metadata-endpoint?symbols=${symbolsArray.join(',')}`);
      const data = await response.json();

      setMetadata((prevMetadata) => {
        const newMetadata = symbolsArray.reduce((acc, symbol) => {
          if (data[symbol]) {
            acc[symbol] = data[symbol];
          }
          return acc;
        }, {} as { [symbol: string]: string });

        return { ...prevMetadata, ...newMetadata };
      });
    } catch (error) {
      console.error('Error fetching metadata:', error);
    }
  };

  return (
    <MetadataContext.Provider value={{ metadata, setMetadata, fetchMetadata }}>
      {children}
    </MetadataContext.Provider>
  );
};