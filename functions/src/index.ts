import { initializeApp } from 'firebase-admin/app';

initializeApp();

export { createPlayer } from './player';
export { purchaseShip } from './ship';
export { addNewCrewMemberToTalentPool, hireCrewMember } from './crew';
export { getServerTime } from './timer';
export { gameEventQueueCallback } from './eventQueue';
