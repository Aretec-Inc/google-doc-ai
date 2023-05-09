import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import SelectedCardData from '../SelectedCard/SelectedCardData'
import { Spin } from 'antd'

const SelectedDocument = (props) => {
    const { graphFileView, backAction, closeModal } = props
    const [hasRequiredData, setHasRequiredData] = useState(true)
    let artifactData = useSelector(store => store?.artifactReducer?.artifactData || {})

    artifactData = props?.artifactData || artifactData

    console.log('artifactData', artifactData)

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