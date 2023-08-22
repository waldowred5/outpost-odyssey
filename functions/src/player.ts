import { auth } from 'firebase-functions';
import { Timestamp } from 'firebase-admin/firestore';
import { db } from './db';
import { FIRESTORE_COLLECTION } from '../../src/types/constants';

export const createPlayer = auth.user().onCreate((user) => {
  try {
    const timestamp = Timestamp.now();

    db.collection(FIRESTORE_COLLECTION.PLAYERS).doc(user.uid).set({
      balance: 125000,
      email: user.email,
      uid: user.uid,
      createdAt: timestamp,
      updatedAt: timestamp,
    });
  } catch (e) {
    console.error('Error creating player', e);
  }
});
