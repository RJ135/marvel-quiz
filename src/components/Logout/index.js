import React, { useContext, useEffect, useState } from 'react'
import { FirebaseContext } from '../Firebase';
import ReactTooltip from 'react-tooltip';

const Logout = () => {

    const [checked, setChecked] = useState(false)
    const firebase = useContext(FirebaseContext)

    useEffect(() => {
        if (checked) {
            firebase.signoutUser()
        }
    }, [checked, firebase])

    const handleChange = (event) => {
        setChecked(event.target.checked);
    }

    return (
        <div className="logoutContainer">
            <label htmlFor="logout" className="switch">
                <input
                    onChange={handleChange}
                    type="checkbox"
                    id="logout"
                    checked={checked}
                />
                <span className="slider round" data-tip="Déconnection"></span>
            </label>
            <ReactTooltip place="left" effect="solid" />
        </div>
    )
}

export default Logout
