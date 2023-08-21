import { logger } from 'firebase-functions/v2';
import { DocumentReference, Timestamp } from 'firebase-admin/firestore';
import { CloudTasksClient } from '@google-cloud/tasks';
import { google } from '@google-cloud/tasks/build/protos/protos';
import ITask = google.cloud.tasks.v2.ITask;
import { https } from 'firebase-functions';

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
  const tasksClient = new CloudTasksClient();
  const queuePath: string = tasksClient.queuePath(
    CLOUD_TASK_QUEUE.PROJECT,
    CLOUD_TASK_QUEUE.LOCATION,
    CLOUD_TASK_QUEUE.QUEUE,
  );

  const url = `https://${CLOUD_TASK_QUEUE.LOCATION}-${CLOUD_TASK_QUEUE.PROJECT}.cloudfunctions.net/gameEventQueueCallback`;
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
    },
  };

  try {
    const response = await tasksClient.createTask({ parent: queuePath, task });
    logger.log('Created task: ', response);
  } catch (e) {
    logger.error('Error creating task', e);
    throw new https.HttpsError('internal', 'Error creating task');
  }
};
