import React, { useState } from 'react'
import { CheckCircle } from '@material-ui/icons'
import { secureApi } from '../../Config/api'
import { allAPIs } from '../../utils/pdfConstants'
import { useDispatch, useSelector } from 'react-redux'
import { errorMessage, parseURL } from '../../utils/pdfHelpers'
import { Tooltip } from 'antd'
import { setArtifactData } from '../../Redux/actions/artifactActions'
import { CheckCircleOutline } from '@material-ui/icons'
import { ARTIFACT } from '../../utils/apis'

const ValidateButton = ({ artifactData, style, refresh, loading, ...props }) => {
    const user = useSelector(state => state.authReducer.user)
    const dispatch = useDispatch()
    const [isloading, setIsLoading] = useState(false)
    const user_id = user?.id
    const id = artifactData?.id

    const handleValidate = () => {
        // POST => body= {	"id", "user_id"}
        if (user_id && id) {
            setIsLoading(true)
            secureApi.post(ARTIFACT.POST.SET_VALIDATE, { id, user_id })
                .then((data) => {
                    if (typeof refresh == "function") { //if refresh function is passed from props, use that otherwise use the default function.
                        refresh()
                    }
                    else {
                        refreshData()
                    }
                    setIsLoading(false)
                })
        }
        else {
            console.log('Missing user_id or id', user_id, id, user)
        }
    }

    const refreshData = () => {

        let name = artifactData?.artifact_name
        if (name) {
            setIsLoading(true)

            secureApi.get(`${ARTIFACT.GET.ARTIFACT_BY_NAME}/${name}`)
                .then((data) => {
                    if (data?.success) {
                        let refreshedData = data?.data
                        if (refreshedData?.id) { //make sure that the data is correct and has required info
                            dispatch(setArtifactData(refreshedData))
                        }
                    } else {
                        let errMsg = data?.message;
                        errMsg && errorMessage(errMsg);
                    }
                    setIsLoading(false)
                })
                .catch((err) => {
                    let errMsg = err?.response?.data?.message;
                    errMsg && errorMessage(errMsg);
                    setIsLoading(false)
                })
        }
    }
    const icon_style = { color: isloading ? "gray" : "rgb(0, 128, 247)" }


    return (
        artifactData && user_id ? (

            // <Button {...props} onClick={handleValidate} loading={isLoading} style={style || { width: 200, padding: 15 }
            // } type="primary" id="validateBtn">
            //     <CheckCircle style={{ fontSize: 15, marginRight: 5 }} />  Validate
            // </Button >
            <Tooltip title={artifactData?.is_validate ? "This file is validated" : "Click to validate"}>

                <span onClick={handleValidate} id="artifactBookmark">

                    {artifactData?.is_validate ? (
                        <CheckCircle className='MaterialIcons myHeaderIcons' style={{ fontSize: 30, ...icon_style }} />
                    ) : (
                        <CheckCircleOutline className='MaterialIcons myHeaderIcons' style={{ fontSize: 30, ...icon_style }} />
                    )
                    }
                </span>
            </Tooltip>
        ) : null
    )
}

export default ValidateButton