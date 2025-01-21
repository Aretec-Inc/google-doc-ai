import { Skeleton, Table } from 'antd';
import { X } from 'lucide-react';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import PDFVIEWER from '../../Components/PDF-HIGHLIGHTER/index';
import { setArtifactData } from '../../Redux/actions/artifactActions';
import { fadeList, isPDF } from '../../utils/pdfConstants';
import { errorMessage, load_artifact_data_by_type, randomInteger } from '../../utils/pdfHelpers';
import HeaderTopBar from './HeaderTopBar';
import './SelectedCardData.css';


const BusinessRulesTable = ({ rules, loading }) => {
    const columns = [
        {
            title: 'Business Rule',
            dataIndex: 'business_rule',
            key: 'business_rule',
            width: '40%',
            render: (text) => (
                <span style={{
                    fontSize: '10px',
                    padding: '1px 2px',
                    display: 'block'
                }}>
                    {text}
                </span>
            )
        },
        {
            title: 'Status',
            dataIndex: 'rule_satisfied',
            key: 'rule_satisfied',
            width: '20%',
            align: 'center',
            render: (satisfied) => (
                <span style={{
                    color: satisfied ? '#52c41a' : '#ff4d4f',
                    fontWeight: 'bold',
                    fontSize: '10px',
                    padding: '1px 2px',
                    display: 'block'
                }}>
                    {satisfied ? 'Passed' : 'Failed'}
                </span>
            ),
        },
        {
            title: 'Reasoning',
            dataIndex: 'reason',
            key: 'reason',
            width: '40%',
            render: (reason) => (
                <span style={{
                    fontSize: '10px',
                    padding: '1px 2px',
                    display: 'block'
                }}>
                    {reason || '-'}
                </span>
            )
        }
    ];

    const tableStyle = {
        fontSize: '10px'
    };

    return (
        <Table
            size='small'
            columns={columns}
            dataSource={rules}
            loading={loading}
            pagination={false}
            // pagination={{
            //     pageSize: 10,
            //     showSizeChanger: false,
            //     showTotal: (total) => (
            //         <span style={{ fontSize: '10px' }}>
            //             Total {total} rules
            //         </span>
            //     ),
            // }}
            scroll={{ y: 'calc(100vh - 250px)' }}
            rowKey={(record, index) => index}
            style={tableStyle}
        />
    );
};


const BusinessRulesDrawer = ({ isOpen, rules, loading, setIsDrawerOpen }) => {
    if (!isOpen) return null;

    return (
        <div className="absolute right-0 top-0 bottom-0 w-4/12 bg-white border-l border-gray-200 overflow-y-hidden mb-10">
            <div className="sticky top-0 p-4 border-b border-gray-500 bg-white flex justify-between items-center">
                <h2 className="text-lg font-semibold">Business Rules Results</h2>
                <button
                    onClick={() => setIsDrawerOpen(false)}
                    className="p-1 hover:bg-gray-100 rounded-full"
                >
                    <X size={20} className="text-gray-600" />
                </button>
            </div>
            <div className="pt-2">
                <BusinessRulesTable rules={rules} loading={loading} />
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
                    <Link
                        to="/submission"
                        className="text-[#0067b8] hover:underline"
                    >
                        Submission
                    </Link>
                </li>
                <li className="mx-2 text-gray-500">/</li>
                <li className="text-gray-600">
                    <Link
                        to={`/submission/${submissionId}`}
                        className="text-[#0067b8] hover:underline"
                    >
                        {submissionName}
                    </Link>
                </li>
                <li className="mx-2 text-gray-500">/</li>
                <li className="text-gray-600">{pdfName}</li>
            </ol>
        </nav>
    );
};

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
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [rulesResults, setRulesResults] = useState([]);
    const [drawerLoading, setDrawerLoading] = useState(false);

    const dispatch = useDispatch();
    const user = useSelector(state => state?.authReducer?.user);
    const selectedKey = useSelector(state => state?.authReducer?.selectedKey);

    const refreshData = async () => {
        const fileName = selectedCard?.file_name;
        if (!fileName) return;

        setIsRefreshing(true);
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
        } finally {
            setIsRefreshing(false);
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
                    <div className="relative flex w-full">
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
                            className={`${isDrawerOpen ? 'w-4/12' : 'w-0'}`}
                        />
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div
            className="card-div"
            style={!isPDF(artifact_type) ? { filter: 'drop-shadow(0px 0px 20px silver)' } : {}}
        >
            <SimpleBreadcrumb submissionName={submissionName} pdfName={selectedCard?.original_file_name} submissionId={submissionId} />

            <HeaderTopBar
                {...props}
                selectedCard={selectedCard || initialSelectedCard}
                goBack={goBack}
                setIsDrawerOpen={setIsDrawerOpen}
                setRulesResults={setRulesResults}
                setDrawerLoading={setDrawerLoading}
            />
            <div style={conditionalStyle}>
                {content}
            </div>
        </div>
    );
};

export default SelectedCardData;