// import { AuthContextProvider } from '../context/AuthContext';
import { Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { Home } from '../components/pages/home/Home';
import { Register } from '../components/pages/authentication/Register';
import { Login } from '../components/pages/authentication/Login';
import { Dashboard } from '../components/pages/dashboard/Dashboard';
import { PrimaryLayout } from '../layouts/primary/PrimaryLayout';
import { Finances } from '../components/pages/finances/Finances';
import { Outpost } from '../components/pages/outpost/Outpost';
import { Galaxy } from '../components/pages/galaxy/Galaxy';
import { Shipyard } from '../components/pages/shipyard/Shipyard';
import { Crew } from '../components/pages/crew/Crew';
import { Contracts } from '../components/pages/contracts/Contracts';
import { Marketplace } from '../components/pages/marketplace/Marketplace';
import { Ranks } from '../components/pages/ranks/Ranks';
import { Quests } from '../components/pages/quests/Quests';

export const PROTECTED_ROUTES = {
  DASHBOARD: '/dashboard',
  FINANCES: '/finances',
  OUTPOST: '/outpost',
  GALAXY: '/galaxy',
  SHIPYARD: '/shipyard',
  CREW: '/crew',
  CONTRACTS: '/contracts',
  MARKETPLACE: '/marketplace',
  RANKS: '/ranks',
  QUESTS: '/quests',
};

const protectedRoutesMap = {
  [PROTECTED_ROUTES.DASHBOARD]: Dashboard,
  [PROTECTED_ROUTES.FINANCES]: Finances,
  [PROTECTED_ROUTES.OUTPOST]: Outpost,
  [PROTECTED_ROUTES.GALAXY]: Galaxy,
  [PROTECTED_ROUTES.SHIPYARD]: Shipyard,
  [PROTECTED_ROUTES.CREW]: Crew,
  [PROTECTED_ROUTES.CONTRACTS]: Contracts,
  [PROTECTED_ROUTES.MARKETPLACE]: Marketplace,
  [PROTECTED_ROUTES.RANKS]: Ranks,
  [PROTECTED_ROUTES.QUESTS]: Quests,
};

export const AppRoutes = () => {
  return (
    <>
      {/*<AuthContextProvider>*/}
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/register" element={<Register/>}/>
          <Route path="/login" element={<Login/>}/>
          {
            Object.entries(PROTECTED_ROUTES).map(([route, path]) => {
              const componentKey = PROTECTED_ROUTES[route as keyof typeof PROTECTED_ROUTES];
              const Component = protectedRoutesMap[componentKey];

              return (
                <Route key={route} path={path} element={
                  <ProtectedRoute>
                    <PrimaryLayout>
                      <Component/>
                    </PrimaryLayout>
                  </ProtectedRoute>
                }/>
              );
            })
          }
        </Routes>
      {/*</AuthContextProvider>*/}
    </>
  );
};
