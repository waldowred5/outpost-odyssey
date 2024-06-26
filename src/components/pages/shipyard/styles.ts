import { styled } from 'styled-components';

export const StyledShipyard = styled.div`
  // Display
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  
  // Sizing
  width: 100vw;
  height: 100vh;
`;

export const ShipyardSectionContainer = styled.div`
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
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-template-rows: repeat(6, 100px);
  row-gap: 12px;
  column-gap: 12px;
  justify-content: center;
  align-items: center;
  height: 100%;
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
