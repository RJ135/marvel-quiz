import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

// Your web app's Firebase configuration
const config = {
    apiKey: "AIzaSyAQh9U2OfeAv136yNSFWEIptceSRKTU0ss",
    authDomain: "marvel-quiz-b6483.firebaseapp.com",
    projectId: "marvel-quiz-b6483",
    storageBucket: "marvel-quiz-b6483.appspot.com",
    messagingSenderId: "119161008589",
    appId: "1:119161008589:web:ed92557fb638cff1a2d484"
};

class Firebase {
    constructor() {
        app.initializeApp(config)
        this.auth = app.auth()
        this.db = app.firestore()
    }

    // Inscription
    signupUser = (email, password) => this.auth.createUserWithEmailAndPassword(email, password)

    // Connection
    loginUser = (email, password) => this.auth.signInWithEmailAndPassword(email, password)

    // Déconnection
    signoutUser = () => this.auth.signOut()

    // Récupération mot de passe oublié
    passwordReset = email => this.auth.sendPasswordResetEmail(email)

    // Récupération infos user via un référence 
    findUser = (userid) => this.db.doc(`user/${userid}`)

}

export default Firebase;

