import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  justify-content: space-around;
  background-color: #101624;
  position: relative;

  &:after {
    background-color: #3d1e28;
    background-position: center;
    height: 100%;
    padding: 0.3em 0;
    display: block;
    content: "";
    position: absolute;
    left: 0;
    right: unset;
    z-index: 0;
  }

  span {
    z-index: 1;
    min-width: 54px;
    text-align: end;
  }

  .bid-price {
    color: #19c193;
    text-align: start;
  }

  .ask-price {
    color: #d73d54;
    text-align: start;
  }
`;

export const PriceLevelRowContainer = styled.div`
  margin: 0.155em 0;
`;
