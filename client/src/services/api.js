const BASE_URL = '/api/v1';

export const DocumentService = {
  // Get list of document findings with optional filters
  async getDocumentFindings(params = { skip: 0, limit: 100, status: null }) {
    const queryParams = new URLSearchParams({
      skip: params.skip,
      limit: params.limit,
      ...(params.status && { status: params.status })
    });

    const response = await fetch(`${BASE_URL}/document-findings/?${queryParams}`);
    if (!response.ok) throw new Error('Failed to fetch document findings');
    return response.json();
  },

  // Get a specific document finding
  async getDocumentFinding(id) {
    const response = await fetch(`${BASE_URL}/document-findings/${id}`);
    if (!response.ok) throw new Error('Failed to fetch document finding');
    return response.json();
  },

  // Update document finding
  async updateDocumentFinding(id, data) {
    const response = await fetch(`${BASE_URL}/document-findings/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to update document finding');
    return response.json();
  }
};

export const FieldService = {
  // Get list of field findings
  async getFieldFindings(params = { skip: 0, limit: 100, status: null, rule_id: null }) {
    const queryParams = new URLSearchParams({
      skip: params.skip,
      limit: params.limit,
      ...(params.status && { status: params.status }),
      ...(params.rule_id && { rule_id: params.rule_id })
    });

    const response = await fetch(`${BASE_URL}/field-findings/?${queryParams}`);
    if (!response.ok) throw new Error('Failed to fetch field findings');
    return response.json();
  },

  // Get a specific field finding
  async getFieldFinding(id) {
    const response = await fetch(`${BASE_URL}/field-findings/${id}`);
    if (!response.ok) throw new Error('Failed to fetch field finding');
    return response.json();
  }
};

export const BusinessRuleService = {
  // Get list of business rules
  async getBusinessRules(params = { skip: 0, limit: 100, ruleset_id: null }) {
    const queryParams = new URLSearchParams({
      skip: params.skip,
      limit: params.limit,
      ...(params.ruleset_id && { ruleset_id: params.ruleset_id })
    });

    const response = await fetch(`${BASE_URL}/business-rules/?${queryParams}`);
    if (!response.ok) throw new Error('Failed to fetch business rules');
    return response.json();
  }
};