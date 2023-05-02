import React, { useState, useEffect } from 'react'
import { loginUser, removeUser } from '../../Redux/actions/authActions'
import { connect, useSelector, useDispatch } from 'react-redux'
import { Modal, Button } from 'antd'
import Draggable from 'react-draggable'

const ModalLogos = (props) => {
    const { selectedCard } = props
    const [visible, setVisible] = useState(false)
    const [disabled, setDisabled] = useState(false)
    const [logos, setLogos] = useState([])
    const [searchText, setsearchText] = useState("")
    useEffect(() => {
        getData()
    })


    const getData = () => {
        const logos = selectedCard?.logo
        if (Array.isArray(logos)) setLogos(logos)
        // if (Array.isArray(labels)) this.setState({ labels }, () => this.search())
    }
    const search = () => {
        let newLogos = logos && logos.filter(d => d?.name?.toLowerCase().indexOf(searchText.toLowerCase().trim()) !== -1)
        setLogos(newLogos)
    }
    const showModal = () => {
        setVisible(true)
    }
    const handleCancel = e => {
        setVisible(false)

    }
    let hasStartTime = Boolean(logos?.[0]?.start_time || logos?.[1]?.start_time)
    let hasEndTime = Boolean(logos?.[0]?.end_time || logos?.[1]?.end_time)
    return (
        <div style={{ marginTop: '-20px', marginLeft: '10px' }}>
            <>
                <Button style={{ border: 'none', fontWeight: 'bold', marginLeft: '-25px', height: 'inherit', width: '110px' }} onClick={showModal}>Logo Details :</Button>
                <Modal
                    title={
                        <div
                            style={{
                                width: '100%',
                                cursor: 'pointer',
                                fontWeight: 'bold'
                            }}
                            onFocus={() => { }}
                            onBlur={() => { }}
                        >
                            LOGO Table
                            <div className='wrap'>
                                <div className='search'>
                                    <input type='text' className='searchTerm' placeholder='Search for Logos here?' />
                                    <button type='submit' className='searchButton'>
                                        <i className='fa fa-search' />
                                    </button>
                                </div>
                            </div>
                        </div>
                    }
                    visible={visible}
                    footer={null}
                    header={null}
                    onCancel={handleCancel}
                    width='600'
                    modalRender={(modal, i) => <Draggable
                        disabled={disabled}
                        key={i}
                    >{modal}</Draggable>
                    }
                >
                    <p>
                        <table>
                            <tr>
                                <th>Logo</th>
                                <th>Confidence</th>
                                {hasStartTime && <th>Start Time</th>}
                                {hasEndTime && <th>End Time</th>}
                            </tr>
                            {Array.isArray(logos) && logos.map((d, i) => {

                                let name = d?.name || d?.description
                                let start_time = d?.start_time
                                let end_time = d?.end_time
                                let confidence = d?.confidence || d?.score
                                return (
                                    <tr style={{ textTransform: 'capitalize' }}>
                                        {name && <td>
                                            {name}
                                        </td>}
                                        {confidence && <td>
                                            {confidence}
                                        </td>}
                                        {start_time && <td>
                                            {start_time}
                                        </td>}
                                        {end_time && <td>
                                            {end_time}
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
export default ModalLogos
// class ModalLogos extends React.Component {
//     constructor(props) {
//         super(props)
//         this.state = {
//             visible: false,
//             disabled: true,
//             logos: [],
//             searchText: ''
//         }
//     }

//     showModal = () => {
//         this.setState({
//             visible: true
//         })
//     }

//     handleCancel = e => {
//         this.setState({
//             visible: false
//         })
//     }

//     componentDidMount = () => {
//         const { selectedCard } = this.props
//         const logos = selectedCard?.logo
//         if (Array.isArray(logos)) this.setState({ logos }, () => this.search())
//     }

//     search = () => {
//         const { logos, searchText } = this.state

//         let newLogos = logos && logos.filter(d => d?.name?.toLowerCase().indexOf(searchText.toLowerCase().trim()) !== -1)

//         this.setState({ logos: newLogos })
//     }

//     render() {
//         const { logos } = this.state
//         let hasStartTime = Boolean(logos?.[0]?.start_time || logos?.[1]?.start_time)
//         let hasEndTime = Boolean(logos?.[0]?.end_time || logos?.[1]?.end_time)
//         return (
//             <div style={{ marginTop: '-20px', marginLeft: '10px' }}>
//                 <>
//                     <Button style={{ border: 'none', fontWeight: 'bold', marginLeft: '-25px', height: 'inherit', width: '110px' }} onClick={this.showModal}>Logo Details :</Button>
//                     <Modal
//                         title={
//                             <div
//                                 style={{
//                                     width: '100%',
//                                     cursor: 'pointer',
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
//                                 LOGO Table
//                                 <div className='wrap'>
//                                     <div className='search'>
//                                         <input type='text' className='searchTerm' placeholder='Search for Logos here?' />
//                                         <button type='submit' className='searchButton' onClick={this.search}>
//                                             <i className='fa fa-search' />
//                                         </button>
//                                     </div>
//                                 </div>
//                             </div>
//                         }
//                         visible={this.state.visible}
//                         footer={null}
//                         header={null}
//                         onCancel={this.handleCancel}
//                         width='600'
//                         modalRender={(modal, i) => <Draggable
//                             disabled={this.state.disabled}
//                             key={i}
//                         >{modal}</Draggable>
//                         }
//                     >
//                         <p>
//                             <table>
//                                 <tr>
//                                     <th>Logo</th>
//                                     <th>Confidence</th>
//                                     {hasStartTime && <th>Start Time</th>}
//                                     {hasEndTime && <th>End Time</th>}
//                                 </tr>
//                                 {Array.isArray(logos) && logos.map((d, i) => {

//                                     let name = d?.name || d?.description
//                                     let start_time = d?.start_time
//                                     let end_time = d?.end_time
//                                     let confidence = d?.confidence || d?.score
//                                     return (
//                                         <tr style={{ textTransform: 'capitalize' }}>
//                                             {name && <td>
//                                                 {name}
//                                             </td>}
//                                             {confidence && <td>
//                                                 {confidence}
//                                             </td>}
//                                             {start_time && <td>
//                                                 {start_time}
//                                             </td>}
//                                             {end_time && <td>
//                                                 {end_time}
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

// export default connect(mapStateToProps, mapDispatchToProps)(ModalLogos)