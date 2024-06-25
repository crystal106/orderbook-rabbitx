import { Container } from "./styles";
import { formatPrice } from "../../helper";

interface SpreadProps {
  bids: number[][];
  asks: number[][];
}

function Spread({ bids, asks }: SpreadProps) {
  const getHighestBid = (bids: number[][]): number => {
    const prices: number[] = bids.map((bid) => bid[0]);
    return Math.max.apply(Math, prices);
  };

  const getLowestAsk = (asks: number[][]): number => {
    const prices: number[] = asks.map((ask) => ask[0]);
    return Math.min.apply(Math, prices);
  };

  const getSpreadAmount = (bids: number[][], asks: number[][]): number =>
    Math.abs(getHighestBid(bids) - getLowestAsk(asks));

  const getSpreadPercentage = (spread: number, highestBid: number): string =>
    `(${((spread * 100) / highestBid).toFixed(2)}%)`;

  return (
    <Container>
      <span className="price">
        {formatPrice((getLowestAsk(asks) + getHighestBid(bids)) / 2)}
      </span>
      <span className="spread">
        {getSpreadPercentage(getSpreadAmount(bids, asks), getHighestBid(bids))}%
      </span>
    </Container>
  );
}

export default Spread;
