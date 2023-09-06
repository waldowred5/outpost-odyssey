import { useFunctions } from 'reactfire';
import { httpsCallable } from 'firebase/functions';
import { CLOUD_FUNCTION } from '../types/constants.ts';
import { useEffect, useState } from 'react';
import useTimer from '../stores/useTimer.ts';
import { Timestamp } from 'firebase/firestore';
import { shallow } from 'zustand/shallow';

interface AnimationIntervalProps {
  ms: number,
  signal: AbortSignal,
  callback: (time: number) => void,
}

const animationInterval = ({ ms, signal, callback }: AnimationIntervalProps) => {
  const start = performance.now();

  const frame = (time: number) => {
    if (signal.aborted) {
      return;
    }

    callback(time);
    scheduleFrame(time);
  };

  const scheduleFrame = (time: number) => {
    const elapsed = time - start;
    const roundedElapsed = Math.round(elapsed / ms) * ms;
    const targetNext = start + roundedElapsed + ms;
    const delay = targetNext - performance.now();
    setTimeout(() => requestAnimationFrame(frame), delay);
  };

  scheduleFrame(start);
};

export const Timers = () => {
  const functions = useFunctions();
  const getServerTime = httpsCallable<void, Timestamp>(functions, CLOUD_FUNCTION.GET_SERVER_TIME);
  const {
    currentServerTime,
    serverStartTime,
    initializeServerTimestampState,
    // resetServerTimestampState,
    updateCurrentServerTime,
  } = useTimer((state) => {
    return {
      currentServerTime: state.currentServerTime,
      serverStartTime: state.serverStartTime,
      initializeServerTimestampState: state.initializeServerTimestampState,
      resetServerTimestampState: state.resetServerTimestampState,
      updateCurrentServerTime: state.updateCurrentServerTime,
    };
  }, shallow);

  const [abortController, setAbortController] = useState(new AbortController());

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

  useEffect(() => {
    if (!serverStartTime) {
      console.log('No server start time established yet...');

      triggerGetServerTime();

      return;
    }

    console.log('Server start time established!');

    setAbortController(new AbortController());

    animationInterval({
      ms: 1000,
      signal: abortController.signal,
      callback: (time) => {
        const newServerTime = new Timestamp(
          serverStartTime.seconds + (time / 1000),
          serverStartTime.nanoseconds + ((time % 1000) * 1000000)
        );

        updateCurrentServerTime(newServerTime);
      }
    });

    return () => {
      abortController.abort();
    };
  }, [serverStartTime]);

  useEffect(() => {
    if (!serverStartTime || !currentServerTime) {
      return;
    }

    const serverTimeDrift = currentServerTime.toMillis() - Date.now();
    if (Math.abs(serverTimeDrift) < 1000) {
      return;
    }

    console.log('Server time drift detected!');

    // TODO: This is a hack to reset the server time. It should be done in a more elegant way.
    location.reload();
    // resetServerTimestampState();
    // console.log('Server time reset!');
  }, [currentServerTime]);

  return <></>;
};
