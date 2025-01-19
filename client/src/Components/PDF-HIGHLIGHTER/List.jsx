// import React, { useState } from 'react'
// import PropTypes from 'prop-types'
// import { Button, IconButton } from '@material-ui/core'
// import { ListItem, List } from '@material-ui/core'
// import { Icon_Blue_Color } from '../../utils/pdfConstants'
// import Checkbox from '@material-ui/core/Checkbox'
// import LongClickButton from '../LongClickButton'
// import { Tooltip } from 'antd'
// import { CheckCircle, Edit, Add } from '@material-ui/icons/'
// import DialogEdit from './DialogEditField'
// import { isNull } from '../../utils/pdfHelpers'
// import Highlighter from 'react-highlight-words'
// import round from 'lodash/round'

// const VirtualizedList = ({ height, isTemplateView, triggerAddKeyPair, setTriggerAddKeyPair, width, availableKeyPairs, highlights, artifactData, setSelectedHighLights, selectedHighLights, search, searchResults, setSearch, shouldScrollSidebar, setShouldScrollSidebar, setShouldScrollPDF, refresh, isCompleted, searchKey }) => {

//     const [showDialog, setShowDialog] = useState(false)
//     const [selectEditHighlight, setSelectEditHighlight] = useState(null)

//     const is_editable = !artifactData?.is_validate
//     let hasAvailableKeyPairs = Boolean(availableKeyPairs?.length) || isTemplateView

//     let finalHighlights = search.length ? searchResults : highlights // getUniqueArrayOfObjects(highlights, 'id')

//     let isFormFields = (type) => type == 'formFields'

//     let typeOfHighlights = finalHighlights?.[0]?.[0]?.type

//     let isCurrentlyFormFields = isFormFields(typeOfHighlights)

//     const is_completed = isCompleted || artifactData?.is_completed || !isCurrentlyFormFields

//     const HandleTypesOfContent = (content, isHighlighted) => {
//         let contentType = content?.type
//         let unfilled_checkbox = contentType == 'unfilled_checkbox'
//         let filled_checkbox = contentType == 'filled_checkbox'

//         if (unfilled_checkbox || filled_checkbox) {
//             return <Checkbox
//                 style={isHighlighted ? { color: 'white' } : null}
//                 defaultChecked={filled_checkbox}
//                 color='primary'
//                 inputProps={{ 'aria-label': 'secondary checkbox' }}
//             />
//         }
//         else {
//             return highlighter(content?.text || 'null')
//         }
//     }

//     const highlighter = (text) => (
//         <Highlighter
//             highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
//             searchWords={searchKey?.split(' ') || []}
//             autoEscape
//             textToHighlight={text ? text?.toString() : ''}
//         />
//     )
//     console.log("finalHighlights", finalHighlights)
//     return (
//         <div style={{ overflow: 'auto', height, width }} >
//             {(Array.isArray(finalHighlights) && finalHighlights?.length && Boolean(is_completed)) ?
//                 <List>
//                     {(finalHighlights)?.map((data, i) => {
//                         let d = data[0]

//                         const fieldName = data?.[0]
//                         const fieldValue = data?.[1]
//                         let fieldValueContent = fieldValue?.content

//                         let type = d?.type
//                         let id = d.id
//                         let isCurrentlyHighlighted = Boolean(selectedHighLights.filter(ids => ids === id)[0])
//                         let isLastHighlight = Boolean(selectedHighLights[selectedHighLights.length - 1] == id)
//                         let allIdsWithoutThis = selectedHighLights.filter(ids => ids !== id)

//                         const setScrollsSetting = () => {
//                             setShouldScrollPDF(false)
//                             setShouldScrollSidebar(false)
//                         }

//                         const shortClick = () => {
//                             setSelectedHighLights([id])
//                             setScrollsSetting()
//                         }

//                         const longClick = () => {
//                             setScrollsSetting()
//                             if (isCurrentlyHighlighted) { //If its already highlighted remove it.
//                                 setSelectedHighLights(allIdsWithoutThis)
//                             }
//                             else {//Add it to highlight
//                                 setSelectedHighLights([...selectedHighLights, id])
//                             }
//                         }

//                         let additionalFontStyle = { color: 'white', fontWeight: 'bold' }
//                         let additonalStyles = isCurrentlyHighlighted ? { background: `#d93025`, ...additionalFontStyle } : {}
//                         const key_pair = fieldName?.key_pair || fieldValue?.key_pair

//                         return (
//                             <ListItem
//                                 style={{ borderBottom: '.1px solid silver', ...additonalStyles, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', flex: 1, padding: 0, }}
//                                 button
//                                 key={i}
//                                 innerRef={el => {
//                                     if (isLastHighlight && shouldScrollSidebar)
//                                         typeof el?.scrollIntoView == 'function' && (
//                                             el.scrollIntoView()
//                                         )
//                                 }}
//                             >
//                                 <div
//                                     style={{ maxWidth: '93%', flex: 1, display: 'flex', overflow: 'hidden' }}
//                                 >
//                                     <LongClickButton
//                                         key={i + 'List'}
//                                         Button={(props) => (
//                                             <span
//                                                 style={{ ...isCurrentlyHighlighted ? additionalFontStyle : null, display: 'flex', flex: 1, padding: 15, }}
//                                                 {...props}>
//                                                 {isFormFields(type) ? (
//                                                     <span style={{ display: 'flex', flexDirection: 'row', flex: 1, width: '93%', fontSize: '13px', fontWeight: 500 }}>
//                                                         <Tooltip title={fieldName?.content?.text} >
//                                                             <span style={isCurrentlyHighlighted ? { color: '#f5f5f5' } : null} className='KEYOFVALUEPAIR'>{highlighter(fieldName?.content?.text)}</span>
//                                                         </Tooltip>
//                                                         <Tooltip title={HandleTypesOfContent(fieldValueContent, true)}>
//                                                             <span className='VALUEOFVALUEPAIR'>
//                                                                 {fieldValueContent && HandleTypesOfContent(fieldValueContent, isCurrentlyHighlighted)}
//                                                             </span>
//                                                         </Tooltip>
//                                                         <Tooltip title={`${round(parseFloat(fieldValue?.key_pair?.confidence) * 100)}%`}>
//                                                             <span className='value_confidence'>
//                                                                 {round(parseFloat(fieldValue?.key_pair?.confidence) * 100)}%
//                                                             </span>
//                                                         </Tooltip>
//                                                     </span>
//                                                 ) : (
//                                                     d?.content?.text
//                                                 )}
//                                             </span>
//                                         )}
//                                         onLongClick={longClick}
//                                         onShortClick={shortClick}
//                                     />
//                                 </div>
//                                 {Boolean(isCurrentlyFormFields) && (
//                                     <span style={{ marginRight: 10 }}>
//                                         {Boolean(is_editable && (isNull(key_pair?.validated_field_name) || isNull(key_pair?.validated_field_value))) ? (
//                                             <IconButton style={{ padding: 5, }} onClick={() => {
//                                                 setSelectEditHighlight(key_pair)
//                                                 setShowDialog(true)
//                                             }}>
//                                                 <Edit style={isCurrentlyHighlighted ? { color: 'white' } : null} />
//                                             </IconButton>) : <CheckCircle color='green' style={{ color: isCurrentlyHighlighted ? 'white' : '#0F9D58', }} />}
//                                     </span>
//                                 )}
//                             </ListItem>
//                         )
//                     })
//                     }
//                 </List> : <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50%', flexDirection: 'column' }}>
//                     <Tooltip title={is_completed ? 'NO RECORDS FOUND!' : 'Data is still processing.'}>
//                         <h3 style={{ cursor: 'pointer' }} >
//                             {is_completed ? 'NO RECORDS' : 'PROCESSING'}
//                         </h3>
//                     </Tooltip>

//                     {(hasAvailableKeyPairs && !search?.length) && (
//                         <Button color='primary' onClick={() => setTriggerAddKeyPair(true)} startIcon={<Add />}>
//                             Add Field{availableKeyPairs?.length > 1 ? 's' : ''}
//                         </Button>
//                     )}
//                     {search.length ? <p>Try searching another keyword.</p> : null}
//                     {search.length ? <Button onClick={() => setSearch('')} style={{ color: Icon_Blue_Color, borderRadius: 10 }} type='text' >Clear Search</Button> : null}
//                 </div>
//             }
//             {Boolean(showDialog && isCurrentlyFormFields && selectEditHighlight) && (<DialogEdit artifactData={artifactData} is_editable={is_editable} closeDialog={() => setShowDialog(false)} data={selectEditHighlight} onSave={refresh} />)}
//         </div >
//     )
// }

// VirtualizedList.defaultProps = {
//     height: 500,
//     width: '100%',
//     highlights: []
// }

// VirtualizedList.propTypes = {
//     height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
//     width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
//     artifactData: PropTypes.object,
//     refresh: PropTypes.func,
//     triggerAddKeyPair: PropTypes.bool,
//     setTriggerAddKeyPair: PropTypes.func
// }

// export default VirtualizedList

// // VirtualizedList.js
// import React, { useState, useMemo } from 'react';
// import PropTypes from 'prop-types';
// import { Button, ListItem, List } from '@material-ui/core';
// import Checkbox from '@material-ui/core/Checkbox';
// import { Add } from '@material-ui/icons/';
// import { Tooltip } from 'antd';
// import { Icon_Blue_Color } from '../../utils/pdfConstants';
// import DialogEdit from './DialogEditField';
// import { isNull } from '../../utils/pdfHelpers';
// import Highlighter from 'react-highlight-words';
// import NestedListItem from './NestedListItem';

// const VirtualizedList = ({ 
//   height, 
//   isTemplateView, 
//   triggerAddKeyPair, 
//   setTriggerAddKeyPair, 
//   width, 
//   availableKeyPairs, 
//   highlights, 
//   artifactData, 
//   setSelectedHighLights, 
//   selectedHighLights, 
//   search, 
//   searchResults, 
//   setSearch, 
//   shouldScrollSidebar, 
//   setShouldScrollSidebar, 
//   setShouldScrollPDF, 
//   refresh, 
//   isCompleted, 
//   searchKey 
// }) => {
//   const [showDialog, setShowDialog] = useState(false);
//   const [selectEditHighlight, setSelectEditHighlight] = useState(null);

//   const is_editable = !artifactData?.is_validate;
//   const hasAvailableKeyPairs = Boolean(availableKeyPairs?.length) || isTemplateView;

//   const finalHighlights = search.length ? searchResults : highlights;
//   const isFormFields = (type) => type === 'formFields';
//   const typeOfHighlights = finalHighlights?.[0]?.[0]?.type;
//   const isCurrentlyFormFields = isFormFields(typeOfHighlights);
//   const is_completed = isCompleted || artifactData?.is_completed || !isCurrentlyFormFields;

//   const HandleTypesOfContent = (content, isHighlighted) => {
//     const contentType = content?.type;
//     const unfilled_checkbox = contentType === 'unfilled_checkbox';
//     const filled_checkbox = contentType === 'filled_checkbox';

//     if (unfilled_checkbox || filled_checkbox) {
//       return (
//         <Checkbox
//           style={isHighlighted ? { color: 'white' } : null}
//           defaultChecked={filled_checkbox}
//           color='primary'
//           inputProps={{ 'aria-label': 'secondary checkbox' }}
//         />
//       );
//     }
//     return highlighter(content?.text || 'null');
//   };

//   const highlighter = (text) => (
//     <Highlighter
//       highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
//       searchWords={searchKey?.split(' ') || []}
//       autoEscape
//       textToHighlight={text ? text?.toString() : ''}
//     />
//   );

//   const groupedHighlights = useMemo(() => {
//     if (!Array.isArray(finalHighlights)) return [];

//     const grouped = {};
//     finalHighlights.forEach(data => {
//       const fieldName = data[0]?.content?.text;
//       if (!fieldName) return;

//       const parts = fieldName.split('/');
//       let currentLevel = grouped;

//       parts.forEach((part, index) => {
//         const isLastPart = index === parts.length - 1;
//         if (isLastPart) {
//           currentLevel[part] = data;
//         } else {
//           currentLevel[part] = currentLevel[part] || {};
//           currentLevel = currentLevel[part];
//         }
//       });
//     });

//     return grouped;
//   }, [finalHighlights]);

//   const renderNestedStructure = (items, level = 0) => {
//     return Object.entries(items).map(([key, value]) => {
//       if (!Array.isArray(value)) {
//         return (
//           <div key={key}>
//             <ListItem style={{ paddingLeft: level * 20 }}>
//               <span style={{ fontWeight: 'bold' }}>{key}</span>
//             </ListItem>
//             {renderNestedStructure(value, level + 1)}
//           </div>
//         );
//       }

//       const id = value[0].id;
//       const isCurrentlyHighlighted = Boolean(selectedHighLights.find(ids => ids === id));
//       const allIdsWithoutThis = selectedHighLights.filter(ids => ids !== id);

//       const setScrollsSetting = () => {
//         setShouldScrollPDF(false);
//         setShouldScrollSidebar(false);
//       };

//       return (
//         <NestedListItem
//           key={id}
//           fieldData={value}
//           isCurrentlyHighlighted={isCurrentlyHighlighted}
//           handleLongClick={() => {
//             setScrollsSetting();
//             if (isCurrentlyHighlighted) {
//               setSelectedHighLights(allIdsWithoutThis);
//             } else {
//               setSelectedHighLights([...selectedHighLights, id]);
//             }
//           }}
//           handleShortClick={() => {
//             setSelectedHighLights([id]);
//             setScrollsSetting();
//           }}
//           highlighter={highlighter}
//           HandleTypesOfContent={HandleTypesOfContent}
//           isEditable={is_editable}
//           showEditDialog={(keyPair) => {
//             setSelectEditHighlight(keyPair);
//             setShowDialog(true);
//           }}
//           level={level}
//         />
//       );
//     });
//   };

//   return (
//     <div style={{ overflow: 'auto', height, width }}>
//       {(Array.isArray(finalHighlights) && finalHighlights?.length && Boolean(is_completed)) ? (
//         <List>
//           {renderNestedStructure(groupedHighlights)}
//         </List>
//       ) : (
//         <div style={{ 
//           display: 'flex', 
//           justifyContent: 'center', 
//           alignItems: 'center', 
//           height: '50%', 
//           flexDirection: 'column' 
//         }}>
//           <Tooltip title={is_completed ? 'NO RECORDS FOUND!' : 'Data is still processing.'}>
//             <h3 style={{ cursor: 'pointer' }}>
//               {is_completed ? 'NO RECORDS' : 'PROCESSING'}
//             </h3>
//           </Tooltip>

//           {(hasAvailableKeyPairs && !search?.length) && (
//             <Button 
//               color='primary' 
//               onClick={() => setTriggerAddKeyPair(true)} 
//               startIcon={<Add />}
//             >
//               Add Field{availableKeyPairs?.length > 1 ? 's' : ''}
//             </Button>
//           )}
//           {search.length ? <p>Try searching another keyword.</p> : null}
//           {search.length ? (
//             <Button 
//               onClick={() => setSearch('')} 
//               style={{ color: Icon_Blue_Color, borderRadius: 10 }} 
//               type='text'
//             >
//               Clear Search
//             </Button>
//           ) : null}
//         </div>
//       )}
//       {Boolean(showDialog && isCurrentlyFormFields && selectEditHighlight) && (
//         <DialogEdit 
//           artifactData={artifactData} 
//           is_editable={is_editable} 
//           closeDialog={() => setShowDialog(false)} 
//           data={selectEditHighlight} 
//           onSave={refresh} 
//         />
//       )}
//     </div>
//   );
// };

// VirtualizedList.defaultProps = {
//   height: 500,
//   width: '100%',
//   highlights: []
// };

// VirtualizedList.propTypes = {
//   height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
//   width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
//   artifactData: PropTypes.object,
//   refresh: PropTypes.func,
//   triggerAddKeyPair: PropTypes.bool,
//   setTriggerAddKeyPair: PropTypes.func
// };

// export default VirtualizedList;




// VirtualizedList.js
import { Button, List, ListItem } from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox';
import { Add, ExpandLess, ExpandMore } from '@material-ui/icons/';
import { Tooltip } from 'antd';
import PropTypes from 'prop-types';
import React, { useMemo, useState } from 'react';
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
    searchKey
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

    const toggleExpand = (key) => {
        setExpandedItems(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

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
        if (!Array.isArray(finalHighlights)) return [];

        const grouped = {};
        finalHighlights.forEach(data => {
            const fieldName = data[0]?.content?.text;
            if (!fieldName) return;

            const parts = fieldName.split('/');
            let currentLevel = grouped;

            parts.forEach((part, index) => {
                const isLastPart = index === parts.length - 1;
                if (isLastPart) {
                    currentLevel[part] = data;
                } else {
                    currentLevel[part] = currentLevel[part] || {};
                    currentLevel = currentLevel[part];
                }
            });
        });

        return grouped;
    }, [finalHighlights]);

    const renderNestedStructure = (items, level = 0) => {
        return Object.entries(items).map(([key, value]) => {
            if (!Array.isArray(value)) {
                const isExpanded = expandedItems[key] ?? true; // Default to expanded
                return (
                    <div key={key}>
                        <ListItem
                            button
                            onClick={() => toggleExpand(key)}
                            style={{
                                paddingLeft: level * 10,
                                backgroundColor: '#f5f5f5',
                                borderLeft: level > 0 ? '2px solid #eee' : 'none',
                                marginLeft: level > 0 ? '10px' : '0',
                                display: 'flex',
                                alignItems: 'center',
                                cursor: 'pointer'
                            }}
                        >
                            {isExpanded ? <ExpandLess /> : <ExpandMore />}
                            <span style={{
                                fontWeight: 'bold',
                                marginLeft: '8px',
                                fontSize: '14px',
                                color: '#333'
                            }}>
                                {key}
                            </span>
                        </ListItem>
                        {isExpanded && (
                            <div style={{ marginLeft: '10px' }}>
                                {renderNestedStructure(value, level + 1)}
                            </div>
                        )}
                    </div>
                );
            }

            const id = value[0].id;
            const isCurrentlyHighlighted = Boolean(selectedHighLights.find(ids => ids === id));
            const allIdsWithoutThis = selectedHighLights.filter(ids => ids !== id);

            const setScrollsSetting = () => {
                setShouldScrollPDF(false);
                setShouldScrollSidebar(false);
            };

            return (
                <NestedListItem
                    key={id}
                    fieldData={value}
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
                    level={level}
                />
            );
        });
    };

    return (
        <div style={{ overflow: 'auto', overflowX: 'hidden', height, width }}>
            {(Array.isArray(finalHighlights) && finalHighlights?.length && Boolean(is_completed)) ? (
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
    setTriggerAddKeyPair: PropTypes.func
};

export default VirtualizedList;