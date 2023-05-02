import React, { useState, useEffect } from 'react'
import { loginUser, removeUser } from '../../Redux/actions/authActions'
import { connect, useSelector, useDispatch } from 'react-redux'
import { Modal, Button } from 'antd'
import Draggable from 'react-draggable'


const DocsEntityModal = (props) => {
    const { selectedCard } = props
    const [visible, setVisible] = useState(false)
    const [disabled, setDisabled] = useState(false)
    const [entities, setEntities] = useState([])
    const [searchText, setsearchText] = useState("")
    useEffect(() => {
        getData()
    })


    const getData = () => {
        const entities = selectedCard?.[0]?.entity
        if (Array.isArray(entities)) setEntities(entities)
    }
    const search = () => {
        let newEntity = entities && entities.filter(d => d?.name?.toLowerCase().indexOf(searchText.toLowerCase().trim()) !== -1)
        setEntities(newEntity)
    }
    const showModal = () => {
        setVisible(true)
    }
    const handleCancel = e => {
        setVisible(false)

    }
    return (
        <div style={{ marginTop: '-20px', marginLeft: '10px' }}>
            <>
                <Button style={{ border: 'none', fontWeight: 'bold', marginLeft: '-25px', height: 'inherit', width: '115px', marginTop: '10px' }} onClick={showModal}>Entity Details :</Button>
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
                        // end
                        >
                            ENTITY Table
                            <div className='wrap'>
                                <div className='search'>
                                    <input type='text' className='searchTerm' placeholder='Search for Entity here?' />
                                    <button type='submit' className='searchButton' >
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
                    // bodyStyle={{ background: 'transparent', backgroundColor: 'none' }}
                    // style={{ background: 'transparent', backgroundColor: 'none' }}
                    modalRender={modal => < Draggable disabled={disabled} > {modal}</Draggable>}
                >
                    <p>
                        <table>
                            <tr>
                                <th>Entity Language</th>
                                <th>Entity Salience</th>
                                <th>Entity Type</th>
                                <th>Entity Name </th>
                                <th>Entity Mention Type </th>
                            </tr>
                            {Array.isArray(entities) && entities.map((d, i) => {

                                let entity_language = d?.entity_language
                                let entity_salience = d?.entity_salience
                                let entity_type = d?.entity_type
                                let entity_name = d?.entity_name
                                let entity_mention_type = d?.entity_mention_type



                                return (
                                    <tr style={{ textTransform: 'capitalize' }}>
                                        {entity_language && <td>
                                            {entity_language}
                                        </td>}
                                        {entity_salience && <td>
                                            {entity_salience}
                                        </td>}
                                        {entity_type && <td>
                                            {entity_type}
                                        </td>}
                                        {entity_name && <td>
                                            {entity_name}
                                        </td>}
                                        {entity_mention_type && <td>
                                            {entity_mention_type}</td>
                                        }
                                    </tr>
                                )
                            })
                            }
                        </table>
                    </p>
                </Modal >
            </>
        </div >
    )
}
export default DocsEntityModal
// class DocsEntityModal extends React.Component {
//     constructor(props) {
//         super(props)
//         this.state = {
//             visible: false,
//             disabled: true,
//             entities: [],
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
//             visible: false,
//         })
//     }

//     componentDidMount = () => {
//         const { selectedCard } = this.props

//         const entities = selectedCard?.[0]?.entity
//         if (Array.isArray(entities)) this.setState({ entities }, () => this.search())
//     }

//     search = () => {
//         const { entities, searchText } = this.state

//         let newEntity = entities && entities.filter(d => d?.name?.toLowerCase().indexOf(searchText.toLowerCase().trim()) !== -1)

//         this.setState({ entities: newEntity })
//     }

//     render() {
//         const { entities } = this.state
//         return (
//             <div style={{ marginTop: '-20px', marginLeft: '10px' }}>
//                 <>
//                     <Button style={{ border: 'none', fontWeight: 'bold', marginLeft: '-25px', height: 'inherit', width: '115px', marginTop: '10px' }} onClick={this.showModal}>Entity Details :</Button>
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
//                                 // fix eslintjsx-a11y/mouse-events-have-key-events
//                                 // https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/master/docs/rules/mouse-events-have-key-events.md
//                                 onFocus={() => { }}
//                                 onBlur={() => { }}
//                             // end
//                             >
//                                 ENTITY Table
//                                 <div className='wrap'>
//                                     <div className='search'>
//                                         <input type='text' className='searchTerm' placeholder='Search for Entity here?' />
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
//                         // bodyStyle={{ background: 'transparent', backgroundColor: 'none' }}
//                         // style={{ background: 'transparent', backgroundColor: 'none' }}
//                         modalRender={modal => < Draggable disabled={this.state.disabled} > {modal}</Draggable>}
//                     >
//                         <p>
//                             <table>
//                                 <tr>
//                                     <th>Entity Language</th>
//                                     <th>Entity Salience</th>
//                                     <th>Entity Type</th>
//                                     <th>Entity Name </th>
//                                     <th>Entity Mention Type </th>
//                                 </tr>
//                                 {Array.isArray(entities) && entities.map((d, i) => {

//                                     let entity_language = d?.entity_language
//                                     let entity_salience = d?.entity_salience
//                                     let entity_type = d?.entity_type
//                                     let entity_name = d?.entity_name
//                                     let entity_mention_type = d?.entity_mention_type



//                                     return (
//                                         <tr style={{ textTransform: 'capitalize' }}>
//                                             {entity_language && <td>
//                                                 {entity_language}
//                                             </td>}
//                                             {entity_salience && <td>
//                                                 {entity_salience}
//                                             </td>}
//                                             {entity_type && <td>
//                                                 {entity_type}
//                                             </td>}
//                                             {entity_name && <td>
//                                                 {entity_name}
//                                             </td>}
//                                             {entity_mention_type && <td>
//                                                 {entity_mention_type}</td>
//                                             }
//                                         </tr>
//                                     )
//                                 })
//                                 }
//                             </table>
//                         </p>
//                     </Modal >
//                 </>
//             </div >
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

// export default connect(mapStateToProps, mapDispatchToProps)(DocsEntityModal)