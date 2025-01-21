import { Button, Select } from 'antd'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import './HeaderTopBar.css'
import './SelectedCardData.css'

const HeaderTopBar = ({ goBack, reduxActions, searchKey, setDrawerLoading, setRulesResults, setIsDrawerOpen, ...props }) => {
    let artifactData = useSelector((state) => state.artifactReducer.artifactData)
    artifactData = props?.artifactData || artifactData
    const [versions, setVersions] = useState(artifactData?.file_versions)
    const [artifactNames, setArtifactNames] = useState(artifactData?.file_name_versions)
    const [version, setVersion] = useState(artifactData?.file_versions?.length - 1 || 0)
    const currentProject = useSelector(store => store?.artifactReducer?.currentProject)

    // States for business rules
    const [selectedRule, setSelectedRule] = useState(null)
    const [businessRules, setBusinessRules] = useState([])
    const [loadingRules, setLoadingRules] = useState(false)

    // Fetch business rules
    const fetchBusinessRules = async () => {
        setLoadingRules(true)
        try {
            const response = await fetch('https://google-docai-be-685246125222.us-central1.run.app/api/v1/business-rules/all-rule-set/')
            const data = await response.json()
            const formattedRules = data.map(rule => ({
                value: rule.ruleset_id,
                label: rule.rule_name
            }))
            setBusinessRules(formattedRules)
        } catch (error) {
            console.error('Error fetching business rules:', error)
        } finally {
            setLoadingRules(false)
        }
    }

    useEffect(() => {
        fetchBusinessRules()
    }, [])

    useEffect(() => {
        let v = artifactData?.file_versions?.length - 1
        if (v !== versions?.length - 1) {
            setVersion(v || 0)
        }
        setVersions(artifactData?.file_versions)
        setArtifactNames(artifactData?.file_name_versions)
    }, [artifactData])

    const convertToGsUrl = (httpsUrl) => {
        try {
            if (!httpsUrl) return ''
            if (!httpsUrl.startsWith('https://storage.googleapis.com/')) {
                return httpsUrl
            }
            const pdfIndex = httpsUrl.toLowerCase().indexOf('.pdf')
            if (pdfIndex === -1) return httpsUrl
            const truncatedUrl = httpsUrl.substring(0, pdfIndex + 4)
            const gsPath = truncatedUrl.replace('https://storage.googleapis.com/', '')
            return `gs://${gsPath}`
        } catch (error) {
            console.error('Error converting URL:', error)
            return httpsUrl
        }
    }

    const handleRuleSelect = (value) => {
        setSelectedRule(value)
    }

    const handleRunRules = async () => {
        if (!selectedRule || !artifactData?.file_address) {
            console.error('Missing required parameters')
            return
        }

        setDrawerLoading(true);
        setIsDrawerOpen(true);

        try {
            const gsUrl = convertToGsUrl(artifactData.file_address)
            const apiUrl = `https://google-docai-be-685246125222.us-central1.run.app/api/v1/rule-execution/execute-rules?gs_url=${encodeURIComponent(gsUrl)}&ruleset_id=${encodeURIComponent(selectedRule)}`

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
            const formattedData = Array.isArray(data) ? data.map((item, index) => ({
                key: index.toString(),
                business_rule: item.business_rule,
                rule_satisfied: item.rule_satisfied,
                reason: item.reason,
            })) : []

            setRulesResults(formattedData);
            setDrawerLoading(false);
        } catch (error) {
            console.error('Error executing rules:', error)
        }
    }

    return (
        <div className=''>
            <div className='artifact-top'>
                <div className='artifact-sub'>
                    {/* Commented out as per original code */}
                </div>
                <div className='new-doc flex gap-3 items-center'>
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
        </div>
    )
}

export default HeaderTopBar