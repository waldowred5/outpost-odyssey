import { useUser } from 'reactfire';
import { Timers } from './Timers.tsx';
import { REACT_FIRE_HOOK_STATUS } from '../types/constants.ts';

export const TimersAuthWrapper = () => {
  const { status: userStatus, data: user } = useUser();

  return (
    <>
      { userStatus === REACT_FIRE_HOOK_STATUS.SUCCESS && user ? <Timers/> : null }
    </>
  );
};
