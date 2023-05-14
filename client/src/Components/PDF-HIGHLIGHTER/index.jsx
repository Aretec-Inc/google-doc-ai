import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import Tabs from './Tabs'
import PropTypes from 'prop-types'
import { errorMessage } from '../../utils/pdfHelpers'
import IconButton from '@material-ui/core/IconButton'
import { Replay } from '@material-ui/icons'
import { secureApi } from '../../Config/api'
import PDFContainer from './PDFContainer'
import { CircularProgress, Tooltip } from '@material-ui/core'
import { setArtifactData } from '../../Redux/actions/artifactActions'
import { useDispatch } from 'react-redux'
import { GET } from '../../utils/apis'


const PdfHightlighter = ({ enableShadow, isTemplateView, maxWidth = '100vw', ...props }) => {
    const dispatch = useDispatch()
    const [json, setJson] = useState(null)
    const [parsedData, setParsedData] = useState([])
    const [loading, setLoading] = useState(true)
    const [openInModal, setOpenInModal] = useState(false)
    const [tabIndex, setTabIndex] = useState(0)
    const [key_pairs, setKey_pairs] = useState([])
    const [hasFormFields, setHasFormFields] = useState(true)
    const [isSchemaGenerated, setIsSchemaGenerated] = useState(false)
    let artifactData = useSelector((state) => state.artifactReducer.artifactData)
    artifactData = props?.artifactData || artifactData
    // const [isCompleted, setIsCompleted] = useState(false);
    const [dlpKeyPairs, setDlpKeyPairs] = useState([])

    const [availableKeyPairs, setAvailableKeyPairs] = useState([])
    let form1Name = `form-22a.pdf`
    let file_name = artifactData?.file_name || form1Name
    let file_address = artifactData?.file_address && artifactData?.file_address //|| updateUrl(form1)
    let form_name = artifactData?.form_name
    let redacted_file_address = artifactData?.redacted_file_address

    useEffect(() => {
        getData()
        setParsedData([])
    }, [artifactData])

    // alert(JSON.stringify(artifactData))

    const onData = (data) => {

        // setIsCompleted(is_completed)
        // let raw_data = data?.raw_data
        let parsed_data = data?.parsed_data
        let key_prs = data?.key_pairs
        setIsSchemaGenerated(data?.isSchemaGenerated)

        if (data?.success && parsed_data) {
            //setJson(raw_data)
            // alert(raw_data)
            setParsedData(parsed_data)
            parsed_data.forEach(d => {
                if (d?.formFields?.length) {
                    setHasFormFields(true)
                }
            })

            if (data?.fileData && typeof data?.fileData == "object") {

                let updatedArtifact = Object.assign(artifactData || {}, data?.fileData)
                dispatch(setArtifactData(updatedArtifact))
            }
            if (key_prs) {
                setKey_pairs(key_prs)

                let dlpKP = Array.isArray(key_prs) && key_prs.length && key_prs.filter(d => d?.dlp_info_type && d?.dlp_match_likelihood)

                if (Array.isArray(dlpKP) && dlpKP.length) {
                    setDlpKeyPairs(dlpKP)
                }
                else {
                    setDlpKeyPairs([])
                }
            }
        }
        else {
            setLoading(false)
        }
    }

    const getData = () => {
        if (file_name) {
            setLoading(true)
            secureApi.get(`${GET.PDF_DATA}?file_name=${file_name}&form_name=${form_name}`)
                .then(onData)
                .catch((err) => {
                    console.log(err)
                    let errMsg = err?.response?.data?.message
                    errMsg && errorMessage(errMsg)
                })
                .finally(() => {
                    setLoading(false)
                })
        }
    }

    const testingFileAddress = "https://storage.googleapis.com/elaborate-howl-285701_context_primary/templates/4904bd9c-f1fc-489f-9efc-1a5637b22d8d-DD2875_AUG_wh_filled%202%20copy%202.pdf?GoogleAccessId=bigquery-nodejs%40elaborate-howl-285701.iam.gserviceaccount.com&Expires=1631802906&Signature=GWcyvIa5a%2FBQc%2F0IPj3Dw4pO8NW9eS5MwAPfGJRhvo8gS2ICr8s8WBJvWriZEwVfXulftNVKy%2FiIG%2FDGNM3%2BVIXCN8o%2F2WtmBMXOQu3Rw3M%2F99BNePM4OPFUOpYAnHeypXrvfVOh0KYCIT9X2mFJdcadF3nDaykxd6b%2FDyw3nuBUuUw8HXDsan4OpYoERYQUEUIyDZyGoK774HeQACYeQPYFJHPiKVT2ZWWFkxThou2cGhxEPZGaqSADAB3g6ehbLh%2F3N6OhKOKxlL%2FO5Y0MNl%2BP9H3wOfvTwyjzJk7rPnzVmH4AWALNyaumeKMbR0L%2BLRp%2BBYoOWNTUZweFbV6vfw%3D%3D"

    const ConditionalComponent = (
        <div style={{ filter: enableShadow ? `drop-shadow(0px 0px 10px silver)` : 'unset', ...openInModal ? {} : { maxWidth } }}>
            <div style={{ display: 'none', flexDirection: 'row', borderBottom: `.5px solid silver`, background: 'white' }}>
                <div style={{ width: '100%' }}>
                    <Tabs redacted_file_address={redacted_file_address} showKeyPairTab={hasFormFields} showTableTab={Boolean(key_pairs?.length)} showJSONTab={Boolean(json)} onChange={(e, newvalue) => setTabIndex(newvalue)} value={tabIndex} />
                </div>
                <IconButton disabled={loading} onClick={getData} style={{ padding: 5 }} color="primary" aria-label="upload picture" component="span">
                    <Tooltip title={loading ? 'Please wait, Loading Data' : 'Reload Data'} arrow>
                        <span style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} >  {loading ? <CircularProgress size={25} /> : <Replay />}</span>
                    </Tooltip>
                </IconButton>
            </div>
            {(Boolean(tabIndex == 0 || tabIndex == 1 || tabIndex == 5)) && (
                <PDFContainer
                    isTemplateView={isTemplateView}
                    availableKeyPairs={availableKeyPairs}
                    refresh={getData}
                    isCompleted={artifactData?.is_completed}
                    artifactData={artifactData}
                    file_address={tabIndex == 5 ? redacted_file_address : (file_address || testingFileAddress)}
                    tabIndex={tabIndex}
                    highlights={tabIndex == 5 ? [] : parsedData}
                    isLoading={loading}
                    redacted={tabIndex == 5}
                    {...props}
                />
            )}
        </div>)

    return (
        <>
            {ConditionalComponent}
        </>
    )
}

PdfHightlighter.propTypes = {
    enableShadow: PropTypes.bool,
    artifactData: PropTypes.object
}

export default PdfHightlighter