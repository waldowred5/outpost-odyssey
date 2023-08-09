const functions = require("firebase-functions");
const {Timestamp} = require("firebase-admin/firestore");
const {db} = require("../index");
const {FIRESTORE_COLLECTION} = require("./utils/constants");


exports.createPlayer = functions.auth.user().onCreate((user) => {
  try {
    const timestamp = Timestamp.now();

    db.collection(FIRESTORE_COLLECTION.PLAYERS).doc(user.uid).set({
      balance: 125000,
      email: user.email,
      uid: user.uid,
      createdAt: timestamp,
      updatedAt: timestamp,
    });
  } catch (e) {
    console.error('Error creating player', e);
  }
});
