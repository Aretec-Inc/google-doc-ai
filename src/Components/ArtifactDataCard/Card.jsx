import React from 'react'
import { saveAs } from 'file-saver'
import PropTypes from 'prop-types'
import { Comments } from '../../Components'
import { connect } from 'react-redux'
import { Rate, Tag, Input, Tooltip, Collapse, Button, Menu, Dropdown, message } from 'antd'
import { errorNotification, successNotification, warningMessage, removeBookmark, errorMessage } from '../../utils/pdfHelpers'
import { Icon_Blue_Color, isVideo, isImage } from '../../utils/pdfConstants'
import { secureApi } from '../../Config/api'
import { CaretRightOutlined, PlusOutlined, DownloadOutlined } from '@ant-design/icons'
import { Bookmark, BookmarkBorderOutlined, Comment } from '@material-ui/icons'
import { GrGraphQl } from 'react-icons/gr'
import ModalCard from './ModalCard'
import ImageCard from '../ArtifactCard/CardImage'
import ModalLogos from './ModalLogos'
import ModalLabels from './ModalLabels'
import ModalLandmark from './ModalLandmark'
import ModalBestguess from './BestguessModal'
import DocsEntityModal from './DocsEntityModal'
import ReadMore from './ReadMore'
import FileGraphModal from './FileGraphModal'
import ValidateButton from '../SelectedCard/ValidateButton'
import { BIG_QUERY_APIS, ARTIFACT, RATINGS_APIS, TAGS_APIS } from '../../utils/apis'
import BOOKMARKS_APIS from '../../utils/allApis/bookmarks'

const { Panel } = Collapse

const { GET: { BQ_GET_COLUMNS_NAME } } = BIG_QUERY_APIS;
const { POST: { ADD_RATING }, GET: { GET_AGGREGATE_RATING } } = RATINGS_APIS;
const { POST: { TAGS_ADD_TAG, TAGS_REMOVE_TAG }, GET: { TAGS_GET_TAGS_BY_ARTIFACT_ID } } = TAGS_APIS;
const { POST: { BOOKMARKS_ADD_BOOKMARK, BOOKMARKS_BY_USERID_AND_ARTIFACTID } } = BOOKMARKS_APIS;
let possibleOptions = [
    {
        id: 1,
        property_name: 'Notes',
        property_type: 'text'
    }
    ,
    {
        id: 2,
        property_name: 'Classification',
        property_type: 'list'
    }
]

class ArtifactDataCard extends React.Component {
    constructor(props) {
        super(props)
        const { freqWord } = this.props
        this.state = {
            freqWord,
            tags: [],
            inputVisible: false,
            inputValue: '',
            editInputIndex: -1,
            editInputValue: '',
            Panel,
            text: ` Likely `,
            value: 1,
            loadingRate: false,
            disableRate: true,
            aggregate: 0,
            isBookMark: false,
            isBookMarkLoading: true,
            bookMarkId: '',
            showComments: false,
            showModal: false,
            fileGraphModalVisible: false,
            showBigQ: false,
            bigQColumns: [],
            isUpdate: false,
            fileName: '',
            loading: false,
            selectedClass: null,
            projectProperty: 0,
            additionalProperties: [],
            propertyValues: {},
            propertiesLoading: true,
            submitPropertyLoading: false
        }
    }

    componentDidMount = () => {
        console.log('this.props', this.props)
        let { selectedCard, artifactData } = this.props
        let artifact_id = selectedCard?.id || artifactData?.id
        this.updateContent()
        this.show_aggregate_rating()
        this.getTagsData()
        this.getBookMark()
        // socket.on('comment', (id) => {
        //     id === artifact_id && getComments(artifact_id)
        // })
        this.getAdditionalProperties(artifact_id)
    }
    getAdditionalProperties = (artifactId) => {
        let { selectedCard, artifactData } = this.props

        let artifact_id = artifactId || selectedCard?.id || artifactData?.id
        // console.clear()
        // console.log(`\n\n**********************\n\n`, "SelectedCard", selectedCard, "artifactData", artifactData, artifactId)

        this.setState({
            propertiesLoading: true

        })
        secureApi.get(`${ARTIFACT.GET.ADDITIONAL_PROPERTIES}/${artifact_id}`)
            .then((data) => {
                if (data?.success) {
                    this.setState({
                        additionalProperties: data?.data,

                    })

                    Array.isArray(data?.data) && data.data.forEach(d => {
                        let newObject = Object.assign(this.state.propertyValues || {}, { [d?.id]: d?.property_value })
                        this.setState({ propertyValues: newObject })
                    })
                }
            }).finally(() => {
                this.setState({
                    propertiesLoading: false

                })
            })
    }
    getColumnsName = () => {
        const { selectedCard } = this.props
        let { bigQColumns } = this.state
        secureApi.get(`${BQ_GET_COLUMNS_NAME}/${selectedCard?.id}`)
            .then((data) => {
                if (data?.success) {
                    bigQColumns = data?.columns
                    this.setState({ bigQColumns })
                } else {
                    let errMsg = data?.message;
                    console.log("errMsg", errMsg)
                }
            })
    }

    getTagsData = () => {
        let { selectedCard } = this.props
        let artifact_id = selectedCard.id

        let correctURL = `${TAGS_GET_TAGS_BY_ARTIFACT_ID}/${artifact_id}`
        secureApi.get(correctURL, { artifact_id })
            .then((data) => {
                if (data?.success) {
                    let tags_from_server = data?.data
                    if (tags_from_server && Array.isArray(tags_from_server)) {
                        let tags = tags_from_server.map(d => d.tag_name).filter(d => d)
                        this.setState({ tags })
                    }
                } else {
                    let errMsg = data?.message;
                    console.log("errMsg", errMsg);
                }
            })

    }

    postTagsData = (tag_name) => {
        let { selectedCard } = this.props
        let { user } = this.props
        let artifact_id = selectedCard.id
        let user_id = user.id
        secureApi.post(TAGS_ADD_TAG, { tag_name, artifact_id, user_id })
            .then((data) => {
                if (data?.success) {
                    successNotification(data?.message || `Tag '${tag_name}' added succesfully`)
                } else {
                    let errMsg = data?.message;
                    errMsg && errorNotification(errMsg);
                }
            })
            .catch((err) => {
                let errMsg = err?.response?.data?.message;
                errMsg && errorNotification(errMsg);
            })
    }

    removeTag = () => {

        let id = this?.state?.artifactId
        if (id) {
            secureApi.post(TAGS_REMOVE_TAG, { id })
                .then((data) => {
                    if (data?.success) {
                        successNotification('Removed from tag!')
                        this.getBookMark()
                    }
                    else errorNotification(data.message ? data.message : 'Something Went Wrong')
                })
                .catch((e) => {
                    console.log(e)
                })
        }
        else {
            this.getTagsData()
        }
    }


    handleEditInputChange = e => {
        this.setState({ editInputValue: e.target.value })
    }

    handleEditInputConfirm = () => {
        this.setState(({ tags, editInputIndex, editInputValue }) => {
            const newTags = [...tags]
            newTags[editInputIndex] = editInputValue
            if (editInputValue.length) this.postTagsData(editInputValue)
            return {
                tags: newTags,
                editInputIndex: -1,
                editInputValue: ''
            }
        })
    }

    handleClose = removedTag => {
        const tags = this.state.tags.filter(tag => tag !== removedTag)
        this.setState({ tags })
    }

    handleCancel = e => {
        this.setState({
            visible: false,
        })
    }

    updateContent = () => {

        const { selectedCard } = this.props
        let obj = {}
        const explicitContent = selectedCard.explicit_content ? selectedCard.explicit_content : selectedCard.explicit_content

        if (explicitContent && Array.isArray(explicitContent)) {
            for (var v of explicitContent) {
                if (obj[v.Name]) {
                    obj[v.Name] = obj[v.Name] + 1
                }
                else {
                    obj[v.Name] = 1
                }
            }

            var freqWord = Object.keys(obj)[0]
            for (var i in obj) {
                if (obj[i] > obj[freqWord]) {
                    freqWord = i
                }
            }
            this.setState({ freqWord })
        }
    }

    saveInputRef = input => {
        this.input = input
    }

    saveEditInputRef = input => {
        this.editInput = input
    }

    handleChange = (rating) => {
        const { user, history, selectedCard } = this.props
        const artifact_id = selectedCard.id
        this.setState({ aggregate: rating })
        //---------- insert function --------------
        let valueRating = { artifact_id, rating }
        this.setState({ loadingRate: true })
        secureApi.post(ADD_RATING, valueRating)
            .then((data) => {
                this.setState({ loadingRate: false })
                if (data?.success) {
                    successNotification(data?.message)
                    this.show_aggregate_rating()
                    return history.push('/search')
                } else {
                    let errMsg = data?.message;
                    errMsg && errorMessage(errMsg);
                }
            })
            .catch((err) => {
                this.setState({ loadingRate: false })
                let errMsg = err?.response?.data?.message;
                errMsg && errorMessage(errMsg);
            })
        //---------- insert function --------------
    }

    getBookMark = () => { //query params: { page, limit, userId }
        const { user, selectedCard } = this.props
        let user_id = user.id
        let artifact_id = selectedCard.id;
        let query = { artifact_id, user_id }
        secureApi.post(BOOKMARKS_BY_USERID_AND_ARTIFACTID, query)
            .then((data) => {
                if (data?.success) {
                    let Id = data?.data?.id
                    let isBookMark = data?.success
                    if (isBookMark && Id) {
                        this.setState({ isBookMark: true, bookMarkId: Id, isBookMarkLoading: false })
                    }
                    else {
                        this.setState({ isBookMark: false, bookMarkId: '', isBookMarkLoading: false })
                    }
                }
                else {
                    let errMsg = data?.message
                    // errMsg && errorMessage(errMsg)
                }
            })
            .catch((err) => {
                let errMsg = err?.response?.data?.message
                // errMsg && errorMessage(errMsg)
            })
    }

    addBookMark = () => {
        const { user, selectedCard } = this.props
        let user_id = user.id
        let artifact_id = selectedCard.id
        let bookmark = { artifact_id, user_id }
        this.setState({ isBookMark: true, isBookMarkLoading: true })
        secureApi.post(BOOKMARKS_ADD_BOOKMARK, bookmark)
            .then((data) => {
                if (data?.success) {
                    successNotification(data?.message || 'Added Bookmarked succesfully!')
                    this.getBookMark()
                }
                else {
                    let errMsg = data?.message;
                    errMsg && errorMessage(errMsg);
                }
            })
            .catch((err) => {
                let errMsg = err?.response?.data?.message;
                errMsg && errorMessage(errMsg);
            })
    }

    removeBookMark = () => {
        let id = this?.state?.bookMarkId
        this.setState({ isBookMark: false, isBookMarkLoading: true })

        removeBookmark(id, () => {
            this.getBookMark()
            this.setState({ isBookMarkLoading: false })
            if (typeof this?.props?.onBookMarkRemove == 'function') {
                this.props.onBookMarkRemove()
            }
        })
    }

    addOrRemoveBookMark = () => {

        if (!this.state.isBookMarkLoading) {//If its not loading already.
            if (!this.state.isBookMark) {  //If not already bookmarked.
                this.addBookMark()
            }
            else {
                this.removeBookMark()
            }
        }
        else {
            warningMessage('Please Wait...')
        }
    }

    //---------- Get Aggregate Rating --------------
    show_aggregate_rating = () => {
        const { selectedCard } = this.props
        secureApi.get(`${GET_AGGREGATE_RATING}/${selectedCard.id}`)
            .then((data) => {
                if (data?.success) {
                    this.setState({ aggregate: data?.aggregate })
                } else {
                    let errMsg = data?.message;
                    errMsg && console.log(errMsg);
                }
            }).catch((err) => {
                let errMsg = err?.response?.data?.message;
                errMsg && console.log(errMsg);
            })
    }

    //-----------Disable Rating after change-----------------
    disableRating = () => {
        const { disableRate } = this.state
        if (Rate.onChange) {
            Rate.disabled = { disableRate }
        }
    }

    // ----- Rating Functions end -------------
    showInput = () => {
        this.setState({ inputVisible: true }, () => this.input.focus())
    }

    handleInputChange = e => {
        this.setState({ inputValue: e.target.value })
    }

    handleInputConfirm = () => {
        const { inputValue } = this.state
        let { tags } = this.state
        if (inputValue && tags.indexOf(inputValue) === -1) {
            tags = [...tags, inputValue]
        }
        if (inputValue.length) this.postTagsData(inputValue)

        this.setState({
            tags,
            inputVisible: false,
            inputValue: '',
        })
    }

    showUpdateInput = () => {
        const selectedCard = this?.props?.selectedCard
        let fileName = selectedCard?.original_artifact_name?.split('.')?.slice(0, -1)?.join('.')
        this.setState({ isUpdate: true, fileName })
    }

    updateName = () => {
        const { fileName } = this.state
        let selectedCard = this?.props?.selectedCard
        let id = selectedCard?.id
        let user_id = this?.props?.user.id
        const project_id = this?.props?.currentProject?.id

        if (!fileName?.length) {
            return errorNotification(`Please Input Valid Name`)
        }

        let original_artifact_name = `${fileName}.${selectedCard?.original_artifact_name?.split('.')?.slice(-1,)[0]}`

        this.setState({ loading: true })

        secureApi.post(ARTIFACT.POST.UPDATE_NAME, { original_artifact_name, id, user_id, project_id })
            .then((data) => {
                if (data?.success) {
                    successNotification(data?.message)
                    selectedCard.original_artifact_name = original_artifact_name
                    this.props.setArtifactData(selectedCard)
                    this.props.getData()
                    return this.setState({ loading: false, isUpdate: false })
                }
                else {
                    let errMsg = data?.message;
                    errMsg && errorNotification(errMsg);
                }
                this.setState({ loading: false })
            })
            .catch((err) => {
                let errMsg = err?.response?.data?.message;
                errMsg && errorNotification(errMsg);
                this.setState({ loading: false })
            })
    }

    downloadFile = (type) => {
        const { selectedCard } = this.props;

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



    menu = () => {
        let artifact_type = this.props?.selectedCard?.artifact_type

        return <Menu>
            <Menu.Item>
                <p style={{ margin: 0 }} onClick={() => this.downloadFile()}>
                    {`Download ${artifact_type?.toUpperCase()}`}
                </p>
            </Menu.Item>
            {artifact_type?.toLowerCase() === 'pdf' ? <Menu.Item>
                <p style={{ margin: 0 }} onClick={() => this.downloadFile("redacted")}>
                    Download Redacted PDF
                </p>
            </Menu.Item> : null}
        </Menu>
    }
    submitProperties = async () => {
        this.setState({ submitPropertyLoading: true })
        try {

            let data = await secureApi.post(ARTIFACT.POST.UPDATE_ADDITIONAL_PROPERTIES, this.state.propertyValues)
            if (data?.success) {
                console.log("DONE")
            } else {
                let errMsg = data?.message;
                errMsg && errorMessage(errMsg);
                console.error("UNSUCCESFULL ", errMsg)
            }
        } catch (err) {
            let errMsg = err?.response?.data?.message;
            errMsg && errorMessage(errMsg);
            console.log("err", err)
        }
        this.setState({ submitPropertyLoading: false })

    }
    render() {
        const { selectedCard, user, isTourOpen, closeTour, goBack } = this.props
        const { projectProperty, freqWord, tags, inputVisible, inputValue, editInputIndex, editInputValue, Panel, value, loadingRate, showComments, isBookMarkLoading, showModal, fileGraphModalVisible, isUpdate, fileName, loading, showBigQ, bigQColumns, additionalProperties, propertyValues } = this.state
        const selecterProperty = possibleOptions[projectProperty || 0]
        const icon_style = { color: Icon_Blue_Color }
        const bookMarkColor = isBookMarkLoading ? { color: 'gray' } : icon_style

        const artifact_id = selectedCard?.id
        const artifact_type = selectedCard?.artifact_type

        const hasRequired_Ids = (artifact_id !== null && artifact_id !== undefined && user && user.id)
        let logos = Array.isArray(selectedCard?.logo) && selectedCard?.logo?.map(e => e.name || e.description || e.Name).filter(d => d).toString()

        const labels = Array.isArray(selectedCard?.label) && selectedCard?.label?.map(e => e.name || e.description).filter(d => d).toString()

        const entity = Array.isArray(selectedCard?.[0]?.entity) && selectedCard?.[0]?.entity?.map(e => ` ${e.name || e.description || e.entity_name}`).filter(d => d).toString()
        const landmarks = Array.isArray(selectedCard?.landmark) && selectedCard?.landmark?.map(e => ` ${e.name || e.description}`).filter(d => d).toString()
        const matches = Array.isArray(selectedCard?.matches) && selectedCard?.matches?.map(e => e.best_guess).filter(d => d).toString()

        return (
            <div>
                {(goBack && typeof goBack == "function") && (
                    <Button style={{ margin: 10, marginLeft: 30 }} type="primary" onClick={goBack}>
                        Back
                    </Button>)}

                <div style={{ display: 'flex', flex: 1, flexDirection: 'row', marginLeft: '30px' }}>
                    <div style={{ display: 'flex', flex: 2, flexDirection: 'row', justifyContent: 'flex-start', margin: 'auto' }}>
                        <div style={{ justifyContent: 'center', alignItems: 'center' }} id="artifactType">
                            <div
                                className='artifactDataCardPreview'
                                style={{
                                    ...(isVideo(artifact_type) || isImage(artifact_type)) ?
                                        {
                                            boxShadow: '0px 0px 1px black'
                                        } : {}
                                }}>
                                {(!isVideo(artifact_type)) &&
                                    <ImageCard artifact={selectedCard} />
                                }
                            </div>
                        </div>
                    </div>
                    <div className='detail-card'>
                        {(hasRequired_Ids) && <Rate allowHalf defaultValue={5}
                            value={this?.state?.aggregate ? this?.state?.aggregate : 5}
                            onChange={this.handleChange}
                            rating={value}
                            disabled={loadingRate}
                        />}
                        {hasRequired_Ids && <div className='comment-bookmark' >
                            <div onClick={() => this.addOrRemoveBookMark()} id="artifactBookmark">
                                {this.state.isBookMark ? (
                                    <Bookmark title={isBookMarkLoading ? 'Please wait, Loading Bookmark' : 'Click to remove from bookmark'} className='MaterialIcons' style={{ fontSize: 30, ...bookMarkColor }} />
                                ) : (
                                    <BookmarkBorderOutlined className='MaterialIcons' title={isBookMarkLoading ? 'Please wait, Loading Bookmark' : 'Click to add as a bookmark'} style={{ fontSize: 30, ...bookMarkColor }} />
                                )
                                }
                            </div>
                            <div onClick={() => this.setState({ showComments: true })} >
                                <Comment id="artifactComment" className='MaterialIcons' style={{ fontSize: 29, marginTop: 1, ...icon_style }} />
                            </div>
                            <div style={{ margin: 4 }} onClick={() => this.setState({ fileGraphModalVisible: true })}>
                                <GrGraphQl id="artifactGraphQL" size={23} color={icon_style?.color ? icon_style?.color : 'blue'} />
                            </div>
                        </div>}

                    </div>
                </div>
                <div style={{ display: 'flex', flex: 1, marginLeft: 30 }} id="artifactDetails">
                    <p>
                        {hasRequired_Ids && <span id="artifactTags">
                            <span className='title-p'>Tags : </span>
                            {tags.map((tag, index) => {
                                if (editInputIndex === index) {
                                    return (
                                        <Input
                                            ref={this.saveEditInputRef}
                                            key={index}
                                            size='small'
                                            className='tag-input'
                                            value={editInputValue}
                                            onChange={this.handleEditInputChange}
                                            onBlur={this.handleEditInputConfirm}
                                            onPressEnter={this.handleEditInputConfirm}
                                        />
                                    )
                                }
                                const isLongTag = tag.length > 20
                                const tagElem = (
                                    <Tag
                                        className='edit-tag'
                                        key={tag}
                                        closable={index !== 0}
                                        onClose={() => this.handleClose(tag)}
                                    >
                                        <span
                                            onDoubleClick={e => {
                                                if (index !== 0) {
                                                    this.setState({ editInputIndex: index, editInputValue: tag }, () => {
                                                        this.editInput.focus()
                                                    })
                                                    e.preventDefault()
                                                }
                                            }}
                                        >
                                            {isLongTag ? `${tag?.slice(0, 20)}...` : tag}
                                        </span>
                                    </Tag>
                                )
                                return (
                                    <Tooltip title={tag} key={tag}>
                                        {tagElem}
                                    </Tooltip>
                                )
                            })}
                            {inputVisible && (
                                <Input
                                    ref={this.saveInputRef}
                                    type='text'
                                    size='small'
                                    className='tag-input'
                                    value={inputValue}
                                    onChange={this.handleInputChange}
                                    onBlur={this.handleInputConfirm}
                                    onPressEnter={this.handleInputConfirm}
                                />
                            )}
                            {!inputVisible && (
                                <Tag className='site-tag-plus' onClick={this.showInput}>
                                    <PlusOutlined /> New Tag
                                </Tag>
                            )}
                        </span>}
                        <br />
                        {labels?.length > 50 ?
                            <>
                                <span style={{ display: 'inline-block' }} >
                                    <ModalLabels {...this.props} /> </span>
                                <span style={{ display: 'inline', textTransform: 'capitalize', marginLeft: '5px' }}>
                                    <ReadMore
                                        text={labels}
                                        numberOfLines={4}
                                        lineHeight={1.4}
                                        showLessButton={true}
                                    />
                                </span>
                                <br />
                            </> : labels?.length ? <>
                                <span style={{ display: 'inline-block' }} ><ModalLabels {...this.props} /> </span>
                                <span style={{ display: 'inline', textTransform: 'capitalize', marginLeft: '5px' }}>
                                    {labels}
                                </span>
                                <br />
                            </> : null
                        }
                        {logos?.length > 50 ?
                            <>
                                <span style={{ display: 'inline-block' }} ><ModalLogos {...this.props} /></span>
                                <span style={{ display: 'inline', textTransform: 'capitalize', marginLeft: '4px' }}>
                                    <ReadMore
                                        text={logos}
                                        numberOfLines={4}
                                        lineHeight={1.4}
                                        showLessButton={true}
                                    />
                                </span>
                                <br />
                            </> : logos?.length ? <>
                                <span style={{ display: 'inline-block' }} ><ModalLogos {...this.props} /></span>
                                <span style={{ display: 'inline', textTransform: 'capitalize', marginLeft: '4px' }}>
                                    {logos}
                                </span>
                                <br />
                            </> : null
                        }
                        {selectedCard?.[0]?.entity?.length > 50 ?
                            <>
                                <span style={{ display: 'inline-block' }} ><DocsEntityModal {...this.props} /> </span>
                                <span style={{ wordBreak: 'break-word', textTransform: 'capitalize', marginLeft: '5px' }} >
                                    <ReadMore
                                        text={entity}
                                        numberOfLines={4}
                                        lineHeight={1.4}
                                        showLessButton={true}
                                    /></span><br />
                            </> : null
                        }

                        {selectedCard?.[0]?.entity?.length < 50 > 1 ?
                            <>
                                <span style={{ display: 'inline-block' }}  ><DocsEntityModal {...this.props} /> </span>
                                <span style={{ wordBreak: 'break-word', textTransform: 'capitalize', marginLeft: '-5px' }} >
                                    {entity}
                                </span><br />
                            </> : null
                        }
                        {landmarks?.filter?.(d => d && d?.description?.toLowerCase?.() !== "empty")?.length ?
                            <>
                                <span id="artifactLandmark" style={{ display: 'inline-block', marginTop: '-10px' }}><ModalLandmark {...this.props} /> </span>
                                <span style={{ display: 'inline', textTransform: 'capitalize', marginLeft: '25px' }}>

                                    {landmarks}

                                </span>
                                <br />
                            </> : null
                        }
                        {
                            selectedCard?.[0]?.classification_confidence &&
                            <>
                                <span className='title-p' >Classification Confidence :</span>
                                <span>{
                                    (selectedCard?.classification_confidence) ?
                                        selectedCard.classification_confidence :
                                        ' 0'}
                                </span>
                                <br />
                            </>
                        }
                        {matches?.length ?
                            <>

                                <span style={{ display: 'inline-block', marginTop: '-10px' }} ><ModalBestguess {...this.props} /></span>
                                <span style={{ display: 'inline', textTransform: 'capitalize', marginLeft: '15px' }}>
                                    {matches}
                                </span>
                                <br />
                            </> : null
                        }

                        {
                            selectedCard?.[0]?.classification_name &&
                            <>
                                <span className='title-p' style={{ marginTop: '-10px' }} >Classification Name :</span>
                                <span style={{ marginLeft: 5 }}>{
                                    (selectedCard?.classification_name) ?
                                        selectedCard.classification_name :
                                        ' Not Found !'}
                                </span>
                                <br />
                            </>
                        }
                        {selectedCard?.classification_confidence &&
                            <>
                                <span className='title-p' style={{ marginTop: '-10px' }}>Classification Confidence :</span>
                                <span style={{ marginLeft: 5 }}>{
                                    (selectedCard?.classification_confidence) ?
                                        selectedCard?.classification_confidence : 'Not Found !'
                                }</span>
                                <br />
                            </>

                        }
                        {selectedCard?.classification_name &&
                            <>
                                <span className='title-p' style={{ marginTop: '-10px' }}>Classification Name :</span>
                                <span style={{ marginLeft: 5 }}>{
                                    (selectedCard?.classification_name) ?
                                        selectedCard?.classification_name.slice(1) : 'Not Found !'
                                }</span>
                            </>
                        }
                        {
                            bigQColumns?.data?.email &&
                            <>
                                <span className='title-p' style={{ marginTop: '-10px' }} >Email :</span>
                                <span style={{ marginLeft: 5 }}>{
                                    (bigQColumns?.data?.email) ?
                                        bigQColumns?.data?.email :
                                        'Not Found!'}
                                </span>
                                <br />
                            </>
                        }


                        {freqWord !== 'undefined' && freqWord &&
                            (
                                <span className='title-p'>
                                    <Collapse
                                        bordered={false}
                                        defaultActiveKey={['0']}
                                        expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
                                        className='site-collapse-custom-collapse'
                                    >
                                        <Panel header='Explicit Content' key='1' className='site-collapse-custom-panel'>
                                            <p style={{ fontWeight: 'normal' }}>{freqWord?.split('.').slice(-1)?.[0].replace('_', ' ')}</p>
                                        </Panel>
                                    </Collapse>
                                </span>
                            )
                        }
                        <>
                            {selectedCard?.artifact_type === 'mp4' ? <ModalCard selectedCard={selectedCard} {...this.props} /> : null}
                        </>

                    </p>
                </div>
                {/* is_validate: { JSON.stringify(selectedCard?.is_validate)} */}
                {
                    selectedCard && selectedCard?.id && (<div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        {/* {bigQColumns?.length ? <Button style={{ margin: 20, marginRight: 0, borderRadius: 4 }} onClick={() => this.setState({ showBigQ: true })}>Create Model</Button> : null} */}
                        <ValidateButton artifactData={selectedCard} disabled={selectedCard?.is_validate} loading={this?.state?.isRefreshing} style={{ width: 160, margin: 5 }} id={selectedCard?.id} />

                        <Dropdown overlay={this.menu} placement="bottomLeft">
                            <Button id="downloadBtn" type='primary' icon={<DownloadOutlined />} style={{ width: 160, margin: 5 }}>Download</Button>
                        </Dropdown>

                        {/* <Button onClick={this.downloadFile} type='primary' icon={<DownloadOutlined />} style={{ width: 160, margin: 5 }} >Download</Button> */}
                    </div>)
                }

                {/* {(isVideo(artifact_type) || isImage(artifact_type) || isAudio(artifact_type)) && <DisplayBox selectedCard={selectedCard} {...this.props} />} */}
                {
                    (showComments && hasRequired_Ids) ?
                        <Comments visible={showComments} artifact_id={artifact_id} closeDrawer={() => this.setState({ showComments: false })} {...this.props} /> : null
                }

                <FileGraphModal fileArtifactData={selectedCard} visible={fileGraphModalVisible} onCancel={() => this.setState({ fileGraphModalVisible: false })} />
                {/* {showBigQ ? <BigQModal onCancel={() => this.setState({ showBigQ: false })} bigQColumns={bigQColumns} selectedCard={selectedCard} /> : null} */}
            </div >
        )
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.authReducer.user
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
    }
}

ArtifactDataCard.displayName = 'ArtifactDataCard'
ArtifactDataCard.propTypes = {
    getData: PropTypes.func,
    closeModal: PropTypes.func
}

export default connect(mapStateToProps, mapDispatchToProps)(ArtifactDataCard)  