import React, { useState, useEffect } from 'react'
import { loginUser, removeUser } from '../../Redux/actions/authActions'
import { connect, useSelector, useDispatch } from 'react-redux'
import { Modal, Button } from 'antd'
import Draggable from 'react-draggable'


const ModalLabels = (props) => {
    const { selectedCard } = props
    const [visible, setVisible] = useState(false)
    const [disabled, setDisabled] = useState(false)
    const [labels, setLabels] = useState([])
    const [searchText, setsearchText] = useState("")
    useEffect(() => {
        getData()
    })


    const getData = () => {
        const labels = selectedCard?.label
        if (Array.isArray(labels)) setLabels(labels)
        // if (Array.isArray(labels)) this.setState({ labels }, () => this.search())
    }
    const search = () => {
        let newLabels = labels && labels.filter(d => d?.name?.toLowerCase().indexOf(searchText.toLowerCase().trim()) !== -1)
        setLabels(newLabels)
    }
    const showModal = () => {
        setVisible(true)
    }
    const handleCancel = e => {
        setVisible(false)

    }

    let hasStartTime = Boolean(labels?.[0]?.start_time || labels?.[1]?.start_time)
    let hasEndTime = Boolean(labels?.[0]?.end_time || labels?.[1]?.end_time)
    return (
        <div style={{ marginLeft: '10px' }}>
            <>
                <Button style={{ border: 'none', fontWeight: 'bold', marginLeft: '-25px', height: 'inherit', width: '120px' }} onClick={showModal}>Labels Details :</Button>
                <Modal
                    title={
                        <div
                            style={{
                                width: '100%',
                                cursor: 'pointer',
                                background: 'none',
                                fontWeight: 'bold'
                            }}
                            // onMouseOver={() => {

                            //     if (this.state.disabled) {
                            //         this.setState({
                            //             disabled: false,
                            //         })
                            //     }
                            // }}
                            // onMouseOut={() => {
                            //     this.setState({
                            //         disabled: true,
                            //     })
                            // }}
                            onFocus={() => { }}
                            onBlur={() => { }}
                        >
                            LABELS Table
                            <div className='wrap'>
                                <div className='search'>
                                    <input type='text' className='searchTerm' placeholder='Search for Labels here?' />
                                    <button type='submit' className='searchButton' value={searchText}
                                    // onClick={search}
                                    >
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
                    modalRender={(modal, i) => <Draggable
                        disabled={disabled}
                        key={i}>{modal}</Draggable>}
                >
                    <p>
                        <table>
                            <tr>
                                <th>Labels</th>
                                <th>Confidence</th>
                                {hasStartTime && <th>Start Time</th>}
                                {hasEndTime && <th>End Time</th>}

                            </tr>
                            {Array.isArray(labels) && labels.map((d, i) => {

                                let name = d?.name || d?.description
                                let confidence = d?.confidence || d?.score
                                let start_time = d?.start_time
                                let end_time = d?.end_time
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
                                        {end_time &&
                                            <td>
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
export default ModalLabels
// class ModalLabels extends React.Component {
//     constructor(props) {
//         super(props)
//         this.state = {
//             visible: false,
//             disabled: true,
//             labels: [],
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
//             visible: false,
//         })

//     }

//     componentDidMount = () => {
//         const { selectedCard } = this.props


//         const labels = selectedCard?.label
//         if (Array.isArray(labels)) this.setState({ labels }, () => this.search())

//     }

//     search = () => {
//         const { labels, searchText } = this.state

//         let newLabels = labels && labels.filter(d => d?.name?.toLowerCase().indexOf(searchText.toLowerCase().trim()) !== -1)

//         this.setState({ labels: newLabels })
//     }

//     render() {
//         const { labels } = this.state

//         let hasStartTime = Boolean(labels?.[0]?.start_time || labels?.[1]?.start_time)
//         let hasEndTime = Boolean(labels?.[0]?.end_time || labels?.[1]?.end_time)

//         return (
//             <div style={{ marginLeft: '10px' }}>
//                 <>
//                     <Button style={{ border: 'none', fontWeight: 'bold', marginLeft: '-25px', height: 'inherit', width: '120px' }} onClick={this.showModal}>Labels Details :</Button>
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
//                                 LABELS Table
//                                 <div className='wrap'>
//                                     <div className='search'>
//                                         <input type='text' className='searchTerm' placeholder='Search for Labels here?' />
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
//                         modalRender={(modal, i) => <Draggable
//                             disabled={this.state.disabled}
//                             key={i}>{modal}</Draggable>}
//                     >
//                         <p>
//                             <table>
//                                 <tr>
//                                     <th>Labels</th>
//                                     <th>Confidence</th>
//                                     {hasStartTime && <th>Start Time</th>}
//                                     {hasEndTime && <th>End Time</th>}

//                                 </tr>
//                                 {Array.isArray(labels) && labels.map((d, i) => {

//                                     let name = d?.name || d?.description
//                                     let confidence = d?.confidence || d?.score
//                                     let start_time = d?.start_time
//                                     let end_time = d?.end_time
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
//                                             {end_time &&
//                                                 <td>
//                                                     {end_time}
//                                                 </td>}
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

// export default connect(mapStateToProps, mapDispatchToProps)(ModalLabels)