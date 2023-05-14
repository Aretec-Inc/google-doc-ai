import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Button, IconButton } from '@material-ui/core'
import { ListItem, List } from '@material-ui/core'
import { Icon_Blue_Color } from '../../utils/pdfConstants'
import Checkbox from '@material-ui/core/Checkbox'
import LongClickButton from '../LongClickButton'
import { Tooltip } from 'antd'
import { CheckCircle, Edit, Add } from '@material-ui/icons/'
import DialogEdit from './DialogEditField'
import { isNull } from '../../utils/pdfHelpers'
import Highlighter from 'react-highlight-words'
import round from 'lodash/round'

const VirtualizedList = ({ height, isTemplateView, triggerAddKeyPair, setTriggerAddKeyPair, width, availableKeyPairs, highlights, artifactData, setSelectedHighLights, selectedHighLights, search, searchResults, setSearch, shouldScrollSidebar, setShouldScrollSidebar, setShouldScrollPDF, refresh, isCompleted, searchKey }) => {

    const [showDialog, setShowDialog] = useState(false)
    const [selectEditHighlight, setSelectEditHighlight] = useState(null)

    const is_editable = !artifactData?.is_validate
    let hasAvailableKeyPairs = Boolean(availableKeyPairs?.length) || isTemplateView

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

    return (
        <div style={{ overflow: 'auto', height, width }} >
            {(Array.isArray(finalHighlights) && finalHighlights?.length && Boolean(is_completed)) ? <List>
                {(finalHighlights)?.map((data, i) => {
                    let d = data[0]

                    const fieldName = data?.[0]
                    const fieldValue = data?.[1]
                    let fieldValueContent = fieldValue?.content

                    let type = d?.type
                    let id = d.id
                    let isCurrentlyHighlighted = Boolean(selectedHighLights.filter(ids => ids === id)[0])
                    let isLastHighlight = Boolean(selectedHighLights[selectedHighLights.length - 1] == id)
                    let allIdsWithoutThis = selectedHighLights.filter(ids => ids !== id)

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
                        }
                        else {//Add it to highlight
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
                                style={{ maxWidth: '93%', flex: 1, display: 'flex', overflow: 'hidden' }}
                            >
                                <LongClickButton
                                    key={i + 'List'}
                                    Button={(props) => (
                                        <span
                                            style={{ ...isCurrentlyHighlighted ? additionalFontStyle : null, display: 'flex', flex: 1, padding: 15, }}
                                            {...props}>
                                            {isFormFields(type) ? (
                                                <span style={{ display: 'flex', flexDirection: 'row', flex: 1, width: '93%', fontSize: '13px', fontWeight: 500 }}>
                                                    <Tooltip title={fieldName?.content?.text} >
                                                        <span style={isCurrentlyHighlighted ? { color: '#f5f5f5' } : null} className='KEYOFVALUEPAIR'>{highlighter(fieldName?.content?.text)}</span>
                                                    </Tooltip>
                                                    <Tooltip title={HandleTypesOfContent(fieldValueContent, true)}>
                                                        <span className='VALUEOFVALUEPAIR'>
                                                            {fieldValueContent && HandleTypesOfContent(fieldValueContent, isCurrentlyHighlighted)}
                                                        </span>
                                                    </Tooltip>
                                                    <Tooltip title={`${round(parseFloat(fieldValue?.key_pair?.confidence) * 100)}%`}>
                                                        <span className='value_confidence'>
                                                            {round(parseFloat(fieldValue?.key_pair?.confidence) * 100)}%
                                                        </span>
                                                    </Tooltip>
                                                </span>
                                            ) : (
                                                d?.content?.text
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
                                        </IconButton>) : <CheckCircle color='green' style={{ color: isCurrentlyHighlighted ? 'white' : '#0F9D58', }} />}
                                </span>
                            )}
                        </ListItem>
                    )
                })
                }
            </List> : <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50%', flexDirection: 'column' }}>
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
            }
            {Boolean(showDialog && isCurrentlyFormFields && selectEditHighlight) && (<DialogEdit artifactData={artifactData} is_editable={is_editable} closeDialog={() => setShowDialog(false)} data={selectEditHighlight} onSave={refresh} />)}
        </div >
    )
}

VirtualizedList.defaultProps = {
    height: 500,
    width: '100%',
    highlights: []
}

VirtualizedList.propTypes = {
    height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    artifactData: PropTypes.object,
    refresh: PropTypes.func,
    triggerAddKeyPair: PropTypes.bool,
    setTriggerAddKeyPair: PropTypes.func
}

export default VirtualizedList