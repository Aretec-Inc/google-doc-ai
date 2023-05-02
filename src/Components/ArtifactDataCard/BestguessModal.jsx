import React, { useState, useEffect } from 'react'
import { loginUser, removeUser } from '../../Redux/actions/authActions'
import { connect, useSelector, useDispatch } from 'react-redux'
import { Modal, Button, Tooltip } from 'antd'
import Draggable from 'react-draggable'


const ModalBestguess = (props) => {
    const { selectedCard } = props
    const user = useSelector((state) => state.authReducer.user)
    const selectedKey = useSelector((state) => state.authReducer.selectedKey)
    const artifactData = useSelector((state) => state.authReducer.artifactData)
    const [visible, setVisible] = useState(false)
    const [disabled, setDisabled] = useState(true)
    const [matches, setMatches] = useState([])
    const [searchText, setSearchText] = useState("")
    const dispatch = useDispatch()

    useEffect(() => {
        getData()
    })


    const getData = () => {
        const matches = selectedCard?.matches
        if (Array.isArray(matches)) setMatches(matches)
    }
    const search = () => {
        let newmatches = matches && matches.filter(d => d?.name?.toLowerCase().indexOf(searchText.toLowerCase().trim()) !== -1)
        setMatches(newmatches)
    }
    const showModal = () => {
        setVisible(true)
    }
    const handleCancel = e => {
        setVisible(false)

    }
    const notAvailable = <Tooltip arrow title="Not Available"> <span> N/A</span></Tooltip>
    return (
        <div style={{ marginLeft: '10px' }}>
            <>
                <Button style={{ border: 'none', fontWeight: 'bold', marginLeft: '-25px', height: 'inherit', width: '120px' }} onClick={showModal}>Matches Details :</Button>
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
                            Matching Table & Best Guess
                            <div className='wrap'>
                                <div className='search'>
                                    <input type='text' className='searchTerm' placeholder='Search for matches here?' />
                                    <button type='submit' className='searchButton' value={searchText} onClick={search}>
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
                    <div style={{ overflow: 'auto' }} >
                        <table style={{ tableLayout: 'fixed' }}>
                            <tr>
                                <th style={{ textAlign: 'center' }}>Best Guess </th>
                                <th style={{ textAlign: 'center' }}>Matching Image Link</th>
                                <th style={{ textAlign: 'center' }}>Pages With Images Link</th>
                            </tr>
                            {Array.isArray(matches) && matches?.map((d, i) => {
                                let best_guess = d?.best_guess || d?.description
                                let maching_images = d?.matching_images || d?.score
                                let pages_with_images = d?.pages_with_images
                                return (
                                    <tr style={{ textTransform: 'capitalize' }}>
                                        <td>
                                            {best_guess ? best_guess : notAvailable}
                                        </td>
                                        <td>
                                            <a href={maching_images} target='_blank'>{maching_images ? maching_images : notAvailable}</a>
                                        </td>
                                        <td>
                                            <a href={pages_with_images} target='_blank'>{pages_with_images ? pages_with_images : notAvailable}</a>
                                        </td>
                                    </tr>
                                )
                            })
                            }
                        </table>
                    </div>
                </Modal>
            </>
        </div>
    )
}
export default ModalBestguess
// class ModalBestguess extends React.Component {
//     constructor(props) {
//         super(props)
//         this.state = {
//             visible: false,
//             disabled: true,
//             matches: [],
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
//         const matches = selectedCard?.matches
//         if (Array.isArray(matches)) this.setState({ matches }, () => this.search())
//     }

//     search = () => {
//         const { matches, searchText } = this.state

//         let newmatches = matches && matches.filter(d => d?.name?.toLowerCase().indexOf(searchText.toLowerCase().trim()) !== -1)

//         this.setState({ matches: newmatches })
//     }

//     render() {
//         const { matches } = this.state
//         const notAvailable = <Tooltip arrow title="Not Available"> <span> N/A</span></Tooltip>
//         return (
//             <div style={{ marginLeft: '10px' }}>
//                 <>
//                     <Button style={{ border: 'none', fontWeight: 'bold', marginLeft: '-25px', height: 'inherit', width: '120px' }} onClick={this.showModal}>Matches Details :</Button>
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
//                                 Matching Table & Best Guess
//                                 <div className='wrap'>
//                                     <div className='search'>
//                                         <input type='text' className='searchTerm' placeholder='Search for matches here?' />
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
//                         <div style={{ overflow: 'auto' }} >
//                             <table style={{ tableLayout: 'fixed' }}>
//                                 <tr>
//                                     <th style={{ textAlign: 'center' }}>Best Guess </th>
//                                     <th style={{ textAlign: 'center' }}>Matching Image Link</th>
//                                     <th style={{ textAlign: 'center' }}>Pages With Images Link</th>



//                                 </tr>
//                                 {Array.isArray(matches) && matches.map((d, i) => {

//                                     let best_guess = d?.best_guess || d?.description
//                                     let maching_images = d?.matching_images || d?.score
//                                     let pages_with_images = d?.pages_with_images

//                                     return (
//                                         <tr style={{ textTransform: 'capitalize' }}>
//                                             <td>

//                                                 {best_guess ? best_guess : notAvailable}
//                                             </td>
//                                             <td>
//                                                 <a href={maching_images} target='_blank'>{maching_images ? maching_images : notAvailable}</a>
//                                             </td>
//                                             <td>
//                                                 <a href={pages_with_images} target='_blank'>{pages_with_images ? pages_with_images : notAvailable}</a>
//                                             </td>
//                                         </tr>
//                                     )
//                                 })
//                                 }
//                             </table>
//                         </div>
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

// export default connect(mapStateToProps, mapDispatchToProps)(ModalBestguess)