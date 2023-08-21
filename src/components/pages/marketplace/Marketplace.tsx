import {
  MarketplaceSectionContainer,
  StyledMarketplace, Tile, TileContainer
} from './styles';
import { useFirestore, useFirestoreCollectionData, useFirestoreDocData, useFunctions, useUser } from 'reactfire';
import { collection, query, orderBy, doc } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { CLOUD_FUNCTION, FIRESTORE_COLLECTION, REACT_FIRE_HOOK_STATUS } from '../../../utils/constants.ts';
import { BsRocketTakeoff } from 'react-icons/bs';
// import { shallow } from 'zustand/shallow';
// import useEvent from '../../../stores/useEvent.ts';
// import { useTimer } from '../../../context/Timer.tsx';
// import { useEffect } from 'react';
// import { emitter } from '../../../utils/emitter.ts';

export const Marketplace = () => {
  // console.log('Marketplace');
  const functions = useFunctions();
  const firestore = useFirestore();
  const purchaseShip = httpsCallable(functions, CLOUD_FUNCTION.PURCHASE_SHIP);
  // const stuff = useTimer();
  // console.log('stuff in marketplace', stuff);
  // const { serverStartTime, currentServerTime } = useTimer();
  // const { serverStartTime } = useTimer();

  // const {
  //   addGameEvent,
  //   removeGameEvent,
  // } = useEvent((state) => {
  //   return {
  //     addGameEvent: state.addGameEvent,
  //     removeGameEvent: state.removeGameEvent,
  //   };
  // }, shallow);

  const handlePurchaseShip = async (shipClass: string) => {
    return await purchaseShip({ shipClass });
    // const shipRef = await purchaseShip({ shipClass });
    // const ship = shipRef.data; // TODO: Type this

    // const gameEvent = {
    //   availableAfter: ship.availableAfter,
    //   entityId: ship.shipId,
    //   eventType: 'PURCHASE_SHIP',
    // };

    // addGameEvent(gameEvent);

    // emitter.once(`PURCHASE_SHIP:${ship.shipId}`, () => {
    //   removeGameEvent(gameEvent);
    // });

    // return shipRef;
  };

  const { data: user } = useUser();
  const userRef = doc(firestore, `${FIRESTORE_COLLECTION.PLAYERS}/${user?.uid}`);
  const { data: userData } = useFirestoreDocData(userRef);

  const shipClassesCollection = collection(firestore, FIRESTORE_COLLECTION.SHIP_CLASSES);
  const shipClassesQuery = query(shipClassesCollection, orderBy('price', 'asc'));
  const { status, data: shipClasses } = useFirestoreCollectionData(shipClassesQuery);

  // useEffect(() => {
  //   console.log('Marketplace serverStartTime: ', serverStartTime);
  // }, [serverStartTime]);

  return (
    <StyledMarketplace>
      <h1>MARKETPLACE</h1>
      <MarketplaceSectionContainer>
        <h3>SHIPS</h3>
        <TileContainer>
          {
            status !== REACT_FIRE_HOOK_STATUS.LOADING && shipClasses.map((shipClass) => {
              return (
                <Tile
                  key={shipClass.shipClass}
                  onClick={() => handlePurchaseShip(shipClass.shipClass)}
                  disabled={userData?.balance < shipClass.price}
                >
                  <BsRocketTakeoff style={{ fontSize: '32px' }}/>
                  <p>{shipClass.shipClass}</p>
                  <h3>$ {shipClass.price}</h3>
                </Tile>
              );
            })
          }
        </TileContainer>
      </MarketplaceSectionContainer>
      <MarketplaceSectionContainer>
        <h3>SHIP PARTS STORE COMING SOON...</h3>
      </MarketplaceSectionContainer>
      <MarketplaceSectionContainer>
        <h3>TALENT POOL COMING SOON...</h3>
      </MarketplaceSectionContainer>
    </StyledMarketplace>
  )
    ;
};
