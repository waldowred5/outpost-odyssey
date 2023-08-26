import { logger } from 'firebase-functions/v2';
import { DocumentReference, Timestamp } from 'firebase-admin/firestore';
import { CloudTasksClient } from '@google-cloud/tasks';
import { google } from '@google-cloud/tasks/build/protos/protos';
import ITask = google.cloud.tasks.v2.ITask;
import { https } from 'firebase-functions';
import { credentials } from '@grpc/grpc-js';
import { onCall, onRequest } from 'firebase-functions/v2/https';
import { db } from './db';

interface IAddTaskToCloudTaskQueue {
  entityInstanceRef: DocumentReference,
  availableAfter: Timestamp,
}

const CLOUD_TASK_QUEUE = {
  PROJECT: 'outpost-odyssey-web',
  LOCATION: 'us-central1',
  QUEUE: 'gameEventQueue',
};

export const addTaskToCloudTaskQueue = async (
  {
    entityInstanceRef,
    availableAfter,
  }: IAddTaskToCloudTaskQueue
) => {
  // TODO: Dynamically switch between emulator and production
  // const tasksClient = new CloudTasksClient(); // PROD
  // const parent = 'projects/outpost-odyssey-web/locations/us-central1';
  const tasksClient = new CloudTasksClient({
    port: 8123,
    servicePath: 'localhost',
    sslCreds: credentials.createInsecure(),
  }); // DEV
  // await tasksClient.createQueue({
  //   parent,
  //   queue: { name: `${parent}/queues/gameEventQueue` },
  // }); // DEV

  const queuePath: string = tasksClient.queuePath(
    CLOUD_TASK_QUEUE.PROJECT,
    CLOUD_TASK_QUEUE.LOCATION,
    CLOUD_TASK_QUEUE.QUEUE,
  );

  console.log('queuePath', queuePath);

  // const url = `http://localhost:5001/${CLOUD_TASK_QUEUE.LOCATION}-${CLOUD_TASK_QUEUE.PROJECT}.cloudfunctions.net/gameEventQueueCallback`;
  // const url = `https://${CLOUD_TASK_QUEUE.LOCATION}-${CLOUD_TASK_QUEUE.PROJECT}.cloudfunctions.net/gameEventQueueCallback`;
  // const x = 'https://us-central1-outpost-odyssey-web.cloudfunctions.net/gameEventQueueCallback';
  const url = 'http://host.docker.internal:5001/outpost-odyssey-web/us-central1/gameEventQueueCallback';
  const docPath = entityInstanceRef.path;
  // const payload =
  //   'players/Ummn7IHU4uFub6qNvGrKxUxZNt0f/ships/0m8oaqm16Dz4IM2d5Zme';
  const payload = { docPath };

  console.log('payload', payload);

  const task: ITask = {
    httpRequest: {
      httpMethod: 'POST',
      url,
      // body: Buffer.from(JSON.stringify('players/Ummn7IHU4uFub6qNvGrKxUxZNt0f/ships/jnqc1vkNZ09yZk4nXzVc')).toString('base64'),
      body: Buffer.from(JSON.stringify(payload)).toString('base64'),
      headers: {
        'Content-Type': 'application/json',
      },
    },
    scheduleTime: {
      seconds: availableAfter.seconds,
      nanos: availableAfter.nanoseconds,
    },
  };

  try {
    // const response = await tasksClient.createTask({
    //   parent: queuePath,
    //   task: { httpRequest: { httpMethod: 'GET', url: 'https://www.google.com' } },
    // });
    const response = await tasksClient.createTask({ parent: queuePath, task });
    logger.log('Created task: ', response);
  } catch (e) {
    logger.error('Error creating task', e);
    throw new https.HttpsError('internal', 'Error creating task');
  }
};

/*
TODO: Strip out onCall trigger and use onRequest instead
      (remove onCall trigger in FE as well)
*/
export const gameEventQueueCallbackManual = onCall(async (req) => {
  const payload = req.data;
  try {
    logger.log('Received game event queue callback', payload);

    const entityDocRef = await db.doc(payload.docPath);
    await entityDocRef.update({ isAvailable: true });

    return {
      entityDocRef,
    };
  } catch (error) {
    logger.error(error);
    throw new https.HttpsError(
      'internal',
      'Error running game event queue callback'
    );
  }
});

export const gameEventQueueCallback = onRequest(async (req, res) => {
  const payload = req.body;
  try {
    const entityDocRef = await db.doc(payload.docPath);
    logger.log('entityDocRef', entityDocRef);
    await entityDocRef.update({ isAvailable: true });

    res.send(200);
  } catch (error) {
    logger.error(error);
    res.status(500).send(error);
  }
});
