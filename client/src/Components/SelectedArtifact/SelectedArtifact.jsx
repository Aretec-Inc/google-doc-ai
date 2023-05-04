import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import SelectedCardData from '../SelectedCard/SelectedCardData'
import { Spin } from 'antd'

const SelectedArtifact = (props) => {
    const { graphFileView, backAction, closeModal } = props
    const [hasRequiredData, setHasRequiredData] = useState(true)
    let artifactData = useSelector(store => store?.artifactReducer?.artifactData || {})

    artifactData = props?.artifactData || artifactData

    useEffect(() => {
        let requiredData = (artifactData &&
            (artifactData?.id || artifactData?.artifact_id)
            && artifactData?.original_artifact_name
            && artifactData?.file_address)

        setHasRequiredData(requiredData)

        if (!hasRequiredData) {
            console.log('DONT HAVE REQUIRED DATA', requiredData, artifactData)
        }
    }, [])

    return (
        artifactData ? (hasRequiredData ? (
            <div>
                <div style={{ height: '100%' }}>
                    <div style={{ height: '100%' }}>
                        <div style={{ margin: 'auto', height: '100%' }}>
                            <SelectedCardData
                                goBack={backAction || closeModal}
                                {...props}
                                graphFileView={graphFileView}
                                selectedCard={artifactData}
                            />
                        </div>
                    </div>
                </div>
            </div>) : (//show loading when data is not available
            <div className='card-div' style={{ display: 'flex', height: '91vh', justifyContent: 'center', alignItems: 'center' }}>
                <Spin size='large' />
            </div>
        )) : <div><h2>Sorry! File has been removed or renamed :( </h2></div>
    )
}

export default SelectedArtifact