import { onCall } from 'firebase-functions/v2/https';
import { Timestamp } from 'firebase-admin/firestore';
import { logger } from 'firebase-functions/v2';
import { https } from 'firebase-functions';

export const getServerTime = onCall(async (request) => {
  if (request.auth === undefined) {
    logger.log('Unauthenticated request');

    throw new https.HttpsError('unauthenticated', 'Unauthenticated request');
  }

  try {
    return {
      serverTime: Timestamp.now(),
    };
  } catch (e) {
    logger.error('Error getting server timestamp', e);
    throw new https.HttpsError('internal', 'Error getting server timestamp');
  }
});
