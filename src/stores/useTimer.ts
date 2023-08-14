import { create } from 'zustand';
import { Timestamp } from 'firebase/firestore';

export interface ServerTimestampState {
  serverTimeEstablished: Timestamp | null,
  serverTimeOffsetSeconds: number,
  serverStartTime: Timestamp | null,
}

interface TimerState {
  currentServerTime: Timestamp | null,
  serverTimeEstablished: Timestamp | null,
  serverTimeOffsetSeconds: number,
  serverStartTime: Timestamp | null,

  initializeServerTimestampState: (
    {
      serverTimeEstablished,
      serverTimeOffsetSeconds,
      serverStartTime
    }: ServerTimestampState) => void,
  updateCurrentServerTime: (currentServerTime: Timestamp) => void,
}

export default create<TimerState>((set, get) => {
    return {
      currentServerTime: null,
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
        set(() => {
          return {
            serverTimeEstablished,
            serverTimeOffsetSeconds,
            serverStartTime,
          };
        });
      },

      updateCurrentServerTime: (currentServerTime: Timestamp) => {
        set(() => {
          return {
            currentServerTime,
          };
        });
      }
    };
  }
)
;
