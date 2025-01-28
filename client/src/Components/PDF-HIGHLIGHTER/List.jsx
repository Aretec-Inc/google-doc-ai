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

// Constants
const FOLDER_INDENT_SIZE = 16;
const BASE_INDENT = 8;

// Helper functions
const isFormFields = (type) => type === 'formFields';
const sanitizePath = (part) => part.trim().replace(/\s+/g, '_');

// Helper to check if a node has any visible children
const hasVisibleChildren = (node, toggleValue, existsInMap = {}) => {
    if (!node) return false;

    // If it's a leaf node, check if it should be visible based on toggleValue
    if (node.data) {
        const existIn = node.data[1]?.key_pair?.exists_in;
        return toggleValue || (!toggleValue && existIn !== 'ground_truth_only');
    }

    // If it's a folder, check if any children are visible
    return Object.values(node.children).some(child => hasVisibleChildren(child, toggleValue, existsInMap));
};

const VirtualizedList = ({
    height,
    isTemplateView,
    triggerAddKeyPair,
    setTriggerAddKeyPair,
    width,
    availableKeyPairs,
    key_pairs,
    highlights = [],
    setSelectedHighLights,
    selectedHighLights,
    search = '',
    searchResults = [],
    setSearch,
    setShouldScrollSidebar,
    setShouldScrollPDF,
    refresh,
    isCompleted,
    searchKey = '',
    isLoading = false,
    toggleValue,
    artifactData
}) => {
    // State
    const [showDialog, setShowDialog] = useState(false);
    const [selectEditHighlight, setSelectEditHighlight] = useState(null);
    const [expandedItems, setExpandedItems] = useState({});

    // Derived state
    const is_editable = !artifactData?.is_validate;
    const hasAvailableKeyPairs = Boolean(availableKeyPairs?.length) || isTemplateView;
    const finalHighlights = search.length ? searchResults : highlights;
    const typeOfHighlights = finalHighlights?.[0]?.[0]?.type;
    const isCurrentlyFormFields = isFormFields(typeOfHighlights);
    const is_completed = isCompleted || artifactData?.is_completed || !isCurrentlyFormFields;

    // Callbacks
    const toggleExpand = useCallback((path) => {
        setExpandedItems(prev => {
            const isCurrentlyExpanded = prev[path] !== false;
            const newState = { ...prev };
            newState[path] = !isCurrentlyExpanded;

            // Update child paths
            Object.keys(prev).forEach(key => {
                if (key.startsWith(`${path}/`)) {
                    newState[key] = !isCurrentlyExpanded;
                }
            });

            return newState;
        });
    }, []);

    const isExpanded = useCallback((path) => expandedItems[path] !== false, [expandedItems]);

    const setScrollsSetting = useCallback(() => {
        setShouldScrollPDF(false);
        setShouldScrollSidebar(false);
    }, [setShouldScrollPDF, setShouldScrollSidebar]);

    const handleHighlightClick = useCallback((id, isLongClick = false) => {
        setScrollsSetting();
        const isCurrentlyHighlighted = selectedHighLights.includes(id);

        if (isLongClick) {
            setSelectedHighLights(isCurrentlyHighlighted
                ? selectedHighLights.filter(ids => ids !== id)
                : [...selectedHighLights, id]
            );
        } else {
            setSelectedHighLights([id]);
        }
    }, [selectedHighLights, setSelectedHighLights, setScrollsSetting]);

    // Handlers
    const HandleTypesOfContent = useCallback((content, isHighlighted) => {
        const contentType = content?.type;
        const isCheckbox = contentType?.includes('checkbox');

        if (isCheckbox) {
            return (
                <Checkbox
                    style={isHighlighted ? { color: 'white' } : null}
                    defaultChecked={contentType === 'filled_checkbox'}
                    color='primary'
                    inputProps={{ 'aria-label': 'secondary checkbox' }}
                />
            );
        }
        return highlighter(content?.text || 'null');
    }, []);

    const highlighter = useCallback((text) => (
        <Highlighter
            highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
            searchWords={searchKey?.split(' ') || []}
            autoEscape
            textToHighlight={text?.toString() || ''}
        />
    ), [searchKey]);

    // Group highlights for nested structure with visibility check
    const groupedHighlights = useMemo(() => {
        if (!Array.isArray(finalHighlights)) return {};

        const grouped = {};
        const existsInMap = {};

        finalHighlights.forEach(data => {
            try {
                if (!data?.[0]?.content?.text) return;

                const fieldName = data[0].content.text;
                const parts = fieldName.split('/').filter(Boolean);
                if (!parts.length) return;

                // Check visibility based on toggleValue and exists_in
                const existIn = data[1]?.key_pair?.exists_in;
                const isVisible = toggleValue || (!toggleValue && existIn !== 'ground_truth_only');
                if (!isVisible) return;

                let currentLevel = grouped;
                let currentPath = '';

                parts.forEach((part, index) => {
                    const safePart = sanitizePath(part);
                    currentPath = currentPath ? `${currentPath}/${safePart}` : safePart;
                    const isLastPart = index === parts.length - 1;

                    if (isLastPart) {
                        currentLevel[safePart] = {
                            data,
                            path: currentPath
                        };
                    } else {
                        if (!currentLevel[safePart]) {
                            currentLevel[safePart] = {
                                children: {},
                                path: currentPath
                            };
                        }
                        currentLevel = currentLevel[safePart].children;
                    }
                });
            } catch (error) {
                console.error('Error processing highlight:', error);
            }
        });

        // Remove empty folders
        const cleanupEmptyFolders = (node) => {
            if (!node) return null;
            if (node.data) return node;

            const cleanChildren = {};
            let hasValidChildren = false;

            Object.entries(node.children).forEach(([key, child]) => {
                const cleanChild = cleanupEmptyFolders(child);
                if (cleanChild) {
                    cleanChildren[key] = cleanChild;
                    hasValidChildren = true;
                }
            });

            if (!hasValidChildren) return null;
            return { ...node, children: cleanChildren };
        };

        return cleanupEmptyFolders({ children: grouped })?.children || {};
    }, [finalHighlights, toggleValue]);

    // Render functions
    const renderFolderItem = useCallback(({ key, currentPath, expanded, parentPath, onToggle, hasChildren }) => {
        if (!hasChildren) return null;

        return (
            <ListItem
                button
                onClick={onToggle}
                style={{
                    paddingLeft: parentPath ? parentPath.split('/').length * FOLDER_INDENT_SIZE : BASE_INDENT,
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
        );
    }, []);

    const renderNestedStructure = useCallback((items, parentPath = '') => {
        return Object.entries(items).map(([key, value]) => {
            const currentPath = parentPath ? `${parentPath}/${key}` : key;

            if (!value.data) {
                const hasChildren = hasVisibleChildren(value, toggleValue);
                if (!hasChildren) return null;

                const expanded = isExpanded(currentPath);
                return (
                    <div key={currentPath}>
                        {renderFolderItem({
                            key,
                            currentPath,
                            expanded,
                            parentPath,
                            onToggle: () => toggleExpand(currentPath),
                            hasChildren
                        })}
                        {expanded && (
                            <div className='removechild' style={{ marginLeft: '0px' }}>
                                {renderNestedStructure(value.children, currentPath)}
                            </div>
                        )}
                    </div>
                );
            }

            const highlightData = value.data;
            const id = highlightData[0].id;
            const isCurrentlyHighlighted = selectedHighLights.includes(id);

            return (
                <NestedListItem
                    key={id}
                    fieldData={highlightData}
                    isCurrentlyHighlighted={isCurrentlyHighlighted}
                    handleLongClick={() => handleHighlightClick(id, true)}
                    handleShortClick={() => handleHighlightClick(id)}
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
        }).filter(Boolean);
    }, [isExpanded, toggleExpand, selectedHighLights, handleHighlightClick, highlighter, HandleTypesOfContent, is_editable, toggleValue]);

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="flex justify-center items-center h-full">
                    <CircularProgress size={40} />
                </div>
            );
        }

        // Check if there are any visible items after filtering
        const hasVisibleItems = Object.keys(groupedHighlights).length > 0;

        if (Array.isArray(finalHighlights) && hasVisibleItems && is_completed) {
            return <List>{renderNestedStructure(groupedHighlights)}</List>;
        }

        return (
            <div className="flex flex-col justify-center items-center h-1/2">
                <Tooltip title={is_completed ? 'NO RECORDS FOUND!' : 'Data is still processing.'}>
                    <h3 className="cursor-pointer">
                        {is_completed ? 'NO RECORDS' : 'PROCESSING'}
                    </h3>
                </Tooltip>

                {hasAvailableKeyPairs && !search.length && (
                    <Button
                        color='primary'
                        onClick={() => setTriggerAddKeyPair(true)}
                        startIcon={<Add />}
                    >
                        Add Field{availableKeyPairs?.length > 1 ? 's' : ''}
                    </Button>
                )}

                {search.length && (
                    <>
                        <p>Try searching another keyword.</p>
                        <Button
                            onClick={() => setSearch('')}
                            style={{ color: Icon_Blue_Color, borderRadius: 10 }}
                            type='text'
                        >
                            Clear Search
                        </Button>
                    </>
                )}
            </div>
        );
    };

    return (
        <div style={{ overflow: 'auto', overflowX: 'hidden', height, width, padding: '0px 10px' }}>
            {renderContent()}
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

VirtualizedList.propTypes = {
    height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    isTemplateView: PropTypes.bool,
    triggerAddKeyPair: PropTypes.bool,
    setTriggerAddKeyPair: PropTypes.func,
    availableKeyPairs: PropTypes.array,
    key_pairs: PropTypes.array,
    highlights: PropTypes.array,
    setSelectedHighLights: PropTypes.func,
    selectedHighLights: PropTypes.array,
    search: PropTypes.string,
    searchResults: PropTypes.array,
    setSearch: PropTypes.func,
    setShouldScrollSidebar: PropTypes.func,
    setShouldScrollPDF: PropTypes.func,
    refresh: PropTypes.func,
    isCompleted: PropTypes.bool,
    searchKey: PropTypes.string,
    isLoading: PropTypes.bool,
    toggleValue: PropTypes.bool,
    artifactData: PropTypes.object
};

VirtualizedList.defaultProps = {
    height: 500,
    width: '100%',
    highlights: [],
    search: '',
    searchResults: [],
    searchKey: '',
    isLoading: false
};

export default VirtualizedList;