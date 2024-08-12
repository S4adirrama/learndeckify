const admin = require('firebase-admin');

const serviceAccount = require('./learndeckify-firebase-adminsdk-xp4uo-57ab8e966a.json'); // Replace with the actual path to your service account key

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://learndeckify.firebaseio.com", 
  storageBucket: "learndeckify.appspot.com" 
});

const db = admin.firestore();
const auth = admin.auth();

module.exports = { auth, db };
