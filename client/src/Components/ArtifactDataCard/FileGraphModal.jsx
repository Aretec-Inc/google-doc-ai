import React, { useState, useEffect } from 'react'
import { Button, Modal, Switch } from 'antd'
import Neo4jGraph from '../../Screens/Neo4jGraph/index'

const FileGraphModal = ({ visible, onCancel, fileArtifactData }) => {
    return (
        <Modal width={1000} bodyStyle={{ height: "650px" }} destroyOnClose footer={null} title="File Graph" visible={visible} onCancel={onCancel}>
            <Neo4jGraph styleProp={{ height: "100%" }} file_name={fileArtifactData?.file_name} />
        </Modal>
    )
}

export default FileGraphModal
