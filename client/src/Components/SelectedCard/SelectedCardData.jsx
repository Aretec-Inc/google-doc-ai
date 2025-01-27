import { Table, Tabs } from 'antd';
import { X } from 'lucide-react';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import PDFVIEWER from '../../Components/PDF-HIGHLIGHTER/index';
import { errorMessage } from '../../utils/pdfHelpers';
import HeaderTopBar from './HeaderTopBar';
import './SelectedCardData.css';

const { TabPane } = Tabs;

// Business Rules Table Component
const BusinessRulesTable = ({ rules, loading, hitlData = [], activeTab = "2" }) => {
    const columns = activeTab === "1" ? {
        // HITL columns
        columns: [
            {
                title: 'Field Name',
                dataIndex: 'content',
                key: 'content',
                width: '30%',
                render: (content) => (
                    <span className="text-xs p-1 block">
                        {content?.text?.split('/').pop() || content?.text || 'No text available'}
                    </span>
                )
            },
            {
                title: 'Confidence',
                dataIndex: 'confidence',
                key: 'confidence',
                width: '20%',
                render: (_, record) => {
                    const confidence = Number(
                        record?.key_pair?.confidence ||
                        record?.confidence ||
                        record?.score
                    ) || 0;
                    return (
                        <span className="text-xs p-1 block">
                            {(confidence * 100).toFixed(1)}%
                        </span>
                    );
                }
            },
            {
                title: 'Suggested Value',
                dataIndex: 'expected_value',
                key: 'expected_value',
                width: '25%',
                render: (_, record) => (
                    <span className="text-xs p-1 block">
                        {record?.key_pair?.expected_value || record?.expected_value || '-'}
                    </span>
                )
            },
            {
                title: 'Extracted Value',
                dataIndex: 'field_value',
                key: 'field_value',
                width: '25%',
                render: (_, record) => (
                    <span className="text-xs p-1 block">
                        {record?.key_pair?.field_value || record?.field_value || '-'}
                    </span>
                )
            },
            {
                title: 'Potential Issue',
                dataIndex: 'potential_issue',
                key: 'potential_issue',
                width: '25%',
                render: (_, record) => (
                    <span className="text-xs p-1 block text-red-500">
                        {record?.key_pair?.potential_issue || record?.potential_issue || '-'}
                    </span>
                )
            },
        ]
    }
        : {
            // Business Rules columns
            columns: [
                {
                    title: 'Business Rule',
                    dataIndex: 'business_rule',
                    key: 'business_rule',
                    width: '45%',
                    render: (text) => (
                        <span className="text-xs p-1 block">
                            {text}
                        </span>
                    )
                },
                {
                    title: 'Status',
                    dataIndex: 'rule_satisfied',
                    key: 'rule_satisfied',
                    width: '15%',
                    align: 'center',
                    render: (satisfied) => (
                        <span className={`text-xs font-bold p-1 block ${satisfied ? 'text-green-500' : 'text-red-500'}`}>
                            {satisfied ? 'Passed' : 'Failed'}
                        </span>
                    )
                },
                {
                    title: 'Reasoning',
                    dataIndex: 'reason',
                    key: 'reason',
                    width: '40%',
                    render: (reason) => (
                        <span className="text-xs p-1 block">
                            {reason || '-'}
                        </span>
                    )
                }
            ]
        };

    return (
        <Table
            size="small"
            columns={columns.columns}
            dataSource={activeTab === "1" ? hitlData : rules}
            loading={loading}
            pagination={false}
            scroll={{ y: 'calc(100vh - 230px)' }}
            rowKey={(record) => record.key || record.id}
        />
    );
};

// Business Rules Drawer Component
// Business Rules Drawer Component
const BusinessRulesDrawer = ({
    isOpen,
    rules,
    hitlData = [],
    loading,
    setIsDrawerOpen,
    activeTab = "2",
    onTabChange
}) => {
    if (!isOpen) return null;

    console.log("HITL DATA===>", hitlData)
    return (
        <div className="absolute right-0 top-0 bottom-0 w-4/12 bg-white border-l border-gray-200 overflow-y-hidden mb-10">
            <div className="sticky top-0 bg-white flex justify-between items-center"
                style={{ padding: '2px 9.6px' }}>
                <Tabs
                    activeKey={activeTab}
                    onChange={onTabChange}
                    className="w-full "
                    size="small"
                >
                    <TabPane tab="Intelligent HITL" key="1" />
                    <TabPane tab="Business Rules" key="2" />
                </Tabs>
                <button
                    onClick={() => setIsDrawerOpen(false)}
                    className="p-0 hover:bg-gray-100 rounded-full ml-2"
                >
                    <X size={20} className="text-gray-600" />
                </button>
            </div>
            <div className="pt-0 bussinessSection">
                {activeTab === "1" ? (
                    <BusinessRulesTable
                        hitlData={hitlData}
                        loading={loading}
                        activeTab="1"
                    />
                ) : (
                    <BusinessRulesTable
                        rules={rules}
                        loading={loading}
                        activeTab="2"
                    />
                )}
            </div>
        </div>
    );
};

// Breadcrumb Component
const SimpleBreadcrumb = ({ submissionName, pdfName, submissionId }) => {
    return (
        <nav className="py-2" aria-label="Breadcrumb">
            <ol className="flex items-center text-sm">
                <li>
                    <Link to="/" className="text-[#0067b8] hover:underline">Home</Link>
                </li>
                <li className="mx-2 text-gray-500">/</li>
                <li>
                    <Link to="/submission" className="text-[#0067b8] hover:underline">
                        Submission
                    </Link>
                </li>
                <li className="mx-2 text-gray-500">/</li>
                <li className="text-gray-600">
                    <Link to={`/submission/${submissionId}`} className="text-[#0067b8] hover:underline">
                        {submissionName}
                    </Link>
                </li>
                <li className="mx-2 text-gray-500">/</li>
                <li className="text-gray-600">{pdfName}</li>
            </ol>
        </nav>
    );
};

// Main SelectedCardData Component
const SelectedCardData = ({
    freqWord,
    artifactData,
    selectedCard: initialSelectedCard,
    isTemplateView,
    goBack,
    submissionName,
    submissionId,
    ...props
}) => {
    const [loading, setLoading] = useState(!initialSelectedCard && !artifactData);
    const [selectedCard, setSelectedCard] = useState(initialSelectedCard);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [rulesResults, setRulesResults] = useState([]);
    const [drawerLoading, setDrawerLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("2");
    const [hitlData, setHitlData] = useState([]);
    const dispatch = useDispatch();

    // Function to handle HITL data from PDF viewer
    const handleHITLData = (checked, highlights) => {
        if (checked) {
            const processedHitlData = highlights.reduce((acc, curr) => {
                const filtered = curr.filter(item => {
                    const confidence = Number(
                        item?.key_pair?.confidence ||
                        item?.confidence ||
                        item?.score
                    ) || 0;
                    return confidence <= 0.6;
                });
                return [...acc, ...filtered];
            }, []);

            setHitlData(processedHitlData);
            setActiveTab("1");
            setIsDrawerOpen(true);
        } else {
            setIsDrawerOpen(false);
        }
    };

    const handleTabChange = (newTab) => {
        setActiveTab(newTab);
        if (newTab === "2") {
            fetchRuleResults();
        }
    };

    const fetchRuleResults = async () => {
        setDrawerLoading(true);
        try {
            const response = await fetch(
                `https://google-docai-be-685246125222.us-central1.run.app/api/v1/rule-execution/documents/${selectedCard?.id}/rule-results`
            );
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

    console.log("ARTFUICAT", artifactData)
    return (
        <div>
            <div className="flex justify-between items-center w-full mt-14">
                <div className="flex items-center">
                    <SimpleBreadcrumb
                        submissionName={submissionName}
                        pdfName={selectedCard?.original_file_name}
                        submissionId={submissionId}
                    />
                </div>
                <div className="flex items-center">
                    <HeaderTopBar
                        selectedCard={selectedCard || initialSelectedCard}
                        goBack={goBack}
                        setIsDrawerOpen={setIsDrawerOpen}
                        setRulesResults={setRulesResults}
                        setDrawerLoading={setDrawerLoading}
                        onSetActiveTab={setActiveTab}  // Add this new prop
                    />

                </div>
            </div>

            <div className="card-div">
                <div className="relative flex w-full mt-6">
                    <div className={`transition-all duration-300 ease-in-out ${isDrawerOpen ? 'w-8/12' : 'w-full'}`}>
                        <div className="flex flex-1 flex-col w-full mb-10">
                            <PDFVIEWER
                                isTemplateView={isTemplateView}
                                maxWidth="100vw"
                                enableShadow
                                artifactData={selectedCard}
                                onHITLToggle={handleHITLData}
                                {...props}
                            />
                        </div>
                    </div>

                    <BusinessRulesDrawer
                        isOpen={isDrawerOpen}
                        rules={rulesResults}
                        hitlData={hitlData}
                        loading={drawerLoading}
                        setIsDrawerOpen={(open) => {
                            setIsDrawerOpen(open);
                            // When drawer is closed, reset active tab to 2
                            if (!open) {
                                setActiveTab("2");
                            }
                        }}
                        activeTab={activeTab}
                        onTabChange={handleTabChange}
                    />
                </div>
            </div>
        </div>
    );
};

export default SelectedCardData;