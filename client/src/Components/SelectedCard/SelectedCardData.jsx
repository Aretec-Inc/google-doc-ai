// SelectedCardData.jsx
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { Table, Skeleton } from 'antd';
import { X } from 'lucide-react';
import PDFVIEWER from '../../Components/PDF-HIGHLIGHTER/index';
import { setArtifactData } from '../../Redux/actions/artifactActions';
import { fadeList, isPDF } from '../../utils/pdfConstants';
import { errorMessage, load_artifact_data_by_type, randomInteger } from '../../utils/pdfHelpers';
import HeaderTopBar from './HeaderTopBar';
import './SelectedCardData.css';

// Business Rules Table Component
const BusinessRulesTable = ({ rules, loading }) => {
    const columns = [
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
            ),
        },
        {
            title: 'Reasoning',
            dataIndex: 'reason',
            key: 'reason',
            width: '45%',
            render: (reason) => (
                <span className="text-xs p-1 block">
                    {reason || '-'}
                </span>
            )
        }
    ];

    return (
        <Table
            size="small"
            columns={columns}
            dataSource={rules}
            loading={loading}
            pagination={false}
            scroll={{ y: 'calc(100vh - 180px)' }}
            rowKey={(record) => record.key}
        />
    );
};

// Business Rules Drawer Component
const BusinessRulesDrawer = ({ isOpen, rules, loading, setIsDrawerOpen, artifactData, setRulesResults }) => {
    if (!isOpen) return null;

    return (
        <div className="absolute right-0 top-0 bottom-0 w-4/12 bg-white border-l border-gray-200 overflow-y-hidden mb-10">
            <div className="sticky top-0 border-b border-gray-500 bg-white flex justify-between items-center"
                style={{ padding: '9.6px' }}>
                <h2 className="text-sm font-semibold">Business Rules Results</h2>
                <button
                    onClick={() => setIsDrawerOpen(false)}
                    className="p-0 hover:bg-gray-100 rounded-full"
                >
                    <X size={20} className="text-gray-600" />
                </button>
            </div>
            <div className="pt-0">
                <BusinessRulesTable
                    rules={rules}
                    loading={loading}
                    artifactData={artifactData}
                    setRulesResults={setRulesResults}
                />
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
    const dispatch = useDispatch();

    const refreshData = async () => {
        const fileName = selectedCard?.file_name;
        if (!fileName) return;

        try {
            const data = await load_artifact_data_by_type(selectedCard);

            if (data?.id) {
                dispatch(setArtifactData(data));
            }

            if (!data?.success && data?.message) {
                errorMessage(data.message);
            }
        } catch (err) {
            const errMsg = err?.response?.data?.message;
            if (errMsg) errorMessage(errMsg);
        }
    };

    const artifact_type = selectedCard?.artifact_type;
    const alreadyHasTabs = !isPDF(artifact_type);
    const conditionalStyle = alreadyHasTabs ? { paddingTop: 0 } : {};

    const content = (
        <div data-aos={fadeList[randomInteger(0, fadeList.length - 1)]}>
            <div className="container-box container-div">
                {loading ? (
                    <Skeleton paragraph={{ rows: 5 }} />
                ) : (
                    <div className="relative flex w-full mt-6">
                        <div className={`transition-all duration-300 ease-in-out ${isDrawerOpen ? 'w-8/12' : 'w-full'}`}>
                            <div className="flex flex-1 flex-col w-full mb-10">
                                <PDFVIEWER
                                    isTemplateView={isTemplateView}
                                    maxWidth="100vw"
                                    enableShadow
                                    artifactData={selectedCard}
                                    {...props}
                                />
                            </div>
                        </div>
                        <BusinessRulesDrawer
                            isOpen={isDrawerOpen}
                            rules={rulesResults}
                            loading={drawerLoading}
                            setIsDrawerOpen={setIsDrawerOpen}
                            artifactData={selectedCard || initialSelectedCard}
                            setRulesResults={setRulesResults}
                        />
                    </div>
                )}
            </div>
        </div>
    );

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
                    />
                </div>
            </div>

            <div
                className="card-div"
                style={!isPDF(artifact_type) ? { filter: 'drop-shadow(0px 0px 2px silver)' } : {}}
            >
                <div style={conditionalStyle}>
                    {content}
                </div>
            </div>
        </div>
    );
};

export default SelectedCardData;