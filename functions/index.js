const admin = require('firebase-admin');
admin.initializeApp();
exports.db = admin.firestore();

// Player
const {createPlayer} = require('./src/player');
exports.createPlayer = createPlayer;

// Ship
const {purchaseShip} = require('./src/ships');
exports.purchaseShip = purchaseShip;
