
// import React, { useEffect, useState } from 'react'
// import { Button, Input, Divider, Modal, Form, Select, Slider } from 'antd'
// import SETTING_ICON from '../../assets/icons/secondary_head_icons/settingblack.svg'

// const Configuration = (props) => {
//   const [isOpen, setIsOpen] = useState(false)
//   // const [form, setForm] = useState()
//   const [config, setConfig] = useState([
//     {
//       project_id: "Project-1",
//       service_account: "Service-1",
//       threshold: 31
//     },
//     {
//       project_id: "Project-2",
//       service_account: "Service-2",
//       threshold: 76
//     }
//   ])
//   const formatter = (value) => `${value}%`
//   const [form] = Form.useForm();

//   useEffect(() => {
//     console.log('use Effect')
//   }, [config])
//   console.log('CONFIG ===>', config)

//   const getServiceAccount = (value) => {
//     console.log("service account ==>", value)
//   }

//   const getProjectID = (value) => {
//     console.log("PROJECT ID ==>", value)
//   }


//   const handleOk = () => {
//     form.submit()
//     // form.resetFields()
//   }

//   const onFinish = (values) => {
//     config?.push(values)
//     setIsOpen(false)
//     form.resetFields()
//   }

//   return (
//     <div className='template-screen'>
//       <div className='secondary_header_container'>
//         <div className='left_sec_head'>
//           <div className='secondary_header_left'>
//             <img width={'30px'} src={SETTING_ICON} alt='SETTING_ICON' />
//             <h2 className='secondary_header_heading'>
//               Configurations
//             </h2>
//           </div>
//           <h2 className='secondary_header_heading'>
//             Services
//           </h2>
//           <Button type='text' className='secondary_header_buttons mg_lft_4rem' onClick={() => setIsOpen(true)}>
//             <span className="material-symbols-outlined">
//               add
//             </span>
//             <span>
//               Add Configuration
//             </span>
//           </Button>
//         </div>
//         <div className='right_sec_head'>
//           <Button type='text' className='secondary_header_buttons'>
//             <span className="material-symbols-outlined mg_rgt_3px">
//               chat
//             </span>
//             <span>
//               Help Assistant
//             </span>
//           </Button>
//           <Button type='text' className='secondary_header_buttons'>
//             <span className="material-symbols-outlined mg_rgt_3px">
//               school
//             </span>
//             <span>
//               Learn
//             </span>
//           </Button>
//         </div>
//       </div>
//       <Divider />
//       {/* <div className='confgi-screen'>
//         <h3>Configuration</h3>
//       </div> */}
//       <div className='add_configuration'>
//         {/* <Button style={{ background: '#4285F4', color: '#fff', borderRadius: '4px' }} className='date width-sub height_57px'>
//           Add Configuration
//         </Button> */}
//         <div className="config-grid-container">
//           {config?.map((v, i) => {
//             return (
//               <div className="config-grid-item">
//                 <div className='each_card'>
//                   <h4>CONFIGURATION CARD-{i}</h4>
//                   <Divider />
//                   <div>
//                     Project ID: {v?.project_id}
//                     <br />
//                     Service Account: {v?.service_account}
//                     <br />
//                     Threshold
//                     <Slider
//                       tooltip={{
//                         formatter,
//                       }}
//                     />
//                   </div>
//                 </div>
//               </div>
//             )
//           })}
//           {/* <div className="config-grid-item">
//             <div className='each_card'>
//               <h4>CONFIGURATION CARD</h4>
//               <Divider />
//               <div>
//                 This is the descripiton
//               </div>
//             </div>
//           </div>
//           <div className="config-grid-item">
//             <div className='each_card'>
//               <h4>CONFIGURATION CARD</h4>
//               <Divider />
//               <div>
//                 This is the descripiton
//               </div>
//             </div>
//           </div>
//           <div className="config-grid-item">
//             <div className='each_card'>
//               <h4>CONFIGURATION CARD</h4>
//               <Divider />
//               <div>
//                 This is the descripiton
//               </div>
//             </div>
//           </div>
//           <div className="config-grid-item">
//             <div className='each_card'>
//               <h4>CONFIGURATION CARD</h4>
//               <Divider />
//               <div>
//                 This is the descripiton
//               </div>
//             </div>
//           </div> */}
//         </div>
//       </div>
//       {/* <div className='config-fields'>
//         <div className='config-fields-main'>
//           <span>Project ID</span>
//           <Input className='input-confgi' placeholder="Basic usage" />
//           <Button style={{ background: '#4285F4', color: '#fff', borderRadius: '4px', marginLeft: '100px' }} className='date width-sub height_57px'>
//             Doc Warehouse</Button>
//         </div>
//         <div className='config-fields-main'>
//           <span>Service Account</span>
//           <Input className='input-confgi' placeholder="Basic usage" />
//           <Button style={{ background: '#4285F4', color: '#fff', width: '60px', borderRadius: '4px' }} className='date width-sub height_57px'>
//             <FaUpload /> </Button>
//         </div>
//         <div className='config-fields-main'>
//           <span>Service Account</span>
//           <Input className='input-confgi' placeholder="Basic usage" />
//         </div>
//         <div className='config-save'>
//           <Button style={{ background: '#4285F4', color: '#fff', borderRadius: '4px' }} className='date width-sub height_57px'>
//             Doc Warehouse</Button>
//         </div>
//       </div> */}
//       <>
//         <Modal
//           className='add_config_modal'
//           title="Add Configuration(s)"
//           centered
//           open={isOpen}
//           onOk={() => setIsOpen(false)}
//           onCancel={() => setIsOpen(false)}
//           footer={
//             <div className='footer_modal'>
//               <Button type='text' className='secondary_header_buttons mg_lft_4rem' onClick={props.onCancel}>
//                 Cancel
//               </Button>
//               <Button type='text' className='secondary_header_buttons mg_lft_4rem' key="submit" htmlType="submit" onClick={handleOk}>
//                 <span className="material-symbols-outlined">
//                   add
//                 </span>
//                 <span>
//                   Add Configuration
//                 </span>
//               </Button>
//             </div>
//           }
//         >
//           <div>
//             {/* <Form
//               layout='vertical'
//               ref={(e) => setForm(e)}
//               encType='multipart/form-data'
//               initialValues={{
//                 remember: true
//             }}
//               style={{
//                 maxWidth: 600,
//               }}
//               onFinish={addConfig}
//             >
//               <Form.Item label="Project ID">
//                 <Select onChange={getProjectID}>
//                   <Select.Option value="Project-1">Project-1</Select.Option>
//                   <Select.Option value="Project-2">Project-2</Select.Option>
//                   <Select.Option value="Project-3">Project-3</Select.Option>
//                   <Select.Option value="Project-4">Project-4</Select.Option>
//                   <Select.Option value="Project-5">Project-5</Select.Option>
//                 </Select>
//               </Form.Item>
//               <Form.Item label="Service Account">
//                 <Select onChange={getServiceAccount}>
//                   <Select.Option value="Service-1">Service-1</Select.Option>
//                   <Select.Option value="Service-2">Service-2</Select.Option>
//                   <Select.Option value="Service-3">Service-3</Select.Option>
//                   <Select.Option value="Service-4">Service-4</Select.Option>
//                   <Select.Option value="Service-5">Service-5</Select.Option>
//                 </Select>
//               </Form.Item>
//               <Form.Item>
//                 <Button type='text' htmlType="submit" className='secondary_header_buttons mg_lft_4rem'>
//                   <span className="material-symbols-outlined">
//                     add
//                   </span>
//                   <span>
//                     Add Configuration
//                   </span>
//                 </Button>
//               </Form.Item>
//             </Form> */}
//             <div>
//               <Form
//                 name='Register'
//                 hideRequiredMark
//                 initialValues={{
//                   remember: true
//                 }}
//                 form={form}
//                 layout='vertical'
//                 encType='multipart/form-data'
//                 onFinish={onFinish}

//               // ref={(e) => setForm(e)}
//               >
//                 <div>
//                   <Form.Item
//                     label='Project ID'
//                     name='project_id'
//                     hasFeedback
//                     rules={[
//                       {
//                         required: true,
//                         message: 'project id is required'
//                       }
//                     ]}
//                   >
//                     <Select onChange={getProjectID}>
//                       <Select.Option value="Project-1">Project-1</Select.Option>
//                       <Select.Option value="Project-2">Project-2</Select.Option>
//                       <Select.Option value="Project-3">Project-3</Select.Option>
//                       <Select.Option value="Project-4">Project-4</Select.Option>
//                       <Select.Option value="Project-5">Project-5</Select.Option>
//                     </Select>
//                   </Form.Item>
//                   <Form.Item
//                     label='Service Account'
//                     name='service_account'
//                     hasFeedback
//                     rules={[
//                       {
//                         required: true,
//                         message: 'Service Account is required'
//                       }
//                     ]}
//                   >
//                     <Select onChange={getServiceAccount}>
//                       <Select.Option value="Service-1">Service-1</Select.Option>
//                       <Select.Option value="Service-2">Service-2</Select.Option>
//                       <Select.Option value="Service-3">Service-3</Select.Option>
//                       <Select.Option value="Service-4">Service-4</Select.Option>
//                       <Select.Option value="Service-5">Service-5</Select.Option>
//                     </Select>
//                   </Form.Item>
//                 </div>
//               </Form>
//             </div>
//           </div>
//         </Modal>
//       </>
//     </div >
//   )
// }

// export default Configuration


import React from 'react'
import { FaUpload } from 'react-icons/fa'
import { Button, Input } from 'antd'


const Configuration = (props) => {
  return (
    <div className='template-screen'>
      <div className='confgi-screen'>
        <h3>Configuration</h3>
      </div>
      <div className='config-fields'>
        <div className='config-fields-main'>
          <span>Project ID</span>
          <Input className='input-confgi' placeholder="Basic usage" />
          <Button style={{ background: '#4285F4', color: '#fff',borderRadius:'4px',marginLeft:'100px' }} className='date width-sub height_57px'>
            Doc Warehouse</Button>
        </div>
        <div className='config-fields-main'>
          <span>Service Account</span>
          <Input className='input-confgi' placeholder="Basic usage" />
          <Button style={{ background: '#4285F4', color: '#fff' , width:'60px',borderRadius:'4px' }} className='date width-sub height_57px'>
            <FaUpload /> </Button>
        </div>
        <div className='config-fields-main'>
          <span>Service Account</span>
          <Input className='input-confgi' placeholder="Basic usage" />
        </div>
        <div className='config-save'>
          <Button style={{ background: '#4285F4', color: '#fff',borderRadius:'4px' }} className='date width-sub height_57px'>
            Doc Warehouse</Button>
        </div>
      </div>
    </div>
  )
}

export default Configuration