import { Dispatch, SetStateAction } from "react";
import { Metadata } from "../api/Metadata";

export default interface MetadataContextType {
  metadata: { [symbol: string]: string };
  setMetadata: Dispatch<SetStateAction<{ [symbol: string]: string }>>;
  getMetadata: (id: string) => Promise<Metadata | null>;
}