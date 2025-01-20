import { Spin } from 'antd'
import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import SelectedCardData from '../SelectedCard/SelectedCardData'

const SelectedDocument = (props) => {
    const { backAction, closeModal } = props
    const location = useLocation();
    let artifactData = location.state?.artifactData;
    let submissionName = location.state?.submissionName;
    let submissionId = location.state?.submissionId;
    const [hasRequiredData, setHasRequiredData] = useState(true)
    // let artifactData = useSelector(store => store?.artifactReducer?.artifactData || {})

    artifactData = props?.artifactData || artifactData

    useEffect(() => {
        let requiredData = (artifactData &&
            (artifactData?.id || artifactData?.artifact_id)
            && artifactData?.original_file_name
            && artifactData?.file_address)

        setHasRequiredData(requiredData)

        if (!hasRequiredData) {
            console.log('DONT HAVE REQUIRED DATA', requiredData, artifactData)
        }
    }, [])

    return (
        artifactData ? <div>
            <div style={{ height: '100%' }}>
                <div style={{ height: '100%' }}>
                    <div style={{ margin: 'auto', height: '100%' }}>
                        <SelectedCardData
                            goBack={backAction || closeModal}
                            {...props}
                            selectedCard={artifactData}
                            submissionName={submissionName}
                            submissionId={submissionId}
                        />
                    </div>
                </div>
            </div>
        </div> : <div className='card-div' style={{ display: 'flex', height: '91vh', justifyContent: 'center', alignItems: 'center' }}>
            <Spin size='large' />
        </div>
    )
}

export default SelectedDocument