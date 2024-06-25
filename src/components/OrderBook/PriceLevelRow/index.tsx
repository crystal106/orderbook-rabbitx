import classNames from "classnames";
import { OrderType } from "../../../types";
import { Container } from "./styles";

interface PriceLevelRowProps {
  orderType: OrderType;
  price: string;
  amount: string;
  total: string;
}

function PriceLevelRow(props: PriceLevelRowProps) {
  const { orderType, price, amount, total } = props;

  return (
    <Container>
      <span
        className={classNames({
          "bid-price": orderType === OrderType.BIDS,
          "ask-price": orderType === OrderType.ASKS,
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
