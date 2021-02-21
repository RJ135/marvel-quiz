import React, { Fragment, useEffect, useState } from 'react'
import { GiTrophyCup } from 'react-icons/gi';
import Loader from '../Loader';
import Modal from '../Modal';
import axios from 'axios';

const QuizOver = React.forwardRef((props, ref) => {

    const {
        levelNames,
        score,
        maxQuestions,
        quizLevel,
        percent,
        loadLevelQuestions
    } = props

    const API_PUBLIC_KEY = process.env.REACT_APP_MARVEL_API_KEY
    const hash = 'b81d46cdeef29d9c131fb98ca100c02e'

    // states
    const [askedQuestion, setAskedQuestion] = useState([])
    const [openModal, setOpenModal] = useState(false)
    const [characterInfos, setCharacterInfos] = useState([])
    const [loading, setLoading] = useState(true)

    // Au montage du composant
    useEffect(() => {
        setAskedQuestion(ref.current)

        // check si key marvelStorageDate existante
        if (localStorage.getItem('marvelStorageDate')) {
            // cas récupération data
            const date = localStorage.getItem('marvelStorageDate')
            checkDataAge(date)
        }

    }, [ref])

    // Verifie si data n'est pas obselète (+15j)
    const checkDataAge = (date) => {
        const today = Date.now()
        const timeDifference = today - date
        const daysDifference = timeDifference / (1000 * 3600 * 24)

        if (daysDifference <= 15) {
            localStorage.clear()
            localStorage.setItem('marvelStorageDate', Date.now())
        }
    }

    // Calcul de la moyenne
    const averageGrade = maxQuestions / 2

    // Si test échoué renvoie vers le niveau auquel on se trouve
    if (score < averageGrade) {
        setTimeout(() => loadLevelQuestions(quizLevel), 3000);
    }

    // Gestion affichage modal Info
    const showModal = (id) => {
        setOpenModal(true)

        if (localStorage.getItem(id)) {
            setCharacterInfos(JSON.parse(localStorage.getItem(id)))
            setLoading(false)

        } else {
            axios
                .get(`https://gateway.marvel.com/v1/public/characters/${id}?ts=1&apikey=${API_PUBLIC_KEY}&${hash}`)
                .then((response) => {
                    setCharacterInfos(response.data)
                    setLoading(false)
                    //copie local pour eviter appels Api
                    localStorage.setItem(id, JSON.stringify(response.data))
                    if (!localStorage.getItem('marvelStorageDate')) {
                        localStorage.setItem('marvelStorageDate', Date.now())
                    }
                })
                .catch(error => { console.log(error) })
        }
    }

    // Gestion affichage modal Info
    const closeModal = () => {
        setOpenModal(false)
        setLoading(true)
    }

    // Premiere lettre des links en capitale
    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1)
    }


    // Gestion des décisions
    const decision = score >= averageGrade ?

        // Si moyenne du niveau
        <Fragment>
            <div className="stepsBtnContainer">
                {
                    quizLevel < levelNames.length ?
                        (
                            // fin du niveau
                            <Fragment>
                                <p className="successMsg">Bravo, passez au niveau suivant</p>
                                <button
                                    className="btnResult success"
                                    onClick={() => { loadLevelQuestions(quizLevel) }}
                                >Niveau Suivant</button>
                            </Fragment>
                        )
                        :
                        (
                            // Fin du quiz général
                            <Fragment>
                                <p className="successMsg">
                                    <GiTrophyCup size='48' />Bravo, vous êtes expert !
                                </p>
                                <button
                                    className="btnResult gameOver"
                                    onClick={() => { loadLevelQuestions(0) }}
                                >Accueil</button>
                            </Fragment>
                        )
                }
            </div>
            {/* Affichage des résultats */}
            <div className="percentage">
                <div className="progressPercent">Réussite : {percent}%</div>
                <div className="progressPercent">Note : {score}/{maxQuestions}</div>
            </div>
        </Fragment>
        :
        // Pas la moyenne
        <Fragment>
            <div className="stepsBtnContainer">
                <p className="failureMsg">Vous avez échoué !</p>
            </div>
            {/* Affichage des résultats */}
            <div className="percentage">
                <div className="progressPercent">Réussite : {percent}%</div>
                <div className="progressPercent">Note : {score}/{maxQuestions}</div>
            </div>
        </Fragment>

    // Gestion affichage tableau des réponses
    const questionAndAnswer = score >= averageGrade ?
        // Affiche les question et les réponses associés 
        (
            askedQuestion.map(({ question, answer, id, heroId }) => {
                return (
                    <tr key={id}>
                        <td> {question} </td>
                        <td> {answer} </td>
                        <td>
                            <button
                                className="btnInfo"
                                onClick={() => { showModal(heroId) }}
                            >Infos
                            </button></td>
                    </tr>
                )

            })
        )
        :
        // N'affiche pas les question et les réponses si pas la moyenne
        (
            <tr>
                <td colSpan="3" >
                    <Loader
                        loadingMsg={'Pas de réponse'}
                        styling={{ textAlign: 'center', color: 'red' }}
                    />
                </td>
            </tr>
        )

    // Gestion logique d'affichage modal
    const resultInModal = !loading ?
        <Fragment>
            <div className="modalHeader">
                <h2> {characterInfos.data.results[0].name} </h2>
            </div>

            <div className="modalBody">
                <div className="comicImage">
                    <img
                        src={characterInfos.data.results[0].thumbnail.path + '.' + characterInfos.data.results[0].thumbnail.extension}
                        alt={characterInfos.data.results[0].name}
                    />
                </div>
                <p>{characterInfos.attributionText}</p>

                <div className="comicDetails">
                    <h3>Description</h3>
                    {
                        characterInfos.data.results[0].description ?
                            <p>{characterInfos.data.results[0].description}</p>
                            :
                            <p>Description indisponible ...</p>
                    }
                    <h3>Plus d'infos</h3>
                    {
                        characterInfos.data.results[0].urls &&
                        characterInfos.data.results[0].urls.map((url, index) => {
                            return <a
                                key={index}
                                href={url.url}
                                target="_blank"
                                rel="noopener noreferrer"
                            > {capitalizeFirstLetter(url.type)} </a>
                        })
                    }
                </div>

            </div>

            <div className="modalFooter">
                <button className="modalBtn" onClick={closeModal}>
                    Fermer
                </button>
            </div>
        </Fragment>
        :
        <Fragment>
            <div className="modalHeader">
                <h2> Attente réponse de Marvel ... </h2>
            </div>
            <div className="modalBody">
                <Loader />
            </div>
        </Fragment>


    return (
        <Fragment>

            {decision}

            <hr />

            <p>Les réponses aux questions posés :</p>

            <div className="answerContainer">
                <table className="answers">
                    <thead>
                        <tr>
                            <th>Question</th>
                            <th>Réponses</th>
                            <th>Infos</th>
                        </tr>
                    </thead>
                    <tbody>
                        {questionAndAnswer}
                    </tbody>
                </table>
            </div>

            {/* Afficher la modal */}
            <Modal showModal={openModal} closeModal={closeModal}>
                {resultInModal}
            </Modal>

        </Fragment>
    )
})

export default React.memo(QuizOver) 
