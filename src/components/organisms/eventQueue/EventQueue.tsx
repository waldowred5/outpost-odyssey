import { StyledEventQueue, EventQueueItem, EventQueueItemContainer, EventQueueItemText } from './styles.ts';
import { useEffect, useRef, useState } from 'react';
import useTimer from '../../../stores/useTimer.ts';
import { useFirestore, useFirestoreCollectionData, useUser } from 'reactfire';
import { collection, orderBy, query } from 'firebase/firestore';
import { FIRESTORE_COLLECTION, REACT_FIRE_HOOK_STATUS } from '../../../types/constants.ts';
import { GameEvents } from '../../../types/models.ts';

export const EventQueue = () => {
  const firestore = useFirestore();
  const { status: userStatus, data: user } = useUser();
  const playerShipsCollection = collection(firestore, `${FIRESTORE_COLLECTION.PLAYERS}/${user?.uid}/${FIRESTORE_COLLECTION.SHIPS}`);
  const playerShipsQuery = query(playerShipsCollection, orderBy('price', 'asc'));
  const { status: shipStatus, data: shipData } = useFirestoreCollectionData(playerShipsQuery, {
    idField: 'id', // this field will be added to the object created from each document
  });

  const [gameEvents, setGameEvents] = useState<GameEvents>({});

  useEffect(() => {
    if (shipStatus !== REACT_FIRE_HOOK_STATUS.SUCCESS) {
      return;
    }

    const shipEvents = shipData.reduce((acc, ship) => {
      if (ship.isAvailable) {
        return acc;
      }

      return {
        ...acc,
        [`${ship.availableAfter.seconds}:${ship.id}`]: {
          availableAfter: ship.availableAfter,
          isAvailable: ship.isAvailable,
          eventType: 'PURCHASE_SHIP',
          entityId: ship.id,
        }
      };
    }, {});

    setGameEvents(shipEvents);
  }, [shipStatus, shipData, userStatus]);

  const serverTimeRef = useRef(useTimer.getState().currentServerTime);
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const headingRefTest = useRef<HTMLHeadingElement | null>(null);
  const headingRefDrift = useRef<HTMLHeadingElement | null>(null);

  useEffect(() => useTimer.subscribe(
    (state) => {
      serverTimeRef.current = state.currentServerTime;

      const { currentServerTime } = state;

      if (headingRef.current && currentServerTime?.seconds) {
        headingRef.current.textContent = `SERVER TIME: ${currentServerTime.seconds.toString().substring(5, 10)}`;
      }

      // TODO: Remove this once drifting is fixed
      if (headingRefTest.current) {
        const actualTime = Date.now() / 1000;
        headingRefTest.current.textContent = `ACTUAL TIME: ${actualTime.toString().substring(5, 10)}`;
      }

      if (headingRefDrift.current && currentServerTime?.seconds) {
        const driftTime = currentServerTime.toMillis() - Date.now();
        headingRefDrift.current.textContent = `DRIFT (ms): ${Math.round(driftTime)}`;
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
                  {gameEvent[1].availableAfter.seconds.toString().substring(6, 10)} : {gameEvent[1].entityId.substring(0, 4)}
                </EventQueueItemText>
              </EventQueueItem>
            );
          })
        }
        <EventQueueItem style={{ backgroundColor: 'red' }}>
          <EventQueueItemText ref={headingRef}/>
        </EventQueueItem>
        <EventQueueItem style={{ backgroundColor: 'red' }}>
          <EventQueueItemText ref={headingRefTest}/>
        </EventQueueItem>
        <EventQueueItem style={{ backgroundColor: 'red' }}>
          <EventQueueItemText ref={headingRefDrift}/>
        </EventQueueItem>
      </EventQueueItemContainer>
    </StyledEventQueue>
  );
};
