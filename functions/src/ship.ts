import { onCall } from 'firebase-functions/v2/https';
import { logger } from 'firebase-functions/v2';
import { https } from 'firebase-functions';
import { db } from './db';
import { FIRESTORE_COLLECTION } from '../../src/types/constants';
import { Timestamp } from 'firebase-admin/firestore';
import { addTaskToCloudTaskQueue } from './eventQueue';
import { Ship, ShipBlueprint } from '../../src/types/models';

export const purchaseShip = onCall(async (request) => {
  if (request.auth === undefined) {
    logger.log('Unauthenticated request');
    throw new https.HttpsError('unauthenticated', 'Unauthenticated request');
  }

  const { shipClass } = request.data;
  const { uid } = request.auth;

  const userRef =
    db.collection(FIRESTORE_COLLECTION.PLAYERS).doc(uid);
  const shipRef =
    db.collection(FIRESTORE_COLLECTION.SHIP_CLASSES).doc(shipClass);

  try {
    const userSnap = await userRef.get();
    const user = userSnap.data();

    if (user === undefined) {
      logger.log('User not found');

      return;
    }

    const shipSnap = await shipRef.get();
    const shipData = shipSnap.data() as ShipBlueprint;

    if (shipData.price > user.balance) {
      logger.log('Insufficient funds');

      return;
    }

    const purchasedAt = Timestamp.now();
    const availableAfter = new Timestamp(
      purchasedAt.seconds + 10,
      purchasedAt.nanoseconds
    );

    const ship: Ship = {
      ...shipData,
      purchasedAt,
      availableAfter,
      isAvailable: false,
    };

    await userRef.update({ balance: user.balance - ship.price });
    const shipInstanceRef = await userRef.collection('ships').add(ship);

    await addTaskToCloudTaskQueue({
      entityInstanceRef: shipInstanceRef,
      availableAfter,
    });
  } catch (e) {
    logger.error('Error purchasing ship', e);
    throw new https.HttpsError('internal', 'Error purchasing ship');
  }
});
