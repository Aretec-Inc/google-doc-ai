// src/Screens/BusinessRules/BusinessRuleDetails.jsx
import React, { useState, useEffect } from 'react';
import { ChevronLeft, Save, Eye, Download } from 'lucide-react';
import { useSelector } from 'react-redux';
import moment from 'moment';

import { Button } from "../../Components/ui/button";
import { Input } from "../../Components/ui/input";
import { Textarea } from "../../Components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "../../Components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../Components/ui/select";

import { getBusinessRule, updateBusinessRule } from '../../Redux/actions/businessRuleActions';


const BusinessRuleDetails = ({ goBack, ruleData, dispatch }) => {
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedRule, setEditedRule] = useState(ruleData);

  useEffect(() => {
    if (ruleData?.rule_id) {
      dispatch(getBusinessRule(ruleData.rule_id, setLoading));
    }
  }, [ruleData?.rule_id]);

  const handleSave = async () => {
    setLoading(true);
    try {
      await dispatch(updateBusinessRule(editedRule.rule_id, editedRule));
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating rule:', error);
    }
    setLoading(false);
  };

  return (
    <div className="bg-white">
      {/* Header */}
      <div className="border-b">
        <div className="px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={goBack}>
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to Rules
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            {isEditing ? (
              <Button onClick={handleSave} disabled={loading}>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            ) : (
              <Button onClick={() => setIsEditing(true)}>
                Edit Rule
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 md:p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Rule Details */}
          <Card>
            <CardHeader>
              <CardTitle>Rule Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Rule Name</label>
                <Input
                  value={editedRule.rule_name}
                  onChange={(e) => setEditedRule(prev => ({
                    ...prev,
                    rule_name: e.target.value
                  }))}
                  disabled={!isEditing}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={editedRule.description || ''}
                  onChange={(e) => setEditedRule(prev => ({
                    ...prev,
                    description: e.target.value
                  }))}
                  disabled={!isEditing}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Priority</label>
                  <Select
                    value={editedRule.priority}
                    onValueChange={(value) => setEditedRule(prev => ({
                      ...prev,
                      priority: parseInt(value)
                    }))}
                    disabled={!isEditing}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5].map((p) => (
                        <SelectItem key={p} value={p}>
                          Priority {p}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">Min Confidence</label>
                  <Input
                    type="number"
                    min="0"
                    max="1"
                    step="0.1"
                    value={editedRule.min_confidence_score}
                    onChange={(e) => setEditedRule(prev => ({
                      ...prev,
                      min_confidence_score: parseFloat(e.target.value)
                    }))}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div className="pt-4">
                <label className="text-sm font-medium">Metadata</label>
                <div className="mt-2 text-sm text-gray-500 space-y-1">
                  <p>Created by: {editedRule.created_by}</p>
                  <p>Last updated: {moment(editedRule.updated_date).format('MMM D, YYYY, h:mm:ss A')}</p>
                  {editedRule.updated_by && (
                    <p>Updated by: {editedRule.updated_by}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Rule Source */}
          <Card>
            <CardHeader>
              <CardTitle>Rule Source</CardTitle>
            </CardHeader>
            <CardContent>
              {editedRule.source_type === 'pdf' ? (
                <div className="border rounded-lg p-4 bg-gray-50">
                  <p className="text-sm text-gray-600 mb-2">PDF File:</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{editedRule.source_file}</span>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View PDF
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="border rounded-lg p-4 bg-gray-50">
                  <pre className="text-sm whitespace-pre-wrap">
                    {editedRule.source_code}
                  </pre>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Generated Rules */}
        <Card>
          <CardHeader>
            <CardTitle>Generated Rules</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={editedRule.prompt}
              onChange={(e) => setEditedRule(prev => ({
                ...prev,
                prompt: e.target.value
              }))}
              disabled={!isEditing}
              className="h-48"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BusinessRuleDetails;