import { initializeApp } from 'firebase-admin/app';

initializeApp();

export { createPlayer } from './player';
export { purchaseShip, gameEventQueueCallback } from './ship';
export { getServerTime } from './timer';
