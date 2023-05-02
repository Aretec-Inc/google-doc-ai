import React from 'react'
import { saveAs } from 'file-saver'
import { Menu, Dropdown, message } from 'antd'
import {  DownloadOutlined } from '@ant-design/icons'

const DownloadButton = ({ selectedCard }) => {


    const downloadFile = (type) => {

        if (type == "redacted") {
            if (selectedCard?.redacted_file_address) {
                saveAs(selectedCard?.redacted_file_address, `redacted-${selectedCard?.original_artifact_name}`)
            }
            else {
                message.error({ content: "Redacted file link not found.", duration: 3 })
            }

        }
        else {
            saveAs(selectedCard?.original_file_address || selectedCard?.file_address, selectedCard?.original_artifact_name)
        }
    }


    const menu = () => {
        let artifact_type = selectedCard?.artifact_type

        return <Menu >
            <Menu.Item>
                <p style={{ margin: 0 }} onClick={() => downloadFile()}>
                    {`Download ${artifact_type?.toUpperCase()}`}
                </p>
            </Menu.Item>
            {/* {artifact_type?.toLowerCase() === 'pdf' ? <Menu.Item>
                <p style={{ margin: 0 }} onClick={() => downloadFile("redacted")}>
                    Download Redacted PDF
                </p>
            </Menu.Item> : null} */}
        </Menu>
    }
    const icon_style = { color: "rgb(0, 128, 247)" }

    return (
        <Dropdown overlay={menu} placement="bottomLeft">
            <DownloadOutlined style={{ fontSize: 30, ...icon_style }} className='MaterialIcons myHeaderIcons' />
        </Dropdown>

    )
}

export default DownloadButton
