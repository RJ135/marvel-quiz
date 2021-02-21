import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom';
import { FirebaseContext } from '../Firebase';


const ForgetPassword = ({ history }) => {

    const firebase = useContext(FirebaseContext)
    const [email, setEmail] = useState('')
    const [success, setSuccess] = useState(null)
    const [error, setError] = useState(null)

    const handleSubmit = (event) => {
        event.preventDefault()

        firebase.passwordReset(email)
            .then(() => {
                // pour ne pas afficher l'ancien msg d'erreur (si erreur )on vide a variable error
                setError(null)
                setSuccess(`Consultez votre adresse email ${email} pour changer le mot de passe `)
                setEmail('')
                setTimeout(() => {
                    history.push('/login')
                }, 5000);
            })
            .catch((error) => {
                setError(error)
                setEmail('')
            })

    }

    const disabled = email === "";

    return (
        <div className="signUpLoginBox">
            <div className="slContainer">
                ForgetPassword

                {/* BACKGROUND IMG DEADPOOL */}
                <div className="formBoxLeftForget">
                </div>

                <div className="formBoxRight">
                    <div className="formContent">

                        {/* Gestion msg success */}
                        {success && <span style={{
                            border: "1px solid green",
                            background: "green",
                            color: "#ffffff"
                        }}>{success}</span>}

                        {/* Gestion msg error */}
                        {error && <span> {error.message} </span>}

                        <h2>Mot de passe oublié ?</h2>

                        {/* FORMULAIRE CONNECTION*/}
                        <form onSubmit={handleSubmit}>
                            <div className="inputBox">
                                <input onChange={event => setEmail(event.target.value)} value={email} type="email" autoComplete="off" required />
                                <label htmlFor="email">Email</label>
                            </div>


                            <button disabled={disabled}>Récupérer</button>
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

export default ForgetPassword
