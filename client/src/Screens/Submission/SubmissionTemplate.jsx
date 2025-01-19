import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';  // Added useNavigate here
import { Search, ArrowLeft, Upload, MoreVertical } from 'lucide-react';
import moment from 'moment';
import { Progress } from 'antd';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../Components/ui/table";
import { Button } from "../../Components/ui/button";
import { Input } from "../../Components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../Components/ui/tooltip";
import { Card, CardContent } from "../../Components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../Components/ui/popover";
import { Calendar } from "../../Components/ui/calendar";

import { errorMessage, convertTitle, validateLength } from '../../utils/helpers';
import { setDocuments } from '../../Redux/actions/docActions';
import { secureApi } from '../../Config/api';
import { GET } from '../../utils/apis';
import UploadModal from '../../Components/Submission/UploadModal';
import SelectedDocument from '../../Components/SelectedDocument/SelectedDocument';

// Breadcrumb Component
const SimpleBreadcrumb = ({ submissionName }) => {
  const navigate = useNavigate();  // Now this will work

  const handleSubmissionClick = (e) => {
    e.preventDefault();
    navigate('/submission');
  };

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
            onClick={handleSubmissionClick}
            className="text-[#0067b8] hover:underline"
          >
            Submission
          </Link>
        </li>
        <li className="mx-2 text-gray-500">/</li>
        <li className="text-gray-600">{submissionName}</li>
      </ol>
    </nav>
  );
};

const SubmissionTemplate = ({ templateData, dispatch, goBack }) => {
  const submission_id = templateData?.id;
  const [threshold, setThreshold] = useState(templateData?.threshold || 0);
  const [allFiles, setAllFiles] = useState([]);
  const [totalFiles, setTotalFiles] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showDocument, setShowDocument] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState('');
  const [dateRange, setDateRange] = useState(null);
  const [pageSize, setPageSize] = useState(10);
  const [pageNo, setPageNo] = useState(1);
  const [viewTable, setViewTable] = useState(false);
  const [exportData, setExportData] = useState([]);
  const [exportColumns, setExportColumns] = useState([]);

  useEffect(() => {
    getAllFiles();
    getExportData();
  }, [isModalOpen, fileName, dateRange, pageNo, pageSize]);

  const getAllFiles = async () => {
    if (!allFiles?.length) {
      setLoading(true);
    }

    try {
      const response = await secureApi.post(
        `${GET.FILES_BY_ID}?submission_id=${submission_id}`,
        { fileName, dateRange, pageNo, pageSize }
      );

      setAllFiles(response?.documents || []);
      setTotalFiles(response?.totalFiles || 0);
      dispatch(setDocuments({ [submission_id]: response?.documents || [] }));
    } catch (err) {
      errorMessage(err?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const getExportData = async () => {
    try {
      const response = await secureApi.post(`${GET.EXPORT_DATA}?submission_id=${submission_id}`);
      setExportData(response?.arrData || []);
      setExportColumns(response?.columns || []);
    } catch (err) {
      errorMessage(err?.response?.data?.message);
    }
  };

  const handleDateRangeSelect = (dates) => {
    if (!dates || dates.length < 2) {
      setDateRange(null);
      return;
    }

    setDateRange({
      start: moment(dates[0]).format('YYYY-MM-DD'),
      end: moment(dates[1]).add(1, 'day').format('YYYY-MM-DD')
    });
  };

  const downloadCsv = async () => {
    try {
      const response = await secureApi.post(
        `${GET.EXPORT_DATA_CSV}?submission_id=${submission_id}`,
        {},
        { responseType: 'blob' }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'data.csv');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      errorMessage(err?.response?.data?.message);
    }
  };

  if (showDocument) {
    return (
      <SelectedDocument
        openModal={false}
        disableBack={true}
        closeModal={() => setShowDocument(false)}
        artifactData={selectedFile}
      />
    );
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumb */}
      <SimpleBreadcrumb submissionName={convertTitle(templateData?.submission_name)} />

      {/* Title Section */}
      <div className="border-b bg-white">
        <div className="py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={goBack}
              className=""
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-xl font-medium">Submission: {convertTitle(templateData?.submission_name)}</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">
              Threshold: {threshold}%
            </span>
            <Button
              onClick={() => setIsModalOpen(true)}
              className="ml-4"
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload
            </Button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="py-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by ID or File name"
            className="pl-8"
            onChange={(e) => setFileName(e.target.value)}
          />
        </div>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-start text-left font-normal">
              {dateRange ?
                `${moment(dateRange.start).format('MM/DD/YYYY')} - ${moment(dateRange.end).format('MM/DD/YYYY')}`
                : "Pick a date range"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={moment().toDate()}
              selected={dateRange}
              onSelect={handleDateRangeSelect}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Content Section */}
      <div className="pb-4">
        <Card>
          <CardContent className="p-0">
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center space-x-4">
                <span className="font-medium">{totalFiles} Documents</span>
                <span className="text-sm text-gray-500">
                  Processor: {templateData?.processor_name}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                {viewTable ? (
                  <>
                    <Button variant="ghost" onClick={() => setViewTable(false)}>
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back
                    </Button>
                    <Button onClick={downloadCsv}>
                      Export CSV
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => setViewTable(true)} variant="secondary">
                    View Table
                  </Button>
                )}
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40%]">File Name</TableHead>
                  <TableHead className="w-[20%]">Confidence</TableHead>
                  <TableHead className="w-[20%]">Status</TableHead>
                  <TableHead className="w-[20%]">Created Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allFiles.map((file) => (
                  <TableRow key={file.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <Link
                          onClick={() => {
                            setSelectedFile(file);
                            setShowDocument(true);
                          }}
                          className="hover:underline text-blue-600"
                        >
                          {validateLength(convertTitle(file.original_file_name), 50)}
                        </Link>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="w-full">
                        <Progress
                          percent={file.average_confidence}
                          status={file.average_confidence < threshold ? "exception" : "active"}
                          size="small"
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium
                        ${file.is_completed ? 'bg-green-50 text-green-700' : 'bg-blue-50 text-blue-700'}`}>
                        {file.is_completed ? 'Completed' : 'Processing'}
                      </span>
                    </TableCell>
                    <TableCell>
                      {moment(file.created_at).format('MMM D, YYYY, h:mm:ss A')}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination */}
            <div className="flex items-center justify-between p-4 border-t">
              <p className="text-sm text-gray-500">
                Page {pageNo} of {Math.ceil(totalFiles / pageSize)}
              </p>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPageNo(prev => prev - 1)}
                  disabled={pageNo === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPageNo(prev => prev + 1)}
                  disabled={pageNo >= Math.ceil(totalFiles / pageSize)}
                >
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      {isModalOpen && (
        <UploadModal
          closeModal={() => setIsModalOpen(false)}
          dispatch={dispatch}
          templateData={templateData}
        />
      )}
    </div>
  );
};

export default SubmissionTemplate;