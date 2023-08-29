import { logger } from 'firebase-functions/v2';
import { DocumentReference, Timestamp } from 'firebase-admin/firestore';
import { CloudTasksClient } from '@google-cloud/tasks';
import { google } from '@google-cloud/tasks/build/protos/protos';
import ITask = google.cloud.tasks.v2.ITask;
import { https } from 'firebase-functions';
import { credentials } from '@grpc/grpc-js';
import { onRequest } from 'firebase-functions/v2/https';
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
  const isProd = process.env.NODE_ENV === 'production';

  const tasksClient = isProd ?
    new CloudTasksClient() : // PROD
    new CloudTasksClient({
      port: 8123,
      servicePath: 'localhost',
      sslCreds: credentials.createInsecure(),
    }); // DEV

  const queuePath: string = tasksClient.queuePath(
    CLOUD_TASK_QUEUE.PROJECT,
    CLOUD_TASK_QUEUE.LOCATION,
    CLOUD_TASK_QUEUE.QUEUE,
  );

  const url = isProd ?
    `https://${CLOUD_TASK_QUEUE.LOCATION}-${CLOUD_TASK_QUEUE.PROJECT}.cloudfunctions.net/gameEventQueueCallback` : // PROD
    'http://host.docker.internal:5001/outpost-odyssey-web/us-central1/gameEventQueueCallback'; // DEV

  const docPath = entityInstanceRef.path;
  const payload = { docPath };

  const task: ITask = {
    httpRequest: {
      httpMethod: 'POST',
      url,
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
    const response = await tasksClient.createTask({ parent: queuePath, task });
    logger.log('Task created and sent to gameEventQueue: ', response);
  } catch (e) {
    logger.error('Error creating task', e);
    throw new https.HttpsError('internal', 'Error creating task');
  }
};

export const gameEventQueueCallback = onRequest(async (req, res) => {
  const payload = req.body;
  try {
    const entityDocRef = await db.doc(payload.docPath);
    await entityDocRef.update({ isAvailable: true });

    res.send(200);
  } catch (error) {
    logger.error(error);

    res.status(500).send(error);
  }
});
