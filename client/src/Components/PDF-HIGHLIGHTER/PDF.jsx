import React, { useState, useEffect, useRef, useMemo } from 'react'
import { Document, pdfjs, Page } from 'react-pdf'
import PropTypes from 'prop-types'
import { Popconfirm, Tooltip } from 'antd'
import LongClickButton from '../LongClickButton'
import { findDOMNode } from 'react-dom'
import AddKeyPairModal from './AddKeyPairModal'
import Cropper from 'react-cropper'
import 'cropperjs/dist/cropper.css'

pdfjs.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.4.456/pdf.worker.min.js'
const fallBackPDF = 'https://cors-anywhere786.herokuapp.com/https://storage.googleapis.com/context_primary/Forms/NotProcessed/doc_pdf_entity.pdf'

// let pageWidth = page.dimension.width
// let pageHeight = page.dimension.height


// const getLocalSignatures = () => {
//   try {
//     return JSON.parse(localStorage.getItem('signature'))
//   } catch (e) {
//     return null
//   }
// }
// const setLocalSignatures = (signature) => {
//   try {
//     let sig = JSON.stringify(signature)
//     localStorage.setItem('signature', sig)
//   } catch (e) {
//     console.log(e)
//   }
// }

const PDFTEST = (
  {
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
    highlights, heightDiffPercent,
    tabIndex,
    setShouldScrollSidebar,
    shouldScrollPDF,
    setShouldScrollPDF, ...props
  }
) => {
  const containerRef = useRef()
  // const imageRef = useRef()
  const cropperRef = useRef()

  const [isCropping, setIsCropping] = useState(false)
  const scale = props?.scale
  // const [highlights, setHighlights] = useState(highlightss())
  // const [thispageHeight, setPageHeight] = useState(1051 / 2)
  // const [isLongClicked, setIsLongClicked] = useState(false)
  // const [showModal, setShowModal] = useState(false)
  // const [downloading, setDownloading] = useState(false)
  const [addedKeyPairs, setAddedKeyPairs] = useState([])

  const [rendered, setRendered] = useState(false)
  const [imgLinks, setImgLinks] = useState('')
  const [postingImg, setPostingImg] = useState(false)

  const [cropSetting, setCropSetting] = useState()
  // const [isFirstCrop, setisFirstCrop] = useState(true)
  const pageNumStr = `Page${pageNumber}`

  const imgLink = useMemo(() => imgLinks?.[pageNumStr], [imgLinks, pageNumStr])
  // const [signatures, setSignatures] = useState(getLocalSignatures() ? getLocalSignatures() : [])
  // const semiFinalHeight = (props?.pageHeight ? props?.pageHeight : thispageHeight) * scale
  const pageWidth = props?.pageWidth || 800
  const pageHeight = (pageWidth + (pageWidth * (heightDiffPercent) / 100))
  //const pageHeight= semiFinalHeight>heightExtractedFromWidth?semiFinalHeight:heightExtractedFromWidth
  const finalPageWidth = cropperRef?.current?.width || (pageWidth * scale) //final width of canvas
  const finalPageHeight = cropperRef?.current?.height || (pageHeight * scale)//final height of canvas


  const calculateRect = (data) => {
    let rect = data.rect

    const { x1, y1, x2, y2 } = rect
    const x1Result = Math.round((pageWidth * (x1))) // scale
    const y1Resut = Math.round((pageHeight * (y1)))//scale 

    const x2Result = Math.round((pageWidth * (x2))) //* scale
    const y2Result = Math.round((pageHeight * (y2))) + 2//* scale
    const width = x2Result - x1Result
    const height = y2Result - y1Resut
    const percentHeight = (height / pageHeight) * 100
    const percentWidth = (width / pageWidth) * 100

    const percentX = ((x1Result / pageWidth) * 100)
    const percentY = ((y1Resut / pageHeight) * 100)
    return { x1, y1, x2, y2, x1Result, y1Resut, x2Result, y2Result, width, height, percentHeight, percentWidth, percentY, percentX, ...data }
  }

  const calculateCustomRect = (data) => {
    let rect = data.rect
    // console.log("DATAAA", data)
    const isFieldName = Boolean(data?.isKey)

    const keypair = data?.key_pair


    const rectW = parseFloat(isFieldName ? 0 : keypair?.value_width)
    const rectH = parseFloat(isFieldName ? 0 : keypair?.value_height)

    // const { x1, y1, x2, y2 } = rect

    const x1 = isFieldName ? 0 : rect?.x1
    const x2 = isFieldName ? 0 : rect?.x1
    const y1 = isFieldName ? 0 : rect?.y1
    const y2 = isFieldName ? 0 : rect?.y1

    const x1Result = parseFloat(x1) * pageWidth
    const y1Resut = parseFloat(y1) * pageHeight
    const width = rectW * pageWidth
    const height = rectH * pageHeight
    const percentHeight = (height / pageHeight) * 100
    const percentWidth = (width / pageWidth) * 100

    const percentX = ((x1Result / pageWidth) * 100)
    const percentY = ((y1Resut / pageHeight) * 100)

    const calcResult = { x1, y1, x2, y2, x1Result, y1Resut, width, height, percentHeight, percentWidth, percentY, percentX, ...data }
    //console.log("calcResult", data, calcResult)
    return calcResult

  }

  // console.log("added keypairs....", addedKeyPairs)
  const calculatedHighlights = useMemo(() => (
    highlights.map((ary, i) => {
      return ary.map((data) => {
        let isCustom = data?.key_pair?.type == "custom"
        if (isCustom) {
          return calculateCustomRect(data)
        } else {
          return calculateRect(data)
        }

      })
    }).filter(Boolean)?.sort((a, b) => b?.[0]?.width - a?.[0]?.width).sort((a, b) => b?.[0]?.height - a?.[0]?.height)//render Small first, sort by small width/
  )
    , [highlights, resizing, scale, pageNumber, tabIndex, props?.pageWidth])


  // useEffect(() => {
  //   if (signatures && signatures.length) {
  //     setLocalSignatures(signatures)
  //   }
  // }, [signatures])

  // let DownloadPDF = async () => {

  //   ///(PDF_URL, { imgURL, layout }, pageNumber)
  //   setDownloading(true)
  //   const sign = signatures?.[0]
  //   const layout = sign?.layout
  //   const height = parseInt(layout?.height) * scale
  //   const width = parseInt(layout?.width) * scale
  //   const x = parseFloat(layout?.y) / pageHeight
  //   const y = parseFloat(layout?.x) / pageWidth

  //   let newLayout = { height, width, x, y }
  //   await DownloadPDFWithSignature(file_address, Object.assign({}, sign, { layout: newLayout }), (pageNumber - 1))
  //   setDownloading(false)
  // }

  const getCanvasImageUrl = (canvas) => {
    try {
      const imgDataURL = canvas.toDataURL("image/png");
      setImgLinks({ [pageNumStr]: imgDataURL })

    }
    catch (ex) {
      console.log(ex)
    }
  }

  useEffect(() => {
    if (containerRef.current && rendered?.[pageNumStr] && !imgLinks?.[pageNumStr]) {
      const container = findDOMNode(containerRef.current)
      const canvas = container?.querySelector?.('.my-pdf-page canvas')
      getCanvasImageUrl(canvas)
    }
  }, [pageNumber, containerRef, rendered])

  let setRectInKeyPairs = (rectObj, id) => {
    let thisKeyPair = addedKeyPairs.find(d => d?.id == id)
    let allKeyPWithoutThis = addedKeyPairs.filter(d => d?.id !== id)

    let prevObj = thisKeyPair
    let updatedObj = Object.assign(prevObj || {}, rectObj)

    setAddedKeyPairs([...allKeyPWithoutThis, updatedObj])
  }

  const onCropDone = () => {
    setPostingImg(true)
    setTimeout(() => {//to make loading visible, otherwise it feels like freez.

      const imageElement = cropperRef?.current;
      const cropper = imageElement?.cropper;
      //
      // let isSame = OBJ?.x == rectangle?.x && OBJ?.y == rectangle?.y && OBJ?.width == rectangle?.w && OBJ?.height == rectangle?.h
      const croppedData = cropper.getData()//rectangle.
      const canvasData = cropper.getCanvasData()

      const croppedImage = cropper.getCroppedCanvas({
        width: croppedData.width,
        height: croppedData.height,
      }).toDataURL()

      const normalizedX = (croppedData?.x || 0) / finalPageWidth
      const normalizedY = (croppedData?.y || 0) / finalPageHeight
      const normalizedWidth = (croppedData?.width || 0) / finalPageWidth
      const normalizedHeight = (croppedData?.height || 0) / finalPageHeight

      const rect = {
        x: normalizedX,
        y: normalizedY,
        width: normalizedWidth,
        height: normalizedHeight,
        img: croppedImage
      }

      setRectInKeyPairs({ [`${cropSetting?.field}`]: rect }, cropSetting?.id)

      setPostingImg(false)
      setTriggerAddKeyPair(true)
      setIsCropping(false)
      setCropSetting(null)
    }, 1)
  }

  const setCropOptions = (obj) => { //must contain id of field and wither its field_name (fRect) or field_vale rect (vRect)
    setCropSetting(obj)
    setIsCropping(true)
    setTriggerAddKeyPair(false)
  }

  return (
    <div ref={containerRef} style={{ overflow: 'auto', display: 'flex', justifyContent: 'center' }}>
      <Document
        file={file_address}
        style={{ overflow: 'auto' }}
        onLoadSuccess={onDocumentLoadSuccess}
      >

        <div>
          <Page
            // canvasRef={d => console.log("canvasRef", d)}
            onRenderSuccess={() => {
              if (!rendered?.[pageNumStr]) {
                setRendered({ [`${pageNumStr}`]: true })
              }
            }}
            scale={scale}
            className='my-pdf-page'
            height={pageHeight}
            width={pageWidth}

            pageNumber={parseInt((pageNumber && pageNumber > 0) ? pageNumber : 1)}
          >
            {/* {blocks.map((d,i) => {

                        return ( */}
            <div className='annotationLayer' style={{ position: 'absolute', top: 0 }} >

              {/* {signatures && ( */}
              {/* <div className='layout' style={{ height: (pageHeight * scale), width: (pageWidth * scale), position: 'absolute', overflow: 'hidden' }} > */}

              {/* {signatures.map(({ imgURL, layout }, i) => {
                    const y = layout?.y ? layout.y : 0
                    const x = layout?.x ? layout.x : 0
                    const width = layout?.width ? layout.width : 0
                    const height = layout?.height ? layout.height : 0


                    return (
                      <Rnd
                        className='SignatureBoxRND'
                        bounds='parent'
                        lockAspectRatio={true}

                        key={`${i}_sign`}
                        size={{ width: (parseInt(width) * scale), height: (parseInt(height) * scale) }}
                        position={{ x, y }}
                        onDragStop={(e, d) => {
                          let signature = signatures[i]
                          let newLayout = Object.assign({}, signature.layout, { x: d.x, y: d.y })
                          let newSignatureOBJ = Object.assign({}, signature, { layout: newLayout })

                          setSignatures([newSignatureOBJ])

                        }}
                        onResizeStop={(e, direction, ref, delta, position) => {

                          let signature = signatures[i]
                          let newLayout = Object.assign({},
                            signature.layout,
                            {
                              width: ref.style.width,
                              height: ref.style.height,
                              ...position,
                            })

                          let newSignatureOBJ = Object.assign({}, signature, { layout: newLayout })

                          setSignatures([newSignatureOBJ])
                        }}
                        style={{
                          background: `url(${imgURL})`,

                        }}
                      >

                      </Rnd>
                    )


                  })} */}

              {/* </div>)} */}
              {/* {!resizing  ? ( */}
              <svg style={{ position: 'absolute' }} width={pageWidth * scale} mode='canvas' height={(pageHeight * scale)}>
                <g className='bounding-boxes'>
                  {!triggerAddKeyPair && calculatedHighlights.map((dataa, i) => {
                    return dataa.map(({ content, percentX, percentY, percentWidth, percentHeight, width, id }, index) => {
                      let isCurrentlyHighlighted = Boolean(selectedHighLights.filter(ids => ids === id)[0])
                      let isLastHighlight = Boolean(selectedHighLights[selectedHighLights.length - 1] == id)

                      let allIdsWithoutThis = selectedHighLights.filter(ids => ids !== id)
                      var timeOut = null
                      const setScrollsSetting = () => {
                        setShouldScrollPDF(false)
                        setShouldScrollSidebar(true)
                      }

                      const shortClick = () => {
                        setScrollsSetting()
                        setSelectedHighLights([id])
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

                      return (
                        <LongClickButton
                          key={i + id + index + tabIndex}
                          Button={(props) => (
                            <Tooltip title={`${content?.text}`}>
                              <rect
                                ref={el => {
                                  if (isLastHighlight && shouldScrollPDF)
                                    typeof el?.scrollIntoView == 'function' && (
                                      el.scrollIntoView()
                                    )
                                }}
                                {...props}
                                rx={3}
                                ry={3}
                                style={isCurrentlyHighlighted ? { stroke: '#4285f4', fillOpacity: 0.3, fill: '#3a84ff' } : null}
                                className='OCR_RECT'
                                x={`${percentX}%`}
                                y={`${percentY}%`}
                                width={`${percentWidth}%`}
                                height={`${percentHeight}%`} >
                              </rect>
                            </Tooltip>
                          )}
                          onLongClick={longClick}
                          onShortClick={shortClick}
                        />
                      )
                    })
                  })
                  }
                </g>
              </svg>
              {isCropping && (<div style={{ position: 'absolute', width: pageWidth * scale, height: pageHeight * scale, zIndex: 10 }}>

                <Popconfirm
                  title="Select the area and click on Done."
                  visible={true}
                  onConfirm={onCropDone}
                  okButtonProps={{ loading: postingImg }}
                  okText="Done"
                  onCancel={() => {
                    setIsCropping(false)
                    setTriggerAddKeyPair(true)
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

              </div>)}
            </div>
            {/* )
                    })} */}
            {/* <div style={{ height: 200, width: 300, background: 'rgba(0,0,0,.3)', position: 'absolute', top: y1, left: x1, color: 'white' }}>

                        top:{highlightss[1].y1} , left:{highlightss[1].x1}
                    </div> */}
          </Page>
        </div>
      </Document>

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
  )
}

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
  file_address: fallBackPDF
}

PDFTEST.propTypes = {
  onDocumentLoadSuccess: PropTypes.func,
  setSelectedHighLights: PropTypes.func,
  scale: PropTypes.number,
  pageNumber: PropTypes.number,
  resizing: PropTypes.bool,
  selectedHighLights: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
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
  artifactData: PropTypes.object
}

export default PDFTEST