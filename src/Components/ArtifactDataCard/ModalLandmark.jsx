import React, { useState, useEffect } from 'react'
import { loginUser, removeUser } from '../../Redux/actions/authActions'
import { connect, useSelector, useDispatch } from 'react-redux'
import { Modal, Button } from 'antd'
import Draggable from 'react-draggable'


const ModalLandmark = (props) => {
    const { selectedCard } = props
    const [visible, setVisible] = useState(false)
    const [disabled, setDisabled] = useState(false)
    const [landmark, setLandmark] = useState([])
    const [searchText, setsearchText] = useState("")
    useEffect(() => {
        getData()
    })


    const getData = () => {
        const landmark = selectedCard?.landmark
        if (Array.isArray(landmark)) setLandmark(landmark)
    }
    const search = () => {
        let newlandmark = landmark && landmark.filter(d => d?.name?.toLowerCase().indexOf(searchText.toLowerCase().trim()) !== -1)
        setLandmark(newlandmark)
    }
    const showModal = () => {
        setVisible(true)
    }
    const handleCancel = e => {
        setVisible(false)

    }
    return (
        <div style={{ marginLeft: '10px' }}>
            <>
                <Button style={{ border: 'none', fontWeight: 'bold', marginLeft: '-25px', height: 'inherit', width: '120px' }} onClick={showModal}>Landmark Details :</Button>
                <Modal
                    title={
                        <div
                            style={{
                                width: '100%',
                                cursor: 'pointer',
                                background: 'none',
                                fontWeight: 'bold'
                            }}

                            onFocus={() => { }}
                            onBlur={() => { }}
                        >
                            Landmark Table
                            <div className='wrap'>
                                <div className='search'>
                                    <input type='text' className='searchTerm' placeholder='Search for landmark here?' />
                                    <button type='submit' className='searchButton' value={searchText} >
                                        <i className='fa fa-search' />
                                    </button>
                                </div>
                            </div>
                        </div>
                    }
                    visible={visible}
                    footer={null}
                    onCancel={handleCancel}
                    width='600'
                    modalRender={modal => <Draggable disabled={disabled}>{modal}</Draggable>}
                >
                    <p>
                        <table>
                            <tr>
                                <th>Landmark</th>
                                <th>Score</th>
                                <th>Latitude</th>
                                <th>Longitude</th>
                            </tr>
                            {Array.isArray(landmark) && landmark.map((d, i) => {

                                let name = d?.name || d?.description
                                let confidence = d?.confidence || d?.score
                                let latitude = d?.latitude
                                let longitude = d?.longitude
                                return (
                                    <tr style={{ textTransform: 'capitalize' }}>
                                        {name && <td>
                                            {name}
                                        </td>}
                                        {confidence && <td>
                                            {confidence}
                                        </td>}
                                        {latitude && <td>
                                            {latitude}
                                        </td>}
                                        {longitude && <td>
                                            {longitude}
                                        </td>}

                                    </tr>
                                )
                            })
                            }
                        </table>
                    </p>
                </Modal>
            </>
        </div>
    )
}
export default ModalLandmark
// class ModalLandmark extends React.Component {
//     constructor(props) {
//         super(props)
//         this.state = {
//             visible: false,
//             disabled: true,
//             landmark: [],
//             searchText: ''
//         }
//     }

//     showModal = () => {
//         this.setState({
//             visible: true,
//         })
//     }

//     handleCancel = e => {
//         this.setState({
//             visible: false
//         })
//     }

//     componentDidMount = () => {
//         const { selectedCard } = this.props
//         const landmark = selectedCard?.landmark
//         if (Array.isArray(landmark)) this.setState({ landmark }, () => this.search())
//     }

//     search = () => {
//         const { landmark, searchText } = this.state

//         let newlandmark = landmark && landmark.filter(d => d?.name?.toLowerCase().indexOf(searchText.toLowerCase().trim()) !== -1)

//         this.setState({ landmark: newlandmark })
//     }

//     render() {
//         const { landmark } = this.state



//         return (
//             <div style={{ marginLeft: '10px' }}>
//                 <>
//                     <Button style={{ border: 'none', fontWeight: 'bold', marginLeft: '-25px', height: 'inherit', width: '120px' }} onClick={this.showModal}>Landmark Details :</Button>
//                     <Modal
//                         title={
//                             <div
//                                 style={{
//                                     width: '100%',
//                                     cursor: 'pointer',
//                                     background: 'none',
//                                     fontWeight: 'bold'
//                                 }}
//                                 onMouseOver={() => {
//                                     if (this.state.disabled) {
//                                         this.setState({
//                                             disabled: false,
//                                         })
//                                     }
//                                 }}
//                                 onMouseOut={() => {
//                                     this.setState({
//                                         disabled: true,
//                                     })
//                                 }}
//                                 onFocus={() => { }}
//                                 onBlur={() => { }}
//                             >
//                                 Landmark Table
//                                 <div className='wrap'>
//                                     <div className='search'>
//                                         <input type='text' className='searchTerm' placeholder='Search for landmark here?' />
//                                         <button type='submit' className='searchButton' value={this.state.searchText} onClick={this.search}>
//                                             <i className='fa fa-search' />
//                                         </button>
//                                     </div>
//                                 </div>
//                             </div>
//                         }
//                         visible={this.state.visible}
//                         footer={null}
//                         onCancel={this.handleCancel}
//                         width='600'
//                         modalRender={modal => <Draggable disabled={this.state.disabled}>{modal}</Draggable>}
//                     >
//                         <p>
//                             <table>
//                                 <tr>
//                                     <th>Landmark</th>
//                                     <th>Score</th>
//                                     <th>Latitude</th>
//                                     <th>Longitude</th>
//                                 </tr>
//                                 {Array.isArray(landmark) && landmark.map((d, i) => {

//                                     let name = d?.name || d?.description
//                                     let confidence = d?.confidence || d?.score
//                                     let latitude = d?.latitude
//                                     let longitude = d?.longitude
//                                     return (
//                                         <tr style={{ textTransform: 'capitalize' }}>
//                                             {name && <td>
//                                                 {name}
//                                             </td>}
//                                             {confidence && <td>
//                                                 {confidence}
//                                             </td>}
//                                             {latitude && <td>
//                                                 {latitude}
//                                             </td>}
//                                             {longitude && <td>
//                                                 {longitude}
//                                             </td>}

//                                         </tr>
//                                     )
//                                 })
//                                 }
//                             </table>
//                         </p>
//                     </Modal>
//                 </>
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

// export default connect(mapStateToProps, mapDispatchToProps)(ModalLandmark)