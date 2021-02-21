import React, { useContext, useEffect, useState } from 'react'
import { FirebaseContext } from '../Firebase';
import Logout from '../Logout';
import Quiz from '../Quiz';
import Loader from '../Loader';


const Welcome = ({ history }) => {

    const firebase = useContext(FirebaseContext)
    const [userSession, setUserSession] = useState(null)
    const [userData, setUserData] = useState({})

    useEffect(() => {

        let listener = firebase.auth.onAuthStateChanged(user => {
            user ? setUserSession(user) : history.push('/')
        })

        // Si on trouve un user au montage
        if (userSession !== null) {
            // fetch user
            firebase.findUser(userSession.uid)
                .get()
                .then((doc) => {
                    if (doc && doc.exists) {
                        const myData = doc.data()
                        setUserData(myData)
                    }
                })
                .catch((error) => {
                    console.log(error);
                })

        }

        return () => {
            //stop listener
            listener()
        }
    }, [firebase, history, userSession])

    return userSession === null ?
        <>
            <Loader
                loadingMsg={'Authentification...'}
                styling={{ textAlign: 'center', color: '#fff' }}
            />
        </>
        :
        <div className="quiz-bg">
            <div className="container">
                <Logout />
                <Quiz userData={userData} />
            </div>
        </div>
}

export default Welcome
