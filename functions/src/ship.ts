import { onCall } from 'firebase-functions/v2/https';
import { logger } from 'firebase-functions/v2';
import { https } from 'firebase-functions';
import { db } from './db';
import { FIRESTORE_COLLECTION } from '../../src/utils/constants';
import { Timestamp } from 'firebase-admin/firestore';

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

    const shipSnap = await shipRef.get();
    const shipData = shipSnap.data();

    const purchasedAt = Timestamp.now();
    const availableAfter = new Timestamp(
      purchasedAt.seconds + 10,
      purchasedAt.nanoseconds
    );

    const ship: any = {
      ...shipData,
      purchasedAt,
      availableAfter,
    };

    if (user === undefined || ship === undefined) {
      logger.log('User or ship not found');

      return;
    }

    if (ship.price > user.balance) {
      logger.log('Insufficient funds');

      return;
    }

    await userRef.update({ balance: user.balance - ship.price });
    const shipInstanceRef = await userRef.collection('ships').add(ship);

    return {
      uid,
      message: `Purchased ${shipInstanceRef.id} for ${ship.price} credits`,
      shipId: shipInstanceRef.id,
      availableAfter,
    };
  } catch (e) {
    logger.error('Error purchasing ship', e);
    throw new https.HttpsError('internal', 'Error purchasing ship');
  }
});
