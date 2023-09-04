import {
  PrimaryTab,
  SecondaryTab,
  SecondaryStatGrid,
  StatTextButton,
  StyledStatsBar,
  StatTextButtonLabel,
  TertiaryButton,
  TertiaryTab,
  TertiaryText,
  TextUnskewWrapper, SecondaryStatGridContainer, PrimaryStatTextButton,
} from './styles';
import { TbWorldDollar } from 'react-icons/tb';
import { useFirestoreCollectionData, useFirestoreDocData, useUser, useFirestore } from 'reactfire';
import { useLocation, useNavigate } from 'react-router-dom';
import { PROTECTED_ROUTES } from '../../../types/constants.ts';
import { signOut } from 'firebase/auth';
import { collection, doc, query } from 'firebase/firestore';
import { FIRESTORE_COLLECTION, REACT_FIRE_HOOK_STATUS } from '../../../types/constants.ts';
import { BsRocketTakeoffFill } from 'react-icons/bs';
import { useEffect, useState } from 'react';
import { Auth, User } from '@firebase/auth';

const NAV_BUTTON = {
  GALAXY: 'GALAXY',
  SHIPS: 'SHIPS',
  CREW: 'CREW',
  CONTRACTS: 'CONTRACTS',
  OUTPOST: 'OUTPOST',
  RANKS: 'RANKS',
  MARKET: 'MARKET',
  QUESTS: 'QUESTS',
};

export const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const firestore = useFirestore();
  const { status, data: user } = useUser();
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    if (status === REACT_FIRE_HOOK_STATUS.SUCCESS && user) {
      setCurrentUser(user);
    }
  }, [status]);

  type FirebaseUser = User & { auth: Auth };

  // TODO: THIS IS A HACK! REMOVE THIS WHEN REACT-FIRE IS FIXED
  /*
  This solves a major problem where the whole app errors when trying to fetch any firestore document
  To recreate the bug (after commenting out the clearFirestoreCache invocation below):
  Login to the app, then logout, then login again. You will see the following error in the console:
  `Uncaught FirebaseError: Null value error. for 'list' @ L6`
  */
  const clearFirestoreCache = () => {
    const reactFirePreloadedObservables = (globalThis as Record<string, unknown>)['_reactFirePreloadedObservables'] as
      | Map<string, unknown>
      | undefined;
    if (reactFirePreloadedObservables) {
      Array.from(reactFirePreloadedObservables.keys())
        .filter((key) => key.includes('firestore'))
        .forEach((key) =>
          reactFirePreloadedObservables.delete(key)
        );
    }
  };

  const handleLogout = async () => {
    const { auth } = currentUser as FirebaseUser;
      try {
        await signOut(auth);
        clearFirestoreCache();
        navigate('/');
        console.log('You are logged out');
      } catch (error) {
        console.log((error as Error).message);
      }
  };

  const handleNavigate = (route: string) => {
    if (location.pathname !== route) {
      navigate(route);
    }
  };

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  });

  const playerRef = doc(firestore, FIRESTORE_COLLECTION.PLAYERS, `${currentUser?.uid}`);
  const { data: playerData } = useFirestoreDocData(playerRef);
  const balance = playerData?.balance || '-';
  const balanceModifier = balance < 0 ? '-' : '';
  const balanceAmount = balance < 0 ? formatter.format(balance * -1) : formatter.format(balance);
  const balanceString = balance === '-' ? '-' : `${balanceModifier} ${balanceAmount}`;

  const playerShipsCollection = collection(firestore, `${FIRESTORE_COLLECTION.PLAYERS}/${currentUser?.uid}/${FIRESTORE_COLLECTION.SHIPS}`);
  const playerShipsQuery = query(playerShipsCollection);
  const { status: shipStatus, data: shipData } = useFirestoreCollectionData(playerShipsQuery, {
    idField: 'id', // this field will be added to the object created from each document
  });

  const navButtonMap = {
    // [NAV_BUTTON.OUTPOST]: {
    //   icon: <GiOrbital style={{ fontSize: '22px' }}/>,
    //   route: PROTECTED_ROUTES.OUTPOST,
    //   hasCount: false,
    //   count: null,
    // },
    // [NAV_BUTTON.GALAXY]: {
    //   icon: <BsStars style={{ fontSize: '22px' }}/>,
    //   route: PROTECTED_ROUTES.GALAXY,
    //   hasCount: false,
    //   count: null,
    // },
    [NAV_BUTTON.SHIPS]: {
      icon: <BsRocketTakeoffFill style={{ fontSize: '18px' }}/>,
      route: PROTECTED_ROUTES.SHIPYARD,
      hasCount: true,
      count: shipStatus === REACT_FIRE_HOOK_STATUS.SUCCESS ? shipData.length : 0,
    },
    // [NAV_BUTTON.CREW]: {
    //   icon: <FontAwesomeIcon icon={faPeopleGroup}/>,
    //   route: PROTECTED_ROUTES.CREW,
    //   hasCount: true,
    //   count: 0,
    // },
    // [NAV_BUTTON.CONTRACTS]: {
    //   icon: <FontAwesomeIcon icon={faFileLines}/>,
    //   route: PROTECTED_ROUTES.CONTRACTS,
    //   hasCount: true,
    //   count: 0,
    // },
    [NAV_BUTTON.MARKET]: {
      icon: <TbWorldDollar style={{ fontSize: '22px' }}/>,
      route: PROTECTED_ROUTES.MARKETPLACE,
      hasCount: false,
      count: null,
    },
    // [NAV_BUTTON.RANKS]: {
    //   icon: <GiTrophy style={{ fontSize: '22px' }}/>,
    //   route: PROTECTED_ROUTES.RANKS,
    //   hasCount: false,
    //   count: null,
    // },
    // [NAV_BUTTON.QUESTS]: {
    //   icon: <IoMdRibbon style={{ fontSize: '22px' }}/>,
    //   route: PROTECTED_ROUTES.QUESTS,
    //   hasCount: true,
    //   count: 0,
    // }
  };

  if (status !== REACT_FIRE_HOOK_STATUS.SUCCESS || !currentUser) {
    return null;
  }

  return (
    <>
      <StyledStatsBar>
        <PrimaryTab>
          <PrimaryStatTextButton
            onClick={() => handleNavigate(PROTECTED_ROUTES.FINANCES)}
            $balance={balance}
            $isActiveScene={location.pathname === PROTECTED_ROUTES.FINANCES}
          >
            <TextUnskewWrapper>
              {balanceString}
            </TextUnskewWrapper>
          </PrimaryStatTextButton>
          <StatTextButtonLabel>
            FINANCES
          </StatTextButtonLabel>
        </PrimaryTab>
        <SecondaryTab>
          <SecondaryStatGrid>
            {
              Object.keys(navButtonMap).map((key) => {
                return (
                  <SecondaryStatGridContainer
                    key={key}
                  >
                    <StatTextButton
                      onClick={() => handleNavigate(navButtonMap[key].route)}
                      $isActiveScene={location.pathname === navButtonMap[key].route}
                    >
                      <TextUnskewWrapper>
                        {navButtonMap[key].icon}
                        {navButtonMap[key].hasCount && navButtonMap[key].count}
                      </TextUnskewWrapper>
                    </StatTextButton>
                    <StatTextButtonLabel>
                      {key}
                    </StatTextButtonLabel>
                  </SecondaryStatGridContainer>
                );
              })
            }
          </SecondaryStatGrid>
        </SecondaryTab>
      </StyledStatsBar>
      <TertiaryTab>
        <TertiaryText>{currentUser && currentUser.email}</TertiaryText>
        {
          currentUser
            ? <TertiaryButton onClick={handleLogout}>
              LOGOUT
            </TertiaryButton>
            : null
        }
      </TertiaryTab>
    </>
  );
};
