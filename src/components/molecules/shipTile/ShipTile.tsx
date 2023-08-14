import { BsRocketTakeoffFill } from 'react-icons/bs';
import { Tile } from './styles.ts';
import { useEffect, useRef, useState } from 'react';
import useTimer from '../../../stores/useTimer.ts';
import useEvent from '../../../stores/useEvent.ts';
import { shallow } from 'zustand/shallow';
// import { addEffect } from '@react-three/fiber';

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

  // useEffect(() => {
  //   const unsubscribeEffect = addEffect(() => {
  //     const { currentServerTime } = useTimer.getState();
  //
  //     // console.log('currentServerTime', currentServerTime);
  //     // console.log('shipDataItem.availableAfter', shipDataItem.availableAfter);
  //     // const disabled = !!(currentServerTime?.seconds < shipDataItem.availableAfter.seconds);
  //     // const timeLeftSeconds = Math.ceil(shipDataItem.availableAfter.toMillis() / 1000 - currentServerTime?.toMillis() / 1000);
  //
  //     if (shipTileHeadingRef.current) {
  //       console.log(currentServerTime);
  //       shipTileHeadingRef.current.textContent = currentServerTime.toMillis().toString();
  //     }
  //   });
  //
  //   return () => {
  //     unsubscribeEffect();
  //   };
  // }, []);

  const {
    gameEvents,
  } = useEvent((state) => {
    return {
      gameEvents: state.gameEvents,
    };
  }, shallow);

  const [isDisabled, setIsDisabled] = useState(false);

  useEffect(() => {
    const disabled = !!gameEvents[`${shipDataItem.availableAfter.seconds}:${shipDataItem.id}`];
    setIsDisabled(disabled);
  }, [gameEvents]);

  return (
    <Tile
      key={shipDataItem.id}
      ref={shipTileButtonRef}
      onClick={() => console.log(`ship ${shipDataItem.id} selected`, shipDataItem)}
      disabled={isDisabled}
    >
      <BsRocketTakeoffFill style={{ fontSize: '32px' }}/>
      <p>{shipDataItem.shipClass}</p>
      {
        isDisabled ?
          <>
            <h3>AVAILABLE IN</h3>
            <h3
              ref={shipTileHeadingRef}
            >PENDING</h3>
          </> :
          <p>{shipDataItem.id.substring(0, 4)}</p>
      }
    </Tile>
  );
};

// import { useEffect, useRef } from 'react';
// import { TimeHeading, TimePanelWrapper } from './styles';
// import { addEffect } from '@react-three/fiber';
// import { MATCH_PHASE } from '@/store/match/types';
// import useMatchState from '@/store/match/useMatchState';
//
// export const TimePanel = () => {
//   const timeRef = useRef<HTMLHeadingElement | null>(null);
//
//   // Start Timer
//   useEffect(() => {
//     const unsubscribeEffect = addEffect(() => {
//       const { matchPhase, matchStartTime, matchEndTime } = useMatchState.getState();
//
//       let elapsedTime = 0;
//
//       if (matchPhase === MATCH_PHASE.ACTIVE_MATCH) {
//         elapsedTime = Date.now() - matchStartTime;
//       } else if (matchPhase === MATCH_PHASE.POST_MATCH) {
//         elapsedTime = matchEndTime - matchStartTime;
//       }
//
//       elapsedTime /= 1000;
//       elapsedTime = Number(elapsedTime.toFixed(2));
//
//       if (timeRef.current) {
//         timeRef.current.textContent = elapsedTime.toString();
//       }
//     });
//
//     return () => {
//       unsubscribeEffect();
//     };
//   }, []);
//
//   return (
//     <TimePanelWrapper>
//       <TimeHeading
//         ref={timeRef}
//       >
//         0.00
//       </TimeHeading>
//     </TimePanelWrapper>
//   );
// };

