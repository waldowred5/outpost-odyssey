const {onCall} = require("firebase-functions/v2/https");
const {logger} = require("firebase-functions/v2");
const functions = require("firebase-functions");
const {db} = require("../index");
const {FIRESTORE_COLLECTION} = require("./utils/constants");

exports.purchaseShip = onCall(async (request) => {
  const { shipClass } = request.data
  const { uid } = request.auth;

  const userRef = db.collection(FIRESTORE_COLLECTION.PLAYERS).doc(uid);
  const shipRef = db.collection(FIRESTORE_COLLECTION.SHIP_CLASSES).doc(shipClass);

  try {
    const userSnap = await userRef.get();
    const user = userSnap.data();

    const shipSnap = await shipRef.get();
    const ship = shipSnap.data();

    if (ship.price > user.balance) {
      logger.log('Insufficient funds');

      return;
    }

    await Promise.all([
      userRef.update({
        balance: user.balance - ship.price,
      }),
      userRef.collection('ships').add(ship),
    ])

    return {
      uid,
      message: `Purchased ${ship.name} for ${ship.price} credits`,
    };
  } catch (e) {
    logger.error('Error purchasing ship', e);
    throw new functions.https.HttpsError('internal', 'Error purchasing ship');
  }
});
