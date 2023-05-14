import React, { useEffect, useRef, useState } from 'react'
import { loginUser } from '../../Redux/actions/authActions'
import { removeArtifactData } from '../../Redux/actions/artifactActions'
import { useSelector, useDispatch } from 'react-redux'
import { Tooltip } from 'antd'
import { ARTIFACT } from '../../utils/apis'
import { secureApi } from '../../Config/api'


const TranscriptAudio = (props) => {
    const { selectedCard } = props
    const user = useSelector((state) => state.authReducer.user)
    const [transData, setTransData] = useState(null)
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()
    // console.log(transData?.map(v => v.word), "TRABSSSSSSSSSS20")
    useEffect(() => {
        getData()
    }, [])

    let startSeek = Number(0)


    const renderAudioBadges = (arrayOfObjects, duration) => {
        return Array.isArray(arrayOfObjects) && arrayOfObjects.map((d, i) => {
            // console.log(d?.alternatives[0].transcript, "==> transcript")
            let start_time = startSeek && parseFloat(startSeek).toFixed(2)
            let end_time = d?.resultEndTime.seconds && parseFloat(d?.resultEndTime.seconds).toFixed(2)

            startSeek = Number(end_time) + 0.01
            return (<Tooltip key={i}
                title={`${start_time} - ${end_time}`}>
                <span style={duration >= start_time && duration <= end_time ? {backgroundColor: "#f9f9f9", color: "#1E90FF", fontWeight: "bold"} : {backgroundColor: "#fff", color: "black"}} onClick={() => seekTo(start_time)}>{d?.alternatives[0].transcript}</span>&emsp;
            </Tooltip>)
        }
        )
    }

    console.log(props?.currentDuration, "duration")

    const getData = () => {
        if (selectedCard) {
            let file_name = selectedCard?.file_name
            secureApi.get(`${ARTIFACT.GET.AUDIO_TRANSCRIPT}?file_name=${file_name}`)
                .then((data) => {
                    if (data?.success) {
                        setTransData(data?.data)
                        props.getTransData(data?.data)
                        setLoading(true)
                        // dispatch(loginUser(user))
                        // dispatch(removeUser())
                        // dispatch(removeArtifactData())
                        // console.log(data, "51TAUDIO")
                    } else {
                        let errMsg = data?.message;
                        errMsg && console.log("errMsg", errMsg)
                    }
                })
        }
    }
    const seekTo = (time) => {
        props.setTime(time)
    }

    return (
        <div style={{ width: '100%' }}>
            <div style={{ width: '100%' }} >
                {transData &&
                    <div style={{ padding: 20, alignItems: 'flex-start' }}>
                        <h3 style={{ fontWeight: 'bold' }}>Transcript</h3>
                        <p style={{ textAlign: "justify" }}>{renderAudioBadges(transData, props?.currentDuration)}</p>
                    </div>
                }
            </div>
        </div>
    )
}
export default TranscriptAudio
// class TranscriptAudio extends React.Component {
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
//             transData: null
//         }
//     }

//     componentDidMount() {
//         this.getData()
//     }
//     seekTo = (time) => {
//         this.props.setTime(time)
//     }

//     renderAudioBadges = (arrayOfObjects) => {
//         return Array.isArray(arrayOfObjects) && arrayOfObjects.map((d, i) => {

//             let start_time = d?.start_time && parseFloat(d?.start_time).toFixed(2)
//             let end_time = d?.end_time && parseFloat(d?.end_time).toFixed(2)

//             return (<Tooltip key={i}
//                 title={`${start_time} - ${end_time}`}>
//                 <b onClick={() => this.seekTo(d.start_time)} >{d?.word}</b>&emsp;
//             </Tooltip>)
//         }
//         )
//     }


//     getData = () => {
//         const { selectedCard } = this.props

//         if (selectedCard) {
//             let file_name = selectedCard?.file_name
//             secureApi.get(`/api/artifact/audio_transcript?file_name=${file_name}`)
//                 .then((data) => {
//                     if (data.success) {
//                         this.setState({ transData: data.data, loading: true })
//                     }
//                 })
//         }
//     }

//     render() {
//         const { transData } = this.state
//         return (
//             <div style={{ width: '100%' }}>
//                 <div

//                     style={{ width: '100%' }}
//                 >
//                     {transData &&
//                         <div style={{ padding: 20, alignItems: 'flex-start' }}>
//                             <h3 style={{ fontWeight: 'bold' }}>Transcript</h3>
//                             <p>{this.renderAudioBadges(transData)}</p>
//                         </div>}
//                 </div>
//             </div>
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



// export default connect(mapStateToProps, mapDispatchToProps)(TranscriptAudio)