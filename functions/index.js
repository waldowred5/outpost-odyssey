const functions = require('firebase-functions');
const { Timestamp } = require( 'firebase-admin/firestore');
const admin = require('firebase-admin');
admin.initializeApp();

const {checkForNewMarketplaceShips} = require('./ships');

exports.createPlayer = functions.auth.user().onCreate((user) => {
  const timestamp = Timestamp.now();

  return admin.firestore().collection('players').doc(user.uid).set({
    balance: 125000,
    email: user.email,
    uid: user.uid,
    createdAt: timestamp,
    updatedAt: timestamp,
  });
});

exports.checkForNewMarketplaceShips = checkForNewMarketplaceShips;
