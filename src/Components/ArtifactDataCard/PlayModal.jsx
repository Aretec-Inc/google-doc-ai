import React, { useRef, useEffect, useState } from 'react'
import { Modal } from 'antd'
import { CloseOutlined } from '@ant-design/icons'
import QierPlayer from 'qier-player'
import { Badge, Tooltip } from 'antd'

const responsiveHeight = window.innerHeight || 880

function PlayModal(props) {
    const videoRef = useRef()
    var [videoLoaded, setVideoLoaded] = useState(false)
    var [time, setTime] = useState(0)
    var [currentTime, setCurrentTime] = useState(0)
    const [seeAllLabels, setSeeAllLabels] = useState(false)
    const [seeAllLogos, setSeeAllLogos] = useState(false)

    const { video_url, onClose, selectedCard } = props

    useEffect(() => {
    }, [videoLoaded])

    let isLoaded = () => videoRef?.current?.videoRef?.current?.addEventListener('loadedmetadata', () => setVideoLoaded(true))
    let setVidTime = () => videoRef.current.videoRef.current.currentTime = time

    useEffect(() => {
        if (videoRef?.current?.videoRef?.current) {
            if (time > 0) {
                setVidTime()
            }
            if (!videoLoaded) {
                isLoaded()
            }
        }
    }, [videoRef?.current?.videoRef?.current, videoLoaded, time])

    useEffect(() => {
        const interval = setInterval(() => {
            if (videoLoaded && videoRef?.current?.videoRef?.current?.currentTime) {
                setCurrentTime(videoRef?.current?.videoRef?.current?.currentTime)
            }
        }, 500)
        return () => clearInterval(interval)
    }, [videoLoaded])

    const seekTo = (object) => {
        let start_time = parseFloat(object?.start_time)

        setTime(start_time)
        

    }

    const renderBadges = (arrayOfObjects) => {
        return Array.isArray(arrayOfObjects) && arrayOfObjects.map((d, i) => {

            let originalStartTime = parseFloat(d?.start_time)
            let originalEndTime = parseFloat(d?.end_time)
            let start_time = originalStartTime && new Date(originalStartTime * 1000)?.toISOString()?.substr(14, 5)
            let end_time = originalEndTime && new Date(originalEndTime * 1000)?.toISOString()?.substr(14, 5)
            let isCurrentlyPlaying = (currentTime >= originalStartTime && currentTime <= originalEndTime)

            return (<Tooltip key={i}
                title={`${start_time} - ${end_time}`}>
                <Badge onClick={() => seekTo(d)} className={isCurrentlyPlaying ? 'artifact_videModal_badges artifact_videModal_badges_currentFoxus' : 'artifact_videModal_badges'} count={`${d?.name}`} />
            </Tooltip>)
        }
        )
    }


    let filterRequiredData = (arrayOfObjects) => arrayOfObjects && arrayOfObjects.filter(d => d?.start_time && d?.end_time && d.name)
    const labels = filterRequiredData(selectedCard?.label)
    const logos = filterRequiredData(selectedCard?.logo)

    let notShowingAllLAbels = (labels?.length > 10 && !seeAllLabels)
    let finalLabels = notShowingAllLAbels ? labels.splice(0, 10) : labels

    let notShowingAllLogos = (labels?.length > 10 && !seeAllLogos)
    let finalLogos = notShowingAllLogos ? logos.splice(0, 10) : logos

    return (
        <Modal
            className='artifact_videModal'
            visible={true}
            footer={null}
            header={null}
            closeIcon={<CloseOutlined style={{ color: ' #57a8f3' }} />}
            keyboard={true}
            onCancel={() => {
                if (typeof onClose == 'function') {
                    onClose()
                }
            }}
            style={{ maxWidth: 1000, width: '100%', background: 'transparent' }}
            height='100%'
            bodyStyle=
            {{ padding: 0, margin: 0, background: 'transparent' }}
            maskStyle={{ backgroundColor: 'rgba(255, 255, 255, .95)' }}
        >
            <QierPlayer
                ref={videoRef}
                width={'100%'}
                height={(responsiveHeight / 1.5)}
                language='en'
                showVideoQuality={false}
                autoplay={true}
                themeColor='#57a8f3'
                src480p={false}
                src720p={false}
                srcOrigin={`${video_url}`}
            />
            {((labels?.length || logos?.length) && videoLoaded) ?
                <div style={{ padding: 20, position: 'absolute' }}>
                    {labels.length ? <p className='videoLabelTitle'>LABELS</p> : null}

                    {labels?.length ? renderBadges(finalLabels) : null}
                    {labels?.length > 10 && <span onClick={() => setSeeAllLabels(!seeAllLabels)} style={{ textShadow: 'none', cursor: 'pointer' }} className='videoLabelTitle'>See {seeAllLabels ? 'Less' : 'More ...'} </span>}
                    {logos?.length ? <p className='videoLabelTitle'>LOGOS</p> : null}
                    {logos?.length ? renderBadges(finalLogos) : null}
                    {logos?.length > 10 && <span onClick={() => setSeeAllLogos(!seeAllLogos)} style={{ textShadow: 'none', cursor: 'pointer' }} className='videoLabelTitle'>See {seeAllLogos ? 'Less' : 'More ...'}</span>}
                </div> : null}
        </Modal>
    )
}

export default PlayModal