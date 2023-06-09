import React, { useState, useEffect, useRef, useMemo } from 'react'
import { Tooltip } from 'antd';
// import { ZoomInOutlined, ZoomOutOutlined } from '@ant-design/icons'
import ReactDOM from 'react-dom'
import PDF from './PDF'
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import ZoomOutIcon from '@material-ui/icons/ZoomOut';
import { IconButton, } from '@material-ui/core';
import { Icon_Blue_Color } from '../../utils/pdfConstants'
import SideBar from './NewSidebar'
import PropTypes from 'prop-types';
// import { getParagraphs } from './parseJSON'
import { useNavigate } from 'react-router-dom';
import LongClickButton from '../LongClickButton'
// import { Menu, Dropdown, } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Anim from 'react-lottie';
import './pdf.css'
// import { secureApi } from '../../Config/api';
// import { parseURL } from '../../utils/pdfHelpers';

const PDFContainer = ({ availableKeyPairs, isTemplateView, highlights, tabIndex, file_address, isLoading, artifactData, refresh, isCompleted, redacted, ...props }) => {

    const PageWrapper = useRef(null)
    const history = useNavigate()
    const [numPages, setNumPages] = useState(null);
    const [pageNumberr, setPageNumber] = useState(1);
    const pageNumber = parseInt((pageNumberr && pageNumberr > 0) ? pageNumberr : 1)
    const [scale, setRealScale] = useState(1)

    const [pageWidth, setPageWidth] = useState(812 / 2)
    const [pageHeight, setPageHeight] = useState(151 / 2)
    const [resizing, setResizing] = useState(false)
    const [bodyWidth, setbodyWidth] = useState(1000)
    const [selectedHighLights, setSelectedHighLights] = useState([]) //an array containing ids of currently selected/highlighted elements.
    const [showPageDropdown, setShowPageDropdown] = useState(false)
    const [search, setSearch] = useState('')
    const [state, setstate] = useState([])
    const [isFirstLoad, setIsFirstLoad] = useState(true)
    const [isLongClicked, setIsLongClicked] = useState(false)
    const [hasBeenMinimized, setHasBeenMinimized] = useState(false)
    const [shouldScrollSidebar, setShouldScrollSidebar] = useState(true)
    const [shouldScrollPDF, setShouldScrollPDF] = useState(true)
    const [triggerAddKeyPair, setTriggerAddKeyPair] = useState(false)
    const maxZoom = 5 //Maximum Zoom Capability
    const minZoom = .5 //Minimum Zoom Capability
    const defaultZoom = 1 //Default zoom when page loads.
    const IncreaseOrDecreaseZoomByValue = .1 //This is the value which will be decreased or increased from 'Scale' state.
    const selectedPDFPage = useMemo(() => Array.isArray(highlights) && highlights?.find(d => d?.pageNumber == pageNumber), [pageNumber, highlights])
    const selectedHighlights = selectedPDFPage?.[tabIndex == 1 ? 'paragraphs' : 'formFields']
    const dimension = selectedPDFPage?.dimension
    const heightDiffPercent = parseFloat(dimension?.heightDiffPercent)
    const currentPageHighlights = selectedHighlights ? selectedHighlights : []

    const setScale = (num) => {
        setRealScale(num)
        setTriggerAddKeyPair(false)
    }

    function onDocumentLoadSuccess(objData) {

        let numPages = objData?.numPages
        // console.log("objData", objData)
        setNumPages(numPages)
        resetSize()

        setTimeout(() => {
            resetSize()
        }, 0)
    }

    let resizeTimeOut = null
    let resetSize = () => {
        setResizing(true)
        let widthOfBody = document?.body?.offsetWidth
        setbodyWidth(widthOfBody)
        let width = ReactDOM.findDOMNode(PageWrapper?.current)?.clientWidth
        let height = ReactDOM.findDOMNode(PageWrapper?.current)?.clientHeight

        let EightyPercentWidth = width - (width * .20)

        if (width && EightyPercentWidth && height) {
            setTriggerAddKeyPair(isTemplateView)
            setPageWidth(EightyPercentWidth)
            setPageHeight(height)
            // setTriggerAddKeyPair(isadding)
        }
        resizeTimeOut = setTimeout(() => {
            setResizing(false)

        }, 0)
    }

    useEffect(() => {
        setResizing(true)
        resetSize()
        // if(pageNumber>numPages){
        //     setPageNumber(numPages)
        // }
        // if(pageNumber<1){
        //     setPageNumber(1)
        // }
    }, [PageWrapper, pageNumber, numPages])


    // useEffect(() => {
    //     const [scaleParam, pageParam, searchParam] = ['scale', 'page', 's']
    //     let timeoutForParams = null;
    //     clearTimeout(timeoutForParams) //clear anytimer if exist.


    //     timeoutForParams = setTimeout(() => { //This will help us changing url only when user has completed channging pages, scaling or searching. 
    //         if (!isFirstLoad) {
    //             history.replace(`?${scaleParam}=${scale}&${pageParam}=${pageNumber}&${searchParam}=${search}`)
    //         }
    //         else {
    //             let query = history.location.search
    //             let getParam = (param) => new URLSearchParams(`${query}`).get(param);

    //             let querySearch = getParam(searchParam)
    //             let queryScale = parseFloat(getParam(scaleParam))
    //             let queryPage = parseInt(getParam(pageParam))
    //             if (querySearch && querySearch.length) setSearch(querySearch);
    //             if (queryScale) setScale(queryScale > maxZoom ? maxZoom : queryScale);
    //             if (queryPage && typeof queryPage == 'number')
    //                 setPageNumber(queryPage > numPages ? numPages : queryPage < 1 ? 1 : queryPage);
    //         }
    //         setIsFirstLoad(false)

    //     }, 500)

    //     return () => clearTimeout(timeoutForParams)
    // }, [scale, pageNumber, search])

    useEffect(() => {

        let timeout = null
        if (timeout) clearTimeout(timeout);
        const resizeWithDelay = () => {
            timeout = setTimeout(resetSize, 100);
        }
        window.addEventListener('resize', resizeWithDelay)
        if (setTriggerAddKeyPair) {
            setTriggerAddKeyPair(isTemplateView)///This was done on purpose so dont change.
        }

        return () => {
            clearTimeout(resizeTimeOut)
            window.removeEventListener('resize', resizeWithDelay)
        } //Remove Listeener on unmount
    }, [])

    const isPageIncreasePossible = pageNumber < numPages
    const isPageDecreasePossible = pageNumber > 1

    const IncreasePage = () => {
        if (isPageIncreasePossible) {
            let newPage = parseInt(pageNumber + 1)
            if (newPage <= numPages && newPage > 0) setPageNumber(newPage);
        }
    }

    const DecreasePage = () => {
        if (isPageDecreasePossible) {
            let newPage = parseInt(pageNumber - 1)
            if (newPage <= numPages && newPage > 0) setPageNumber(newPage);
        }
    }

    const onShortClickPage = (isGoingNext) => {
        if (isGoingNext) {
            IncreasePage()
        }
        else {
            DecreasePage()
        }
    }

    const onLongClickPage = (isGoingNext) => {
        if (isGoingNext) {
            setPageNumber(numPages)
        }
        else {
            setPageNumber(1)
        }
    }

    const isScaleIncreasePossible = scale < maxZoom
    const isScaleDecreasePossible = scale > minZoom

    const IncreaseScale = () => {
        setResizing(true)
        if (isScaleIncreasePossible) {
            setScale(scale + IncreaseOrDecreaseZoomByValue)
        }
        setTimeout(() => {
            setResizing(false)

        }, 10)
    }

    const DecreaseScale = () => {
        if (isScaleDecreasePossible) {
            setScale(scale - IncreaseOrDecreaseZoomByValue)
        }
    }

    const onShortClickZoom = (isZoomIn) => {
        if (!hasBeenMinimized) {
            if (isZoomIn) {
                IncreaseScale()
            }
            else {
                DecreaseScale()
            }
        }
        else {
            setHasBeenMinimized(false)
        }
    }

    const onLongClickZoom = (isZoomIn) => {
        if (isZoomIn) {
            setScale(maxZoom)
        }
        else { //ZoomOut
            setHasBeenMinimized(true)
            setScale(defaultZoom)
        }
    }

    const FlexRowDiv = (props) => (<div {...props} style={{ display: 'flex', flexDirection: 'row', ...props.style, alignItems: 'center' }} />)
    const justify = scale > 1.5 ? 'flex-start' : 'center'



    // let responseiveGrid = bodyWidth < 670 ? 2 : bodyWidth < 1000 ? 3 : bodyWidth < 2000 ? 4 : bodyWidth < 3000 ? 6 : 8
    let globalHeight = `100%`
    let faltuArray = new Array(numPages).fill(1)

    return (
        <div style={{ background: '#f6f6f6' }}>
            <div style={{ display: 'flex', flexDirection: 'row', maxHeight: '95vh', minHeight: '75vh', overflow: 'hidden' }}>
                {!redacted && <SideBar
                    isTemplateView={isTemplateView}
                    triggerAddKeyPair={triggerAddKeyPair}
                    setTriggerAddKeyPair={setTriggerAddKeyPair}
                    availableKeyPairs={availableKeyPairs}
                    refresh={refresh}
                    isCompleted={isCompleted}
                    artifactData={artifactData}
                    isLoading={isLoading}
                    shouldScrollSidebar={shouldScrollSidebar}
                    setShouldScrollSidebar={setShouldScrollSidebar}
                    shouldScrollPDF={shouldScrollPDF}
                    setShouldScrollPDF={setShouldScrollPDF}
                    selectedHighLights={selectedHighLights}
                    setSelectedHighLights={setSelectedHighLights}
                    setSearch={setSearch}
                    search={search}
                    globalHeight={globalHeight}
                    height={pageHeight}
                    highlights={currentPageHighlights}
                    {...props}
                />}

                <div style={{ padding: 0, overflow: 'hidden', width: '100%' }} flex={3}>


                    <div style={{
                        height: globalHeight,
                        position: 'relative',
                    }}>
                        <div>
                            <div style={{ backgroundColor: '#f6f6f6', marginBottom: 15 }} className='ParentFunctionsDiv' >
                                <FlexRowDiv style={{ justifyContent: 'space-between' }} >
                                    <FlexRowDiv  >
                                        <LongClickButton
                                            Button={(props) => (
                                                <Tooltip title='Zoom Out - Long click for full Zoom out'>
                                                    <IconButton  {...props} disabled={!isScaleDecreasePossible}   >
                                                        <ZoomOutIcon style={isScaleDecreasePossible ? { color: Icon_Blue_Color } : null} />
                                                    </IconButton>
                                                </Tooltip>
                                            )}

                                            onLongClick={() => onLongClickZoom(false)}
                                            onShortClick={() => onShortClickZoom(false)}
                                        />
                                        <Tooltip title='Current Zoom'>
                                            <span style={{ fontSize: 11, fontWeight: 'bold' }}> {Math.floor(parseFloat(scale * 100))}%</span>
                                        </Tooltip>
                                        <LongClickButton
                                            Button={(props) => (
                                                <Tooltip title='Zoom In - Long click for full Zoom In'>
                                                    <IconButton {...props} disabled={!isScaleIncreasePossible}  >
                                                        <ZoomInIcon style={isScaleIncreasePossible ? { color: Icon_Blue_Color } : null} />
                                                    </IconButton>
                                                </Tooltip>
                                            )}
                                            onLongClick={() => onLongClickZoom(true)}
                                            onShortClick={() => onShortClickZoom(true)}
                                        />
                                    </FlexRowDiv>
                                    <FlexRowDiv>
                                        <LongClickButton
                                            Button={(props) => (
                                                <IconButton {...props} disabled={!isPageDecreasePossible} onClick={DecreasePage}   >
                                                    <ArrowUpwardIcon style={isPageDecreasePossible ? { color: Icon_Blue_Color } : null} />
                                                </IconButton>
                                            )}
                                            onLongClick={() => onLongClickPage(false)}
                                            onShortClick={() => onShortClickPage(false)}
                                        />
                                        <span style={{ fontSize: 11, fontWeight: 'bold', cursor: 'pointer' }}>

                                            <span onClick={() => setShowPageDropdown(!showPageDropdown)}>
                                                {pageNumber} / {numPages} <DownOutlined />
                                            </span>
                                            <span style={{
                                                position: 'absolute',
                                                right: 50,
                                                bottom: 10,
                                                opacity: 0
                                            }}>
                                                <Select

                                                    onClose={() => setShowPageDropdown(false)}
                                                    onOpen={() => setShowPageDropdown(true)}
                                                    open={showPageDropdown}

                                                    value={pageNumber ? pageNumber : 1}
                                                    onChange={(event) => {
                                                        let newPage = parseInt(event.target.value)
                                                        if (newPage && newPage <= numPages && newPage > 0)
                                                            setPageNumber(newPage)
                                                    }}
                                                >
                                                    {faltuArray.map((d, i) => (
                                                        <MenuItem key={i + 'pagelist'} value={i + 1}># {i + 1}</MenuItem>
                                                    ))}
                                                </Select>
                                            </span>
                                        </span>
                                        <LongClickButton
                                            Button={(props) => (
                                                <IconButton {...props} disabled={!isPageIncreasePossible} onClick={IncreasePage}   >
                                                    <ArrowDownwardIcon style={isPageIncreasePossible ? { color: Icon_Blue_Color } : null} />
                                                </IconButton>
                                            )}
                                            onLongClick={() => onLongClickPage(true)}
                                            onShortClick={() => onShortClickPage(true)}
                                        />
                                    </FlexRowDiv>
                                </FlexRowDiv>
                            </div>
                        </div>

                        <div style={{
                            height: 'calc(100% - 75px)',
                            overflow: 'auto',
                            filter: `drop-shadow(0px 0px 15px silver)`,
                            margin: 10,
                            padding: 10,
                            display: 'flex',
                            minHeight: 400
                        }}>
                            <div ref={PageWrapper} style={{
                                display: 'flex',
                                justifyContent: 'center',
                                width: '100%',
                                justifyContent: 'center',
                                position: 'relative'
                            }}>
                                {isLoading && <div className='pdfLoadingContainer' style={{ height: pageHeight }}>
                                    <Anim
                                        options={{
                                            animationData: require('../../assets/animations/PDFScan.json'),
                                        }}
                                        height={500}
                                        width={500}
                                    />
                                    <p className='pdfLoadingText'>PLEASE WAIT, SCANNING PDF....</p>
                                </div>}
                                <PDF
                                    isTemplateView={isTemplateView}
                                    triggerAddKeyPair={triggerAddKeyPair}
                                    setTriggerAddKeyPair={setTriggerAddKeyPair}
                                    refresh={refresh}
                                    availableKeyPairs={availableKeyPairs}
                                    artifactData={artifactData}
                                    heightDiffPercent={heightDiffPercent ? heightDiffPercent : 29}
                                    shouldScrollSidebar={shouldScrollSidebar}
                                    setShouldScrollSidebar={setShouldScrollSidebar}
                                    shouldScrollPDF={shouldScrollPDF}
                                    setShouldScrollPDF={setShouldScrollPDF}
                                    file_address={file_address}
                                    tabIndex={tabIndex}
                                    highlights={currentPageHighlights}
                                    selectedHighLights={selectedHighLights}
                                    setSelectedHighLights={setSelectedHighLights}
                                    scale={scale}
                                    pageHeight={pageHeight}
                                    pageWidth={pageWidth}
                                    pageNumber={pageNumber}
                                    resizing={resizing}
                                    onDocumentLoadSuccess={onDocumentLoadSuccess}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

PDFContainer.defaultProps = {
    highlights: {}
}

PDFContainer.propTypes = {
    highlights: PropTypes.array, //PropTypes.arrayOf(PropTypes.object)
    file_address: PropTypes.string,
    isLoading: PropTypes.bool,
    artifactData: PropTypes.object
}

export default PDFContainer