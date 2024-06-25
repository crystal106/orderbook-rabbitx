import { DepthVisualizerColors } from "../../constants";
import { OrderType } from "../../types";

interface DepthVisualizerProps {
  depth: number;
  orderType: OrderType;
}

function DepthVisualizer(props: DepthVisualizerProps) {
  const { depth, orderType } = props;

  return (
    <div
      style={{
        backgroundColor: `${
          orderType === OrderType.BIDS
            ? DepthVisualizerColors.BIDS
            : DepthVisualizerColors.ASKS
        }`,
        height: "1.250em",
        width: `${depth / 3}%`,
        position: "relative",
        top: 21,
        left: "67%",
        marginTop: -24,
        zIndex: 1,
      }}
    />
  );
}

export default DepthVisualizer;
