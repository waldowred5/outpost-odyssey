import {
  CrewTileContainer,
  MarketplaceSectionContainer,
  StyledMarketplace, Tile, TileContainer, TileImage, TileText
} from './styles';
import { useFirestore, useFirestoreCollectionData, useFirestoreDocData, useFunctions, useUser } from 'reactfire';
import { collection, doc, orderBy, query, where } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { CLOUD_FUNCTION, FIRESTORE_COLLECTION, REACT_FIRE_HOOK_STATUS } from '../../../types/constants.ts';
import { BsFillPersonFill, BsRocketTakeoff } from 'react-icons/bs';
import { SHIP_CLASS, SHIP_CLASS_MAP } from '../../../types/shipTypes.ts';
import { CrewMember } from '../../../types/models.ts';
import { button, folder, useControls } from 'leva';

export const Marketplace = () => {
    const functions = useFunctions();
    const firestore = useFirestore();
    const purchaseShip = httpsCallable(functions, CLOUD_FUNCTION.PURCHASE_SHIP);
    const hireCrewMember = httpsCallable(functions, CLOUD_FUNCTION.HIRE_CREW_MEMBER);
    const createCrewMember = httpsCallable(functions, CLOUD_FUNCTION.ADD_NEW_MEMBER_TO_TALENT_POOL);

    const handlePurchaseShip = async (shipClass: keyof typeof SHIP_CLASS) => {
      await purchaseShip({ shipClass });
    };

    const handleHireCrewMember = async (crewMemberId: string) => {
      await hireCrewMember({ crewMemberId });
    };

    const { data: user } = useUser();
    const userRef = doc(firestore, `${FIRESTORE_COLLECTION.PLAYERS}/${user?.uid}`);
    const { data: userData } = useFirestoreDocData(userRef);

    const playerCrewCollection = collection(firestore, `${FIRESTORE_COLLECTION.TALENT_POOL}`);
    const playerCrewQuery = query(playerCrewCollection, where('employedBy', '==', null), orderBy('level', 'desc'));
    const { status: crewStatus, data: crewData } = useFirestoreCollectionData(playerCrewQuery, {
      idField: 'id', // this field will be added to the object created from each document
    });

    // DEBUG
    useControls('Marketplace', {
      'Crew': folder({
        'Create': button(() => {
          createCrewMember();
        }),
      }),
    });

    return (
      <StyledMarketplace>
        <h1>MARKETPLACE</h1>
        <br></br>
        <h3>SHIPS</h3>
        <MarketplaceSectionContainer>

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
        <br></br>
        <h3>TALENT POOL</h3>
        <MarketplaceSectionContainer style={{ height: '500px' }}>
          <CrewTileContainer>
            {
              crewStatus === REACT_FIRE_HOOK_STATUS.SUCCESS && crewData.map((crewDataItem) => {
                const crewData = crewDataItem as CrewMember;
                const crewId = crewDataItem.id;
                // const disabled = !Object.values(crewData).filter((crewMember) => crewMember.idField === crewId);

                return (
                  <Tile
                    key={crewData.firstName + crewData.lastName}
                    onClick={() => handleHireCrewMember(crewId)}
                    // disabled={disabled}
                  >
                    <TileImage>
                      <BsFillPersonFill style={{ fontSize: '64px' }}/>
                    </TileImage>
                    <TileText>
                      <h1>{crewData.firstName} {crewData.lastName}</h1>
                      {/*<h2>$ {crewData.price}</h2>*/}
                    </TileText>
                    <TileText>
                      <h5>LEVEL: {crewData.level}</h5>
                      <h5>ROLE: {crewData.role}</h5>
                    </TileText>
                  </Tile>
                );
              })
            }
          </CrewTileContainer>
        </MarketplaceSectionContainer>
        {/*<MarketplaceSectionContainer>*/}
        {/*  <h3>SHIP PARTS STORE COMING SOON...</h3>*/}
        {/*</MarketplaceSectionContainer>*/}
      </StyledMarketplace>
    );
  }
;
