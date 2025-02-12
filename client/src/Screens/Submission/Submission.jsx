import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { Share, Search, MoreVertical, MessageCircle, GraduationCap, Plus } from 'lucide-react';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../Components/ui/table";
import { Button } from "../../Components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../Components/ui/select";
import { Calendar } from "../../Components/ui/calendar";
import { Input } from "../../Components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../Components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../Components/ui/popover";
import { Card, CardContent } from "../../Components/ui/card";

import { validateLength, convertTitle, disabledDate } from '../../utils/helpers';
import { getAllSubmissions } from '../../Redux/actions/docActions';
import SubmissionModal from '../../Components/Submission/SubmissionModal';
import SubmissionTemplate from './SubmissionTemplate';
import { ChevronRight } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const SimpleBreadcrumb = ({ submissionName }) => {
  const location = useLocation();
  
  return (
    <nav className="py-2 px-4 bg-white" aria-label="Breadcrumb">
      <ol className="flex items-center text-sm">
        <li>
          <Link to="/" className="text-[#0067b8] hover:underline">Home</Link>
        </li>
        <li className="mx-2 text-gray-500">/</li>
        <li>
          <Link to="/submission" className="text-[#0067b8] hover:underline">Submission</Link>
        </li>
        {submissionName && (
          <>
            <li className="mx-2 text-gray-500">/</li>
            <li className="text-gray-600">{submissionName}</li>
          </>
        )}
      </ol>
    </nav>
  );
};

const Submission = (props) => {
  const { dispatch } = props;
  const allSubmissions = useSelector((state) => state?.docReducer?.allSubmissions || []);
  const totalSubmissions = useSelector((state) => state?.docReducer?.totalSubmissions || 0);
  const allProcessors = useSelector((state) => state?.docReducer?.allProcessors || []);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showTemplate, setShowTemplate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [templateData, setTemplateData] = useState({});
  const [filters, setFilters] = useState({
    submissionName: '',
    processorId: '',
    dateRange: null,
    pageSize: 10,
    pageNo: 1
  });

  useEffect(() => {
    if (!allSubmissions?.length) {
      setLoading(true);
    }
    dispatch(getAllSubmissions(filters, setLoading));
  }, [isModalOpen, showTemplate, filters]);

  const handleDateRangeSelect = (dates) => {
    if (!dates || dates.length < 2) {
      setFilters(prev => ({ ...prev, dateRange: null }));
      return;
    }
    
    setFilters(prev => ({
      ...prev,
      dateRange: {
        start: moment(dates[0]).format('YYYY-MM-DD'),
        end: moment(dates[1]).add(1, 'day').format('YYYY-MM-DD')
      }
    }));
  };

  if (showTemplate && templateData?.id) {
    return <SubmissionTemplate {...props} goBack={() => setShowTemplate(false)} templateData={templateData} />;
  }

  return (
    <div className="bg-white">
      {/* Breadcrumb */}
      <SimpleBreadcrumb submissionName={templateData?.submission_name} />
      
      {/* Main Title Section */}
      <div className="border-b bg-white">
        <div className="px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl">Submission</h1>
            <span className="text-gray-500">Services</span>
            <button className="ml-8 px-4 py-2 flex items-center space-x-2 hover:bg-gray-50 rounded">
              <span>+</span>
              <span>Create Submission</span>
            </button>
          </div>
          <div className="flex items-center space-x-6">
            <button className="flex items-center space-x-2">
              <span>Help Assistant</span>
            </button>
            <button className="flex items-center space-x-2">
              <span>Learn</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Filters */}

      <div className="p-4 md:p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="md:col-span-7">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by Submission name"
                className="pl-8"
                onChange={(e) => setFilters(prev => ({ ...prev, submissionName: e.target.value }))}
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <Select
              onValueChange={(value) => setFilters(prev => ({ ...prev, processorId: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                {allProcessors?.map((processor) => (
                  <SelectItem key={processor.id} value={processor.id}>
                    {processor.displayName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="md:col-span-3">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  {filters.dateRange ? 
                    `${moment(filters.dateRange.start).format('MM/DD/YYYY')} - ${moment(filters.dateRange.end).format('MM/DD/YYYY')}` 
                    : "Pick a date range"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={moment().toDate()}
                  selected={filters.dateRange}
                  onSelect={handleDateRangeSelect}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>


        </div>

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            <div className="flex items-center justify-between p-4">
              <h3 className="text-lg font-medium">{totalSubmissions} Submissions</h3>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Submission</TableHead>
                  <TableHead>Processor</TableHead>
                  <TableHead>Total Forms</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allSubmissions?.map((submission) => (
                  <TableRow key={submission.id}>
                    <TableCell>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Link 
                              onClick={() => {
                                setShowTemplate(true);
                                setTemplateData(submission);
                              }}
                              className="hover:underline"
                            >
                              {validateLength(convertTitle(submission.submission_name), 16)}
                            </Link>
                          </TooltipTrigger>
                          <TooltipContent>
                            {convertTitle(submission.submission_name)}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell>{submission.processor_name}</TableCell>
                    <TableCell>{submission.total_forms}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium
                        ${submission.status === 'Processing' ? 'bg-blue-50 text-blue-700' : 
                          submission.status === 'Completed' ? 'bg-green-50 text-green-700' :
                          'bg-gray-50 text-gray-700'}`}>
                        {submission.status}
                      </span>
                    </TableCell>
                    <TableCell>{moment(submission.created_at).format('MMM D, YYYY, h:mm:ss A')}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination */}
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center space-x-2">
                <p className="text-sm text-muted-foreground">
                  Page {filters.pageNo} of {Math.ceil(totalSubmissions / filters.pageSize)}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setFilters(prev => ({ ...prev, pageNo: prev.pageNo - 1 }))}
                  disabled={filters.pageNo === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setFilters(prev => ({ ...prev, pageNo: prev.pageNo + 1 }))}
                  disabled={filters.pageNo >= Math.ceil(totalSubmissions / filters.pageSize)}
                >
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <SubmissionModal
          closeModal={() => setIsModalOpen(false)}
          {...props}
        />
      )}
    </div>
  );
};

export default Submission;