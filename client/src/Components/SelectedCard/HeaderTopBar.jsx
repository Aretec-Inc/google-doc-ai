import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Button, Select } from 'antd';
import { errorMessage } from '../../utils/pdfHelpers';

const HeaderTopBar = ({
    selectedCard,
    goBack,
    setIsDrawerOpen,
    setRulesResults,
    setDrawerLoading,
    artifactData: propArtifactData,
    ...props
}) => {
    // Redux state
    const artifactData = useSelector((state) => state.artifactReducer.artifactData);
    const currentProject = useSelector(store => store?.artifactReducer?.currentProject);
    const effectiveArtifactData = propArtifactData || selectedCard || artifactData;

    // States
    const [versions, setVersions] = useState(effectiveArtifactData?.file_versions);
    const [artifactNames, setArtifactNames] = useState(effectiveArtifactData?.file_name_versions);
    const [version, setVersion] = useState(effectiveArtifactData?.file_versions?.length - 1 || 0);
    const [selectedRule, setSelectedRule] = useState(null);
    const [businessRules, setBusinessRules] = useState([]);
    const [loadingRules, setLoadingRules] = useState(false);

    // URL conversion utility
    const convertToGsUrl = (httpsUrl) => {
        try {
            if (!httpsUrl) return '';
            if (!httpsUrl.startsWith('https://storage.googleapis.com/')) {
                return httpsUrl;
            }
            const pdfIndex = httpsUrl.toLowerCase().indexOf('.pdf');
            if (pdfIndex === -1) return httpsUrl;
            const truncatedUrl = httpsUrl.substring(0, pdfIndex + 4);
            const gsPath = truncatedUrl.replace('https://storage.googleapis.com/', '');
            return `gs://${gsPath}`;
        } catch (error) {
            console.error('Error converting URL:', error);
            return httpsUrl;
        }
    };

    // API Calls
    const fetchBusinessRules = async () => {
        setLoadingRules(true);
        try {
            const response = await fetch('https://google-docai-be-685246125222.us-central1.run.app/api/v1/business-rules/all-rule-set/');
            const data = await response.json();
            const formattedRules = data.map(rule => ({
                value: rule.ruleset_id,
                label: rule.rule_name
            }));
            setBusinessRules(formattedRules);
        } catch (error) {
            console.error('Error fetching business rules:', error);
        } finally {
            setLoadingRules(false);
        }
    };

    const fetchRuleResults = async () => {
        try {
            const response = await fetch(`https://google-docai-be-685246125222.us-central1.run.app/api/v1/rule-execution/documents/${effectiveArtifactData?.id}/rule-results`);
            const data = await response.json();

            const formattedData = data.map((item, index) => ({
                key: index,
                rule_id: item.rule_id,
                business_rule: item.rule_statement,
                rule_satisfied: item.execution_status === 'passed',
                reason: item.execution_result,
                loading: false
            }));

            setRulesResults(formattedData);
        } catch (error) {
            console.error('Error fetching rules:', error);
            errorMessage('Failed to fetch business rules');
        } finally {
            setDrawerLoading(false);
        }
    };

    useEffect(() => {
        fetchBusinessRules();
    }, []);

    useEffect(() => {
        let v = effectiveArtifactData?.file_versions?.length - 1;
        if (v !== versions?.length - 1) {
            setVersion(v || 0);
        }
        setVersions(effectiveArtifactData?.file_versions);
        setArtifactNames(effectiveArtifactData?.file_name_versions);
    }, [effectiveArtifactData]);

    // Event Handlers
    const handleRuleSelect = (value) => {
        setSelectedRule(value);
    };

    const handleRunRules = async () => {
        if (!selectedRule || !effectiveArtifactData?.file_address) {
            console.error('Missing required parameters');
            return;
        }

        setDrawerLoading(true);
        setIsDrawerOpen(true);

        try {
            const gsUrl = convertToGsUrl(effectiveArtifactData.file_address);
            const apiUrl = `https://google-docai-be-685246125222.us-central1.run.app/api/v1/rule-execution/execute-rules?gs_url=${encodeURIComponent(gsUrl)}&ruleset_id=${encodeURIComponent(selectedRule)}`;

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to execute rules');
            }

            const data = await response.json();
            const formattedData = Array.isArray(data) ? data.map((item, index) => ({
                key: index.toString(),
                business_rule: item.business_rule,
                rule_satisfied: item.rule_satisfied,
                reason: item.reason,
            })) : [];

            setRulesResults(formattedData);
        } catch (error) {
            console.error('Error executing rules:', error);
        } finally {
            setDrawerLoading(false);
        }
    };

    const viewBusinessRules = () => {
        setIsDrawerOpen(true);
        setDrawerLoading(true);
        fetchRuleResults();
    };

    return (
        <div className="flex items-center gap-2">
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
                type="primary"
                disabled={!selectedRule}
                onClick={handleRunRules}
            >
                Run Business Rules
            </Button>
            <Button
                variant="outline"
                onClick={viewBusinessRules}
                className="inline-flex items-center px-3 py-1 text-sm font-medium text-black rounded hover:bg-gray-200"
            >
                View Business Rules
            </Button>
        </div>
    );
};

export default HeaderTopBar;