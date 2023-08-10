import { useFunctions } from 'reactfire';
import { httpsCallable } from 'firebase/functions';
import { CLOUD_FUNCTION } from '../utils/constants.ts';
import { useEffect } from 'react';
import useTimer from '../stores/useTimer.ts';
import { Timestamp } from 'firebase/firestore';

export const Timers = () => {
  const functions = useFunctions();

  const getServerTime = httpsCallable<void, Timestamp>(functions, CLOUD_FUNCTION.GET_SERVER_TIME);
  const initializeServerTimestampState = useTimer((state) => state.initializeServerTimestampState);

  useEffect(() => {
    const triggerGetServerTime = async () => {
      const serverTimeEstablishedRequest = await getServerTime();
      const serverTimeEstablished = serverTimeEstablishedRequest.data;
      const serverTimeOffsetSeconds = serverTimeEstablished.serverTime._seconds - performance.timeOrigin / 1000;
      const serverStartTime = new Timestamp(serverTimeEstablished.serverTime._seconds - performance.now() - serverTimeOffsetSeconds, 0);

      console.log({
        serverTimeEstablished,
        serverTimeOffsetSeconds,
        serverStartTime,
      });

      initializeServerTimestampState({
        serverTimeEstablished,
        serverTimeOffsetSeconds,
        serverStartTime,
      });
    };

    triggerGetServerTime();
  }, []);

  return <></>;
};
