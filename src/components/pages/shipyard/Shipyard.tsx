import { StyledShipyard } from './styles';
import { ShipyardSectionContainer, Tile, TileContainer } from './styles.ts';
import { FIRESTORE_COLLECTION, REACT_FIRE_HOOK_STATUS } from '../../../utils/constants.ts';
import { useFirestore, useFirestoreCollectionData, useUser } from 'reactfire';
import { collection, orderBy, query } from 'firebase/firestore';
import { BsRocketTakeoffFill } from 'react-icons/bs';

export const Shipyard = () => {
  const firestore = useFirestore();

  const { data: user } = useUser();
  const playerShipsCollection = collection(firestore, `${FIRESTORE_COLLECTION.PLAYERS}/${user?.uid}/${FIRESTORE_COLLECTION.SHIPS}`);
  const playerShipsQuery = query(playerShipsCollection, orderBy('price', 'asc'));
  const { status: shipStatus, data: shipData } = useFirestoreCollectionData(playerShipsQuery, {
    idField: 'id', // this field will be added to the object created from each document
  });

  return (
    <StyledShipyard>
      <h1>SHIPYARD</h1>
      <ShipyardSectionContainer>
        <TileContainer>
          {
            shipStatus === REACT_FIRE_HOOK_STATUS.SUCCESS && shipData.map((shipDataItem) => {
              return (
                <Tile
                  key={shipDataItem.id}
                  onClick={() => console.log(`ship ${shipDataItem.id} selected`, shipDataItem)}
                >
                  <BsRocketTakeoffFill style={{ fontSize: '32px' }}/>
                  <p>{shipDataItem.shipClass}</p>
                  <h3>{shipDataItem.id.substring(0, 4)}</h3>
                </Tile>
              );
            })
          }
        </TileContainer>
      </ShipyardSectionContainer>
    </StyledShipyard>
  );
};
