import { createContext, useState } from 'react';
import { Metadata } from '../../types/api/Metadata';
import MetadataContextType from '../../types/contexts/metadataContextType';

export const MetadataContext = createContext<MetadataContextType | undefined>(undefined);

export const MetadataProvider = ({ children }: { children: React.ReactNode }) => {
  // Initialize with the correct type
  const [metadata, setMetadata] = useState<{ [symbol: string]: string }>({});

  const getMetadata = async (id: string): Promise<Metadata | null> => {
    try {
      const response = await fetch(`http://localhost:3001/api/metadata?id=${id}`);
      const responseData = await response.json();
      const newMetadata = responseData?.data?.[id] || null;

      if (newMetadata) {
        // Update metadata state with just the string value needed
        setMetadata(prev => ({
          ...prev,
          [id]: newMetadata.symbol || ''
        }));
      }

      return newMetadata;
    } catch (error) {
      console.error('Error fetching metadata:', error);
      return null;
    }
  };

  return (
    <MetadataContext.Provider
      value={{
        metadata,
        setMetadata,
        getMetadata
      }}
    >
      {children}
    </MetadataContext.Provider>
  );
};