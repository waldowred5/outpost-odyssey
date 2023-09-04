import {
  MarketplaceSectionContainer,
  StyledMarketplace, Tile, TileContainer
} from './styles';
import { useFirestore, useFirestoreCollectionData, useFirestoreDocData, useFunctions, useUser } from 'reactfire';
import { collection, query, orderBy, doc } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { CLOUD_FUNCTION, FIRESTORE_COLLECTION, REACT_FIRE_HOOK_STATUS } from '../../../types/constants.ts';
import { BsRocketTakeoff } from 'react-icons/bs';

export const Marketplace = () => {
  const functions = useFunctions();
  const firestore = useFirestore();
  const purchaseShip = httpsCallable(functions, CLOUD_FUNCTION.PURCHASE_SHIP);

  const handlePurchaseShip = async (shipClass: string) => {
    await purchaseShip({ shipClass });
  };

  const { data: user } = useUser();
  const userRef = doc(firestore, `${FIRESTORE_COLLECTION.PLAYERS}/${user?.uid}`);
  const { data: userData } = useFirestoreDocData(userRef);

  const shipClassesCollection = collection(firestore, FIRESTORE_COLLECTION.SHIP_CLASSES);
  const shipClassesQuery = query(shipClassesCollection, orderBy('price', 'asc'));
  const { status, data: shipClasses } = useFirestoreCollectionData(shipClassesQuery);

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
