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

export const Tile = styled.button`
  // Display
  display: flex;
  flex-direction: column;
  height: 100px;
  width: 100px;
  background-color: #2f6fad;
  color: white;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  cursor: pointer;
  
  &:hover {
    background-color: #4ca7ff;
  }
  
  &:disabled {
    background-color: grey;
    cursor: not-allowed;
  }
`;
