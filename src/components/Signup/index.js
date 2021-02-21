import React, { useContext, useState } from 'react'
import { FirebaseContext } from '../Firebase'
import { Link } from 'react-router-dom';

const Signup = ({ history }) => {


    const firebase = useContext(FirebaseContext)

    const data = {
        pseudo: '',
        email: '',
        password: '',
        confirmPassword: ''
    }

    const [loginData, setLoginData] = useState(data)
    const [error, setError] = useState('')

    const { pseudo, email, password, confirmPassword } = loginData

    // on recupère les data
    const handleChange = (e) => {
        setLoginData({ ...loginData, [e.target.id]: e.target.value })
    }

    // gestion submit du form
    const handleSubmit = (e) => {
        e.preventDefault()
        const { pseudo, email, password } = loginData
        firebase.signupUser(email, password)
            .then((authUser) => {
                console.log(authUser);
                return firebase.findUser(authUser.user.uid).set({
                    pseudo,
                    email
                })
            })
            .then(() => {
                // Les data entrées sont vidées
                setLoginData({ ...data })
                // puis redirection
                history.push('/welcome')

            })
            .catch(error => {
                setError(error)
                setLoginData({ ...data })
            })
    }

    // gestion erreurs
    const errorMsg = error !== '' && <span> {error.message} </span>


    // gestion affiche button inscription
    const btnInscription = pseudo === '' || email === '' || password === '' || password !== confirmPassword ?
        <button disabled>Inscription</button> : <button > Inscription</button>


    return (
        <div className="signUpLoginBox">
            <div className="slContainer">

                {/* BACKGROUND IMG IRONMAN */}
                <div className="formBoxLeftSignup">
                </div>

                <div className="formBoxRight">
                    <div className="formContent">
                        {errorMsg}
                        <h2>Inscription</h2>

                        {/* FORMULAIRE INSCRIPTION*/}
                        <form onSubmit={handleSubmit}>
                            <div className="inputBox">
                                <input onChange={handleChange} value={pseudo} type="text" id="pseudo" autoComplete="off" required />
                                <label htmlFor="pseudo">Pseudo</label>
                            </div>

                            <div className="inputBox">
                                <input onChange={handleChange} value={email} type="email" id="email" autoComplete="off" required />
                                <label htmlFor="email">Email</label>
                            </div>

                            <div className="inputBox">
                                <input onChange={handleChange} value={password} type="password" id="password" autoComplete="off" required />
                                <label htmlFor="password">Mot de passe</label>
                            </div>
                            <div className="inputBox">
                                <input onChange={handleChange} value={confirmPassword} type="password" id="confirmPassword" autoComplete="off" required />
                                <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
                            </div>
                            {btnInscription}
                        </form>

                        <div className="linkContainer">
                            <Link className="simpleLink" to="/login">Déjà inscrit ? Connectez-vous.</Link>
                        </div>


                    </div>
                </div>
            </div>
        </div>
    )
}

export default Signup
