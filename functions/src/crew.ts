import { onCall } from 'firebase-functions/v2/https';
import { logger } from 'firebase-functions/v2';
import { https } from 'firebase-functions';
import { db } from './db';
import { FIRESTORE_COLLECTION, CREW_ROLE } from '../../src/types/constants';
import { faker } from '@faker-js/faker';
import { Timestamp } from 'firebase-admin/firestore';
import { CrewMember } from '../../src/types/models';
import { addTaskToCloudTaskQueue } from './eventQueue';

const generateCrewMember = (): CrewMember => {
  return {
    availableAfter: null,
    isAvailable: true,
    firstName: `${faker.person.firstName()}`,
    lastName: `${faker.person.lastName()}`,
    employedBy: null,
    role: CREW_ROLE.PILOT,
    level: Math.floor(Math.random() * 3) + 1,
  };
};

export const addNewCrewMemberToTalentPool = onCall(async () => {
  const newCrewMember = generateCrewMember();

  await db.collection(FIRESTORE_COLLECTION.TALENT_POOL).add(newCrewMember);
});

export const hireCrewMember = onCall(async (request) => {
  if (request.auth === undefined) {
    logger.log('Unauthenticated request');

    throw new https.HttpsError('unauthenticated', 'Unauthenticated request');
  }

  const { uid } = request.auth;
  const { crewMemberId } = request.data;

  const purchasedAt = Timestamp.now();
  const availableAfter = new Timestamp(
    purchasedAt.seconds + 10,
    purchasedAt.nanoseconds
  );

  try {
    const userRef =
      db.collection(FIRESTORE_COLLECTION.PLAYERS).doc(uid);
    const userSnap = await userRef.get();
    const user = userSnap.data();

    if (user === undefined || user === null) {
      logger.log('User missing and is required to hire crew');

      return;
    }

    const talentPoolRef =
      db.collection(FIRESTORE_COLLECTION.TALENT_POOL).doc(crewMemberId);

    await userRef.collection(FIRESTORE_COLLECTION.CREW).add({
      ref: crewMemberId,
    });

    await talentPoolRef.update({
      availableAfter,
      employedBy: uid,
      isAvailable: false,
    });

    const randomNewCrewNumber =
      Math.floor(Math.random() * 4); // 0-3 new crew members

    for (let i = 0; i < randomNewCrewNumber; i++) {
      const newCrewMember = generateCrewMember();
      await db.collection(FIRESTORE_COLLECTION.TALENT_POOL).add(newCrewMember);
    }

    await addTaskToCloudTaskQueue({
      entityInstanceRef: talentPoolRef,
      availableAfter,
    });
  } catch (e) {
    logger.log('Error hiring crew', e);
    throw new https.HttpsError('internal', 'Error hiring crew');
  }
});
