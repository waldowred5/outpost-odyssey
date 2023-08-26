import { BsRocketTakeoffFill } from 'react-icons/bs';
import { Tile } from './styles.ts';
import { useEffect, useRef } from 'react';
import useTimer from '../../../stores/useTimer.ts';
import { useFunctions, useUser } from 'reactfire';
import { httpsCallable } from 'firebase/functions';
import { Ship } from '../../../types/models.ts';
import { CLOUD_FUNCTION } from '../../../types/constants.ts';

interface ShipTileProps {
  shipData: Ship,
  shipId: string,
}

export const ShipTile = ({ shipData, shipId }: ShipTileProps) => {
  const serverTimeRef = useRef(useTimer.getState().currentServerTime);
  const shipTileButtonRef = useRef<HTMLButtonElement | null>(null);
  const shipTileHeadingRef = useRef<HTMLHeadingElement | null>(null);

  useEffect(() => useTimer.subscribe(
    (state) => {
      serverTimeRef.current = state.currentServerTime;

      const { currentServerTime } = state;

      if (shipTileHeadingRef.current && currentServerTime?.seconds) {
        console.log('shipData.availableAfter.seconds', shipData.availableAfter.seconds);
        console.log('currentServerTime.seconds', currentServerTime.seconds);
        const timeLeft = Math.ceil(shipData.availableAfter.seconds - currentServerTime.seconds);

        shipTileHeadingRef.current.textContent = `${timeLeft.toString()} SEC`;
      }
    }
  ), []);

  useEffect(() => {
    const unsubscribeEffect = () => {
      const { currentServerTime } = useTimer.getState();

      if (shipTileHeadingRef.current && currentServerTime) {
        shipTileHeadingRef.current.textContent = currentServerTime.seconds.toString();
      }
    };

    return () => {
      unsubscribeEffect();
    };
  }, []);

  const functions = useFunctions();
  const gameEventQueueCallbackManual = httpsCallable(functions, CLOUD_FUNCTION.GAME_EVENT_QUEUE_CALLBACK_MAUNAL);
  const { data: user } = useUser();

  // TODO: Remove this once local testing of cloud tasks queue is setup
  const testClickHandler = async (shipId: string) => {
    if (!user) {
      console.log('no user');

      return;
    }

    await gameEventQueueCallbackManual({ docPath: `players/${user.uid}/ships/${shipId}` });
  };

  const disabled = !shipData.isAvailable;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', rowGap: '4px' }}>
      <Tile
        key={shipId}
        ref={shipTileButtonRef}
        onClick={() => console.log(`ship ${shipId} selected`, shipData)}
        disabled={disabled}
      >
        <BsRocketTakeoffFill style={{ fontSize: '32px' }}/>
        <p>{shipData.shipClass}</p>
        {
          disabled ?
            <>
              <h3>AVAILABLE IN</h3>
              <h3
                ref={shipTileHeadingRef}
              >PENDING</h3>
            </> :
            <p>{shipId.substring(0, 4)}</p>
        }
      </Tile>
      {
        disabled && <button onClick={() => testClickHandler(shipId)}>MAKE AVAILABLE</button>
      }
    </div>
  );
};
