
import React, { useState } from 'react'
import { FaUpload } from "react-icons/fa";
import { Button, Input, Divider } from 'antd';


const Configuration = (props) => {
  return (
    <div className='template-screen'>
      <div className='confgi-screen'>
        <h3>Configuration</h3>
      </div>
      <div className='add_configuration'>
        <Button style={{ background: '#4285F4', color: '#fff', borderRadius: '4px' }} className='date width-sub height_57px'>
          Add Configuration
        </Button>
        <div className="config-grid-container">
          <div className="config-grid-item">
            <div className='each_card'>
              <h4>CONFIGURATION CARD</h4>
              <Divider />
              <div>
                This is the descripiton
              </div>
            </div>
          </div>
          <div className="config-grid-item">
            <div className='each_card'>
              <h4>CONFIGURATION CARD</h4>
              <Divider />
              <div>
                This is the descripiton
              </div>
            </div>
          </div>
          <div className="config-grid-item">
            <div className='each_card'>
              <h4>CONFIGURATION CARD</h4>
              <Divider />
              <div>
                This is the descripiton
              </div>
            </div>
          </div>
          <div className="config-grid-item">
            <div className='each_card'>
              <h4>CONFIGURATION CARD</h4>
              <Divider />
              <div>
                This is the descripiton
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='config-fields'>
        <div className='config-fields-main'>
          <span>Project ID</span>
          <Input className='input-confgi' placeholder="Basic usage" />
          <Button style={{ background: '#4285F4', color: '#fff', borderRadius: '4px', marginLeft: '100px' }} className='date width-sub height_57px'>
            Doc Warehouse</Button>
        </div>
        <div className='config-fields-main'>
          <span>Service Account</span>
          <Input className='input-confgi' placeholder="Basic usage" />
          <Button style={{ background: '#4285F4', color: '#fff', width: '60px', borderRadius: '4px' }} className='date width-sub height_57px'>
            <FaUpload /> </Button>
        </div>
        <div className='config-fields-main'>
          <span>Service Account</span>
          <Input className='input-confgi' placeholder="Basic usage" />
        </div>
        <div className='config-save'>
          <Button style={{ background: '#4285F4', color: '#fff', borderRadius: '4px' }} className='date width-sub height_57px'>
            Doc Warehouse</Button>
        </div>
      </div>
    </div>
  )
}

export default Configuration