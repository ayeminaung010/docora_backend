import admin from "firebase-admin"
import 'dotenv/config';

const firebaseCredentials  = {
    projectId : process.env.FIREBASE_PROJECT_ID,
    clientEmail : process.env.FIREBASE_CLIENT_EMAIL,
    privateKey : process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n') // Ensure newlines are correctly formatted
}

admin.initializeApp({
    credential: admin.credential.cert(firebaseCredentials),
    storageBucket: `${process.env.FIREBASE_PROJECT_ID}.appspot.com`
})

console.log('Firebase Admin SDK initialized successfully.');

export const storage = admin.storage(); // to store images& files
export default admin;