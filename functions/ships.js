const {onCall} = require("firebase-functions/v2/https");
const {logger} = require("firebase-functions/v2");
const admin = require("firebase-admin");
const functions = require("firebase-functions");

// exports.createMarketplaceShips = onCall()

const db = admin.firestore();

exports.checkForNewMarketplaceShips = onCall(async (request) => {
  const { message } = request.data
  const { uid } = request.auth;

  logger.log('The user id is: ', uid);
  logger.log('The user message is: ', message);

  const userRef = db.collection('players').doc(uid);

  try {
    const userSnap = await userRef.get();
    const user = userSnap.data();

    logger.log('The user doc is: ', user);

    return {
      uid,
      user,
      message,
    };
  } catch (e) {
    logger.error('Error fetching user document', e);
    throw new functions.https.HttpsError('internal', 'Error fetching user document');
  }
});
