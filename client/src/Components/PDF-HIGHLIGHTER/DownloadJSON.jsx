import React, { useEffect, useState } from 'react'
import CodeEditor from './CodeEditorForJSON.jsx'
import PropTypes from 'prop-types'
import { Button } from 'antd'
import { DownloadOutlined } from '@ant-design/icons'
import { Icon_Blue_Color } from '../../utils/pdfConstants'
import { saveAs } from 'file-saver'

const DownloadJSON = ({ json }) => {
    const [prettyJSON, setPrettyJSON] = useState('{}')

    const [isDownloading, setIsDownloading] = useState(false)

    useEffect(() => {
        // let setCodeLater=null
        let beautifiedJSON = JSON.stringify(json, null, '\t') //Beautify code by adding /t on each line
        setPrettyJSON(beautifiedJSON)
    }, [])

    const DownloadNow = () => {
        setIsDownloading(true)
        var stringifiedJson = JSON.stringify(json)
        var blob = new Blob([stringifiedJson], { type: 'application/json' })
        
        saveAs(blob, 'pdfJSON.json')
        setTimeout(() => {
            setIsDownloading(false)

        }, 500)
    }
    return (
        <div style={{ overflow: 'hidden', background: '#f5f5f5' }}>
            <Button
                style={{ margin: 50, background: Icon_Blue_Color, float: 'right', color: `white`, fontWeight: 'bold' }}
                size={20}
                onClick={DownloadNow}
                loading={isDownloading}
                type='dashed'
                shape='round'
                icon={<DownloadOutlined />}
            // size='large'
            >
                Download
        </Button>
            <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                <div style={{ width: '95%', minHeight: 600, height: '80%', overflow: 'auto' }}>
                    <div style={{ borderRadius: 20, overflow: 'hidden' }}>
                        <CodeEditor json={prettyJSON} />
                    </div>
                </div>
            </div>
        </div>
    )
}

DownloadJSON.propTypes = {
    json: PropTypes.object.isRequired
}

export default DownloadJSON