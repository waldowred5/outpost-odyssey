import { StyledCrew } from './styles';
import { useFirestore, useFirestoreCollectionData, useUser } from 'reactfire';
import { collection, orderBy, query } from 'firebase/firestore';
import { FIRESTORE_COLLECTION, REACT_FIRE_HOOK_STATUS } from '../../../utils/constants.ts';
import { BsPerson } from 'react-icons/bs';
import { Tile } from '../marketplace/styles.ts';

export const Crew = () => {
  const firestore = useFirestore();
  const { data: user } = useUser();
  const playerCrewsCollection = collection(firestore, `${FIRESTORE_COLLECTION.PLAYERS}/${user?.uid}/crew`);
  const playerCrewsQuery = query(playerCrewsCollection, orderBy('cut', 'asc'));
  const { status: crewStatus, data: crewData } = useFirestoreCollectionData(playerCrewsQuery, {
    idField: 'id', // this field will be added to the object created from each document
  });
  return (
    <StyledCrew>
      <h1>CREW</h1>
      {
        crewStatus !== REACT_FIRE_HOOK_STATUS.LOADING && crewData?.map((member) =>
          <Tile key={member.id}>
            <BsPerson style={{ fontSize: '32px' }}/>
            <p>{member.name}</p>
            <p>{member.profession}</p>
            <h3>{member.cut}%</h3>
          </Tile>
        )
      }
    </StyledCrew>
  );
};
