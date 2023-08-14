import { styled } from 'styled-components';

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
