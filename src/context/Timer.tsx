// import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
// import { Timestamp } from 'firebase/firestore';
// import { useFunctions, useUser } from 'reactfire';
// import { httpsCallable } from 'firebase/functions';
// import { CLOUD_FUNCTION } from '../utils/constants.ts';
// // import useTimer from '../stores/useTimer.ts';
//
// export interface TimerProviderProps {
//   children?: ReactNode
// }
//
// // interface ServerTimestampState {
// //   serverTimeEstablished: Timestamp | null,
// //   serverTimeOffsetSeconds: number,
// //   serverStartTime: Timestamp | null,
// // }
//
// interface TimerContextModel {
//   // serverTimeEstablished: Timestamp | null,
//   // serverTimeOffsetSeconds: number,
//   currentServerTime: Timestamp | null,
//   serverStartTime: Timestamp | null,
//   // initializeServerTimestampState: (
//   //   {
//   //     serverTimeEstablished,
//   //     serverTimeOffsetSeconds,
//   //     serverStartTime
//   //   }: ServerTimestampState) => void,
// }
//
// export const TimerContext = createContext<TimerContextModel>(
//   {} as TimerContextModel,
// );
//
// export const TimerContextProvider = ({ children }: TimerProviderProps) => {
//   const { data: signedInUser } = useUser();
//   const functions = useFunctions();
//   const getServerTime = httpsCallable<void, Timestamp>(functions, CLOUD_FUNCTION.GET_SERVER_TIME);
//   // const initializeServerTimestampState = useTimer((state) => state.initializeServerTimestampState);
//
//   const [serverStartTime, setServerStartTime] = useState<Timestamp | null>(null);
//   const [currentServerTime, setCurrentServerTime] = useState<Timestamp | null>(null);
//
//   useEffect(() => {
//     if (!signedInUser) {
//       return;
//     }
//
//     const triggerGetServerTime = async () => {
//       const serverTimeEstablishedRequest = await getServerTime();
//       const serverTimeEstablished = serverTimeEstablishedRequest.data;
//       const serverTimeOffsetSeconds = serverTimeEstablished.serverTime._seconds - performance.timeOrigin / 1000;
//       const estimatedServerStartTime = new Timestamp(serverTimeEstablished.serverTime._seconds - serverTimeOffsetSeconds, 0);
//
//       console.log({
//         serverTimeEstablished,
//         serverTimeOffsetSeconds,
//         serverStartTime,
//       });
//
//       // initializeServerTimestampState({
//       //   serverTimeEstablished,
//       //   serverTimeOffsetSeconds,
//       //   serverStartTime,
//       // });
//
//       setServerStartTime(estimatedServerStartTime);
//     };
//
//     triggerGetServerTime();
//   }, [signedInUser]);
//
//   useEffect(() => {
//     if (!serverStartTime) {
//       return;
//     }
//
//     const interval = setInterval(() => {
//       setCurrentServerTime(
//         new Timestamp(
//           serverStartTime.seconds + (performance.now() / 1000),
//           serverStartTime.nanoseconds + ((performance.now() % 1000) * 1000000)
//         )
//       );
//     }, 1000);
//
//     return () => clearInterval(interval);
//   }, [serverStartTime]);
//
//   return (
//     <TimerContext.Provider value={{ serverStartTime, currentServerTime }}>
//       {children}
//     </TimerContext.Provider>
//   );
// };
//
// export const useTimer = (): TimerContextModel => {
//   return useContext(TimerContext);
// };
