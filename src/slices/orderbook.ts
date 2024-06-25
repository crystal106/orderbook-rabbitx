import { createSlice, current } from '@reduxjs/toolkit';
import { ORDERBOOK_LEVELS } from '../constants';
import { RootState } from '../store';

export interface OrderBookState {
  market: string;
  bids: number[][];
  maxTotalBids: number;
  asks: number[][];
  maxTotalAsks: number;
}

const initialState: OrderBookState = {
  market: 'SOL-USD',
  bids: [],
  maxTotalBids: 0,
  asks: [],
  maxTotalAsks: 0,
}

const removePriceLevel = (price: number, levels: number[][]): number[][] => levels.filter(level => level[0] !== price);

const updatePriceLevel = (updatedLevel: number[], levels: number[][]): number[][] => {
  return levels.map(level => {
    if (level[0] === updatedLevel[0]) {
      level = updatedLevel;
    }
    return level;
  });
};

const levelExists = (deltaLevelPrice: number, currentLevels: number[][]): boolean => currentLevels.some(level => level[0] === deltaLevelPrice);

const addPriceLevel = (deltaLevel: number[], levels: number[][]): number[][] => {
  return [ ...levels, deltaLevel ];
};

const applyDeltas = (currentLevels: number[][], orders: number[][]): number[][] => {
  let updatedLevels: number[][] = currentLevels;

  orders.forEach((deltaLevel) => {
    const deltaLevelPrice = deltaLevel[0];
    const deltaLevelAmount = deltaLevel[1];

    // If new amount is zero - delete the price level
    if (deltaLevelAmount === 0) {
      updatedLevels = removePriceLevel(deltaLevelPrice, updatedLevels);
    } else {
      // If the price level exists and the amount is not zero, update it
      if (levelExists(deltaLevelPrice, currentLevels)) {
        updatedLevels = updatePriceLevel(deltaLevel, updatedLevels);
      } else {
        // If the price level doesn't exist in the orderbook, add it
        updatedLevels = addPriceLevel(deltaLevel, updatedLevels);
      }
    }
  });

  return updatedLevels;
}

const addTotalSums = (orders: number[][]): number[][] => {
  const totalSums: number[] = [];

  return orders.map((order: number[], idx) => {
    const amount = order[1];
    const updatedLevel = [...order];
    const totalSum: number = idx === 0 ? amount : amount + totalSums[idx - 1];
    updatedLevel[2] = totalSum;
    totalSums.push(totalSum);
    return updatedLevel;
  })
}

const addDepths = (orders: number[][], maxTotal: number): number[][] => {
  return orders.map(order => {
    const calculatedTotal: number = order[2];
    const depth = (calculatedTotal / maxTotal) * 100;
    const updatedOrder = [ ...order ];
    updatedOrder[3] = depth;
    return updatedOrder;
  });
}

const getMaxTotalSum = (orders: number[][]): number => {
  const totalSums: number[] = orders.map(order => order[2]);
  return Math.max.apply(Math, totalSums);
}

export const orderbookSlice = createSlice({
  name: 'orderbook',
  initialState,
  reducers: {
    addBids: (state, {payload}) => {
      const updatedBids: number[][] = addTotalSums(
        applyDeltas(current(state).bids, payload).sort((a, b) => b[0] - a[0])
      ).slice(0, ORDERBOOK_LEVELS);
      state.maxTotalBids = getMaxTotalSum(updatedBids);
      state.bids = addDepths(updatedBids, current(state).maxTotalBids);
    },

    addAsks: (state, {payload}) => {
      const updatedAsks: number[][] = addTotalSums(
        applyDeltas(current(state).asks, payload).sort((a, b) => a[0] - b[0])
      ).reverse().slice(0, ORDERBOOK_LEVELS);
      state.maxTotalAsks = getMaxTotalSum(updatedAsks);
      state.asks = addDepths(updatedAsks, current(state).maxTotalAsks);
    },

    addExistingState: (state, {payload}) => {
      const bids: number[][] = addTotalSums(payload.bids).slice(0, ORDERBOOK_LEVELS);
      const asks: number[][] = addTotalSums(payload.asks).slice(0, ORDERBOOK_LEVELS).reverse();

      state.market = payload['market_id'];
       state.maxTotalBids = getMaxTotalSum(bids);
      state.maxTotalAsks = getMaxTotalSum(asks);
      state.bids = addDepths(bids, current(state).maxTotalBids);
      state.asks = addDepths(asks, current(state).maxTotalAsks);
    }
  }
});

export const {addBids, addAsks, addExistingState} = orderbookSlice.actions;

export const selectBids = (state: RootState): number[][] => state.orderbook.bids;
export const selectAsks = (state: RootState): number[][] => state.orderbook.asks;
export const selectMarket = (state: RootState): string => state.orderbook.market;

export default orderbookSlice.reducer;