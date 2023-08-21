// import { create } from 'zustand';
// import { Timestamp } from 'firebase/firestore';
//
// export type GameEvent = {
//   availableAfter: Timestamp,
//   entityId: string,
//   eventType: string,
//   // eventId: string,
// }
//
// interface EventState {
//   gameEvents: {
//     [key: string]: GameEvent,
//   },
//
//   addGameEvent: (gameEvent: GameEvent) => void,
//   removeGameEvent: (gameEvent: GameEvent) => void,
//   sortGameEvents: () => void,
// }
//
// export default create<EventState>((set, get) => {
//     return {
//       gameEvents: {},
//
//       // Actions
//       addGameEvent: (gameEvent: GameEvent) => {
//         set(() => {
//           return {
//             gameEvents: {
//               ...get().gameEvents,
//               [`${gameEvent.availableAfter._seconds}:${gameEvent.entityId}`]: {
//                 availableAfter: gameEvent.availableAfter,
//                 eventType: 'EVENT_TYPE',
//                 // eventId: gameEvent.eventId,
//                 entityId: gameEvent.entityId,
//               },
//             },
//           };
//         });
//
//         // console.log('Game event added', get().gameEvents);
//
//         get().sortGameEvents();
//       },
//
//       removeGameEvent: (gameEvent: GameEvent) => {
//         set((state) => {
//           return {
//             gameEvents: Object.fromEntries(Object.entries(state.gameEvents).filter(key => key[0] !== `${gameEvent.availableAfter._seconds}:${gameEvent.entityId}`))
//           };
//         });
//
//         console.log('Game event removed', get().gameEvents);
//
//         // get().sortGameEvents(); // If we sort after every add, we don't need to sort here
//       },
//
//       sortGameEvents: () => {
//         console.log('Sorting game events...');
//
//         set(() => {
//           return {};
//         });
//
//         console.log('Game events sorted');
//       }
//     };
//   }
// )
// ;
