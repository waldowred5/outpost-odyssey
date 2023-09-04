import { StyledShipyard } from './styles';
import { ShipyardSectionContainer, TileContainer } from './styles.ts';
import { FIRESTORE_COLLECTION, REACT_FIRE_HOOK_STATUS } from '../../../types/constants.ts';
import { useFirestore, useFirestoreCollectionData, useUser } from 'reactfire';
import { collection, orderBy, query } from 'firebase/firestore';
import { ShipTile } from '../../molecules/shipTile/ShipTile.tsx';
import { Ship } from '../../../types/models.ts';

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
        <TileContainer
        >
          {
            shipStatus === REACT_FIRE_HOOK_STATUS.SUCCESS && shipData.map((shipDataItem) => {
              const shipData = shipDataItem as Ship;
              const shipId = shipDataItem.id;

              return (
                <ShipTile key={shipId} shipData={shipData} shipId={shipId} />
              );
            })
          }
        </TileContainer>
      </ShipyardSectionContainer>
    </StyledShipyard>
  );
};
