import { useFunctions } from 'reactfire';
import { httpsCallable } from 'firebase/functions';
import { CLOUD_FUNCTION } from '../types/constants.ts';
import { useEffect } from 'react';
import useTimer from '../stores/useTimer.ts';
import { Timestamp } from 'firebase/firestore';
import { shallow } from 'zustand/shallow';

export const Timers = () => {
  const functions = useFunctions();
  const getServerTime = httpsCallable<void, Timestamp>(functions, CLOUD_FUNCTION.GET_SERVER_TIME);
  const {
    serverStartTime,
    initializeServerTimestampState,
    updateCurrentServerTime,
  } = useTimer((state) => {
    return {
      serverStartTime: state.serverStartTime,
      initializeServerTimestampState: state.initializeServerTimestampState,
      updateCurrentServerTime: state.updateCurrentServerTime,
    };
  }, shallow);

  useEffect(() => {
    const triggerGetServerTime = async () => {
      const serverTimeEstablishedRequest = await getServerTime();
      const serverTimeEstablished = serverTimeEstablishedRequest.data;
      const serverTimeOffsetSeconds = serverTimeEstablished.seconds - performance.timeOrigin / 1000;
      const estimatedServerStartTime = new Timestamp(serverTimeEstablished.seconds - serverTimeOffsetSeconds, 0);

      initializeServerTimestampState({
        serverTimeEstablished,
        serverTimeOffsetSeconds,
        serverStartTime: estimatedServerStartTime,
      });
    };

    triggerGetServerTime();
  }, []);

  useEffect(() => {
    if (!serverStartTime) {
      console.log('No server start time established yet...');

      return;
    }

    console.log('Server start time established!');

    const interval = setInterval(() => {
      const currentServerTime = new Timestamp(
        serverStartTime.seconds + (performance.now() / 1000),
        serverStartTime.nanoseconds + ((performance.now() % 1000) * 1000000)
      );

      updateCurrentServerTime(currentServerTime);
    }, 1000);

    return () => clearInterval(interval);
  }, [serverStartTime]);

  return <></>;
};
