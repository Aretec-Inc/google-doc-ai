// NestedListItem.js
import { IconButton, ListItem } from '@material-ui/core';
import { CheckCircle, Edit } from '@material-ui/icons/';
import { Tooltip } from 'antd';
import round from 'lodash/round';
import PropTypes from 'prop-types';
import React from 'react';
import LongClickButton from '../LongClickButton';

const isEmpty = value => value === null || value === undefined;
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
    const key_pair = fieldName?.key_pair || fieldValue?.key_pair;
    const confidence = round(parseFloat(fieldValue?.key_pair?.confidence) * 100);
    const gt_value = fieldValue?.key_pair?.gt_value;
    const additionalFontStyle = { color: 'white', fontWeight: 'bold' };
    const additionalStyles = isCurrentlyHighlighted ? { background: `#d93025`, ...additionalFontStyle } : {};

    const indentStyle = {
        paddingLeft: `${level * 10}px`,
        borderLeft: level > 0 ? '2px solid #eee' : 'none',
        marginLeft: level > 0 ? '10px' : '0'
    };

    return (
        <ListItem
            style={{
                borderBottom: '.1px solid silver',
                ...additionalStyles,
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0px 10px',
                // minHeight: '50px',
                width: '100%',
                ...indentStyle,
                boxSizing: 'border-box',
                overflow: 'hidden',
                overflowX: 'hidden',
                fontSize: '12px'
            }}
            button
        >
            <div style={{
                flex: 1,
                display: 'flex',
                overflow: 'hidden',
                overflowX: 'hidden',
                minWidth: 0 // Important for flex items to shrink below their content size
            }}>
                <LongClickButton
                    Button={(props) => (
                        <div
                            style={{
                                ...isCurrentlyHighlighted ? additionalFontStyle : null,
                                display: 'flex',
                                width: '100%',
                                // padding: '0 15px',
                                overflow: 'hidden',
                                overflowX: 'hidden',

                            }}
                            {...props}
                        >
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                width: '100%',
                                gap: '6px'
                            }}>
                                <Tooltip title={fieldName?.content?.text?.split('/').pop() || fieldName?.content?.text}>
                                    <span
                                        style={{
                                            ...isCurrentlyHighlighted ? { color: '#f5f5f5' } : null,
                                            flex: '1 1 50%',
                                            overflow: 'hidden',
                                            overflowX: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
                                            minWidth: 0
                                        }}
                                        className='KEYOFVALUEPAIR'
                                    >
                                        {highlighter(fieldName?.content?.text?.split('/').pop() || fieldName?.content?.text)}
                                    </span>
                                </Tooltip>
                                <Tooltip title={HandleTypesOfContent(fieldValueContent, true)}>
                                    <span
                                        style={{
                                            flex: '1 1 30%',
                                            overflow: 'hidden',
                                            overflowX: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
                                            minWidth: 0
                                        }}
                                        className='VALUEOFVALUEPAIR'
                                    >
                                        {fieldValueContent && HandleTypesOfContent(fieldValueContent, isCurrentlyHighlighted)}
                                    </span>
                                </Tooltip>
                                {toggleValue ? <Tooltip title={`Ground Truth Value: ${gt_value}`}>
                                    <span
                                        style={{
                                            flex: '1 1 20%',
                                            textAlign: 'right',
                                            fontSize: '12px',
                                            color: isCurrentlyHighlighted ? 'white' : '#666',
                                            whiteSpace: 'nowrap'
                                        }}
                                        className='value_confidence'
                                    >
                                        {gt_value ? gt_value : '-'}
                                    </span>
                                </Tooltip> : null}
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
                        <Edit style={isCurrentlyHighlighted ? { color: 'white' } : null} />
                    </IconButton>
                ) : (
                    <CheckCircle
                        color='green'
                        style={{ color: isCurrentlyHighlighted ? 'white' : '#0F9D58' }}
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
    level: PropTypes.number
};

NestedListItem.defaultProps = {
    isCurrentlyHighlighted: false,
    isEditable: false,
    level: 0
};

export default NestedListItem;