import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { FirebaseContext } from '../Firebase';

const Login = ({ history }) => {

    const firebase = useContext(FirebaseContext)

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const resetStates = () => {
        setEmail('')
        setPassword('')
    }
    const [btnConnection, setBtnConnection] = useState(false)


    useEffect(() => {

        if (password.length > 5 && email !== '') {
            setBtnConnection(true)
        } else if (btnConnection) {
            setBtnConnection(false)
        }
    }, [password, email, btnConnection])


    const handleSubmit = (event) => {
        event.preventDefault()
        firebase.loginUser(email, password)
            .then(user => {
                console.log(user);
                resetStates()
                history.push('/welcome')
            })
            .catch(error => {
                setError(error)
                resetStates()
            })
    }


    return (
        <div className="signUpLoginBox">
            <div className="slContainer">
                {/* BACKGROUND IMG IRONMAN */}
                <div className="formBoxLeftLogin">
                </div>

                <div className="formBoxRight">
                    <div className="formContent">

                        {error !== '' && <span> {error.message} </span>}

                        <h2>Connection</h2>

                        {/* FORMULAIRE CONNECTION*/}
                        <form onSubmit={handleSubmit}>
                            <div className="inputBox">
                                <input onChange={event => setEmail(event.target.value)} value={email} type="email" autoComplete="off" required />
                                <label htmlFor="email">Email</label>
                            </div>

                            <div className="inputBox">
                                <input onChange={event => setPassword(event.target.value)} value={password} type="password" autoComplete="off" required />
                                <label htmlFor="password">Mot de passe</label>
                            </div>

                            {btnConnection ? <button>Connection</button> : <button disabled>Connection</button>}
                        </form>

                        <div className="linkContainer">
                            <Link className="simpleLink" to="/signup">Nouveau sur Marvel Quiz ? Inscrivez-vous.</Link>
                            <br />
                            <Link className="simpleLink" to="/forgetpassword">Mot de passe oublié ? Récupérer-le ici</Link>
                        </div>


                    </div>
                </div>

            </div>
        </div>
    )
}

export default Login
