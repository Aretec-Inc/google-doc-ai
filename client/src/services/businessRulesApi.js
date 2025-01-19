import { api } from './api';

export const getAllBusinessRules = async (params = {}) => {
  const { skip = 0, limit = 100, ruleset_id } = params;
  const queryParams = new URLSearchParams({ skip, limit });
  if (ruleset_id) queryParams.append('ruleset_id', ruleset_id);
  
  return api.get(`/api/v1/business-rules/?${queryParams}`);
};

export const getBusinessRule = async (ruleId) => {
  return api.get(`/api/v1/business-rules/${ruleId}`);
};

export const createBusinessRule = async (data) => {
  return api.post('/api/v1/business-rules/', data);
};

export const updateBusinessRule = async (ruleId, data) => {
  return api.put(`/api/v1/business-rules/${ruleId}`, data);
};

export const deleteBusinessRule = async (ruleId) => {
  return api.delete(`/api/v1/business-rules/${ruleId}`);
};