import { Button, Tooltip, Select, Drawer, Table } from 'antd'
import React, { useEffect, useState } from 'react'
import Highlighter from 'react-highlight-words'
import { AiOutlineArrowLeft } from "react-icons/ai"
import { useSelector } from 'react-redux'
import './HeaderTopBar.css'
import './SelectedCardData.css'

const HeaderTopBar = ({ goBack, reduxActions, searchKey, ...props }) => {
    let artifactData = useSelector((state) => state.artifactReducer.artifactData)
    const userLogin = useSelector((state) => state?.authReducer?.user)
    artifactData = props?.artifactData || artifactData
    const [versions, setVersions] = useState(artifactData?.file_versions)
    const [artifactNames, setArtifactNames] = useState(artifactData?.file_name_versions)
    const [version, setVersion] = useState(artifactData?.file_versions?.length - 1 || 0)
    const currentProject = useSelector(store => store?.artifactReducer?.currentProject)
    const project_id = currentProject?.id

    // New states for enhanced functionality
    const [selectedRule, setSelectedRule] = useState(null)
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const [tableData, setTableData] = useState([])
    const [loading, setLoading] = useState(false)
    const [loadingRules, setLoadingRules] = useState(false)

    // State for business rules
    const [businessRules, setBusinessRules] = useState([])

    // Fetch business rules
    const fetchBusinessRules = async () => {
        setLoadingRules(true)
        try {
            const response = await fetch('https://google-docai-be-685246125222.us-central1.run.app/api/v1/business-rules/all-rule-set/')
            const data = await response.json()

            // Transform the data to match Select component format
            const formattedRules = data.map(rule => ({
                value: rule.ruleset_id,
                label: rule.rule_name
            }))

            setBusinessRules(formattedRules)
        } catch (error) {
            console.error('Error fetching business rules:', error)
            // You might want to show an error message to the user here
        } finally {
            setLoadingRules(false)
        }
    }

    // Fetch rules on component mount
    useEffect(() => {
        fetchBusinessRules()
    }, [])

    // Update table columns definition
    const columns = [
        {
            title: 'Business Rule',
            dataIndex: 'business_rule',
            key: 'business_rule',
            width: '50%',
        },
        {
            title: 'Status',
            dataIndex: 'rule_satisfied',
            key: 'rule_satisfied',
            width: '15%',
            render: (satisfied) => (
                <span style={{
                    color: satisfied ? '#52c41a' : '#ff4d4f',
                    fontWeight: 'bold'
                }}>
                    {satisfied ? 'Passed' : 'Failed'}
                </span>
            ),
        },
        {
            title: 'Reason',
            dataIndex: 'reason',
            key: 'reason',
            width: '35%',
            render: (reason) => reason || '-',
        }
    ]

    const user = useSelector((store) => store?.authReducer?.user)
    let originalName = artifactData?.original_file_name
    let nameLength = originalName?.length
    let smallLengthName = nameLength > 20 ? '...' + originalName?.substr(nameLength - 20, nameLength) : originalName

    useEffect(() => {
        let v = artifactData?.file_versions?.length - 1
        if (v !== versions?.length - 1) {
            setVersion(v || 0)
        }
        setVersions(artifactData?.file_versions)
        setArtifactNames(artifactData?.file_name_versions)
    }, [artifactData])

    const goBackFunc = () => {
        if (typeof goBack == 'function') {
            goBack()
        } else {
            console.error("Missing prop 'GoBack()'", goBack)
        }
    }

    const highlighter = (text) => (
        <Highlighter
            highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
            searchWords={searchKey?.split(' ') || []}
            autoEscape
            textToHighlight={text ? text?.toString() : ''}
        />
    )

    const handleRuleSelect = (value, option) => {
        setSelectedRule(value) // This will be the ruleset_id
    }

    const convertToGsUrl = (httpsUrl) => {
        try {
            if (!httpsUrl) return ''

            // Check if the URL is a Google Storage URL
            if (!httpsUrl.startsWith('https://storage.googleapis.com/')) {
                return httpsUrl
            }

            // Find the position of .pdf in the URL
            const pdfIndex = httpsUrl.toLowerCase().indexOf('.pdf')
            if (pdfIndex === -1) return httpsUrl

            // Get the URL only up to .pdf
            const truncatedUrl = httpsUrl.substring(0, pdfIndex + 4)

            // Remove the base URL and convert to gs:// format
            const gsPath = truncatedUrl.replace('https://storage.googleapis.com/', '')
            return `gs://${gsPath}`
        } catch (error) {
            console.error('Error converting URL:', error)
            return httpsUrl
        }
    }

    const handleRunRules = async () => {
        if (!selectedRule || !artifactData?.file_address) {
            console.error('Missing required parameters')
            return
        }

        setIsDrawerOpen(true)
        setLoading(true)

        try {
            // Convert the HTTPS URL to GS format
            const gsUrl = convertToGsUrl(artifactData.file_address)

            // Create URL with ruleset_id parameter
            const apiUrl = `https://google-docai-be-685246125222.us-central1.run.app/api/v1/rule-execution/execute-rules?gs_url=${encodeURIComponent(gsUrl)}&ruleset_id=${encodeURIComponent(selectedRule)}`

            // console.log('Executing rules with:', {
            //     gs_url: gsUrl,
            //     ruleset_id: selectedRule
            // })

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            })

            if (!response.ok) {
                throw new Error('Failed to execute rules')
            }

            const data = await response.json()

            // Transform the response data to match table format
            const formattedData = Array.isArray(data) ? data.map((item, index) => ({
                key: index.toString(),
                business_rule: item.business_rule,
                rule_satisfied: item.rule_satisfied,
                reason: item.reason,
            })) : []

            setTableData(formattedData)
        } catch (error) {
            console.error('Error executing rules:', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='myShadowCard'>
            <div className='artifact-top'>
                <div className='artifact-sub'>
                    <span style={{ cursor: 'pointer', paddingTop: '9px' }} onClick={goBackFunc}>
                        <AiOutlineArrowLeft style={{ fontSize: 21, color: '#0057E7' }} />
                    </span>
                    <Tooltip className='filename-topheader' title={originalName}>
                        <p style={{ marginBottom: 0, marginLeft: 10, flex: 1 }}>{highlighter(smallLengthName)}</p>
                    </Tooltip>
                </div>
                <div className='new-doc' style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <Select
                        placeholder="Select Business Rule"
                        style={{ width: 300 }}
                        options={businessRules}
                        onChange={handleRuleSelect}
                        loading={loadingRules}
                        disabled={loadingRules}
                        optionLabelProp="label"
                    />
                    <Button
                        type='primary'
                        disabled={!selectedRule}
                        onClick={handleRunRules}
                    >
                        Run Business Rules
                    </Button>
                </div>
            </div>

            <Drawer
                title="Business Rules Execution Results"
                placement="right"
                onClose={() => setIsDrawerOpen(false)}
                open={isDrawerOpen}
                width={800}
            >
                <Table
                    columns={columns}
                    dataSource={tableData}
                    loading={loading}
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: false,
                        showTotal: (total) => `Total ${total} rules`,
                    }}
                    scroll={{ y: 'calc(100vh - 250px)' }}
                />
            </Drawer>
        </div>
    )
}

export default HeaderTopBar