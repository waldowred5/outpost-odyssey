import { useFunctions } from 'reactfire';
import { httpsCallable } from 'firebase/functions';
import { CLOUD_FUNCTION } from '../utils/constants.ts';
import { useEffect } from 'react';
import useTimer from '../stores/useTimer.ts';
import { Timestamp } from 'firebase/firestore';
import { shallow } from 'zustand/shallow';
import useEvent from '../stores/useEvent.ts';
import { emitter } from '../utils/emitter.ts';

export const Timers = () => {
  const functions = useFunctions();
  const getServerTime = httpsCallable<void, Timestamp>(functions, CLOUD_FUNCTION.GET_SERVER_TIME);
  const refreshTalentPool = httpsCallable<void, Timestamp>(functions, CLOUD_FUNCTION.REFRESH_TALENT_POOL);
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
  const {
    gameEvents,
  } = useEvent((state) => {
    return {
      gameEvents: state.gameEvents,
    };
  }, shallow);

  useEffect(() => {
    const triggerGetServerTime = async () => {
      await refreshTalentPool(); // haha!
      const serverTimeEstablishedRequest = await getServerTime();
      const serverTimeEstablished = serverTimeEstablishedRequest.data;
      const serverTimeOffsetSeconds = serverTimeEstablished.serverTime._seconds - performance.timeOrigin / 1000;
      const estimatedServerStartTime = new Timestamp(serverTimeEstablished.serverTime._seconds - serverTimeOffsetSeconds, 0);

      // console.log({
      //   serverTimeEstablished,
      //   serverTimeOffsetSeconds,
      //   serverStartTime: estimatedServerStartTime,
      // });

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

      // check if there are any completed events that need removing from eventStore
      if (Object.entries(gameEvents).length === 0) {
        return;
      }

      const nextGameEvent = Object.entries(gameEvents)[0];
      const nextGameEventAvailableAfter = nextGameEvent[1].availableAfter;

      if (currentServerTime.seconds >= nextGameEventAvailableAfter._seconds) {
        console.log('Remove ship event emitted for', `PURCHASE_SHIP:${nextGameEvent[1].entityId}`);
        emitter.emit(`PURCHASE_SHIP:${nextGameEvent[1].entityId}`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [serverStartTime, gameEvents]);

  return <></>;
};
