import { Button, CircularProgress, List, ListItem } from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox';
import { Add, ExpandLess, ExpandMore } from '@material-ui/icons/';
import { Tooltip } from 'antd';
import PropTypes from 'prop-types';
import React, { useCallback, useMemo, useState } from 'react';
import Highlighter from 'react-highlight-words';
import { Icon_Blue_Color } from '../../utils/pdfConstants';
import DialogEdit from './DialogEditField';
import NestedListItem from './NestedListItem';

const VirtualizedList = ({
    height,
    isTemplateView,
    triggerAddKeyPair,
    setTriggerAddKeyPair,
    width,
    availableKeyPairs,
    highlights,
    artifactData,
    setSelectedHighLights,
    selectedHighLights,
    search,
    searchResults,
    setSearch,
    shouldScrollSidebar,
    setShouldScrollSidebar,
    setShouldScrollPDF,
    refresh,
    isCompleted,
    searchKey,
    isLoading = false,
    toggleValue
}) => {
    const [showDialog, setShowDialog] = useState(false);
    const [selectEditHighlight, setSelectEditHighlight] = useState(null);
    const [expandedItems, setExpandedItems] = useState({});

    const is_editable = !artifactData?.is_validate;
    const hasAvailableKeyPairs = Boolean(availableKeyPairs?.length) || isTemplateView;

    const finalHighlights = search.length ? searchResults : highlights;
    const isFormFields = (type) => type === 'formFields';
    const typeOfHighlights = finalHighlights?.[0]?.[0]?.type;
    const isCurrentlyFormFields = isFormFields(typeOfHighlights);
    const is_completed = isCompleted || artifactData?.is_completed || !isCurrentlyFormFields;

    // Modified toggle expand to handle nested paths with explicit state
    const toggleExpand = useCallback((path) => {
        setExpandedItems(prev => {
            const newState = { ...prev };
            const isCurrentlyExpanded = prev[path] !== false; // If undefined or true, consider it expanded

            // Explicitly set the new state
            newState[path] = !isCurrentlyExpanded;

            // Handle child paths
            Object.keys(prev).forEach(key => {
                if (key.startsWith(path + '/')) {
                    newState[key] = !isCurrentlyExpanded;
                }
            });

            return newState;
        });
    }, []);

    // Check if a path should be expanded with explicit false check
    const isExpanded = useCallback((path) => {
        return expandedItems[path] !== false; // Only treat explicit false as collapsed
    }, [expandedItems]);

    const HandleTypesOfContent = (content, isHighlighted) => {
        const contentType = content?.type;
        const unfilled_checkbox = contentType === 'unfilled_checkbox';
        const filled_checkbox = contentType === 'filled_checkbox';

        if (unfilled_checkbox || filled_checkbox) {
            return (
                <Checkbox
                    style={isHighlighted ? { color: 'white' } : null}
                    defaultChecked={filled_checkbox}
                    color='primary'
                    inputProps={{ 'aria-label': 'secondary checkbox' }}
                />
            );
        }
        return highlighter(content?.text || 'null');
    };

    const highlighter = (text) => (
        <Highlighter
            highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
            searchWords={searchKey?.split(' ') || []}
            autoEscape
            textToHighlight={text ? text?.toString() : ''}
        />
    );

    const groupedHighlights = useMemo(() => {
        if (!Array.isArray(finalHighlights)) return {};

        const grouped = {};
        finalHighlights.forEach(data => {
            try {
                if (!data || !Array.isArray(data) || !data[0]?.content?.text) {
                    console.warn('Invalid highlight data structure:', data);
                    return;
                }

                const fieldName = data[0].content.text;
                const parts = fieldName.split('/').filter(Boolean); // Remove empty parts

                if (parts.length === 0) return;

                let currentLevel = grouped;
                let currentPath = '';

                parts.forEach((part, index) => {
                    // Sanitize the part to create a valid object key
                    const safePart = part.trim().replace(/\s+/g, '_');
                    currentPath = currentPath ? `${currentPath}/${safePart}` : safePart;
                    const isLastPart = index === parts.length - 1;

                    if (isLastPart) {
                        // Ensure we're not overwriting existing data
                        if (currentLevel[safePart] && currentLevel[safePart].data) {
                            console.warn(`Duplicate entry found for path: ${currentPath}`);
                        }
                        currentLevel[safePart] = {
                            data,
                            path: currentPath
                        };
                    } else {
                        // Initialize or preserve existing node
                        if (!currentLevel[safePart]) {
                            currentLevel[safePart] = {
                                children: {},
                                path: currentPath
                            };
                        } else if (!currentLevel[safePart].children) {
                            currentLevel[safePart].children = {};
                        }
                        currentLevel = currentLevel[safePart].children;
                    }
                });
            } catch (error) {
                console.error('Error processing highlight:', error, data);
            }
        });

        return grouped;
    }, [finalHighlights]);

    const renderNestedStructure = (items, parentPath = '') => {
        return Object.entries(items).map(([key, value]) => {
            const currentPath = parentPath ? `${parentPath}/${key}` : key;

            if (!value.data) { // This is a folder
                const expanded = isExpanded(currentPath);
                return (
                    <div key={currentPath}>
                        <ListItem
                            button
                            onClick={() => toggleExpand(currentPath)}
                            style={{
                                paddingLeft: parentPath ? parentPath.split('/').length * 16 : 8,
                                backgroundColor: '#f5f5f5',
                                borderLeft: parentPath ? '2px solid #eee' : 'none',
                                marginLeft: parentPath ? '10px' : '0',
                                display: 'flex',
                                alignItems: 'center',
                                cursor: 'pointer',
                            }}
                        >
                            {expanded ? <ExpandLess /> : <ExpandMore />}
                            <span style={{
                                fontWeight: 'bold',
                                marginLeft: '8px',
                                fontSize: '14px',
                                color: '#333'
                            }}>
                                {key}
                            </span>
                        </ListItem>
                        {expanded && (
                            <div style={{ marginLeft: '10px' }}>
                                {renderNestedStructure(value.children, currentPath)}
                            </div>
                        )}
                    </div>
                );
            }

            // This is a leaf node (actual highlight)
            const highlightData = value.data;
            const id = highlightData[0].id;
            const isCurrentlyHighlighted = Boolean(selectedHighLights.find(ids => ids === id));
            const allIdsWithoutThis = selectedHighLights.filter(ids => ids !== id);

            const setScrollsSetting = () => {
                setShouldScrollPDF(false);
                setShouldScrollSidebar(false);
            };

            return (
                <NestedListItem
                    key={id}
                    fieldData={highlightData}
                    isCurrentlyHighlighted={isCurrentlyHighlighted}
                    handleLongClick={() => {
                        setScrollsSetting();
                        if (isCurrentlyHighlighted) {
                            setSelectedHighLights(allIdsWithoutThis);
                        } else {
                            setSelectedHighLights([...selectedHighLights, id]);
                        }
                    }}
                    handleShortClick={() => {
                        setSelectedHighLights([id]);
                        setScrollsSetting();
                    }}
                    highlighter={highlighter}
                    HandleTypesOfContent={HandleTypesOfContent}
                    isEditable={is_editable}
                    showEditDialog={(keyPair) => {
                        setSelectEditHighlight(keyPair);
                        setShowDialog(true);
                    }}
                    level={parentPath ? parentPath.split('/').length : 0}
                    toggleValue={toggleValue}
                />
            );
        });
    };

    return (
        <div style={{ overflow: 'auto', overflowX: 'hidden', height, width }}>
            {isLoading ? (
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%',
                    width: '100%'
                }}>
                    <CircularProgress size={40} />
                </div>
            ) : (Array.isArray(finalHighlights) && finalHighlights?.length && Boolean(is_completed)) ? (
                <List>
                    {renderNestedStructure(groupedHighlights)}
                </List>
            ) : (
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '50%',
                    flexDirection: 'column'
                }}>
                    <Tooltip title={is_completed ? 'NO RECORDS FOUND!' : 'Data is still processing.'}>
                        <h3 style={{ cursor: 'pointer' }}>
                            {is_completed ? 'NO RECORDS' : 'PROCESSING'}
                        </h3>
                    </Tooltip>

                    {(hasAvailableKeyPairs && !search?.length) && (
                        <Button
                            color='primary'
                            onClick={() => setTriggerAddKeyPair(true)}
                            startIcon={<Add />}
                        >
                            Add Field{availableKeyPairs?.length > 1 ? 's' : ''}
                        </Button>
                    )}
                    {search.length ? <p>Try searching another keyword.</p> : null}
                    {search.length ? (
                        <Button
                            onClick={() => setSearch('')}
                            style={{ color: Icon_Blue_Color, borderRadius: 10 }}
                            type='text'
                        >
                            Clear Search
                        </Button>
                    ) : null}
                </div>
            )}
            {Boolean(showDialog && isCurrentlyFormFields && selectEditHighlight) && (
                <DialogEdit
                    artifactData={artifactData}
                    is_editable={is_editable}
                    closeDialog={() => setShowDialog(false)}
                    data={selectEditHighlight}
                    onSave={refresh}
                />
            )}
        </div>
    );
};

VirtualizedList.defaultProps = {
    height: 500,
    width: '100%',
    highlights: []
};

VirtualizedList.propTypes = {
    height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    artifactData: PropTypes.object,
    refresh: PropTypes.func,
    triggerAddKeyPair: PropTypes.bool,
    setTriggerAddKeyPair: PropTypes.func,
    isLoading: PropTypes.bool
};

export default VirtualizedList;