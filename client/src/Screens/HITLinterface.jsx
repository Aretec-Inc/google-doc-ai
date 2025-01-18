import React, { useState, useEffect } from 'react';
import { DocumentService, FieldService, BusinessRuleService } from '../services/api';

const HITLInterface = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(0);
  const [businessRules, setBusinessRules] = useState([]);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setLoading(true);
        const params = {
          skip: page * ITEMS_PER_PAGE,
          limit: ITEMS_PER_PAGE,
          ...(statusFilter && { status: statusFilter })
        };
        const data = await DocumentService.getDocumentFindings(params);
        setDocuments(data);
      } catch (err) {
        setError('Failed to fetch documents. Please try again later.');
        console.error('Error fetching documents:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [page, statusFilter]);

  const filteredDocuments = documents.filter(doc => 
    doc.document_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.rule_id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    switch(status) {
      case 'pending_review':
        return <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>Pending Review</span>;
      case 'approved':
        return <span className={`${baseClasses} bg-green-100 text-green-800`}>Approved</span>;
      case 'flagged':
        return <span className={`${baseClasses} bg-red-100 text-red-800`}>Flagged</span>;
      default:
        return null;
    }
  };

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4 m-4">
        <div className="flex">
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-900">Document AI Review</h1>
            <div className="flex items-center space-x-4">
              <select
                className="block w-40 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Status</option>
                <option value="pending_review">Pending Review</option>
                <option value="approved">Approved</option>
                <option value="flagged">Flagged</option>
              </select>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search documents..."
                  className="block w-96 rounded-md border-gray-300 pl-10 focus:border-blue-500 focus:ring-blue-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredDocuments.map((doc) => (
              <div key={doc.hitl_doc_finding_id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <svg className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span className="text-lg font-medium text-gray-900">{doc.document_id}</span>
                    </div>
                    {getStatusBadge(doc.status)}
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
                    <div>
                      <span className="text-sm text-gray-500">Confidence Score:</span>
                      <div className="mt-1 font-medium">{(doc.confidence_score * 100).toFixed(1)}%</div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Priority Level:</span>
                      <div className="mt-1 font-medium">{doc.priority}</div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Last Updated:</span>
                      <div className="mt-1 font-medium">
                        {new Date(doc.updated_date).toLocaleDateString()}
                      </div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Created By:</span>
                      <div className="mt-1 font-medium">{doc.created_by}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Pagination */}
        <div className="flex justify-center mt-6 space-x-2">
          <button
            onClick={() => setPage(p => Math.max(0, p - 1))}
            disabled={page === 0}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button
            onClick={() => setPage(p => p + 1)}
            disabled={filteredDocuments.length < ITEMS_PER_PAGE}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default HITLInterface;