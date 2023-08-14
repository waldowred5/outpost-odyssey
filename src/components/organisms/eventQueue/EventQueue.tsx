import { StyledEventQueue, EventQueueItem, EventQueueItemContainer, EventQueueItemText } from './styles.ts';
import useEvent from '../../../stores/useEvent.ts';
import { shallow } from 'zustand/shallow';
import { useEffect, useRef } from 'react';
import useTimer from '../../../stores/useTimer.ts';

export const EventQueue = () => {
// console.log('EventQueue');

  // const maxItems = 5;

  const {
    gameEvents,
  } = useEvent((state) => {
    return {
      gameEvents: state.gameEvents,
    };
  }, shallow);

  const serverTimeRef = useRef(useTimer.getState().currentServerTime);
  const headingRef = useRef<HTMLHeadingElement | null>(null);

  useEffect(() => useTimer.subscribe(
    (state) => {
      serverTimeRef.current = state.currentServerTime;

      const { currentServerTime } = state;

      if (headingRef.current && currentServerTime?.seconds) {
        headingRef.current.textContent = `SERVER TIME: ${currentServerTime.seconds.toString().substring(6, 10)}`;
      }
    }
  ), []);

  return (
    <StyledEventQueue>
      <EventQueueItemContainer>
        {
          Object.entries(gameEvents).map((gameEvent, index) => {
            return (
              <EventQueueItem key={`EventQueue: ${index}`}>
                <EventQueueItemText>
                  {gameEvent[1].availableAfter._seconds.toString().substring(6, 10)} : {gameEvent[1].entityId.substring(0, 4)}
                </EventQueueItemText>
              </EventQueueItem>
            );
          })
        }
        <EventQueueItem style={{ backgroundColor: 'red' }}>
          <EventQueueItemText ref={headingRef} />
        </EventQueueItem>
      </EventQueueItemContainer>
    </StyledEventQueue>
  );
};
