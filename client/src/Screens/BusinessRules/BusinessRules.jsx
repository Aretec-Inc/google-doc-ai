import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { Search, MoreVertical, Plus, Upload, Code } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../Components/ui/dialog";

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
import { Input } from "../../Components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../Components/ui/tooltip";
import { Card, CardContent } from "../../Components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../Components/ui/tabs";

import { validateLength, convertTitle } from '../../utils/helpers';
import { getAllBusinessRules } from '../../Redux/actions/businessRuleActions';
import BusinessRuleModal from '../../Components/BusinessRule/BusinessRuleModal';
import BusinessRuleDetails from './BusinessRuleDetails';

// Breadcrumb Component
const SimpleBreadcrumb = ({ ruleName }) => {
  return (
    <nav className="py-2 px-4 border-b" aria-label="Breadcrumb">
      <ol className="flex items-center text-sm">
        <li>
          <Link to="/" className="text-[#0067b8] hover:underline">Home</Link>
        </li>
        <li className="mx-2 text-gray-500">/</li>
        <li>
          <Link to="/business-rules" className="text-[#0067b8] hover:underline">Business Rules</Link>
        </li>
        {ruleName && (
          <>
            <li className="mx-2 text-gray-500">/</li>
            <li className="text-gray-600">{ruleName}</li>
          </>
        )}
      </ol>
    </nav>
  );
};

const BusinessRules = (props) => {
  const { dispatch } = props;
  const allRules = useSelector((state) => state?.businessRuleReducer?.allRules || []);
  const totalRules = useSelector((state) => state?.businessRuleReducer?.totalRules || 0);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedRule, setSelectedRule] = useState(null);
  const [filters, setFilters] = useState({
    ruleName: '',
    rulesetId: '',
    pageSize: 10,
    pageNo: 1
  });

  useEffect(() => {
    if (!allRules?.length) {
      setLoading(true);
    }
    dispatch(getAllBusinessRules(filters, setLoading));
  }, [isModalOpen, showDetails, filters]);

  if (showDetails && selectedRule?.rule_id) {
    return <BusinessRuleDetails {...props} goBack={() => setShowDetails(false)} ruleData={selectedRule} />;
  }

  return (
    <div className="bg-white">
      <SimpleBreadcrumb ruleName={selectedRule?.rule_name} />

      {/* Title Section */}
      <div className="border-b bg-white">
        <div className="px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl">Business Rules</h1>
            <span className="text-gray-500">Designer</span>
            <Button 
              variant="outline"
              className="ml-8"
              onClick={() => setIsModalOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Rule
            </Button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="p-4 md:p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-9">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by Rule name"
                className="pl-8"
                onChange={(e) => setFilters(prev => ({ ...prev, ruleName: e.target.value }))}
              />
            </div>
          </div>

          <div className="md:col-span-3">
            <Select
              onValueChange={(value) => setFilters(prev => ({ ...prev, rulesetId: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by Ruleset" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="form941">Form 941</SelectItem>
                <SelectItem value="form1040">Form 1040</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Rules Table */}
        <Card>
          <CardContent className="p-0">
            <div className="flex items-center justify-between p-4">
              <h3 className="text-lg font-medium">{totalRules} Business Rules</h3>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rule Name</TableHead>
                  <TableHead>Ruleset</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Min Confidence</TableHead>
                  <TableHead>Created Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allRules?.map((rule) => (
                  <TableRow key={rule.rule_id}>
                    <TableCell>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Link 
                              onClick={() => {
                                setShowDetails(true);
                                setSelectedRule(rule);
                              }}
                              className="hover:underline"
                            >
                              {validateLength(convertTitle(rule.rule_name), 16)}
                            </Link>
                          </TooltipTrigger>
                          <TooltipContent>
                            {convertTitle(rule.rule_name)}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell>{rule.ruleset_id}</TableCell>
                    <TableCell>{rule.priority}</TableCell>
                    <TableCell>{(rule.min_confidence_score * 100).toFixed(1)}%</TableCell>
                    <TableCell>{moment(rule.updated_date).format('MMM D, YYYY, h:mm:ss A')}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination */}
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center space-x-2">
                <p className="text-sm text-muted-foreground">
                  Page {filters.pageNo} of {Math.ceil(totalRules / filters.pageSize)}
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
                  disabled={filters.pageNo >= Math.ceil(totalRules / filters.pageSize)}
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
        <BusinessRuleModal
          closeModal={() => setIsModalOpen(false)}
          {...props}
        />
      )}
    </div>
  );
};

export default BusinessRules;