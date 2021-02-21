import React, { Component, Fragment } from 'react'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import { QuizMarvel } from '../quizMarvel';
import Levels from '../Levels';
import ProgressBar from '../ProgressBar';
import QuizOver from '../QuizOver';
import { FaChevronRight } from 'react-icons/fa'

// configuration du toast
toast.configure()

const initialState = {
    levelNames: ["debutant", "confirme", "expert"],
    quizLevel: 0,
    maxQuestions: 10,
    storedQuestions: [],
    question: null,
    options: [],
    idQuestion: 0,
    btnDisabled: true,
    userAnswer: null,
    score: 0,
    showWelcomeMsg: false,
    quizEnd: false,
    percent: null
}

const levelNames = ["debutant", "confirme", "expert"]

class Quiz extends Component {

    constructor(props) {
        super(props)

        this.state = initialState
        this.storedDataRef = React.createRef()
    }




    // Methode récupération des questions
    loadQuestions = (quizz) => {
        const fetchArrayQuiz = QuizMarvel[0].quizz[quizz]
        if (fetchArrayQuiz.length >= this.state.maxQuestions) {

            // copie du tableau avec les réponses dans un ref
            this.storedDataRef.current = fetchArrayQuiz

            // nouveau tableau mais sans les réponses
            const onlyQuestions = fetchArrayQuiz.map(({ answer, ...keepRest }) => keepRest)

            this.setState({ storedQuestions: onlyQuestions })

        }
    }

    // Passer à la question suivante
    nextQuestion = () => {
        if (this.state.idQuestion === this.state.maxQuestions - 1) {

            this.setState({ quizEnd: true })
        } else {
            // si on est pas arrivé à la dernière question du quizz on passe à la suivante
            this.setState((prevState) => ({ idQuestion: prevState.idQuestion + 1 }))
        }

        // cible la bonne réponse sur la question en cours
        const goodAnswer = this.storedDataRef.current[this.state.idQuestion].answer

        // si bonne réponse alors on incrémente le score
        if (this.state.userAnswer === goodAnswer) {
            this.setState((prevState) => ({
                score: prevState.score + 1
            }))

            toast.success('Bravo +1 😀', {
                position: "top-right",
                bodyClassName: "toastify-color",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
                progress: undefined,
            });

        } else {
            toast.error('Mauvaise réponse 😔', {
                position: "top-right",
                bodyClassName: "toastify-color",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
                progress: undefined,
            });
        }

    }

    // Au montage du composant
    componentDidMount() {
        this.loadQuestions(levelNames[this.state.quizLevel])// "debutant"
    }

    // Mise a jour du composant au clique suivant
    componentDidUpdate(prevProps, prevState) {
        // destructuring
        const {
            maxQuestions,
            storedQuestions,
            idQuestion,
            score,
            quizEnd
        } = this.state

        // maj pour afficher la premiere question
        if ((storedQuestions !== prevState.storedQuestions) && storedQuestions.length) {
            this.setState({
                question: storedQuestions[idQuestion].question,
                options: storedQuestions[idQuestion].options
            })
        }

        // maj du composant et du state pour afficher la question suivante
        if ((idQuestion !== prevState.idQuestion) && storedQuestions.length) {
            this.setState({
                question: storedQuestions[idQuestion].question,
                options: storedQuestions[idQuestion].options,
                userAnswer: null,
                btnDisabled: true
            })
        }

        // Verifie la fin du quiz et maj du score réel
        if (quizEnd !== prevState.quizEnd) {
            const gradePercent = this.getPercentage(maxQuestions, score)
            this.gameOver(gradePercent)
        }

        // Affiche le toast d'accueil uniquement au début du quiz
        if (this.props.userData.pseudo !== prevProps.userData.pseudo) {
            this.showToastMsg(this.props.userData.pseudo)
        }
    }

    // Calcul du pourcentage de réussite
    getPercentage = (maxQuest, ourScore) => (ourScore / maxQuest) * 100

    // Gestion fin du quiz
    gameOver = (percent) => {

        if (percent >= 50) {
            // Si réussite à 50% ou plus on passe au niveau suivant
            this.setState({
                quizLevel: this.state.quizLevel + 1,
                percent: percent
            })
        } else {
            // Sinon on obtient juste le pourcentage de réussite
            this.setState({ percent: percent })
        }
    }

    // Récupération choix de réponse de l'utilisateur
    submitAnswer = (selectedAnswer) => {
        this.setState({
            userAnswer: selectedAnswer,
            btnDisabled: false
        })
    }

    // Affiche msg de bienvenu
    showToastMsg = (pseudo) => {
        // affiche le toast qu'une seule fois
        if (!this.state.showWelcomeMsg) {

            this.setState({ showWelcomeMsg: true })

            toast.info(`Bienvenue ${pseudo} et bonne chance 🙂`, {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
                progress: undefined,
            });
        }
    }

    // Charger le niveau suivant
    loadLevelQuestions = (param) => {
        // tout les states par défaut + niveau supérieur
        this.setState({ ...initialState, quizLevel: param })

        // puis charges les questions du niveau suivant
        this.loadQuestions(levelNames[param])
    }


    render() {

        //const { pseudo } = this.props.userData

        // destructuring
        const {
            quizLevel,
            maxQuestions,
            question,
            options,
            idQuestion,
            btnDisabled,
            userAnswer,
            score,
            quizEnd,
            percent
        } = this.state

        // Rendu des choix de réponses
        const displayOptions = options.map((option, index) => {
            return (
                <p
                    onClick={() => { this.submitAnswer(option) }}
                    className={`answerOptions ${userAnswer === option ? "selected" : null} `}
                    key={index}
                >
                    <FaChevronRight />{option}

                </p>
            )
        })

        // Gestion affichage bouton Suivant / Terminer
        const displayEndBtn = (idQuestion < maxQuestions - 1) ? "Suivant" : "Terminer"

        // Gestion du quiz et fin du quiz
        return quizEnd ?
            (<QuizOver
                ref={this.storedDataRef}
                levelNames={levelNames}
                score={score}
                maxQuestions={maxQuestions}
                quizLevel={quizLevel}
                percent={percent}
                loadLevelQuestions={this.loadLevelQuestions}
            />)
            :
            (
                <Fragment>

                    <Levels
                        levelNames={levelNames}
                        quizLevel={quizLevel} />

                    <ProgressBar idQuestion={idQuestion} maxQuestions={maxQuestions} />

                    <h2> {question} </h2>

                    {displayOptions}

                    <button
                        disabled={btnDisabled}
                        className="btnSubmit"
                        onClick={this.nextQuestion}
                    >
                        {displayEndBtn}
                    </button>

                </Fragment>
            )
    }
}

export default Quiz
