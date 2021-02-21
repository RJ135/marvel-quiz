import React, { Fragment } from 'react'

const ProgressBar = ({ idQuestion, maxQuestions }) => {

    // Gestion barre des pourcentages
    const actualQuestion = idQuestion + 1

    // Pourcentage d'avancement
    const getWidth = (totalQuestions, questionId) => {
        return (100 / totalQuestions) * questionId
    }
    const progressPercent = getWidth(maxQuestions, actualQuestion)

    return (
        <Fragment>
            <div className="percentage">
                <div className="progressPercent">{`Question ${actualQuestion} / ${maxQuestions}`}</div>
                <div className="progressPercent">{`Progression : ${progressPercent}%`}</div>
            </div>
            <div className="progressBar">
                <div className="progressBarChange" style={{
                    width: `${progressPercent}%`
                }}></div>
            </div>
        </Fragment>
    )
}


// Memo vérifie si les props n'ont pas changer dans ce cas pas de rechargement du Compo
export default React.memo(ProgressBar)

