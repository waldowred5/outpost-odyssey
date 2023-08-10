import { create } from 'zustand';
import { Timestamp } from 'firebase/firestore';

export interface ServerTimestampState {
  serverTimeEstablished: Timestamp | null,
  serverTimeOffsetSeconds: number,
  serverStartTime: Timestamp | null,
}

interface TimerState {
  serverTimeEstablished: Timestamp | null,
  serverTimeOffsetSeconds: number,
  serverStartTime: Timestamp | null,
  initializeServerTimestampState: (
    {
      serverTimeEstablished,
      serverTimeOffsetSeconds,
      serverStartTime
    }: ServerTimestampState) => void,
}

export default create<TimerState>(() => {
  return {
    serverTimeEstablished: null,
    serverTimeOffsetSeconds: 0,
    serverStartTime: null,

    // Actions
    initializeServerTimestampState: (
      {
        serverTimeEstablished,
        serverTimeOffsetSeconds,
        serverStartTime,
      }: ServerTimestampState) => {
      return {
        serverTimeEstablished,
        serverTimeOffsetSeconds,
        serverStartTime,
      };
    }
  };
});
