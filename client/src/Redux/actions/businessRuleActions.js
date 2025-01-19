// src/Redux/actions/businessRuleActions.js
import { BusinessRuleService } from '../../services/api';

export const GET_ALL_BUSINESS_RULES = 'GET_ALL_BUSINESS_RULES';
export const GET_BUSINESS_RULE = 'GET_BUSINESS_RULE';
export const CREATE_BUSINESS_RULE = 'CREATE_BUSINESS_RULE';
export const UPDATE_BUSINESS_RULE = 'UPDATE_BUSINESS_RULE';

export const getAllBusinessRules = (filters, setLoading) => {
  return async (dispatch) => {
    try {
      const { ruleName, rulesetId, pageSize, pageNo } = filters;
      const queryParams = new URLSearchParams({
        skip: (pageNo - 1) * pageSize,
        limit: pageSize
      });
      
      if (rulesetId) queryParams.append('ruleset_id', rulesetId);
      
      const response = await BusinessRuleService.getAll(queryParams.toString());
      
      dispatch({
        type: GET_ALL_BUSINESS_RULES,
        payload: {
          rules: response.data,
          totalRules: response.headers['x-total-count'] || response.data.length
        }
      });
    } catch (error) {
      console.error('Error fetching business rules:', error);
    } finally {
      setLoading && setLoading(false);
    }
  };
};

export const getBusinessRule = (ruleId, setLoading) => {
  return async (dispatch) => {
    try {
      const response = await BusinessRuleService.get(ruleId);
      dispatch({
        type: GET_BUSINESS_RULE,
        payload: response.data
      });
    } catch (error) {
      console.error('Error fetching business rule:', error);
    } finally {
      setLoading && setLoading(false);
    }
  };
};

export const createBusinessRule = (ruleData) => {
  return async (dispatch) => {
    try {
      const response = await BusinessRuleService.create(ruleData);
      dispatch({
        type: CREATE_BUSINESS_RULE,
        payload: response.data
      });
      return response.data;
    } catch (error) {
      console.error('Error creating business rule:', error);
      throw error;
    }
  };
};

export const updateBusinessRule = (ruleId, ruleData) => {
  return async (dispatch) => {
    try {
      const response = await BusinessRuleService.update(ruleId, ruleData);
      dispatch({
        type: UPDATE_BUSINESS_RULE,
        payload: response.data
      });
      return response.data;
    } catch (error) {
      console.error('Error updating business rule:', error);
      throw error;
    }
  };
};