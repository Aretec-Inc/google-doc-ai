
// NestedListItem.jsx
import React from 'react';
import { IconButton, ListItem } from '@material-ui/core';
import { Edit, CheckCircle } from '@material-ui/icons';
import { Tooltip } from 'antd';
import PropTypes from 'prop-types';
import round from 'lodash/round';
import isEmpty from 'lodash/isEmpty';
import LongClickButton from '../LongClickButton';

const NestedListItem = ({
fieldData,
isCurrentlyHighlighted,
handleLongClick,
handleShortClick,
highlighter,
HandleTypesOfContent,
isEditable,
showEditDialog,
level = 0,
toggleValue,
highlightedFieldName = null
}) => {
const fieldName = fieldData[0];
const fieldValue = fieldData[1];
const fieldValueContent = fieldValue?.content;
const existIn = fieldValue?.key_pair?.exists_in;
const key_pair = fieldName?.key_pair || fieldValue?.key_pair;
const confidence = round(parseFloat(fieldValue?.key_pair?.confidence) * 100);
const gt_value = fieldValue?.key_pair?.gt_value;
const fieldText = fieldName?.content?.text?.split('/').pop() || fieldName?.content?.text;

// Normalize field names for comparison
const normalizedFieldName = highlightedFieldName?.toLowerCase?.();
const normalizedFieldText = fieldText?.toLowerCase?.();
const shouldHighlight = highlightedFieldName && normalizedFieldText === normalizedFieldName;

// Common highlight style for both cases
const highlightStyle = {
    border: '2px solid #2563eb',
    borderRadius: '4px',
    backgroundColor: '#eff6ff',
    boxShadow: '0 0 0 2px rgba(37, 99, 235, 0.2)'
};

// Combine styles based on state
const styles = {
    ...(isCurrentlyHighlighted || shouldHighlight ? highlightStyle : {}),
    ...(isCurrentlyHighlighted && { backgroundColor: '#eff6ff' }), // Lighter blue for current highlight
};

const indentStyle = {
    paddingLeft: `${level * 10}px`,
    borderLeft: level > 0 ? '2px solid #eee' : 'none',
    marginLeft: level > 0 ? '10px' : '0'
};

if (!(toggleValue || (!toggleValue && existIn !== 'ground_truth_only'))) {
    return null;
}

const wrappingTextStyle = {
    whiteSpace: 'normal',
    wordBreak: 'break-word',
    overflow: 'visible',
    textOverflow: 'clip',
    minWidth: 0,
    padding: '4px 0'
};

// Get text color based on state
const getTextColor = (isHighlightState) => {
    if (isCurrentlyHighlighted || shouldHighlight) return '#2563eb';
    return undefined;
};

return (
    <ListItem
        data-highlight-id={fieldName.id}
        data-content-text={fieldText}
        style={{
            borderBottom: '.1px solid silver',
            ...styles,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            padding: '0px 0px',
            width: '100%',
            ...indentStyle,
            boxSizing: 'border-box',
            overflow: 'visible',
            fontSize: '12px',
            minHeight: '40px',
            transition: 'all 0.3s ease-in-out',
            margin: '0',
            position: 'relative'
        }}
        button
    >
        <div style={{
            flex: 1,
            display: 'flex',
            overflow: 'visible',
            minWidth: 0
        }}>
            <LongClickButton
                Button={(props) => (
                    <div
                        style={{
                            padding:'4px 10px',
                            display: 'flex',
                            width: '100%',
                            overflow: 'visible',
                        }}
                        {...props}
                    >
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            width: '100%',
                            gap: '4px'
                        }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                width: '100%',
                                gap: '6px'
                            }}>
                                <Tooltip title={fieldText}>
                                    <span
                                        style={{
                                            color: getTextColor(true),
                                            flex: '1 1 45%',
                                            ...wrappingTextStyle,
                                            fontWeight: (isCurrentlyHighlighted || shouldHighlight) ? '500' : 'normal'
                                        }}
                                        className='KEYOFVALUEPAIR'
                                    >
                                        {highlighter(fieldText)}
                                    </span>
                                </Tooltip>
                                {fieldValueContent && (
                                    <Tooltip title={HandleTypesOfContent(fieldValueContent, true)}>
                                        <span
                                            style={{
                                                flex: '1 1 45%',
                                                ...wrappingTextStyle,
                                                color: getTextColor(false)
                                            }}
                                            className='VALUEOFVALUEPAIR'
                                        >
                                            {HandleTypesOfContent(fieldValueContent, isCurrentlyHighlighted)}
                                        </span>
                                    </Tooltip>
                                )}
                            </div>
                            {toggleValue && (
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    width: '100%',
                                    gap: '6px'
                                }}>
                                    <span
                                        style={{
                                            flex: '1 1 45%',
                                            fontSize: '12px',
                                            color: getTextColor(false) || '#0F9D58',
                                            fontWeight: '500',
                                            ...wrappingTextStyle
                                        }}
                                    >
                                        Ground Truth:
                                    </span>
                                    <span
                                        style={{
                                            flex: '1 1 45%',
                                            fontSize: '12px',
                                            color: getTextColor(false) || '#0F9D58',
                                            fontWeight: '500',
                                            ...wrappingTextStyle
                                        }}
                                    >
                                        {gt_value || '-'}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                )}
                onLongClick={handleLongClick}
                onShortClick={handleShortClick}
            />
        </div>
        <div style={{
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            padding: '0 8px',
            width: '40px',
            justifyContent: 'center'
        }}>
            {Boolean(isEditable && (isEmpty(key_pair?.validated_field_name) || isEmpty(key_pair?.validated_field_value))) ? (
                <IconButton
                    style={{ padding: 4 }}
                    onClick={() => showEditDialog(key_pair)}
                >
                    <Edit style={{ color: getTextColor(false) }} />
                </IconButton>
            ) : (
                <CheckCircle
                    color='green'
                    style={{ 
                        color: (isCurrentlyHighlighted || shouldHighlight) ? '#2563eb' : '#0F9D58'
                    }}
                />
            )}
        </div>
    </ListItem>
);
};

NestedListItem.propTypes = {
fieldData: PropTypes.array.isRequired,
isCurrentlyHighlighted: PropTypes.bool,
handleLongClick: PropTypes.func.isRequired,
handleShortClick: PropTypes.func.isRequired,
highlighter: PropTypes.func.isRequired,
HandleTypesOfContent: PropTypes.func.isRequired,
isEditable: PropTypes.bool,
showEditDialog: PropTypes.func.isRequired,
level: PropTypes.number,
toggleValue: PropTypes.bool,
highlightedFieldName: PropTypes.string
};

NestedListItem.defaultProps = {
isCurrentlyHighlighted: false,
isEditable: false,
level: 0,
highlightedFieldName: null
};

export default NestedListItem;