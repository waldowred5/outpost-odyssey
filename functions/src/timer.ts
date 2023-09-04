import { onCall } from 'firebase-functions/v2/https';
import { logger } from 'firebase-functions/v2';
import { https } from 'firebase-functions';
import { Timestamp } from 'firebase/firestore';

export const getServerTime = onCall(async (request) => {
  if (request.auth === undefined) {
    logger.log('Unauthenticated request');
    throw new https.HttpsError('unauthenticated', 'Unauthenticated request');
  }

  try {
    return Timestamp.now();
  } catch (e) {
    logger.error('Error getting server timestamp', e);
    throw new https.HttpsError('internal', 'Error getting server timestamp');
  }
});
