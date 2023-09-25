import { onCall } from 'firebase-functions/v2/https';
import { logger } from 'firebase-functions/v2';
import { https } from 'firebase-functions';
import { db } from './db';
import { FIRESTORE_COLLECTION } from '../../src/types/constants';
import { Timestamp } from 'firebase-admin/firestore';
import { addTaskToCloudTaskQueue } from './eventQueue';
import { Ship } from '../../src/types/models';
import { SHIP_CLASS, SHIP_CLASS_MAP } from '../../src/types/shipTypes';

export const purchaseShip = onCall(
  async (request) => {
    if (request.auth === undefined) {
      logger.log('Unauthenticated request');
      throw new https.HttpsError('unauthenticated', 'Unauthenticated request');
    }

    const { shipClass } = request.data;
    const { uid } = request.auth;

    const noValidShipClasses =
      Object.values(SHIP_CLASS).filter((s) => s === shipClass).length === 0;

    if (noValidShipClasses) {
      logger.log('Invalid ship class');

      return;
    }

    const userRef =
      db.collection(FIRESTORE_COLLECTION.PLAYERS).doc(uid);

    try {
      const userSnap = await userRef.get();
      const user = userSnap.data();

      if (user === undefined || user === null) {
        logger.log('User missing and is required to purchase ship');

        return;
      }

      const shipClassData = SHIP_CLASS_MAP[shipClass];
      const price = shipClassData.price;
      const purchasedAt = Timestamp.now();
      const availableAfter = new Timestamp(
        purchasedAt.seconds + 10,
        purchasedAt.nanoseconds
      );

      if (price > user.balance) {
        logger.log('Insufficient funds');

        return;
      }

      const ship: Ship = {
        price,
        className: shipClass,
        fuelCapacity: shipClassData.fuelCapacity,
        fuelCurrent: 0,
        hullCapacity: shipClassData.hullCapacity,
        hullCurrent: shipClassData.hullCapacity,
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
