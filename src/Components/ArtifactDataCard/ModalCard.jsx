import React, { useState, useEffect } from 'react'
import { loginUser, removeUser } from '../../Redux/actions/authActions'
import { connect, useSelector, useDispatch } from 'react-redux'
import { Modal, Button } from 'antd'
import Draggable from 'react-draggable'
import TranscriptCardData from '../SelectedCard/TranscriptCardData'



const ModalCard = (props) => {
  const { selectedCard } = props
  const [visible, setVisible] = useState(false)
  const [disable, setDisable] = useState(true)
  let transcript = selectedCard?.transcript
  const showModal = () => {
    setVisible(true)
  }

  const handleCancel = e => {
    setVisible(false)
  }
  return (
    <div style={{ height: 'auto' }}>
      <>
        {Boolean(transcript?.length) && <Button className='modalbtn' onClick={showModal}>Show Transcript</Button>}
        {Boolean(visible) && (
          <Modal
            title={
              <div
                style={{
                  width: '100%',
                  cursor: 'pointer',
                }}
                onFocus={() => { }}
                onBlur={() => { }}
              >
                Transcript
              </div>
            }
            visible={true}
            footer={null}
            onCancel={handleCancel}
            width='600'
            modalRender={modal => <Draggable disabled={disable}>{modal}</Draggable>}
          >
            <p>
              <TranscriptCardData  {...props} />
            </p>
          </Modal>
        )}
      </>
    </div>
  )
}
export default ModalCard
// class ModalCard extends React.Component {
//   constructor(props) {
//     super(props)
//     this.state = {
//       visible: false,
//       disabled: true
//     }
//   }

//   showModal = () => {
//     this.setState({
//       visible: true,
//     })
//   }

//   handleCancel = e => {
//     this.setState({
//       visible: false,
//     })
//   }

//   render() {
//     const { selectedCard } = this.props
//     let transcript = selectedCard?.transcript
//     return (
//       <div style={{ height: 'auto' }}>
//         <>
//           {Boolean(transcript?.length) && <Button className='modalbtn' onClick={this.showModal}>Show Transcript</Button>}
//           {Boolean(this.state.visible) && (
//             <Modal
//               title={
//                 <div
//                   style={{
//                     width: '100%',
//                     cursor: 'pointer',
//                   }}
//                   onMouseOver={() => {
//                     if (this.state.disabled) {
//                       this.setState({
//                         disabled: false,
//                       })
//                     }
//                   }}
//                   onMouseOut={() => {
//                     this.setState({
//                       disabled: true,
//                     })
//                   }}
//                   onFocus={() => { }}
//                   onBlur={() => { }}
//                 >
//                   Transcript
//                 </div>
//               }
//               visible={true}
//               footer={null}
//               onCancel={this.handleCancel}
//               width='600'
//               modalRender={modal => <Draggable disabled={this.state.disabled}>{modal}</Draggable>}
//             >
//               <p>
//                 <TranscriptCardData  {...this.props} />
//               </p>
//             </Modal>
//           )}
//         </>
//       </div>
//     )
//   }
// }

// const mapStateToProps = (state) => {
//   return {
//     user: state.authReducer.user,
//     selectedKey: state.authReducer.selectedKey,
//     artifactData: state.authReducer.artifactData

//   }
// }

// const mapDispatchToProps = (dispatch) => {
//   return {
//     loginUser: (user) => dispatch(loginUser(user)),
//     removeUser: () => dispatch(removeUser())
//   }
// }

// export default connect(mapStateToProps, mapDispatchToProps)(ModalCard)