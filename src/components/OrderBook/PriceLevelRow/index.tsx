import classNames from "classnames";
import { OrderType } from "../../../types";
import { Container } from "./styles";

interface PriceLevelRowProps {
  orderType: OrderType;
  price: string;
  amount: string;
  total: string;
  marked: boolean;
}

function PriceLevelRow(props: PriceLevelRowProps) {
  const { orderType, price, amount, total, marked } = props;

  return (
    <Container>
      <span
        className={classNames({
          "bid-price": orderType === OrderType.BIDS,
          "ask-price": orderType === OrderType.ASKS,
          marked,
        })}
      >
        {price}
      </span>
      <span>{amount}</span>
      <span>{total}</span>
    </Container>
  );
}

export default PriceLevelRow;
