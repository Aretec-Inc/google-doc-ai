import React from 'react'
import PDFVIEWER from '../PDF-HIGHLIGHTER'

function DisplayBox(props) {
    const { selectedCard } = props

    return (
        <div style={{ display: 'flex', flex: 2, flexDirection: 'column', justifyContent: 'flex-start', }} onClick={() => { /*if(typeof props?.onClick =='function') props,onClick()*/ }}>
            <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div id="displayBox" className='artifactDataCardPreviewSimple' >
                    <div style={{ height: '100%', width: '100%', borderRadius: 20, marginBottom: 10, overflow: 'hidden' }}>
                        <PDFVIEWER maxWidth={'80vw'} enableShadow artifactData={selectedCard} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DisplayBox