import React, { useEffect, useRef } from 'react'
import { isPDF } from '../../utils/pdfConstants'
import SparkMD5 from 'spark-md5'

import { Tooltip, Button, Modal, Select } from 'antd'
import Highlighter from 'react-highlight-words'
import './SelectedCardData.css'
// import { LeftOutlined } from '@ant-design/icons'
import { AiOutlineArrowLeft } from "react-icons/ai";
import { BookmarkBorderOutlined, Bookmark } from '@material-ui/icons'
import { CloudUploadOutlined } from '@ant-design/icons'
import { useSelector } from 'react-redux'
import { secureApi } from '../../Config/api'
import { useState } from 'react'
import { removeBookmark, successNotification, warningMessage, errorMessage } from '../../utils/pdfHelpers'
import ValidateButton from './ValidateButton'
import DownloadButton from '../ArtifactDataCard/DownloadButton'
import './HeaderTopBar.css'
import { ARTIFACT, BOOKMARKS_APIS, POST, GET } from '../../utils/apis'
import { manager } from '../../utils/constants'

const { Option } = Select

const { POST: { BOOKMARKS_ADD_BOOKMARK, BOOKMARKS_BY_USERID_AND_ARTIFACTID } } = BOOKMARKS_APIS

const caseOption = ['Requires Review', 'Completed Review', 'Awaiting Information', 'Rejected']

const HeaderTopBar = ({ goBack, reduxActions, searchKey, ...props }) => {
    const [isBookMarked, setIsBookMarked] = useState()
    const [bookMarkId, setBookMarkId] = useState()
    let artifactData = useSelector((state) => state.artifactReducer.artifactData)
    const userLogin = useSelector((state) => state?.authReducer?.user)
    artifactData = props?.artifactData || artifactData
    // console.log('artifact data =>',artifactData)
    const [isBookmarkLoading, setIsBookmarkLoading] = useState(true)
    const [updatedFile, setUpdatedFile] = useState(false)
    const [versions, setVersions] = useState(artifactData?.file_versions)
    const [artifactNames, setArtifactNames] = useState(artifactData?.artifact_name_versions)
    const [version, setVersion] = useState(artifactData?.file_versions?.length - 1 || 0)
    const draggerRef = useRef(null)
    const currentProject = useSelector(store => store?.artifactReducer?.currentProject)
    const project_id = currentProject?.id

    const user = useSelector((store) => store?.authReducer?.user)
    const adj = props?.adj
    console.log('PORPSSSS==>', adj, props?.adj)

    let originalName = artifactData?.original_artifact_name
    let nameLength = originalName?.length
    let smallLengthName = nameLength > 20 ? '...' + originalName?.substr(nameLength - 20, nameLength) : originalName
    let artifact_type = artifactData?.artifact_type

    useEffect(() => {
        let v = artifactData?.file_versions?.length - 1
        if (v !== versions?.length - 1) {
            setVersion(v || 0)
        }
        setVersions(artifactData?.file_versions)
        setArtifactNames(artifactData?.artifact_name_versions)
    }, [artifactData])

    const goBackFunc = () => {
        if (typeof goBack == 'function') {
            goBack()
        } else {
            console.error("Mising prop ''GoBack()'' ", goBack)
        }
    }

    const getBookMark = () => { //query params: { page, limit, userId }

        let user_id = user?.id
        let artifact_id = artifactData?.artifact_id || artifactData?.id;
        let query = { artifact_id, user_id }
        secureApi.post(BOOKMARKS_BY_USERID_AND_ARTIFACTID, query)
            .then((data) => {
                if (data?.success) {
                    let Id = data?.data?.id
                    let isBookMark = data?.success
                    if (isBookMark && Id) {

                        setIsBookMarked(true)
                        setBookMarkId(Id)
                    }
                    else {
                        setIsBookMarked(false)
                        setBookMarkId(null)
                    }

                }
                else {
                    let errMsg = data?.message
                    errMsg && console.log(errMsg)
                }
                setIsBookmarkLoading(false)

            })
            .catch((err) => {
                let errMsg = err?.response?.data?.message
                // errMsg && errorMessage(errMsg)
            })
    }

    const addBookMark = () => {
        let user_id = user?.id
        let artifact_id = artifactData?.id
        let bookmark = { artifact_id, user_id }

        setIsBookMarked(true)
        setIsBookmarkLoading(true)
        // this.setState({ isBookMark: true, isBookMarkLoading: true })
        secureApi.post(BOOKMARKS_ADD_BOOKMARK, bookmark)
            .then((data) => {
                if (data?.success) {
                    successNotification(data?.message || 'Bookmarked succesfully!')
                    getBookMark()

                }
                else {
                    let errMsg = data?.message;
                    errMsg && errorMessage(errMsg);
                }
            })
            .catch((err) => {
                setIsBookMarked(false)
                setIsBookmarkLoading(false)
                let errMsg = err?.response?.data?.message;
                errMsg && errorMessage(errMsg);
            })
    }

    const removeBookMark = async () => {
        let id = bookMarkId
        // this.setState({ isBookMark: false, isBookMarkLoading: true })
        setIsBookMarked(false)
        setIsBookmarkLoading(true)


        removeBookmark(id).then(() => {
            getBookMark()
            setIsBookmarkLoading(false)
            // setIsBookmarkLoading()
            if (typeof props?.onBookMarkRemove == 'function') {
                props.onBookMarkRemove()
            }
        })

    }

    const addOrRemoveBookMark = () => {

        if (!isBookmarkLoading) {//If its not loading already.
            if (!isBookMarked) {  //If not already bookmarked.
                addBookMark()
            }
            else {
                removeBookMark()
            }
        }
        else {
            warningMessage('Please Wait...')
        }
    }

    const uploadUpdatedFile = (file) => {
        let isCustom = currentProject?.template?.is_custom
        let templateFileName = `${currentProject?.template?.id}-${currentProject?.template?.original_artifact_name}`
        let tableName = `${currentProject?.name}_${currentProject?.id?.replace(/-/g, '_')}.${currentProject?.template?.template_name}`
        let md5 = SparkMD5.hash(file.name)
        setUpdatedFile(true)

        let formData = new FormData()

        formData.append('md5', md5)
        formData.append('file', file)
        formData.append('user_id', user.id)
        formData.append('fileId', artifactData.id)
        formData.append('project_id', project_id)
        formData.append('is_custom', isCustom)
        formData.append('template_file_name', templateFileName)
        formData.append('project_name', currentProject?.name)
        formData.append('table_name', tableName)
        formData.append('user_email', user?.email)
        formData.append('template_id', JSON.stringify(currentProject?.template?.id || null))
        formData.append('processorId', JSON.stringify(currentProject?.template?.processor_id || null))

        secureApi.post(ARTIFACT.POST.UPDATE_FILE, formData)
            .then((data) => {
                draggerRef.current.value = null
                console.log('data', data)
                setUpdatedFile(false)
                if (data?.success) {
                    return reduxActions.setArtifactData({ ...data?.artifact })
                }
                errorMessage(data?.message)
            })
            .catch((e) => {
                draggerRef.current.value = null
                console.log('e', e)
            })
    }

    const normFile = (e) => {
        // let types = hasTemplate ? ['application/pdf'] : allMimeTypes
        let types = 'application/pdf'
        let files = e?.target?.files

        if (!files?.length) return

        if (types.indexOf(files[0]?.type) !== -1) {
            Modal.confirm({
                title: 'Confirm',
                icon: <CloudUploadOutlined />,
                content: `Are you sure to update the file?`,
                okText: `Confirm`,
                cancelText: `Cancel`,
                onOk: () => uploadUpdatedFile(files[0]),
                onCancel: () => {
                    draggerRef.current.value = null
                }
            })
        }
        else {
            setUpdatedFile(false)
            return warningMessage('Please Upload Form Only!')
        }
    }

    const onChange = (v) => {
        console.log('v', v)
        setVersion(v)
        artifactData.file_address = versions[v]
        artifactData.original_file_address = versions[v]
        artifactData.artifact_name = artifactNames[v]
        reduxActions.setArtifactData({ ...artifactData })
    }

    const highlighter = (text) => (
        <Highlighter
            highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
            searchWords={searchKey?.split(' ') || []}
            autoEscape
            textToHighlight={text ? text?.toString() : ''}
        />
    )

    const icon_style = { color: 'rgb(0, 128, 247)' }

    const bookMarkColor = isBookmarkLoading ? { color: 'gray' } : icon_style
    console.log("USER LOGIN ==>", userLogin?.role)
    return (
        <div className='myShadowCard'>
            <div className='artifact-top'>
                <div className='artifact-sub'>

                    <span style={{ cursor: 'pointer' ,paddingTop:'9px'}} onClick={goBackFunc}>
                        <AiOutlineArrowLeft style={{ fontSize: 21,color:'#0057E7' }} />
                    </span>
                    <Tooltip className='filename-topheader' title={originalName}>
                        <p style={{ marginBottom: 0, marginLeft: 10,flex:1 }}>{highlighter(smallLengthName)}</p>
                    </Tooltip>
                </div>
                <div className='new-doc'>
                    New Document
                </div>
                {/* <div style={{ marginLeft: 140 }}>
                    <span><b>{artifactData?.is_completed ? 'COMPLETED' : 'PROCESSING'}</b></span>
                </div> */}
                {/* <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}> */}
                    {/* {isPDF(artifactData?.artifact_type) && (
                        <Spin spinning={updatedFile}>
                            <div className='artifact-version'>
                                <Button
                                    type='primary'
                                    style={{ margin: 0, marginRight: 10 }}
                                    onClick={() => draggerRef.current.click()}
                                >
                                    Upload Updated File
                                </Button>
                                <Select
                                    showSearch
                                    placeholder='Select Version'
                                    optionFilterProp='children'
                                    value={version}
                                    style={{ minWidth: 100 }}
                                    onChange={onChange}
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                >
                                    {Array.isArray(versions) && versions.length && versions.map((v, i) => <Option value={i} key={i} >{`Version ${i + 1}`}</Option>)}
                                </Select>
                                <input
                                    type='file'
                                    onChange={normFile}
                                    ref={draggerRef}
                                    accept='application/pdf'
                                    style={{ display: 'none' }}
                                />
                            </div>
                        </Spin>
                    )} */}
                    {/* <Tooltip title={isBookMarked ? (isBookmarkLoading ? 'Please wait, Loading Bookmark' : 'Click to remove from bookmark') : (isBookmarkLoading ? 'Please wait, Loading Bookmark' : 'Click to add as a bookmark')}>
                        <span onClick={() => addOrRemoveBookMark()} id='artifactBookmark'>

                            {isBookMarked ? (
                                <Bookmark className='MaterialIcons myHeaderIcons' style={{ fontSize: 30, ...bookMarkColor }} />
                            ) : (
                                <BookmarkBorderOutlined className='MaterialIcons myHeaderIcons' style={{ fontSize: 30, ...bookMarkColor }} />
                            )
                            }
                        </span>
                    </Tooltip> */}

                    {/* <CheckCircleOutline style={{ fontSize: 27, margin: '0px 6px', color: 'rgb(0, 128, 247)' }} /> */}
                    {/* <ValidateButton artifactData={artifactData} disabled={artifactData?.is_validate} id={artifactData?.id} />

                    <DownloadButton selectedCard={artifactData} />
                </div> */}
            </div>

        </div >
    )
}

export default HeaderTopBar
