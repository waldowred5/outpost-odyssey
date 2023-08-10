import { initializeApp } from 'firebase-admin/app';

initializeApp();

export { createPlayer } from './player';
export { purchaseShip } from './ship';
export { getServerTime } from './timer';
