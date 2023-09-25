import { styled } from 'styled-components';

export const Tile = styled.button`
  // Display
  display: flex;
  flex-direction: row;
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

export const TileImage = styled.div`
  // Display
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  aspect-ratio: 1;
`;

export const TileText = styled.div`
  // Display
  display: flex;
  flex-direction: column;
  row-gap: 8px;
  padding: 22px;
  align-items: center;
`;
