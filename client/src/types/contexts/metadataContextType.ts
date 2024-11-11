export default interface MetadataContextType {
  metadata: { [symbol: string]: string };
  setMetadata: React.Dispatch<React.SetStateAction<{ [symbol: string]: string }>>;
  fetchMetadata: (symbols: string | string[]) => void;
}