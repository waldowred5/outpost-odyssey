import { useFirestore, useFirestoreCollectionData, useUser } from 'reactfire';
import { collection, orderBy, query, where } from 'firebase/firestore';
import { FIRESTORE_COLLECTION, REACT_FIRE_HOOK_STATUS } from '../../../types/constants.ts';
import { CrewSectionContainer, StyledCrew, TileContainer } from './styles.ts';
import { CrewMember } from '../../../types/models.ts';
import { CrewTile } from '../../molecules/crewTile/CrewTile.tsx';

export const Crew = () => {
  const firestore = useFirestore();
  const { data: user } = useUser();
  const playerCrewCollection = collection(firestore, FIRESTORE_COLLECTION.TALENT_POOL);
  const playerCrewQuery = query(playerCrewCollection, where('employedBy', '==', user?.uid), orderBy('level', 'desc'));
  const { status: crewStatus, data: crewData } = useFirestoreCollectionData(playerCrewQuery, {
    idField: 'id', // this field will be added to the object created from each document
  });

  return (
    <StyledCrew>
      <h1>CREW</h1>
      <CrewSectionContainer>
        <TileContainer
        >
          {
            crewStatus === REACT_FIRE_HOOK_STATUS.SUCCESS && crewData.map((crewDataItem) => {
              const crewData = crewDataItem as CrewMember;
              const crewId = crewDataItem.id;

              return (
                <CrewTile key={crewId} crewData={crewData} crewId={crewId} />
              );
            })
          }
        </TileContainer>
      </CrewSectionContainer>
    </StyledCrew>
  );
};
