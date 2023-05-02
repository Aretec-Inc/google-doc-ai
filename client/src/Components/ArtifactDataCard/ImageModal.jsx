import React from 'react'
import { Modal } from 'antd'
import { CloseOutlined } from '@ant-design/icons'
import Draggable from 'react-draggable'
const responsiveHeight = window.innerHeight || 880

const ImageModal = (props) => {
    const { image_url, onClose } = props

    return (
        <Modal
            visible={true}
            footer={null}
            header={null}
            width='8000'
            keyboard={true}
            closeIcon={<CloseOutlined style={{ color: ' #57a8f3' }} />}
            onCancel={() => {
                if (typeof onClose == 'function') {
                    onClose()
                }
            }}
            style={{ minWidth: 100, maxWidth: 800, width: '50%', background: 'transparent', objectFit: 'cover' }}
            height='100%'
            bodyStyle=
            {{ padding: 0, margin: 0 }}
            modalRender={modal => <Draggable >{modal}</Draggable>}
        >
            <div style={{ objectFit: 'cover', }}>
                <img style={{ height: responsiveHeight / 2, marginLeft: 'auto', marginRight: 'auto', objectFit: 'cover', width: '100%' }} src={image_url} />
            </div>
        </Modal>
    )
}

export default ImageModal