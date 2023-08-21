import { BsRocketTakeoffFill } from 'react-icons/bs';
import { Tile } from './styles.ts';
import { useEffect, useRef } from 'react';
import useTimer from '../../../stores/useTimer.ts';
import { useFunctions, useUser } from 'reactfire';
import { httpsCallable } from 'firebase/functions';

export const ShipTile = ({ shipDataItem }) => {
  const serverTimeRef = useRef(useTimer.getState().currentServerTime);
  const shipTileButtonRef = useRef<HTMLButtonElement | null>(null);
  const shipTileHeadingRef = useRef<HTMLHeadingElement | null>(null);

  useEffect(() => useTimer.subscribe(
    (state) => {
      serverTimeRef.current = state.currentServerTime;

      const { currentServerTime } = state;

      if (shipTileHeadingRef.current && currentServerTime?.seconds) {
        const timeLeft = Math.ceil(shipDataItem.availableAfter.seconds - currentServerTime?.seconds);

        shipTileHeadingRef.current.textContent = `${timeLeft.toString()} SEC`;
      }
    }
  ), []);

  useEffect(() => {
    const unsubscribeEffect = () => {
      const { currentServerTime } = useTimer.getState();

      // console.log('currentServerTime', currentServerTime);
      // console.log('shipDataItem.availableAfter', shipDataItem.availableAfter);
      // const disabled = !!(currentServerTime?.seconds < shipDataItem.availableAfter.seconds);
      // const timeLeftSeconds = Math.ceil(shipDataItem.availableAfter.toMillis() / 1000 - currentServerTime?.toMillis() / 1000);

      if (shipTileHeadingRef.current && currentServerTime) {
        shipTileHeadingRef.current.textContent = currentServerTime.seconds.toString();
      }
    };

    return () => {
      unsubscribeEffect();
    };
  }, []);

  // const {
  //   gameEvents,
  // } = useEvent((state) => {
  //   return {
  //     gameEvents: state.gameEvents,
  //   };
  // }, shallow);
  //
  // const [isDisabled, setIsDisabled] = useState(false);
  //
  // useEffect(() => {
  //   const disabled = !!gameEvents[`${shipDataItem.availableAfter.seconds}:${shipDataItem.id}`];
  //   setIsDisabled(disabled);
  // }, [gameEvents]);

  const functions = useFunctions();
  const gameEventQueueCallback = httpsCallable(functions, 'gameEventQueueCallback');
  const { data: user } = useUser();
  const testClickHandler = async (shipId: string) => {
    if (!user) {
      console.log('no user');

      return;
    }

    await gameEventQueueCallback({ docPath: `players/${user.uid}/ships/${shipId}` });
  };

  const disabled = !shipDataItem.isAvailable;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', rowGap: '4px' }}>
      <Tile
        key={shipDataItem.id}
        ref={shipTileButtonRef}
        onClick={() => console.log(`ship ${shipDataItem.id} selected`, shipDataItem)}
        disabled={disabled}
      >
        <BsRocketTakeoffFill style={{ fontSize: '32px' }}/>
        <p>{shipDataItem.shipClass}</p>
        {
          disabled ?
            <>
              <h3>AVAILABLE IN</h3>
              <h3
                ref={shipTileHeadingRef}
              >PENDING</h3>
            </> :
            <p>{shipDataItem.id.substring(0, 4)}</p>
        }
      </Tile>
      {
        disabled && <button onClick={() => testClickHandler(shipDataItem.id)}>MAKE AVAILABLE</button>
      }
    </div>
  );
};
