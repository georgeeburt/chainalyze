import { AreaData } from "lightweight-charts";
import { ChartData } from "../sockets/ChartData";

export default interface ChartProps {
  historicalData: AreaData[];
  socketData: ChartData[];
}