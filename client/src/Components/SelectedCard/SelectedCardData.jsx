import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Skeleton } from 'antd';
import { randomInteger, load_artifact_data_by_type, errorMessage } from '../../utils/pdfHelpers';
import { fadeList, isPDF } from '../../utils/pdfConstants';
import PDFVIEWER from '../../Components/PDF-HIGHLIGHTER/index';
import { removeArtifactData, setArtifactData } from '../../Redux/actions/artifactActions';
import HeaderTopBar from './HeaderTopBar';
import './SelectedCardData.css';
import { Link, useNavigate } from 'react-router-dom';


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
    const conditionalStyle = alreadyHasTabs ? { background: 'white', padding: 10, paddingTop: 0 } : {};

    const content = (
        <div data-aos={fadeList[randomInteger(0, fadeList.length - 1)]}>
            <div className="container-box container-div">
                {loading ? (
                    <Skeleton paragraph={{ rows: 5 }} />
                ) : (
                    <div style={{ display: 'flex', flex: 1, flexDirection: 'column', width: '100%' }}>
                        <PDFVIEWER
                            isTemplateView={isTemplateView}
                            maxWidth="100vw"
                            enableShadow
                            artifactData={selectedCard}
                            {...props}
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
            <SimpleBreadcrumb submissionName={submissionName} pdfName={selectedCard?.file_name} submissionId={submissionId} />

            <HeaderTopBar
                {...props}
                selectedCard={selectedCard || initialSelectedCard}
                goBack={goBack}
            />
            <div style={conditionalStyle}>
                {content}
            </div>
        </div>
    );
};

export default SelectedCardData;