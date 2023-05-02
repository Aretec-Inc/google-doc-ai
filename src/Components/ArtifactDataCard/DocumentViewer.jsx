import React, { useState, useEffect, useRef } from 'react'

const DocumentViewer = ({ url }) => {
    const frameRef = useRef(null)
    const [emulateLoading, setEmulateLoading] = useState(true)
    
    useEffect(() => {
        var emulatedTimeout = null
        clearTimeout(emulatedTimeout)
        emulatedTimeout = setTimeout(() => {
            setEmulateLoading(false)
        }, 100)
        return () => clearTimeout(emulatedTimeout)

    }, [])

    return (
        <div>
            {!emulateLoading && <iframe loading="lazy" ref={frameRef} height="100%" width="100%" style={{ height: '100vh' }} frameBorder="0" src={`https://docs.google.com/gview?embedded=true&url=${url}`} >
                YOUR BROWSER DOESNT SUPPORT DOCS
            </iframe>}
        </div>
    )
}

DocumentViewer.defaultProps = {
    url: "gs://context_primary/document/NotProcessed/doc-679fe53a-83f8-4f15-b716-30a246c66496-GDB English 101.docx"
}

export default DocumentViewer