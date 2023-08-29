import { useFunctions } from 'reactfire';
import { httpsCallable } from 'firebase/functions';
import { CLOUD_FUNCTION } from '../types/constants.ts';
import { useEffect } from 'react';
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
    if (signal.aborted) return;
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

    const controller = new AbortController();

    animationInterval({
      ms: 1000,
      signal: controller.signal,
      callback: (time) => {
        const newServerTime = new Timestamp(
          serverStartTime.seconds + (time / 1000),
          serverStartTime.nanoseconds + ((time % 1000) * 1000000)
        );

        updateCurrentServerTime(newServerTime);
      }
    });

    return () => {
      controller.abort();
    };
  }, [serverStartTime]);

  return <></>;
};
