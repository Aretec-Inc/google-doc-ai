import { GraduationCap, HelpCircle, Layout, ArrowRight } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "../../Components/ui/button";
import { Card, CardContent } from "../../Components/ui/card";
import { secureApi } from '../../Config/api';
import { GET, POST } from '../../utils/apis';
import { errorMessage } from '../../utils/helpers';
import ConfidenceModel from './ConfidenceModel';
import ConfidenceSubmission from './ConfidenceSubmission';
import ProcessorVisuals from './ProcessorVisuals';
import SubmissionVisuals from './SubmissionVisuals';

const Dashboard = () => {
    const [dashboardData, setDashboardData] = useState({
        documents: 0,
        submissions: 0,
        totalNumbers: 0,
        accuracySubmission: [],
        overAllConfidence: 0,
        aboveThresholdModelAcc: [],
        belowThresholdModelAcc: [],
        confidenceModel: []
    });
    const [submissionsList, setSubmissionsList] = useState([]);
    const [confidences, setAllConfidences] = useState([]);
    const [filters, setFilters] = useState({
        submission: '',
        confidence: ''
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
        fetchSubmissionsAndConfidence();
    }, [filters]);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const data = await secureApi.post(POST.DASHBOARD_DATA, filters);
            setDashboardData({
                documents: data.documents,
                submissions: data.submissions,
                totalNumbers: data.totalFixes,
                accuracySubmission: data.accBySubmission,
                overAllConfidence: data.overAllConfidence,
                aboveThresholdModelAcc: data.aboveArr,
                belowThresholdModelAcc: data.belowArr,
                confidenceModel: data.confidenceByModelFinalSchema
            });
        } catch (err) {
            errorMessage(err?.response?.data?.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchSubmissionsAndConfidence = async () => {
        try {
            const data = await secureApi.get(GET.GET_SUB_AND_CONF);
            setSubmissionsList(data.submissions);
            setAllConfidences(data.submissions);
        } catch (err) {
            errorMessage(err?.response?.data?.message);
        }
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <div className="border-b">
                <div className="flex h-16 items-center">
                    <div className="flex items-center space-x-4">
                        <Layout className="h-6 w-6" />
                        <h1 className="text-2xl font-semibold">Dashboard</h1>
                    </div>
                    <div className="ml-auto flex items-center space-x-4">
                        <Button variant="ghost" className="flex items-center">
                            <HelpCircle className="w-5 h-5 mr-2" />
                            Help Assistant
                        </Button>
                        <Button variant="ghost" className="flex items-center">
                            <GraduationCap className="w-5 h-5 mr-2" />
                            Learn
                        </Button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="py-4">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                        <CardContent className="p-6">
                            <h3 className="text-lg font-semibold text-gray-900">Total Documents</h3>
                            <p className="text-4xl font-bold mt-4">
                                {loading ? '...' : dashboardData.documents}
                            </p>
                        </CardContent>
                    </Card>
                    
                    <Link to="/submission" className="block">
                        <Card className="hover:bg-gray-50/50 group">
                            <CardContent className="p-6">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">Total Submissions</h3>
                                        <p className="text-4xl font-bold mt-4">
                                            {loading ? '...' : dashboardData.submissions}
                                        </p>
                                        <p className="text-blue-600 mt-2">
                                            View all submissions
                                        </p>
                                    </div>
                                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                    
                    <Card>
                        <CardContent className="p-6">
                            <h3 className="text-lg font-semibold text-gray-900">Fields Transcribed</h3>
                            <p className="text-4xl font-bold mt-4">
                                {loading ? '...' : dashboardData.totalNumbers}
                            </p>
                            <p className="text-gray-500 mt-2">
                                Transcription Accuracy = Total Fields - Fields Changed
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Analytics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex flex-col gap-4">
                                <h2 className="text-2xl font-bold">Submission Analytics</h2>
                                <div>
                                    <h3 className="text-lg font-semibold">Accuracy by Submission(s)</h3>
                                    <p className="text-gray-500 mt-1">
                                        Accuracy By Submission = # of fields changed / the total number of fields.
                                    </p>
                                </div>
                                <div className="min-h-[400px]">
                                    <SubmissionVisuals 
                                        submissionsList={submissionsList}
                                        accuracySubmission={dashboardData.accuracySubmission}
                                        setSubmissionFilter={(val) => setFilters(prev => ({...prev, submission: val}))}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex flex-col gap-4">
                                <h2 className="text-2xl font-bold">Processor Performance</h2>
                                <div>
                                    <h3 className="text-lg font-semibold">Accuracy by Model(s)</h3>
                                    <p className="text-gray-500 mt-1">
                                        Accuracy by Model(s) = # of fields changed / the total number of fields grouped by Model.
                                    </p>
                                </div>
                                <div className="min-h-[400px]">
                                    <ProcessorVisuals 
                                        aboveThresholdModelAcc={dashboardData.aboveThresholdModelAcc}
                                        belowThresholdModelAcc={dashboardData.belowThresholdModelAcc}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex flex-col gap-4">
                                <h2 className="text-2xl font-bold">Confidence Distribution</h2>
                                <div>
                                    <h3 className="text-lg font-semibold">Confidence Score by Submission(s)</h3>
                                    <p className="text-gray-500 mt-1">
                                        Confidence Score by Submission = Aggregates of Confidence Score we receive from all models.
                                    </p>
                                </div>
                                <div className="min-h-[400px]">
                                    <ConfidenceSubmission 
                                        confidences={confidences}
                                        setConfidenceFilter={(val) => setFilters(prev => ({...prev, confidence: val}))}
                                        overAllConfidence={dashboardData.overAllConfidence}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex flex-col gap-4">
                                <h2 className="text-2xl font-bold">Model Confidence Analysis</h2>
                                <div>
                                    <h3 className="text-lg font-semibold">Confidence Score by Model(s)</h3>
                                    <p className="text-gray-500 mt-1">
                                        Confidence Score by Model = Aggregates of Confidence Score we receive from models grouped by models.
                                    </p>
                                </div>
                                <div className="min-h-[400px]">
                                    <ConfidenceModel 
                                        confidenceModel={dashboardData.confidenceModel}
                                        aboveThresholdModelAcc={dashboardData.aboveThresholdModelAcc}
                                        belowThresholdModelAcc={dashboardData.belowThresholdModelAcc}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;