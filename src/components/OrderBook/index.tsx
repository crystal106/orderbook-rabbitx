import { useEffect } from "react";
import { PublicationContext, SubscribedContext } from "centrifuge";
import DepthVisualizer from "../DepthVisualizer";
import PriceLevelRow from "./PriceLevelRow";
import TitleRow from "./TitleRow";
import Loader from "../Loader";
import Spread from "../Spread";
import { useCentrifuge } from "../../hooks/centrifuge";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import {
  addAsks,
  addBids,
  addExistingState,
  selectAsks,
  selectBids,
} from "../../slices/orderbook";
import { conversion, formatNumber, formatPrice } from "../../helper";
import { CHANNEL, DISPLAY_LEVELS, WSS_ORDER_URL } from "../../constants";
import { OrderType } from "../../types";
import { Container, TableContainer, TitleSpan } from "./styles";
import { PriceLevelRowContainer } from "./PriceLevelRow/styles";

function OrderBook() {
  const bids: number[][] = useAppSelector(selectBids);
  const asks: number[][] = useAppSelector(selectAsks);
  const dispatch = useAppDispatch();

  const { centrifuge, subscription } = useCentrifuge(WSS_ORDER_URL, CHANNEL);

  useEffect(() => {
    if (centrifuge && subscription) {
      centrifuge.on("connected", () => {
        console.log("Websocket connected");
        if (subscription) {
          subscription.subscribe();
        }
      });
      centrifuge.on("disconnected", (ctx) => {
        console.log("Websocket disconnected");
        if (ctx.reason !== "disconnect called") {
          setTimeout(() => {
            centrifuge.connect();
          }, 3000);
        }
      });
      subscription.on("subscribed", handleSubscribedData);
      subscription.on("publication", handlePublishedData);

      centrifuge.connect();
      subscription.subscribe();
    }

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
      if (centrifuge) {
        centrifuge.disconnect();
      }
    };
  }, [centrifuge, subscription]);

  const handleSubscribedData = (ctx: SubscribedContext) => {
    console.log("subscribed");
    if (ctx.data) {
      const { bids: newBidsData, asks: newAsksData, market_id } = ctx.data;
      dispatch(
        addExistingState({
          bids: conversion(newBidsData).reverse(),
          asks: conversion(newAsksData),
          market_id,
        })
      );
    }
  };

  const handlePublishedData = (ctx: PublicationContext) => {
    console.log("publication");
    if (ctx.data) {
      const { bids: newBidsData, asks: newAsksData } = ctx.data;
      if (newBidsData.length > 0) {
        dispatch(addBids(conversion(newBidsData)));
      }
      if (newAsksData.length > 0) {
        dispatch(addAsks(conversion(newAsksData)));
      }
    }
  };

  const buildPriceLevels = (
    levels: number[][],
    orderType: OrderType = OrderType.BIDS
  ): React.ReactNode => {
    let sortedLevels = [];
    if (orderType === OrderType.BIDS)
      sortedLevels = levels.slice(0, DISPLAY_LEVELS);
    else sortedLevels = levels.slice(DISPLAY_LEVELS * -1);
    return sortedLevels.map((level, idx) => {
      const calculatedTotal: number = level[2];
      const total: string = formatNumber(calculatedTotal);
      const depth = level[3];
      const amount: string = formatNumber(level[1]);
      const price: string = formatPrice(level[0]);

      return (
        <PriceLevelRowContainer key={idx + depth}>
          <DepthVisualizer key={depth} depth={depth} orderType={orderType} />
          <PriceLevelRow
            orderType={orderType}
            key={amount + total}
            total={total}
            amount={amount}
            price={price}
            marked={
              (orderType === OrderType.BIDS && idx === 0) ||
              (orderType === OrderType.ASKS && idx === DISPLAY_LEVELS - 1)
            }
          />
        </PriceLevelRowContainer>
      );
    });
  };

  return (
    <Container>
      <TitleSpan>OrderBook</TitleSpan>
      {bids.length && asks.length ? (
        <>
          <TableContainer>
            <TitleRow />
            <div>{buildPriceLevels(asks, OrderType.ASKS)}</div>
          </TableContainer>
          <Spread bids={bids} asks={asks} />
          <TableContainer>
            <TitleRow />
            <div>{buildPriceLevels(bids, OrderType.BIDS)}</div>
          </TableContainer>
        </>
      ) : (
        <Loader />
      )}
    </Container>
  );
}

export default OrderBook;
