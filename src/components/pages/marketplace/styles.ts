import { styled } from 'styled-components';

export const StyledMarketplace = styled.div`
  // Display
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  
  // Spacing
  padding: 24px;
  
  // Sizing
  width: 100vw;
  height: 100vh;
`;

export const MarketplaceSectionContainer = styled.div`
  // Display
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  
  // Spacing
  margin: 48px 0;
  row-gap: 12px;
`;

export const TileContainer = styled.div`
  // Display
  display: flex;
  flex-direction: row;
  column-gap: 12px;
  justify-content: center;
  align-items: center;
  height: 140px;
  width: 80vw;
`;

export const Tile = styled.button`
  // Display
  display: flex;
  flex-direction: column;
  flex: 1 1;
  row-gap: 8px;
  height: 100%;
  width: 100%;
  background-color: transparent;
  border: 8px #2f6fad solid;
  color: cyan;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  cursor: pointer;
  
  &:hover:enabled {
    border: 8px cyan solid;
    color: white;
  }
  
  &:disabled {
    border: 8px grey solid;
    color: grey;
    cursor: not-allowed;
  }
`;
