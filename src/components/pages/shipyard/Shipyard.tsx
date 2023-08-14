import { StyledShipyard } from './styles';
import { ShipyardSectionContainer, Tile, TileContainer } from './styles.ts';
import { FIRESTORE_COLLECTION, REACT_FIRE_HOOK_STATUS } from '../../../utils/constants.ts';
import { useFirestore, useFirestoreCollectionData, useUser } from 'reactfire';
import { collection, orderBy, query } from 'firebase/firestore';
import { BsRocketTakeoffFill } from 'react-icons/bs';
import useTimer from '../../../stores/useTimer.ts';
import React, { useEffect, useRef } from 'react';
import { ShipTile } from '../../molecules/shipTile/ShipTile.tsx';
import useEvent from '../../../stores/useEvent.ts';
import { shallow } from 'zustand/esm/shallow';

export const Shipyard = () => {
  const firestore = useFirestore();
  const { data: user } = useUser();
  const playerShipsCollection = collection(firestore, `${FIRESTORE_COLLECTION.PLAYERS}/${user?.uid}/${FIRESTORE_COLLECTION.SHIPS}`);
  const playerShipsQuery = query(playerShipsCollection, orderBy('price', 'asc'));
  const { status: shipStatus, data: shipData } = useFirestoreCollectionData(playerShipsQuery, {
    idField: 'id', // this field will be added to the object created from each document
  });

  // const { currentServerTime } = useTimer();
  const serverTimeRef = useRef(useTimer.getState().currentServerTime);
  useEffect(() => useTimer.subscribe(
    state => (serverTimeRef.current = state.currentServerTime),
  ), []);
  const currentServerTime = serverTimeRef.current;

  return (
    <StyledShipyard>
      <h1>SHIPYARD</h1>
      <ShipyardSectionContainer>
        <TileContainer
          // ref={serverTimeRef}
        >
          {
            shipStatus === REACT_FIRE_HOOK_STATUS.SUCCESS && shipData.map((shipDataItem) => {
              // console.log('currentServerTime', currentServerTime);
              // console.log('shipDataItem.availableAfter', shipDataItem.availableAfter);
              const disabled = !!(currentServerTime?.seconds < shipDataItem.availableAfter.seconds);
              const timeLeftSeconds = Math.ceil(shipDataItem.availableAfter.seconds - currentServerTime?.seconds);

              return (
                // <Tile
                //   key={shipDataItem.id}
                //   onClick={() => console.log(`ship ${shipDataItem.id} selected`, shipDataItem)}
                //   disabled={disabled}
                // >
                //   <BsRocketTakeoffFill style={{ fontSize: '32px' }}/>
                //   <p>{shipDataItem.shipClass}</p>
                //   {
                //     disabled ?
                //       <>
                //         <h3>READY IN {timeLeftSeconds} SECONDS</h3>
                //       </> :
                //       <p>{shipDataItem.id.substring(0, 4)}</p>
                //   }
                // </Tile>
                <ShipTile key={shipDataItem.id} shipDataItem={shipDataItem} />
              );
            })
          }
        </TileContainer>
      </ShipyardSectionContainer>
    </StyledShipyard>
  );
};
