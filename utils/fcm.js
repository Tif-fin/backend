const firebaseadmin = require("firebase-admin");
const serviceAccount = require('./tiffin-d1302-firebase-adminsdk-kk25g-eca6b98a5e.json');
firebaseadmin.initializeApp({
    credential: firebaseadmin.credential.cert(serviceAccount),
});
module.exports = firebaseadmin;