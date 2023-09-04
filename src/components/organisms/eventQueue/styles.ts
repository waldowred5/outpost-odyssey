import { styled } from 'styled-components';

export const StyledEventQueue = styled.div`
  display: flex;
  flex: 1;
  position: absolute;
  z-index: 1000;
  bottom: 8px;
  right: 8px;
  width: 200px;
  justify-content: flex-start;
  background-color: red;
`;

export const EventQueueItemContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

export const EventQueueItem = styled.div`
  display: flex;
  flex-direction: column;
  background-color: darkblue;
  border-radius: 4px;
  margin: 4px;
  height: 32px;
  justify-content: center;
  align-items: center;
`;

export const EventQueueItemText = styled.h5`
  color: white;
  font-size: 16px;
`;
