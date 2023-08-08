const {onCall} = require("firebase-functions/v2/https");
const {logger} = require("firebase-functions/v2");
const admin = require("firebase-admin");
const functions = require("firebase-functions");

const db = admin.firestore();

exports.purchaseShip = onCall(async (request) => {
  const { shipClass } = request.data
  const { uid } = request.auth;

  logger.log('The user id is: ', uid);

  const userRef = db.collection('players').doc(uid);
  const shipRef = db.collection('shipBlueprints').doc(shipClass);

  try {
    const userSnap = await userRef.get();
    const user = userSnap.data();

    const shipSnap = await shipRef.get();
    const ship = shipSnap.data();

    if (ship.price > user.balance) {
      logger.log('Insufficient funds');

      return;
    }

    await userRef.update({
      balance: user.balance - ship.price,
    });
    await userRef.collection('ships').add({ ship });

    return {
      uid,
      message: `Purchased ${ship.name} for ${ship.price} credits`,
    };
  } catch (e) {
    logger.error('Error purchasing ship', e);
    throw new functions.https.HttpsError('internal', 'Error purchasing ship');
  }
});
