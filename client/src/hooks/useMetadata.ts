import { useContext } from 'react';
import { MetadataContext } from '../components/contexts/MetadataContext';

const useMetadata = () => {
  const context = useContext(MetadataContext);

  if (!context) {
    throw new Error('useMetadata must be used within a MetadataProvider');
  }

  return context;
};

export default useMetadata;