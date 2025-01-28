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
    toggleValue
}) => {
    const fieldName = fieldData[0];
    const fieldValue = fieldData[1];
    const fieldValueContent = fieldValue?.content;
    const existIn = fieldValue?.key_pair?.exists_in;
    const key_pair = fieldName?.key_pair || fieldValue?.key_pair;
    const confidence = round(parseFloat(fieldValue?.key_pair?.confidence) * 100);
    const gt_value = fieldValue?.key_pair?.gt_value;
    const additionalFontStyle = { color: '#1677ff', fontWeight: 'bold' };
    const additionalStyles = isCurrentlyHighlighted ? { border:'1px solid #1677ff', ...additionalFontStyle } : {};

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

    return (
        <ListItem
            data-highlight-id={fieldName.id}
            style={{
                borderBottom: '.1px solid silver',
                ...additionalStyles,
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'flex-start', // Changed from center to allow for text wrapping
                padding: '4px 10px',
                width: '100%',
                ...indentStyle,
                boxSizing: 'border-box',
                overflow: 'visible', // Changed from hidden
                fontSize: '12px',
                minHeight: '40px' // Added to ensure consistent spacing
            }}
            button
        >
            <div style={{
                flex: 1,
                display: 'flex',
                overflow: 'visible', // Changed from hidden
                minWidth: 0
            }}>
                <LongClickButton
                    Button={(props) => (
                        <div
                            style={{
                                ...isCurrentlyHighlighted ? additionalFontStyle : null,
                                display: 'flex',
                                width: '100%',
                                overflow: 'visible', // Changed from hidden
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
                                    <Tooltip title={fieldName?.content?.text?.split('/').pop() || fieldName?.content?.text}>
                                        <span
                                            style={{
                                                ...(isCurrentlyHighlighted && { color: '#1677ff' }),
                                                flex: '1 1 45%',
                                                ...wrappingTextStyle
                                            }}
                                            className='KEYOFVALUEPAIR'
                                        >
                                            {highlighter(fieldName?.content?.text?.split('/').pop() || fieldName?.content?.text)}
                                        </span>
                                    </Tooltip>
                                    {fieldValueContent && (
                                        <Tooltip title={HandleTypesOfContent(fieldValueContent, true)}>
                                            <span
                                                style={{
                                                    flex: '1 1 45%',
                                                    ...wrappingTextStyle
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
                                                color: '#0F9D58',
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
                                                color: '#0F9D58',
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
                        <Edit style={isCurrentlyHighlighted ? { color: '#1677ff' } : null} />
                    </IconButton>
                ) : (
                    <CheckCircle
                        color='green'
                        style={{ color: isCurrentlyHighlighted ? '#1677ff' : '#0F9D58' }}
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
    toggleValue: PropTypes.bool
};

NestedListItem.defaultProps = {
    isCurrentlyHighlighted: false,
    isEditable: false,
    level: 0
};

export default NestedListItem;