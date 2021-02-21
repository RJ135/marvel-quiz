import React from 'react'

const Loader = ({ loadingMsg, styling }) => {

    return (
        <div>
            <div className="loader"></div>
            <p style={styling} >
                {loadingMsg}
            </p>
        </div>
    )
}

export default Loader
