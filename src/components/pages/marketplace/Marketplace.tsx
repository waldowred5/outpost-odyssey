import {
  MarketplaceSectionContainer,
  StyledMarketplace, Tile, TileContainer, TileImage, TileText
} from './styles';
import { useFirestore, useFirestoreDocData, useFunctions, useUser } from 'reactfire';
import { doc } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { CLOUD_FUNCTION, FIRESTORE_COLLECTION } from '../../../types/constants.ts';
import { BsRocketTakeoff } from 'react-icons/bs';
import { SHIP_CLASS, SHIP_CLASS_MAP } from '../../../types/shipTypes.ts';

export const Marketplace = () => {
  const functions = useFunctions();
  const firestore = useFirestore();
  const purchaseShip = httpsCallable(functions, CLOUD_FUNCTION.PURCHASE_SHIP);

  const handlePurchaseShip = async (shipClass: keyof typeof SHIP_CLASS) => {
    await purchaseShip({ shipClass });
  };

  const { data: user } = useUser();
  const userRef = doc(firestore, `${FIRESTORE_COLLECTION.PLAYERS}/${user?.uid}`);
  const { data: userData } = useFirestoreDocData(userRef);

  return (
    <StyledMarketplace>
      <h1>MARKETPLACE</h1>
      <MarketplaceSectionContainer>
        <h3>SHIPS</h3>
        <TileContainer>
          {
            Object.values(SHIP_CLASS_MAP).map((shipClass) => {
              return (
                <Tile
                  key={shipClass.className}
                  onClick={() => handlePurchaseShip(shipClass.className)}
                  disabled={userData?.balance < shipClass.price}
                >
                  <TileImage>
                    <BsRocketTakeoff style={{ fontSize: '64px' }}/>
                  </TileImage>
                  <TileText>
                    <h1>{shipClass.className}</h1>
                    <h2>$ {shipClass.price}</h2>
                  </TileText>
                  <TileText>
                    <h5>FUEL CAPACITY: {shipClass.fuelCapacity}t</h5>
                    <h5>HULL CAPACITY: {shipClass.hullCapacity}t</h5>
                  </TileText>
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
