import { onCall } from 'firebase-functions/v2/https';
import { logger } from 'firebase-functions/v2';
import { https } from 'firebase-functions';
import { db } from './db';
import { FIRESTORE_COLLECTION } from '../../src/utils/constants';
import { faker } from '@faker-js/faker';
import { Timestamp } from 'firebase-admin/firestore';


const TALENT_POOL_SIZE = 3;


type CrewMember = {
  name: string,
  profession: string,
  cut: number,
}


const generateCrewMember = (): CrewMember => {
  return {
    name: `${faker.person.firstName()} ${faker.person.lastName()}`,
    profession: 'Pilot',
    cut: Math.floor((Math.random() * 29) + 1),
  };
};

export const refreshTalentPool = onCall(async (request) => {
  if (request.auth === undefined) {
    logger.log('Unauthenticated request');

    throw new https.HttpsError('unauthenticated', 'Unauthenticated request');
  }

  try {
    const batch = db.batch();
    (await db.collection(FIRESTORE_COLLECTION.TALENT_POOL).listDocuments())
      .forEach((document) => batch.delete(document));

    db.collection(FIRESTORE_COLLECTION.TALENT_POOL).doc();
    const documentRef = db.collection(FIRESTORE_COLLECTION.TALENT_POOL).doc();

    Array.from({ length: TALENT_POOL_SIZE }).forEach(() =>
      batch.set(
        documentRef,
        generateCrewMember(),
      )
    );

    await batch.commit();

    return {
      message: 'success',
    };
  } catch (e) {
    logger.error('Error getting server timestamp', e);
    throw new https.HttpsError('internal', 'Error getting server timestamp');
  }
});


export const hireCrewMember = onCall(async (request) => {
  if (request.auth === undefined) {
    logger.log('Unauthenticated request');

    throw new https.HttpsError('unauthenticated', 'Unauthenticated request');
  }

  const { talentPoolId } = request.data;
  const { uid } = request.auth;

  if (!talentPoolId || !uid) {
    logger.log('User or crew member not found');

    return {
      message: 'User or crew member not found',
    };
  }

  const purchasedAt = Timestamp.now();
  const availableAfter = new Timestamp(
    purchasedAt.seconds + 10,
    purchasedAt.nanoseconds
  );

  const userRef =
    db.collection(FIRESTORE_COLLECTION.PLAYERS).doc(uid);

  const talentPoolRef =
    db.collection(FIRESTORE_COLLECTION.TALENT_POOL).doc(talentPoolId);
  const crewMember =
    (await talentPoolRef.get()).data() as { name: string, cut: number };

  const crewRef = await userRef.collection('crew').add({
    ...crewMember,
    purchasedAt,
    availableAfter,
  });

  await talentPoolRef.delete();

  return {
    uid,
    message: `Hired ${crewMember.name}`,
    crewId: crewRef.id,
    availableAfter,
  };
});
