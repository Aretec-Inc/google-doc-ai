import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Button, IconButton } from '@material-ui/core'
import { ListItem, ListItemText, List } from '@material-ui/core'
import { Icon_Blue_Color } from '../../utils/pdfConstants'
import Checkbox from '@material-ui/core/Checkbox'
import LongClickButton from '../LongClickButton'
import { Tooltip } from 'antd'
import { CheckCircle, Edit, Add, Close } from '@material-ui/icons/'
import DialogEdit from './DialogEditField'
import { isNull } from '../../utils/pdfHelpers'
import Highlighter from 'react-highlight-words'
// import { PlusOutlined } from '@ant-design/icons'
// import AddKeyPairModal from './AddKeyPairModal'
// import { secureApi } from '../../Config/api'

const VirtualizedList = ({ height, isTemplateView, triggerAddKeyPair, setTriggerAddKeyPair, width, availableKeyPairs, highlights, artifactData, setSelectedHighLights, selectedHighLights, search, searchResults, setSearch, shouldScrollSidebar, setShouldScrollSidebar, setShouldScrollPDF, refresh, isCompleted, searchKey, ...props }) => {

    const [isLongClicked, setIsLongClicked] = useState(false)
    const [shouldScroll, setShouldScroll] = useState(true)
    const [showDialog, setShowDialog] = useState(false)
    const [selectEditHighlight, setSelectEditHighlight] = useState(null)
    const [showAddFieldModal, setShowAddFieldModal] = useState(false)

    const is_editable = !artifactData?.is_validate
    let file_name = artifactData?.file_name
    let hasAvailableKeyPairs = Boolean(availableKeyPairs?.length) || isTemplateView
    //alert(highlights.length)

    // useEffect(() => {
    //     let scrollTimeout = null
    //     clearTimeout(scrollTimeout)

    //     scrollTimeout = setTimeout(() => {
    //         if (shouldScroll == false)
    //             setShouldScroll(true)
    //     }, 1000)
    //     return () => clearTimeout(scrollTimeout)
    // }, [shouldScroll])

    let finalHighlights = search.length ? searchResults : highlights // getUniqueArrayOfObjects(highlights, 'id')

    let isFormFields = (type) => type == 'formFields'

    let typeOfHighlights = finalHighlights?.[0]?.[0]?.type

    let isCurrentlyFormFields = isFormFields(typeOfHighlights)

    const is_completed = isCompleted || artifactData?.is_completed || !isCurrentlyFormFields

    const HandleTypesOfContent = (content, isHighlighted) => {
        let contentType = content?.type
        let unfilled_checkbox = contentType == 'unfilled_checkbox'
        let filled_checkbox = contentType == 'filled_checkbox'

        if (unfilled_checkbox || filled_checkbox) {
            return <Checkbox
                style={isHighlighted ? { color: 'white' } : null}
                defaultChecked={filled_checkbox}
                color='primary'
                inputProps={{ 'aria-label': 'secondary checkbox' }}
            />
        }
        else {
            return highlighter(content?.text || 'null')
        }
    }

    const highlighter = (text) => (
        <Highlighter
            highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
            searchWords={searchKey?.split(' ') || []}
            autoEscape
            textToHighlight={text ? text?.toString() : ''}
        />
    )

    const myIconStyle = { color: 'white', fontSize: 17 }

    return (
        <div style={{ overflow: 'auto', height, width }} >
            {(Array.isArray(finalHighlights) && finalHighlights?.length && Boolean(is_completed)) ?
                (
                    <>
                        {/* {isCurrentlyFormFields && (
                            <ListItem style={{ borderBottom: '1px solid silver' }} >
                                <ListItemText


                                    primary={
                                        <div style={{ display: 'flex', flexDirection: 'row' }}>
                                            <span style={{ color: 'black', fontWeight: 'bold' }} className='KEYOFVALUEPAIR'>KEY</span>
                                            <span style={{ marginLeft: 15, color: 'black', fontWeight: 'bold' }}>VALUE</span>
                                            {hasAvailableKeyPairs && <div style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'flex-end' }}>
                                                <IconButton onClick={() => setTriggerAddKeyPair(!triggerAddKeyPair)} size='small' style={{ background: '#007aff', float: 'right', margin: 0 }}>
                                                    {!triggerAddKeyPair ? <Add style={myIconStyle} /> : <Close style={myIconStyle} />}
                                                </IconButton>
                                            </div>}
                                        </div>
                                    } />
                            </ListItem>
                        )} */}
                        <List>
                            {(finalHighlights)?.map((data, i) => {
                                let d = data[0]

                                const fieldName = data?.[0]
                                const fieldValue = data?.[1]
                                let fieldValueContent = fieldValue?.content
                                let fieldNameContent = fieldName?.content

                                // let is_field_value_editable = fieldValueContent?.is_editable && is_editable
                                // let is_field_name_editable = fieldNameContent?.is_editable && is_editable

                                let type = d?.type
                                let id = d.id
                                let isCurrentlyHighlighted = Boolean(selectedHighLights.filter(ids => ids === id)[0])
                                let isLastHighlight = Boolean(selectedHighLights[selectedHighLights.length - 1] == id)
                                let allIdsWithoutThis = selectedHighLights.filter(ids => ids !== id)

                                var timeOut = null

                                const setScrollsSetting = () => {
                                    setShouldScrollPDF(true)
                                    setShouldScrollSidebar(false)
                                }

                                const shortClick = () => {
                                    setSelectedHighLights([id])
                                    setScrollsSetting()
                                }


                                const longClick = () => {
                                    setScrollsSetting()

                                    if (isCurrentlyHighlighted) { //If its already highlighted remove it.
                                        setSelectedHighLights(allIdsWithoutThis)
                                    } else {//Add it to highlight
                                        setSelectedHighLights([...selectedHighLights, id])
                                    }
                                }
                                let additionalFontStyle = { color: 'white', fontWeight: 'bold' }
                                let additonalStyles = isCurrentlyHighlighted ? { background: `#d93025`, ...additionalFontStyle } : {}

                                const key_pair = fieldName?.key_pair || fieldValue?.key_pair

                                return (

                                    <ListItem
                                        style={{ borderBottom: '.1px solid silver', ...additonalStyles, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', flex: 1, padding: 0, }}
                                        button
                                        key={i}
                                        innerRef={el => {
                                            if (isLastHighlight && shouldScrollSidebar)
                                                typeof el?.scrollIntoView == 'function' && (
                                                    el.scrollIntoView()
                                                )
                                        }}
                                    >
                                        <div
                                            style={{ maxWidth: '93%', flex: 1, display: 'flex', overflow: 'hidden' }}>
                                            <LongClickButton
                                                key={i + 'List'}
                                                Button={(props) => (
                                                    <span
                                                        style={{ ...isCurrentlyHighlighted ? additionalFontStyle : null, display: 'flex', flex: 1, padding: 15, }}
                                                        {...props}>
                                                        {isFormFields(type) ? (
                                                            <span style={{ display: 'flex', flexDirection: 'row', flex: 1, width: '93%' ,fontSize:'13px',fontWeight:500}}>
                                                                <Tooltip title={fieldName?.content?.text} >
                                                                    {/* <Tooltip title={fieldName} > */}
                                                                    <span style={isCurrentlyHighlighted ? { color: '#f5f5f5' } : null} className='KEYOFVALUEPAIR'>{highlighter(fieldName?.content?.text)}</span>
                                                                    {/* <span style={isCurrentlyHighlighted ? { color: '#f5f5f5' } : null} className='KEYOFVALUEPAIR'>{fieldName}</span> */}
                                                                </Tooltip>
                                                                <Tooltip title={HandleTypesOfContent(fieldValueContent, true)}>
                                                                    <span className='VALUEOFVALUEPAIR'>
                                                                        {
                                                                            fieldValueContent && HandleTypesOfContent(fieldValueContent, isCurrentlyHighlighted)
                                                                            // fieldValueContent
                                                                        }
                                                                    </span>
                                                                </Tooltip >
                                                            </span>
                                                        ) : (
                                                            d?.content?.text
                                                            // d?.field_name
                                                        )}
                                                    </span>
                                                )}
                                                onLongClick={longClick}
                                                onShortClick={shortClick}
                                            />
                                        </div>
                                        {Boolean(isCurrentlyFormFields) && (
                                            <span style={{ marginRight: 10 }}>
                                                {Boolean(is_editable && (isNull(key_pair?.validated_field_name) || isNull(key_pair?.validated_field_value))) ? (
                                                    <IconButton style={{ padding: 5, }} onClick={() => {
                                                        setSelectEditHighlight(key_pair)
                                                        setShowDialog(true)
                                                    }}>
                                                        <Edit style={isCurrentlyHighlighted ? { color: 'white' } : null} />

                                                    </IconButton>) : (

                                                    <CheckCircle color='green' style={{ color: isCurrentlyHighlighted ? 'white' : '#0F9D58', }} />

                                                )}
                                            </span>
                                        )}
                                    </ListItem>
                                )
                            })
                            }
                        </List>
                    </>

                ) : (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50%', flexDirection: 'column' }}>
                        <Tooltip title={is_completed ? 'NO RECORDS FOUND!' : 'Data is still processing.'}>
                            <h3 style={{ cursor: 'pointer' }} >
                                {is_completed ? 'NO RECORDS' : 'PROCESSING'}
                            </h3>
                        </Tooltip>

                        {(hasAvailableKeyPairs && !search?.length) && (
                            <Button color='primary' onClick={() => setTriggerAddKeyPair(true)} startIcon={<Add />}>
                                Add Field{availableKeyPairs?.length > 1 ? 's' : ''}
                            </Button>
                        )}
                        {search.length ? <p>Try searching another keyword.</p> : null}
                        {search.length ? <Button onClick={() => setSearch('')} style={{ color: Icon_Blue_Color, borderRadius: 10 }} type='text' >Clear Search</Button> : null}
                    </div>
                )

            }

            {Boolean(showDialog && isCurrentlyFormFields && selectEditHighlight) && (<DialogEdit artifactData={artifactData} is_editable={is_editable} closeDialog={() => setShowDialog(false)} data={selectEditHighlight} onSave={refresh} />)}
        </div >


    )
}


VirtualizedList.defaultProps = {
    height: 500,
    width: '100%',
    highlights: [],
}

VirtualizedList.propTypes = {
    height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    artifactData: PropTypes.object,
    refresh: PropTypes.func,
    triggerAddKeyPair: PropTypes.bool,
    setTriggerAddKeyPair: PropTypes.func,
}

export default VirtualizedList