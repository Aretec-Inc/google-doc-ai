import React from 'react';
import { loginUser, removeUser } from '../../Redux/actions/authActions'
import { connect, useSelector, useDispatch } from 'react-redux'
import { useEffect, useState } from "react";
import SelectedCardData from './SelectedCardData'

const SelectedCard = (props) => {
    const user = useSelector((state) => state.authReducer.user)
    const selectedKey = useSelector((state) => state.authReducer.selectedKey)
    const artifactData = useSelector((state) => state.authReducer.artifactData)
    const dispatch = useDispatch()

    useEffect(() => {
        reduxData()
    })
    const reduxData = () => {
        dispatch(loginUser(user))
        dispatch(removeUser())
    }

    return (
        <div>
            <div className='btn-div'>
                <SelectedCardData {...props} />
            </div>
        </div>
    )
}

export default SelectedCard