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
// class SelectedCard extends React.Component {
//     constructor(props) {
//         super(props)
//     }

//     render() {
//         return (
//             <div>
//                 <div className='btn-div'>
//                     <SelectedCardData {...this.props} />
//                 </div>
//             </div>
//         )
//     }
// }

// const mapStateToProps = (state) => {
//     return {
//         user: state.authReducer.user,
//         selectedKey: state.authReducer.selectedKey,
//         artifactData: state.authReducer.artifactData
//     }
// }

// const mapDispatchToProps = (dispatch) => {
//     return {
//         loginUser: (user) => dispatch(loginUser(user)),
//         removeUser: () => dispatch(removeUser())
//     }
// }

// export default connect(mapStateToProps, mapDispatchToProps)(SelectedCard)