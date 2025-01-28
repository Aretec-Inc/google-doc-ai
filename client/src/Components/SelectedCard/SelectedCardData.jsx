// SelectedCardData.jsx
import { Table, Tabs } from 'antd';
import { X } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import PDFVIEWER from '../../Components/PDF-HIGHLIGHTER/index';
import { errorMessage } from '../../utils/pdfHelpers';
import HeaderTopBar from './HeaderTopBar';
import './SelectedCardData.css';

const { TabPane } = Tabs;

// Business Rules Table Component
const BusinessRulesTable = ({ rules, loading, hitlData = [], activeTab = "2", onFieldClick, onFieldHighlight }) => {
    // Handler for row click in HITL table
    const handleRowClick = (record) => {
        onFieldClick && onFieldClick(record);
        onFieldHighlight && onFieldHighlight(record.fieldName);
    };

    // Transform HITL data for horizontal layout (fields as columns)
    const transformHitlDataToHorizontal = (data) => {
        // Filter odd-numbered rows first
        const filteredData = data.filter((_, index) => index % 2 === 0);

        // Define column structure
        const columns = [
            {
                title: 'Field Name',
                dataIndex: 'fieldName',
                key: 'fieldName',
                width: '25%',
                render: (text, record) => (
                    <div 
                        className="min-h-[40px] py-2 px-2 cursor-pointer hover:bg-blue-50"
                        onClick={() => handleRowClick(record)}
                    >
                        <span
                            className="text-xs break-words whitespace-normal text-blue-600 hover:underline text-left w-full"
                            data-content-text={text}
                        >
                            {text || '-'}
                        </span>
                    </div>
                )
            },
            {
                title: 'Confidence',
                dataIndex: 'confidence',
                key: 'confidence',
                width: '15%',
                render: (value) => (
                    <div className="min-h-[40px] flex items-center">
                        <span className="text-xs p-2 break-words whitespace-normal">
                            {value}
                        </span>
                    </div>
                )
            },
            {
                title: 'Potential Issue',
                dataIndex: 'potentialIssue',
                key: 'potentialIssue',
                width: '20%',
                render: (text, record) => (
                    <div 
                        className="min-h-[40px] flex items-center cursor-pointer hover:bg-blue-50"
                        onClick={() => handleRowClick(record)}
                    >
                        <span className="text-xs p-2 break-words whitespace-normal text-left w-full">
                            {text || '-'}
                        </span>
                    </div>
                )
            },
            {
                title: 'Suggested Value',
                dataIndex: 'expectedValue',
                key: 'expectedValue',
                width: '20%',
                render: (text, record) => (
                    <div 
                        className="min-h-[40px] flex items-center cursor-pointer hover:bg-blue-50"
                        onClick={() => handleRowClick(record)}
                    >
                        <span className="text-xs p-2 break-words whitespace-normal text-left w-full">
                            {text || '-'}
                        </span>
                    </div>
                )
            }
        ];

        // Transform data into rows
        const rows = filteredData.map((record, index) => {
            const fieldName = record.content?.text?.split('/').pop() || record.content?.text || 'No text available';
            return {
                key: index,
                fieldName: fieldName,
                confidence: `${(Number(record?.key_pair?.confidence || record?.confidence || record?.score) * 100 || 0).toFixed(1)}%`,
                potentialIssue: record?.key_pair?.potential_issue || record?.potential_issue || '-',
                expectedValue: record?.key_pair?.gt_value || record?.gt_value || '-',
                extractedValue: record?.key_pair?.field_value || record?.field_value || '-',
                originalData: record
            };
        });

        return { columns, rows };
    };

    const hitlLayout = transformHitlDataToHorizontal(hitlData);

    const businessRulesColumns = {
        columns: [
            {
                title: 'Business Rule',
                dataIndex: 'business_rule',
                key: 'business_rule',
                width: '45%',
                render: (text) => (
                    <div className="min-h-[40px] flex items-center">
                        <span className="text-xs p-2 break-words whitespace-normal">
                            {text}
                        </span>
                    </div>
                )
            },
            {
                title: 'Status',
                dataIndex: 'rule_satisfied',
                key: 'rule_satisfied',
                width: '15%',
                align: 'center',
                render: (satisfied) => (
                    <div className="min-h-[40px] flex items-center justify-center">
                        <span className={`text-xs font-bold p-2 ${satisfied ? 'text-green-500' : 'text-red-500'}`}>
                            {satisfied ? 'Passed' : 'Failed'}
                        </span>
                    </div>
                )
            },
            {
                title: 'Reasoning',
                dataIndex: 'reason',
                key: 'reason',
                width: '40%',
                render: (reason) => (
                    <div className="min-h-[40px] flex items-center">
                        <span className="text-xs p-2 break-words whitespace-normal">
                            {reason || '-'}
                        </span>
                    </div>
                )
            }
        ]
    };

    return (
        <Table
            size="small"
            columns={activeTab === "1" ? hitlLayout.columns : businessRulesColumns.columns}
            dataSource={activeTab === "1" ? hitlLayout.rows : rules}
            loading={loading}
            pagination={false}
            scroll={(activeTab === "1" && hitlData.length > 20) || (activeTab === "2" && rules.length > 20) 
                ? { y: 'calc(100vh - 230px)' } 
                : false}
            rowKey={(record) => record.key}
            className="hitl-table"
        />
    );
};

// Business Rules Drawer Component
const BusinessRulesDrawer = ({
    isOpen,
    rules,
    hitlData = [],
    loading,
    setIsDrawerOpen,
    activeTab = "2",
    onTabChange,
    onHighlightField,
    onNestedListHighlight
}) => {
    if (!isOpen) return null;

    const handleFieldClick = (record) => {
        if (record.originalData) {
            // Highlight the field in the PDF
            if (onHighlightField) {
                onHighlightField(record.originalData);
            }

            // Highlight in NestedListItem using the field name from original data
            if (onNestedListHighlight) {
                const fieldText = record.originalData.content?.text?.split('/').pop() || 
                                record.originalData.content?.text;
                onNestedListHighlight(fieldText);
            }

            // Enhanced scroll behavior with fallback
            const fieldText = record.originalData.content?.text?.split('/').pop() || 
                            record.originalData.content?.text;
            
            // Scroll NestedListItem into view
            const element = document.querySelector(`[data-content-text="${fieldText}"]`);
            if (element) {
                // Try to scroll the closest scrollable parent
                let scrollParent = element.closest('.overflow-auto, .overflow-y-auto');
                if (!scrollParent) {
                    scrollParent = element.parentElement;
                }
                
                if (scrollParent) {
                    const elementRect = element.getBoundingClientRect();
                    const parentRect = scrollParent.getBoundingClientRect();
                    const scrollOffset = elementRect.top - parentRect.top - (parentRect.height / 2) + (elementRect.height / 2);
                    
                    scrollParent.scrollBy({
                        top: scrollOffset,
                        behavior: 'smooth'
                    });
                } else {
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }

            // Scroll PDF to highlighted field
            if (record.originalData.coordinates) {
                const pdfContainer = document.querySelector('.pdf-container');
                if (pdfContainer) {
                    // Get the current scale from PDFContainer
                    const currentScale = parseFloat(pdfContainer.getAttribute('data-scale') || '1');
                    
                    // Calculate scroll position based on coordinates and scale
                    const scrollTop = (record.originalData.coordinates.y * currentScale) - 100;
                    
                    pdfContainer.scrollTo({
                        top: scrollTop,
                        behavior: 'smooth'
                    });
                }
            }
        }
    };

    return (
        <div className="absolute right-0 top-0 bottom-0 w-4/12 bg-white border-l border-gray-200 overflow-y-hidden mb-10">
            <div className="sticky top-0 bg-white flex justify-between items-center"
                style={{ padding: '2px 9.6px' }}>
                <Tabs
                    activeKey={activeTab}
                    onChange={onTabChange}
                    className="w-full"
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
            <div className="pt-0">
                {activeTab === "1" ? (
                    <BusinessRulesTable
                        hitlData={hitlData}
                        loading={loading}
                        activeTab="1"
                        onFieldClick={handleFieldClick}
                        onFieldHighlight={(fieldName) => {
                            // Find the original record by field name
                            const record = hitlData.find(item => {
                                const itemFieldName = item.content?.text?.split('/').pop() || item.content?.text;
                                return itemFieldName === fieldName;
                            });
                            if (record) {
                                onNestedListHighlight && onNestedListHighlight(fieldName);
                            }
                        }}
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
    const [selectedHighlight, setSelectedHighlight] = useState(null);
    const [highlightedFieldName, setHighlightedFieldName] = useState(null);
    const dispatch = useDispatch();

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

    const handleHighlightField = (fieldData) => {
        setSelectedHighlight(fieldData);
        
        if (fieldData?.coordinates) {
            const pdfContainer = document.querySelector('.pdf-container');
            if (pdfContainer) {
                const scaleFactor = pdfContainer.getBoundingClientRect().width / fieldData.pageWidth;
                const scrollTop = fieldData.coordinates.y * scaleFactor - 100;
                pdfContainer.scrollTo({
                    top: scrollTop,
                    behavior: 'smooth'
                });
            }
        }
    };

    const handleNestedListHighlight = (fieldName) => {
        setHighlightedFieldName(fieldName);
        setTimeout(() => setHighlightedFieldName(null), 3000);
    };

    const handleTabChange = (newTab) => {
        setActiveTab(newTab);
        if (newTab === "2") {
            fetchRuleResults();
        }
        // Clear highlights when changing tabs
        setSelectedHighlight(null);
        setHighlightedFieldName(null);
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

    useEffect(() => {
        if (selectedCard?.id && activeTab === "2") {
            fetchRuleResults();
        }
    }, [selectedCard?.id]);

    useEffect(() => {
        setSelectedCard(initialSelectedCard);
    }, [initialSelectedCard]);

    // Handler for when drawer state changes
    useEffect(() => {
        if (!isDrawerOpen) {
            setSelectedHighlight(null);
            setHighlightedFieldName(null);
        }
    }, [isDrawerOpen]);

    // Render method
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
                        onSetActiveTab={setActiveTab}
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
                                selectedHighlight={selectedHighlight}
                                highlightedFieldName={highlightedFieldName}
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
                            if (!open) {
                                setActiveTab("2");
                                setSelectedHighlight(null);
                                setHighlightedFieldName(null);
                            }
                        }}
                        activeTab={activeTab}
                        onTabChange={handleTabChange}
                        onHighlightField={handleHighlightField}
                        onNestedListHighlight={handleNestedListHighlight}
                    />
                </div>
            </div>
        </div>
    );
};

// PropTypes for all components
BusinessRulesTable.propTypes = {
    rules: PropTypes.array,
    loading: PropTypes.bool,
    hitlData: PropTypes.array,
    activeTab: PropTypes.string,
    onFieldClick: PropTypes.func,
    onFieldHighlight: PropTypes.func
};

BusinessRulesDrawer.propTypes = {
    isOpen: PropTypes.bool,
    rules: PropTypes.array,
    hitlData: PropTypes.array,
    loading: PropTypes.bool,
    setIsDrawerOpen: PropTypes.func.isRequired,
    activeTab: PropTypes.string,
    onTabChange: PropTypes.func,
    onHighlightField: PropTypes.func,
    onNestedListHighlight: PropTypes.func
};

SimpleBreadcrumb.propTypes = {
    submissionName: PropTypes.string,
    pdfName: PropTypes.string,
    submissionId: PropTypes.string
};

SelectedCardData.propTypes = {
    freqWord: PropTypes.array,
    artifactData: PropTypes.object,
    selectedCard: PropTypes.object,
    isTemplateView: PropTypes.bool,
    goBack: PropTypes.func,
    submissionName: PropTypes.string,
    submissionId: PropTypes.string
};

// Default props
SelectedCardData.defaultProps = {
    freqWord: [],
    isTemplateView: false,
    goBack: () => {},
    submissionName: '',
    submissionId: ''
};

export default SelectedCardData;