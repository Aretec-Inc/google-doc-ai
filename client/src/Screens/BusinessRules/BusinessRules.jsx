// import { MoreVertical, Plus, Search } from 'lucide-react';
// import React, { useEffect, useState } from 'react';
// import { useSelector } from 'react-redux';
// import { Link } from 'react-router-dom';
// import { Button } from "../../Components/ui/button";
// import { Card, CardContent } from "../../Components/ui/card";
// import { Input } from "../../Components/ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "../../Components/ui/select";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "../../Components/ui/table";
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipProvider,
//   TooltipTrigger,
// } from "../../Components/ui/tooltip";

// import BusinessRuleModal from '../../Components/BusinessRule/BusinessRuleModal';
// import { getAllBusinessRules } from '../../Redux/actions/businessRuleActions';
// import { convertTitle, validateLength } from '../../utils/helpers';
// import BusinessRuleDetails from './BusinessRuleDetails';

// // Breadcrumb Component
// const SimpleBreadcrumb = ({ ruleName }) => {
//   return (
//     <nav className="py-2 px-4 border-b" aria-label="Breadcrumb">
//       <ol className="flex items-center text-sm">
//         <li>
//           <Link to="/" className="text-[#0067b8] hover:underline">Home</Link>
//         </li>
//         <li className="mx-2 text-gray-500">/</li>
//         <li>
//           <Link to="/business-rules" className="text-[#0067b8] hover:underline">Business Rules</Link>
//         </li>
//         {ruleName && (
//           <>
//             <li className="mx-2 text-gray-500">/</li>
//             <li className="text-gray-600">{ruleName}</li>
//           </>
//         )}
//       </ol>
//     </nav>
//   );
// };

// const BusinessRules = (props) => {
//   const { dispatch } = props;
//   const allRules = useSelector((state) => state?.businessRuleReducer?.allRules || []);
//   const totalRules = useSelector((state) => state?.businessRuleReducer?.totalRules || 0);

//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [showDetails, setShowDetails] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [selectedRule, setSelectedRule] = useState(null);
//   const [filters, setFilters] = useState({
//     ruleName: '',
//     rulesetId: '',
//     pageSize: 10,
//     pageNo: 1
//   });

//   useEffect(() => {
//     if (!allRules?.length) {
//       setLoading(true);
//     }
//     dispatch(getAllBusinessRules(filters, setLoading));
//   }, [isModalOpen, showDetails, filters]);

//   if (showDetails && selectedRule?.rule_id) {
//     return <BusinessRuleDetails {...props} goBack={() => setShowDetails(false)} ruleData={selectedRule} />;
//   }

//   return (
//     <div className="bg-white">
//       <SimpleBreadcrumb ruleName={selectedRule?.rule_name} />

//       {/* Title Section */}
//       <div className="border-b bg-white">
//         <div className="px-4 py-4 flex justify-between items-center">
//           <div className="flex items-center space-x-4">
//             <h1 className="text-xl">Business Rules</h1>
//             <span className="text-gray-500">Designer</span>
//             <Button
//               variant="outline"
//               className="ml-8"
//               onClick={() => setIsModalOpen(true)}
//             >
//               <Plus className="h-4 w-4 mr-2" />
//               Create Rule
//             </Button>
//           </div>
//         </div>
//       </div>

//       {/* Filters */}
//       <div className="p-4 md:p-6 space-y-4">
//         <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
//           <div className="md:col-span-9">
//             <div className="relative">
//               <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
//               <Input
//                 placeholder="Search by Rule name"
//                 className="pl-8"
//                 onChange={(e) => setFilters(prev => ({ ...prev, ruleName: e.target.value }))}
//               />
//             </div>
//           </div>

//           <div className="md:col-span-3">
//             <Select
//               onValueChange={(value) => setFilters(prev => ({ ...prev, rulesetId: value }))}
//             >
//               <SelectTrigger>
//                 <SelectValue placeholder="Filter by Ruleset" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="form941">Form 941</SelectItem>
//                 <SelectItem value="form1040">Form 1040</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>
//         </div>

//         {/* Rules Table */}
//         <Card>
//           <CardContent className="p-0">
//             <div className="flex items-center justify-between p-4">
//               <h3 className="text-lg font-medium">{totalRules} Business Rules</h3>
//               <Button variant="ghost" size="icon">
//                 <MoreVertical className="h-4 w-4" />
//               </Button>
//             </div>

//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Rule Name</TableHead>
//                   <TableHead>Business Rule</TableHead>
//                   <TableHead>Rule Statement</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {allRules?.map((rule) => (
//                   <TableRow key={rule.rule_id}>
//                     <TableCell>
//                       <TooltipProvider>
//                         <Tooltip>
//                           <TooltipTrigger asChild>
//                             <Link
//                               onClick={() => {
//                                 setShowDetails(true);
//                                 setSelectedRule(rule);
//                               }}
//                               className="hover:underline"
//                             >
//                               {validateLength(convertTitle(rule.rule_name), 30)}
//                             </Link>
//                           </TooltipTrigger>
//                           <TooltipContent>
//                             {convertTitle(rule.rule_name)}
//                           </TooltipContent>
//                         </Tooltip>
//                       </TooltipProvider>
//                     </TableCell>
//                     <TableCell>{rule.rule_set_name}</TableCell>
//                     <TableCell>{rule.rule_statement}</TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>

//             {/* Pagination */}
//             <div className="flex items-center justify-between p-4">
//               <div className="flex items-center space-x-2">
//                 <p className="text-sm text-muted-foreground">
//                   Page {filters.pageNo} of {Math.ceil(totalRules / filters.pageSize)}
//                 </p>
//               </div>
//               <div className="flex items-center space-x-2">
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={() => setFilters(prev => ({ ...prev, pageNo: prev.pageNo - 1 }))}
//                   disabled={filters.pageNo === 1}
//                 >
//                   Previous
//                 </Button>
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={() => setFilters(prev => ({ ...prev, pageNo: prev.pageNo + 1 }))}
//                   disabled={filters.pageNo >= Math.ceil(totalRules / filters.pageSize)}
//                 >
//                   Next
//                 </Button>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//       {isModalOpen && (
//         <BusinessRuleModal
//           closeModal={() => setIsModalOpen(false)}
//           {...props}
//         />
//       )}
//     </div>
//   );
// };

// export default BusinessRules;



import { MoreVertical, Plus, Search } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "../../Components/ui/button";
import { Card, CardContent } from "../../Components/ui/card";
import { Input } from "../../Components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../Components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../Components/ui/tooltip";

import BusinessRuleModal from '../../Components/BusinessRule/BusinessRuleModal';
import { convertTitle, validateLength } from '../../utils/helpers';
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
            <li className="text-gray-600">{convertTitle(ruleName?.trim())}</li>
          </>
        )}
      </ol>
    </nav>
  );
};

const BusinessRules = (props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedRule, setSelectedRule] = useState(null);
  const [businessRules, setBusinessRules] = useState([]);
  const [totalRules, setTotalRules] = useState(0);
  const [filters, setFilters] = useState({
    ruleName: '',
    rulesetId: 'all',
    skip: 0,
    limit: 10
  });

  const fetchBusinessRules = async () => {
    try {
      setLoading(true);
      setError(null);

      const queryParams = new URLSearchParams({
        skip: filters.skip.toString(),
        limit: filters.limit.toString(),
      });

      if (filters.ruleName) {
        queryParams.append('ruleName', filters.ruleName.trim());
      }

      if (filters.rulesetId && filters.rulesetId !== 'all') {
        queryParams.append('rulesetId', filters.rulesetId);
      }

      const response = await fetch(
        `https://google-docai-be-685246125222.us-central1.run.app/api/v1/business-rules/?${queryParams}`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch business rules: ${response.statusText}`);
      }

      const [rules, total] = await response.json();
      setBusinessRules(rules || []);
      setTotalRules(total || 0);
    } catch (error) {
      console.error('Error fetching business rules:', error);
      setError(error.message);
      setBusinessRules([]);
      setTotalRules(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBusinessRules();
  }, [filters, isModalOpen]);

  if (showDetails && selectedRule?.rule_id) {
    return <BusinessRuleDetails {...props} goBack={() => setShowDetails(false)} ruleData={selectedRule} />;
  }

  const currentPage = Math.floor(filters.skip / filters.limit) + 1;
  const totalPages = Math.ceil(totalRules / filters.limit);

  const handlePageChange = (newPage) => {
    setFilters(prev => ({
      ...prev,
      skip: (newPage - 1) * prev.limit
    }));
  };

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
      <div className="p-4 md:p-6 space-y-4 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-9">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by Rule name"
                className="pl-8"
                value={filters.ruleName}
                onChange={(e) => setFilters(prev => ({
                  ...prev,
                  ruleName: e.target.value,
                  skip: 0
                }))}
              />
            </div>
          </div>

          <div className="md:col-span-3">
            <Select
              value={filters.rulesetId}
              onValueChange={(value) => setFilters(prev => ({
                ...prev,
                rulesetId: value,
                skip: 0
              }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by Ruleset" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Rulesets</SelectItem>
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

            <div className="w-full overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="p-4 text-left font-medium text-gray-600">Rule Name</th>
                    <th className="p-4 text-left font-medium text-gray-600">Business Rule Set</th>
                    <th className="p-4 text-left font-medium text-gray-600">Rule Statement</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={3} className="text-center py-8">
                        <div className="flex justify-center items-center space-x-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                          <span>Loading...</span>
                        </div>
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td colSpan={3} className="text-center text-red-500 py-4">
                        {error}
                      </td>
                    </tr>
                  ) : businessRules.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="text-center py-4">
                        No business rules found
                      </td>
                    </tr>
                  ) : businessRules.map((rule) => (
                    <tr key={rule.rule_name + rule.rule_set_name} className="border-b hover:bg-gray-50">
                      <td className="p-4">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Link
                                onClick={() => {
                                  setShowDetails(true);
                                  setSelectedRule(rule);
                                }}
                                className="hover:underline text-blue-600"
                              >
                                {validateLength(convertTitle(rule.rule_name.trim()), 30)}
                              </Link>
                            </TooltipTrigger>
                            <TooltipContent>
                              {convertTitle(rule.rule_name.trim())}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </td>
                      <td className="p-4">{rule.rule_set_name}</td>
                      <td className="p-4">{rule.rule_statement}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between p-4 border-t">
              <div className="flex items-center space-x-2">
                <p className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1 || loading}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= totalPages || loading}
                >
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

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