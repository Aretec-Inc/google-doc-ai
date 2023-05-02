import React, { useEffect, useState } from 'react'
import { loginUser, removeUser } from '../../Redux/actions/authActions'
import { removeArtifactData } from '../../Redux/actions/artifactActions'
import { connect, useSelector, useDispatch } from 'react-redux'
import { Comments } from '../../Components'

const TranscriptCardData = (props) => {
    const { selectedCard } = props
    const [showComments, setShowComments] = useState(false)
    const [file_name, setFileName] = useState("")
    const [transData, setTransData] = useState("")
    const user = useSelector((state) => state.authReducer.user)
    const selectedKey = useSelector((state) => state.authReducer.selectedKey)
    const artifactData = useSelector((state) => state.authReducer.artifactData)
    const dispatch = useDispatch()
    useEffect(() => {
        getData()
    })
    const getData = () => {
        const transcriptt = selectedCard?.transcript || selectedCard?.sph_to_txt_link
        if (selectedCard && transcriptt) {
            setTransData(transcriptt)
            dispatch(loginUser(user))
            // dispatch(removeUser())
            dispatch(removeArtifactData())
        }
    }
    const renderTranscript = () => {
        return Array.isArray(transData) ? (
            transData?.map(d => (
                <p>
                    {d?.transcript}
                </p>
            ))
        ) : (
            <p>{JSON.stringify(transData)}</p>
        )
    }
    return (
        <div className='card-div'>
            {showComments ? <Comments visible={showComments} file_name={file_name} closeDrawer={() => this.setState({ showComments: false })} /> : null}
            <div
                style={{ width: '100%' }}
            >
                <div className='container-box container-div'>
                    {(Boolean(transData) && transData?.length) ? (
                        renderTranscript()
                    ) : (<p>No Transcript Found</p>)
                    }
                </div>
            </div>
        </div >
    )
}
export default TranscriptCardData

// class TranscriptCardData extends React.Component {
//     constructor(props) {
//         super(props)
//         const { selectedCard, freqWord } = this.props
//         this.state = {
//             detailTabs: ['General', 'Insights', 'Transcripts', 'Similar', 'General', 'Insights', 'Transcripts', 'Similar'],
//             loading: !Boolean(Object.keys(selectedCard).length),
//             selectedCard,
//             freqWord,
//             showComments: false,
//             file_name: '',
//             transData: ''
//         }
//     }

//     componentDidMount() {
//         this.getData()
//     }

//     getData = () => {
//         const { selectedCard } = this.props
//         const transcriptt = selectedCard?.transcript || selectedCard?.sph_to_txt_link
//         if (selectedCard && transcriptt) {
//             console.log("transcript1", transcriptt)
//             this.setState({ transData: transcriptt })
//         }
//     }
//     renderTranscript = () => {
//         const { transData } = this.state
//         return Array.isArray(transData) ? (
//             transData.map(d => (
//                 <p>
//                     {d?.transcript}
//                 </p>
//             ))
//         ) : (
//             <p>{JSON.stringify(transData)}</p>
//         )
//     }
//     render() {
//         const { showComments, file_name, transData } = this.state
//         return (
//             <div className='card-div'>
//                 {showComments ? <Comments visible={showComments} file_name={file_name} closeDrawer={() => this.setState({ showComments: false })} /> : null}
//                 <div

//                     style={{ width: '100%' }}
//                 >
//                     <div className='container-box container-div'>
//                         {(Boolean(transData) && transData?.length) ? (
//                             this.renderTranscript()
//                         ) : (<p>No Transcript Found</p>)
//                         }
//                     </div>
//                 </div>
//             </div >
//         )
//     }
// }

// const mapStateToProps = (state) => {
//     return {
//         user: state.authReducer.user,
//         selectedKey: state.authReducer.selectedKey,
//         artifactData: state.artifactReducer.artifactData,

//     }
// }

// const mapDispatchToProps = (dispatch) => {
//     return {
//         loginUser: (user) => dispatch(loginUser(user)),
//         removeUser: () => dispatch(removeUser()),
//         removeArtifactData: () => dispatch(removeArtifactData())
//     }
// }
// export default connect(mapStateToProps, mapDispatchToProps)(TranscriptCardData)