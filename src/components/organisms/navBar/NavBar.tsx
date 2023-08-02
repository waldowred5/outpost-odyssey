import {
  PrimaryTab,
  SecondaryTab,
  SecondaryStatGrid,
  StatTextButton,
  StyledStatsBar,
  PrimaryStatTextButton,
  StatTextButtonLabel,
  TertiaryButton,
  TertiaryTab,
  TertiaryText,
  TextUnskewWrapper, SecondaryStatGridContainer,
} from './styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileLines, faPeopleGroup, faRocket } from '@fortawesome/free-solid-svg-icons';
import { GiOrbital, GiTrophy } from 'react-icons/gi';
import { BsStars } from 'react-icons/bs';
import { TbWorldDollar } from 'react-icons/tb';
import { IoMdRibbon } from 'react-icons/io';
import useCrew from '../../../stores/useCrew';
import useShips from '../../../stores/useShips';
import { useAuth, useFirestoreDocData, useUser } from 'reactfire';
import { useLocation, useNavigate } from 'react-router-dom';
import { PROTECTED_ROUTES } from '../../../routes/Routes';
import { signOut } from 'firebase/auth';
import { doc } from 'firebase/firestore';
import { useFirestore } from 'reactfire';

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
  const auth = useAuth();
  const { data: user } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await signOut(auth);
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

  const { crew } = useCrew();
  const { ships } = useShips();

  const navButtonMap = {
    [NAV_BUTTON.OUTPOST]: {
      icon: <GiOrbital style={{ fontSize: '22px' }}/>,
      route: PROTECTED_ROUTES.OUTPOST,
      hasCount: false,
      count: null,
    },
    [NAV_BUTTON.GALAXY]: {
      icon: <BsStars style={{ fontSize: '22px' }}/>,
      route: PROTECTED_ROUTES.GALAXY,
      hasCount: false,
      count: null,
    },
    [NAV_BUTTON.SHIPS]: {
      icon: <FontAwesomeIcon icon={faRocket}/>,
      route: PROTECTED_ROUTES.SHIPYARD,
      hasCount: true,
      count: ships.length,
    },
    [NAV_BUTTON.CREW]: {
      icon: <FontAwesomeIcon icon={faPeopleGroup}/>,
      route: PROTECTED_ROUTES.CREW,
      hasCount: true,
      count: crew.length,
    },
    [NAV_BUTTON.CONTRACTS]: {
      icon: <FontAwesomeIcon icon={faFileLines}/>,
      route: PROTECTED_ROUTES.CONTRACTS,
      hasCount: true,
      count: 0,
    },
    [NAV_BUTTON.MARKET]: {
      icon: <TbWorldDollar style={{ fontSize: '22px' }}/>,
      route: PROTECTED_ROUTES.MARKETPLACE,
      hasCount: false,
      count: null,
    },
    [NAV_BUTTON.RANKS]: {
      icon: <GiTrophy style={{ fontSize: '22px' }}/>,
      route: PROTECTED_ROUTES.RANKS,
      hasCount: false,
      count: null,
    },
    [NAV_BUTTON.QUESTS]: {
      icon: <IoMdRibbon style={{ fontSize: '22px' }}/>,
      route: PROTECTED_ROUTES.QUESTS,
      hasCount: true,
      count: 0,
    }
  };

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  });

  const balanceRef = doc(useFirestore(), 'players', `${user?.uid}`);
  const { data: balanceData } = useFirestoreDocData(balanceRef);
  const balance = balanceData?.balance || '-';
  const balanceModifier = balance < 0 ? '-' : '';
  const balanceAmount = balance < 0 ? formatter.format(balance * -1) : formatter.format(balance);
  const balanceString = balance === '-' ? '-' : `${balanceModifier} ${balanceAmount}`;

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
        <TertiaryText>{user && user.email}</TertiaryText>
        {
          user && <TertiaryButton
            onClick={handleLogout}
          >
            LOGOUT
          </TertiaryButton>
        }
      </TertiaryTab>
    </>
  );
};