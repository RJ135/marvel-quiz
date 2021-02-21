import React from 'react'
import batman from '../../images/batman.png';


const ErrorPage = () => {
    return (
        <div className="quiz-bg">
            <div className="container">
                <h2 className="errorPageTitle">Oups, cette page n'existe pas</h2>
                <img className="errorPageImg" src={batman} alt="error page" />
            </div>
        </div>
    )
}

export default ErrorPage
