import React, { useState, useEffect } from 'react';
import { ArrowLeft, Share, Search, MoreVertical, MessageCircle, GraduationCap, Upload, Flag } from 'lucide-react';
import moment from 'moment';
import { Progress, Slider } from 'antd';

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

const SubmissionTemplate = ({ templateData, dispatch, goBack }) => {
  const submission_id = templateData?.id;
  const [threshold, setThreshold] = useState(templateData?.threshold || 0);
  const [allFiles, setAllFiles] = useState([]);
  const [totalFiles, setTotalFiles] = useState(0);
  const [selectedFile, setSelectedFile] = useState({});
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

  const handleThresholdChange = (value) => {
    setThreshold(value);
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b">
        <div className="flex h-16 items-center px-4 md:px-6">
          <div className="flex items-center space-x-4">
            <Share className="h-6 w-6" />
            <h2 className="text-2xl font-semibold">Submission</h2>
            <h2 className="text-2xl font-semibold text-muted-foreground">Services</h2>
            
            <Button 
              variant="ghost" 
              className="ml-16"
              onClick={() => setIsModalOpen(true)}
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload
            </Button>
          </div>
          
          <div className="ml-auto flex items-center space-x-4">
            <Button variant="ghost">
              <MessageCircle className="h-4 w-4 mr-2" />
              Help Assistant
            </Button>
            <Button variant="ghost">
              <GraduationCap className="h-4 w-4 mr-2" />
              Learn
            </Button>
          </div>
        </div>
      </div>

      <div className="p-4 md:p-6 space-y-4">
        {/* Back button and filters */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-1">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={goBack}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </div>

          <div className="md:col-span-3">
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

          <div className="md:col-span-8">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by ID or File name"
                className="pl-8"
                onChange={(e) => setFileName(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Submission info */}
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">
            Submission: {convertTitle(templateData?.submission_name)}
          </h3>
          <div className="flex items-center space-x-4 w-64">
            <span className="text-sm text-muted-foreground">Threshold:</span>
            <Slider
              value={threshold}
              onChange={handleThresholdChange}
              min={0}
              max={100}
              step={1}
            />
            <span className="text-sm min-w-[40px]">{threshold}%</span>
          </div>
        </div>

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center space-x-4">
                <h3 className="text-lg font-medium">{totalFiles} Documents</h3>
                <span className="text-sm text-muted-foreground">
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
                  <Button onClick={() => setViewTable(true)}>
                    View Table
                  </Button>
                )}
              </div>
            </div>

            <Table>
              <TableHeader>
                {viewTable ? (
                  <TableRow>
                    {exportColumns.map((column, index) => (
                      <TableHead key={index}>{convertTitle(column)}</TableHead>
                    ))}
                  </TableRow>
                ) : (
                  <TableRow>
                    <TableHead>File Name</TableHead>
                    <TableHead>Confidence</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created Date</TableHead>
                  </TableRow>
                )}
              </TableHeader>
              <TableBody>
                {viewTable ? (
                  exportData.map((row, rowIndex) => (
                    <TableRow key={rowIndex}>
                      {row.map((cell, cellIndex) => (
                        <TableCell key={`${rowIndex}-${cellIndex}`}>
                          {convertTitle(cell || '-')}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  allFiles.map((file) => (
                    <TableRow key={file.id}>
                      <TableCell>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                onClick={() => {
                                  setSelectedFile(file);
                                  setShowDocument(true);
                                }}
                                className="hover:underline"
                              >
                                {validateLength(convertTitle(file.original_file_name), 50)}
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>
                              {convertTitle(file.original_file_name)}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        {file.is_completed && file.min_confidence < threshold && (
                          <Flag className="h-4 w-4 inline-block ml-2 text-red-500" />
                        )}
                      </TableCell>
                      <TableCell>
                        <Progress
                          percent={file.average_confidence}
                          size="small"
                          status={file.average_confidence < threshold ? "exception" : "active"}
                        />
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
                  ))
                )}
              </TableBody>
            </Table>

            {/* Pagination */}
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center space-x-2">
                <p className="text-sm text-muted-foreground">
                  Page {pageNo} of {Math.ceil(totalFiles / pageSize)}
                </p>
              </div>
              <div className="flex items-center space-x-2">
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