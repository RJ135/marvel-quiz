import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom';


const Landing = () => {

    const refWolverine = useRef(null)
    const [btn, setBtn] = useState(false)

    // affiche griffes au bout de 3 secondes
    useEffect(() => {
        refWolverine.current.classList.add("startingImg")
        setTimeout(() => {
            refWolverine.current.classList.remove("startingImg")
            setBtn(true)
        }, 1000);
    }, [])


    // Animation griffes wolverine
    const setLeftImg = () => {
        refWolverine.current.classList.add("leftImg")
    }
    const setRightImg = () => {
        refWolverine.current.classList.add("rightImg")
    }
    const clearImg = () => {
        refWolverine.current.classList.remove("rightImg", "leftImg")
    }

    // Gestion affichage des buttons inscription + connection
    const displayBtn = btn && (
        <>
            <div onMouseOver={setLeftImg} onMouseOut={clearImg} className="leftBox">
                <Link to="/signup" className="btn-welcome">Inscription</Link>
            </div>
            <div onMouseOver={setRightImg} onMouseOut={clearImg} className="rightBox">
                <Link to="/login" className="btn-welcome">Connection</Link>
            </div>
        </>
    )


    return (
        <main className="welcomePage" ref={refWolverine}>
            {displayBtn}
        </main>
    )
}

export default Landing
