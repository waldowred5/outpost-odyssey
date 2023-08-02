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
`;

export const Tile = styled.div`
  // Display
  display: flex;
  height: 100px;
  width: 100px;
  background-color: #2f6fad;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  
  &:hover {
    background-color: #4ca7ff;
  }
`;
