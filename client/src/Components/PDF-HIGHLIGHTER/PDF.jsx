// import React, { useState, useEffect, useRef, useMemo } from 'react'
// import { Document, pdfjs, Page } from 'react-pdf'
// import PropTypes from 'prop-types'
// import { Popconfirm, Tooltip } from 'antd'
// import LongClickButton from '../LongClickButton'
// import { findDOMNode } from 'react-dom'
// import AddKeyPairModal from './AddKeyPairModal'
// import Cropper from 'react-cropper'
// import 'cropperjs/dist/cropper.css'

// pdfjs.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.4.456/pdf.worker.min.js'
// const fallBackPDF = 'https://cors-anywhere786.herokuapp.com/https://storage.googleapis.com/context_primary/Forms/NotProcessed/doc_pdf_entity.pdf'

// const PDFTEST = (
//   {
//     triggerAddKeyPair,
//     setTriggerAddKeyPair,
//     isTemplateView,
//     availableKeyPairs,
//     refresh,
//     artifactData,
//     file_address,
//     onDocumentLoadSuccess,
//     pageNumber,
//     resizing,
//     setSelectedHighLights,
//     selectedHighLights,
//     highlights,
//     heightDiffPercent,
//     tabIndex,
//     setShouldScrollSidebar,
//     shouldScrollPDF,
//     setShouldScrollPDF,
//     toggleValue,
//     hitlEnabled,
//     ...props
//   }
// ) => {
//   const containerRef = useRef()
//   const cropperRef = useRef()
//   const [isCropping, setIsCropping] = useState(false)
//   const scale = props?.scale
//   const [addedKeyPairs, setAddedKeyPairs] = useState([])
//   const [rendered, setRendered] = useState(false)
//   const [imgLinks, setImgLinks] = useState('')
//   const [postingImg, setPostingImg] = useState(false)
//   const [cropSetting, setCropSetting] = useState()
//   const pageNumStr = `Page${pageNumber}`
//   const imgLink = useMemo(() => imgLinks?.[pageNumStr], [imgLinks, pageNumStr])
//   const pageWidth = props?.pageWidth || 800
//   const pageHeight = (pageWidth + (pageWidth * (heightDiffPercent) / 100))
//   const finalPageWidth = cropperRef?.current?.width || (pageWidth * scale)
//   const finalPageHeight = cropperRef?.current?.height || (pageHeight * scale)

//   const calculateRect = (data) => {
//     let rect = data.rect
//     const { x1, y1, x2, y2 } = rect
//     const x1Result = Math.round((pageWidth * (x1)))
//     const y1Resut = Math.round((pageHeight * (y1)))
//     const x2Result = Math.round((pageWidth * (x2)))
//     const y2Result = Math.round((pageHeight * (y2))) + 2
//     const width = x2Result - x1Result
//     const height = y2Result - y1Resut
//     const percentHeight = (height / pageHeight) * 100
//     const percentWidth = (width / pageWidth) * 100
//     const percentX = ((x1Result / pageWidth) * 100)
//     const percentY = ((y1Resut / pageHeight) * 100)
//     return { x1, y1, x2, y2, x1Result, y1Resut, x2Result, y2Result, width, height, percentHeight, percentWidth, percentY, percentX, ...data }
//   }

//   const calculateCustomRect = (data) => {
//     let rect = data.rect
//     const isFieldName = Boolean(data?.isKey)
//     const keypair = data?.key_pair
//     const rectW = parseFloat(isFieldName ? 0 : keypair?.value_width)
//     const rectH = parseFloat(isFieldName ? 0 : keypair?.value_height)
//     const x1 = isFieldName ? 0 : rect?.x1
//     const x2 = isFieldName ? 0 : rect?.x1
//     const y1 = isFieldName ? 0 : rect?.y1
//     const y2 = isFieldName ? 0 : rect?.y1
//     const x1Result = parseFloat(x1) * pageWidth
//     const y1Resut = parseFloat(y1) * pageHeight
//     const width = rectW * pageWidth
//     const height = rectH * pageHeight
//     const percentHeight = (height / pageHeight) * 100
//     const percentWidth = (width / pageWidth) * 100
//     const percentX = ((x1Result / pageWidth) * 100)
//     const percentY = ((y1Resut / pageHeight) * 100)
//     const calcResult = { x1, y1, x2, y2, x1Result, y1Resut, width, height, percentHeight, percentWidth, percentY, percentX, ...data }
//     return calcResult
//   }

//   const calculatedHighlights = useMemo(() => {
//     const filteredHighlights = highlights.map((ary) => {
//       return ary.filter(data => {
//         const existIn = data?.key_pair?.exists_in;
//         // Apply visibility condition
//         return toggleValue || (!toggleValue && existIn !== 'ground_truth_only');
//       }).map((data) => {
//         let isCustom = data?.key_pair?.type == "custom"
//         if (isCustom) {
//           return calculateCustomRect(data)
//         } else {
//           return calculateRect(data)
//         }
//       });
//     }).filter(ary => ary.length > 0) // Remove empty arrays after filtering
//       .sort((a, b) => b?.[0]?.width - a?.[0]?.width)
//       .sort((a, b) => b?.[0]?.height - a?.[0]?.height)

//     return filteredHighlights;
//   }, [highlights, resizing, scale, pageNumber, tabIndex, props?.pageWidth, toggleValue, pageWidth, pageHeight])

//   const getCanvasImageUrl = (canvas) => {
//     try {
//       const imgDataURL = canvas.toDataURL("image/png");
//       setImgLinks({ [pageNumStr]: imgDataURL })
//     }
//     catch (ex) {
//       console.log(ex)
//     }
//   }

//   useEffect(() => {
//     if (containerRef.current && rendered?.[pageNumStr] && !imgLinks?.[pageNumStr]) {
//       const container = findDOMNode(containerRef.current)
//       const canvas = container?.querySelector?.('.my-pdf-page canvas')
//       getCanvasImageUrl(canvas)
//     }
//   }, [pageNumber, containerRef, rendered, imgLinks, pageNumStr])

//   let setRectInKeyPairs = (rectObj, id) => {
//     let thisKeyPair = addedKeyPairs.find(d => d?.id == id)
//     let allKeyPWithoutThis = addedKeyPairs.filter(d => d?.id !== id)
//     let prevObj = thisKeyPair
//     let updatedObj = Object.assign(prevObj || {}, rectObj)
//     setAddedKeyPairs([...allKeyPWithoutThis, updatedObj])
//   }

//   const onCropDone = () => {
//     setPostingImg(true)
//     setTimeout(() => {
//       const imageElement = cropperRef?.current;
//       const cropper = imageElement?.cropper;
//       const croppedData = cropper.getData()
//       const canvasData = cropper.getCanvasData()

//       const croppedImage = cropper.getCroppedCanvas({
//         width: croppedData.width,
//         height: croppedData.height,
//       }).toDataURL()

//       const normalizedX = (croppedData?.x || 0) / finalPageWidth
//       const normalizedY = (croppedData?.y || 0) / finalPageHeight
//       const normalizedWidth = (croppedData?.width || 0) / finalPageWidth
//       const normalizedHeight = (croppedData?.height || 0) / finalPageHeight

//       const rect = {
//         x: normalizedX,
//         y: normalizedY,
//         width: normalizedWidth,
//         height: normalizedHeight,
//         img: croppedImage
//       }

//       setRectInKeyPairs({ [`${cropSetting?.field}`]: rect }, cropSetting?.id)
//       setPostingImg(false)
//       setTriggerAddKeyPair(true)
//       setIsCropping(false)
//       setCropSetting(null)
//     }, 1)
//   }

//   const setCropOptions = (obj) => {
//     setCropSetting(obj)
//     setIsCropping(true)
//     setTriggerAddKeyPair(false)
//   }

//   return (
//     <div ref={containerRef} style={{ overflow: 'auto', display: 'flex', justifyContent: 'center' }}>
//       <Document
//         file={file_address}
//         style={{ overflow: 'auto' }}
//         onLoadSuccess={onDocumentLoadSuccess}
//       >
//         <div>
//           <Page
//             onRenderSuccess={() => {
//               if (!rendered?.[pageNumStr]) {
//                 setRendered({ [`${pageNumStr}`]: true })
//               }
//             }}
//             scale={scale}
//             className='my-pdf-page'
//             height={pageHeight}
//             width={pageWidth}
//             pageNumber={parseInt((pageNumber && pageNumber > 0) ? pageNumber : 1)}
//           >
//             <div className='annotationLayer' style={{ position: 'absolute', top: 0 }} >
//               <svg style={{ position: 'absolute' }} width={pageWidth * scale} mode='canvas' height={(pageHeight * scale)}>
//                 <g className='bounding-boxes'>
//                   {!triggerAddKeyPair && calculatedHighlights.map((dataa, i) => {
//                     return dataa.map(({ content, percentX, percentY, percentWidth, percentHeight, width, id }, index) => {
//                       let isCurrentlyHighlighted = Boolean(selectedHighLights.filter(ids => ids === id)[0])
//                       let isLastHighlight = Boolean(selectedHighLights[selectedHighLights.length - 1] == id)
//                       let allIdsWithoutThis = selectedHighLights.filter(ids => ids !== id)

//                       const setScrollsSetting = () => {
//                         setShouldScrollPDF(false)
//                         setShouldScrollSidebar(true)
//                       }

//                       const shortClick = () => {
//                         setScrollsSetting()
//                         setSelectedHighLights([id])
//                       }

//                       const longClick = () => {
//                         setScrollsSetting()
//                         if (isCurrentlyHighlighted) {
//                           setSelectedHighLights(allIdsWithoutThis)
//                         } else {
//                           setSelectedHighLights([...selectedHighLights, id])
//                         }
//                       }

//                       return (
//                         <LongClickButton
//                           key={i + id + index + tabIndex}
//                           Button={(props) => (
//                             <Tooltip title={`${content?.text}`}>
//                               <rect
//                                 ref={el => {
//                                   if (isLastHighlight && shouldScrollPDF)
//                                     typeof el?.scrollIntoView == 'function' && (
//                                       el.scrollIntoView()
//                                     )
//                                 }}
//                                 {...props}
//                                 rx={3}
//                                 ry={3}
//                                 style={isCurrentlyHighlighted ? { stroke: '#4285f4', fillOpacity: 0.3, fill: '#3a84ff' } : null}
//                                 className='OCR_RECT'
//                                 x={`${percentX}%`}
//                                 y={`${percentY}%`}
//                                 width={`${percentWidth}%`}
//                                 height={`${percentHeight}%`} >
//                               </rect>
//                             </Tooltip>
//                           )}
//                           onLongClick={longClick}
//                           onShortClick={shortClick}
//                         />
//                       )
//                     })
//                   })}
//                 </g>
//               </svg>
//               {isCropping && (
//                 <div style={{ position: 'absolute', width: pageWidth * scale, height: pageHeight * scale, zIndex: 10 }}>
//                   <Popconfirm
//                     title="Select the area and click on Done."
//                     visible={true}
//                     onConfirm={onCropDone}
//                     okButtonProps={{ loading: postingImg }}
//                     okText="Done"
//                     onCancel={() => {
//                       setIsCropping(false)
//                       setTriggerAddKeyPair(true)
//                     }}
//                   >
//                     <div></div>
//                     <Cropper
//                       src={imgLink}
//                       style={{ height: pageHeight * scale, width: pageWidth * scale }}
//                       width={pageWidth * scale}
//                       height={pageHeight * scale}
//                       guides={true}
//                       ref={cropperRef}
//                       zoomOnWheel={false}
//                     />
//                   </Popconfirm>
//                 </div>
//               )}
//             </div>
//           </Page>
//         </div>
//       </Document>

//       {Boolean(triggerAddKeyPair) && (
//         <AddKeyPairModal
//           isTemplateView={isTemplateView}
//           setCropOptions={setCropOptions}
//           pageNumber={pageNumber}
//           refresh={refresh}
//           artifactData={artifactData}
//           onClose={setTriggerAddKeyPair}
//           availableKeyPair={availableKeyPairs}
//           addedKeyPairs={addedKeyPairs}
//           setAddedKeyPairs={setAddedKeyPairs}
//         />
//       )}
//     </div>
//   )
// }

// PDFTEST.defaultProps = {
//   onDocumentLoadSuccess: () => null,
//   scale: 1,
//   pageNumber: 1,
//   resizing: false,
//   setSelectedHighLights: () => null,
//   selectedHighLights: [],
//   highlights: [],
//   tabIndex: 1,
//   setShouldScrollSidebar: () => null,
//   setShouldScrollPDF: () => null,
//   file_address: fallBackPDF
// }

// PDFTEST.propTypes = {
//   onDocumentLoadSuccess: PropTypes.func,
//   setSelectedHighLights: PropTypes.func,
//   scale: PropTypes.number,
//   pageNumber: PropTypes.number,
//   resizing: PropTypes.bool,
//   selectedHighLights: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
//   highlights: PropTypes.array,
//   shouldScrollSidebar: PropTypes.bool,
//   setShouldScrollSidebar: PropTypes.func,
//   setShouldScrollPDF: PropTypes.func,
//   shouldScrollPDF: PropTypes.bool,
//   file_address: PropTypes.string,
//   heightDiffPercent: PropTypes.number,
//   triggerAddKeyPair: PropTypes.bool,
//   setTriggerAddKeyPair: PropTypes.func,
//   availableKeyPairs: PropTypes.array,
//   refresh: PropTypes.func,
//   artifactData: PropTypes.object,
//   toggleValue: PropTypes.bool
// }

// export default PDFTEST


import { Popconfirm } from 'antd';
import 'cropperjs/dist/cropper.css';
import { ChevronLeft, ChevronRight, Navigation2, X } from 'lucide-react';
import PropTypes from 'prop-types';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import Cropper from 'react-cropper';
import { findDOMNode } from 'react-dom';
import { Document, Page, pdfjs } from 'react-pdf';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.4.456/pdf.worker.min.js';
const fallBackPDF = 'https://cors-anywhere786.herokuapp.com/https://storage.googleapis.com/context_primary/Forms/NotProcessed/doc_pdf_entity.pdf';

// Add Key Pair Modal Component
const AddKeyPairModal = ({
  isTemplateView,
  setCropOptions,
  pageNumber,
  refresh,
  artifactData,
  onClose,
  availableKeyPair,
  addedKeyPairs,
  setAddedKeyPairs
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-4 rounded-lg">
        <h2>Add Key Pair</h2>
        <button onClick={() => onClose(false)}>Close</button>
      </div>
    </div>
  );
};

// Highlight Navigator Component
const HighlightNavigator = ({
  highlights,
  selectedHighLights,
  setSelectedHighLights,
  setShouldScrollPDF,
  setShouldScrollSidebar,
  onClose
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lowConfHighlights, setLowConfHighlights] = useState([]);

  useEffect(() => {
    try {
      // Filter and flatten highlights with confidence < 65%
      const flattened = highlights.reduce((acc, curr) => [
        ...acc,
        ...curr.filter(item => {
          const confidence = item?.content?.confidence ||
            item?.confidence ||
            item?.score ||
            0;
          return confidence < 65;
        })
      ], []);

      setLowConfHighlights(flattened);

      if (flattened.length > 0) {
        setSelectedHighLights([flattened[0].id]);
        setShouldScrollPDF(true);
        setShouldScrollSidebar(true);
      }
    } catch (error) {
      console.error('Error processing highlights:', error);
      setLowConfHighlights([]);
    }
  }, [highlights, setSelectedHighLights, setShouldScrollPDF, setShouldScrollSidebar]);

  const handleNext = () => {
    if (currentIndex < lowConfHighlights.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      setSelectedHighLights([lowConfHighlights[nextIndex].id]);
      setShouldScrollPDF(true);
      setShouldScrollSidebar(true);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      setSelectedHighLights([lowConfHighlights[prevIndex].id]);
      setShouldScrollPDF(true);
      setShouldScrollSidebar(true);
    }
  };

  if (!lowConfHighlights || lowConfHighlights.length === 0) {
    return (
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-white shadow-lg rounded-lg p-4 z-50">
        <div className="text-center">
          <div className="font-medium">No low confidence items found</div>
        </div>
        <button
          onClick={onClose}
          className="absolute -top-2 -right-2 p-1 bg-white rounded-full shadow hover:bg-gray-100"
        >
          <X size={16} />
        </button>
      </div>
    );
  }

  const currentHighlight = lowConfHighlights[currentIndex];
  const confidence = currentHighlight?.content?.confidence ||
    currentHighlight?.confidence ||
    currentHighlight?.score ||
    0;

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-white shadow-lg rounded-lg p-4 z-50 flex items-center gap-4">
      <button
        onClick={handlePrevious}
        disabled={currentIndex === 0}
        className={`p-2 rounded-full ${currentIndex === 0 ? 'text-gray-400' : 'hover:bg-gray-100'}`}
      >
        <ChevronLeft size={20} />
      </button>

      <div className="text-center">
        <div className="font-medium">
          {currentHighlight?.content?.text || 'No text available'}
        </div>
        <div className="text-sm">
          <span className="text-red-500 font-medium">
            Confidence: {confidence.toFixed(1)}%
          </span>
        </div>
        <div className="text-sm text-gray-500">
          {currentIndex + 1} of {lowConfHighlights.length} low confidence items
        </div>
      </div>

      <button
        onClick={handleNext}
        disabled={currentIndex === lowConfHighlights.length - 1}
        className={`p-2 rounded-full ${currentIndex === lowConfHighlights.length - 1 ? 'text-gray-400' : 'hover:bg-gray-100'}`}
      >
        <ChevronRight size={20} />
      </button>

      <button
        onClick={onClose}
        className="absolute -top-2 -right-2 p-1 bg-white rounded-full shadow hover:bg-gray-100"
      >
        <X size={16} />
      </button>
    </div>
  );
};

// PropTypes for HighlightNavigator
HighlightNavigator.propTypes = {
  highlights: PropTypes.array.isRequired,
  selectedHighLights: PropTypes.array.isRequired,
  setSelectedHighLights: PropTypes.func.isRequired,
  setShouldScrollPDF: PropTypes.func.isRequired,
  setShouldScrollSidebar: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired
};

// Main PDF Component
const PDFTEST = ({
  triggerAddKeyPair,
  setTriggerAddKeyPair,
  isTemplateView,
  availableKeyPairs,
  refresh,
  artifactData,
  file_address,
  onDocumentLoadSuccess,
  pageNumber,
  resizing,
  setSelectedHighLights,
  selectedHighLights,
  highlights,
  heightDiffPercent,
  tabIndex,
  setShouldScrollSidebar,
  shouldScrollPDF,
  setShouldScrollPDF,
  toggleValue,
  hitlEnabled,
  ...props
}) => {
  const containerRef = useRef();
  const cropperRef = useRef();
  const [isCropping, setIsCropping] = useState(false);
  const [showNavigator, setShowNavigator] = useState(false);
  const scale = props?.scale || 1;
  const [addedKeyPairs, setAddedKeyPairs] = useState([]);
  const [rendered, setRendered] = useState({});
  const [imgLinks, setImgLinks] = useState({});
  const [postingImg, setPostingImg] = useState(false);
  const [cropSetting, setCropSetting] = useState(null);
  const pageNumStr = `Page${pageNumber}`;
  const imgLink = useMemo(() => imgLinks?.[pageNumStr], [imgLinks, pageNumStr]);
  const pageWidth = props?.pageWidth || 800;
  const pageHeight = (pageWidth + (pageWidth * (heightDiffPercent || 0) / 100));
  const finalPageWidth = cropperRef?.current?.width || (pageWidth * scale);
  const finalPageHeight = cropperRef?.current?.height || (pageHeight * scale);

  const calculateRect = (data) => {
    try {
      let rect = data.rect;
      const { x1, y1, x2, y2 } = rect;
      const x1Result = Math.round((pageWidth * (x1)));
      const y1Resut = Math.round((pageHeight * (y1)));
      const x2Result = Math.round((pageWidth * (x2)));
      const y2Result = Math.round((pageHeight * (y2))) + 2;
      const width = x2Result - x1Result;
      const height = y2Result - y1Resut;
      const percentHeight = (height / pageHeight) * 100;
      const percentWidth = (width / pageWidth) * 100;
      const percentX = ((x1Result / pageWidth) * 100);
      const percentY = ((y1Resut / pageHeight) * 100);
      return {
        x1, y1, x2, y2,
        x1Result, y1Resut, x2Result, y2Result,
        width, height,
        percentHeight, percentWidth,
        percentY, percentX,
        ...data
      };
    } catch (error) {
      console.error('Error calculating rect:', error);
      return data;
    }
  };

  const calculateCustomRect = (data) => {
    try {
      let rect = data.rect;
      const isFieldName = Boolean(data?.isKey);
      const keypair = data?.key_pair;
      const rectW = parseFloat(isFieldName ? 0 : keypair?.value_width);
      const rectH = parseFloat(isFieldName ? 0 : keypair?.value_height);
      const x1 = isFieldName ? 0 : rect?.x1;
      const x2 = isFieldName ? 0 : rect?.x1;
      const y1 = isFieldName ? 0 : rect?.y1;
      const y2 = isFieldName ? 0 : rect?.y1;
      const x1Result = parseFloat(x1) * pageWidth;
      const y1Resut = parseFloat(y1) * pageHeight;
      const width = rectW * pageWidth;
      const height = rectH * pageHeight;
      const percentHeight = (height / pageHeight) * 100;
      const percentWidth = (width / pageWidth) * 100;
      const percentX = ((x1Result / pageWidth) * 100);
      const percentY = ((y1Resut / pageHeight) * 100);
      return {
        x1, y1, x2, y2,
        x1Result, y1Resut,
        width, height,
        percentHeight, percentWidth,
        percentY, percentX,
        ...data
      };
    } catch (error) {
      console.error('Error calculating custom rect:', error);
      return data;
    }
  };

  const calculatedHighlights = useMemo(() => {
    try {
      const filteredHighlights = highlights.map((ary) => {
        return ary.filter(data => {
          const existIn = data?.key_pair?.exists_in;
          return toggleValue || (!toggleValue && existIn !== 'ground_truth_only');
        }).map((data) => {
          let isCustom = data?.key_pair?.type === "custom";
          return isCustom ? calculateCustomRect(data) : calculateRect(data);
        });
      }).filter(ary => ary.length > 0)
        .sort((a, b) => b?.[0]?.width - a?.[0]?.width)
        .sort((a, b) => b?.[0]?.height - a?.[0]?.height);

      return filteredHighlights;
    } catch (error) {
      console.error('Error calculating highlights:', error);
      return [];
    }
  }, [highlights, resizing, scale, pageNumber, tabIndex, props?.pageWidth, toggleValue, pageWidth, pageHeight]);

  const getCanvasImageUrl = (canvas) => {
    try {
      if (canvas) {
        const imgDataURL = canvas.toDataURL("image/png");
        setImgLinks(prev => ({ ...prev, [pageNumStr]: imgDataURL }));
      }
    } catch (error) {
      console.error('Error getting canvas image URL:', error);
    }
  };

  useEffect(() => {
    if (containerRef.current && rendered?.[pageNumStr] && !imgLinks?.[pageNumStr]) {
      try {
        const container = findDOMNode(containerRef.current);
        const canvas = container?.querySelector?.('.my-pdf-page canvas');
        getCanvasImageUrl(canvas);
      } catch (error) {
        console.error('Error in useEffect:', error);
      }
    }
  }, [pageNumber, containerRef, rendered, imgLinks, pageNumStr]);

  const setRectInKeyPairs = (rectObj, id) => {
    try {
      const thisKeyPair = addedKeyPairs.find(d => d?.id === id);
      const allKeyPWithoutThis = addedKeyPairs.filter(d => d?.id !== id);
      const updatedObj = Object.assign({}, thisKeyPair || {}, rectObj);
      setAddedKeyPairs([...allKeyPWithoutThis, updatedObj]);
    } catch (error) {
      console.error('Error setting rect in key pairs:', error);
    }
  };

  const onCropDone = () => {
    setPostingImg(true);
    setTimeout(() => {
      try {
        const imageElement = cropperRef?.current;
        const cropper = imageElement?.cropper;
        const croppedData = cropper.getData();

        const croppedImage = cropper.getCroppedCanvas({
          width: croppedData.width,
          height: croppedData.height,
        }).toDataURL();

        const normalizedX = (croppedData?.x || 0) / finalPageWidth;
        const normalizedY = (croppedData?.y || 0) / finalPageHeight;
        const normalizedWidth = (croppedData?.width || 0) / finalPageWidth;
        const normalizedHeight = (croppedData?.height || 0) / finalPageHeight;

        const rect = {
          x: normalizedX,
          y: normalizedY,
          width: normalizedWidth,
          height: normalizedHeight,
          img: croppedImage
        };

        setRectInKeyPairs({ [`${cropSetting?.field}`]: rect }, cropSetting?.id);
      } catch (error) {
        console.error('Error in crop done:', error);
      } finally {
        setPostingImg(false);
        setTriggerAddKeyPair(true);
        setIsCropping(false);
        setCropSetting(null);
      }
    }, 1);
  };

  const setCropOptions = (obj) => {
    setCropSetting(obj);
    setIsCropping(true);
    setTriggerAddKeyPair(false);
  };

  return (
    <div ref={containerRef} className="relative" style={{ overflow: 'auto', display: 'flex', justifyContent: 'center' }}>
      {/* Navigation Toggle Button */}
      <button
        onClick={() => setShowNavigator(!showNavigator)}
        className="fixed top-4 right-4 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 z-50"
      >
        <Navigation2 size={20} />
      </button>

      <Document
        file={file_address}
        style={{ overflow: 'auto' }}
        onLoadSuccess={onDocumentLoadSuccess}
        onLoadError={(error) => {
          console.error('Error loading PDF:', error);
        }}
      >
        <div>
          <Page
            onRenderSuccess={() => {
              if (!rendered?.[pageNumStr]) {
                setRendered(prev => ({ ...prev, [`${pageNumStr}`]: true }));
              }
            }}
            scale={scale}
            className='my-pdf-page'
            height={pageHeight}
            width={pageWidth}
            pageNumber={parseInt((pageNumber && pageNumber > 0) ? pageNumber : 1)}
          >
            <div className='annotationLayer' style={{ position: 'absolute', top: 0 }} >
              <svg style={{ position: 'absolute' }} width={pageWidth * scale} mode='canvas' height={(pageHeight * scale)}>
                <g className='bounding-boxes'>
                  {!triggerAddKeyPair && calculatedHighlights.map((dataa, i) => {
                    return dataa.map(({ content, percentX, percentY, percentWidth, percentHeight, width, id }, index) => {
                      let isCurrentlyHighlighted = Boolean(selectedHighLights.filter(ids => ids === id)[0]);
                      let isLastHighlight = Boolean(selectedHighLights[selectedHighLights.length - 1] == id);
                      let allIdsWithoutThis = selectedHighLights.filter(ids => ids !== id);

                      const setScrollsSetting = () => {
                        setShouldScrollPDF(false);
                        setShouldScrollSidebar(true);
                      };

                      const shortClick = () => {
                        setScrollsSetting();
                        setSelectedHighLights([id]);
                      };

                      const longClick = () => {
                        setScrollsSetting();
                        if (isCurrentlyHighlighted) {
                          setSelectedHighLights(allIdsWithoutThis);
                        } else {
                          setSelectedHighLights([...selectedHighLights, id]);
                        }
                      };

                      return (
                        <rect
                          key={i + id + index + tabIndex}
                          ref={el => {
                            if (isLastHighlight && shouldScrollPDF && el?.scrollIntoView) {
                              el.scrollIntoView();
                            }
                          }}
                          rx={3}
                          ry={3}
                          style={isCurrentlyHighlighted ? { stroke: '#4285f4', fillOpacity: 0.3, fill: '#3a84ff' } : null}
                          className='OCR_RECT'
                          x={`${percentX}%`}
                          y={`${percentY}%`}
                          width={`${percentWidth}%`}
                          height={`${percentHeight}%`}
                          onClick={shortClick}
                          onContextMenu={(e) => {
                            e.preventDefault();
                            longClick();
                          }}
                        >
                          <title>{content?.text}</title>
                        </rect>
                      );
                    });
                  })}
                </g>
              </svg>
              {isCropping && (
                <div style={{ position: 'absolute', width: pageWidth * scale, height: pageHeight * scale, zIndex: 10 }}>
                  <Popconfirm
                    title="Select the area and click on Done."
                    visible={true}
                    onConfirm={onCropDone}
                    okButtonProps={{ loading: postingImg }}
                    okText="Done"
                    onCancel={() => {
                      setIsCropping(false);
                      setTriggerAddKeyPair(true);
                    }}
                  >
                    <div></div>
                    <Cropper
                      src={imgLink}
                      style={{ height: pageHeight * scale, width: pageWidth * scale }}
                      width={pageWidth * scale}
                      height={pageHeight * scale}
                      guides={true}
                      ref={cropperRef}
                      zoomOnWheel={false}
                    />
                  </Popconfirm>
                </div>
              )}
            </div>
          </Page>
        </div>
      </Document>

      {/* Highlight Navigator */}
      {showNavigator && (
        <HighlightNavigator
          highlights={calculatedHighlights}
          selectedHighLights={selectedHighLights}
          setSelectedHighLights={setSelectedHighLights}
          setShouldScrollPDF={setShouldScrollPDF}
          setShouldScrollSidebar={setShouldScrollSidebar}
          onClose={() => setShowNavigator(false)}
        />
      )}

      {Boolean(triggerAddKeyPair) && (
        <AddKeyPairModal
          isTemplateView={isTemplateView}
          setCropOptions={setCropOptions}
          pageNumber={pageNumber}
          refresh={refresh}
          artifactData={artifactData}
          onClose={setTriggerAddKeyPair}
          availableKeyPair={availableKeyPairs}
          addedKeyPairs={addedKeyPairs}
          setAddedKeyPairs={setAddedKeyPairs}
        />
      )}
    </div>
  );
};

PDFTEST.defaultProps = {
  onDocumentLoadSuccess: () => null,
  scale: 1,
  pageNumber: 1,
  resizing: false,
  setSelectedHighLights: () => null,
  selectedHighLights: [],
  highlights: [],
  tabIndex: 1,
  setShouldScrollSidebar: () => null,
  setShouldScrollPDF: () => null,
  file_address: fallBackPDF,
  heightDiffPercent: 0,
  toggleValue: false,
  hitlEnabled: false
};

PDFTEST.propTypes = {
  onDocumentLoadSuccess: PropTypes.func,
  setSelectedHighLights: PropTypes.func,
  scale: PropTypes.number,
  pageNumber: PropTypes.number,
  resizing: PropTypes.bool,
  selectedHighLights: PropTypes.array,
  highlights: PropTypes.array,
  shouldScrollSidebar: PropTypes.bool,
  setShouldScrollSidebar: PropTypes.func,
  setShouldScrollPDF: PropTypes.func,
  shouldScrollPDF: PropTypes.bool,
  file_address: PropTypes.string,
  heightDiffPercent: PropTypes.number,
  triggerAddKeyPair: PropTypes.bool,
  setTriggerAddKeyPair: PropTypes.func,
  availableKeyPairs: PropTypes.array,
  refresh: PropTypes.func,
  artifactData: PropTypes.object,
  toggleValue: PropTypes.bool,
  hitlEnabled: PropTypes.bool,
  isTemplateView: PropTypes.bool
};

export default PDFTEST;